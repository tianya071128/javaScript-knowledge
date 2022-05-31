import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { message } from 'antd';
import { getToken } from '@/utils/localStore';
import { signLogin } from '.';

/** ============  类型声明 start ========= */
interface ErrorObj {
  msg: string; // 错误信息
  code: number | string; // 错误code
}

/** ============  类型声明 end ========= */

const service = axios.create({
  baseURL: '/dev-api', // baseURL
  timeout: 5000, // 5秒超时
});

/**
 * 统一处理错误返回信息
 */
function resolveReuqestError(
  { msg, code }: ErrorObj,
  { hideError, customCode }: AxiosRequestConfig = {}
): Promise<never> {
  // 隐藏接口报错，但是还是要阻断后续执行 - tip：隐藏业务层面报错在下面就已经处理了
  if (hideError) return Promise.reject({ msg, code });

  // 自行处理的 code 列表，具体处理逻辑在外部
  if (customCode) {
    if (!Array.isArray(customCode)) customCode = [customCode];
    if (customCode.includes(String(code))) return Promise.reject({ msg, code });
  }

  // 根据 code 不同来执行不同的策略
  switch (code) {
    case 100000:
      /**
       * 登录失效，退出登录
       *  但是在组件外部调用 navigate 方法无法实现，应该使用变通方法：
       *    1. 使用Router自定义history即可: react-router-dom 内部会通过 history 库来实现的，我们自定义一下暴露出 history 即可 -- https://blog.csdn.net/qq1073830130/article/details/101017642
       *    2. 通过全局状态管理(此项目使用 recoil 进行状态管理): 在 APP.tsx 中使用这个状态, 通过改变状态值，就可以在 APP.tsx 中侦听在状态的改变从而触发跳转
       *    3. 通过发布订阅模式：在 APP.tsx 中侦听自定义事件，在需要跳转的地方触发这个自定义事件
       */
      signLogin(); // 触发 recoil 中的登录信息，就会触发 APP.tsx 重新渲染，触发跳转到登录页
      break;

    default:
      // 其余情况下，抛出错误
      message.error(msg);
      break;
  }

  return Promise.reject({ msg, code });
}

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers!['X-Token'] = token;
    }
    return config;
  },
  (error) => {
    // 传递错误
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    // code: 200 -- 成功
    // code: 100000 -- 未登录
    if (response.data?.code === 200) {
      // 此时业务成功
      return response.data.data;
    } else {
      let errorObj: ErrorObj = {
        msg: response.data?.msg || '请求异常，请稍后重试',
        code: response.data?.code ?? -4,
      };

      // 隐藏业务层面报错
      if (response.config.hideBusinessError) return Promise.reject(errorObj);

      // 登出以及其他情况 -- 错误处理
      return resolveReuqestError(errorObj, response.config);
    }
  },
  (error) => {
    let errorObj: ErrorObj = {
      msg: '',
      code: error?.request?.status,
    };

    // code
    switch (true) {
      case error?.request?.status === 404:
        errorObj.msg = '请求资源不存在，请联系管理员';
        break;
      case /^5\d\d$/.test(error?.request?.status):
        errorObj.msg = '服务器异常，请稍后重试';
        break;
      case error?.message?.includes('timeout') &&
        ['ETIMEDOUT', 'ECONNABORTED'].includes(error?.code):
        // 超时
        errorObj.msg = '请求超时，请稍后重试';
        errorObj.code = -1;
        break;
      case error?.message?.includes('aborted') &&
        error?.code === 'ECONNABORTED':
        // 请求取消
        errorObj.msg = '请求超时，请稍后重试';
        errorObj.code = -2;
        break;
      case error?.message === 'Network Error':
        // 网络错误 - 一般应在网络错误时触发
        errorObj.msg = '网络异常，请检查网络';
        errorObj.code = -3;
        break;
      default:
        errorObj.msg = error?.msg ?? '请求异常，请稍后重试';
        errorObj.code = errorObj.code ?? -4;
        break;
    }
    return resolveReuqestError(errorObj, error?.config);
  }
);

export default function request<T>(config: AxiosRequestConfig) {
  // ts 类型断言一下，我们最终结果只关注返回 data
  return service(config) as unknown as Promise<T>;
}
