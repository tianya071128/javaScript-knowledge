/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-29 11:18:30
 */
/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError,
  noop
} from "../util/index";

import { traverse } from "./traverse";
import { queueWatcher } from "./scheduler";
import Dep, { pushTarget, popTarget } from "./dep";

import type { SimpleSet } from "../util/index";

let uid = 0;

/**
 * A watcher parses an expression, collects dependencies, 观察者解析表达式，收集依赖项
 * and fires callback when the expression value changes. 并在表达式值更改时激发回调
 * This is used for both the $watch() api and directives. 这用于$watch（）api和指令
 */
// watcher 的原理通过对 "被观测目标" 的求值,触发数据属性的 get 拦截器函数从而收集依赖
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  /**
   * 组件实例对象 vm
   * 要观察的表达式 expOrFn
   * 当被观察的表达式的值变化时的回调函数 cb
   * 一些传递给当前观察者对象的选项 options
   * 布尔值 isRenderWatcher 用来标识该观察者实例是否是渲染函数的观察者。
   */
  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    // 该属性指明了这个观察者是属于哪一个组件的
    this.vm = vm;
    // 只有组件实例的 _watcher 属性的值引用着该组件的渲染函数观察者
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    // 属于该组件实例的观察者都会被添加到该组件实例对象的 vm._watchers 数组中
    // 包括渲染函数的观察者和非渲染函数的观察者.
    vm._watchers.push(this);
    // options
    // options.deep，用来告诉当前观察者实例对象是否是深度观测
    // options.user，用来标识当前观察者实例对象是 开发者定义的 还是 内部定义的
    // options.computed(应该是指 lazy)，用来标识当前观察者实例对象是否是计算属性的观察者
    // options.sync，用来告诉观察者当数据变化时是否同步求值并执行回调
    // options.before，可以理解为 Watcher 实例的钩子，当数据变化之后，触发更新之前，调用在创建渲染函数的观察者实例对象时传递的 before 选项。
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    // this.cb 属性，它的值为 cb 回调函数
    // this.id 属性，它是观察者实例对象的唯一标识
    // this.active 属性，它标识着该观察者实例对象是否是激活状态，默认值为 true 代表激活
    // this.dirty 属性，该属性的值与 this.computed 属性的值相同，也就是说只有计算属性的观察者实例对象的 this.dirty 属性的值才会为真，因为计算属性是惰性求值
    this.cb = cb;
    this.id = ++uid; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    // 用来实现避免收集重复依赖, 移除无用依赖的功能
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    // 在非生产环境下该属性的值为表达式(expOrFn)的字符串表示，在生产环境下其值为空字符串。
    this.expression =
      process.env.NODE_ENV !== "production" ? expOrFn.toString() : "";
    // parse expression for getter getter的解析表达式
    // 定义 getter 属性
    if (typeof expOrFn === "function") {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
        process.env.NODE_ENV !== "production" &&
          warn(
            `Failed watching path: "${expOrFn}" ` +
              "Watcher only accepts simple dot-delimited paths. " +
              "For full control, use a function instead.",
            vm
          );
      }
    }
    // 计算属性的观察者和其他观察者实例对象的处理方式是不同的
    this.value = this.lazy ? undefined : this.get();
  }

  /**
   * Evaluate the getter, and re-collect dependencies. 计算getter并重新收集依赖项
   */
  // 求值的目的有两个，第一个是能够触发访问器属性的 get 拦截器函数，第二个是能够获得被观察目标的值。
  get() {
    // 作用就是用来为 Dep.target 属性赋值的，pushTarget 函数会将接收到的参数赋值给 Dep.target 属性
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`);
      } else {
        throw e;
      }
    } finally {
      // "touch" every property so they are all tracked as “触摸”每一个属性，这样它们都被跟踪为
      // dependencies for deep watching 深度监视的依赖项
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      // 清理依赖项集合
      this.cleanupDeps();
    }
    return value;
  }

  /** newDepIds 和 newDeps 这两个属性的值所存储的总是当次求值所收集到的 Dep 实例对象，
   *  而 depIds 和 deps 这两个属性的值所存储的总是上一次求值过程中所收集到的 Dep 实例对象。
   * 1. newDepIds 属性用来在一次求值中避免收集重复的观察者
   * 2. 每次求值并收集观察者完成之后会清空 newDepIds 和 newDeps 这两个属性的值，并且在被清空之前把值分别赋给了 depIds 属性和 deps 属性
   * 3. depIds 属性用来避免重复求值时收集重复的观察者
   */
  /**
   * Add a dependency to this directive. 向此指令添加依赖项
   */
  addDep(dep: Dep) {
    const id = dep.id;
    // 通过 dep 对象的 id 来避免收集重复依赖
    // 这样无论一个数据属性被读取了多少次, 对于同一个观察者它只会收集一次
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }

  /**
   * Clean up for dependency collection. 清理依赖项集合
   */
  cleanupDeps() {
    let i = this.deps.length;
    // deps 属性还能够用来移除废弃的观察者
    while (i--) {
      const dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    let tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run() {
    if (this.active) {
      const value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(
              e,
              this.vm,
              `callback for watcher "${this.expression}"`
            );
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown() {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      let i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  }
}
