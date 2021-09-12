/*
 * @Descripttion: 工具函数， 全局注入到 app.content 中， 这样在每个中间件中都可以使用
 * @Author: 温祖彪
 * @Date: 2021-09-12 11:24:58
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-12 12:05:00
 */
const assert = require('assert'); // 断言 - 内置模块

const throwError = (code, message) => {
  const err = new Error(message);
  err.code = code;
  throw err;
};

module.exports = {
  assert,
  throwError
};
