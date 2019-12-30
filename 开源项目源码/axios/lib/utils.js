/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2019-12-18 21:29:18
 * @LastEditTime : 2019-12-30 15:36:39
 */
"use strict";

var bind = require("./helpers/bind");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * 确定值是否为 an Array
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === "[object Array]";
}

/**
 * 确定值是否为 undefined
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === "undefined";
}

/**
 * 确定值是否为 Buffer(一种比较少见的数据)
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是 Buffer，则为True，否则为false
 */
function isBuffer(val) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    typeof val.constructor.isBuffer === "function" &&
    val.constructor.isBuffer(val)
  );
}

/**
 * 确定值是否为ArrayBuffer
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是ArrayBuffer，则为True，否则为false
 */
function isArrayBuffer(val) {
  // 利用 toString 测试
  return toString.call(val) === "[object ArrayBuffer]";
}

/**
 * 确定值是否为FormData
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是 FormData ，则为True，否则为false
 */
function isFormData(val) {
  // 利用 instanceof 测试
  return typeof FormData !== "undefined" && val instanceof FormData;
}

/**
 * 确定值是否为 ArrayBuffer(更不懂的数据类型)
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是 ArrayBuffer ，则为True，否则为false
 */
function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }
  return result;
}

/**
 * 确定值是否为 a String
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === "string";
}

/**
 * 确定值是否为 a Number
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === "number";
}

/**
 * 确定值是否为 Object
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是 Object，则为True，否则为false
 */
function isObject(val) {
  return val !== null && typeof val === "object";
}

/**
 * 确定值是否为 a Date
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === "[object Date]";
}

/**
 * 确定值是否为 File
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是 File ，则为True，否则为false
 */
function isFile(val) {
  // 直接通过 val的 Class
  return toString.call(val) === "[object File]";
}

/**
 * 确定值是否为 Blob
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是 Blob ，则为True，否则为false
 */
function isBlob(val) {
  // 利用 val 中内部属性[[Class]]
  return toString.call(val) === "[object Blob]";
}

/**
 * 确定值是否为 Function
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是 Function ，则为True，否则为false
 */
function isFunction(val) {
  return toString.call(val) === "[object Function]";
}

/**
 * 确定值是否为 Stream(流, node)
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是 Stream ，则为True，否则为false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * 确定值是否为 URLSearchParams 对象
 *
 * @param {Object} val 要测试的值
 * @returns {boolean} 如果值是 URLSearchParams 对象 ，则为True，否则为false
 */
function isURLSearchParams(val) {
  return (
    typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams
  );
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

/**
 * 确定我们是否在标准浏览器环境中运行
 *
 * 这允许在一个Web工作者中运行，并响应本地.
 * 两种环境都支持 XMLHttpRequest，但不支持完全标准的全局参数.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (
    typeof navigator !== "undefined" &&
    (navigator.product === "ReactNative" ||
      navigator.product === "NativeScript" ||
      navigator.product === "NS")
  ) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * 迭代数组或对象，为每个项调用函数.(定义了 forEach 方法名, 还以为是数组的原生API)
 *
 * 如果 “obj” 是数组回调，则将调用传递
 * 每个项的值、索引和完整数组。
 *
 * 如果 “obj” 是对象，则将调用回调
 * 每个属性的值、键和完整对象.
 *
 * @param {Object|Array} obj 要迭代的对象
 * @param {Function} fn 要为每个项调用的回调
 */
function forEach(obj, fn) {
  // 如果没有提供任何价值，请不要费心(检测是否为 null 或者 undefined)
  if (obj === null || typeof obj === "undefined") {
    return;
  }

  // 如果还没有可写的东西，就强制一个数组
  if (typeof obj !== "object") {
    // eslint 使用 注释
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      // 判断是否是 obj 上的属性, 而不是原型上的
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * 接受期望每个参数都是对象的varargs，然后
 * 不可变地合并每个对象的属性并返回结果.
 *
 * 当多个对象包含同一个键时
 * 参数列表将优先.
 *
 * 例子:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * 合并对象
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === "object" && typeof val === "object") {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * 函数等于合并，其区别是没有引用
 * 保留到原始对象
 *
 * @see merge
 * @param {Object} obj1 要合并的对象
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === "object" && typeof val === "object") {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === "object") {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * 通过可变地向对象a添加对象b的属性来扩展对象a。
 *
 * @param {Object} a 要扩展的对象
 * @param {Object} b 要从中复制属性的对象
 * @param {Object} thisArg 要将函数绑定到的对象
 * @return {Object} 对象a的结果值
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === "function") {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};
