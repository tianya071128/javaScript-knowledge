/*
 * @Descripttion: 完整版(运行版 + compiler) 入口文件 -- 在运行时版的基础上添加 compiler
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-28 19:37:34
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

// 纯前端浏览器环境(完整版(运行版 + compiler)) 平台在这里调用 $mount 方法
// 缓存 Vue.prototype.$mount 方法
const mount = Vue.prototype.$mount;
// 重写 Vue.prototype.$mount 方法
// 为了给运行时版的 $mount 函数增加编译模板的能力
Vue.prototype.$mount = function(
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 获取挂载元素(挂载点)
  el = el && query(el);

  /* 挂载对象不能在 body 和 html 上 */
  // 挂载点的本意是 组件挂载的占位, 会被组件自身的模板替换掉, 而 body 和 html 元素是不能被替换掉的.
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function 解析模板/el并转换为呈现函数
  // 检测是否包含 render 选项, 即是否包含渲染函数.
  // 必须要有 render，最终都会编译为 render 方法
  if (!options.render) {
    // 使用 template 或 el 选项构建渲染函数
    let template = options.template;
    // 如果 template 选项存在
    if (template) {
      // template 的类型是字符串
      if (typeof template === "string") {
        // 如果第一个字符是 #，那么会把该字符串作为 css 选择符去选中对应的元素，并把该元素的 innerHTML 作为模板
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
        // template 的类型是元素节点(template.nodeType 存在)
      } else if (template.nodeType) {
        // 使用该元素的 innerHTML 作为模板
        template = template.innerHTML;
      } else {
        // template 既不是字符串又不是元素节点，那么在非生产环境会提示开发者传递的 template 选项无效
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      // 如果 template 选项不存在，那么使用 el 元素的 outerHTML 作为模板内容
      template = getOuterHTML(el);
    }
    // 经过以上逻辑的处理之后，理想状态下此时 template 变量应该是一个模板字符串，将来用于渲染函数的生成。

    if (template) {
      /* istanbul ignore if */
      // 追踪编译器性能
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      // compileToFunctions: 将模板字符串编译成渲染函数(render), 并将渲染函数添加到 vm.$options 选项中
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
