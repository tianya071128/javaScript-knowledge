/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2019-12-25 20:59:25
 * @LastEditTime: 2019-12-25 23:10:25
 */
"use strict";

/**
 * 用于调用函数和扩展参数数组的语法糖
 *
 * 常见的用例是 `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * 与 `spread` 这个例子可以重写.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};
