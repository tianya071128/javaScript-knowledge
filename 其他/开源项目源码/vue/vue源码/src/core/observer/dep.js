/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-05-26 22:18:56
 */
/* @flow */

import type Watcher from "./watcher";
import { remove } from "../util/index";
import config from "../config";

let uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  // 真正用来收集观察者的方法 -- 绕了一圈，目的在于避免重复收集
  addSub(sub: Watcher) {
    this.subs.push(sub);
  }
  // 移除依赖
  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }

  // 触发收集依赖
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  // 触发依赖
  notify() {
    // stabilize the subscriber list first 先稳定 subscriber 列表
    const subs = this.subs.slice();
    if (process.env.NODE_ENV !== "production" && !config.async) {
      // subs aren't sorted in scheduler if not running async 如果不运行async，则在调度程序中不对子进行排序
      // we need to sort them now to make sure they fire in correct 我们现在需要对它们进行分类以确保它们正确开火
      // order 命令
      subs.sort((a, b) => a.id - b.id);
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
const targetStack = [];

// 在创建观察者的时候求值，将依赖引用在 Dep.target 中
export function pushTarget(target: ?Watcher) {
  targetStack.push(target);
  Dep.target = target;
}

export function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
