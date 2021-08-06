/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-30 11:05:37
 */
/* @flow */

import { warn } from "./debug";
import { observe, toggleObserving, shouldObserve } from "../observer/index";
import {
  hasOwn,
  isObject,
  toRawType,
  hyphenate,
  capitalize,
  isPlainObject
} from "shared/util";

type PropOptions = {
  type: Function | Array<Function> | null,
  default: any,
  required: ?boolean,
  validator: ?Function
};

// 校验 props
/**
 * key：prop 的名字
 * propsOptions：整个 props 选项对象
 * propsData：整个 props 数据来源对象
 * vm：组件实例对象
 */
export function validateProp(
  key: string,
  propOptions: Object,
  propsData: Object,
  vm?: Component
): any {
  const prop = propOptions[key];
  // 外界是否传递了该 prop 给组件
  // true: 表示 prop 数据缺失
  const absent = !hasOwn(propsData, key);
  // 读取 propsData 对应 key 的值, 在外界没有传递相应的 prop 数据, 那么 value 就是 undefined
  let value = propsData[key];
  // boolean casting 布尔型转换
  // 判断 prop.type 中是否存在 Boolean 类型
  const booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    // 大于 -1，说明在定义 props 时指定了 Boolean 类型
    if (absent && !hasOwn(prop, "default")) {
      // 外界没有为组件传递该 prop，并且该 prop 也没有指定默认值
      // 此时, 提供一个默认值 false
      value = false;
    } else if (value === "" || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if 仅将空字符串/同名转换为布尔值
      // boolean has higher priority 布尔值具有更高的优先级
      const stringIndex = getTypeIndex(String, prop.type);
      // 没有定义 String 类型 || 虽然定义了 String 类型，但是 String 类型的优先级没有 Boolean 高
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value 检查默认值
  if (value === undefined) {
    // 获取默认值
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy, 因为默认值是一个新副本，
    // make sure to observe it. 一定要注意。
    // 取到的默认值是非响应式的, 我们需要将其重新定义为响应式数据.
    const prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    process.env.NODE_ENV !== "production" &&
    // skip validation for weex recycle-list child component props
    !(__WEEX__ && isObject(value) && "@binding" in value)
  ) {
    // prop 类型校验
    assertProp(prop, key, value, vm, absent);
  }
  return value;
}

/**
 * Get the default value of a prop. 获取 prop 的默认值
 */
function getPropDefaultValue(
  vm: ?Component,
  prop: PropOptions,
  key: string
): any {
  // no default, return undefined 无默认值，返回 undefined
  if (!hasOwn(prop, "default")) {
    return undefined;
  }
  const def = prop.default;
  // warn against non-factory defaults for Object & Array 警告对象和数组的非工厂默认值
  // 在非生产环境下，如果你的 prop 默认值是对象类型，那么则会打印警告信息，告诉你需要用一个工厂函数返回这个对象类型的默认值，
  if (process.env.NODE_ENV !== "production" && isObject(def)) {
    warn(
      'Invalid default value for prop "' +
        key +
        '": ' +
        "Props with type Object/Array must use a factory function " +
        "to return the default value.",
      vm
    );
  }
  // the raw prop value was also undefined from previous render, 原始属性值也未从以前的渲染中定义，
  // return previous default value to avoid unnecessary watcher trigger 返回以前的默认值以避免不必要的监视程序触发器
  if (
    vm &&
    vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key];
  }
  // call factory function for non-Function types 为非函数类型调用工厂函数
  // a value is Function if its prototype is function even across different execution context 如果一个值的原型是跨不同执行上下文的函数，那么它就是函数
  return typeof def === "function" && getType(prop.type) !== "Function"
    ? def.call(vm)
    : def;
}

/**
 * Assert whether a prop is valid. 断言道具是否有效
 */
function assertProp(
  prop: PropOptions,
  name: string,
  value: any,
  vm: ?Component,
  absent: boolean
) {
  // 验证 必填项(required)
  if (prop.required && absent) {
    warn('Missing required prop: "' + name + '"', vm);
    return;
  }
  // value 值为 null 或 undefined，并且该 prop 是非必须的, 在这种情况下就不需要做后续的校验了。
  if (value == null && !prop.required) {
    return;
  }
  let type = prop.type;
  // !type 说明如果开发者在定义 prop 时没有规定该 prop 值的类型，则不需要校验
  // 定义 prop 时直接将类型设置为 true，也代表不需要做 prop 校验。
  let valid = !type || type === true;
  const expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      // 如果不是数组则将其包装成一个数组。
      type = [type];
    }
    for (let i = 0; i < type.length && !valid; i++) {
      const assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || "");
      valid = assertedType.valid;
    }
  }

  // 若 valid 的值为假, 那么则打印警告信息提示开发者所传递的 prop 值的类型不符合预期
  if (!valid) {
    warn(getInvalidTypeMessage(name, value, expectedTypes), vm);
    return;
  }
  // 开发提供的 自定义验证函数
  const validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType(
  value: any,
  type: Function
): {
  valid: boolean,
  expectedType: string
} {
  let valid;
  // 获取 type 类型字符串表示
  const expectedType = getType(type);

  if (simpleCheckRE.test(expectedType)) {
    // 验证基本类型 'String'、'Number'、'Boolean'、'Function' 以及 'Symbol'
    const t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects 对于基本包装对象
    if (!valid && t === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    // 处理对象
    valid = isPlainObject(value);
  } else if (expectedType === "Array") {
    // 处理数组
    valid = Array.isArray(value);
  } else {
    // 对于自定义类型，只需要检查值是否为该自定义类型构造函数的实例即可。
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}

/**
 * Use function string name to check built-in types, 使用函数字符串名称检查内置类型
 * because a simple equality check will fail when running 因为一个简单的等式检查在运行时会失败
 * across different vms / iframes. 跨不同的vm/iframe。
 */
// 通过比较构造函数的类型来比较是否 type 相同
function getType(fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
// 比较给定的参数是否为同一类型
function isSameType(a, b) {
  return getType(a) === getType(b);
}

function getTypeIndex(type, expectedTypes): number {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  for (let i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i;
    }
  }
  return -1;
}

function getInvalidTypeMessage(name, value, expectedTypes) {
  let message =
    `Invalid prop: type check failed for prop "${name}".` +
    ` Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (
    expectedTypes.length === 1 &&
    isExplicable(expectedType) &&
    !isBoolean(expectedType, receivedType)
  ) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}

function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}

function isExplicable(value) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some(elem => value.toLowerCase() === elem);
}

function isBoolean(...args) {
  return args.some(elem => elem.toLowerCase() === "boolean");
}
