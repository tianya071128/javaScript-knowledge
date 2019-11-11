## 前言

目前登录有很多用的是token机制, 因为安全性问题, 一般都会返回一个刷新token 和 使用的token, 还有过期时间, 可以根据过期时间, 当现有token失效时, 重新获取新的token

![token机制](./image/token机制.png 'token机制')

当token失效或即将失效时, 重新获取新的token, 但因为ajax是异步的, 请求新的token是需要一定时间, 此时若是有新的请求接口, 就会出现问题

在网上查询资料后, 一般有两种方法可以实现无痛刷新token机制: 

* 在请求拦截中, 拦截刷新token时, 将额外接口缓存, 刷新成功后在重新发送请求
* 在响应拦截中, 将额外接口缓存,  刷新成功后在重新发送请求

> **因为一开始找到的方法就是第二种, 所以直接使用第二种方法**
>
> **此方法有一个缺点: 就是缓存接口会请求二次, 消耗性能**

## 解决思路

基于axios的vue框架

大致思路: 

> * 判断token是否过期 以及 是否即将过期
>* 过期后, 发送刷新token请求, 并将刷新token期间请求的接口缓存起来
> * 请求成功后, 在重新请求之前的请求

## 方案

```javascript
// 创建axios实例
const service = axios.create({
    withCredentials: false, // 请求不带cookie
    baseURL: baseURL, // api 的 base_url
    timeout: timeout // 请求超时时间
});


// 请求拦截器没有做处理
service.interceptors.request.use(config => {
    ...
    return config
})

// 是否正在刷新的标记 -- 防止重复发出刷新token接口
let isRefreshing = false;
// 判断token是否失效: return: true为过期
function isOAverdue() {
	// 当离过期时间还有半小时时, 也判断为过期
    // getTokenItem('time'): 获取存入localStorage的过期时间
    return Math.floor((Date.now() - getTokenItme('time')) / 1000) + 30 * 60 > 
        getTokenItme('expires_in');
}
// 失效后同时发送请求的容器 -- 缓存接口
let subscribers = [];
// 刷新 token 后, 将缓存的接口重新请求一次
function onAccessTokenFetched(newToken) {
    subscribers.forEach((callback) => {
		callback(newToken);
    });
    // 清空缓存接口
    subscribers = [];
}
// 添加缓存接口
function addSubscriber(callback) {
    subscribers.push(callback);
}

// 响应拦截器
service.interceptors.response.use(
	response => {
        // 当response.data.re为401, 则判断token已经过期
        // /oauth/token为刷新token的接口, 需要排除掉 
    	if ((isOAverdue() || response.data.ret === 401) && !response.config.url.includes('/oauth/token')) {
      		if (!isRefreshing) {
        		isRefreshing = true;
                // 将刷新token的方法放在vuex中处理了, 可见下面区块代码
        		store.dispatch('refreshToken').then((res) => {
                    // 当刷新成功后, 重新发送缓存请求
          			onAccessTokenFetched(res);
        		}).catch(() => {
          			// 刷新token报错的话, 就需要跳转到登录页面
          			window.location = '/#/guide/login';
        		}).finally(() => {
          			isRefreshing = false;
        		});
      		}
      		// 将其他接口缓存起来 -- 这个Promise函数很关键
      		const retryOriginalRequest = new Promise((resolve) => {
                // 这里是将其他接口缓存起来的关键, 返回Promise并且让其状态一直为等待状态, 
                // 只有当token刷新成功后, 就会调用通过addSubscriber函数添加的缓存接口, 
                // 此时, Promise的状态就会变成resolve
        		addSubscriber((newToken) => {
          			// 表示用新的token去替换掉原来的token
          			response.config.headers.Authorization = `bearer ${newToken}`;
          			// 替换掉url -- 因为baseURL会扩展请求url
          			response.config.url = response.config.url.replace(response.config.baseURL, '');
                    // 用重新封装的config去请求, 就会将重新请求后的返回
          			resolve(service(response.config));
        		});
      		});
      		return retryOriginalRequest;
    	}
    	// ========================
        
    	// .... 省略其他代码.....
  	}
    
    // vuex中刷新token方法
    async refreshToken({ commit }) {
    	// getTokenItem('refresh_token): 获取刷新token
    	try {
    		let res = await refreshToken(getTokenItem('refresh_token));
      		const data = res.access_token;
      		newSetToken(res);
      		return data;
         } catch(e) {
            return '刷新token出错';
         }
    }
```

























