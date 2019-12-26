/*
 * @Descripttion: 发送请求 -- 将其放在请求拦截器 和 响应拦截器 数组的中间值(这样, 先执行完所有请求拦截器, 在执行这个方法, 请求结束后, 在执行完所有的响应拦截器)
 * @Author: 温祖彪
 * @Date: 2019-12-25 20:59:25
 * @LastEditTime: 2019-12-26 22:34:33
 */
"use strict";

var utils = require("./../utils");
var transformData = require("./transformData");
var isCancel = require("../cancel/isCancel");
var defaults = require("../defaults");

/**
 * 如果已请求取消，则引发 `取消`.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * 使用配置的适配器向服务器发送请求.
 *
 * @param {object} config 用于请求的配置
 * @returns {Promise} 要履行的诺言
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // 确保 headers 存在
  config.headers = config.headers || {};

  // 转换请求数据
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // 展开 headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ["delete", "get", "head", "post", "put", "patch", "common"],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  // `adapter` 允许自定义处理请求，以使测试更轻松 -- 或者使用默认处理请求
  var adapter = config.adapter || defaults.adapter;

  // 在这一步首先处理响应数据
  // 请求大致过程:
  // 首先处理请求拦截器 --> 转化请求数据(只针对'PUT', 'POST' 和 'PATCH', 因为这些数据是放在请求体body中的)
  //  --> 发送请求(可以自定义, 更多是默认值) --> 转化响应 --> 处理响应拦截器 --> 返回处理后的结果(Promise)
  return adapter(config).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // 转换响应数据
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    },
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // 转换响应数据
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    }
  );
};
