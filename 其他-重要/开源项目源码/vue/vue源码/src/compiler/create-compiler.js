/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2021-03-05 16:46:47
 */
/* @flow */

import { extend } from "shared/util";
import { detectErrors } from "./error-detector";
import { createCompileToFunctionFn } from "./to-function";

export function createCompilerCreator(baseCompile: Function): Function {
  // createCompiler 函数作为 createCompilerCreator 函数的返回值
  return function createCompiler(baseOptions: CompilerOptions) {
    // 定义 compile 函数并返回
    /** 作用
     * 1. 生成最终编译器选项 finalOptions
     * 2. 对错误的收集
     * 3. 调用 baseCompile 编译模板
     */
    function compile(
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      // finalOptions 才是最终的编译选项参数 -- 引用了 baseOptions
      const finalOptions = Object.create(baseOptions);
      const errors = [];
      const tips = [];

      // 在编译过程中的错误和提示收集
      let warn = (msg, range, tip) => {
        (tip ? tips : errors).push(msg);
      };

      // 合并 options 到 finalOptions
      if (options) {
        // 重写 warn 方法
        if (
          process.env.NODE_ENV !== "production" &&
          options.outputSourceRange
        ) {
          // $flow-disable-line
          const leadingSpaceLength = template.match(/^\s*/)[0].length;

          warn = (msg, range, tip) => {
            const data: WarningMessage = { msg };
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength;
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength;
              }
            }
            (tip ? tips : errors).push(data);
          };
        }
        // merge custom modules 合并自定义模块
        if (options.modules) {
          finalOptions.modules = (baseOptions.modules || []).concat(
            options.modules
          );
        }
        // merge custom directives 合并自定义指令
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options 复制其他选项
        for (const key in options) {
          if (key !== "modules" && key !== "directives") {
            finalOptions[key] = options[key];
          }
        }
      }

      finalOptions.warn = warn;

      // compile 函数对模板的编译是委托 baseCompile 完成的。
      const compiled = baseCompile(template.trim(), finalOptions);
      // 作用是用来通过抽象语法树来检查模板中是否存在错误表达式的，通过 detectErrors 函数实现
      if (process.env.NODE_ENV !== "production") {
        detectErrors(compiled.ast, warn);
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled;
    }

    // compile 函数生成的是字符串形式的代码，而 compileToFunctions 生成的才是真正可执行的代码，
    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    };
  };
}
