# axios源码: 入口解析

## 前言

知识储备量不足, 慢慢尝试开源项目的源码分析学习, 难免会有所出错, 仅供个人学习使用.

## 目录树

从 git clone 项目后, 目录树结构(大致结构)

| -- dist

| -- examples

| -- lib

| -- sandbox

| -- test

| - webpack.config.js

| - index.js

...



## webpack.config.js: webpack配置文件

对于 webpack 只了解一点, 但可以找到入口文件'./index.js'

```javascript
var config = {
    // 入口文件
    entry: './index.js',
    output: {
      path: 'dist/',
      filename: name + '.js',
      sourceMapFilename: name + '.map',
      library: 'axios',
      libraryTarget: 'umd'
    },
    node: {
      process: false
    },
    devtool: 'source-map'
  };
```



## index.js: 入口文件

**该文件的内容非常简单**

```javascript
// 导入 ./lib/axios 文件 以及导出
// 使用 CommonJS 规范模块系统, 不太了解
module.exports = require('./lib/axios');
```



## ./lib/axios.js: 核心文件

```javascript
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

```

