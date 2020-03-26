/*
 * @Descripttion: 选项的合并
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-26 17:05:30
 */
/* @flow */

import config from "../config";
import { warn } from "./debug";
import { set } from "../observer/index";
import { unicodeRegExp } from "./lang";
import { nativeWatch, hasSymbol } from "./env";

import { ASSET_TYPES, LIFECYCLE_HOOKS } from "shared/constants";

import {
  extend,
  hasOwn,
  camelize,
  toRawType,
  capitalize,
  isBuiltInTag,
  isPlainObject
} from "shared/util";

/**
 * Option overwriting strategies are functions that handle 选项覆盖策略是处理
 * how to merge a parent option value and a child option 如何合并父选项值和子选项
 * value into the final value. value 转化为最终 value
 */
// 刚导入进来是一个空对象, 在下面的代码下会逐步添加合并策略
const strats = config.optionMergeStrategies;

/**
 * Options with restrictions 有限制的选项
 */
// 合并 el 选项和 propsData 选项的
if (process.env.NODE_ENV !== "production") {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    // 如果没有 vm 参数(当创建子组件时,是没有传入 vm 参数的),则说明处理的是子组件
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        "creation with the `new` keyword."
      );
    }
    return defaultStrat(parent, child);
  };
}

/**
 * Helper that recursively merges two data objects together. 递归地将两个数据对象合并在一起的助手
 */
// 将 from 对象的属性混合到 to 对象中，也可以说是将 parentVal 对象的属性混合到 childVal 中，最后返回的是处理后的 childVal 对象。
function mergeData(to: Object, from: ?Object): Object {
  // 没有 from 直接返回 to
  if (!from) return to;
  let key, toVal, fromVal;

  // 获取 from 上所有的 key -- ES6 新增了其他数据结构, 需要判断是否支持 ES6
  const keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);
  // 遍历 from 的 key
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === "__ob__") continue;
    toVal = to[key];
    fromVal = from[key];
    // 如果 from 对象中的 key 不在 to 对象中，则使用 set 函数为 to 对象设置 key 及相应的值
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);

      // 如果 from 对象中的 key 也在 to 对象中，且这两个属性的值都是纯对象则递归进行深度合并
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
    // 其他情况什么都不做
  }
  return to;
}

/**
 * Data 处理 data 的合并策略 -- 以及 provide 选项的合并策略
 */
export function mergeDataOrFn(
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    // in a Vue.extend merge, both should be functions 在 Vue.extend 合并中，两者都应该是函数
    // 由于 childVal 和 parentVal 必定会有其一，否则便不会执行 strats.data 策略函数，
    // 所以下面判断的意思就是：如果没有子选项则使用父选项，没有父选项就直接使用子选项，且这两个选项都能保证是函数，
    // 返回父类的 data 选项 -- Vue.extend 会多层继承
    /** 例如:
     * const Parent = Vue.extend({
     *   data: function () {
     *     return {
     *       test: 1
     *     }
     *   }
     * })
     *
     * const Child = Parent.extend({})
     */
    if (!childVal) {
      return parentVal;
    }
    // 返回子组件的 data 选项本身
    if (!parentVal) {
      return childVal;
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    // 返回 mergedDataFn 函数 -- 暂时不会调用
    return function mergedDataFn() {
      return mergeData(
        typeof childVal === "function" ? childVal.call(this, this) : childVal,
        typeof parentVal === "function" ? parentVal.call(this, this) : parentVal
      );
    };
  } else {
    // 当合并处理的是非子组件的选项时 `data` 函数为 `mergedInstanceDataFn` 函数
    return function mergedInstanceDataFn() {
      // instance merge
      const instanceData =
        typeof childVal === "function" ? childVal.call(vm, vm) : childVal;
      const defaultData =
        typeof parentVal === "function" ? parentVal.call(vm, vm) : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
}

// 选项 data 的合并策略
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    // 子组件的 data 选项合并, 如果不是函数, 发出一个警告, 并且直接返回 parentVal
    if (childVal && typeof childVal !== "function") {
      process.env.NODE_ENV !== "production" &&
        warn(
          'The "data" option should be a function ' +
          "that returns a per-instance value in component " +
          "definitions.",
          vm
        );

      return parentVal;
    }
    return mergeDataOrFn(parentVal, childVal);
  }

  return mergeDataOrFn(parentVal, childVal, vm);
};

/**
 * Hooks and props are merged as arrays. 合并生命周期成数组
 */
function mergeHook(
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  /**
   * (是否有 childVal，即判断组件的选项中是否有对应名字的生命周期钩子函数)
   *   ? 如果有 childVal 则判断是否有 parentVal
   *     ? 如果有 parentVal 则使用 concat 方法将二者合并为一个数组
   *     : 如果没有 parentVal 则判断 childVal 是不是一个数组
   *       ? 如果 childVal 是一个数组则直接返回
   *       : 否则将其作为数组的元素，然后返回数组
   *   : 如果没有 childVal 则直接返回 parentVal
   */
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res ? dedupeHooks(res) : res;
}

// 去除重复生命周期函数
function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook;
});

/**
 * Assets 资源(components, filters, directives)
 *
 * When a vm is present (instance creation), we need to do 当vm存在时（实例创建），我们需要
 * a three-way merge between constructor options, instance 构造函数选项、实例之间的三向合并
 * options and parent options. 选项和父选项
 */
function mergeAssets(
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  // 将 parentVal 作为原型, 生成一个对象
  const res = Object.create(parentVal || null);
  if (childVal) {
    process.env.NODE_ENV !== "production" &&
      assertObjectType(key, childVal, vm);
    // 存在 childVal 时, 使用 extend 将 childVal 上的属性混合到 res 对象上并返回
    return extend(res, childVal);
  } else {
    return res;
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + "s"] = mergeAssets;
});

/**
 * Watchers. 选项 watch
 *
 * Watchers hashes should not overwrite one 观察者 hashes 不应覆盖一个
 * another, so we merge them as arrays. 另一个，所以我们把它们合并成数组
 */
// 合并处理后的 watch 选项下的每个键值，有可能是一个数组，也有可能是一个函数。
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // work around Firefox's Object.prototype.watch... 处理Firefox的Object.prototype.watch
  // 当发现组件选项是浏览器原生的 watch 时，那说明用户并没有提供 Vue 的 watch 选项，直接重置为 undefined。
  if (parentVal === nativeWatch) parentVal = undefined;
  if (childVal === nativeWatch) childVal = undefined;
  /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null);
  if (process.env.NODE_ENV !== "production") {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) return childVal;
  const ret = {};
  // 将 parentVal 的属性混合到 ret 中，后面处理的都将是 ret 对象，最后返回的也是 ret 对象
  extend(ret, parentVal);
  for (const key in childVal) {
    // 由于遍历的是 childVal，所以 key 是子选项的 key，父选项中未必能获取到值，所以 parent 未必有值
    let parent = ret[key];
    // child 是肯定有值的，因为遍历的就是 childVal 本身
    const child = childVal[key];
    // 这个 if 分支的作用就是如果 parent 存在，就将其转为数组
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      // 最后，如果 parent 存在，此时的 parent 应该已经被转为数组了，所以直接将 child concat 进去
      ? parent.concat(child)
      // 如果 parent 不存在，直接将 child 转为数组返回
      : Array.isArray(child)
        ? child
        : [child];
  }
  return ret;
};

/**
 * Other object hashes. 其他对象 hashes
 */
// 添加 props、methods、inject 以及 computed 策略函数
strats.props = strats.methods = strats.inject = strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // 如果存在 childVal，那么在非生产环境下要检查 childVal 的类型
  if (childVal && process.env.NODE_ENV !== "production") {
    assertObjectType(key, childVal, vm);
  }
  // parentVal 不存在的情况下直接返回 childVal
  if (!parentVal) return childVal;
  // 如果 parentVal 存在，则创建 ret 对象，然后分别将 parentVal 和 childVal 的属性混合到 ret 中，
  // 注意：由于 childVal 将覆盖 parentVal 的同名属性
  const ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) extend(ret, childVal);
  // 最后返回 ret 对象。
  return ret;
};
// 选项 provide 的合并策略
strats.provide = mergeDataOrFn;

/**
 * Default strategy. 默认合并策略
 */
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined ? parentVal : childVal;
};

/**
 * Validate component names 验证组件的名字是否符合要求的
 */
function checkComponents(options: Object) {
  for (const key in options.components) {
    validateComponentName(key);
  }
}

export function validateComponentName(name: string) {
  if (
    !new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)
  ) {
    warn(
      'Invalid component name: "' +
      name +
      '". Component names ' +
      "should conform to valid custom element name in html5 specification."
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      "Do not use built-in or reserved HTML elements as component " +
      "id: " +
      name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the 确保所有props选项语法都规范化为
 * Object-based format. 基于对象的格式
 */
/**
 * 规范化 props 选项
 * props 写法有两种
 * 1. props: ['someData'] => 数组写法
 * 2. props: {} => 对象写法
 */
function normalizeProps(options: Object, vm: ?Component) {
  const props = options.props;
  if (!props) return;
  const res = {};
  let i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === "string") {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== "production") {
        warn("props must be strings when using array syntax.");
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : { type: val };
    }
  } else if (process.env.NODE_ENV !== "production") {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format. 将所有注入规范化为基于对象的格式
 */
function normalizeInject(options: Object, vm: ?Component) {
  const inject = options.inject;
  if (!inject) return;
  // 小技巧 -- normalized 与 options.inject 拥有相同的引用,这样修改 normalized 的时候, options.inject 也将受到影响
  const normalized = (options.inject = {});
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (process.env.NODE_ENV !== "production") {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format. 将原始函数指令规范化为对象格式
 */
function normalizeDirectives(options: Object) {
  const dirs = options.directives;
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key];
      if (typeof def === "function") {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType(name: string, value: any, vm: ?Component) {
  if (!isPlainObject(value)) {
    warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`,
      vm
    );
  }
}

/**
 * Merge two option objects into a new one. 合并两个选项对象为一个新的对象
 * Core utility used in both instantiation and inheritance. 这个函数在实例化和继承的时候都有用到\
 * 注意点:
 * 1.这个函数将会产生一个新的对象；
 * 2.这个函数不仅仅在实例化对象(即_init方法中)的时候用到，在继承(Vue.extend)中也有用到，所以这个函数应该是一个用来合并两个选项对象为一个新对象的通用程序。
 */

export function mergeOptions(
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  // 非生产环境下
  if (process.env.NODE_ENV !== "production") {
    // 检查 child(即组件的 options) 组件名是否正确
    checkComponents(child);
  }

  if (typeof child === "function") {
    child = child.options;
  }

  /**
   * 规范化 props 选项
   * props 写法有两种
   * 1. props: ['someData'] => 数组写法
   * 2. props: {} => 对象写法
   */
  normalizeProps(child, vm);
  /**
   * 规范化 inject 选项 -- 写法同 props, 具体见 vue 文档
   */
  normalizeInject(child, vm);
  /**
   * 规范化 directives 选项 -- 写法具体见 vue 文档
   */
  normalizeDirectives(child);

  // Apply extends and mixins on the child options, 在子选项上应用extends和mixins
  // but only if it is a raw options object that isn't 但前提是它是一个原始选项对象，而不是
  // the result of another mergeOptions call. 另一个mergeOptions调用的结果
  // Only merged options has the _base property. 只有合并的选项才具有“_base”属性
  if (!child._base) {
    // 处理 extends 选项 -- 因为 extends 类似于 Vue 传入的 options ,所以需要对其进行 options 合并
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    // 处理 mixins 选项 -- 因为 mixins 类似于 Vue 传入的 options ,所以需要对其进行 options 合并
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  const options = {};
  // 下面两个循环目的: 使用在 parent 或者 child 对象中的出现的 key 合集
  let key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    // 选项合并策略
    const strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset(
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== "string") {
    return;
  }
  const assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id];
  const camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) return assets[camelizedId];
  const PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId];
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== "production" && warnMissing && !res) {
    warn("Failed to resolve " + type.slice(0, -1) + ": " + id, options);
  }
  return res;
}
