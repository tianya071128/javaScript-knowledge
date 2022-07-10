import { removeToken } from './localStore';
import router from '../router';
import { AxiosRequestConfig } from 'axios';
import { useRequest } from '@/store';

export function signLogin() {
  removeToken();

  router.push({
    name: 'Login',
    replace: true,
    query: {
      from: router.currentRoute.value.path,
    },
  });
}

interface ThrottleOptions {
  /** 是否立即调用一次 */
  immediate?: boolean;
  /** 节流时间：ms */
  time: number;
}
/**
 * 节流
 * @param fn 需要节流函数
 * @param time 节流时间 ms
 * @param options 配置
 * @returns 节流处理后的函数
 */
export function throttle<T extends (...args: any) => any>(
  fn: T,
  options: number | ThrottleOptions = 300
) {
  if (typeof options === 'number') {
    options = {
      time: options,
    };
  }

  let flag = false; // 限制执行阀门
  let time = options.time;
  // 立即调用一次
  if (options.immediate) {
    fn();
  }

  return (...args: Parameters<T>) => {
    const params = args; // 获取最新的参数
    if (flag) return;
    flag = true;
    setTimeout(() => {
      flag = false;
      // fn(...params); ？？？ 为什么会报错 -- 类型“Parameters<T>”必须具有返回迭代器的 "[Symbol.iterator]()" 方法。
      fn(...(params as any[]));
    }, time);
  };
}

/**
 * 添加地址前缀
 * @param url url
 * @returns 拼接后的地址
 */
export function prefixUrl(url: string) {
  if (url && url.startsWith('http')) {
    return url;
  } else {
    url = `http://backend-api-01.newbee.ltd${url}`;
    return url;
  }
}

/**
 * 处理全局 loading
 * @param loading loading 标识
 */
export function resolveLoadin(loading?: AxiosRequestConfig['isLoading']) {
  const requestStore = useRequest();
  if (typeof loading === 'boolean') {
    requestStore.updatedLoading(1);
    requestStore.updatedLoadingText('加载中...');
  } else if (typeof loading === 'string') {
    requestStore.updatedLoading(1);
    requestStore.updatedLoadingText(loading);
  } else if (loading == undefined) {
    requestStore.updatedLoading(-1);
  } else {
    // 用于校验其他类型
    const check: never = loading;
  }
}
