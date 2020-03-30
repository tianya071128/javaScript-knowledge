/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-30 16:01:28
 */
/* @flow */

import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from "../util/index";

import modules from "./modules/index";
import directives from "./directives/index";
import { genStaticKeys } from "shared/util";
import { isUnaryTag, canBeLeftOpenTag } from "./util";

// 最终编译器 compiler 所需的配置 options
export const baseOptions: CompilerOptions = {
  expectHTML: true,
  // modules: [klass, style, model]
  /**
   * [
   *   {
   *     staticKeys: ['staticClass'],
   *     transformNode,
   *     genData
   *   },
   *   {
   *     staticKeys: ['staticStyle'],
   *     transformNode,
   *     genData
   *   },
   *   {
   *     preTransformNode
   *   }
   * ]
   */
  modules,
  // directives: { model: function() { ... }, text: function() { ... }, html: function() { ... } }
  directives,
  // isPreTag: Function, 其作用是通过给定的标签名字检查标签是否是 'pre' 标签。
  isPreTag,
  // isUnaryTag: 作用是检测给定的标签是否是一元标签
  isUnaryTag,
  // mustUseProp: Function, 作用是用来检测一个属性在标签中是否要使用 props 进行绑定。
  mustUseProp,
  // canBeLeftOpenTag: Function, 作用是检测一个标签是否是那些虽然不是一元标签，但却可以自己补全并闭合的标签
  canBeLeftOpenTag,
  // isReservedTag: Function, 作用是检查给定的标签是否是保留的标签。
  isReservedTag,
  // getTagNamespace: Function, 作用是获取元素(标签)的命名空间。
  getTagNamespace,
  // staticKeys: 作用是根据编译器选项的 modules 选项生成一个静态键字符串。
  staticKeys: genStaticKeys(modules)
};
