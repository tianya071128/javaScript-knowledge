/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2019-12-25 20:59:25
 * @LastEditTime: 2019-12-26 22:25:03
 */
"use strict";

var utils = require("./../utils");

/**
 * 转换请求或响应的数据
 *
 * @param {Object|String} data 要转换的数据
 * @param {Array} headers 请求或响应的头
 * @param {Array|Function} fns 单个函数或函数数组
 * @returns {*} 生成的转换数据
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    // `transformRequest` 允许在向服务器发送前，修改请求数据
    // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
    // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    /*
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理

        return data; // 返回 data, 然后数组后面的在接着进行修改
      }]
    */
    data = fn(data, headers);
  });

  return data;
};
