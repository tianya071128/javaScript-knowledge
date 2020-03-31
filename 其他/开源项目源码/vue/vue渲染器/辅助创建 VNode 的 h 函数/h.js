/*
 * @Descripttion: 创建 VNode 的 h 函数
 * @Author: 温祖彪
 * @Date: 2020-03-31 15:02:45
 * @LastEditTime: 2020-03-31 22:27:29
 */

import { VNodeFlags } from "../设计VNode/VNodeFlags.js";
import { ChildrenFlags } from "../设计VNode/ChildrenFlags.js";

// 唯一标识 -- 用来区分 Fragment 类型
export const Fragment = Symbol();
// 唯一标识 -- 用来区分 Portal 类型
export const Portal = Symbol();

export function h(tag, data = null, children = null) {
  // 对于 flags 属性 -- 可以通过判断 tag 值来确定
  let flags, childFlags;

  // 获取 VNode 的 flags
  if (typeof tag === "string") {
    // 当 tag 为 string 时
    flags = tag === "svg" ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML;
    // 序列化 class
    if (data) {
      data.class = normalizeClass(data.class);
    }
  } else if (tag === Fragment) {
    // 当 tag 为 Fragment
    flags = VNodeFlags.FRAGMENT;
  } else if (tag === Portal) {
    // 当 tag 为 Portal
    flags = VNodeFlags.Portal;
    // 模板在经过编译后，我们把 target 数据存储在 VNodeData(即 data 选项中), 所以需要提取出来
    tag = data && data.target;
  } else {
    // 兼容 Vue2 的对象式组件
    if (tag !== null && typeof tag === "object") {
      flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL // 函数式组件
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL; // 有状态组件
    } else {
      // Vue3 的类组件
      flags =
        tag.prototype && tag.prototype.render
          ? VNodeFlags.COMPONENT_STATEFUL_NORMAL // 有状态组件
          : VNodeFlags.COMPONENT_FUNCTIONAL; // 函数式组件
    }
  }

  // 获取 VNode 的 childFlags -- 仅限于非组件类型的 VNode
  // 因为对于组件类型的 VNode 来说, 它并没有子节点, 所有子节点都应该作为 slots 存在
  if (Array.isArray(children)) {
    // children 为数组的情况, 根据数组长度来判断
    const { length } = children;
    if (length === 0) {
      // 没有 children
      childFlags = ChildrenFlags.NO_CHILDREN;
    } else if (length === 1) {
      // 单个子节点
      childFlags = ChildrenFlags.SINGLE_VNODE;
      children = children[0];
    } else {
      // 多个子节点, 且子节点使用 key
      childFlags = ChildrenFlags.KEYED_VNODES;
      // 多个子节点直接被当做使用了 key 的子节点,
      // 因为使用 normalizeVNodes 函数认为添加 key
      children = normalizeVNodes(children);
    }
  } else if (children == null) {
    // 没有子节点
    childFlags = ChildrenFlags.NO_CHILDREN;
  } else if (children._isVNode) {
    // 单个子节点(VNode)
    childFlags = ChildrenFlags.SINGLE_VNODE;
  } else {
    // 其他情况都作为文本节点处理, 即单个子节点, 会调用 createTextVNode 创建纯文本类型的 VNode
    childFlags = ChildrenFlags.SINGLE_VNODE;
    // 文本节点时, 创建一个纯文本类型的 VNode
    children = createTextVNode(children + "");
  }

  return {
    _isVNode: true,
    tag,
    data,
    children,
    flags,
    childFlags
  };
}

// 处理多节点, 添加 key
function normalizeVNodes(children) {
  const newChildren = [];

  // 遍历children
  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (child.key == null) {
      // 如果原来的 VNode 没有 key, 则使用竖线(|)与该 VNode 在数组中的索引拼接而成的字符串作为 key
      child.key = "|" + i;
    }
    newChildren.push(child);
  }
  // 返回新的 children,此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
  return newChildren;
}

// 创建纯文本类型的 VNode
function createTextVNode(text) {
  return {
    _isVNode: true,
    // flags 是 VNodeFlags.TEXT
    flags: VNodeFlags.TEXT,
    tag: null,
    data: null,
    // 纯文本类型的 VNode, 其 children 属性存储的是与之相符的文本内容
    children: text,
    // 文本节点没有子节点
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  };
}

// 序列化 class
function normalizeClass(classValue) {
  let res = "";
  // res 是最终要返回的类名字符串
  if (typeof classValue === "string") {
    res = classValue;
  } else if (Array.isArray(classValue)) {
    for (let i = 0; i < classValue.length; i++) {
      res += normalizeClass(classValue[i]) + " ";
    }
  } else if (typeof classValue === "object") {
    for (const name in classValue) {
      if (classValue[name]) {
        res += name + " ";
      }
    }
  }

  return res.trim();
}
