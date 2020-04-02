/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-31 20:57:35
 * @LastEditTime: 2020-04-02 17:15:22
 */
import { VNodeFlags } from "../设计VNode/VNodeFlags.js";
import { ChildrenFlags } from "../设计VNode/ChildrenFlags.js";
import { createTextVNode } from "../辅助创建 VNode 的 h 函数/h.js";
import { patchData } from "../util/patchData.js";
import { patch } from "../patch/patch.js";

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
    mountComponent(vnode, container, isSVG);
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载纯文本
    mountText(vnode, container);
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container, isSVG);
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container, isSVG);
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

// 将 VNodeData 应用到元素上
function mountElementAttr(vnode, el, isSVG) {
  // 拿到 VNodeData
  const data = vnode.data;
  if (data) {
    // 如果 VNodeData 存在, 则遍历之.
    for (let key in data) {
      patchData(el, key, null, data[key]);
    }
  }
}

// 挂载文本节点
function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children);
  vnode.el = el;
  container.appendChild(el);
}

// 挂载 Fragment -- 等价于只挂载一个 VNode 的 children
function mountFragment(vnode, container, isSVG) {
  // 拿到 children 和 childFlags
  const { children, childFlags } = vnode;
  switch (childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      // 如果是单个子节点, 则直接调用 mount
      mount(children, container, isSVG);
      // 单个子节点, 就指向该节点
      vnode.el = children.el;
      break;
    case ChildrenFlags.NO_CHILDREN:
      // 如果是没有子节点, 等价于挂载空片段, 会创建一个空的文本节点占位
      const placeholder = createTextVNode("");
      mountText(placeholder, container);
      // 没有子节点指向占位的空文本节点
      vnode.el = placeholder.el;
      break;
    default:
      // 多个子节点, 遍历挂载之
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG);
      }
      // 多个子节点, 指向第一个子节点
      vnode.el = children[0].el;
      break;
  }
}

// 挂载 Portal -- 可以不严谨地认为是可以被到处挂载的 Fragment.
function mountPortal(vnode, container, isSVG) {
  const { tag, children, childFlags } = vnode;

  // 获取挂载点
  const target = typeof tag === "string" ? document.querySelector(tag) : tag;

  // 判断子节点的类型
  if (childFlags & ChildrenFlags.SINGLE_VNODE) {
    // 将 children 挂载到 target 上, 而非 container
    mount(children, target);
  } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      // 将 children 挂载到 target 上, 而非 container
      mount(children[i], target);
    }
  }

  // 占位的空文本节点
  const placeholder = createTextVNode("");
  // 将该节点挂载到 container 中
  mountText(placeholder, container);
  // el 属性引用该节点
  vnode.el = placeholder.el;
}

// 挂载组件 -- 组件的产出是 VNode, 其思路是拿到组件产出的 VNode, 并将之挂载到正确的 container 中.
function mountComponent(vnode, container, isSVG) {
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    // 有状态组件
    mountStatefulComponent(vnode, container, isSVG);
  } else {
    // 函数式组件
    mountFunctionalComponent(vnode, container, isSVG);
  }
}

/**
 * data、props、ref 或者 slots 等等, 这些内容是在基本原理的基础上, 再次设计的产物
 * 它们为 render 函数生成 VNode 的过程中提供数据来源服务,
 * 而组件产出 VNode 才是永恒的核心
 */
// 挂载有状态组件
function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = (vnode.children = new vnode.tag());
  // 初始化 props -- 简便写法
  instance.$props = vnode.data;

  // 封装为函数, 用于组件自身状态发生变化后, 调用 _update 函数来完成组件的更新
  instance._update = function() {
    // 使用 _mounted 作为标识, 判断是初次挂载还是执行更新操作
    if (instance._mounted) {
      /** 主动更新有状态组件: 主动更新指的是组件自身的状态发生变化所导致的更新
       *
       */
      // 1. 拿到旧的 VNode
      const prevVNode = instance.$vnode;
      // 2. 重渲染新的 VNode
      const nextVNode = (instance.$vnode = instance.render());
      // 3. patch 更新
      patch(prevVNode, nextVNode, prevVNode.el.parentNode);
      // 4. 更新 vnode.el 和 $el
      instance.$el = vnode.el = instance.$vnode.el;
    } else {
      // 1. 渲染VNode
      instance.$vnode = instance.render();
      // 2. 挂载
      mount(instance.$vnode, container, isSVG);
      // 3. 组件已挂载的标识
      instance._mounted = true;
      // 4. el 属性值 和 组件实例的 $el 属性都引用组件的根 DOM 元素
      instance.$el = vnode.el = instance.$vnode.el;
      // 5. 调用 mounted 钩子
      instance.mounted && instance.mounted();
    }
  };

  instance._update();
}

/**
 * 函数式组件: 只有 props 和 slots, 它要做的工作很少,所以性能上会更好
 * 有状态组件: 在实例化的过程中会初始化一系列 有状态组件 所持有的东西, 诸如 data(或state)、computed、watch、声明周期等等
 */
// 挂载函数式组件 -- 就是一个返回 VNode 的函数
function mountFunctionalComponent(vnode, container, isSVG) {
  // 在函数式组件类型的 vnode 上添加 handle 属性, 是一个对象
  vnode.handle = {
    // 存储旧的函数式组件 VNode，在初次挂载时，没有旧的 VNode 可言，所以初始值为 null
    prev: null,
    // 存储新的函数式组件 VNode，在初次挂载时，被赋值为当前正在挂载的函数式组件 VNode。
    next: vnode,
    // 存储的是挂载容器
    container,
    update: () => {
      if (vnode.handle.prev) {
        // 更新的逻辑
        // prevVNode 是旧的组件VNode，nextVNode 是新的组件VNode
        const prevVNode = vnode.handle.prev;
        const nextVNode = vnode.handle.next;
        // prevTree 是组件产出的旧的 VNode
        const prevTree = prevVNode.children;
        // 更新 props 数据
        const props = nextVNode.data;
        // nextTree 是组件产出的新的 VNode
        const nextTree = (nextVNode.children = nextVNode.tag(props));
        // 调用 patch 函数更新
        patch(prevTree, nextTree, vnode.handle.container);
      } else {
        // 获取 props
        const props = vnode.data;

        // 获取 VNode
        const $vnode = (vnode.children = vnode.tag(props));
        // 挂载
        mount($vnode, container, isSVG);
        // el 元素引用该组件的根元素
        vnode.el = $vnode.el;
      }
    }
  };
  // 立即调用 vnode.handle.update 完成初次挂载
  vnode.handle.update();
}
