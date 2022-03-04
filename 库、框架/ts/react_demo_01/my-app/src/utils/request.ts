import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { message } from 'antd';
import { getLocalStore } from '@/utils/localStore';

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
  config?: AxiosRequestConfig
) {
  switch (code) {
    // case value:
    //   break;

    default:
      // 其余情况下，抛出错误
      message.error(msg);
      break;
  }
}

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getLocalStore('token');
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
      return response.data;
    } else {
      let errorObj: ErrorObj = {
        msg: response.data?.msg || '请求异常，请稍后重试',
        code: response.data?.code ?? -4,
      };

      // 登出以及其他情况 -- 错误处理
      resolveReuqestError(errorObj, response.config);
      return Promise.reject(errorObj);
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
    resolveReuqestError(errorObj, error?.config);
    return Promise.reject(errorObj);
  }
);

export default function request<T>(config: AxiosRequestConfig) {
  // ts 类型断言一下，我们最终结果只关注返回 data
  return service(config) as unknown as Promise<T>;
}
