/*
 * @Descripttion: 测试 URL 是否为绝对 URL
 * @Author: sueRimn
 * @Date: 2019-12-27 12:17:22
 * @LastEditTime : 2019-12-30 14:27:35
 */
'use strict';

/**
 * 确定指定的 URL 是否是绝对的
 *
 * @param {string} url 要测试的 URL
 * @returns {boolean} True 如果指定的 URL 是绝对的，则为 false
 */
module.exports = function isAbsoluteURL(url) {
  // 如果URL以“<scheme>：//”或“//”（协议相对URL）开头，则认为它是绝对的.
  // RFC 3986将方案名称定义为以字母开头并后跟的字符序列
  // 通过字母、数字、加号、句号或连字符的任意组合.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};
