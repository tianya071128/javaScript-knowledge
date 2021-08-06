/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2019-12-27 12:17:22
 * @LastEditTime : 2019-12-30 14:29:43
 */
'use strict';

/**
 * 通过组合指定的 URL 创建新的 URL
 *
 * @param {string} baseURL 基本 URL
 * @param {string} relativeURL 相对 URL
 * @returns {string} 组合的 URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};
