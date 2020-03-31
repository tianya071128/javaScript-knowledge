/*
 * @Descripttion:
 * @Author: sueRimn
 * @Date: 2020-03-31 16:05:29
 * @LastEditTime: 2020-03-31 16:32:10
 */
import { h, Fragment, Portal } from './辅助创建 VNode 的 h 函数/h.js';
import { Component } from './辅助创建 VNode 的 h 函数/component.js'

// 元素 VNode -- children: 单个 VNode
const elementVNode = h('div', null, h('span'));
console.log(elementVNode);

// 元素 VNode -- children: 单个文本节点
const elementWithTextVNode = h('div', null, '我是文本');
console.log(elementWithTextVNode)

// Fragment -- children: 多个 VNode
const fragmentVNode = h(Fragment, null, [h('h1'), h('h1')]);
console.log(fragmentVNode);

// Portal
const portalVNode = h(
  Portal,
  {
    target: '#box'
  },
  h('h1'))
console.log(portalVNode);

// 函数式组件
function MyFunctionalComponent() { };
// 传递给 h 函数的第一个参数就是组件函数本身
const functionalComponentVNode = h(MyFunctionalComponent, null, h('div'));
console.log(functionalComponentVNode);

// 有状态组件
class MyStatefulComponent extends Component { };
const statefulComponentVNode = h(MyStatefulComponent, null, h('div'));
console.log(statefulComponentVNode);