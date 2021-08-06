/*
 * @Descripttion: 在 Vue 构造函数上添加全局的 API
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-23 22:33:29
 */
/* @flow */

import config from "../config";
import { initUse } from "./use";
import { initMixin } from "./mixin";
import { initExtend } from "./extend";
import { initAssetRegisters } from "./assets";
import { set, del } from "../observer/index";
import { ASSET_TYPES } from "shared/constants";
import builtInComponents from "../components/index";
import { observe } from "core/observer/index";

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from "../util/index";

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  // 在 Vue 构造函数上添加 config 属性, 一个只读属性
  const configDef = {};
  configDef.get = () => config;
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      );
    };
  }
  Object.defineProperty(Vue, "config", configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // Vue.util 以及 util 下的四个方法都不被认为是公共API的一部分，要避免依赖他们，但是你依然可以使用，只不过风险你要自己控制。
  // 在官方文档上并没有介绍这个全局 API
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  };

  // 在 Vue 上添加属性, 在 Vue.prototype 上也存在类似方法($set, $delete, $nextTick)
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = obj => {
    observe(obj);
    return obj;
  };

  // 向 Vue 上添加一个 options 属性
  Vue.options = Object.create(null);
  // ASSET_TYPES = [ 'component','directive','filter' ]
  ASSET_TYPES.forEach(type => {
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  /**
   * 执行完上面代码后, Vue.options 将变成这样:
   * Vue.options = {
   *   components: Object.create(null),
   *   directives: Object.create(null),
   *   filters: Object.create(null),
   *   _base: Vue
   * }
   */

  // extend 方法作用: 将 _from 对象的属性混合到 to 对象中
  // 将内置组件 KeepAlive 扩展到 Vue.options.components 上，
  extend(Vue.options.components, builtInComponents);

  /**
   * 执行完上面代码后, Vue.options 将变成这样:
   * Vue.options = {
   *   components: {
   *     KeepAlive
   *   },
   *   directives: Object.create(null),
   *   filters: Object.create(null),
   *   _base: Vue
   * }
   */

  // 调用四个 init* 方法, 向 Vue 构造函数上添加相关方法
  initUse(Vue);
  initMixin(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}
