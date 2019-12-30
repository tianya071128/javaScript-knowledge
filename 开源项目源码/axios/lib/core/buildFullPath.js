'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * 通过组合 baseURL 和 requestedURL 创建新URL,
 * 仅当 requestedURL 不是绝对URL时.
 * 如果 requestURL 是绝对的，则此函数返回未触及的 requestedURL.
 *
 * @param {string} baseURL 基本 URL
 * @param {string} 要组合的绝对或相对 URL
 * @returns {string} 合并的完整路径
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};
