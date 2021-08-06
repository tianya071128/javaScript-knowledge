/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-30 11:55:15
 */
/* @flow */

import { hasOwn } from "shared/util";
import { warn, hasSymbol } from "../util/index";
import { defineReactive, toggleObserving } from "../observer/index";

export function initProvide(vm: Component) {
  const provide = vm.$options.provide;
  if (provide) {
    // 添加到 vm._provided 属性中
    vm._provided = typeof provide === "function" ? provide.call(vm) : provide;
  }
}

export function initInjections(vm: Component) {
  // 根据当前组件的 inject 选项去父代组件中寻找注入的数据，并将最终的数据返回。
  const result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== "production") {
        defineReactive(
          vm,
          key,
          result[key],
          // 自定义 setter , 当尝试修改 inject 数据时, 会发出警告
          () => {
            warn(
              `Avoid mutating an injected value directly since the changes will be ` +
                `overwritten whenever the provided component re-renders. ` +
                `injection being mutated: "${key}"`,
              vm
            );
          }
        );
      } else {
        defineReactive(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

// 根据当前组件的 inject 选项去父代组件中寻找注入的数据，并将最终的数据返回。
export function resolveInject(inject: any, vm: Component): ?Object {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached 注入是：任何，因为流不够聪明，无法计算缓存
    const result = Object.create(null);
    // 获取所有键名
    const keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

    for (let i = 0; i < keys.length; i++) {
      // 获取键
      const key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === "__ob__") continue;
      // 获取值
      const provideKey = inject[key].from;
      let source = vm;
      while (source) {
        // 检测了 source._provided 属性是否存在，并且 source._provided 对象自身是否拥有 provideKey 键，如果有则说明找到了注入的数据
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }
        // 递归引用父组件, 直至找到根组件
        source = source.$parent;
      }
      // 还没有找到数据
      if (!source) {
        // 是否定义了 default 选项
        if ("default" in inject[key]) {
          const provideDefault = inject[key].default;
          result[key] =
            typeof provideDefault === "function"
              ? provideDefault.call(vm)
              : provideDefault;
        } else if (process.env.NODE_ENV !== "production") {
          warn(`Injection "${key}" not found`, vm);
        }
      }
    }
    return result;
  }
}
