import { VNodeFlags } from "../设计VNode/VNodeFlags.js";
import { mount } from "../渲染器/mount.js";
import { patchData } from "../util/patchData.js";
import { ChildrenFlags } from "../设计VNode/ChildrenFlags.js";

/*
 * @Descripttion: patch 文件
 * @Author: 温祖彪
 * @Date: 2020-04-01 16:13:30
 * @LastEditTime: 2020-04-01 17:29:37
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

          break;
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时
          break;
        default:
          // 新的 children 中有多个子节点时, 会执行该 case 语句块
          break;
      }
      break;
    case ChildrenFlags.NO_CHILDREN:
      // 旧的 childern 中没有子节点时
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单个子节点时
          break;
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时
          break;

        default:
          // 新的 children 中有多个子节点时, 会执行该 case 语句块
          break;
      }
      break;
    default:
      // 旧的 children 中有多个子节点时
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单个子节点时
          break;
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时
          break;

        default:
          // 新的 children 中有多个子节点时, 会执行该 case 语句块
          break;
      }
      break;
  }
}
