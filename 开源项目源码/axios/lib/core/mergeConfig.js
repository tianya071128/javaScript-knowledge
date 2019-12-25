/*
 * @Descripttion: 合并配置对象
 * @Author: 温祖彪
 * @Date: 2019-12-25 20:59:25
 * @LastEditTime: 2019-12-25 21:52:49
 */
"use strict";

var utils = require("../utils");

/**
 * 创建新配置对象的特定于配置的合并函数
 * 通过将两个配置对象合并在一起。
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} 将config2合并到config1产生的新对象
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ["url", "method", "params", "data"];
  var mergeDeepPropertiesKeys = ["headers", "auth", "proxy"];
  var defaultToConfig2Keys = [
    "baseURL",
    "url",
    "transformRequest",
    "transformResponse",
    "paramsSerializer",
    "timeout",
    "withCredentials",
    "adapter",
    "responseType",
    "xsrfCookieName",
    "xsrfHeaderName",
    "onUploadProgress",
    "onDownloadProgress",
    "maxContentLength",
    "validateStatus",
    "maxRedirects",
    "httpAgent",
    "httpsAgent",
    "cancelToken",
    "socketPath"
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== "undefined") {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    // 先取 config2 的, 若是为 undefined 则取 config1 的
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== "undefined") {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== "undefined") {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== "undefined") {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== "undefined") {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object.keys(config2).filter(function filterAxiosKeys(key) {
    return axiosKeys.indexOf(key) === -1;
  });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== "undefined") {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== "undefined") {
      config[prop] = config1[prop];
    }
  });

  return config;
};
