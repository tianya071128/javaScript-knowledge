/*
 * @Descripttion: 自定义一个 bind 方法(跟函数的 bind 类似)
 * @Author: 温祖彪
 * @Date: 2019-12-25 20:59:25
 * @LastEditTime: 2019-12-25 22:50:47
 */
"use strict";

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
