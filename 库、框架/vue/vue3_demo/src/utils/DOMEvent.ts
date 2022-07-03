import { throttle } from './index';

type ResizeFn = (w: number) => any;
interface ResizeOptions {
  // 立即执行一次
  immediate: boolean;
}

let resizeSet = new Set<ResizeFn>();
let eventHandle: () => void;

/**
 * 监听全局 resize 事件
 * @param fn 需要添加的监听回调
 * @param options 配置项
 * @returns
 */
export function onScroll(fn: ResizeFn, options?: ResizeOptions): () => void {
  if (resizeSet.size === 0) {
    // 初始化时，那么我们需要开始监听事件
    window.addEventListener(
      'scroll',
      (eventHandle = throttle(() => {
        resizeSet.forEach((fnVal) => fnVal(document.documentElement.scrollTop));
      }, 200))
    );
  }
  resizeSet.add(fn);

  // 立即执行一次
  if (options?.immediate) {
    fn(document.documentElement.scrollTop);
  }

  // 清除当前监听回调
  return () => {
    // 防止多次调用，只有存在监听回调时才会清除工作
    if (resizeSet.has(fn)) {
      resizeSet.delete(fn);
      if (resizeSet.size === 0) {
        // 当监听回调为空时，清除注册的 resize 的事件
        window.removeEventListener('resize', eventHandle);
      }
    }
  };
}
