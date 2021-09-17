/*
 * @Descripttion: 全局资源自动注册 - 指令, 过滤器, 组件
 * @Author: 温祖彪
 * @Date: 2021-09-17 11:31:32
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-17 11:34:19
 */
import Vue from 'vue';

// 全局资源
const modulesFiles = require.context('./', true, /index.js$/);

modulesFiles.keys().forEach(modules => {
  let value = modulesFiles(modules);
  value = value.default || value;

  Vue.use(value);
});
