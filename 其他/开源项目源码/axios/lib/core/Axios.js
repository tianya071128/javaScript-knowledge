/*
 * @Descripttion: Axios 实例构造器
 * @Author: 温祖彪
 * @Date: 2019-12-25 20:59:25
 * @LastEditTime: 2019-12-26 21:30:42
 */
"use strict";

var utils = require("./../utils");
var buildURL = require("../helpers/buildURL");
var InterceptorManager = require("./InterceptorManager");
var dispatchRequest = require("./dispatchRequest");
var mergeConfig = require("./mergeConfig");

/**
 * 创建 Axios 的新实例 -- Axios 构造函数
 *
 * @param {Object} instanceConfig 实例的默认配置
 */
function Axios(instanceConfig) {
  // 默认配置项(内部配置好的, 在 ../default.js 中统一配置)
  this.defaults = instanceConfig;

  this.interceptors = {
    // 创建请求拦截器实例
    request: new InterceptorManager(),
    // 创建响应拦截器实例
    response: new InterceptorManager()
  };
}

/**
 * 发出请求 -- 在 Axios 原型上添加方法
 *
 * @param {Object} config 此请求的特定配置（与this.defaults合并）
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API

  if (typeof config === "string") {
    /**
     * 当 config 为 string (此时为get, push, post等请求方法)
     * axios.request(config)
     * axios.get(url[, config])
     * axios.delete(url[, config])
     * axios.head(url[, config])
     * axios.post(url[, data[, config]])
     * axios.put(url[, data[, config]])
     * axios.patch(url[, data[, config]])
     */

    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }
  // 合并配置项, config 为传递参数, defaults为默认配置项, 优先级: config > defaults
  config = mergeConfig(this.defaults, config);

  // 设置 config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    // 默认为 get
    config.method = "get";
  }

  // 连接拦截器中间件 dispatchRequest: 默认的请求拦截器 -- 也是最后会调用的请求拦截器(在这里就会发送请求)
  var chain = [dispatchRequest, undefined];
  // 创建一个状态为 resolve 的 Promise , 参数为 config;
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(
    interceptor
  ) {
    // 开头添加两个元素(请求拦截器的完成状态调用函数, 或失败状态调用的函数) -- 将请求拦截器分为两个函数, 分别添加至 chain 数组中
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(
    interceptor
  ) {
    // 数组末尾添加两个元素(响应拦截器的完成状态调用函数, 或失败状态调用的函数) -- 将响应拦截器分为两个函数, 分别添加至 chain 数组中
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    // 利用了 promise 的递归展开特性以及会将 promise 的返回值自动转为 Promise, 这样就可以递归调用下去
    promise = promise.then(chain.shift(), chain.shift());
  }

  // 最后返回经过了所有用户自定义请求拦截器, 响应拦截器, 以及默认的请求拦截器(严格来讲, 应该也不算请求拦截器, 而是请求发送方法)
  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(
    /^\?/,
    ""
  );
};

// 为支持的请求方法提供别名
utils.forEach(
  ["delete", "get", "head", "options"],
  function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(
        utils.merge(config || {}, {
          method: method,
          url: url
        })
      );
    };
  }
);

// 为支持的请求方法提供别名
utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(
      utils.merge(config || {}, {
        method: method,
        url: url,
        data: data
      })
    );
  };
});

module.exports = Axios;
