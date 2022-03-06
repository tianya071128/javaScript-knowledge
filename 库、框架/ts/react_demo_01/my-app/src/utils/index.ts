/**
 * 根据参数拼接成唯一标识进行结果缓存
 * @param fn {Function} 缓存函数
 * @returns Function 封装后的函数
 */
export function cache<T>(fn: (...args: any[]) => T) {
  let cacheResult = new Map();
  // 封装缓存函数
  const f = function (...args: any[]): T {
    const id = args.join('_'); // 缓存标识符
    if (cacheResult.has(id)) {
      // 存在缓存结果
      return cacheResult.get(id);
    } else {
      const result = fn(...args);
      result !== undefined && cacheResult.set(id, result); // 存在结果才缓存
      return result;
    }
  };
  f._cache = cacheResult; // 暴露出去可以清除一些缓存信息 - 后备内容
  return f;
}
