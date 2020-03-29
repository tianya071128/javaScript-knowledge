/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-29 20:39:54
 */
/* @flow */

import Dep from "./dep";
import VNode from "../vdom/vnode";
import { arrayMethods } from "./array";
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering
} from "../util/index";

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true;

export function toggleObserving(value: boolean) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed 附加到每个观察对象的观察者类
 * object. Once attached, the observer converts the target object. 一旦连接，观察者转换目标
 * object's property keys into getter/setters that 对象的属性键进入getter/setters
 * collect dependencies and dispatch updates. 收集依赖项并发送更新
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data 将此对象作为根$data的vm数

  constructor(value: any) {
    this.value = value;
    // Dep: 收集依赖的对象, 在对象属性 getter 属性中, 可以收集依赖的对象.
    // 但在这里, 这个 Dep 另有其他作用
    this.dep = new Dep();
    this.vmCount = 0;
    // def 就是 Object.defineProperty 函数的简单封装
    // 为数据对象定义一个 __ob__ 属性
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      // hasProto: Boolean 用来检测是否支持 __propto__ 属性
      // 把数组实例与代理原型或与代理原型中定义的函数联系起来，从而拦截数组变异方法。
      if (hasProto) {
        // 使用 __proto__ 代理数组的变异方法
        protoAugment(value, arrayMethods);
      } else {
        // 在不支持 __proto__ 属性时, 兼容处理. -- 将代理变异方法添加到数组中, 用以屏蔽数组原型变异方法
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      // 纯对象处理
      this.walk(value);
    }
  }

  /**
   * Walk through all properties and convert them into 浏览所有属性并将其转换为
   * getter/setters. This method should only be called when getter/setters。只有当
   * value type is Object. 值类型是对象
   */
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  /**
   * Observe a list of Array items. 观察数组项列表
   */
  // 遍历数组的项, 因为数组项也可以是对象或数组
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

// helpers

/**
 * Augment a target Object or Array by intercepting 通过拦截来增强目标对象或数组
 * the prototype chain using __proto__ 使用 __proto__ 的原型链
 */
function protoAugment(target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining 通过定义
 * hidden properties. 隐藏属性来扩充目标对象或数组
 */
/* istanbul ignore next */
// 在不支持 __proto__ 属性时, 兼容处理. -- 将代理变异方法添加到数组中, 用以屏蔽数组原型变异方法
function copyAugment(target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value, 尝试为值创建观察者实例
 * returns the new observer if successfully observed, 如果观察成功，则返回新的观察者
 * or the existing observer if the value already has one. 或者现有的观察者，如果该值已经有一个
 */
// 第一个参数是要观测的数据，第二个参数是一个布尔值，代表将要被观测的数据是否是根级数据
export function observe(value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob: Observer | void;
  // 检测数据对象 value 自身是否含有 __ob__ 属性,并且 __ob__ 属性应该是 Observer 的实例
  // __ob__: 当一个数据对象被观测之后将会在该对象上定义 __ob__ 属性，
  // 所以 if 分支的作用是用来避免重复观测一个数据对象
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
    // isServerRendering: 用来判断是否为服务端渲染
    // Object.isExtensible(value): 要被观测的数据对象必须是可扩展的
    // value._isVue: 用来避免 Vue 实例对象被观测
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}

/**
 * Define a reactive property on an Object. 在对象上定义反应属性
 */
// defineReactive 函数的核心就是 将数据对象的数据属性转换为访问器属性，即为数据对象的属性设置一对 getter/setter
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 收集依赖 -- 每一个数据字段都通过闭包引用着属于自己的 dep 常量
  const dep = new Dep();

  // 获取该属性的属性描述对象
  const property = Object.getOwnPropertyDescriptor(obj, key);
  // 不可配置的属性, 直接返回, 因为不可配置的属性无法使用 Object.defineProperty 改变其属性定义
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  // 用来缓存已经存在 getter/setters 的属性的 getter/setters -- 从而做到不影响属性的原有读写操作。
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  // 在这里递归调用 val ,深度观测数据对象
  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 收集依赖 并且 返回属性值
    get: function reactiveGetter() {
      // 获取数据值, 当存在 getter 时, 直接调用 getter 函数.
      const value = getter ? getter.call(obj) : val;
      // Dep.target 保存的就是要被收集的依赖(观察者)
      if (Dep.target) {
        // dep.depend(): 依赖收集, 这个收集的依赖触发时机是当属性值被修改时触发, 即在 set 函数中触发
        dep.depend();
        if (childOb) {
          // childOb.dep.depend(): childOb.dep(就是 new Observer 生成的 dep 对象) 收集的依赖触发时机是在使用 $set 或 Vue.set 添加新属性时触发
          childOb.dep.depend();
          // 对数组进行处理
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    // 触发相应的依赖 并且 设置相应的新值
    set: function reactiveSetter(newVal) {
      // 获取到旧值
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      // 只有在原有值与新设置的值不相等的情况下才需要触发依赖和重新设置属性值
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        // 辅助函数, 在 render.js 文件中定义 $attrs 属性时出现过
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      // 设置相应的新值
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      // 假如我们为属性设置的新值是一个数组或者纯对象，那么该数组或纯对象是未被观测的，所以需要对新值进行观测, 同时使用新的观测对象重写 childOb 的值。
      childOb = !shallow && observe(newVal);
      // 触发依赖
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and 设置对象的属性。添加新属性和
 * triggers change notification if the property doesn't already exist. 如果属性不存在，则触发更改通知
 */
export function set(target: Array<any> | Object, key: any, val: any): any {
  // isUndef(): 判断一个值是否是 undefined 或 null
  // isPrimitive(): 判断一个值是否是原始类型值
  if (
    process.env.NODE_ENV !== "production" &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(
      `Cannot set reactive property on undefined, null, or primitive value: ${target}`
    );
  }
  // 判断是否为数组 && key 是一个有效的数组索引
  /** 通过变通方法就能够对数组索引进行响应 -- 通过数组变异方法 splice
   * this.arr[0] = 3 // 不能触发响应
   * this.$set(this.arr, 0, 3) // 能够触发响应
   *
   */
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  // 处理已经存在的响应式属性, 直接赋值即可
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = target.__ob__;
  // 限制使用 Vue.set/$set 函数为根数据对象添加属性时，是不被允许的。
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== "production" &&
      warn(
        "Avoid adding reactive properties to a Vue instance or its root $data " +
          "at runtime - declare it upfront in the data option."
      );
    return val;
  }
  // 当 target 是非响应的, 简单赋值即可
  if (!ob) {
    target[key] = val;
    return val;
  }
  // 将新添加的属性设置响应式
  defineReactive(ob.value, key, val);
  // 触发响应 -- 因为添加了属性, 需要触发依赖
  ob.dep.notify();
  return val;
}

/**
 * Delete a property and trigger change if necessary. 删除属性并在必要时触发更改
 */
// 跟 set 类似
export function del(target: Array<any> | Object, key: any) {
  if (
    process.env.NODE_ENV !== "production" &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(
      `Cannot delete reactive property on undefined, null, or primitive value: ${target}`
    );
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }
  const ob = target.__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== "production" &&
      warn(
        "Avoid deleting properties on a Vue instance or its root $data " +
          "- just set it to null."
      );
    return;
  }
  if (!hasOwn(target, key)) {
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since 在接触数组时收集对数组元素的依赖关系，因为
 * we cannot intercept array element access like property getters. 我们不能像属性getter那样拦截数组元素访问
 */
function dependArray(value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
