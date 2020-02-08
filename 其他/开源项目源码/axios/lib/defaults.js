/*
 * @Descripttion: 默认配置项
 * @Author: 温祖彪
 * @Date: 2019-12-18 21:29:18
 * @LastEditTime: 2019-12-26 22:36:32
 */
"use strict";

var utils = require("./utils");
var normalizeHeaderName = require("./helpers/normalizeHeaderName");

var DEFAULT_CONTENT_TYPE = {
  "Content-Type": "application/x-www-form-urlencoded"
};

// 设置请求头
function setContentTypeIfUnset(headers, value) {
  if (
    !utils.isUndefined(headers) &&
    utils.isUndefined(headers["Content-Type"])
  ) {
    headers["Content-Type"] = value;
  }
}

// 创建默认的 adapter 选项函数
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    // 浏览器环境中使用 XHR
    adapter = require("./adapters/xhr");
  } else if (
    typeof process !== "undefined" &&
    Object.prototype.toString.call(process) === "[object process]"
  ) {
    // node中使用 HTTP (node部分不分析源码)
    adapter = require("./adapters/http");
  }
  return adapter;
}

var defaults = {
  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  adapter: getDefaultAdapter(),

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法(因为 GET 方法传参方式固定, 就是在 URL 中传参)
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [
    function transformRequest(data, headers) {
      // 应该是设置请求头
      normalizeHeaderName(headers, "Accept");
      normalizeHeaderName(headers, "Content-Type");
      // 判断类型是否为下列一种
      if (
        utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      // 判断是否为 ArrayBuffer数据
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      // 判断是否为 URLSearchParams 对象(例如: new URLSearchParams([["foo", 1],["bar", 2]]))
      if (utils.isURLSearchParams(data)) {
        // 设置请求头 Content-Type: application/x-www-form-urlencoded;charset=utf-8
        setContentTypeIfUnset(
          headers,
          "application/x-www-form-urlencoded;charset=utf-8"
        );
        // data.toString() (new URLSearchParams([["foo", 1],["bar", 2]]).toString() => foo=1&bar=2)
        return data.toString();
      }
      // 判断是否为 Object
      if (utils.isObject(data)) {
        // 设置请求头 Content-Type: application/json;charset=utf-8
        setContentTypeIfUnset(headers, "application/json;charset=utf-8");
        return JSON.stringify(data);
      }
      return data;
    }
  ],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [
    function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === "string") {
        try {
          // 如果响应数据为字符串的话, 将其反序列化
          data = JSON.parse(data);
        } catch (e) {
          /* Ignore */
        }
      }
      return data;
    }
  ],

  /**
   * 中止请求的超时（毫秒）。如果设置为0（默认值）a
   * 未创建超时.
   */
  timeout: 0,
  // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称 -- 这两个选项不是很明白
  xsrfCookieName: "XSRF-TOKEN",
  // `xsrfHeaderName` 是承载 xsrf token 的值的 HTTP 头的名称 -- 这两个选项不是很明白
  xsrfHeaderName: "X-XSRF-TOKEN",

  // `maxContentLength` 定义允许的响应内容的最大尺寸(-1 应该为不限制, )
  maxContentLength: -1,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function validateStatus(status) {
    // 判断 status 状态码在 200(2系列) 时, promise 就会 resolve 否则 reject
    return status >= 200 && status < 300;
  }
};

// 默认 headers
defaults.headers = {
  common: {
    Accept: "application/json, text/plain, */*"
  }
};

utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;
