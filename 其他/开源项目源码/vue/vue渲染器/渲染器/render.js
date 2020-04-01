/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-31 20:42:56
 * @LastEditTime: 2020-04-01 16:30:44
 */

import { mount } from "./mount.js";
import { patch } from "../patch/patch.js";

/**
 * 渲染器的工作流程分为两个阶段：mount 和 patch
 * 如果旧的 VNode 存在，则会使用新的 VNode 与旧的 VNode 进行对比，试图以最小的资源开销完成 DOM 的更新，这个过程就叫 patch，或“打补丁”。
 * 如果旧的 VNode 不存在，则直接将新的 VNode 挂载成全新的 DOM，这个过程叫做 mount。
 */
/** 渲染器负责工作
 * 1. 将 VNode 渲染成真实 DOM 的工具
 * 2. 控制部分组件生命周期钩子的调用: 在整个渲染周期中包含了大量的 DOM 操作、组件的挂载、卸载，控制着组件的生命周期钩子调用的时机。
 * 3. 多端渲染的桥梁: 渲染器也是多端渲染的桥梁, 自定义渲染器的本质就是把特定平台操作 "DOM" 的方法从核心算法中抽离, 并提供可配置的方案.
 * 4. 与异步渲染有直接关系: Vue3 的异步渲染是基于调度器的实现，若要实现异步渲染，组件的挂载就不能同步进行，DOM的变更就要在合适的时机，一些需要在真实DOM存在之后才能执行的操作(如 ref)也应该在合适的时机进行。对于时机的控制是由调度器来完成的，但类似于组件的挂载与卸载以及操作 DOM 等行为的入队还是由渲染器来完成的，这也是为什么 Vue2 无法轻易实现异步渲染的原因。
 * 5. 包含最核心的 Diff 算法: Diff 算法是渲染器的核心特性之一, 可以说正式 Diff 算法的存在才使得 Virtual DOM 如此成功
 *
 */

// vnode: 需要渲染的 VNode 对象
// container: 挂载点
export function render(vnode, container) {
  const prevVNode = container.vnode;
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode, 只有新的 VNode. 使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container);
      // 将新的 VNode 添加到 container.vnode 属性下,这样下一次渲染时旧的 VNode 就存在了.
      container.vnode = vnode;
    }
  } else {
    if (vnode) {
      // 有旧的 VNode,也有新的 VNode. 则调用 `patch` 函数打补丁.
      patch(prevVNode, vnode, container);
      // 更新 container.vnode
      container.vnode = vnode;
    } else {
      // 有旧的 VNode 但是没有新的 VNode, 这说明应该移除 DOM, 在浏览器中可以使用 removeChild 函数
      container.removeChild(prevVNode.el);
      container.vnode = null;
    }
  }
}
