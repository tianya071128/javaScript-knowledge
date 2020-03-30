/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-30 15:40:21
 */
/* @flow */

import { noop, extend } from "shared/util";
import { warn as baseWarn, tip } from "core/util/debug";
import { generateCodeFrame } from "./codeframe";

type CompiledFunctionResult = {
  render: Function,
  staticRenderFns: Array<Function>
};

// 将代码转换成函数, 并且收集可能发生的错误
function createFunction(code, errors) {
  try {
    return new Function(code);
  } catch (err) {
    errors.push({ err, code });
    return noop;
  }
}

/** 主要作用:
 *  1. 缓存编译结果，通过 createCompileToFunctionFn 函数内声明的 cache 常量实现。
 *  2. 调用 compile 函数将模板字符串转成渲染函数字符串
 *  3. 调用 createFunction 函数将渲染函数字符串转成真正的渲染函数
 *  4. 打印编译错误，包括：模板字符串 -> 渲染函数字符串 以及 渲染函数字符串 -> 渲染函数 这两个阶段的错误
 */
export function createCompileToFunctionFn(compile: Function): Function {
  // 缓存变量
  const cache = Object.create(null);

  return function compileToFunctions(
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    // 使用 extend 函数将 options 的属性混合到新的对象中并重新赋值 options
    options = extend({}, options);
    // 检查选项参数中是否包含 warn，如果没有则使用 baseWarn
    const warn = options.warn || baseWarn;
    // 将 options.warn 属性删除
    delete options.warn;

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production") {
      // detect possible CSP restriction 检测可能的 CSP(内容安全策略) 限制
      try {
        new Function("return 1");
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            "It seems you are using the standalone build of Vue.js in an " +
              "environment with Content Security Policy that prohibits unsafe-eval. " +
              "The template compiler cannot work in this environment. Consider " +
              "relaxing the policy to allow unsafe-eval or pre-compiling your " +
              "templates into render functions."
          );
        }
      }
    }

    // check cache 检查缓存
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    // 缓存字符串模板的编译结果，防止重复编译，提升性能
    if (cache[key]) {
      return cache[key];
    }

    // compile 编译
    // 真正的 模板字符串 到 渲染函数字符串 的编译工作实际上是通过调用 compile 函数来完成的
    const compiled = compile(template, options);

    // check compilation errors/tips 检查编译错误/提示
    if (process.env.NODE_ENV !== "production") {
      // compiled.errors 编译过程中的错误
      if (compiled.errors && compiled.errors.length) {
        if (options.outputSourceRange) {
          compiled.errors.forEach(e => {
            warn(
              `Error compiling template:\n\n${e.msg}\n\n` +
                generateCodeFrame(template, e.start, e.end),
              vm
            );
          });
        } else {
          warn(
            `Error compiling template:\n\n${template}\n\n` +
              compiled.errors.map(e => `- ${e}`).join("\n") +
              "\n",
            vm
          );
        }
      }
      // compiled.tips 编译过程中的提示
      if (compiled.tips && compiled.tips.length) {
        if (options.outputSourceRange) {
          compiled.tips.forEach(e => tip(e.msg, vm));
        } else {
          compiled.tips.forEach(msg => tip(msg, vm));
        }
      }
    }

    // turn code into functions 将代码转换为函数
    const res = {};
    const fnGenErrors = [];
    // 将 compiled.render 字符串转换为 render 函数
    res.render = createFunction(compiled.render, fnGenErrors);
    // staticRenderFns 的主要作用是渲染优化
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors);
    });

    // check function generation errors. 检查函数生成错误。
    // this should only happen if there is a bug in the compiler itself. 只有当编译器本身存在错误时才会发生这种情况。
    // mostly for codegen development use 主要用于codegen开发
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production") {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          `Failed to generate render function:\n\n` +
            fnGenErrors
              .map(({ err, code }) => `${err.toString()} in\n\n${code}\n`)
              .join("\n"),
          vm
        );
      }
    }

    // 返回编译结果的同时，将结果缓存，
    return (cache[key] = res);
  };
}
