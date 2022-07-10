import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { Toast } from 'vant';
import { getToken } from './localStore';
import { resolveLoadin, signLogin } from '.';

/** ============  类型声明 start ========= */
export interface ErrorObj {
  msg: string; // 错误信息
  code: number | string; // 错误code
}

/** ============  类型声明 end ========= */

const service = axios.create({
  baseURL: '/v1', // baseURL
  timeout: 5000, // 5秒超时
  withCredentials: true, // 表示跨域请求时是否需要使用凭证
  headers: {
    'X-Requested-With': 'X-Requested-With',
  },
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
  switch (+code) {
    case 416:
      signLogin();
      break;

    default:
      // 其余情况下，抛出错误
      Toast.fail(msg);
      break;
  }

  return Promise.reject({ msg, code });
}

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers!['token'] = token;
    }

    if (config.isLoading) {
      // 此时需要 loading
      resolveLoadin(config.isLoading);
    }
    return config;
  },
  (error) => {
    if (error?.config?.isLoading) {
      // 此时需要 loading
      resolveLoadin();
    }

    // 传递错误
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.isLoading) {
      // 此时需要 loading
      resolveLoadin();
    }
    // code: 200 -- 成功
    // code: 100000 -- 未登录
    if (response.data?.resultCode === 200) {
      // 此时业务成功
      return response.data.data;
    } else {
      let errorObj: ErrorObj = {
        msg: response.data?.message || '请求异常，请稍后重试',
        code: response.data?.resultCode ?? -4,
      };

      // 隐藏业务层面报错
      if (response.config.hideBusinessError) return Promise.reject(errorObj);

      // 登出以及其他情况 -- 错误处理
      return resolveReuqestError(errorObj, response.config);
    }
  },
  (error) => {
    if (error?.config.isLoading) {
      // 此时需要 loading
      resolveLoadin();
    }
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
