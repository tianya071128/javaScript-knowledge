/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-30 11:53:22
 */
/* @flow */

import config from "../config";
import { initProxy } from "./proxy";
import { initState } from "./state";
import { initRender } from "./render";
import { initEvents } from "./events";
import { mark, measure } from "../util/perf";
import { initLifecycle, callHook } from "./lifecycle";
import { initProvide, initInjections } from "./inject";
import { extend, mergeOptions, formatComponentName } from "../util/index";

let uid = 0;

// 在 Vue 的原型上添加 _init 方法,在 new Vue() 的时候, this._init(options) 将被执行
export function initMixin(Vue: Class<Component>) {
  // 初始化函数
  Vue.prototype._init = function(options?: Object) {
    const vm: Component = this;
    // a uid
    // 每次实例化一个 Vue 实例之后, uid 的值都会 ++
    vm._uid = uid++;

    // Vue 提供了全局配置 Vue.config.performance, 可开启性能追踪
    /**
     * 可以追踪四个场景的性能: 这里追踪的是第一个: 组件初始化
     * 1. 组件初始化(component init)
     * 2. 编译(compile), 将模板(template)编译成渲染函数
     * 3. 渲染(render), 其实就是渲染函数的性能, 或者说渲染函数执行且生成虚拟DOM(VNode) 的性能
     * 4. 打补丁(patch), 将虚拟 DOM 渲染成真实 DOM 的性能
     */
    let startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`;
      endTag = `vue-perf-end:${vm._uid}`;
      mark(startTag);
    }

    // a flag to avoid this being observed
    // 目的是用来标识一个对象是 Vue 实例，即如果发现一个对象拥有 _isVue 属性并且其值为 true，那么就代表该对象是 Vue 实例。
    vm._isVue = true;
    // merge options
    // options._isComponent 是一个内部属性, 用来标识是否为组件
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      // 实例组件化
      initInternalComponent(vm, options);
    } else {
      // 不是组件时 -- 合并配置
      // resolveConstructorOptions(vm.constructor) 返回值为 vm.construct.options 处理后的 options
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    // 在支持 proxy(ES6 代理) 环境中代理 this, 用于在设置渲染函数的作用域代理
    if (process.env.NODE_ENV !== "production") {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    // 向实例 vm 添加一些属性以及建立父子组件关系
    initLifecycle(vm);
    initEvents(vm);
    // 初始化一些属性(主要是 render 方面的)
    initRender(vm);
    // 调用 beforeCreate 生命周期钩子 -- 在这一步还没有初始化 props, methods, data 等资源
    callHook(vm, "beforeCreate");
    // 初始化 inject
    initInjections(vm); // resolve injections before data/props 在数据/道具之前解决注入
    initState(vm);
    initProvide(vm); // resolve provide after data/props 解析提供后的数据/道具
    // 调用 created 生命周期钩子 -- 在这一步已经初始化 props, methods, data 等资源
    callHook(vm, "created");

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(`vue ${vm._name} init`, startTag, endTag);
    }

    // 在这一步，就会去挂载 DOM
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  const opts = (vm.$options = Object.create(vm.constructor.options));
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

// 解析构造者的 options
export function resolveConstructorOptions(Ctor: Class<Component>) {
  let options = Ctor.options;
  // Ctor.super 是子类(基于 Vue 构造函数)才有的属性
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super);
    const cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options;
}

function resolveModifiedOptions(Ctor: Class<Component>): ?Object {
  let modified;
  const latest = Ctor.options;
  const sealed = Ctor.sealedOptions;
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {};
      modified[key] = latest[key];
    }
  }
  return modified;
}
