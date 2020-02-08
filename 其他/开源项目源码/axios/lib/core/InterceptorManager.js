/*
 * @Descripttion: 拦截器构造器
 * @Author: 温祖彪
 * @Date: 2019-12-25 20:59:25
 * @LastEditTime: 2019-12-26 21:46:05
 */
"use strict";

var utils = require("./../utils");

function InterceptorManager() {
  // 拦截器都存放在这里面
  this.handlers = [];
}

/**
 * 向堆栈中添加新的拦截器
 *
 * @param {Function} fulfilled 处理 `then` 以获得 `Promise` 的函数
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  // 这里说明了如何使一个函数返回 Promise ?
  /**
   * 将这个函数放入到自定义 Promise 的 then 中(catch也行, 但要确保 promise 是失败状态)
   * let promise = Promise.resolve(data);
   * promise.then(函数)
   */
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  // 返回一个标识, 用于取消拦截器作用(类似于定时器返回的)
  return this.handlers.length - 1;
};

/**
 * 从堆栈中移除拦截器
 *
 * @param {Number} id 由 `use` 返回的 ID
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    // 要保持 ID 的唯一性, 所以不直接删除数组中的值, 而是将其设置为 null
    this.handlers[id] = null;
  }
};

/**
 * 遍历所有注册的拦截器 -- 在原型上自定义 forEach 方法
 *
 * 此方法对于跳过任何
 * 拦截器，调用 `eject` 时可能变成 `null`。
 *
 * @param {Function} fn 为每个拦截器调用的函数
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    // 排除掉已经取消的拦截器
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;
