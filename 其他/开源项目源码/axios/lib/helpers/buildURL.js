/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2019-12-27 12:17:22
 * @LastEditTime : 2019-12-30 14:35:29
 */
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * 通过在末尾附加参数来构建 URL
 *
 * @param {string} url url 的基础（例如，http://www.google.com）
 * @param {object} [params] 要附加的参数
 * @returns {string} 格式化的 url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  // 不需要序列化参数返回原url
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    // `paramsSerializer` 是一个负责 `params` 序列化的函数(如果存在的话, 直接调用方法)
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    // 确定值是否为 URLSearchParams 对象 -- 则直接调用 toString() 方法获取参数
    serializedParams = params.toString();
  } else {
    // 默认方法
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};
