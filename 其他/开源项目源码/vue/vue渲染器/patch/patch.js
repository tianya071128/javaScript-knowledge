import { VNodeFlags } from "../设计VNode/VNodeFlags.js";
import { mount } from "../渲染器/mount.js";
import { patchData } from "../util/patchData.js";
import { ChildrenFlags } from "../设计VNode/ChildrenFlags.js";

/*
 * @Descripttion: patch 文件
 * @Author: 温祖彪
 * @Date: 2020-04-01 16:13:30
 * @LastEditTime: 2020-04-02 11:52:13
 */
/** 对比原则
 * 1. 只有相同类型的 VNode 才有比对的意义: 不同类型的 VNode 之间存在一定的差异.
 * 2. 不同的标签渲染的内容不同: 例如 ul 标签下只能渲染 li 标签，所以拿 ul 标签和一个 div 标签进行比对是没有任何意义的
 */

export function patch(prevVNode, nextVNode, container) {
  // 分别拿到新旧 VNode 的类型, 即 flags
  const nextFlags = nextVNode.flags;
  const prevFlags = prevVNode.flags;

  // 如果新旧 VNode 的类型相同, 则根据不同的类型调用不同的比对函数
  if (prevFlags !== nextFlags) {
    // 检查新旧 VNode 的类型是否相同, 如果类型不同, 则直接调用 replaceVNode 函数替换
    replaceVNode(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    // 类型相同, 更新标签元素
    patchElement(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.COMPONENT) {
  } else if (nextFlags & VNodeFlags.TEXT) {
    // 类型相同, 更新文本节点
    patchText(prevVNode, nextVNode);
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    // 类型相同, 更新 Fragment
    patchFragment(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.PORTAL) {
    // 类型相同, 更新 Portal
    patchPortal(prevVNode, nextVNode);
  }
}

// 替换 VNode
function replaceVNode(prevVNode, nextVNode, container) {
  // 将旧的 VNode 所渲染的 DOM 从容器中移除
  container.removeChild(prevVNode.el);
  // 再把新的 VNode 挂载到容器中
  mount(nextVNode, container);
}

// 更新标签元素
function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签, 则调用 replaceVNode 函数, 使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container);
    return;
  }

  // 拿到 el 元素, 注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el);
  // 拿到新旧 VNodeData
  const prevData = prevVNode.data;
  const nextData = nextVNode.data;

  // 相同标签 -- 处理不同的 VNodeData
  replaceVNodeData(el, prevData, nextData);

  // 递归更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children, // 旧的 VNode 子节点
    nextVNode.children, // 新的 VNode 子节点
    el // 当前标签元素, 即这些子节点的父节点
  );
}

// 处理不同的 VNodeData -- 将新的 VNodeData 全部应用到元素上，再把那些已经不存在于新的 VNodeData 上的数据从元素上移除
function replaceVNodeData(el, prevData, nextData) {
  // 遍历新的 VNodeData, 将旧值和新值都传递给 patchData 函数
  if (nextData) {
    for (let key in nextData) {
      // 根据 key 拿到新旧 VNodeData 值
      const prevValue = prevData && prevData[key];
      const nextValue = nextData[key];
      patchData(el, key, prevValue, nextValue);
    }
  }
  // 遍历旧的 VNodeData, 将已经不存在于新的 VNodeData 中的数据移除
  if (prevData) {
    for (let key in prevData) {
      const prevValue = prevData[key];
      if (prevValue && !(nextData && nextData.hasOwnProperty(key))) {
        // 第四个参数为 null, 代表移除数据
        patchData(el, key, prevValue, null);
      }
    }
  }
}

// 递归更新子节点
function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      // 旧的 children 是单个子节点
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单个子节点时
          // 此时 prevChildren 和 nextChildren 都是 VNode 对象, 直接递归调用 patch 替换子节点
          patch(prevChildren, nextChildren, container);
          break;
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时
          // 此时只要把旧的子节点移除即可
          container.removeChild(prevChildren.el);
          break;
        default:
          // 新的 children 中有多个子节点时
          // 移除旧的子节点, 将新的子节点挂载上去
          container.removeChild(prevChildren.el);
          // 遍历新的多个子节点, 逐个挂载到容器中
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container);
          }
          break;
      }
      break;
    case ChildrenFlags.NO_CHILDREN:
      // 旧的 childern 中没有子节点时
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时
          // 此时只需要把新的单个子节点添加到容器元素即可。
          mount(nextChildren, container);
          break;
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时
          // 此时什么都不需要做
          break;
        default:
          // 新的 children 中有多个子节点时
          // 此时把这多个子节点都添加到容器元素即可
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container);
          }
          break;
      }
      break;
    default:
      // 旧的 children 中有多个子节点时
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 是单个子节点时
          // 这时只需要把所有旧的子节点移除，再将新的单个子节点添加到容器元素即可。
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el);
          }
          // 新的单个子节点添加到容器元素
          mount(nextChildren, container);
          break;
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时
          // 这时只需要把所有旧的子节点移除即可。
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el);
          }
          break;

        default:
          // 新的 children 中有多个子节点时
          // 此时可以采用 diff 算法复用元素
          // 遍历旧的子节点，将其全部移除 -- 暂时用这个方法
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el);
          }
          // 遍历新的子节点，将其全部添加 -- 暂时用这个方法
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container);
          }
          break;
      }
      break;
  }
}

// 更新文本节点 -- 直接调用该 DOM 对象的 nodeValue 属性读取或设置文本节点的内容
function patchText(prevVNode, nextVNode) {
  // 拿到文本元素 el, 同时让 nextVNode.el 指向该文本元素
  const el = (nextVNode.el = prevVNode.el);
  // 只有当新旧文本内容不一致时才有必要更新
  if (nextVNode.children !== prevVNode.children) {
    el.nodeValue = nextVNode.children;
  }
}

// 更新 Fragment -- 片段的更新是简化版的标签元素的更新, 本质上就是更新两个片段的"子节点"
function patchFragment(prevVNode, nextVNode, container) {
  // 递归更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children, // 旧的 VNode 子节点
    nextVNode.children, // 新的 VNode 子节点
    container // 当前标签元素, 即这些子节点的父节点
  );

  // 更新 VNode 的 el 引用, 根据子节点的类型不同, VNode 的 el 引用的也不同
  switch (nextVNode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      // 单个子节点
      nextVNode.el = nextVNode.children.el;
      break;
    case ChildrenFlags.NO_CHILDREN:
      // 没有子节点, 引用 prevVNode.el (即一个空的文本占位)
      nextVNode.el = prevVNode.el;
    default:
      // 多个子节点
      nextVNode.el = nextVNode.children[0].el;
      break;
  }
}

// 更新 Portal -- 类似于 Fragment , 但是还要对比新旧挂载目标是否相同
function patchPortal(prevVNode, nextVNode, container) {
  // 递归更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children, // 旧的 VNode 子节点
    nextVNode.children, // 新的 VNode 子节点
    typeof prevVNode.tag === "string"
      ? document.querySelector(prevVNode.tag)
      : prevVNode.tag // 容器元素是旧的 container, 当新旧挂载点不同时, 可以直接移动 DOM 即可
  );

  // Portal 类型的 VNode 来说其 el 属性始终是一个占位的文本节点
  // 让 nextVNode.el 指向 prevVNode.el
  nextVNode.el = prevVNode.el;

  // 如果新旧容器不同, 需要移动 DOM
  if (nextVNode.tag !== prevVNode.tag) {
    // 获取新的容器元素, 即挂载目标
    const container =
      typeof nextVNode.tag === "string"
        ? document.querySelector(nextVNode.tag)
        : nextVNode.tag;

    // 通过比较子节点类型来移动 DOM
    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        // 单个子节点, 直接移动子节点
        container.appendChild(nextVNode.children.el);
        break;
      case ChildrenFlags.NO_CHILDREN:
      // 没有子节点, 不做处理
      default:
        // 多个子节点, 则逐个移动 DOM 到新容器中
        for (let i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el);
        }
        break;
    }
  }
}
