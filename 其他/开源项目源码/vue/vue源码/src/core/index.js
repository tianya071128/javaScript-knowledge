/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-23 21:44:50
 */
// 从 Vue 的出生文件导入 Vue
import Vue from "./instance/index";
import { initGlobalAPI } from "./global-api/index";
import { isServerRendering } from "core/util/env";
import { FunctionalRenderContext } from "core/vdom/create-functional-component";

// 将 Vue 构造函数作为参数, 传递给 initGlobalAPI 方法.
// 在 Vue 上添加一些全局的 API
initGlobalAPI(Vue);

// 在 Vue.prototype 上添加 $isServer 属性, 该属性代理了来自 core/util/env.js 文件的 isServerRendering 方法
Object.defineProperty(Vue.prototype, "$isServer", {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, "$ssrContext", {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, "FunctionalRenderContext", {
  value: FunctionalRenderContext
});

// Vue.version 存储了当前 Vue 的版本号, __VERSION__ 最终将会被 version 的值替换, rollup 的 replace 插件处理
Vue.version = "__VERSION__";

// 导出 Vue
export default Vue;
