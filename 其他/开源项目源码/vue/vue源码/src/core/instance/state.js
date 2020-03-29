/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-29 21:42:24
 */
/* @flow */

import config from "../config";
import Watcher from "../observer/watcher";
import Dep, { pushTarget, popTarget } from "../observer/dep";
import { isUpdatingChildComponent } from "./lifecycle";

import {
  set,
  del,
  observe,
  defineReactive,
  toggleObserving
} from "../observer/index";

import {
  warn,
  bind,
  noop,
  hasOwn,
  hyphenate,
  isReserved,
  handleError,
  nativeWatch,
  validateProp,
  isPlainObject,
  isServerRendering,
  isReservedAttribute
} from "../util/index";

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

// 实现响应式函数 -- 代理属性 _data
export function proxy(target: Object, sourceKey: string, key: string) {
  // 通过 Object.defineProperty 函数在实例对象 vm 上定义与 data 数据字段同名的访问器属性, 并且这些属性代理的值是 vm._data 上对应属性的值
  // 例如: 当访问 this.a 时实际访问的是 this._data.a
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

// 初始化数据选项 -- 并且通过初始化顺序可知, props 选项的初始化要早于 data 选项的初始化，所以在 data 中可以使用 props
export function initState(vm: Component) {
  // 在 vue 实例上添加一个属性, 用来存储所有该组件实例的 watcher 对象.
  vm._watchers = [];
  const opts = vm.$options;
  // 如果 opts.props 存在，即选项中有 props，那么就调用 initProps 初始化 props 选项。
  if (opts.props) initProps(vm, opts.props);
  // 如果 opts.methods 存在，则调用 initMethods 初始化 methods 选项。
  if (opts.methods) initMethods(vm, opts.methods);
  // 判断 data 选项是否存在，如果存在则调用 initData 初始化 data 选项，如果不存在则直接调用 observe 函数观测一个空对象：{}。
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  // 如果 opts.computed 存在，则调用 initComputed 初始化 computed 选项。
  if (opts.computed) initComputed(vm, opts.computed);
  // 如果 opts.watch 存在，并且不是为 Firefox 浏览器中原生的 Object.prototype.watch 函数,
  // 则调用 initWatch 初始化 watch 选项。
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {};
  const props = (vm._props = {});
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = (vm.$options._propKeys = []);
  const isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  for (const key in propsOptions) {
    keys.push(key);
    const value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      const hyphenatedKey = hyphenate(key);
      if (
        isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)
      ) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        );
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
              `overwritten whenever the parent component re-renders. ` +
              `Instead, use a data or computed property based on the prop's ` +
              `value. Prop being mutated: "${key}"`,
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key);
    }
  }
  toggleObserving(true);
}

function initData(vm: Component) {
  // 在合并选项 data 时, vm.$options.data 最终被处理成了一个函数
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};

  // 使用 isPlainObject 函数判断变量 data 是不是一个纯对象，如果不是纯对象那么在非生产环境会打印警告信息。
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== "production" &&
      warn(
        "data functions should return an object:\n" +
          "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
        vm
      );
  }

  // proxy data on instance 实例上的代理数据
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    // 检测 data 上的字段名是否与 props 上或者 methods 上重复
    // 这里有一个优先级的关系: props 优先级 > methods 优先级 > data优先级
    if (process.env.NODE_ENV !== "production") {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
      // isReserved 函数通过判断一个字符串的第一个字符是不是 $ 或 _ 来决定其是否是保留的，Vue 是不会代理那些键名以 $ 或 _ 开头的字段的，因为 Vue 自身的属性和方法都是以 $ 或 _ 开头的，所以这么做是为了避免与 Vue 自身的属性和方法相冲突。
    } else if (!isReserved(key)) {
      // 其余情况就会执行 proxy 函数, 实现实例对象的代理访问
      proxy(vm, `_data`, key);
    }
  }
  // observe data
  // observe 函数最终将 data 数据对象转换成响应式的 -- 响应系统的开始
  observe(data, true /* asRootData */);
}

// 处理 data 选项的函数 -- 通过调用 data 选项从而获取数据对象
export function getData(data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, `data()`);
    return {};
  } finally {
    popTarget();
  }
}

const computedWatcherOptions = { lazy: true };

// 初始化计算属性
function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR 计算属性只是 SSR 期间的 getter
  // 判断是否是服务端渲染
  const isSSR = isServerRendering();

  for (const key in computed) {
    const userDef = computed[key];
    // computed 有两种写法, 可以分别定义 getter 和 setter
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    if (process.env.NODE_ENV !== "production" && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm);
    }

    // 非服务端渲染的实现
    if (!isSSR) {
      // create internal watcher for the computed property. 为计算属性创建内部观察程序
      // 创建一个观察者实例对象, 称之为 计算属性的观察者, 同时会把计算属性的观察者添加到 watchers 常量对象中,键值是对应计算属性的名字
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        // 用来标识一个观察者对象是计算属性的观察者
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the 组件定义的计算属性已在
    // component prototype. We only need to define computed properties defined 组件原型。我们只需要定义定义的计算属性
    // at instantiation here. 在这里实例化。
    // 计算属性不能与 data, props, methods 中的属性同名
    if (!(key in vm)) {
      // 将计算属性定义在组件实例对象上.
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== "production") {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(
          `The computed property "${key}" is already defined as a prop.`,
          vm
        );
      }
    }
  }
}

// 通过 Object.defineProperty 函数在组件实例对象上定义与计算属性同名的组件实例属性
export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  // 用来标识是否应该缓存值，也就是说只有在非服务端渲染的情况下计算属性才会缓存值。
  const shouldCache = !isServerRendering();
  if (typeof userDef === "function") {
    // 如果 shouldCache 为假说明是服务端渲染，由于服务端渲染不需要缓存值，所以直接使用 userDef 函数作为 sharedPropertyDefinition.get 的值。
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (
    process.env.NODE_ENV !== "production" &&
    sharedPropertyDefinition.set === noop
  ) {
    sharedPropertyDefinition.set = function() {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

// 用于设置计算属性的缓存
function createComputedGetter(key) {
  return function computedGetter() {
    // 获取计算属性对应的 watchers 实例
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      // 判断是否为计算属性
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}

function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}

function initMethods(vm: Component, methods: Object) {
  const props = vm.$options.props;
  for (const key in methods) {
    if (process.env.NODE_ENV !== "production") {
      if (typeof methods[key] !== "function") {
        warn(
          `Method "${key}" has type "${typeof methods[
            key
          ]}" in the component definition. ` +
            `Did you reference the function correctly?`,
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(`Method "${key}" has already been defined as a prop.`, vm);
      }
      if (key in vm && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
            `Avoid defining component methods that start with _ or $.`
        );
      }
    }
    vm[key] =
      typeof methods[key] !== "function" ? noop : bind(methods[key], vm);
  }
}

// 初始化 watch 选项
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      // 观察回调函数可以是数组, 也就是说我们在使用 watch 选项时可以通过传递数组来实现创建多个观察者
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

// 将 $watch 纯对象形式的参数规范化一下, 然后在通过 $watch 函数并将其返回.
function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}

export function stateMixin(Vue: Class<Component>) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {};
  dataDef.get = function() {
    return this._data;
  };
  const propsDef = {};
  propsDef.get = function() {
    return this._props;
  };
  if (process.env.NODE_ENV !== "production") {
    // 当为非生产环境,不能修改 $data 和 $props 属性,并抛出警告(生产环境也不能修改,只是不会抛出警告)
    dataDef.set = function() {
      warn(
        "Avoid replacing instance root $data. " +
          "Use nested data properties instead.",
        this
      );
    };
    propsDef.set = function() {
      warn(`$props is readonly.`, this);
    };
  }
  // $data 属性实际上代理的是 _data 这个实例属性
  Object.defineProperty(Vue.prototype, "$data", dataDef);
  // $props 代理的是 _props 这个实例属性
  Object.defineProperty(Vue.prototype, "$props", propsDef);

  // 在 Vue.prototype 上定义三个方法
  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  // $watch 方法的实现本质就是创建一个 Watcher 实例对象.
  Vue.prototype.$watch = function(
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this;
    if (isPlainObject(cb)) {
      // watch 有不同的写法, 当为对象写法时, 另行处理
      return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    options.user = true;
    // 创建 watcher 观察对象观察 expOrFn 指定观察属性
    const watcher = new Watcher(vm, expOrFn, cb, options);
    // options.immediate: 是否立即执行
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(
          error,
          vm,
          `callback for immediate watcher "${watcher.expression}"`
        );
      }
    }
    // 用于解除当前观察者对属性的观察
    return function unwatchFn() {
      watcher.teardown();
    };
  };
}
