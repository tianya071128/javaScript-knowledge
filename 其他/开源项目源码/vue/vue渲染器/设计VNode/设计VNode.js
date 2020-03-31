/*
 * @Descripttion: 设计 VNode
 * @Author: 温祖彪
 * @Date: 2020-03-31 11:41:58
 * @LastEditTime: 2020-03-31 14:55:21
 */
// 标签元素 VNode 表示
const elementVNode = {
  // 标签名
  tag: 'div',
  // 名字、属性、事件、样式、子节点等诸多信息
  data: {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red'
    }
  },
  // 单个子节点
  // children: {
  //   tag: 'span',
  //   data: null
  // }
  // 多个子节点
  children: [
    {
      tag: 'h1',
      data: null
    },
    // 文本节点
    {
      tag: null,
      data: null,
      children: '文本内容'
    },
    // 抽象内容 -- 组价
    {
      tag: MyComponent,
      data: null
    }
  ]
}

/**
 * 抽象内容 -- Fragment, 具有多个根元素的组件
 * 例如:
 * <template>
 *   <td></td>
 *   <td></td>
 *   <td></td>
 * </template>
 */
const Fragment = Symbol();
const fragmentVNode = {
  // tag 属性值是一个唯一标识
  tag: Fragment,
  data: null,
  children: [
    {
      tag: 'td',
      data: null
    },
    {
      tag: 'td',
      data: null
    },
    {
      tag: 'td',
      data: null
    }
  ]
}

/**
 * 抽象内容 -- Portal: 允许把内容渲染到任何地方, 所谓 Portal 就是把子节点渲染到给定的目标
 * 应用场景: 假设你要实现一个蒙层组件 <Overlay/>，要求是该组件的 z-index 的层级最高，这样无论在哪里使用都希望它能够遮住全部内容，你可能会将其用在任何你需要蒙层的地方。
 * <template>
 *   <div id="box" style="z-index: -1;">
 *     <Overlay />
 *   </div>
 * </template>
 */
/**
 * 使用 Portal 可以这样编写 <Overlay /> 组件的模板
 * <template>
 *   <Portal target="#app-root">
 *     <div class="overlay"></div>
 *   </Portal>
 * </template>
 */
const Portal = Symbol();
const portalVNode = {
  tag: Portal,
  data: {
    target: '#app-root'
  },
  children: {
    tag: 'div',
    data: {
      class: 'overlay'
    }
  }
}

/** VNode 的种类
 *                                     VNode 种类
 *                                         |
 * -------------------------------------------------------------------------------------------
 * |                   |                   |                          |                      |
 * html/Svg 标签      组件                 纯文本                    Fragment               Portal
 *                     |
 *       ------------------------------
 *       |                            |
 *    有状态组件                   函数式组件
 *       |
 * ------------------------------------------------------------------------
 * |                               |                                |
 * 普通的有状态组件     需要被 keepAlive 的有状态组件      已经被 keepAlive 的有状态组件
 */


// VNode 对象
export interface VNode {
  // _isVNode 属性在上文中没有提到，它是一个始终为 true 的值，有了它，我们就可以判断一个对象是否是 VNode 对象
  _isVNode: true
  // el 属性在上文中也没有提到，当一个 VNode 被渲染为真实 DOM 之后，el 属性的值会引用该真实DOM
  el: Element | null
  flags: VNodeFlags
  tag: string | FunctionalComponent | ComponentClass | null
  data: VNodeData | null
  children: VNodeChildren
  childFlags: ChildrenFlags
}
