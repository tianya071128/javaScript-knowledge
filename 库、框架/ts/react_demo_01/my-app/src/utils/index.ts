import { user_info_recoil } from '@/store/user';
import { setRecoil } from 'recoil-nexus';
import { removeToken, removeUserInfo } from './localStore';

/**
 * 根据参数拼接成唯一标识进行结果缓存
 * @param fn {Function} 缓存函数
 * @returns Function 封装后的函数
 */
export function cache<T extends (...args: any) => any>(fn: T) {
  let cacheResult = new Map<string, any>();
  // 封装缓存函数
  const f = function (...args: Parameters<T>): ReturnType<T> {
    const identifier = [...args].join('_'); // 缓存标识符 -- 简单标识
    if (cacheResult.has(identifier)) {
      // 存在缓存结果
      return cacheResult.get(identifier);
    } else {
      const result = fn(...args);
      result !== undefined && cacheResult.set(identifier, result); // 存在结果才缓存
      return result;
    }
  };
  f._cache = cacheResult; // 暴露出去可以清除一些缓存信息 - 后备内容
  return f;
}

/**
 * 退出登录
 */
export function signLogin() {
  removeToken();
  removeUserInfo();

  // 改变 recoil 中的值
  setRecoil(user_info_recoil, null);
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
      fn(...params);
    }, time);
  };
}
