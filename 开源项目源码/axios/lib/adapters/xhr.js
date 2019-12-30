/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2019-12-27 12:17:22
 * @LastEditTime : 2019-12-30 15:50:16
 */
/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2019-12-27 12:17:22
 * @LastEditTime : 2019-12-30 14:57:18
 */
/*
 * @Descripttion: 发送请求的文件
 * @Author: 温祖彪
 * @Date: 2019-12-25 20:59:25
 * @LastEditTime : 2019-12-30 14:20:37
 */
"use strict";

var utils = require("./../utils");
var settle = require("./../core/settle");
var buildURL = require("./../helpers/buildURL");
var buildFullPath = require("../core/buildFullPath");
var parseHeaders = require("./../helpers/parseHeaders");
var isURLSameOrigin = require("./../helpers/isURLSameOrigin");
var createError = require("../core/createError");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    //此时：
    //- config已与默认值合并
    //- 请求转化器已运行
    //- 请求拦截器已运行
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders["Content-Type"]; // 让浏览器设置它
    }

    var request = new XMLHttpRequest();

    // HTTP 基本身份验证
    if (config.auth) {
      var username = config.auth.username || "";
      var password = config.auth.password || "";
      requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(
      config.method.toUpperCase(),
      // 将 params 参数拼接到 url 上, 不需要判断请求方法(post 方法也可以通过 URL 传参)
      buildURL(fullPath, config.params, config.paramsSerializer),
      true
    );

    // 设置请求超时（毫秒）
    request.timeout = config.timeout;

    // 监听就绪状态
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // 请求出错，我们没有得到响应，这将是
      // 由 onerror 处理
      // 除了一个例外：请求使用file:protocol，大多数浏览器
      // 即使请求成功，也将返回 0 状态
      if (
        request.status === 0 &&
        !(request.responseURL && request.responseURL.indexOf("file:") === 0)
      ) {
        return;
      }

      // 准备回应
      // 获取所有请求头
      var responseHeaders =
        "getAllResponseHeaders" in request
          ? parseHeaders(request.getAllResponseHeaders())
          : null;

      var responseData =
        !config.responseType || config.responseType === "text"
          ? request.responseText
          : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      // 在这里根据 response.status 响应状态码来 promise 的状态(resolve, reject);
      // 根据配置项(`validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte)
      // 或者默认函数(../core/settle.js)
      settle(resolve, reject, response);

      // 清理请求
      request = null;
    };

    // 处理浏览器请求取消（与手动取消相反）
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      // 发出错误信息
      reject(createError("Request aborted", config, "ECONNABORTED", request));

      // 清理请求
      request = null;
    };

    // 处理低级网络错误
    request.onerror = function handleError() {
      // 真正的错误被浏览器隐藏起来
      // onerror 只有在网络错误时才应该启动
      reject(createError("Network Error", config, null, request));

      // 清理请求
      request = null;
    };

    // 请求超时
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = "timeout of " + config.timeout + "ms exceeded";
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, "ECONNABORTED", request));

      // 清理请求
      request = null;
    };

    // 添加 xsrf 头
    // 只有在标准浏览器环境中运行时，才能执行此操作.
    // 特别是如果我们是一个 web 工作者，或者是react native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require("./../helpers/cookies");

      // 添加 xsrf 头
      var xsrfValue =
        // `withCredentials` 表示跨域请求时是否需要使用凭证
        // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
        (config.withCredentials || isURLSameOrigin(fullPath)) &&
          config.xsrfCookieName
          ? cookies.read(config.xsrfCookieName)
          : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // 向请求添加 headers
    if ("setRequestHeader" in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (
          typeof requestData === "undefined" &&
          key.toLowerCase() === "content-type"
        ) {
          // 如果数据未定义，则删除内容类型
          delete requestHeaders[key];
        } else {
          // 否则将 header 添加到请求
          request.setRequestHeader(key, val);
        }
      });
    }

    // 根据需要添加凭据以请求 -- 处理跨域是否携带 cookie 问题
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    // 如果需要，将 responseType 添加到请求
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // 浏览器抛出的预期 DOMException 与 XMLHttpRequest Level 2不兼容.
        // 但是，对于 json 类型，这可以被禁止，因为它可以由默认的 transformResponse 函数解析.
        if (config.responseType !== "json") {
          throw e;
        }
      }
    }

    // 必要时处理进度
    // `onDownloadProgress` 允许为下载处理进度事件
    if (typeof config.onDownloadProgress === "function") {
      request.addEventListener("progress", config.onDownloadProgress);
    }

    // 并非所有浏览器都支持上传事件
    // `onUploadProgress` 允许为上传处理进度事件
    if (typeof config.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", config.onUploadProgress);
    }

    // `cancelToken` 指定用于取消请求的 cancel token
    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};
