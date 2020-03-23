/*
 * @Descripttion: 完整版(运行版 + compiler) 入口文件 -- 在运行时版的基础上添加 compiler
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-23 22:50:20
 */
/* @flow */

import config from "core/config";
import { warn, cached } from "core/util/index";
import { mark, measure } from "core/util/perf";

import Vue from "./runtime/index";
import { query } from "./util/index";
// 导入 compiler 功能函数 compileToFunctions
import { compileToFunctions } from "./compiler/index";
import {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref
} from "./util/compat";

// 根据 id 获取元素的 innerHTML
const idToTemplate = cached(id => {
  const el = query(id);
  return el && el.innerHTML;
});

// 纯前端浏览器环境 平台在这里调用 $mount 方法
// 缓存 Vue.prototype.$mount 方法
const mount = Vue.prototype.$mount;
// 重写 Vue.prototype.$mount 方法
Vue.prototype.$mount = function(
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 获取挂载元素
  el = el && query(el);

  /* 挂载对象不能在 body 和 html 上 */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  const options = this.$options;
  // 必须要有 render，最终都会编译为 render 方法
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
        },
        this
      );
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  return mount.call(this, el, hydrating);
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
// 获取元素的 outerHTML
function getOuterHTML(el: Element): string {
  // outerHTML: 获取描述元素（包括其后代）的序列化HTML片段。
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    // 不支持 outerHTML 时, 兼容写法
    const container = document.createElement("div");
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

// 在 Vue 上添加一个全局 API , 也就是 compile 方法
Vue.compile = compileToFunctions;

export default Vue;
