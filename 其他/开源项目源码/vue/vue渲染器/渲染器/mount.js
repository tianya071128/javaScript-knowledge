/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-31 20:57:35
 * @LastEditTime: 2020-03-31 22:36:40
 */
import { VNodeFlags } from "../设计VNode/VNodeFlags.js";
import { ChildrenFlags } from "../设计VNode/ChildrenFlags.js";

/** 根据 VNode 的 flags 属性值能够区分一个 VNode 对象的类型
 * VNode 类型:  html/svg 标签        组件               纯文本         Fragment       Portal
 *                 |                  |                 |                |             |
 * 挂载函数:   mountElement      mountComponent   mountComponent   mountFragment   mountPortal
 */

// 挂载全新的 VNode, 把 VNode 渲染成真实 DOM
export function mount(vnode, container, isSVG) {
  const { flags } = vnode;
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG);
  } else if (flags & VNodeFlags.COMPONENT) {
    // 挂载组件
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载纯文本
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
  }
}

// 挂载普通标签
// 透传 isSVG 参数, 因为svg 的书写总是以 <svg> 标签开始的，所有其他 svg 相关的标签都是 <svg> 标签的子代元素
// 透传 isSVG 目的, 即使 <circle/> 标签对应的 vnode.flags 不是 VNodeFlags.ELEMENT_SVG，但在 mountElement 函数看来它依然是 svg 标签。
function mountElement(vnode, container, isSVG) {
  // 处理 SVG 标签
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG;
  const el = isSVG
    ? document.createElementNS("http://www.w3.org/2000/svg", vnode.tag)
    : document.createElement(vnode.tag);
  // VNode 被渲染为真实 DOM 之后, 引用真实 DOM 元素
  vnode.el = el;

  // 将 VNodeData 应用到元素上
  mountElementAttr(vnode, el, isSVG);

  // 递归挂载子节点
  // 拿到 children 和 childFlags
  const { children, childFlags } = vnode;
  // 检测如果没有子节点则无需递归挂载
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 如果是单个子节点则调用 mount 函数挂载
      // 这里需要把 isSVG 传递下去
      mount(children, el, isSVG);
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      // 如果是多个子节点则遍历并调用 mount 函数挂载
      for (let i = 0; i < children.length; i++) {
        // 这里需要把 isSVG 传递下去
        mount(children[i], el, isSVG);
      }
    }
  }

  container.appendChild(el);
}

// 需要当做 DOM Prop 处理的属性
const DOMPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/;
// 将 VNodeData 应用到元素上
function mountElementAttr(vnode, el, isSVG) {
  // 拿到 VNodeData
  const data = vnode.data;
  if (data) {
    // 如果 VNodeData 存在, 则遍历之.
    for (let key in data) {
      // key 可能是 class、style、on 等等
      switch (key) {
        case "style":
          // 如果 key 的值是 style, 说明是内联样式, 逐个将样式规则应用到 el
          for (let k in data.style) {
            el.style[k] = data.style[k];
          }
          break;
        case "class":
          // 判断是否为 SVG 标签
          if (isSVG) {
            el.setAttribute("class", data[key]);
          } else {
            el.className = data[key];
          }
        default:
          if (key[0] === "o" && key[1] === "n") {
            // 事件
            el.addEventListener(key.slice(2), data[key]);
          } else if (DOMPropsRE.test(key)) {
            // 当作 DOM Prop 处理
            el[key] = data[key];
          } else {
            // 当作 Attr 处理
            el.setAttribute(key, data[key]);
          }
          break;
      }
    }
  }
}
