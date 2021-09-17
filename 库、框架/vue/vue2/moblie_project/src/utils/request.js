/*
 * @Descripttion: axios 配置
 * @Author: 温祖彪
 * @Date: 2021-09-17 10:28:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-17 11:23:15
 */
import axios from 'axios';
import store from '@/store';
import { ADD_LOADING, DELETE_LOADING } from '@/store/mutationTypes';

const request = axios.create({
  baseURL: '/',
  timeout: 60000, // 超时时间 60s
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 判断该交易是否需要处理 loading
    if (config?.loading) {
      store.commit(ADD_LOADING);
    }
    // 在测试环境打印一下相关参数
    if (process.env.VUE_APP_TEST === 'test') {
      console.log('请求参数', config.url, config.params, config.data, config);
    }
    return config;
  },
  error => {
    // 经过测试, 这里一般不会经过, 因为在 axios 内部是通过 promise.then(成功回调, 失败回调注册的), 所以即使在成功回调中出错了, 也不会传递到这里来, 只会传递到下一个处理失败态的回调
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // console.log('成功回调', response);
    // 判断该交易是否需要处理 loading
    if (response?.config?.loading) {
      store.commit(DELETE_LOADING);
    }
    console.log(response);
  },
  error => {
    // console.log('失败回调', error);
    // console.dir(error);
    // 判断是否需要 loading
    if (error?.config?.loading) {
      store.commit(DELETE_LOADING);
    }
    return Promise.reject(error);
  }
);

export default request;
