/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-30 16:43:53
 */
/* @flow */

import { parse } from "./parser/index";
import { optimize } from "./optimizer";
import { generate } from "./codegen/index";
import { createCompilerCreator } from "./create-compiler";

// `createCompilerCreator` allows creating compilers that use alternative `createCompilerCreator`允许创建使用替代
// parser/optimizer/codegen, e.g the SSR optimizing compiler. 解析器/优化器/代码生成器，例如SSR优化编译器。
// Here we just export a default compiler using the default parts. 在这里，我们只是使用默认部分导出默认编译器。
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 调用 parse 函数将字符串模板解析成抽象语法树(AST)
  const ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    // 调用 optimize 函数优化 ast
    optimize(ast, options);
  }
  // 调用 generate 函数将 ast 编译成渲染函数
  const code = generate(ast, options);
  // 返回 抽象语法树(ast)，渲染函数(render)，静态渲染函数(staticRenderFns)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
});
