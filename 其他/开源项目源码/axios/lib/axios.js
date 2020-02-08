/*
 * @Descripttion: 核心文件
 * @Author: 温祖彪
 * @Date: 2019-12-18 21:29:18
 * @LastEditTime: 2019-12-25 23:11:28
 */
"use strict";

var utils = require("./utils");
var bind = require("./helpers/bind");
var Axios = require("./core/Axios");
var mergeConfig = require("./core/mergeConfig");
var defaults = require("./defaults");

/**
 * 创建 axios 的实例
 *
 * @param {Object} defaultConfig 实例的默认配置
 * @return {Axios} axios 的一个新实例
 */
function createInstance(defaultConfig) {
  // 创建一个 Axios 实例
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // 复制 Axios.prototype 到 instance
  utils.extend(instance, Axios.prototype, context);

  // 将 context 复制到 instance
  utils.extend(instance, context);

  return instance;
}

// 创建要导出的默认实例
// {defaults}: 默认配置项(优先级最低)
var axios = createInstance(defaults);

// 公开 Axios 类以允许类继承(通过 create 创建的实例是不存在 Axios 属性的)
axios.Axios = Axios;

// 用于创建新实例的工厂 -- 相当于 重新走了上面流程
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// 公开 Cancel & CancelToken(通过 create 创建的实例是不存在以下几个方法的)
axios.Cancel = require("./cancel/Cancel");
axios.CancelToken = require("./cancel/CancelToken");
axios.isCancel = require("./cancel/isCancel");

// 暴露 all/spread 方法
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require("./helpers/spread");

module.exports = axios;

// 允许在 TypeScript 中使用默认导入语法
module.exports.default = axios;
