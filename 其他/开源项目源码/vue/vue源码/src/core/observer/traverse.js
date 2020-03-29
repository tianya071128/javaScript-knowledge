/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-29 20:41:56
 */
/* @flow */

import { _Set as Set, isObject } from "../util/index";
import type { SimpleSet } from "../util/index";
import VNode from "../vdom/vnode";

const seenObjects = new Set();

/**
 * Recursively traverse an object to evoke all converted 递归遍历一个对象以调用所有转换的
 * getters, so that every nested property inside the object getter，以便对象中的每个嵌套属性
 * is collected as a "deep" dependency. 作为“深层”依赖关系收集。
 */
export function traverse(val: any) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse(val: any, seen: SimpleSet) {
  let i, keys;
  const isA = Array.isArray(val);
  // 检测被观察属性的值能否进行深度观测.
  if (
    (!isA && !isObject(val)) ||
    Object.isFrozen(val) ||
    val instanceof VNode
  ) {
    return;
  }
  // 使用一个变量来存储那些已经被遍历过的对象, 解决循环引用的问题
  // 如果一个响应式数据是对象或数组, 那么它会包含一个叫做 __ob__ 的属性
  // 这时我们读取 val.__ob__.dep.id 作为一个唯一的ID值，并将它放到 seenObjects 中
  // 这样即使 val 是一个拥有循环引用的对象，当下一次遇到该对象时，我们能够发现该对象已经遍历过了
  if (val.__ob__) {
    const depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  // 循环递归收集依赖 -- 通过 val[i] 和 val[keys[i]], 触发子属性的 get 拦截器函数
  if (isA) {
    i = val.length;
    while (i--) _traverse(val[i], seen);
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) _traverse(val[keys[i]], seen);
  }
}
