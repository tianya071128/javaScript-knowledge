/*
 * @Descripttion: childrenFlags
 * @Author: 温祖彪
 * @Date: 2020-03-31 14:42:59
 * @LastEditTime: 2020-03-31 15:38:02
 */
const ChildrenFlags = {
  // 未知的 children 类型
  UNKNOWN_CHILDREN: 0,
  // 没有 children 
  NO_CHILDREN: 1,
  // children 是单个 VNode
  SINGLE_VNODE: 1 << 1,

  // children 是多个拥有 key 的 VNode
  KEYED_VNODES: 1 << 2,
  // children 是多个没有 key 的 VNode
  NONE_KEYED_VNODES: 1 << 3
}

// 由于 ChildrenFlags.KEYED_VNODES 和 ChildrenFlags.NONE_KEYED_VNODES 都属于多个 VNode，
// 所以我们可以派生出一个“多节点”标识
ChildrenFlags.MULTIPLE_VNODES = ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODES


export {
  ChildrenFlags
}

/* 示例
 // 没有子节点的 div 标签
 const elementVNode = {
   flags: VNodeFlags.ELEMENT_HTML,
   tag: 'div',
   data: null,
   children: null,
   childFlags: ChildrenFlags.NO_CHILDREN
 }

 // 文本节点的 childFlags 始终都是 NO_CHILDREN
 const textVNode = {
   tag: null,
   data: null,
   children: '我是文本',
   childFlags: ChildrenFlags.NO_CHILDREN
 }

 // 拥有多个使用了key的 li 标签作为子节点的 ul 标签
 const elementVNode = {
   flags: VNodeFlags.ELEMENT_HTML,
   tag: 'ul',
   data: null,
   childFlags: ChildrenFlags.KEYED_VNODES,
   children: [
     {
       tag: 'li',
       data: null,
       key: 0
     },
     {
       tag: 'li',
       data: null,
       key: 1
     }
   ]
 }

 // 只有一个子节点的 Fragment
 const elementVNode = {
   flags: VNodeFlags.FRAGMENT,
   tag: null,
   data: null,
   childFlags: ChildrenFlags.SINGLE_VNODE,
   children: {
     tag: 'p',
     data: null
   }
 }
*/