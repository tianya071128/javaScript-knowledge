/**
 * 1. setImmediate(callback[, ...args]) -> 会在下一轮事件循环中执行(与 promise 不同, 还是属于宏任务)
 *    * callback: 执行回调
 *    * ...args: 传递给回调的可选参数
 *
 *    返回: Immediate 类, 可用于取消定时器, 或者做一些其他操作
 */
const immediate = setImmediate(() => {
  console.log("111");
});
console.log(immediate); // 返回的是 Immediate 类
clearImmediate(immediate); // 使用 clearImmediate 取消定时器

/**
 * 2. setInterval(callback[, delay[, ...args]]) 和 setTimeout(callback[, delay[, ...args]])
 *    * callback: 回调
 *    * delay: 延迟时间 -> 默认为 1, 取值范围为: 1 ~ 2147483647, 其他值则取默认值, 非整数截断为整数
 *    * ...args: 传递给回调的可选参数
 *
 *    返回: Timeout 类, 可用于取消定时器, 或者做一些其他操作
 */
const interval = setInterval(() => {
  console.log("222");
}, 2000);
console.log(interval); // 返回的是 Timeout 类
