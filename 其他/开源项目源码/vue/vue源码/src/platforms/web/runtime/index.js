/*
 * @Descripttion: 对 Vue 进行平台化地包装:
 *  1. 设置平台化的 Vue.config.
 *  2. 在 Vue.options 上混合了两个指令(directives)，分别是 model 和 show
 *  3. 在 Vue.options 上混合了两个组件(components)，分别是 Transition 和 TransitionGroup。
 *  4. 在 Vue.prototype 上添加了两个方法：__patch__ 和 $mount。
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-28 19:13:04
 */
/* @flow */

import Vue from "core/index";
import config from "core/config";
import { extend, noop } from "shared/util";
import { mountComponent } from "core/instance/lifecycle";
import { devtools, inBrowser } from "core/util/index";

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from "web/util/index";

import { patch } from "./patch";
import platformDirectives from "./directives/index";
import platformComponents from "./components/index";

// install platform specific utils
// 这个配置是与平台有关的，很可能会被覆盖掉。
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
// 安装特定平台运行时的指令和组件. -- 添加在 Vue.options 属性上
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);
/**
 * 执行完上面代码后, Vue.options 将变成这样:
 * Vue.options = {
 *   components: {
 *     KeepAlive,
 *     Transtion,
 *     TransitionGroup
 *   },
 *   directives: {
 *     model,
 *     show
 *   },
 *   filters: Object.create(null),
 *   _base: Vue,
 * }
 */

// install platform patch function
// 区分是否是服务端渲染。在服务端渲染是不需要生成 DOM 的，因此是一个空函数
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method 公共装载方法
Vue.prototype.$mount = function(
  el?: string | Element,
  hydrating?: boolean
): Component {
  // inBrowser: 宿主环境是否是浏览器
  // query(el): 用来根据给定的参数在 DOM 中查找对应的元素并返回.
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit("init", Vue);
      } else if (
        process.env.NODE_ENV !== "production" &&
        process.env.NODE_ENV !== "test"
      ) {
        console[console.info ? "info" : "log"](
          "Download the Vue Devtools extension for a better development experience:\n" +
            "https://github.com/vuejs/vue-devtools"
        );
      }
    }
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NODE_ENV !== "test" &&
      config.productionTip !== false &&
      typeof console !== "undefined"
    ) {
      console[console.info ? "info" : "log"](
        `You are running Vue in development mode.\n` +
          `Make sure to turn on production mode when deploying for production.\n` +
          `See more tips at https://vuejs.org/guide/deployment.html`
      );
    }
  }, 0);
}

export default Vue;
