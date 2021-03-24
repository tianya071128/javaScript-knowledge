/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = global || self, global.Vue = factory());
}(this, function () {
  'use strict';

  /*  */

  var emptyObject = Object.freeze({}); // 已冻结的空对象

  // These helpers produce better VM code in JS engines due to their 这些辅助程序在JS引擎中生成更好的VM代码
  // explicitness and function inlining. 显式和函数内联
  function isUndef(v) {
    return v === undefined || v === null
  }

  // 指定值不为 undefined 或 null
  function isDef(v) {
    return v !== undefined && v !== null
  }

  // 指定值是否为 true
  function isTrue(v) {
    return v === true
  }

  // 指定值是否为 false
  function isFalse(v) {
    return v === false
  }

  /**
   * Check if value is primitive. 检查 value 是否为 基础类型(string, number, symbol, boolean)
   */
  function isPrimitive(value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell 快速对象检查-这主要用于告诉
   * Objects from primitive values when we know the value 对象从我们知道的原始值的值
   * is a JSON-compliant type. 是符合json的类型吗
   * 作用：检测是否为对象(包含基于 Array, Set 等基于 Object 的)
   */
  function isObject(obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value, e.g., [object Object]. 获取一个值的原始类型字符串，例如[object object]。
   */
  var _toString = Object.prototype.toString;

  function toRawType(value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true 严格对象类型检查。只返回true
   * for plain JavaScript objects. 对于普通JavaScript对象
   * 作用：检测是否指定值是否为 Object 对象
   */
  function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
  }

  // 检查指定值是否为 正则
  function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index. 检查val是否为有效的数组索引
   */
  function isValidArrayIndex(val) {
    var n = parseFloat(String(val)); // 转化为 number 类型
    return n >= 0 && Math.floor(n) === n && isFinite(val) // n >= 0 && n 是一个整数 && n 是一个有限数值
  }

  // 指定值是否为 promise
  function isPromise(val) {
    return (
      isDef(val) && // val 不为undefined 或 null
      typeof val.then === 'function' && // val 具有 then 方法
      typeof val.catch === 'function' // val 具有 catch 方法
    )
  }

  /**
   * Convert a value to a string that is actually rendered. 将值转换为实际呈现的字符串
   * 作用：转化为字符串
   */
  function toString(val) {
    return val == null
      ? '' // 为 null 或 undefind 情况，返回 ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString) // 数组 || 对象
        ? JSON.stringify(val, null, 2) // 序列化
        : String(val) // 否则直接 String 转化
  }

  /**
   * Convert an input value to a number for persistence. 将输入值转换为一个数字以实现持久性
   * If the conversion fails, return original string. 如果转换失败，返回原始字符串
   */
  function toNumber(val) {
    var n = parseFloat(val); // 尝试转化为 number
    return isNaN(n) ? val : n // 失败则返回原值
  }

  /**返回一个验证函数，用于检测指定值是否包含在 str 集合中
   * Make a map and return a function for checking if a key 创建一个映射并返回一个函数来检查是否有键
   * is in that map. 在地图上
   */
  function makeMap(
    str, // 字符串，格式为 xxx,xxx,xxx
    expectsLowerCase // 是否将验证值转化为小写
  ) {
    var map = Object.create(null); // 创建一个对象
    var list = str.split(','); // 拆分 str 参数
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true; // 将拆分的 list 添加到 map 对象中
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag. 检查标签是否为内置标签
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if an attribute is a reserved attribute. 检查一个属性是否为保留属性
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array. 从数组中移除项
   */
  function remove(arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property. 检查一个对象是否具有该属性
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty; // 借用 hasOwnProperty：对象是否具有该属性，并且不是从原型链中继承
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key) // 借用 hasOwnProperty
  }

  /** 创建一个缓存求值结果值的缓存函数
   * Create a cached version of a pure function. 创建纯函数的缓存版本
   */
  function cached(
    fn // 需要缓存的函数
  ) {
    var cache = Object.create(null); // 缓存对象，缓存其结果
    return (function cachedFn(str) {
      var hit = cache[str]; // 判断是否存在缓存值
      return hit || (cache[str] = fn(str)) // 如果不存在缓存值，则求值并缓存
    })
  }

  /**
   * Camelize a hyphen-delimited string. Camelize 一个以连字符分隔的字符串
   * 作用：将 - 连接的字符串转化为驼峰字符串，例如：v-model 转化为 vModel
   */
  var camelizeRE = /-(\w)/g; // 检测 - 连接的字符串：xx-xx-xx
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /** 
   * Capitalize a string. 利用一个字符串
   * 作用：将首字母变成大写，并缓存其结果
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string. 驼峰字符串用连字符
   * 作用：将驼峰字符串转化为 - 连接的字符串，例如 vModel 转化为 v-module
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it, 用于不支持它的环境的简单绑定填充
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore 例如,PhantomJS 1.x 严格来说，我们不需要这个了
   * since native bind is now performant enough in most browsers. 因为本机绑定现在在大多数浏览器中已经具备了足够的性能
   * But removing it would mean breaking code that was able to run in 但是删除它意味着破坏能够运行的代码
   * PhantomJS 1.x, so this must be kept for backward compatibility. PhantomJS 1x，因此为了向后兼容，必须保留它
   */

  /* istanbul ignore next */
  // 自定义实现 bind 方法，改变上下文
  function polyfillBind(fn, ctx) {
    function boundFn(a) {
      var l = arguments.length; // 提取参数
      return l
        ? l > 1 // 存在多个参数时
          ? fn.apply(ctx, arguments) // 使用 apply 调用 - 似乎不管几个参数，都可以直接使用 apply() 调用，不知道这样调用的原因
          : fn.call(ctx, a) // 使用 call 调用 - 似乎不管几个参数，都可以直接使用 apply() 调用，不知道这样调用的原因
        : fn.call(ctx) // 不存在参数时，则直接改变 this 调用
    }

    boundFn._length = fn.length;
    return boundFn
  }

  // 原生 bind 的调用方式
  function nativeBind(fn, ctx) {
    return fn.bind(ctx)
  }

  // 借用 bind 方法，用于返回指定 this 指针的函数，但是注意调用方式改变，并且不能添加了预设参数
  /**
   * 例如，原生 bind 调用 fn.bind(ctx[,arg1[,arg2[...]]]) 可以预设多个参数
   * 而在这里，bind(fn, ctx) 并没有提供预设参数的作用
   */
  var bind = Function.prototype.bind // 检测原生是否支持 bind 方法
    ? nativeBind // 支持取原生
    : polyfillBind; // 不支持则 polyfill 一下

  /**
   * Convert an Array-like object to a real Array. 将类数组对象转换为实数组
   * 作用：类数组转化为数组
   */
  function toArray(list, start) {
    start = start || 0; // start：定义开始提取索引
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object. 将属性混合到目标对象中
   * 作用：合并对象
   */
  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key]; // 简单合并，直接将 _from 属性合并到 to
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject(arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation. 执行任何操作
   * Stubbing args to make Flow happy without leaving useless transpiled code 存根参数使流愉快，而不会留下无用的编译代码
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop(a, b, c) { }

  /**
   * Always return false. 总是返回错误
   */
  var no = function (a, b, c) { return false; };

  /* eslint-enable no-unused-vars */

  /**
   * Return the same value. 返回相同的值
   */
  var identity = function (_) { return _; };

  /**
   * Generate a string containing static keys from compiler modules.
   */
  function genStaticKeys(modules) {
    return modules.reduce(function (keys, m) {
      return keys.concat(m.staticKeys || [])
    }, []).join(',')
  }

  /**
   * Check if two values are loosely equal - that is, 检查两个值是否大致相等——也就是说
   * if they are plain objects, do they have the same shape? 如果它们是普通物体，它们是否具有相同的形状
   * 作用：判断 a 和 b 是否大致相等，
   */
  function looseEqual(a, b) {
    if (a === b) { return true } // 如果严格相等，则为 true
    var isObjectA = isObject(a); // 检测是否为对象
    var isObjectB = isObject(b); // 检测是否为对象
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a); // 检测是否为数组
        var isArrayB = Array.isArray(b); // 检测是否为数组
        if (isArrayA && isArrayB) { // 当两者都为数组时
          return a.length === b.length && a.every(function (e, i) { // 判断两者长度，并且对数组每项都进行比较
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) { // 当都为 Date 时
          return a.getTime() === b.getTime() // 通过时间戳来判断
        } else if (!isArrayA && !isArrayB) { // 其他情况
          var keysA = Object.keys(a); // 提取出所有属性 key
          var keysB = Object.keys(b); // 提取出所有属性 key
          return keysA.length === keysB.length && keysA.every(function (key) { // 判断两者长度，并且对每项进行判断
            return looseEqual(a[key], b[key])
          })
        } else { // 两者类型不同时，直接返回 false
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) { // 都不是对象的话
      return String(a) === String(b) // 转化为字符串比较
    } else {
      return false // 其余情况(一个是对象，一个是其他类型(包含 function, typeof 检测为 function))，都认为不是相等的
    }
  }

  /**
   * Return the first index at which a loosely equal value can be 返回一个大致相等的值所在的第一个索引
   * found in the array (if value is a plain object, the array must 在数组中找到(如果value是普通对象，则数组必须
   * contain an object of the same shape), or -1 if it is not present. 包含相同形状的对象)，如果不存在，则为-1
   * 作用：返回 arr 数组中是否存在某一项与指定值 val 大致相等的索引，如果没有找到返回 -1
   */
  function looseIndexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) { // 循环
      if (looseEqual(arr[i], val)) { return i } // arr 每项值都与指定值 val 比较
    }
    return -1 // 不存在情况下返回 -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once(fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  // SSR 标记属性
  var SSR_ATTR = 'data-server-rendered';

  // 资源列表
  var ASSET_TYPES = [
    'component', // 组件
    'directive', // 指令
    'filter' // 过滤器
  ];

  // 生命周期列表
  /**
   * 父子组件生命周期调用顺序：
   * 父组件 beforeCreate -> created -> beforeMount -> 
   * 子组件 beforeCreate -> created -> beforeMount -> 
   * 子组件的子组件 beforeCreate -> created -> beforeMount -> mounted ->
   * 子组件 mounted -> 父组件 mounted
   * 父组件 beforeUpdate -> 子组件 beforeUpdate
   * 子组件 updated -> 父组件 updated
   * 父组件 beforeDestroy -> 子组件 beforeDestroy
   * 子组件 destroyed -> 父组件 destroyed
   * 
   * 子组件 activated -> 父组件 activated
   * 父组件 deactivated -> 子组件 deactivated
   */
  var LIFECYCLE_HOOKS = [
    // beforeCreate：在这之前，已经初始化了组件的配置项 $options 以及相关属性定义，但是数据还没有准备好
    'beforeCreate', // 实例初始化之后，数据初始化前

    // created：在这里，已经初始化了相关数据，data,props,methods 等数据，但是 render，VNode 还没有准备好
    'created', // 数据初始化完成

    // beforeMount：在这一步， render 渲染函数已经准备好(template 模板已经解析)，但是还没有生成 VNode,更没有开始挂载 DOM
    'beforeMount', // 在挂在之前调用

    // mounted：已经通过 render 生成 VNode，而且已经通过 _update 将 DOM 生成并挂载在 DOM 树上，此时可以操作 DOM
    /**
     * 在根组件上，会将所有的子组件收集起来一起执行 组件 VNode 的 insert 插入钩子
     */
    'mounted', // 实例被挂在之后调用，此时 DOM 可访问，但是不能保证所有的子组件也已经被挂载
    /**
     * 在组件的 _update(vm.render()) 渲染过程中依赖的属性改变时，就会重新触发渲染过程
     * 此时在 Watcher的 before 钩子上执行 beforeUpdate 钩子
     * 在这里是还没有进行 Vnode 的更新的
     * 这里的顺序是父组件到子组件
     */
    'beforeUpdate', // 更新之前，虚拟 DOM 打补丁之前
    /** 
     * _update(vm.render()) 已经重新更新完毕，在更新过程中，通过所有的 wathcer 更新队列将所有组件收集起来了
     * 在 callUpdatedHooks 方法内部从后开始调用组件的 updated 钩子，此时顺序为子组件到父组件
     */
    'updated', // 已经重新渲染
    /**
     * 通过 $destroy() 方法来进行销毁工作，在这里父组件会先调用这个生命周期
     * 在这个生命周期之前，还没有开始销毁程序，实例是可用的
     */
    'beforeDestroy', // 实例销毁前，此时 this 还可用
    /**
     * 在父组件 $destroy() 方法中，会调用 __patch 方法来处理子组件，让子组件也会调用 $destroy() 方法进行销毁
     * 子组件会先调用这个 destroyed 生命周期
     * 在这里，组件的数据是可用的，但是 wathcers 已经被处理，也就不会被响应，同时 DOM 已经被移除出 DOM 树
     * 大致会将这些组件的内部引用销毁，这样垃圾收集机制会自动将这些内存回收
     */
    'destroyed', // 实例销毁后
    /**
     * 在这里，当执行 insert 插入钩子时，会分为两种情况，暂不理会
     * 最终表现就是执行 insert 钩子时，表示缓存组件重用
     * 此时会先递归子组件，让子组件先调用 activated 生命周期
     */
    'activated', // 被 keep-alive 缓存的组件激活时调用
    /**
     * 停用好理解，当需要销毁组件时，如果发现组件是一个需要缓存组件，则此时不进行销毁操作
     * 此时先调用父组件的 deactivated 钩子，在调用子组件的
     */
    'deactivated', // 被 keep-alive 缓存的组件停用时调用

    // errorCaptured：在组件的多个时期都可能执行，在组件的运行期间出现相关错误就会执行
    'errorCaptured', // 捕获到子孙组件错误时调用

    'serverPrefetch' // 
  ];

  /* Vue 的全局配置 */
  var config = ({
    /**
     * Option merge strategies (used in core/util/options) 选择合并策略
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null), // 自定义合并策略的选项。

    /**
     * Whether to suppress warnings. 是否抑制警告
     */
    silent: false, // 取消 Vue 所有的日志与警告。

    /**
     * Show production mode tip message on boot? 在启动时显示生产模式提示信息
     */
    productionTip: "development" !== 'production', // 设置为 false 以阻止 vue 在启动时生成生产提示

    /**
     * Whether to enable devtools 是否启用devtools
     */
    devtools: "development" !== 'production', // 是否允许 vue-devtools 检查代码

    /**
     * Whether to record perf 是否记录 perf
     */
    performance: false, // 设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。只适用于开发模式和支持 performance.mark API 的浏览器上。

    /**
     * Error handler for watcher errors 监视程序错误的错误处理程序
     */
    errorHandler: null, // 指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。

    /**
     * Warn handler for watcher warns 对于观察和警告的Warn处理程序
     */
    warnHandler: null, // 为 Vue 的运行时警告赋予一个自定义处理函数。注意这只会在开发者环境下生效，在生产环境下它会被忽略。

    /**
     * Ignore certain custom elements 忽略某些自定义元素
     */
    ignoredElements: [], // 须使 Vue 忽略在 Vue 之外的自定义元素 (e.g. 使用了 Web Components APIs)。否则，它会假设你忘记注册全局组件或者拼错了组件名称，从而抛出一个关于 Unknown custom element 的警告。

    /**
     * Custom user key aliases for v-on v-on的自定义用户密钥别名
     */
    // $flow-disable-line
    keyCodes: Object.create(null), // 给 v-on 自定义键位别名。

    /**
     * Check if a tag is reserved so that it cannot be registered as a 检查标签是否被保留，以便它不能被注册为
     * component. This is platform-dependent and may be overwritten. 组件。这是依赖于平台的，可能会被覆盖
     * 就是检测一个保留标签，这个标签是不能被注册为组件的
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component 检查属性是否被保留，以便不能将其用作组件
     * prop. This is platform-dependent and may be overwritten. 道具。这是依赖于平台的，可能会被覆盖
     * 就是检测一个属性，这个属性不能用作组件支持
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element. 检查标签是否为未知元素
     * Platform-dependent. 平台相关的
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element 获取元素的名称空间
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform. 解析特定平台的真实标记名
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value 检查一个属性是否必须使用 property 绑定，例如value
     * Platform-dependent. 平台相关的
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils 异步执行更新。用于Vue测试Utils
     * This will significantly reduce performance if set to false. 如果设置为false，这将显著降低性能。
     */
    async: true,

    /**
     * Exposed for legacy reasons 由于遗留原因而暴露
     * 生命周期列表
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * unicode letters used for parsing html tags, component names and property paths. 用于解析html标签、组件名称和属性路径的unicode字母
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * 跳过 \u10000-\uEFFFF due to it freezing up PhantomJS 跳绳 \u10000- uEFFFF，因为它冻结 PhantomJS
   */
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  /**
   * Check if a string starts with $ or _ 检查字符串是否以$或_开头
   */
  function isReserved(str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path. 解析简单路径
   * 用于 watch 选项时，将监听属性转化为函数形式
   */
  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]")); // 匹配不是 数字字母下划线 $符号   开头的为true
  function parsePath(path) {
    if (bailRE.test(path)) { // 不能监听内部属性
      return
    }
    var segments = path.split('.'); // 分割 . 属性
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]]; // 通过 obj[segments[i]] 触发 getter 求值操作，用来通知 dep 来收集这个 watcher 观察者
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__? 我们可以使用__proto__吗？ 
  // __proto__ 不是个标准属性，有些浏览器是不支持的
  var hasProto = '__proto__' in {};

  // Browser environment sniffing 浏览器环境中嗅探
  var inBrowser = typeof window !== 'undefined'; // 判断是否为浏览器环境

  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform; // 判断是否为 weex 环境
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase(); // weex 环境

  var UA = inBrowser && window.navigator.userAgent.toLowerCase(); // 提取出 UA 信息，用于判断浏览器环境
  var isIE = UA && /msie|trident/.test(UA); // 判断是否为 IE 环境
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0; // 判断是否为 IE9 环境
  var isEdge = UA && UA.indexOf('edge/') > 0; // 判断是否是否为 IE10+ 环境
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android'); // 安卓
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios'); // ios
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge; // 谷歌浏览器
  var isPhantomJS = UA && /phantomjs/.test(UA); // Phantom JS是一个服务器端的 JavaScript API 的 WebKit。 
  var isFF = UA && UA.match(/firefox\/(\d+)/); // firefox 浏览器

  // Firefox has a "watch" function on Object.prototype... Firefox在Object.prototype上有一个“watch”功能
  var nativeWatch = ({}).watch;

  // 检测浏览器是否支持 passive(可以标识事件监听器不会 preventDefault 方法阻止默认行为，这样事件监听就可以开两个线程分别处理默认行为和事件监听性) 特性
  // 具体可见 https://www.cnblogs.com/ziyunfei/p/5545439.html
  var supportsPassive = false;
  if (inBrowser) { // 浏览器环境
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get() {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      /**
       * addEventListener 的第三个参数支持对象形式，16 年新特性
       * {
       *    capture: false, // 等价于以前的 useCapture 参数, 触发事件阶段
       *    passive: false, // 是“顺从的”，表示它不会对事件的默认行为说 no，浏览器知道了一个监听器是 passive 的，它就可以在两个线程里同时执行监听器中的 JavaScript 代码和浏览器的默认行为了。
       *    once: false // 表明该监听器是一次性的
       * }
       */
      window.addEventListener('test-passive', null, opts); // 通过 addEventListener 方式注册事件，主要是为了检查是否支持 opts 对象参数，addEventListener 内部会读取 opts 的 passive 属性，这样就可以判断是否支持 passive 属性
    } catch (e) { }
  }

  // this needs to be lazy-evaled because vue may be required before 这需要进行延迟评估，因为以前可能需要 vue
  // vue-server-renderer can set VUE_ENV vue-server-renderer 可以设置 VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools 检测 devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__; // 是否为 浏览器环境 && 是否安装了 devtools

  /* istanbul ignore next */
  // 检测是否为原生内置函数
  function isNative(Ctor) {
    // 通过打印函数源码来判断，原生函数源码是带有 native code 标识的
    /**
     * function Symbol() { [native code] }
     */
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  // 是否支持 Symbol 特性，ES6 新增语法
  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) && // 检测 Symbol 对象是否存在 && Symbol 是否为内置函数
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys); // 检测 Relect && Reflect.ownKeys(用于返回对象自身所有属性，包括 Symbol) 是否为内置函数

  var _Set; // Set 语法，如果不支持则 自定义一下
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) { // 是否原生支持 Set
    // use native Set when available.
    _Set = Set; // 优先使用原生特性，性能更佳
  } else {
    // a non-standard Set polyfill that only works with primitive keys. 一个非标准的集合填充，只对原始键有效
    _Set = /*@__PURE__*/(function () {
      function Set() {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has(key) { // has 方法：判断是否存在该值
        return this.set[key] === true
      };
      Set.prototype.add = function add(key) { // add 方法：添加一个值
        this.set[key] = true;
      };
      Set.prototype.clear = function clear() { // clear 方法：清空所有值
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop; // 错误提示工具方法
  var tip = noop;
  // 获取组件的继承关系 -- 总的来讲，就是将组件的树结构关系输出，方便用户定义问题所在
  var generateComponentTrace = (noop); // work around flow check 绕流检查
  var formatComponentName = (noop);  // 获取组件的名称或从 file 路径中获取组件名称，如果没有的话则返回 <Anonymous>

  {
    var hasConsole = typeof console !== 'undefined'; //  是否支持 console
    // 过滤掉 class 中的 -_ 符号，并且把字母开头的改成大写
    var classifyRE = /(?:^|[-_])(\w)/g;
    var classify = function (str) {
      return str
        .replace(classifyRE, function (c) { return c.toUpperCase(); })
        .replace(/[-_]/g, '');
    };

    warn = function (msg, vm) {
      var trace = vm ? generateComponentTrace(vm) : ''; // 组件的继承关系追踪

      if (config.warnHandler) { // 为 Vue 的运行时警告赋予一个自定义处理函数。
        config.warnHandler.call(null, msg, vm, trace); // 如果用户自定义了，则交给用户处理
      } else if (hasConsole && (!config.silent)) {
        console.error(("[Vue warn]: " + msg + trace)); // 否则直接打印至控制台
      }
    };

    tip = function (msg, vm) { // 打印提示信息
      if (hasConsole && (!config.silent)) { // hasConsole:是否支持 console 对象 && config.silent：是否取消所有的日志和警告 
        console.warn("[Vue tip]: " + msg + ( // 使用 warn 打印信息
          vm ? generateComponentTrace(vm) : ''
        ));
      }
    };

    // 获取组件的名称或从 file 路径中获取组件名称，如果没有的话则返回 <Anonymous>
    formatComponentName = function (vm, includeFile) {
      if (vm.$root === vm) { // 是否是根组件
        return '<Root>' // 如果是根组件，返回 <Root>
      }
      var options = typeof vm === 'function' && vm.cid != null // vm 实例是一个函数(应该是函数式组件情况)
        ? vm.options // 在 vm.options 中获取参数
        : vm._isVue // 是否是组件
          ? vm.$options || vm.constructor.options // 在这里获取参数
          : vm; // 否则直接返回 vm 实例
      var name = options.name || options._componentTag; // 获取 name
      var file = options.__file; // 文件路径？
      if (!name && file) { // 如果不存在 name && 存在 file
        var match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1]; // 从文件路径中获取 name
      }

      return (
        (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") + // 存在组件名称 ? 将组件名称转化成驼峰命名 : 返回匿名组件 <Anonymous>
        (file && includeFile !== false ? (" at " + file) : '') // 并且判断是否返回文件路径
      )
    };

    var repeat = function (str, n) {
      var res = '';
      while (n) {
        if (n % 2 === 1) { res += str; }
        if (n > 1) { str += str; }
        n >>= 1;
      }
      return res
    };

    // 获取组件的继承关系 -- 总的来讲，就是将组件的树结构关系输出，方便用户定义问题所在
    generateComponentTrace = function (vm) {
      if (vm._isVue && vm.$parent) { // 是否为组件 && 是一个子组件
        var tree = []; // 组件树集合
        var currentRecursiveSequence = 0;
        while (vm) { // 递归查找
          if (tree.length > 0) { // 如果集合中存在 vm 实例
            var last = tree[tree.length - 1]; // 取出最后一个
            if (last.constructor === vm.constructor) {
              currentRecursiveSequence++;
              vm = vm.$parent;
              continue
            } else if (currentRecursiveSequence > 0) {
              tree[tree.length - 1] = [last, currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push(vm); // 直接往 tree 集合中推入 vm 
          vm = vm.$parent; // 查找 vm 的父组件
        }
        return '\n\nfound in\n\n' + tree
          .map(function (vm, i) {
            return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
              ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
              : formatComponentName(vm)));
          })
          .join('\n')
      } else { // 否则直接返回该组件的名称序列
        return ("\n\n(found in " + (formatComponentName(vm)) + ")")
      }
    };
  }

  /*  */

  var uid = 0; // dep id

  /**
   * A dep is an observable that can have multiple dep是一个可以有多个的可见对象
   * directives subscribing to it. 订阅它的指令
   */
  var Dep = function Dep() {
    this.id = uid++; // 设置 id
    this.subs = []; // 观察者(订阅者)集合
  };

  // 添加一个观察对象 -- 去重工作在 Watcher.addDep 中已经完成，这里无需重复实现
  Dep.prototype.addSub = function addSub(sub) {
    this.subs.push(sub);
  };

  // 进行观察者回收
  Dep.prototype.removeSub = function removeSub(sub) {
    remove(this.subs, sub); // 从观察者队列 subs 中删除 sub 项
  };

  // 观察者收集
  Dep.prototype.depend = function depend() {
    if (Dep.target) { // 存在观察对象
      Dep.target.addDep(this); // 借用 Dep.target(观察对象) 进行依赖收集(收集在 subs 集合中) -- 这样借用是因为观察对象也需要收集所有观察到的属性并且防止重复收集
    }
  };

  // 触发观察者回调
  Dep.prototype.notify = function notify() {
    // stabilize the subscriber list first 首先稳定订阅服务器列表
    var subs = this.subs.slice(); // 返回订阅列表副本
    if (!config.async) {
      // subs aren't sorted in scheduler if not running async 如果不运行异步，子程序不会在调度器中排序
      // we need to sort them now to make sure they fire in correct 我们现在需要对它们进行分类，以确保它们正确发射
      // order 订单
      subs.sort(function (a, b) { return a.id - b.id; }); // 进行排序
    }
    for (var i = 0, l = subs.length; i < l; i++) { // 遍历观察对象
      subs[i].update(); // 触发观察者回调
    }
  };

  // The current target watcher being evaluated. 正在评估当前的目标观察者
  // This is globally unique because only one watcher 这在全球是独一无二的，因为只有一个观察者
  // can be evaluated at a time. 可以一次评估吗
  Dep.target = null; // 用于存储全局唯一的观察者
  var targetStack = []; // 观察者队列 -- 用于当需要禁用依赖收集时

  // 重置观察者队列 -- 如果传入空之类的 false 值，表示不进行依赖收集
  function pushTarget(target) {
    targetStack.push(target); // 添加进观察者队列
    Dep.target = target; // 目前观察者
  }

  // 去除最后一个观察者
  function popTarget() {
    targetStack.pop(); // 去除最后一个观察者
    Dep.target = targetStack[targetStack.length - 1]; // 将最顶部观察者置为全局观察者
  }

  /*  */
  // VNode 构造器
  var VNode = function VNode(
    tag, // 标签名，文本节点或注释节点为 undefinde
    data, // 节点对应数据的对象，包含
    children, // 子节点
    text, // 文本
    elm, // 当前 vnode 表示的 dom
    context, // 编译作用域
    componentOptions, // 如果是组件的 VNode，表示组件的 option 选项
    asyncFactory // 异步工厂
  ) {
    this.tag = tag; // 保存标签名
    this.data = data; // 保存节点数据对象
    this.children = children; // 保存子节点
    this.text = text; // 保存文本
    this.elm = elm; // 对应的 dom
    this.ns = undefined; // 节点命名空间？
    this.context = context; // 编译作用域

    this.fnContext = undefined; // 
    this.fnOptions = undefined;
    this.fnScopeId = undefined;

    this.key = data && data.key; // 节点的 key 属性，用于节点的唯一标识，用于优化节点
    this.componentOptions = componentOptions; // 组件 VNode 的 options
    this.componentInstance = undefined; // 组件节点 VNode 对应的实例
    this.parent = undefined; // 当前节点 VNode 对应的父 Vnode
    this.raw = false; // 简而言之就是是否为原生 HTML 或只是普通文本，innerHTML 的时候为 true，textContent 的时候为 false
    this.isStatic = false; // 静态节点标志
    this.isRootInsert = true; // 是否作为跟节点插入
    this.isComment = false; // 是否为注释节点
    this.isCloned = false; // 是否为克隆节点
    this.isOnce = false; // 是否有v-once指令
    this.asyncFactory = asyncFactory; // 异步工厂
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties(VNode.prototype, prototypeAccessors);

  // 创建一个新的 VNode
  var createEmptyVNode = function (text) {
    if (text === void 0) text = ''; // text === undefined，则重置 test = ''

    var node = new VNode(); // 生成 VNode
    node.text = text; // 
    node.isComment = true;
    return node
  };

  function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode(vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype; // Array 实例方法
  var arrayMethods = Object.create(arrayProto); // 继承至 Array.prototype 的对象

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events 拦截突变的方法并发出事件
   */
  methodsToPatch.forEach(function (method) {
    // cache original method 缓存的原方法
    var original = arrayProto[method]; // 原始数组方法缓存
    // 拦截部分数组原生方法，进行额外操作
    def(arrayMethods, method, function mutator() {
      var args = [], len = arguments.length;
      while (len--) args[len] = arguments[len]; // 处理参数

      var result = original.apply(this, args); // 调用原生数组方法
      var ob = this.__ob__; // 获取 ob 响应式对象
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args; // 如果是这两个方法，说明参数都是新增值
          break
        case 'splice':
          inserted = args.slice(2); // 如果是这个方法，就需要对参数截取除了前两位的值
          break
      }
      if (inserted) { ob.observeArray(inserted); } // 如果具有新增值，则通过 observeArray 来将新增值也进行响应式
      // notify change 通知更改
      ob.dep.notify(); // 这里就会触发对依赖这个数组的订阅者，例如：a: [2, 3], 因为这些原生方法不会触发 setter 方法，所以在调用方法后，手动更新对数组 a 的订阅者
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods); // 获取 arrayMethods 自身所有属性，不包括原型属性

  /**
   * In some cases we may want to disable observation inside a component's 在某些情况下，我们可能想要禁用组件内部的观察功能
   * update computation. 更新计算
   */
  var shouldObserve = true;

  // 对进行 observer 响应式控制 true：会深度转化为响应式 | false: 不会
  function toggleObserving(value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed 附加到每个被观察者的观察者类
   * object. Once attached, the observer converts the target 对象。一旦连接上，观察者就会转换目标
   * object's property keys into getter/setters that 对象的属性键化为getter/setter
   * collect dependencies and dispatch updates. 收集依赖项并分发更新
   */
  var Observer = function Observer(value) {
    this.value = value; // 保留源值
    this.dep = new Dep(); // 依赖收集集合
    this.vmCount = 0; // 标识
    def(value, '__ob__', this); // 为 value 添加一个 __ob__ 属性
    if (Array.isArray(value)) { // 如果是数组额外处理
      if (hasProto) { // 是否支持 __proto__ 非标准属性
        // 通过 __proto__ 拦截数组方法操作，这样的话，访问数组原生方法是访问 arrayMethods 对象，这里的部分原生方法是访问的已经处理响应式的方法
        protoAugment(value, arrayMethods);
      } else {
        // 直接将处理好的原生方法附加到 value 上，这样过的话，这样的话，访问数组原生方法是直接从 数组本身 上调用，而不是从 Array.prototype 上调用，没有处理的方法才会从 Array.prototype 上调用
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value); // 对象处理
    }
  };

  /**
   * Walk through all properties and convert them into 遍历所有属性并将它们转换为
   * getter/setters. This method should only be called when getter / setter。这个方法应该只在
   * value type is Object. 值类型为Object
   */
  Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj); // 获取所有的属性
    for (var i = 0; i < keys.length; i++) { // 遍历
      defineReactive$$1(obj, keys[i]); // 设置可观察属性
    }
  };

  /**
   * Observe a list of Array items. 观察数组项的列表
   */
  Observer.prototype.observeArray = function observeArray(items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]); // 对数组每项值进行响应式转化
    }
  };

  // helpers

  /**
   * Augment a target Object or Array by intercepting 通过拦截增强一个目标对象或数组
   * the prototype chain using __proto__ 使用__proto__的原型链
   * src：是一个已经处理好的数组原生方法集合
   */
  function protoAugment(target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src; // 通过 __proto__ 拦截数组方法操作
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining 通过定义来扩充目标对象或数组
   * hidden properties. 隐藏属性
   */
  /* istanbul ignore next */
  function copyAugment(target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) { // 遍历已经处理好的原生方法集合 keys
      var key = keys[i];
      def(target, key, src[key]); // 手动将处理好的原生方法添加到 target 上
    }
  }

  /**
   * Attempt to create an observer instance for a value, 尝试为一个值创建一个观察者实例
   * returns the new observer if successfully observed, 如果成功观察到，返回新的观察者
   * or the existing observer if the value already has one. 或者是现有的观察者(如果值已经为1)
   * 作用：对对象进行响应式转化
   */
  function observe(value, asRootData) {
    if (!isObject(value) || value instanceof VNode) { // 如果 value 不是对象 或者 属于 VNode 则不对其进行响应式
      return // 直接返回
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) { // value 存在 __ob__ 属性 && value.__ob__ 属于 Observer 属性 --- 表示该对象已经响应式
      ob = value.__ob__; // 直接返回已经响应式对象
    } else if (
      shouldObserve && // shouldObserve 是否可以进行转化响应式
      !isServerRendering() && // 是否是 SSR
      (Array.isArray(value) || isPlainObject(value)) && // value 是对象 || value 是对象
      Object.isExtensible(value) && // value 是否可扩展的
      !value._isVue // value 不是 vue 实例
    ) {
      ob = new Observer(value); // 此时进行响应式转化
    }
    if (asRootData && ob) { // 如果进行转化是一个组件的根数据，则需要对 ob 设置个 ID
      ob.vmCount++; // 统计有几个vm？？应该不是这个意思
      // 应该是说这个对象应用在那几个 vm 上，因为 data 选项可以定义为对象形式，这样各个组件的 data 共有这个对象
    }
    return ob
  }

  /**
   * Define a reactive property on an Object. 在对象上定义一个反应性属性
   */
  function defineReactive$$1(
    obj, // 对象
    key, // key
    val, // key 对应的值 - 通过闭包引用，在 get 取值函数中给用户
    customSetter, // 设置值后回调
    shallow // 不进行深度响应式
  ) {
    var dep = new Dep(); // 闭包引用 dep 依赖收集集合

    var property = Object.getOwnPropertyDescriptor(obj, key); // 获取属性描述
    if (property && property.configurable === false) { // 如果属性描述 configurable 设置了 false ，表示无法进行配置
      return // 静默失败
    }

    // cater for pre-defined getter/setters 适用于预定义的getter/setter
    var getter = property && property.get; // get 取值函数
    var setter = property && property.set; // set 赋值函数
    if ((!getter || setter) && arguments.length === 2) { // 没有取值函数 && 只传递两个参数
      val = obj[key]; // 此时从 obj 中取值
    }

    var childOb = !shallow && observe(val); // 深度响应式
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() { // 在 get 取值函数中，当有观察对象监听该属性时，就会自动触发，此时在这里处理依赖收集的工作，并将值返回
        var value = getter ? getter.call(obj) : val; // 获取 value 实际值
        if (Dep.target) { // 如果此时存在观察对象的话(通过 Dep.target 全局存储)，则进行依赖收集
          dep.depend(); // 通知闭包的 dep 进行依赖收集
          if (childOb) { // 如果存在深度响应式转化
            /**
             * 此时要说明一个问题：如果该 key 对象的 value 是一个对象，并对其进行深度监听，此时 childOb 就表示这个 value 响应式后得 Observe 实例
             * childOb.dep.depend() 的作用是将对这个 value 对应的 key 属性的依赖同样全部收集在 Observe 实例上的 dep 中
             * 因为 value 是一个对象的话，就可以通过 set 或 del 来进行属性的增删，此时 value 里面的属性都不会触发 setter，也就不会触发依赖
             * 就需要手动去调用 dep 收集依赖，但是这里是通过闭包引用的 dep，所以就需要将这里收集的依赖重复收集在 childOb.dep 上
             * 用于在 set 和 del 以及通过数组原生方法添加元素时手动触发依赖
             * 假如：对象 a: { b: 2, c: { d: 5 } } 这样的情况，在模板中，引用了 {{ a }}，此时如果通过 Set(a, 'e', 6) 设置了一个新属性
             * 那么应该也能触发依赖，重新渲染模板
             * 在这里，就需要在 Set 内部，手动触发所有引用了 a 对象的依赖
             * 那么另一种情况，也会产生不必要的更新：例如引用了 {{ a.c.d }}，通过 Set(a.c, 'e', 6) 设置属性，在这种情况，也会触发依赖更新
             */
            childOb.dep.depend(); // 这句代码的用意是什么？
            if (Array.isArray(value)) { // 如果 value 是数组
              /**
               * 对于数组而言，对每一项的获取是没有办法拦截的，所有需要将对数组属性的依赖全部也要收集到每一项中
               * 例如：c: [{ a: { b: 2 } }] 中，如果 Set(c[0], 'e', 2) 添加属性，此时对于数组而言，是需要重新更新依赖的
               */
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter(newVal) { // 在 setter 中，通过对赋值的拦截，来进行依赖的更新
        var value = getter ? getter.call(obj) : val; // 初始值
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) { // 判断 value 是否没有变化，此时不需要更新依赖
          return
        }
        /* eslint-enable no-self-compare */
        if (customSetter) { // 设置回调
          customSetter();
        }
        // #7981: for accessor properties without setter 对于没有setter的访问器属性
        if (getter && !setter) { return } // 对于没有 setter 的访问器属性，应该对其赋值行为静默失败
        if (setter) { // 设置了 setter 方法
          setter.call(obj, newVal); // 通过 setter 设置值
        } else {
          val = newVal; // 否则直接设置值
        }
        childOb = !shallow && observe(newVal); // 对新值进行深度响应式，并且更新 childOb
        dep.notify(); // 触发依赖
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and 在对象上设置属性。添加新的属性和
   * triggers change notification if the property doesn't 如果属性没有触发更改通知
   * already exist. 已经存在
   */
  function set(target, key, val) {
    if (isUndef(target) || isPrimitive(target) // 目标如果是 undefined 或 null 或 promise
    ) { // 此时发出警告
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) { // 如果目标值是一个数组  && key 是一个有效数组
      target.length = Math.max(target.length, key); // 改变 target 长度
      // 如果 target 数组是一个可观察对象，那么这个 splice 是已经被内部处理了的，是响应式的
      // 如果不是可观察的，那么调用 splice 简单的完成数据的更改即可
      target.splice(key, 1, val); // 利用 target.splice 方法进行数据的更改
      return val
    }
    if (key in target && !(key in Object.prototype)) { // 属性 key 已经存在 target 自身
      target[key] = val; // 直接返回值即可
      return val
    }
    var ob = (target).__ob__; // __ob__:引用的是 observe 对象，返回 observe 对象，用于标识该 target 对象是否已经被转化为响应式对象
    if (target._isVue || (ob && ob.vmCount)) { // 如果该目标是 vue 实例 || 组件的 _data 数据(根数据不能添加属性)
      warn( // 发出警告
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val // 并且返回值
    }
    if (!ob) { // 如果 target 不是可观测的
      target[key] = val; // 则直接改变 target 值
      return val
    }
    defineReactive$$1(ob.value, key, val); // 通过 defineReactive$$1 添加可响应式数据
    /**
     * 这一步需要理解一下，因为如果 target 改变了，可能依赖这个 target 的就需要触发回调
     * e.g 依赖了一个 {{ target }} 这样形式的，当 target 添加了属性，此时应该触发对应的观察者，而这个观察者就会被收集在 ob.dep 中
     * 但是如果依赖了 {{ target.xx }} 这样的，虽然 target 添加了属性与之无关，但是应该似乎无法检测这种情况，所以还是会触发观察者的回调
     */
    ob.dep.notify(); // 触发 ob.dep 中收集的依赖
    return val // 返回值
  }

  /**
   * Delete a property and trigger change if necessary. 删除属性并在必要时触发更改
   */
  function del(target, key) {
    if (isUndef(target) || isPrimitive(target) // 目标如果是 undefined 或 null 或 promise
    ) { // 此时发出警告
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) { // 如果目标值是一个数组  && key 是一个有效数组
      target.splice(key, 1); // 利用 target.splice 方法进行数据的更改
      return
    }
    var ob = (target).__ob__; // __ob__:引用的是 observe 对象，返回 observe 对象，用于标识该 target 对象是否已经被转化为响应式对象
    if (target._isVue || (ob && ob.vmCount)) { // 如果该目标是 vue 实例 || 组件的 _data 数据(根数据不能添加属性)
      warn(// 发出警告
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) { // 该属性不属于 target
      return
    }
    delete target[key]; // 直接进行删除属性操作
    if (!ob) { // 如果 target 不是可观测的
      return // 此时不需要触发依赖的更改
    }
    ob.dep.notify(); // 触发依赖的更改
  }

  /**
   * Collect dependencies on array elements when the array is touched, since 当数组被触动时，收集数组元素的依赖项
   * we cannot intercept array element access like property getters. 我们不能像拦截属性 getter 那样拦截数组元素访问
   */
  function dependArray(value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) { // 遍历数组
      e = value[i]; // 获取每项值
      e && e.__ob__ && e.__ob__.dep.depend(); // 对每项值的 dep 依赖收集
      if (Array.isArray(e)) { // 递归调用
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle 选项覆盖策略是处理
   * how to merge a parent option value and a child option 如何合并一个父选项值和一个子选项
   * value into the final value. 价值转化为最终价值
   */
  var strats = config.optionMergeStrategies; // 合并选项策略

  /**
   * Options with restrictions 选择与限制
   */
  {
    // 合并 el 和 propsData 选项策略
    strats.el = strats.propsData = function (parent, child, vm, key) {
      if (!vm) { // 当合并构造函数继承配置项时，此时发出警告
        warn(
          "option \"" + key + "\" can only be used during instance " +
          'creation with the `new` keyword.'
        );
      }
      return defaultStrat(parent, child) // 使用默认策略
    };
  }

  /**
   * Helper that recursively merges two data objects together. 递归地合并两个数据对象的助手
   * 注意：to 的优先级更高，即当 from 和 to 都存在同一属性时，to 优先级更高
   */
  function mergeData(to, from) {
    if (!from) { return to } // 如果 from 不存在，直接返回 to
    var key, toVal, fromVal;

    var keys = hasSymbol // 是否支持 symbol
      ? Reflect.ownKeys(from) // 获取所有 key（包含 symbol）
      : Object.keys(from); // 获取所有 key

    for (var i = 0; i < keys.length; i++) { // 遍历 key
      key = keys[i]; // 获取 key
      // in case the object is already observed... 如果这个物体已经被观测到
      if (key === '__ob__') { continue } // 不对 __ob__ 进行处理
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) { // 当 to 中不存在 key 时
        set(to, key, fromVal); // 此时通过 set 在 to 上设置属性，这样是为了兼容已经观测的对象
      } else if (
        toVal !== fromVal && // 当 fromVal 不等于 toVal
        isPlainObject(toVal) && // toVal 为对象
        isPlainObject(fromVal) // fromVal 为对象
      ) {
        mergeData(toVal, fromVal); // 递归合并
      }
    }
    return to
  }

  /**
   * Data
   * 作用：data 的合并策略 -- provide 的合并策略
   */
  function mergeDataOrFn(
    parentVal, // 父选项
    childVal, // 子选项
    vm // 可选参数，vue 实例
  ) {
    if (!vm) { // 当没有传递 vm 实例时，表示构造函数继承场景
      // in a Vue.extend merge, both should be functions Vue.extend 合并，两者都应该是函数
      if (!childVal) { // 当不存在子选项时，
        return parentVal // 直接返回父选项
      }
      if (!parentVal) { // 当不存在父选项时，
        return childVal // 直接返回子选项
      }
      // when parentVal & childVal are both present, 当 parentVal 和 childVal 都存在时
      // we need to return a function that returns the 我们需要返回一个返回
      // merged result of both functions... no need to 两个函数的合并结果…不需要
      // check if parentVal is a function here because 检查 parentVal 是否为函数，因为
      // it has to be a function to pass previous merges. 它必须是一个传递先前合并的函数
      return function mergedDataFn() { // 返回一个函数，函数内部返回合并后的结果，这样保证了 data 必须是一个函数
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else { // 当为实例化场景时
      return function mergedInstanceDataFn() { // 返回一个函数，用于确保 data 为函数，在之后的流程中，会调用这个函数获取 data 选项
        // instance merge
        var instanceData = typeof childVal === 'function' // 如果是函数
          ? childVal.call(vm, vm) // 调用其函数，
          : childVal; // 否则直接引用 childVal
        var defaultData = typeof parentVal === 'function' // 如果是函数
          ? parentVal.call(vm, vm) // 调用其函数
          : parentVal; // 否则直接引用 parentVal
        if (instanceData) { // 如果 childVal 子选项存在
          return mergeData(instanceData, defaultData) // 使用 mergeData 合并选项
        } else {
          return defaultData // 否则直接应用 parentVal 父选项
        }
      }
    }
  }

  // 合并 data 选项策略
  strats.data = function (
    parentVal, // 父选项
    childVal, // 子选项
    vm // vue 实例
  ) {
    if (!vm) { // 当为构造函数继承(例如使用 extend 方法时)时
      if (childVal && typeof childVal !== 'function') { // 若子选项不为函数
        warn(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        );

        return parentVal // 则使用父选项
      }
      return mergeDataOrFn(parentVal, childVal) // 使用 mergeDataOrFn 合并
    }

    return mergeDataOrFn(parentVal, childVal, vm) // 使用 mergeDataOrFn 合并
  };

  /**
   * Hooks and props are merged as arrays. 钩子和道具合并成阵列
   * 作用：hook 合并策略
   */
  function mergeHook(
    parentVal,
    childVal
  ) {
    var res = childVal // 如果存在子选项
      ? parentVal // 并且存在父选项
        ? parentVal.concat(childVal) // 直接将 childVal 和 parentVal 合并成一个数组
        : Array.isArray(childVal) // 当只存在子选项时，判断 children 是否为数组
          ? childVal // 此时直接使用 childVal
          : [childVal] // 不是数组时，包装为数组
      : parentVal; // 不存在子选项时，直接使用父选项
    return res
      ? dedupeHooks(res) // 删除重复的数据
      : res
  }

  // 数组去重
  function dedupeHooks(hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) { // 遍历数组
      if (res.indexOf(hooks[i]) === -1) { // 将重复项剔除
        res.push(hooks[i]);
      }
    }
    return res
  }

  LIFECYCLE_HOOKS.forEach(function (hook) { // 生命周期的合并策略
    strats[hook] = mergeHook; // 生命周期的合并策略
  });

  /**
   * Assets 资源
   *
   * When a vm is present (instance creation), we need to do 当存在vm时(创建实例)，我们需要这样做
   * a three-way merge between constructor options, instance 构造函数选项之间的三方向合并，实例
   * options and parent options. 选项和父选项
   * 作用：合并资源的策略
   */
  function mergeAssets(
    parentVal,
    childVal,
    vm,
    key
  ) {
    // 这样的话，最终会合并为 {组件name: val, __proto__: { KeepAlive: val, ... }}
    // 如果通过 extend 创建 vue 子类的话，这个就会形成更长的原型链
    // 这样做应该是为了节省内存，因为资源对象形式暂用的内存较大
    var res = Object.create(parentVal || null); // 使用 Object.create 继承 parentVal
    if (childVal) { // 存在子选项时
      assertObjectType(key, childVal, vm); // 检测资源是否以规范注册
      return extend(res, childVal) // 合并至 res 中
    } else { // 否则
      return res // 直接返回 res
    }
  }

  // 资源的资源策略
  ASSET_TYPES.forEach(function (type) { // 资源的资源策略
    strats[type + 's'] = mergeAssets; // 组件、指令、过滤器 合并策略
  });

  /**
   * Watchers. watch 选项
   *
   * Watchers hashes should not overwrite one 观察者散列不应该覆盖一个
   * another, so we merge them as arrays. 另一个，我们把它们合并成数组
   * 策略：不应该覆盖，应该将观察的同一个合并为一个数组
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch... 使用Firefox的Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; } // 兼容 firefox 写法
    if (childVal === nativeWatch) { childVal = undefined; } // 兼容 firefox 写法
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) } // 不存在子选项时，直接返回父选项
    {
      assertObjectType(key, childVal, vm); // 检测 watch 选项注册是否符合规范
    }
    if (!parentVal) { return childVal } // 不存在父选项时，直接返回子选项
    var ret = {};
    extend(ret, parentVal); // 先将 父选项 合并至 res 中
    for (var key$1 in childVal) { // 遍历子选项
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) { // 父选项中也存在 && parent 不为数组
        parent = [parent]; // 规范为数组
      }
      ret[key$1] = parent // parent 是否存在
        ? parent.concat(child) // 存在 - 直接合并父子选项为一个数组
        : Array.isArray(child) ? child : [child]; // 不存在 - 返回 child 数组形式
    }
    return ret
  };

  /**
   * Other object hashes. 其他对象散列
   * 策略：简单将 childVal 合并至 parentVal 中
   */
  strats.props =
    strats.methods =
    strats.inject =
    strats.computed = function (
      parentVal,
      childVal,
      vm,
      key
    ) {
      if (childVal && "development" !== 'production') { // 子选项存在
        assertObjectType(key, childVal, vm); // 检测注册形式是否符合规范
      }
      if (!parentVal) { return childVal } // 父选项不存在时，返回子选项
      var ret = Object.create(null);
      extend(ret, parentVal); // 合并 parentVal 至 ret 中
      if (childVal) { extend(ret, childVal); } // 如果子选项存在，则通过 extend 合并
      return ret
    };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy. 默认策略、
   * 策略：子选项为空 ？ 父选项 ：子选项
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined // 当子选项为空时
      ? parentVal // 使用父选项
      : childVal // 否则使用子选项
  };

  /**
   * Validate component names 验证组件名称 - 验证组件 options 中的 components 中的选项
   */
  function checkComponents(options) {
    for (var key in options.components) { // 递归验证组件中的名称
      validateComponentName(key);
    }
  }

  // 验证组件名称 必须是大小写开头，可以存在 _ - 等字符
  function validateComponentName(name) {
    if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) { // 通过正则验证
      warn( // 警告
        'Invalid component name: "' + name + '". Component names ' + // 无效的组件名:“+ name +”。组件名称
        'should conform to valid custom element name in html5 specification.' // 是否符合html5规范中有效的自定义元素名称
      );
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) { // 检查标签是否为内置标签(component, slot) && 判断指定标签是否为 html 标签 或者 svg 标签
      warn( // 发出警告
        'Do not use built-in or reserved HTML elements as component ' + // 不使用内置或保留HTML元素作为组件
        'id: ' + name // id: name
      );
    }
  }

  /**
   * Ensure all props option syntax are normalized into the 确保所有props选项语法都被规范化为
   * Object-based format. 基于对象的格式
   * 作用：props 选项有多个写法，最终都需要规范为对象写法
   */
  function normalizeProps(options, vm) {
    var props = options.props; // 提取出 props 选项
    if (!props) { return } // 当没有定义 props 时，直接返回
    var res = {}; // 定义个对象
    var i, val, name;
    if (Array.isArray(props)) { // 如果 props 定义为数组
      i = props.length;
      while (i--) { // 递归处理
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val); // 将 - 连接的字符串转化为驼峰字符串
          res[name] = { type: null };
        } else {
          warn('props must be strings when using array syntax.'); // 发出警告
        }
      }
    } else if (isPlainObject(props)) { // 如果 props 是对象写法
      for (var key in props) {
        val = props[key]; // 提取出值
        name = camelize(key); // 将 - 连接的字符串转化为驼峰字符串
        res[name] = isPlainObject(val) // 值是否为对象写法
          ? val
          : { type: val };
      }
    } else { // 其余情况，直接发出警告
      warn(
        "Invalid value for option \"props\": expected an Array or an Object, " +
        "but got " + (toRawType(props)) + ".",
        vm
      );
    }
    options.props = res; // 直接修改 options.props，也是会影响传入的 options 的，因为对象是引用类型
  }

  /**
   * Normalize all injections into Object-based format 将所有注入标准化为基于对象的格式
   * 作用：inject 选项有多个写法，最终都需要规范为对象写法
   */
  function normalizeInject(options, vm) {
    var inject = options.inject; // 提取出 inject 选项
    if (!inject) { return } // 如果没有定义 inject 选项，则直接返回
    var normalized = options.inject = {}; //  定义 normalized 参数并且让 options.inject 引用
    if (Array.isArray(inject)) { // 如果 inject 选项为数组形式
      for (var i = 0; i < inject.length; i++) { // 遍历 inject 进行处理
        normalized[inject[i]] = { from: inject[i] }; // 规范为 { from: value } 数据结构
      }
    } else if (isPlainObject(inject)) { // 如果 inject 选项为对象形式
      for (var key in inject) { // 遍历 inject 选项
        var val = inject[key]; // 提取出每项值
        normalized[key] = isPlainObject(val) //　如果每项值为对象
          ? extend({ from: key }, val) // 合并为最终对象
          : { from: val }; // 否则直接引用 val 
      }
    } else { // 其他数据结构则直接发出警告
      warn(
        "Invalid value for option \"inject\": expected an Array or an Object, " +
        "but got " + (toRawType(inject)) + ".",
        vm
      );
    }
  }

  /**
   * Normalize raw function directives into object format. 将原始函数指令规范化为对象格式
   */
  function normalizeDirectives(options) {
    var dirs = options.directives; // 提取出 directives 指令值
    if (dirs) { // 如果存在
      for (var key in dirs) { // 遍历指令
        var def$$1 = dirs[key]; // 提取出定义 val
        if (typeof def$$1 === 'function') { // 如果定义指令类型为函数，则规范为对象形式
          dirs[key] = { bind: def$$1, update: def$$1 }; // 直接定义函数为简写模式此时规范
        }
      }
    }
  }

  /**
   * name: 资源名称（组件、指令、过滤器）
   * value：组件、指令、过滤器配置项
   * vm：组件实例
   * 作用：检测资源是否为对象形式注册
   */
  function assertObjectType(name, value, vm) {
    if (!isPlainObject(value)) { // 检测 value 是否为对象，必须为对象形式
      warn( // 否则发出警告
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".",
        vm
      );
    }
  }

  /**
   * Merge two option objects into a new one. 将两个选项对象合并为一个新的对象
   * Core utility used in both instantiation and inheritance. 在实例化和继承中使用的核心实用程序
   * 返回一个合并好的选项，例如：
   * {
   *  components: {..., __proto__: {KeepAlive: ...}}
   *  data: f mergedIn...()
   *  directives: {},
   *  el: '#app',
   *  filters: {},
   *  _base: f Vue(options)
   * }
   */
  function mergeOptions(
    parent, // 父选项
    child, // 子选项，优先级更高
    vm // 当不传递时，表示合并的是构造函数继承时的配置项，传递时，表示的是实例化的配置项
  ) {
    {
      checkComponents(child); // 验证子选项的组件名称，parent 不需要验证，是因为 parent 在其他地方已经验证
    }

    if (typeof child === 'function') { // 如果 child 是一个函数
      child = child.options;
    }

    normalizeProps(child, vm); // 规范化 child.props 值
    normalizeInject(child, vm); // 规范化 child.inject 值
    normalizeDirectives(child); // 规范化 child.directives 值

    // Apply extends and mixins on the child options, 在子选项上应用扩展和混合
    // but only if it is a raw options object that isn't 但只有当它不是原始选项对象时才可以
    // the result of another mergeOptions call. 另一个合并期权调用的结果
    // Only merged options has the _base property. 只有合并选项具有_base属性
    // _base 当为 Vue 构造函数，或基于 Vue 构造函数的子类才会存在，且指向 Vue 构造函数
    if (!child._base) { // 应该是指当为合并组件 options 时，才需要进行这一步？
      if (child.extends) { // 当存在 extends 时，合并选项
        parent = mergeOptions(parent, child.extends, vm); // 在这里，会通过 mergeOptions 合并选项后返回一个合并后的选项
      }
      if (child.mixins) { // 当存在 mixins 时
        for (var i = 0, l = child.mixins.length; i < l; i++) { // 遍历 mixins，合并选项
          parent = mergeOptions(parent, child.mixins[i], vm); // 在这里，会通过 mergeOptions 合并选项后返回一个合并后的选项
        }
      }
    }

    var options = {};
    var key;
    for (key in parent) { // 遍历 parent
      mergeField(key); // 合并选项
    }
    for (key in child) { // 遍历 child
      if (!hasOwn(parent, key)) { // 当存在于子选项中，而不存在于父选项中
        mergeField(key); // 合并选项
      }
    }
    // 合并选型
    function mergeField(key) {
      var strat = strats[key] || defaultStrat; // 提取合并策略
      options[key] = strat(parent[key], child[key], vm, key); // 使用合并策略进行选项的合并
    }
    return options // 返回合并后的选项
  }

  /**
   * Resolve an asset. 解决一个资产
   * This function is used because child instances need access 之所以使用这个函数，是因为需要访问子实例
   * to assets defined in its ancestor chain. 到其祖先链中定义的资产
   * 查找资源(指令，组件，过滤器)
   */
  function resolveAsset(
    options, // 实例配置项
    type, // 资源类型(指令，组件，过滤器)
    id, // 唯一标识
    warnMissing // 没有找到是否发出警告
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') { // 如果不为字符串，不合法
      return
    }
    var assets = options[type]; // 提取指令资源类型
    // check local registration variations first
    if (hasOwn(assets, id)) { return assets[id] } // 首先直接尝试该 id 是否在资源集合中，找到直接返回
    var camelizedId = camelize(id); // 将 id 转化为驼峰命名
    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] } // 然后验证转化为驼峰命名的 id 是否在集合中
    var PascalCaseId = capitalize(camelizedId); // 将首字母转为大写
    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] } // 再次查找
    // fallback to prototype chain 回退到原型链
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId]; // 先在自身找，然后从原型链中查找
    if (warnMissing && !res) {
      warn( //　警告
        'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
        options
      );
    }
    return res　// 返回
  }

  /*  */


  // 验证 props 的值是否正确，并返回 prop 值
  function validateProp(
    key, // prop key
    propOptions, // 子组件注册值
    propsData, // 父组件传入值
    vm // 实例
  ) {
    var prop = propOptions[key]; // 提取用户注册信息
    var absent = !hasOwn(propsData, key); // 注册值是否由父组件传入
    var value = propsData[key]; // 提取 key 对应父组件传入值
    // boolean casting 布尔铸造
    var booleanIndex = getTypeIndex(Boolean, prop.type); // 判断 prop.type 中是否定义了 Boolean 值
    if (booleanIndex > -1) { // 如果定义了 Boolean 值
      if (absent && !hasOwn(prop, 'default')) { // 如果父组件没有传入 && 用户没有注册默认值
        value = false; // 则取 false
      } else if (value === '' || value === hyphenate(key)) { // 如果传入了 '' || value === key(转化为驼峰命名)
        // only cast empty string / same name to boolean if 仅将空字符串/相同名称转换为boolean if
        // boolean has higher priority 布尔值具有更高的优先级
        var stringIndex = getTypeIndex(String, prop.type); // 判断 prop.type 中是否定义了 String 值
        if (stringIndex < 0 || booleanIndex < stringIndex) { // 如果没有定义 String || 布尔值具有更高优先级
          value = true; // 则取 true
        }
      }
    }
    // check default value 检查默认值
    if (value === undefined) { // 如果父组件没有传入值
      value = getPropDefaultValue(vm, prop, key); // 获取默认值
      // since the default value is a fresh copy, 因为默认值是一个新拷贝
      // make sure to observe it. 一定要观察它
      var prevShouldObserve = shouldObserve; // 缓存 shouldObserve 标识位
      toggleObserving(true); // 打开标识位，用于创建可观察对象
      observe(value); // 对 value 进行观察
      toggleObserving(prevShouldObserve); // 重置标识位
    }
    {
      assertProp(prop, key, value, vm, absent); // 判断 prop 是否有效
    }
    return value
  }

  /**
   * Get the default value of a prop. 获取一个道具的默认值
   */
  function getPropDefaultValue(vm, prop, key) {
    // no default, return undefined 无默认值，返回undefined
    if (!hasOwn(prop, 'default')) {// 没有定义默认值
      return undefined // 返回 undefined
    }
    var def = prop.default; // 提取定义的默认值
    // warn against non-factory defaults for Object & Array 警告对象和数组的非工厂默认值
    if (isObject(def)) { // 如果定义的默认值是对象形式
      warn( // 则警告
        'Invalid default value for prop "' + key + '": ' +
        'Props with type Object/Array must use a factory function ' +
        'to return the default value.',
        vm
      );
    }
    // the raw prop value was also undefined from previous render, 原始道具的价值也是未定义的从以前的渲染
    // return previous default value to avoid unnecessary watcher trigger 返回以前的默认值，以避免不必要的监视触发器
    // 大概意思是，在初始化组件时，就会提取出默认值，而在更新阶段，如果父组件还是没有传入的话，就没有必要重新提取，以避免不必要的监视触发器
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key] // 使用缓存值
    }
    // call factory function for non-Function types 对非函数类型调用工厂函数
    // a value is Function if its prototype is function even across different execution context 如果一个值的原型是函数，那么它就是函数，即使在不同的执行上下文中也是如此
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm) // 如果默认值是一个函数，并且定义的不是函数
      : def // 否则返回 def
  }

  /**
   * Assert whether a prop is valid. 断言一个道具是否有效
   */
  function assertProp(
    prop, // 用户注册值
    name, // prop key
    value, // prop value
    vm, // 实例
    absent // 是否由父组件传入 false: 是由父组件传入
  ) {
    if (prop.required && absent) { // 如果 prop 是必传项 && 父组件没有传入
      warn( // 发出警告
        'Missing required prop: "' + name + '"',
        vm
      );
      return
    }
    if (value == null && !prop.required) { // 如果不是必传项 && 没有传入值
      return
    }
    var type = prop.type; // 定义 type 值
    var valid = !type || type === true; // 没有定义 || type 定义为 true(表示不需要验证)
    var expectedTypes = []; // 
    if (type) { // 定义了 type 情况下
      if (!Array.isArray(type)) { // 如果不是数组
        type = [type]; // 将其转化为数组
      }
      for (var i = 0; i < type.length && !valid; i++) { // 遍历 - 需要满足 valid 为 false(此时需要验证)
        var assertedType = assertType(value, type[i]); // 判断类型
        expectedTypes.push(assertedType.expectedType || '');
        valid = assertedType.valid; // 是否验证通过
      }
    }

    if (!valid) { // 如果判断不通过
      warn(
        getInvalidTypeMessage(name, value, expectedTypes),
        vm
      );
      return
    }
    var validator = prop.validator; // 自定义验证过函数
    if (validator) {
      if (!validator(value)) { // 自定义验证函数没有通过时
        warn(
          'Invalid prop: custom validator check failed for prop "' + name + '".',
          vm
        );
      }
    }
  }

  var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

  // 断言类型 判断 value 是否符合 type
  function assertType(value, type) {
    var valid;
    var expectedType = getType(type); // 获取 type 原生类型
    if (simpleCheckRE.test(expectedType)) { // 判断是否为 String|Number|Boolean|Function|Symbol 类型
      var t = typeof value; // 此时可用 typeof 判断
      valid = t === expectedType.toLowerCase(); // typeof 判断值 是否等于 type 原生类型值
      // for primitive wrapper objects 对于原始包装器对象
      if (!valid && t === 'object') { // valid false && value 类型为 object
        valid = value instanceof type; // 还可以通过原型链判断
      }
    } else if (expectedType === 'Object') { // 当为 Object 类型时
      valid = isPlainObject(value); // 判断 value 是否严格为 Object 类型
    } else if (expectedType === 'Array') { // Array 类型时
      valid = Array.isArray(value); // 判断 value 是否为 Array 类型
    } else {
      valid = value instanceof type; // 直接通过原型链判断
    }
    return {
      valid: valid,
      expectedType: expectedType
    }
  }

  /**
   * Use function string name to check built-in types, 使用函数字符串名检查内置类型
   * because a simple equality check will fail when running 因为简单的相等性检查在运行时会失败
   * across different vms / iframes. 跨不同的vm / iframe
   * 返回原生方法的名称 -- 例如 f String() 表示 string
   */
  function getType(fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  // 表示两个原生方法是否相同
  function isSameType(a, b) {
    return getType(a) === getType(b)
  }

  // 返回 type 在 expectedTypes 中的索引
  function getTypeIndex(type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) { // 判断 expectedTypes 是否为数组
      return isSameType(expectedTypes, type) ? 0 : -1 // 不是数组的话，判断两者是否相同
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) { // 如果是数组，则遍历数组
      if (isSameType(expectedTypes[i], type)) { // 比较数组每一项是否与 type 相同
        return i // 如果找到了则返回索引
      }
    }
    return -1 // 否则返回 -1
  }

  // 获取校验不通过时提示信息
  function getInvalidTypeMessage(name, value, expectedTypes) {
    var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', '));
    var expectedType = expectedTypes[0];
    var receivedType = toRawType(value);
    var expectedValue = styleValue(value, expectedType);
    var receivedValue = styleValue(value, receivedType);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
      message += " with value " + expectedValue;
    }
    message += ", got " + receivedType + " ";
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
      message += "with value " + receivedValue + ".";
    }
    return message
  }

  function styleValue(value, type) {
    if (type === 'String') {
      return ("\"" + value + "\"")
    } else if (type === 'Number') {
      return ("" + (Number(value)))
    } else {
      return ("" + value)
    }
  }

  function isExplicable(value) {
    var explicitTypes = ['string', 'number', 'boolean'];
    return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
  }

  function isBoolean() {
    var args = [], len = arguments.length;
    while (len--) args[len] = arguments[len];

    return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
  }

  /*  */

  // 错误处理策略 - 先由用户注册的 errorCaptured 钩子来处理错误，如果用户没有处理或选择向下处理，则由全局处理
  function handleError(err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering. 在处理错误处理程序时停用deps跟踪，以避免可能的无限渲染
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
      if (vm) {
        var cur = vm;
        while ((cur = cur.$parent)) { // 递归查找父组件
          var hooks = cur.$options.errorCaptured; // 父组件是否注册了 errorCaptured
          if (hooks) { // 如果注册了
            for (var i = 0; i < hooks.length; i++) { // 遍历 hooks
              try {
                var capture = hooks[i].call(cur, err, vm, info) === false; // 当返回了 false 后，阻止向上传递错误
                if (capture) { return }
              } catch (e) {
                globalHandleError(e, cur, 'errorCaptured hook'); // 用户不处理错误的话，就由全局错误处理
              }
            }
          }
        }
      }
      globalHandleError(err, vm, info); // 用户不处理错误的话，就由全局错误处理
    } finally {
      popTarget();
    }
  }

  // 在指定上下文中执行函数，并且处理错误信息
  function invokeWithErrorHandling(
    handler, // 执行函数
    context, // 上下文
    args, // 参数
    vm, // 实例
    info // 描述信息
  ) {
    var res;
    try { // try 包裹错误
      res = args ? handler.apply(context, args) : handler.call(context); // 执行回调
      if (res && !res._isVue && isPromise(res) && !res._handled) { // res 存在 && res 不为 vue 实例 && res 为 promise && 标识嵌套调用
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); }); // 在 catch 中捕获错误
        // issue #9511
        // avoid catch triggering multiple times when nested calls 避免在嵌套调用时多次触发catch
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info); // 出错时交给 handleError 方法处理
    }
    return res
  }

  // 全局错误处理 - 有全局 errorHandler 配置来处理错误，没有配置最终会通过 logError 来记录错误
  function globalHandleError(err, vm, info) {
    if (config.errorHandler) { // errorHandler：指定组件的渲染和观察期间未捕获错误的处理函数。
      try {
        return config.errorHandler.call(null, err, vm, info) // 错误处理
      } catch (e) {
        // if the user intentionally throws the original error in the handler, 如果用户故意在处理程序中抛出原始错误
        // do not log it twice 不要记录两次吗
        if (e !== err) {
          logError(e, null, 'config.errorHandler');
        }
      }
    }
    logError(err, vm, info);
  }

  // 记录错误
  function logError(err, vm, info) {
    {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm); // 打印错误
    }
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err); // 通过控制台输出
    } else {
      throw err
    }
  }

  /* 这里维护的是全局的回调队列，主要是通过 nextTick(可能是内部添加或用户添加) 添加回调 */

  var isUsingMicroTask = false; // 作用未知 -- 从代码中推测，可能是标识是否可以使用微任务队列

  var callbacks = []; // 回调队列
  var pending = false; // 是否准备开始执行回调机制

  // 开始执行队列
  function flushCallbacks() {
    pending = false; // 已经开始执行，此时就需要重置为 false
    var copies = callbacks.slice(0); // 截取回调队列副本
    callbacks.length = 0; // 将队列清空
    for (var i = 0; i < copies.length; i++) { // 遍历
      copies[i](); // 执行回调
    }
  }

  // Here we have async deferring wrappers using microtasks. 这里我们有使用微任务的异步延迟包装器。
  // In 2.5 we used (macro) tasks (in combination with microtasks). 在2.5中，我们使用(宏)任务(与微任务结合使用)。
  // However, it has subtle problems when state is changed right before repaint 但是，当状态在重绘之前改变时，它会有一些微妙的问题
  // (e.g. #6813, out-in transitions). (例如:#6813,out-in过渡)。
  // Also, using (macro) tasks in event handler would cause some weird behaviors 另外，在事件处理程序中使用(宏)任务会导致一些奇怪的行为
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109). 不能规避(例如:#7109，#7153，#7546，#7834，#8109)。
  // So we now use microtasks everywhere, again. 我们现在在所有地方都使用微任务。
  // A major drawback of this tradeoff is that there are some scenarios 这种权衡的一个主要缺点是有一些场景
  // where microtasks have too high a priority and fire in between supposedly 如果微任务的优先级太高，那么它就会被触发
  // sequential events (e.g. #4521, #6690, which have workarounds) 连续事件(例如:#4521，#6690)
  // or even between bubbling of the same event (#6566). 或者甚至在同一个事件(#6566)之间冒泡。
  var timerFunc; // 决定以 promise 或 setTimeout 等方式开始执行回调队列

  // The nextTick behavior leverages the microtask queue, which can be accessed nextTick行为利用了可以被访问的微任务队列
  // via either native Promise.then or MutationObserver. 通过本地承诺。然后或MutationObserver。
  // MutationObserver has wider support, however it is seriously bugged in MutationObserver得到了更广泛的支持，然而它被严重地窃听了
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It UIWebView在iOS中的触发>= 9.3.3它
  // completely stops working after triggering a few times... so, if native 触发几次后完全停止工作…所以,如果本地
  // Promise is available, we will use it: Promise是可用的，我们将使用它:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) { // 首先尝试使用 promise
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks); // 微队列执行 flushCallbacks 方法
      // In problematic UIWebViews, Promise.then doesn't completely break, but 在有问题的UIWebViews中，承诺。然后没有完全破裂，但是
      // it can get stuck in a weird state where callbacks are pushed into the 它可能会陷入一个奇怪的状态，回调被推入
      // microtask queue but the queue isn't being flushed, until the browser 微任务队列，但队列不被刷新，直到浏览器
      // needs to do some other work, e.g. handle a timer. Therefore we can 需要做一些其他的工作，例如处理一个定时器。因此,我们可以
      // "force" the microtask queue to be flushed by adding an empty timer. "force"通过添加一个空定时器来刷新微任务队列
      if (isIOS) { setTimeout(noop); } // 有注释可以看出，在 ios 上有时会不刷新微队列，此时可以通过执行一个 空定时器 来刷新微队列
    };
    isUsingMicroTask = true; // 支持微任务队列
  } else if (!isIE && typeof MutationObserver !== 'undefined' && ( // 不是 IE && MutationObserver 不是 undefined
    isNative(MutationObserver) || // MutationObserver 是原生方法
    // PhantomJS and iOS 7.x -- 这两个应该还有其他情况
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) { // 然后尝试使用 MutationObserver 方法，这个方法也是添加微队列方法
    // Use MutationObserver where native Promise is not available, 在原生 Promise 不可用时使用MutationObserver
    // e.g. PhantomJS, iOS7, Android 4.4 例如:PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11) (#6466 MutationObserver在IE11中不可靠)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks); // 创建 MutationObserver 对象
    var textNode = document.createTextNode(String(counter)); // 创建一个 text 文本节点
    observer.observe(textNode, { // 观察 textNode 节点
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter); // 改变 text 文本节点，用于触发 MutationObserver 回调
    };
    isUsingMicroTask = true; // 支持微任务队列
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) { // 接着尝试 setImmediate 方法
    // Fallback to setImmediate. 回退到setImmediate
    // Technically it leverages the (macro) task queue, 从技术上讲，它利用了(宏)任务队列
    // but it is still a better choice than setTimeout. 但是它仍然是一个比setTimeout更好的选择
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else { // 最后一定支持 setTimeout
    // Fallback to setTimeout. 回退到setTimeout
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  // 开启一个任务队列 或 将该回调添加进队列中
  /**
   * 这里强调解释一下，全局维护了一个 callbacks 队列，watcher 更新队列是另一个队列，watcher 更新队列是作为一个整体添加进 callbacks 队列中的
   * 也就是说，如果通过 nextTick(cb) 添加一个回调的话，这个回调一般都需要等待之前 watcher 队列全部执行完毕才会执行
   * e.g 
   * this.test1 = 2; // 触发重新渲染
   * this.$nextTick(callback) // 等待重新渲染后的 DOM 操作
   * this.test2 = xxx; // 触发了一个 watch 监听属性，此时 this.$nextTick(callback) 这个回调还是在 watcher 之后触发的
   */
  function nextTick(cb, ctx) {
    var _resolve; // 为了兼容 promise 形式
    // 将封装后的 cb 回调添加进回调队列中
    callbacks.push(function () {
      // 注意，不能同时支持回调和 promise 形式 -- 这应该也是有意为之的
      if (cb) { // 如果注册了 回调函数 cb
        try {
          cb.call(ctx); // 则调用 cb 回调函数
        } catch (e) {
          handleError(e, ctx, 'nextTick'); // 如果出错，将其交给 handleError 方法处理
        }
      } else if (_resolve) { // 如果支持 promise 形式，
        _resolve(ctx); // 则返回成功态
      }
    });
    if (!pending) { // 如果还没有执行回调机制
      pending = true; // 开始标识
      timerFunc(); // 准备开启执行回调机制
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') { // 如果没有注册回调 && 支持 Promise
      return new Promise(function (resolve) { // 返回 Promise 形式
        _resolve = resolve;
      })
    }
  }

  /*  */

  var mark;
  var measure;

  {
    // 浏览器性能监控
    var perf = inBrowser && window.performance; //  浏览器环境 && 浏览器支持 performance
    /* istanbul ignore if */
    if (
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ) {
      mark = function (tag) { return perf.mark(tag); };
      measure = function (name, startTag, endTag) {
        perf.measure(name, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
        // perf.clearMeasures(name)
      };
    }
  }

  /* not type checking this file because flow doesn't play well with Proxy 不检查此文件，因为流不能很好地使用代理 */

  var initProxy;

  {
    // 检测某个值是否是原生方法
    var allowedGlobals = makeMap(
      'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require' // for Webpack/Browserify
    );

    // 发出警告：不是在实例上定义的不能访问
    var warnNonPresent = function (target, key) {
      warn(
        "Property or method \"" + key + "\" is not defined on the instance but " +
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
        target
      );
    };

    // 发出警告：key 只能用 $data 访问，不能直接访问
    var warnReservedPrefix = function (target, key) {
      warn(
        "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
        'prevent conflicts with Vue internals. ' +
        'See: https://vuejs.org/v2/api/#data',
        target
      );
    };

    // 检测是否原生支持 Proxy
    var hasProxy =
      typeof Proxy !== 'undefined' && isNative(Proxy);

    if (hasProxy) {
      var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
      config.keyCodes = new Proxy(config.keyCodes, {
        set: function set(target, key, value) {
          if (isBuiltInModifier(key)) {
            warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
            return false
          } else {
            target[key] = value;
            return true
          }
        }
      });
    }

    // proxy has 拦截器：拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效，典型的就是 in 操作符
    var hasHandler = {
      has: function has(target, key) {
        var has = key in target; // 判断 key 是否在 target 上
        // 应该是标识是否可以访问属性 true(不可以访问)
        var isAllowed = allowedGlobals(key) || // key 是否为原生方法
          (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data)); // (key 为 _ 开头的属性(内部属性) && 不是 data 中的属性)
        if (!has && !isAllowed) {
          // 访问的 key 是否定义在 data 中
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return has || !isAllowed // 返回布尔值
      }
    };

    // proxy get 拦截器：拦截获取操作
    var getHandler = {
      get: function get(target, key) {
        if (typeof key === 'string' && !(key in target)) { // 不存在 target 中
          if (key in target.$data) { warnReservedPrefix(target, key); } // 是否存在 $data 中，发出警告
          else { warnNonPresent(target, key); } // 否则也需要发出警告
        }
        return target[key] // 返回目标值
      }
    };

    // 初始化用户渲染的上下文环境 _renderProxy：用于渲染时的上下文
    initProxy = function initProxy(vm) {
      if (hasProxy) { // 是否原生支持 proxy
        // determine which proxy handler to use 确定要使用哪个代理处理程序
        var options = vm.$options; // 提取出 $options
        // render 渲染 如果是渲染 并且含有 _withStripped
        var handlers = options.render && options.render._withStripped // 这应该表示用户使用 render 渲染
          ? getHandler // 判断是拦截 get 操作
          : hasHandler; // 还是 has 操作
        // 在 Proxy 实例中，对于没有定义的拦截操作，会执行原始操作
        // 例如只定义了 has 拦截，对于 get 操作，相当于直接操作 target[key]
        vm._renderProxy = new Proxy(vm, handlers); // 通过 proxy 代理，可以对属性访问进行拦截，这样可以对不允许访问的属性进行友好提示
      } else {
        vm._renderProxy = vm; // 不支持 proxy，直接代理 vm，就无法做到属性的检查
      }
    };
  }

  /*  */

  var seenObjects = new _Set(); // depId 队列 -- 用于防止重复监听对象

  /** 
   * Recursively traverse an object to evoke all converted 递归地遍历一个对象以唤起所有转换
   * getters, so that every nested property inside the object getter，以便对象内的每个嵌套属性
   * is collected as a "deep" dependency. 是否作为“深层”依赖收集
   */
  function traverse(val) {
    _traverse(val, seenObjects);
    seenObjects.clear(); // 清空队列
  }

  function _traverse(val, seen) {
    var i, keys;
    var isA = Array.isArray(val); // 判断是否为数组
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) { // 如果不是数组或对象 || 对象被冻结 || 对象为 VNode
      return // 此时直接返回
    }
    if (val.__ob__) { // 是否已经转化为响应式数据
      var depId = val.__ob__.dep.id; // 获取响应式对象的 dep id
      if (seen.has(depId)) { // 用来判断此 dep 是否已经监听了
        return // 不需要重新监听
      }
      seen.add(depId); // 进行缓存
    }
    if (isA) { // 如果是数组的话
      i = val.length;
      while (i--) { _traverse(val[i], seen); } // 遍历数组进行处理 -- 数组是无法通过 val[i] 来触发 getter 的，所以只能遍历数组里的项进行深度监听
    } else { // 否则的话
      keys = Object.keys(val); // 对象属性集合
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); } // 进行遍历，val[keys[i]] 这个操作就会触发 getter 进行依赖收集
    }
  }

  // 从指定 name 中提取对应事件特性，应该是 vue 内部使用的，表示事件特性
  // 例如 @onTest.passive.once="ceshi" 这样注册事件，vue 内部会将其名称转化为 &~ontest 表示其特性
  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name; // 如果 name 开头是 &，则去除 &
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first 最后加前缀，先检查
    name = once$$1 ? name.slice(1) : name; // 如果 name 开头是 ~，则去除 ~
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name; // 如果 name 开头是 !，则去除 !
    return {
      name: name, // 提取原本的 name
      once: once$$1, // 开头是 ~ 的表示 once 特性 -- 只触发一次回调
      capture: capture,　// 开头是 ! 的表示 capture 特性 -- 添加事件侦听器时使用 capture 模式
      passive: passive // 开头是 & 的表示 passive 特性 -- 以 { passive: true } 模式添加侦听器
    }
  });

  // 对传入的 fns 进行额外处理 - 执行回调时的 this 绑定等等
  function createFnInvoker(fns, vm) {
    function invoker() { // 这才是到时执行的方法
      var arguments$1 = arguments; // 获取参数

      var fns = invoker.fns; // 提取回调
      if (Array.isArray(fns)) { // 如果是数组
        var cloned = fns.slice(); // 复制副本
        for (var i = 0; i < cloned.length; i++) { // 遍历执行
          invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler"); // 执行函数
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler") // 直接执行单个回调
      }
    }
    invoker.fns = fns; // 将回调传入 fns 中， fns 可以是数组 -- 这样可以在更新事件的时候直接替换这个属性即可，并且可以追加事件
    return invoker // 返回封装了的函数
  }

  // 添加事件的方法 -- 通过传入的 add 和 remove$$1 方法来进行增删事件
  function updateListeners(
    on, // 事件
    oldOn, // 旧事件
    add, // 添加事件方法
    remove$$1, // 删除事件方法
    createOnceHandler, // 添加执行一次事件
    vm  // 实例
  ) {
    var name, def$$1, cur, old, event;
    for (name in on) { // 遍历事件
      def$$1 = cur = on[name]; // 提取事件
      old = oldOn[name]; // 判断是否存在旧事件
      // 例如 @onTest.passive.once="ceshi" 这样注册事件，vue 内部会将其名称转化为 &~ontest 表示其特性
      event = normalizeEvent(name); // 提取出事件特性，以及事件名称
      if (isUndef(cur)) { // 如果没有注册其具体事件
        warn( // 发出警告
          "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
          vm
        );
      } else if (isUndef(old)) { // 如果不存在旧事件，说明是新增事件
        if (isUndef(cur.fns)) { // 该事件没有进行内部转化，传入的方法名需要进行 this 绑定以及内部额外处理
          cur = on[name] = createFnInvoker(cur, vm); // 对 cur 回调进行额外处理
        }
        if (isTrue(event.once)) { // 是否是添加一次性回调
          cur = on[name] = createOnceHandler(event.name, cur, event.capture); // 通过 createOnceHandler 传入方法添加一次性回调
        }
        add(event.name, cur, event.capture, event.passive, event.params); // 添加事件
      } else if (cur !== old) { // 如果存在新旧事件，说明是更新事件
        old.fns = cur; // 此时说明 old 事件是经过 createFnInvoker 处理，只需要将 fns 替换即可
        on[name] = old; // 添加进 on 对象中，因为在下面还要对新旧事件的比对，去除多余旧事件
      }
    }
    for (name in oldOn) { // 遍历旧事件
      if (isUndef(on[name])) { // 此时说明事件已经失效
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture); // 删除事件
      }
    }
  }

  /*  */
  // 合并 vnode 的钩子
  /**
   * vue 内部存在需要深入组件渲染过程中的各个阶段，此时可通过 hook 机制来实现
   * 先将不同的钩子添加到 hook 中，这样在组件的渲染过程的特定阶段就会执行这里的钩子
   */
  function mergeVNodeHook(
    def, 
    hookKey, // 钩子类型
    hook // 钩子回调
  ) {
    if (def instanceof VNode) { // 如果 def 属于 VNode
      def = def.data.hook || (def.data.hook = {}); // 提取出组件的 hook 集合
    }
    var invoker;
    var oldHook = def[hookKey]; // 是否存在旧的 hook 回调

    // 继续封装一层 hook，用于在执行 hook 后删除钩子，也就是这个钩子只会调用一次
    function wrappedHook() {
      hook.apply(this, arguments); // 执行钩子
      // important: remove merged hook to ensure it's called only once 重要提示:删除合并钩子以确保它只被调用一次
      // and prevent memory leak 防止内存泄漏
      remove(invoker.fns, wrappedHook); // 删除钩子
    }

    if (isUndef(oldHook)) { // 如果旧的 hook 不存在
      // no existing hook 没有现有的钩子
      invoker = createFnInvoker([wrappedHook]); // 封装钩子集合成一个新的函数
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) { // 如果旧的 hook 存在，并且 merged(表示是经过这个方法合并的) 标识为 true
        // already a merged invoker 已经是合并的调用者
        invoker = oldHook; 
        invoker.fns.push(wrappedHook); // 这样只需要将需要添加的 hook 在经过函数封装后添加至 fns 集合中
      } else {
        // existing plain hook 现有普通钩
        invoker = createFnInvoker([oldHook, wrappedHook]); // 否则就需要通过 createFnInvoker 封装
      }
    }

    invoker.merged = true; // 将标识置为 true
    def[hookKey] = invoker; // 存储组装后的钩子
  }

  /*  */

  function extractPropsFromVNodeData(
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        {
          var keyInLowerCase = key.toLowerCase();
          if (
            key !== keyInLowerCase &&
            attrs && hasOwn(attrs, keyInLowerCase)
          ) {
            tip(
              "Prop \"" + keyInLowerCase + "\" is passed to component " +
              (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
              " \"" + key + "\". " +
              "Note that HTML attributes are case-insensitive and camelCased " +
              "props need to use their kebab-case equivalents when using in-DOM " +
              "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
            );
          }
        }
        checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp(
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren(children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren(children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode(node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren(children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */
  // 初始化 provide 选项
  function initProvide(vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function' // 很简单，就是将provided 的值赋值到 vm 实例的 _provided 上，这样子组件注入的时候就会在这里取
        ? provide.call(vm)
        : provide;
    }
  }

  // 初始化 inject -- 提取出 inject 选项(先从祖先组件中的 _provided 属性中找，没有找到则取默认值)，
  // 然后将其赋值到 vm 实例上，在这里不对 inject 值进行深度转化为响应式，而是通过 defineReactive$$1 方式添加到 vm 实例上，保证其为只读属性(并不会完全保证，但是至少会出发警告)
  function initInjections(vm) {
    var result = resolveInject(vm.$options.inject, vm); // 加载出 inject 选项
    if (result) { // 如果注册了 inject
      toggleObserving(false); // 标记禁止转化为响应式 -- 用于对 result[key] 的值不进行深度转化为响应式
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          // 在 vm 实例上添加 key，用于直接通过 this.xxx 来获取 inject 值
          defineReactive$$1(vm, key, result[key], function () { // 当设置值为，发出警告 - 在这里可以看出，依赖注入只会在组件初始化的时候初始值，之后即使父组件的值变化了也不会相应变化
            warn(
              "Avoid mutating an injected value directly since the changes will be " + // 避免直接改变一个注入的值，因为改变将会
              "overwritten whenever the provided component re-renders. " + // 在重新呈现所提供的组件时覆盖
              "injection being mutated: \"" + key + "\"", // 注入被突变 key
              vm
            );
          });
        }
      });
      toggleObserving(true); // 重新启用转化为响应式
    }
  }

  // 加载 inject 数据出来
  function resolveInject(inject, vm) {
    if (inject) { // 如果注册了 inject 选项
      // inject is :any because flow is not smart enough to figure out cached inject是:任何，因为流不够聪明，无法计算出缓存
      var result = Object.create(null); // 定义个空对象
      var keys = hasSymbol // 是否支持 symbol -- 提取出所有属性
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) { // 遍历 keys
        var key = keys[i]; // 提取 keys 每项值
        // #6574 in case the inject object is observed... 如果注射对象被观察到
        if (key === '__ob__') { continue } // 如果 inject 值是响应式对象，则 __ob__ 不进行处理
        var provideKey = inject[key].from; // inject 选项的 from：from property 是在可用的注入内容中搜索用的 key (字符串或 Symbol)
        var source = vm; // 实例引用
        while (source) { // 递归查找父组件注入的值
          if (source._provided && hasOwn(source._provided, provideKey)) { // 通过 provide 注入的值会在实例的 _provided 属性上
            // provide 和 inject 绑定并不是可响应的。然而，如果你传入了一个可监听的对象，那么其对象的 property 还是可响应的。
            // 在这里可以看出上述话的意思，因为 inject 获取的值是直接从 祖先组件的 provided 中获取，并没有刻意的将其进行响应式，所以是无法进行响应式的
            result[key] = source._provided[provideKey]; // 获取到父组件或上上级组件注入的值
            break
          }
          source = source.$parent; // 递归查找
        }
        if (!source) { // 当 source 为 false 时，此时说明已经查找到根组件（因为根组件的 $parent 为 undefined）
          if ('default' in inject[key]) { // 是否注册了默认值
            var provideDefault = inject[key].default; // 提取默认值
            result[key] = typeof provideDefault === 'function' // 如果默认值注册为函数
              ? provideDefault.call(vm) // 执行函数
              : provideDefault; // 直接使用
          } else {
            warn(("Injection \"" + key + "\" not found"), vm); // 否则发出警告
          }
        }
      }
      return result
    }
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots(
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace(node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  /*  */

  function normalizeScopedSlots(
    slots,
    normalSlots,
    prevSlots
  ) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
    var key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (var key$1 in slots) {
        if (slots[key$1] && key$1[0] !== '$') {
          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (var key$2 in normalSlots) {
      if (!(key$2 in res)) {
        res[key$2] = proxyNormalSlot(normalSlots, key$2);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }

  function normalizeScopedSlot(normalSlots, key, fn) {
    var normalized = function () {
      var res = arguments.length ? fn.apply(null, arguments) : fn({});
      res = res && typeof res === 'object' && !Array.isArray(res)
        ? [res] // single vnode
        : normalizeChildren(res);
      return res && (
        res.length === 0 ||
        (res.length === 1 && res[0].isComment) // #9658
      ) ? undefined
        : res
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
      Object.defineProperty(normalSlots, key, {
        get: normalized,
        enumerable: true,
        configurable: true
      });
    }
    return normalized
  }

  function proxyNormalSlot(slots, key) {
    return function () { return slots[key]; }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists. 用于呈现v-for列表的运行时助手
   */
  function renderList(
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        var iterator = val[Symbol.iterator]();
        var result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot> 渲染的运行时助手 <slot>
   */
  function renderSlot(
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        if (!isObject(bindObject)) {
          warn(
            'slot v-bind without argument expects an Object',
            this
          );
        }
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      nodes = this.$slots[name] || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters 用于解析过滤器的运行时助手
   */
  function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  /*  */

  function isKeyNotMatch(expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes(
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps(
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) {
        warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function (key) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          var camelizedKey = camelize(key);
          var hyphenatedKey = hyphenate(key);
          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop(key);
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees. 渲染静态树的运行时助手
   */
  function renderStatic(
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once. v-once的运行时助手
   * Effectively it means marking the node as static with a unique key. 实际上，这意味着用唯一键将节点标记为静态节点
   */
  function markOnce(
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic(
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode(node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners(data, value) {
    if (value) {
      if (!isPlainObject(value)) {
        warn(
          'v-on without argument expects an Object value',
          this
        );
      } else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function resolveScopedSlots(
    fns, // see flow/vnode
    res,
    // the following are added in 2.6
    hasDynamicKeys,
    contentHashKey
  ) {
    res = res || { $stable: !hasDynamicKeys };
    for (var i = 0; i < fns.length; i++) {
      var slot = fns[i];
      if (Array.isArray(slot)) {
        resolveScopedSlots(slot, res, hasDynamicKeys);
      } else if (slot) {
        // marker for reverse proxying v-slot without scope on this.$slots
        if (slot.proxy) {
          slot.fn.proxy = true;
        }
        res[slot.key] = slot.fn;
      }
    }
    if (contentHashKey) {
      (res).$key = contentHashKey;
    }
    return res
  }

  /*  */

  function bindDynamicKeys(baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
      var key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      } else if (key !== '' && key !== null) {
        // null is a special value for explicitly removing a binding
        warn(
          ("Invalid value for dynamic directive argument (expected string or null): " + key),
          this
        );
      }
    }
    return baseObj
  }

  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier(value, symbol) {
    return typeof value === 'string' ? symbol + value : value
  }

  /*  */
  // 安装渲染助手
  function installRenderHelpers(target) {
    target._o = markOnce; // 实际上，意味着使用唯一键将节点标记为静态 * 标志 v-once 指令
    target._n = toNumber; // 转化为 number，失败则返回原字符串
    target._s = toString; // 转化为字符串，一定转化成功
    target._l = renderList; // 根据 val 传入值判断是数字，数组，对象，字符串，循环渲染
    target._t = renderSlot; // 用于呈现 <slot> 的运行时帮助程序，创建虚拟 slot vnode
    target._q = looseEqual; // 比较 a 和 b 是否大致相等，会对数组和对象进行检测每项的值
    target._i = looseIndexOf; // 检测数组 arr 的每一项是否与指定值 val 大致相等(使用 looseEqual 方法)并返回索引，没有找到返回 -1
    target._m = renderStatic; // 用于呈现静态树的运行时助手，创建静态虚拟 vnode
    target._f = resolveFilter; // 用于解析过滤器的运行时助手
    target._k = checkKeyCodes; // 用于检测两个 key 是否相等，如果不相等返回 true
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  /*  */

  function FunctionalRenderContext(
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var this$1 = this;

    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () {
      if (!this$1.$slots) {
        normalizeScopedSlots(
          data.scopedSlots,
          this$1.$slots = resolveSlots(children, parent)
        );
      }
      return this$1.$slots
    };

    Object.defineProperty(this, 'scopedSlots', ({
      enumerable: true,
      get: function get() {
        return normalizeScopedSlots(data.scopedSlots, this.slots())
      }
    }));

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent(
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    {
      (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
    }
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps(to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  /*  */

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch 补丁期间在组件 vnode 上调用的内联钩子
  // 子组件的构建钩子 - 会经历 init 初始化 - prepatch 更新 - insert 插入钩子 - destroy 销毁钩子
  var componentVNodeHooks = {
    // 初始化组件钩子 - 在这里初始化子组件
    /**
     * 子组件的初始化：
     * 通过渲染器解析出子组件的 vnode，一般格式为:
     * { componentOptions: 组件选项(Ctor: 构造器, listeners: 事件, propsData: props值等), componentInstance: 组件实例, data: { hook: 组件渲染过程钩子 } }
     * 在父组件渲染过程中，会递归渲染子组件，此时就会通过判断 vnode.data.hook.init 钩子是否存在来判断是否为 组件vnode
     */
    init: function init(vnode, hydrating) {
      if (
        vnode.componentInstance && // 是否已经实例化过
        !vnode.componentInstance._isDestroyed && // 没有被销毁过
        vnode.data.keepAlive // 被 keepAlive 缓存的
      ) {
        // kept-alive components, treat as a patch 将保持活力的组件视为补丁
        var mountedNode = vnode; // work around flow 工作流程
        componentVNodeHooks.prepatch(mountedNode, mountedNode); // 如果是缓存组件，可将其视为更新操作
      } else {
        // 创建子组件，并将其挂载到 componentInstance 属性上
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance // 当前渲染的组件 - 在这里，子组件还没有开始渲染，这里引用的就是子组件的父组件
        );
        // 在这里，已经创建好了子组件实例，但是没有挂载，需要手动挂载
        // 手动调用 $mount，大致为通过 vm._render() 生成 vnode 和 vm._update() 将 vnode 生成 dom 的过程，并且通过 new Wathcer 观察这个过程，收集依赖
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    // 组件更新钩子
    prepatch: function prepatch(oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    // 插入钩子
    insert: function insert(vnode) {
      var context = vnode.context; // 渲染子组件 vnode 的上下文，在这里表示的是子组件的父组件
      var componentInstance = vnode.componentInstance; // 组件实例
      if (!componentInstance._isMounted) { // _isMounted：是否是初次渲染 -- 表示为初次渲染
        componentInstance._isMounted = true; // 在这里将标识置为 true
        callHook(componentInstance, 'mounted'); // 执行 mounted 生命周期
      }
      if (vnode.data.keepAlive) { // 缓存组件作用
        if (context._isMounted) { // 判断父组件是否已经初次渲染过，此时说明是更新阶段
          // vue-router#1212
          // During updates, a kept-alive component's child components may 在更新期间，保持活动的组件的子组件可能会
          // change, so directly walking the tree here may call activated hooks 更改，因此直接遍历树可能会调用激活的钩子
          // on incorrect children. Instead we push them into a queue which will 错误的孩子。相反，我们将它们放入一个队列中
          // be processed after the whole patch process ended. 整个补丁进程结束后再进行处理
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    // 销毁钩子
    destroy: function destroy(vnode) {
      var componentInstance = vnode.componentInstance; // 组件实例
      if (!componentInstance._isDestroyed) { // 如果没有销毁过的
        if (!vnode.data.keepAlive) { // 并且不会被 keepAlive 缓存过的
          componentInstance.$destroy(); // 调用 $destroy 方法执行销毁程序 
        } else { // 如果是被 keepAlive 缓存命中的
          deactivateChildComponent(componentInstance, true /* direct */); // 不执行销毁程序
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent(
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      {
        warn(("Invalid Component definition: " + (String(Ctor))), context);
      }
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    return vnode
  }

  function createComponentInstanceForVnode(
    vnode, // we know it's MountedComponentVNode but flow doesn't 我们知道它是MountedComponentVNode，但流不知道
    parent // activeInstance in lifecycle state 处于生命周期状态的 activeInstance -- 当前渲染组件的父组件
  ) {
    var options = { 
      _isComponent: true, // 表示是一个组件
      _parentVnode: vnode, // 组件 vnode
      parent: parent // 父组件
    };
    // check inline-template render functions 检查内联模板渲染函数
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) { // 是否是内联模板
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    // vnode.componentOptions.Ctor 引用的是子组件的构造函数，在创建 VNode 的时候会通过 Vue.extend(options) 来创建
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks(data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var existing = hooks[key];
      var toMerge = componentVNodeHooks[key];
      if (existing !== toMerge && !(existing && existing._merged)) {
        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
      }
    }
  }

  function mergeHook$1(f1, f2) {
    var merged = function (a, b) {
      // flow complains about extra args which is why we use any
      f1(a, b);
      f2(a, b);
    };
    merged._merged = true;
    return merged
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel(options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'
      ; (data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement(
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement(
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
      warn(
        "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
        'Always create fresh vnode data objects in each render!',
        context
      );
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // warn against non-primitive key
    if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)
    ) {
      {
        warn(
          'Avoid using non-primitive value as key, ' +
          'use string/number value instead.',
          context
        );
      }
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        if (isDef(data) && isDef(data.nativeOn)) {
          warn(
            ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
            context
          );
        }
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS(vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings(data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */
  // 主要是初始化渲染相关的属性或方法
  function initRender(vm) {
    // _vnode 和 $vnode 都是引用的 vnode，但是 _vnode 表示的是组件渲染的 vnode，而 $vnode 表示的是组件的 vnode
    vm._vnode = null; // the root of the child tree 子树的根 - 在这里引用的是组件生成 vnode
    vm._staticTrees = null; // v-once cached trees v-once 缓存的树
    var options = vm.$options; // 提取出 options 参数
    // 子组件表示的组件 VNode
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree 父树中的占位符节点 - 相当于表示组件的 VNode
    // 子组件的组件 VNode 的渲染上下文(不是当前组件渲染的上下文) - 因为在解析插槽时，渲染上下文应该是在组件 VNode 的上下文环境下生成
    var renderContext = parentVnode && parentVnode.context;
    // 解决插槽问题
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject; // 空对象
    // bind the createElement fn to this instance 将 createElement fn 绑定到这个实例
    // so that we get proper render context inside it. 这样我们就得到了适当的渲染上下文
    // args order: tag, data, children, normalizationType, alwaysNormalize 参数顺序:tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates 内部版本由模板编译的渲染函数使用
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in 规范化总是应用于公共版本，用于
    // user-written render functions. 用户编写的显示功能
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    /**
     * 当定义组件 <my-components arrsA='xx' arrsB='xx' @eventA='xx' @eventB='xx'></my-components>
     * 这些 attr 和 event 都是会在生成这个组件 vnode 时，存储在组件 vnode 的 data 中
     * 即是 options._parentVnode 属性上
     */
    // $attrs & $listeners are exposed for easier HOC creation. $attrs和$listeners被公开，以便于更容易地创建
    // they need to be reactive so that HOCs using them are always updated 它们需要是反应性的，这样使用它们的hoc就会一直更新
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      // 在 vm 实例上添加 $attrs 属性，值为 parentData && parentData.attrs，且这个属性是可以被观察到的,
      // 这样的话，当存在观察者观察了 $attrs 属性，就会在 $attrs 属性改变时，触发这个观察者
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
        // isUpdatingChildComponent：表示是否渲染子组件中
        // 只有在渲染子组件时，才会允许修改 $attrs 属性，其他情况都会报错
        // 但是如果 warn 方法中没有设置抛出错误退出调用栈的情况下，还是会修改成功，只是会发出警告
        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
      }, true); // 这个参数设置为 true，表示不能进行深度监听，但是如果传入的本身就是一个可观察对象的话，还是会出发响应式的，始终应该记住，响应式系统是相对于组件系统独立的，是否响应式只是看这个对象是否进行了响应式转化，只要进行了响应式转化，就可以被观察到
      // 与 $attrs 同理
      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
      }, true);
    }
  }

  var currentRenderingInstance = null;

  // 为 Vue 原型添加渲染助手，$nextTick 和 _render 方法
  function renderMixin(Vue) {
    // install runtime convenience helpers 安装运行时方便帮助程序
    installRenderHelpers(Vue.prototype);

    // 添加原型方法 $nextTick - 通过 nextTick 添加
    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    // 条件原型方法 _render -- 用于调用 vm.$options.render() 来生成 VNode
    Vue.prototype._render = function () {
      var vm = this; // 组件实例
      var ref = vm.$options; // options 配置参数
      var render = ref.render; // render 渲染函数
      var _parentVnode = ref._parentVnode; // 如果是子组件，表示子组件的组件 VNode

      if (_parentVnode) { // 是子组件的话
        vm.$scopedSlots = normalizeScopedSlots( // 处理插槽
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access 设置父vnode。这允许渲染函数具有访问权限
      // to the data on the placeholder node. 到占位符节点上的数据
      vm.$vnode = _parentVnode; // $vnode 引用着子组件的 组件Vnode
      // render self 渲染自己
      var vnode;
      try {
        // There's no need to maintain a stack because all render fns are called 没有必要维护堆栈，因为所有渲染fns都被调用
        // separately from one another. Nested component's render fns are called 彼此分开。嵌套组件的渲染fns被调用
        // when parent component is patched. 当父组件被修补时
        currentRenderingInstance = vm; // 引用
        vnode = render.call(vm._renderProxy, vm.$createElement); // 在 _renderProxy 上下文中，执行 render 渲染函数生成 VNode
      } catch (e) { // 如果渲染 VNode 过程中出错
        handleError(e, vm, "render"); // 暴露错误
        // return error render result, 返回错误
        // or previous vnode to prevent render error causing blank component 或之前的vnode，以防止渲染错误导致空白组件
        /* istanbul ignore else */
        if (vm.$options.renderError) { // 查看是否定义了 handerEoor 方法，用于返回渲染错误的 VNode
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it 如果返回的数组只包含一个节点，那么允许它
      if (Array.isArray(vnode) && vnode.length === 1) { // 如果是一个包含一个根节点的数组
        vnode = vnode[0]; // 此时提取第一个根节点
      }
      // return empty vnode in case the render function errored out 如果渲染函数出错，返回空的 vnode
      if (!(vnode instanceof VNode)) { // 如果 vnode 不是 VNode 类型
        if (Array.isArray(vnode)) { // 是一个数组, 此时说明定义了多个根节点
          warn( // 发出警告
            'Multiple root nodes returned from render function. Render function ' + // 从渲染函数返回的多个根节点。渲染函数
            'should return a single root node.', // 应该返回单个根节点
            vm
          );
        }
        vnode = createEmptyVNode(); // 定义一个空的 VNode
      }
      // set parent 设置父
      vnode.parent = _parentVnode; // 在 vnode 上设置引用 _parentVnode(表示组件的 VNode)
      return vnode // 返回生成的 vnode
    };
  }

  /*  */

  function ensureCtor(comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder(
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent(
    factory,
    baseCtor
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
      // already pending
      factory.owners.push(owner);
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (owner && !isDef(factory.owners)) {
      var owners = factory.owners = [owner];
      var sync = true;
      var timerLoading = null;
      var timerTimeout = null

        ; (owner).$on('hook:destroyed', function () { return remove(owners, owner); });

      var forceRender = function (renderCompleted) {
        for (var i = 0, l = owners.length; i < l; i++) {
          (owners[i]).$forceUpdate();
        }

        if (renderCompleted) {
          owners.length = 0;
          if (timerLoading !== null) {
            clearTimeout(timerLoading);
            timerLoading = null;
          }
          if (timerTimeout !== null) {
            clearTimeout(timerTimeout);
            timerTimeout = null;
          }
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender(true);
        } else {
          owners.length = 0;
        }
      });

      var reject = once(function (reason) {
        warn(
          "Failed to resolve async component: " + (String(factory)) +
          (reason ? ("\nReason: " + reason) : '')
        );
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender(true);
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (isPromise(res)) {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              timerLoading = setTimeout(function () {
                timerLoading = null;
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender(false);
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            timerTimeout = setTimeout(function () {
              timerTimeout = null;
              if (isUndef(factory.resolved)) {
                reject(
                  "timeout (" + (res.timeout) + "ms)"
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder(node) {
    return node.isComment && node.asyncFactory
  }

  /*  */
  // 在指定 children 数组中找出组件 vnode 项并返回
  function getFirstComponentChild(children) {
    if (Array.isArray(children)) { // 如果传入参数为数组
      for (var i = 0; i < children.length; i++) { // 遍历数组
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) { // 如果这项为组件 vnode 的话
          return c // 返回这一项
        }
      }
    }
  }

  /*  */

  /*  */

  // 初始化事件
  function initEvents(vm) {
    vm._events = Object.create(null); // 为实例添加 _events 私有属性，保存着 event 事件
    vm._hasHookEvent = false; // 一个标识，用于标识是否通过类似 @hook:create 方式监听子组件的生命周期
    // init parent attached events 初始化父附加事件
    var listeners = vm.$options._parentListeners; // 父组件传入的事件
    if (listeners) { // 父组件是否传入了事件
      updateComponentListeners(vm, listeners); // 处理自定义事件
    }
  }

  var target; // 当前添加对象

  // 添加事件
  function add(event, fn) {
    target.$on(event, fn);
  }

  // 删除事件
  function remove$1(event, fn) {
    target.$off(event, fn);
  }

  // 给指定 target 添加一次性回调
  function createOnceHandler(event, fn) {
    var _target = target; // 缓存 target，应该需要这个来进行事件的解绑
    return function onceHandler() {
      var res = fn.apply(null, arguments); // 执行回调
      if (res !== null) {
        _target.$off(event, onceHandler); // 利用 $off 解绑事件
      }
    }
  }

  // 新增 或 更新自定义事件
  function updateComponentListeners(
    vm, // 组件实例
    listeners, // 事件
    oldListeners // 旧事件 -- 应该在 picth 阶段删除旧事件
  ) {
    target = vm; // 添加目标
    // listeners：事件，oldListeners：旧事件，add：添加事件方法，remove$1：删除事件方法，createOnceHandler：添加执行一次事件，vm：实例
    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm); // 添加事件
    target = undefined; // 重置目标
  }

  // 添加原型方法 $on, $once, $off, $emit
  function eventsMixin(Vue) {
    var hookRE = /^hook:/; // 检查匹配 hook: 开头字符串
    // 添加原型方法 $on -- 作用：添加监听器
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) { // 如果 event 是数组
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn); // 遍历数组，将 fn 回调添加至对应事件中
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn); // 在 vm._events[event] 属性中添加 fn 回调
        // optimize hook:event cost by using a boolean flag marked at registration 通过在注册时使用一个布尔标记来优化钩子:事件开销
        // instead of a hash lookup 而不是哈希查找
        if (hookRE.test(event)) { // 是否监听了 hook: 生命周期钩子
          vm._hasHookEvent = true; // 将标识置为 true
        }
      }
      return vm // 返回实例
    };
    // 添加原型方法 $once -- 添加只执行一次的监听器
    Vue.prototype.$once = function (event, fn) {
      var vm = this; // 实例
      // 封装 fn 监听器
      function on() {
        vm.$off(event, on); // 只需要执行一次这个监听器，之后通过 $off 销毁监听器
        fn.apply(vm, arguments); // 执行监听器
      }
      on.fn = fn; // 在销毁 $off 方法中，用于在监听器队列中找出该监听器 -- 因为这个 on 是被封装了一层，所有在 fn 属性引用原始监听器
      vm.$on(event, on); // 通过 $on 方法添加自定义事件
      return vm
    };
    // 添加原型方法 $off -- 销毁监听器
    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) { // 如果一个参数都不传递，表示直接清空所有监听器
        vm._events = Object.create(null);
        return vm
      }
      // array of events 一系列的事件
      if (Array.isArray(event)) { // 如果清除事件为数组
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          vm.$off(event[i$1], fn); // 遍历数组，利用 $off 方法清除事件
        }
        return vm
      }
      // specific event 特定的事件
      var cbs = vm._events[event]; // 该事件所有的监听器
      if (!cbs) { // 如果不存在监听器
        return vm // 直接退出
      }
      if (!fn) { // 如果没有传递第二个参数, 表示清空该事件的所有监听器
        vm._events[event] = null;
        return vm
      }
      // specific handler 具体的处理程序
      var cb;
      var i = cbs.length;
      while (i--) { // 遍历该事件的所有监听器
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) { // 在监听器队列中找出该监听器
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };
    // 添加原型方法 $emit -- 发射事件
    Vue.prototype.$emit = function (event) {
      var vm = this;
      {
        var lowerCaseEvent = event.toLowerCase(); // 事件名转为小写
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) { // 如果事件转成小写之后并不相等以前字符串，并且是不存在_events 事件队列中
          tip( // 发出警告
            "Event \"" + lowerCaseEvent + "\" is emitted in component " +
            (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
            "Note that HTML attributes are case-insensitive and you cannot use " +
            "v-on to listen to camelCase events when using in-DOM templates. " +
            "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
          );
        }
      }
      var cbs = vm._events[event]; // 监听器队列
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs; // 转为数组
        var args = toArray(arguments, 1); // 提取参数
        var info = "event handler for \"" + event + "\""; // 出错时提示信息
        for (var i = 0, l = cbs.length; i < l; i++) { // 遍历执行监听器
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }

  /*  */

  var activeInstance = null; // 当前组件的引用
  var isUpdatingChildComponent = false;
  // 设置当前渲染的组件实例
  function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance; // 保存当前组件渲染的实例
    activeInstance = vm; // 重新设置当前渲染组件
    return function () { // 返回一个函数，用于将渲染组件实例重置
      activeInstance = prevActiveInstance;
    }
  }

  // 初始化相关属性($parent, $root, $children, $refs, _watcher)以及一些生命周期标识符(_inactive, _directInactive, _isMounted, _isDestroyed, _isBeingDestroyed)
  function initLifecycle(vm) {
    var options = vm.$options; // 提取 options 参数

    // locate first non-abstract parent 定位第一个非抽象父节点
    var parent = options.parent; // 组件的父组件，在创建子组件时，内部会创建 parent 属性
    if (parent && !options.abstract) { // 当存在父组件，并且当组件不是抽象组件(抽象组件：内部组件-keepalive...)
      while (parent.$options.abstract && parent.$parent) { // 如果父组件为抽象组件 && 父组件也存在父组件
        parent = parent.$parent; // 此时找出不是抽象组件的组件
      }
      parent.$children.push(vm); // 将当组件添加到 $children 集合中，表示当前组件的子组件集合
    }

    vm.$parent = parent; // $parent：当前组件的父组件
    vm.$root = parent ? parent.$root : vm; // 当前组件树的根 Vue 实例

    vm.$children = []; // 当前组件的子组件
    vm.$refs = {}; // 当前组件 ref 集合

    // 下面就是一些内部属性
    vm._watcher = null; // 组件的渲染函数 watcher 观察对象
    vm._inactive = null;
    vm._directInactive = false; // 缓存组件停用的状态
    vm._isMounted = false; // 组件是否已经初始渲染
    vm._isDestroyed = false; // 组件是否已经被渲染
    vm._isBeingDestroyed = false; // 组件是否被销毁中
  }

  // 添加原型方法 _update, $forceUpdate, $destroy
  function lifecycleMixin(Vue) {
    // 添加原型方法 _update
    /**
     * 此方法
     */
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this; // 实例
      var prevEl = vm.$el; // 上一个挂载点(会将 $el 替换成组件 DOM)
      var prevVnode = vm._vnode; // 上一次 Vnode
      var restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode; // 将生成的 vnode 保存在 vm._vnode 中
      // Vue.prototype.__patch__ is injected in entry points Vue.prototype。__patch__被注入到入口点
      // based on the rendering backend used. 基于所使用的呈现后端
      if (!prevVnode) { // 上一次的 vnode 是 null,表示是初次挂载
        // initial render 最初的渲染
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        debugger;
        // updates 更新阶段
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance(); // 调用方法，将全局渲染组件的引用重置为上一个渲染组件，退出当前组件的渲染
      // update __vue__ reference 更新__vue__参考
      if (prevEl) {
        prevEl.__vue__ = null; // 如果存在上一个 dom 引用，将 __vue__ 属性置为 null
      }
      if (vm.$el) { // 如果 vm.$el 存在
        vm.$el.__vue__ = vm; // 则添加 vm.$el.__vue__ 引用 vm 实例
      }
      // if parent is an HOC, update its $el as well 如果parent是HOC，也更新它的$el
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are 更新的钩子被调度程序调用，以确保子钩子
      // updated in a parent's updated hook. 在父节点的更新钩子中更新
    };

    // 添加原型方法 $forceUpdate -- 迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。
    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update(); // 通过 update 方法重新渲染
      }
    };

    // 添加原型方法 $destroy
    /**
     * 将销毁标识 _isBeingDestroyed 置为正确值
     * 执行生命周期 beforeDestroy
     * 清除所有的 _watchers
     * 通过 __patch__ 方法执行组件 DOM 方面的清除工作 -- 删除 DOM 上事件，子组件的递归销毁
     * 执行生命周期 destroyed
     * 使用 $off() 删除事件
     */
    Vue.prototype.$destroy = function () { // 销毁程序
      var vm = this; // 实例
      if (vm._isBeingDestroyed) { // 如果已经在销毁中
        return // 直接返回，防止重复销毁
      }
      callHook(vm, 'beforeDestroy'); // 执行 beforeDestroy 钩子
      vm._isBeingDestroyed = true; // 将 _isBeingDestroyed 置为 true
      // remove self from parent 将自己从父级移除
      var parent = vm.$parent; // 父组件 
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) { // 存在父组件 && 父组件没有被销毁中 && 不是抽象组件
        remove(parent.$children, vm); // 从父组件的 $children 集合中删除该组件
      }
      // teardown watchers 去除观察者
      if (vm._watcher) { // 如果存在 vm._wathcer 属性 -- 这个属性表示渲染函数的观察者 watcher
        vm._watcher.teardown(); // 使用 teardown 卸载观察者
      }
      var i = vm._watchers.length; // 获取这个组件所有的 wathcers
      while (i--) {
        vm._watchers[i].teardown(); // 遍历 wathcers 卸载所有观察者
      }
      // remove reference from data ob 从数据ob中删除引用
      // frozen object may not have observer. 冻结对象可能没有观察者
      if (vm._data.__ob__) { // 这一步作用没有想明白
        vm._data.__ob__.vmCount--;
      }
      // call the last hook... 调用最后一个钩子
      vm._isDestroyed = true; // 表示当前组件已经被销毁 
      // invoke destroy hooks on current rendered tree 在当前呈现的树上调用destroy钩子
      vm.__patch__(vm._vnode, null); // 通过 vm.__patch__ 处理 vnode 的善后工作
      // fire destroyed hook 大火烧毁了钩
      callHook(vm, 'destroyed'); // 执行 destroyed 钩子
      // turn off all instance listeners. 关闭所有实例监听器
      vm.$off();
      // remove __vue__ reference 删除__vue__参考
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759) 发布循环引用(#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  // 生成 vnode，挂载 DOM -- 子组件一路走来也是在这里挂载 DOM
  function mountComponent(
    vm, // 实例
    el, // 挂载点 DOM
    hydrating
  ) {
    vm.$el = el; // 将挂载点 el 添加到 $el 属性上
    if (!vm.$options.render) { // 如果不存在 render 渲染函数
      vm.$options.render = createEmptyVNode; // 一个空的 render 占位符
      {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) { // 如果定义了 template 或者 el 选项
          warn( // 此时发出警告
            'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn( // 发出警告
            'Failed to mount component: template or render function not defined.', // 安装组件失败:模板或未定义的渲染函数
            vm
          );
        }
      }
    }
    // 执行 beforeMount 声明周期
    callHook(vm, 'beforeMount');

    // 主要是调用 _render 方法生成 VNode，以及调用 _update 生成 VNode
    var updateComponent;
    /* istanbul ignore if */
    // 性能监控
    if (config.performance && mark) {
      updateComponent = function () { // 如果支持性能监控的话，需要对组件生成 VNode，以及挂载过程进行监控
        var name = vm._name;
        var id = vm._uid;
        var startTag = "vue-perf-start:" + id;
        var endTag = "vue-perf-end:" + id;

        mark(startTag);
        var vnode = vm._render();
        mark(endTag);
        measure(("vue " + name + " render"), startTag, endTag);

        mark(startTag);
        vm._update(vnode, hydrating);
        mark(endTag);
        measure(("vue " + name + " patch"), startTag, endTag);
      };
    } else {
      // 会观察这个函数中所依赖的属性，当这些属性存在变动时，此时就会重新触发这个函数进行更新操作
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor 我们将其设置为vm。_watcher在watcher的构造函数中
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child 因为观察者的初始补丁可能调用$forceUpdate(例如inside child)
    // component's mounted hook), which relies on vm._watcher being already defined scomponent的挂载钩子)，它依赖于vm。已经定义了_watcher
    // 通过对 updateComponent 进行观察，这样的话就会对渲染过程进行观察，收集渲染的依赖，并且一开始就执行一遍 updateComponent
    // 执行 updateComponent 方法中，_render 负责调用 vm.$options.render 方法生成 VNode，
    // 然后传递给 _update 方法进行挂载，
    new Watcher(vm, updateComponent, noop, {
      before: function before() { // 数据更新前执行回调
        if (vm._isMounted && !vm._isDestroyed) { // _isMounted：是否已经初次渲染 && _isDestroyed：组件是否已渲染
          callHook(vm, 'beforeUpdate'); // 说明是更新操作，执行 beforeUpdate 生命周期
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self 手动挂载实例，调用挂载在self上
    // mounted is called for render-created child components in its inserted hook mount用于在其插入的钩子中调用渲染器创建的子组件
    if (vm.$vnode == null) { // vm.$vnode：引用着父组件的 VNode， 根组件就不存在这个属性，所有子组件不会在这里调用 mounted 生命周期
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent(
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    {
      isUpdatingChildComponent = true;
    }

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.

    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm.$scopedSlots;
    var hasDynamicScopedSlot = !!(
      (newScopedSlots && !newScopedSlots.$stable) ||
      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
    );

    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    var needsForceUpdate = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      hasDynamicScopedSlot
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children 如果有子节点，则解析槽位+强制更新
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }

    {
      isUpdatingChildComponent = false;
    }
  }

  function isInInactiveTree(vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = true; // 表示缓存组件停用的状态
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  // 执行生命周期函数
  function callHook(vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks 在调用生命周期钩子时禁用dep集合
    pushTarget(); // 禁用依赖收集
    var handlers = vm.$options[hook]; // 提取出生命周期函数
    var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) { // 遍历 hooks
        invokeWithErrorHandling(handlers[i], vm, null, vm, info); // 执行 hooks
      }
    }
    // 可能有两种情况：
    // 1. 在组件内部中，通过 this.$on('hook:created', xxx) 方式监听生命周期方法
    // 2. 在使用组件时(<my-components @hook:created='xx'></my-components>) 方式监听子组件的生命周期
    // 这两种内部都会通过 $on 方式去添加订阅，此时就会将 _hasHookEvent 标识置为 true
    if (vm._hasHookEvent) { // 标识是否自定义事件中存在监听了 hook: 格式的事件
      vm.$emit('hook:' + hook); // 发送事件
    }
    popTarget(); // 重新收集依赖
  }

  /*  */

  var MAX_UPDATE_COUNT = 100; // 统一 wathcer 执行最大次数

  var queue = []; // 观察者队列
  var activatedChildren = []; // keep-alive 缓存组件？
  var has = {}; // 缓存队列 -- 防止重复 watcher 加入队列
  var circular = {}; // 如果存在循环更新 watcher(即在该 wathcer.run() 过程又需要执行该 watcher)，则将其执行次数记录下来
  // 如果没有 watcher 队列，就会是等待状态，一旦有 watcher 添加进来，只需要下一个任务队列周期刷新队列，无需重复开启任务队列
  var waiting = false; // 这个表示，已经开启了下一个任务队列周期(通过 Promise 或 setTimeout 等)准备刷新队列
  // 这个标识表示开始刷新队列
  var flushing = false; // 进入flushSchedulerQueue 函数等待标志 -- 标记是否开始刷新队列
  var index = 0; // 正在运行的 watcher

  /**
   * Reset the scheduler's state. 重置调度程序的状态
   */
  function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0; // 重置 index queue activatedChildren 变量
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp. 异步边缘情况修复需要存储事件侦听器的附加时间戳
  var getNow = Date.now; // 时间戳

  // Determine what event timestamp the browser is using. Annoyingly, the 确定浏览器正在使用的事件时间戳。烦人的,
  // timestamp can either be hi-res (relative to page load) or low-res 时间戳可以是高分辨率(相对于页面加载)或低分辨率
  // (relative to UNIX epoch), so in order to compare time we have to use the (相对于UNIX epoch)，因此为了比较时间，我们必须使用
  // same timestamp type when saving the flush timestamp. 保存刷新时间戳时使用相同的时间戳类型
  // All IE versions use low-res event timestamps, and have problematic clock 所有的IE版本都使用低分辨率的事件时间戳，并且有问题的时钟
  // implementations (#9632) 实现(# 9632)
  if (inBrowser && !isIE) { // 浏览器环境 && 不是 IE
    var performance = window.performance;
    if (
      performance &&
      typeof performance.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is 如果事件时间戳(尽管在Date.now()之后计算)是
      // smaller than it, it means the event is using a hi-res timestamp, 如果比它小，则表示事件使用的是高分辨率时间戳
      // and we need to use the hi-res version for event listener timestamps as 我们需要使用高分辨率版本的事件监听器时间戳
      // well. 好吧
      getNow = function () { return performance.now(); }; // 。。。
    }
  }

  /**
   * Flush both queues and run the watchers. 刷新两个队列并运行监视程序
   * 刷新 watcher 队列
   */
  function flushSchedulerQueue() {
    currentFlushTimestamp = getNow(); // 获取开始事件戳
    flushing = true; // 开始执行队列标识
    var watcher, id;

    // Sort queue before flush. 在刷新之前排序队列。
    // This ensures that: 这确保:
    // 1. Components are updated from parent to child. (because parent is always 1。组件从父组件更新到子组件。(因为父母总是
    //    created before the child) 在child之前创建)
    // 2. A component's user watchers are run before its render watcher (because 2。组件的用户监视程序在渲染监视程序之前运行(因为
    //    user watchers are created before the render watcher) 用户观察者在渲染观察者之前创建)
    // 3. If a component is destroyed during a parent component's watcher run, 3。如果一个组件在父组件的监视程序运行期间被销毁，
    //    its watchers can be skipped. 它的观察者可以跳过
    queue.sort(function (a, b) { return a.id - b.id; }); // 对 wathcer 进行排序

    // do not cache length because more watchers might be pushed 不要缓存长度，因为可能会有更多的观察者被推送
    // as we run existing watchers 我们运行现有的观察者
    for (index = 0; index < queue.length; index++) { // 遍历 wacther 队列
      watcher = queue[index]; // 提取当前 watcher
      if (watcher.before) { // 如果存在 before 钩子，则在执行回调之前调用
        watcher.before(); // 调用 before 钩子
      }
      id = watcher.id; // 获取 watcher 钩子
      has[id] = null;
      watcher.run(); // 执行 watcher.run() 将控制权转移给 watcher，让 watcher 决定如何执行
      // in dev build, check and stop circular updates. 在开发构建中，检查并停止循环更新
      // 防止循环更新，不然就会将页面卡死
      if (has[id] != null) { // 上面已经将 has[id] 置为 null，如果在运行 watcher.run() 过程中，又将该 watcher 添加进来，就会行为死循环
        circular[id] = (circular[id] || 0) + 1; // 存储执行该 watcher 次数
        if (circular[id] > MAX_UPDATE_COUNT) { // 如果执行次数超过 MAX_UPDATE_COUNT 范围，则发出警告，并不在执行该 wathcer
          warn(
            'You may have an infinite update loop ' + (
              watcher.user
                ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                : "in a component render function."
            ),
            watcher.vm
          );
          break
        }
      }
    }

    // keep copies of post queues before resetting state 在重置状态之前保留post队列的副本
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice(); // 队列副本

    resetSchedulerState(); // 重置调度程序

    // call component updated and activated hooks 调用组件更新和激活的钩子
    callActivatedHooks(activatedQueue); // 先略过 keep-alive 
    callUpdatedHooks(updatedQueue); // 执行组件的 updated 生命周期，这里已经排好序了的 - 从子组件开始执行

    // devtool hook devtool 钩子
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  // 执行组件的 updated 生命周期，这里已经排好序了的
  function callUpdatedHooks(queue) {
    var i = queue.length;
    while (i--) { // 从这个遍历顺序可以看出，是先从子组件钩子执行 updated 
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) { // 这是个组件的 watcher && 已经初始化完成 && 没有被销毁
        callHook(vm, 'updated'); // 执行 updated 钩子
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch. 将补丁期间激活的保持活动的组件排队
   * The queue will be processed after the entire tree has been patched. 队列将在整个树被修补后被处理
   */
  function queueActivatedComponent(vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks(queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue. 将一个监视器放入监视队列
   * Jobs with duplicate IDs will be skipped unless it's 具有重复id的作业将被跳过，除非
   * pushed when the queue is being flushed. 在刷新队列时推送
   */
  function queueWatcher(watcher) {
    var id = watcher.id; // 获取观察者 id
    if (has[id] == null) { // 当观察者没有添加进队列时
      has[id] = true; // 标记该 watcher 已进入队列
      if (!flushing) { // 是否没有开始标记
        queue.push(watcher); // 对 queue 队列添加 观察者
      } else {
        // if already flushing, splice the watcher based on its id 如果已经刷新，则根据它的id拼接监视器
        // if already past its id, it will be run next immediately. 如果已经超过了它的id，它将立即被运行
        var i = queue.length - 1; // 获取队列最后一个 watcher
        while (i > index && queue[i].id > watcher.id) { // 判断该 watcher id 是否比队列中的 watcher id 都小
          i--;
        }
        // 如果该 watcher 的 id 比已经运行的队列还小，将推入至最前，即会立即执行
        queue.splice(i + 1, 0, watcher); // 将该 watcher 添加进队列中
      }
      // queue the flush 队列的冲
      if (!waiting) { // 是否已经开启了一个周期准备进行队列更新
        waiting = true; // 置为 true

        if (!config.async) { // 如果是同步执行队列的话
          flushSchedulerQueue(); // 直接运行队列 -- 性能会明显下降
          return
        }
        nextTick(flushSchedulerQueue); // 将执行 watcher 队列的 flushSchedulerQueue 方法添加进回调
      }
    }
  }

  /*  */



  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies, 观察者解析表达式，收集依赖项
   * and fires callback when the expression value changes. 并在表达式值改变时触发回调
   * This is used for both the $watch() api and directives. 这用于$watch() api和指令
   * 
   * 在 watcher 中，主要是通过将 Dep.target 设置为该观察者，然后通过 getter 求值，这样就会收集到相应的 dep
   * 并将其收集在 depids 之类的集合中，通过 dep 集合就可以发现这个 watcher 所依赖的属性列表，并在不需要的时候通知 dep 进行观察对象删除
   */
  var Watcher = function Watcher(
    vm, // 实例
    expOrFn, // 获取值的函数，或者是更新viwe试图函数
    cb, // 所观察到的依赖改变后的回调
    options, // 配置项，
    isRenderWatcher // 是否是渲染函数观察对象
  ) {
    this.vm = vm; // 保存 vm 实例引用
    if (isRenderWatcher) { // 是否是渲染函数观察对象 
      vm._watcher = this; // 如果是，则为 vm 实例添加 _watcher 属性
    }
    vm._watchers.push(this); // 将当前观察对象推入 vm 组件实例的 _watchers 集合中
    // options
    if (options) { // 如果存在配置项
      this.deep = !!options.deep; // 深度监听
      this.user = !!options.user; // 用户自定义 watcher 观察对象
      this.lazy = !!options.lazy; // 惰性求值 -- 例如计算属性
      this.sync = !!options.sync; // 
      this.before = options.before; // 这应该是一个钩子 - 表示在观察对象改变后此依赖执行之前调用
    } else {
      this.deep = this.user = this.lazy = this.sync = false; // 否则全部为 false
    }
    this.cb = cb; // 求值后的回调
    this.id = ++uid$2; // uid for batching uid为批处理 -- 设置 id
    this.active = true; // 是否是激活状态，如果为 false -- 表示不需要执行操作
    this.dirty = this.lazy; // for lazy watchers 对于懒惰的观察者
    this.deps = []; // 观察者集合
    this.newDeps = []; // 新的观察者队列
    this.depIds = new _Set(); // 观察者id
    this.newDepIds = new _Set(); // 新的观察者id
    this.expression = expOrFn.toString(); // 求值函数的字符串表示
    // parse expression for getter getter的解析表达式
    if (typeof expOrFn === 'function') { // 如果是函数形式
      this.getter = expOrFn; // 则直接使用
    } else { // 否则转化为函数形式
      this.getter = parsePath(expOrFn);
      if (!this.getter) { // 如果转化失败
        this.getter = noop; // 重置为空函数
        warn( // 并且发出警告
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }
    this.value = this.lazy // 如果是惰性求值
      ? undefined // 此时暂不进行求值操作
      : this.get(); // 否则进行求值操作，用于触发收集依赖项
  };

  /**
   * Evaluate the getter, and re-collect dependencies. 计算 getter，并重新收集依赖项
   * 作用：用于触发 get 求值，来进行依赖收集
   */
  Watcher.prototype.get = function get() {
    pushTarget(this); // 设置观察对象
    var value;
    var vm = this.vm; // vue 实例
    try {
      value = this.getter.call(vm, vm); // 触发 getter 操作，并且将 value 获取
    } catch (e) { // 如果出错
      if (this.user) { // 如果是用户定义的
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\"")); // 出错则由 handleError 暴露给用户
      } else { // 不是用户定义的，则抛出错误
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as “触摸”每个属性，这样它们都被跟踪为
      // dependencies for deep watching 对深度观察的依赖
      if (this.deep) { // 深度监听
        traverse(value); // value：通过 parsePath 转化的函数，会返回一个目前深度的 obj
      }
      popTarget(); // 出栈一个 观察者
      this.cleanupDeps(); // 进行 dep 的操作
    }
    return value // 返回结果值
  };

  /**
   * Add a dependency to this directive. 给这个指令添加一个依赖项
   * 观察对象 Watcher 观察到属性 dep
   */
  Watcher.prototype.addDep = function addDep(dep) {
    var id = dep.id; // 依赖项 id
    if (!this.newDepIds.has(id)) { // 判断 newDepIds 中是否已经收集
      this.newDepIds.add(id); // 如果没有则推入 newDepIds 集合中
      this.newDeps.push(dep); // 同理推入 newDeps 中
      if (!this.depIds.has(id)) { // 该 id 是否不在旧的 depIds 集合中
        dep.addSub(this); // 此时说明是新加入的依赖项，就需要通知 dep 对这个观察者 watch 进行收集
      }
    }
  };

  /**
   * Clean up for dependency collection. 清理依赖项集合
   * 当每次求值操作结束后，都需要将老旧的 dep 进行重置，去除以前 dep 收集的
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps() {
    var i = this.deps.length; // 当前依赖项
    while (i--) { // 遍历
      var dep = this.deps[i]; // 提取出 dep 项
      if (!this.newDepIds.has(dep.id)) { // 通过 id 判断是否已经不存在 newDepIds 中
        dep.removeSub(this); // 此时说明，该 dep 项已经不在被该观察者观察到，通知 dep 进行观察者回收
      }
    }
    // 进行 depIds 和 newDepIds 队列交换
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();

    // 同理，进行 deps 和 newDeps 队列交换
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface. 用户界面
   * Will be called when a dependency changes. 当依赖关系改变时将被调用
   */
  Watcher.prototype.update = function update() {
    /* istanbul ignore else */
    if (this.lazy) { // 惰性求值，这里不进行求值
      this.dirty = true; // dirty：表示计算属性需要重新求值 -- 将标识置为 true，这样计算属性就会重新求值
    } else if (this.sync) { // 不是异步回调
      this.run(); // 直接运行，一般不会如此
    } else { // 异步
      queueWatcher(this); // 添加进异步队列
    }
  };

  /**
   * Scheduler job interface. 调度器的工作界面
   * Will be called by the scheduler. 会被调度程序调用吗
   * 执行 watcher 
   */
  Watcher.prototype.run = function run() {
    if (this.active) { // 表示当前 watcher 是激活状态
      var value = this.get(); // 重新进行过求值操作
      if (
        value !== this.value || // 返回值改变了
        // Deep watchers and watchers on Object/Arrays should fire even 深度观察者和物体/阵列上的观察者应该发射
        // when the value is the same, because the value may 当取值相同时，因为取值可能相同
        // have mutated. 有变异
        isObject(value) || // 如果 value 是一个对象
        this.deep // 如果值没有改变但是是深度监听
      ) {
        // set new value 设置新值
        var oldValue = this.value;
        this.value = value;

        if (this.user) { // 如果是用户定义的
          try {
            this.cb.call(this.vm, value, oldValue); // 执行回调
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue); // 直接执行 cb 回调
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher. 评估观察者的价值
   * This only gets called for lazy watchers. 只有懒惰的观察者才会这么做
   * 作用：惰性观察者，在这里可以手动调用这个方法进行求值
   */
  Watcher.prototype.evaluate = function evaluate() {
    this.value = this.get(); // 惰性的在这一步进行求值
    this.dirty = false; // 暂时关闭惰性值 -- 通过这个标识位，来标识已经求过值，重复使用计算属性时，不会再次求值，而当依赖项改变时，会重置这个标识位，进行重新求值
  };

  /**
   * Depend on all deps collected by this watcher. 依赖于此监视器收集的所有 deps
   * 这里是实现计算属性的，在这一步，Dep.target 已经不在引用该计算属性，而是依赖计算属性的
   * 将此计算属性的 deps 转接到依赖计算属性的 watcher 观察对象中
   */
  Watcher.prototype.depend = function depend() {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list. 从所有依赖项的订阅者列表中删除self
   */
  Watcher.prototype.teardown = function teardown() {
    if (this.active) { // 如果是激活状态
      // remove self from vm's watcher list 从 vm 的监视列表中删除 self
      // this is a somewhat expensive operation so we skip it 这是一个有点昂贵的操作，所以我们跳过它
      // if the vm is being destroyed. 虚拟机正在被销毁
      if (!this.vm._isBeingDestroyed) { // 如果组件不是被销毁的话，此时可能是通过 $watcher 返回的卸载函数手动卸载的
        remove(this.vm._watchers, this); // 此时从组件的全部 watchers 集合中删除该 watcher
      }
      var i = this.deps.length; // 这个观察者所有依赖的属性
      while (i--) {
        this.deps[i].removeSub(this); // 通知 deps 将这个 watcher 去除
      }
      this.active = false; // 将状态置为停用状态
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  // 将对 key 的访问实际上访问 sourceKey，例如：访问 target.key 实际上内部访问的是 target.sourceKey.key
  function proxy(
    target, // 目标值
    sourceKey, // 实际访问的源 key
    key // 访问的 key
  ) {
    sharedPropertyDefinition.get = function proxyGetter() { // 获取值
      return this[sourceKey][key] // 返回对 sourceKey 的访问
    };
    sharedPropertyDefinition.set = function proxySetter(val) { // 设置值
      this[sourceKey][key] = val; // 实际对 sourceKey 的设置
    };
    Object.defineProperty(target, key, sharedPropertyDefinition); // 设置
  }

  // 这个初始化较为重要，初始化了相关数据(props, methods, data, watch)
  function initState(vm) {
    vm._watchers = []; // 实例的监听对象集合
    var opts = vm.$options; // 提取 options
    // 初始化 prop 策略：
    // 首先通过父组件传入(在options.propsData 中,在注册子组件时定义) 和 用户注册(optons.props) 两个信息中提取出 value 并进行校验
    // 然后将 props 遍历赋值在 vm._props 中，并且通过 Object.defineProperty 将对 vm.prop 的访问转化为 vm._props.prop 访问
    // 而 props 的响应式问题：
    // 1. 如果是通过用户注册默认值获取的 value，就需要子组件通过放开 toggleObserving(true) 限制来对 value 进行观察
    // 2. 如果是由父组件传入，则由父组件决定 value 是否可观察
    // 3. 而对于 props 的 key 而言，就通过 defineReactive$$1 来给 vm._props 添加响应式属性，这样就可以对 vm._props.propKey 的操作进行观察
    if (opts.props) { initProps(vm, opts.props); } // 如果存在 props，则初始化 props

    // 初始化 methods 策略：很简单，只需要定义的是函数 && 定义的 key 不能与 vm 实例上的其他属性或 prop 上的属性同名即可
    if (opts.methods) { initMethods(vm, opts.methods); }

    // 初始化 data 数据
    // 简单来讲，就是通过 options.data 中获取 data 值，然后不能与 methods 和 props 属性同名，最后通过 observe 来创建响应式数据
    if (opts.data) { // 如果没有定义 data 属性
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */); // 则直接定义一个空对象
    }

    // 初始化 computed 
    // 策略：
    // 惰性求值：一开始不求值，当使用计算属性时，就会触发 getter 函数，进行求值
    // 一次求值：通过 watcher.dirty 标识位，只进行一次求值，保存在 watcher.value 中，而当计算属性依赖的属性变动时， watcher.dirty 标识位会重置，此时就会进行重新求值
    // 响应式：通过将计算属性的依赖项 deps 转接给依赖计算属性的 watcher 观察对象，这样当计算属性的依赖项变动时(此时计算属性不会重新 getter 依赖收集，只是重置 watcher.dirty 标识位)，
    //        依赖计算属性的 watcher 观察对象也会重新求值，这样又会触发计算属性的重新求值以及依赖项收集，
    //        而且这样做，还可以当依赖计算属性的不是 watcher 观察对象时，就不需要对计算属性进行响应式，节省了一点内存
    if (opts.computed) { initComputed(vm, opts.computed); }

    // 初始化 watch -- 比较简单，就是根据不同的参数创建不同的 watcher 观察者
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  // 初始化 props -- propsOptions: 组件定义的 props
  // 对于采用 prop 默认值，就需要使用 observe 进行响应式转化
  // 而对于从父组件传入的 prop，prop 是否可观察就由父组件决定，如果传入了可观察的对象，就可以观察，不需要由子组件去决定
  function initProps(vm, propsOptions) {
    var propsData = vm.$options.propsData || {}; // 父组件传入的 prop，也就是实际值
    var props = vm._props = {}; // 为实例添加 _props 属性
    // cache prop keys so that future props updates can iterate using Array 缓存道具键，以便将来的道具更新可以使用Array进行迭代
    // instead of dynamic object key enumeration. 代替动态对象键枚举
    var keys = vm.$options._propKeys = []; // 缓存 propKey 键
    var isRoot = !vm.$parent; // 判断是否为 根组件
    // root instance props should be converted 应该转换根实例的道具
    if (!isRoot) {
      toggleObserving(false); // 实例子组件时，不进行深度转化为响应式
    }
    var loop = function (key) {
      keys.push(key); // 对键进行缓存
      var value = validateProp(key, propsOptions, propsData, vm); // 验证 prop 并且获取 prop 值
      /* istanbul ignore else */
      {
        var hyphenatedKey = hyphenate(key); // 将 key 转化为 驼峰命名
        if (isReservedAttribute(hyphenatedKey) || // 检查 hyphenatedKey 是否为保留属性(key,ref,slot,slot-scope,is)
          config.isReservedAttr(hyphenatedKey)) { // 或者平台(或用户)定义的保留属性
          warn( // 此时发出警告
            ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
            vm
          );
        }
        // 在 props(vm._props) 上添加响应式属性 value -- 不会对 value 深度响应(toggleObserving(false) 限制了)
        defineReactive$$1(props, key, value, function () {
          if (!isRoot && !isUpdatingChildComponent) { // 不是根组件 && 不是在更新阶段
            warn( // 此时就不允许进行设置值
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      }
      // static props are already proxied on the component's prototype 静态道具已经代理在组件的原型上
      // during Vue.extend(). We only need to proxy props defined at 在Vue.extend()。我们只需要定义在的代理道具
      // instantiation here. 这里的实例化
      if (!(key in vm)) {
        proxy(vm, "_props", key); // 用于在 vm 上设置 key，但是实际上是对 _props 的访问，在 vm 上方便访问
      }
    };

    for (var key in propsOptions) loop(key); // 对 props 进行遍历
    toggleObserving(true); // 启用深度转化响应式
  }

  // 初始化 data -- options.data 是 data 数据(一般而言是一个函数)
  function initData(vm) {
    var data = vm.$options.data; // 提取 data 
    data = vm._data = typeof data === 'function' // 为 vm 实例创建一个 _data 属性
      ? getData(data, vm) // 如果 data 是函数，则调用函数，获取 data 值
      : data || {}; // 不是函数情况下，直接获取 data 值

    if (!isPlainObject(data)) { // 如果 data 不是一个对象的话
      data = {}; // 重置为对象
      warn( // 并且发出警告
        'data functions should return an object:\n' +
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
    }
    // proxy data on instance 实例上的代理数据
    var keys = Object.keys(data); //　获取 kyes
    var props = vm.$options.props; // props
    var methods = vm.$options.methods; // methods
    var i = keys.length;
    while (i--) { // 遍历
      var key = keys[i]; // 提取 keys 的每一项
      {
        if (methods && hasOwn(methods, key)) { // data 的 key 不能与 methods 同名
          warn( // 否则发出警告
            ("Method \"" + key + "\" has already been defined as a data property."),
            vm
          );
        }
      }
      if (props && hasOwn(props, key)) { // data 的 key 不能与 props 同名
        warn( // 否则发出警告
          "The data property \"" + key + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else if (!isReserved(key)) { // 并且 key 没有与 vm 实例属性同名
        proxy(vm, "_data", key); // 此时在 vm 实例访问 data key 时代理到 _data 的访问
      }
    }
    // observe data 对 data 进行响应式转化
    observe(data, true /* asRootData */);
  }

  // 获取 data 值
  function getData(data, vm) {
    // #7573 disable dep collection when invoking data getters 在调用数据获取器时禁用dep收集
    pushTarget(); // 暂时禁用依赖收集
    try {
      return data.call(vm, vm) // 获取值
    } catch (e) {
      handleError(e, vm, "data()"); // 如果出错的，交给 handleError 错误处理程序
      return {}
    } finally {
      popTarget(); // 重新启用依赖收集
    }
  }

  var computedWatcherOptions = { lazy: true }; // watcher 配置项

  // 初始化 computed
  function initComputed(vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null); // 为 vm 实例添加 _computedWatchers 属性
    // computed properties are just getters during SSR 计算属性只是 SSR 期间的 getter
    var isSSR = isServerRendering(); // 是否是 SSR 环境

    for (var key in computed) { // 遍历 computed
      var userDef = computed[key]; // 提取注册值
      var getter = typeof userDef === 'function' ? userDef : userDef.get; // 提取取值函数
      if (getter == null) { // 没有设置取值函数
        warn( // 必须设置取值函数
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property. 为 computed 属性创建内部监视程序
        // 创建 Watcher 观察对象，使得计算属性可观察
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the 组件定义的计算属性已经在
      // component prototype. We only need to define computed properties defined 组件原型。我们只需要定义已定义的计算属性
      // at instantiation here. 在实例化
      if (!(key in vm)) {
        defineComputed(vm, key, userDef); // 处理计算属性的特性，并且将属性定义在 vm 实例上
      } else { // 如果当前 key 已经定义在 vm 实例上
        if (key in vm.$data) { // 与 data 中属性同名时
          warn(("The computed property \"" + key + "\" is already defined in data."), vm); // 发出警告
        } else if (vm.$options.props && key in vm.$options.props) { // 与 props 属性同名
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm); // 发出警告
        }
      }
    }
  }

  // 将计算属性添加到目标值上，并且添加计算属性可响应的特性
  function defineComputed(
    target, // 目标值
    key,
    userDef // 用户注册值
  ) {
    var shouldCache = !isServerRendering(); // 是否是 SSR 环境
    if (typeof userDef === 'function') { // 用户注册的是函数
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key) // 不是 SSR 环境
        : createGetterInvoker(userDef); // SSR 环境下
      sharedPropertyDefinition.set = noop; // 不能设置值
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key) // 不是 SSR 环境
          : createGetterInvoker(userDef.get) // SSR 环境下
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop; // 用户注册 setter
    }
    if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () { // 重置 setter，不能赋值，发出警告
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    // 在目标值中添加值
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  // 非 SSR 环境下，这个就是实现计算属性可响应，惰性求值的关键
  function createComputedGetter(key) {
    return function computedGetter() {
      var watcher = this._computedWatchers && this._computedWatchers[key]; // 取出这个计算属性的观察对象
      if (watcher) { // 如果存在的话
        if (watcher.dirty) { // 通过这个标识位，来标识已经求过值，重复使用计算属性时，不会再次求值，而当依赖项改变时，会重置这个标识位，进行重新求值
          watcher.evaluate(); // 在这一步进行 getter 求值，同时会将计算属性的结果值缓存到 value
        }
        if (Dep.target) { // 在这里判断一下，依赖计算属性的是否是观察对象
          // 如果是的话，就可以将计算属性依赖的 deps 转接到当前 Dep.target 引用的观察对象上，此时
          // 就完成了当计算属性依赖属性变动时，依赖计算属性的 watcher 也会触发
          watcher.depend();
        }
        return watcher.value // 返回 value 值
      }
    }
  }

  // 在 SSR 环境下，计算属性是直接求值的
  function createGetterInvoker(fn) {
    return function computedGetter() {
      return fn.call(this, this)
    }
  }

  // 初始化 method
  function initMethods(vm, methods) {
    var props = vm.$options.props; // 提取出注册的 props,用来判断 method 不能与 prop 同名
    for (var key in methods) { // 遍历
      {
        if (typeof methods[key] !== 'function') { // 如果 method 注册的不是函数
          warn( // 则发出警告
            "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
            "Did you reference the function correctly?",
            vm
          );
        }
        if (props && hasOwn(props, key)) { // 判断 method 是否与 prop 同名
          warn( // 否则发出警告
            ("Method \"" + key + "\" has already been defined as a prop."),
            vm
          );
        }
        if ((key in vm) && isReserved(key)) { // method key 是否已经存在 vm 实例上 && key 是否以$或_开头
          warn( // 否则发出警告
            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
            "Avoid defining component methods that start with _ or $."
          );
        }
      }
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm); // 如果不是函数 ? 去一个空函数 : 硬绑定 this
    }
  }

  // 初始化 watch
  function initWatch(vm, watch) {
    for (var key in watch) { // 遍历 watch
      var handler = watch[key]; // 提取出回调
      if (Array.isArray(handler)) { // 如果回调是一个列表的话
        for (var i = 0; i < handler.length; i++) { // 遍历回调列表 
          createWatcher(vm, key, handler[i]); // 给每个回调都创建一个 watcher 观察者对象
        }
      } else {
        createWatcher(vm, key, handler); // 给每个回调都创建一个 watcher 观察者对象
      }
    }
  }

  // 对参数进行规范化，后进行 watcher 创建
  function createWatcher(
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) { // 如果注册的是一个对象的话
      options = handler; // 重组参数
      handler = handler.handler; // 提取回调
    }
    if (typeof handler === 'string') { // 如果是一个字符串
      handler = vm[handler]; // 则在 vm 实例上查找到
    }
    return vm.$watch(expOrFn, handler, options) // 通过 $watch 方法创建 watcher
  }

  // 添加原型属性 $data, $props, 添加原型方法 $set, $del
  function stateMixin(Vue) {
    // flow somehow has problems with directly declared definition object flow 在使用直接声明的定义对象时存在问题
    // when using Object.defineProperty, so we have to procedurally build up 当使用 Object.defineProperty 定义属性，所以我们必须程序地建立
    // the object here. 这里的对象
    var dataDef = {}; // 定义一个对象，用于设置 $data 属性描述符
    dataDef.get = function () { return this._data }; // 定义获取 _data 属性
    var propsDef = {}; // 定义一个对象，用于设置 $props 属性描述符
    propsDef.get = function () { return this._props }; // 获取 _props 属性
    {
      dataDef.set = function () { // 不能设置 $data 属性
        warn(
          'Avoid replacing instance root $data. ' +
          'Use nested data properties instead.',
          this
        );
      };
      propsDef.set = function () { // 不能设置 $props
        warn("$props is readonly.", this);
      };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef); // 为 Vue 实例设置 $data 属性，只读属性
    Object.defineProperty(Vue.prototype, '$props', propsDef); // 为 Vue 实例设置 $props 属性，只读属性

    Vue.prototype.$set = set; // 添加原型方法 $set
    Vue.prototype.$delete = del; // 添加原型方法 $del

    Vue.prototype.$watch = function ( // 添加原型方法 $watch
      expOrFn, // 表达式
      cb, // 回调函数
      options // 配置项
    ) {
      var vm = this; // 实例
      if (isPlainObject(cb)) { // 如果 cb 是一个对象 
        return createWatcher(vm, expOrFn, cb, options) // 先对参数规范化，然后在进行 Wathcer 创建
      }
      options = options || {};
      options.user = true; // 用户定义
      var watcher = new Watcher(vm, expOrFn, cb, options); // 通过 watcher 创建观察者
      if (options.immediate) { // 立即触发一次回调
        try {
          cb.call(vm, watcher.value); // 触发回调
        } catch (error) {
          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
        }
      }
      return function unwatchFn() { // 返回一个可以卸载观察者的函数
        watcher.teardown(); // 卸载观察者
      }
    };
  }

  /*  */

  var uid$3 = 0;

  // 为 Vue 添加实例方法 _init 
  function initMixin(Vue) {
    // 当 new Vue 时，是从这里开始的
    Vue.prototype._init = function (options) {
      var vm = this; // 实例
      // a uid
      vm._uid = uid$3++; // 组件 id

      var startTag, endTag;
      /* istanbul ignore if */
      if (config.performance && mark) { // 性能追踪
        startTag = "vue-perf-start:" + (vm._uid);
        endTag = "vue-perf-end:" + (vm._uid);
        mark(startTag);
      }

      // a flag to avoid this being observed 一个避免被观察到的标志 - 也是可以用来标识组件实例
      vm._isVue = true;
      // merge options 合并选项
      /**
       * 组件选项存储着组件的一些资源
       * 合并选项有两种：
       * 1. 合并子组件：
       * 2. 组件选项(一般为用户 new 的组件，也可能是通过 new Vue.extend(options) 实例化一个子类)合并:
       *    在组件选项中，一般为这样的形式：
       *    {
       *      beforeUpdate: [ƒ],
       *      components: {},
       *      data: {},
       *      directives: {},
       *      el: "#app", 
       *      ...
       *    }
       */
      if (options && options._isComponent) { // _isComponent 是标识子组件的
        // optimize internal component instantiation 优化内部组件实例化
        // since dynamic options merging is pretty slow, and none of the 因为动态选项合并是非常缓慢的，而且没有
        // internal component options needs special treatment. 内部组件选项需要特殊处理
        // 在子组件，组件定义的 options 在创建构造器时，就会存储在 vm.constructor.options 中进行处理，就不需要再次处理
        // 而且在通过 Vue.extend(options) 创建构造器时，已经将结果进行缓存处理，这样多个相同组件引用的是同一个构造器
        // 在这里通过 vm.$options.prototype 引用的是 vm.constructor.options 即组件定义数据
        initInternalComponent(vm, options);
      } else {
        // 合并选项至 $options, 最终这个组件的配置项 $options 中
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor), // 提取出构造函数中的 options - 递归解析 构造器 上存储的 options
          options || {}, // options 参数
          vm
        );
      }
      /* istanbul ignore else */
      {
        initProxy(vm); // 初始化 _renderProxy：用于生成 Vnode 时的上下文环境
      }
      // expose real self 暴露真实的 self
      vm._self = vm;

      initLifecycle(vm); // 初始化相关属性($parent, $root, $children, $refs, _watcher)以及一些生命周期标识符(_inactive, _directInactive, _isMounted, _isDestroyed, _isBeingDestroyed)
      initEvents(vm); // 初始化父组件传递的事件
      initRender(vm); // 主要是初始化渲染相关的属性或方法

      // 执行 callHook 生命周期 --- 在这一步，数据都还没有准备好
      callHook(vm, 'beforeCreate');

      // 初始化 inject 选项 -- 提取出 inject 选项(先从祖先组件中的 _provided 属性中找，没有找到则取默认值)，
      // 然后将其赋值到 vm 实例上，在这里不对 inject 值进行深度转化为响应式，而是通过 defineReactive$$1 方式添加到 vm 实例上，保证其为只读属性
      initInjections(vm); // resolve injections before data/props 在 data/props 前解析注册
      // 初始化了相关数据(props, methods, data, computed, watch)
      initState(vm);
      // 初始化 provide
      initProvide(vm); // resolve provide after data/props 解决后提供数据/道具
      // 执行 created 声明周期 --- 在这一步，数据已经准备完成(inject, props, methods, data, computed, watch, provide)
      callHook(vm, 'created');

      /* istanbul ignore if */
      // 性能追踪
      if (config.performance && mark) {
        vm._name = formatComponentName(vm, false);
        mark(endTag);
        measure(("vue " + (vm._name) + " init"), startTag, endTag);
      }
      // 是否存在 el 选项 -- 在指令式组件时，通常当前不会传递一个 el 选项，而是手动调用 $mount() 来创建 DOM，此时并不会挂载，可以手动挂载
      // 以及在创建子组件时，也不会在这里挂载
      if (vm.$options.el) {
        vm.$mount(vm.$options.el); // 生成 DOM，并且挂载到 el 中
      }
    };
  }

  // 初始化子组件的 options
  function initInternalComponent(vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options); //  创建一个继承 vm.constructor.options 的对象
    // var options = {
    //    _isComponent: true, //是否是组件
    //    parent: parent, //组件的父节点
    //    _parentVnode: vnode, //组件的 虚拟vonde 父节点
    // }
    // doing this because it's faster than dynamic enumeration. 这样做是因为它比动态枚举更快
    var parentVnode = options._parentVnode; // 这个标识子组件的组件 VNode
    opts.parent = options.parent; // 父组件引用
    opts._parentVnode = parentVnode; // 子组件组件 VNode 引用

    var vnodeComponentOptions = parentVnode.componentOptions; // 子组件的 Vnode 中存着一部分的属性：parentVnode.componentOptions
    opts.propsData = vnodeComponentOptions.propsData; // 提取出 propsData
    opts._parentListeners = vnodeComponentOptions.listeners; // 提取出 listeners
    opts._renderChildren = vnodeComponentOptions.children; // 组件子节点？
    opts._componentTag = vnodeComponentOptions.tag; // 组件名称(tag)

    if (options.render) { // 是否定义了 render 函数
      opts.render = options.render; // 提取出 render 函数
      opts.staticRenderFns = options.staticRenderFns; // 提取出 render 函数
    }
  }

  // 解析 new Vue constructor上的 options 拓展参数属性的 合并 过滤去重数据
  function resolveConstructorOptions(Ctor) {
    // 在简单 new Vue() 下，options 的值为：
    /**
     * {
     *  components: {KeepAlive: ..., Transition: ...}
     *  directives: {model: ..., show: ...}
     *  filters: {}
     *  _base: f Vue(options)
     * }
     */
    var options = Ctor.options; // 构造函数中的 options
    if (Ctor.super) { // 有 super 属性，说明 Ctor 是 Vue.extend 构建的子类 继承的子类
      var superOptions = resolveConstructorOptions(Ctor.super); // 递归提取出 options
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
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
    return options // 返回 options
  }

  function resolveModifiedOptions(Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = latest[key];
      }
    }
    return modified
  }

  // 从这里入手，定义 Vue 构造函数
  function Vue(options) {
    if (!(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options); // 开始创建 Vue 实例
  }

  initMixin(Vue); // 为 Vue 添加实例方法 _init
  stateMixin(Vue); // 添加原型属性 $data, $props, 添加原型方法 $set, $del
  eventsMixin(Vue); // 添加原型方法 $on, $once, $off, $emit
  lifecycleMixin(Vue); // 添加原型方法 _update, $forceUpdate, $destroy
  renderMixin(Vue); // 为 Vue 原型添加渲染助手，$nextTick 和 _render 方法

  /*  */
  // 为 Vue 添加静态方法 use
  function initUse(Vue) {
    // 注册插件方法，内部会防止重复注册机制
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = [])); //　已经注册的插件缓存集合
      if (installedPlugins.indexOf(plugin) > -1) {　 // 防止重复注册
        return this
      }

      // additional parameters 额外的参数
      var args = toArray(arguments, 1); // 提取出传递给插件的参数
      args.unshift(this); // 在数组开头添加 this 参数
      // 插件注册有两种方式：插件是一个对象，拥有 install 方法 || 插件本身就是一个函数
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin); // 将已经注册的插件缓存
      return this // 返回 this 用于链式调用
    };
  }

  /*  */
  // 为 Vue 添加静态方法 mixin：全局注册一个混入
  function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin); // 合并选项至 options 中，在创建组件时，会合并 Vue.options 的资源
      return this
    };
  }

  /*  */
  // 为 Vue 添加静态方法 extend：使用基础 Vue 构造器，创建一个“子类”。
  function initExtend(Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance 类继承
     * 作用：创建组件的构造器
     * 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。合并继承new 实例化中的拓展参数或者是用户直接使用Vue.extend 的拓展参数。
     * 把对象转义成组件构造函数。创建一个sub类 构造函数是VueComponent，合并options参数，
     * 把props属性和计算属性添加到观察者中。//如果组件含有名称 则 把这个对象存到 组件名称中, 
     * 在options拓展参数的原型中能获取到该数据Sub.options.components[name] = Sub 简称Ctor，
     * 返回该构造函数
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {}; // 配置项
      var Super = this; // 父类引用
      var SuperId = Super.cid; // 父类 ID
      // 如果通过 extendOptions 同一配置参数进行多次 extend 时，就可以进行缓存，返回同一个子类
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {}); // 在 _Ctor 中缓存
      if (cachedCtors[SuperId]) { // 查找是否已经缓存过
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name; // 组件名称
      if (name) { // 验证组件名称
        validateComponentName(name);
      }
      // 创建子类
      var Sub = function VueComponent(options) {
        // 子组件初始化操作
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype); // 子类继承父类
      Sub.prototype.constructor = Sub; // 修正 constructor 指针
      Sub.cid = cid++; // id 递增
      Sub.options = mergeOptions( // 合并选项至 Sub.options 中
        Super.options,
        extendOptions
      );
      Sub['super'] = Super; // 引用父类

      // For props and computed properties, we define the proxy getters on 对于道具和计算属性，我们在上定义代理getter
      // the Vue instances at extension time, on the extended prototype. This 扩展时，在扩展原型上的Vue实例。这
      // avoids Object.defineroperty calls for each instance created. 避免对创建的每个实例调用Object.defineProperty
      /**
       * 下面两个的目的，不是在于直接初始化 props 和 computed，响应式的相关操作还是通过初始化组件时完成
       * 在这里只是简单的将 props 和 computed 的 key 全部附加到 Sbu.prototype 上，这样这个构造器每个 new 出来的子组件都引用这一个 Sbu.prototype
       * 避免对创建的每个实例都调用 Object.defineProperty 浪费性能
       * 在初始化组件过程中，初始化这些选项时，最后有一个条件 if (!(key in vm)) { proxy(vm, "_props", key) }
       * 这样就避免了对 Sub.options 上的选项重新赋值
       */
      if (Sub.options.props) {
        initProps$1(Sub); // 在 Sub.prototype 上定义 props 的 key
      }
      if (Sub.options.computed) { // 处理 computed
        initComputed$1(Sub); // 初始化子组件构造器上的 computed 选项 -- 只通过 defineComputed 在 Comp.prototype 上添加 computed 的 key
      }

      // allow further extension/mixin/plugin usage 允许进一步使用扩展/mixin/plugin
      Sub.extend = Super.extend; // 继承 extend 方法
      Sub.mixin = Super.mixin; // 继承 mixin 方法
      Sub.use = Super.use; // 继承 use 方法

      // create asset registers, so extended classes 创建资产注册，即扩展类
      // can have their private assets too. 也能拥有自己的私人资产吗
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type]; // 资源 - 组件，指令，过滤器
      });
      // enable recursive self-lookup 使递归 self-lookup
      if (name) {
        Sub.options.components[name] = Sub; //保存引用
      }

      // keep a reference to the super options at extension time. 在扩展时间保持对超级选项的引用
      // later at instantiation we can check if Super's options have 稍后在实例化时，我们可以检查Super的选项是否有
      // been updated. 被更新
      Sub.superOptions = Super.options; // 保存 父类的 options -- 上面的注释可得知，是为了防止更新
      Sub.extendOptions = extendOptions; // 都要保存
      Sub.sealedOptions = extend({}, Sub.options); // 

      // cache constructor 缓存的构造函数
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  // 初始化子组件构造器上的 props 选项
  function initProps$1(Comp) {
    var props = Comp.options.props; // 获取 props
    for (var key in props) {
      proxy(Comp.prototype, "_props", key); // 在 Comp.prototype 上访问 props 的 key 实际上是访问 _props.key
    }
  }

  // 初始化子组件构造器上的 computed 选项 
  function initComputed$1(Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]); // 只通过 defineComputed 在 Comp.prototype 上添加 computed 的 key
    }
  }

  /*  */
  // 为 Vue 添加静态方法 component， directive，filter：用于注册资源
  function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods. 创建资产注册方法
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) { // 如果没有传递第二个参数，表示为返回已注册的资源
          return this.options[type + 's'][id] // 直接返回资源
        } else { // 否则为注册资源
          /* istanbul ignore if */
          if (type === 'component') {
            validateComponentName(id); // 检测组件名是否合规
          }
          if (type === 'component' && isPlainObject(definition)) { // 注册组件 && 参数为对象
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition); // 利用 extend 创建一个基于 definition 的子类
          }
          if (type === 'directive' && typeof definition === 'function') { // 注册指令 && 参数为函数
            definition = { bind: definition, update: definition }; // 指令为函数时，则为 bind 和 update 的简写
          }
          this.options[type + 's'][id] = definition; // 注册到 Vue.options 中
          return definition // 返回 definition
        }
      };
    });
  }

  /*  */



  function getComponentName(opts) {
    return opts && (opts.Ctor.options.name || opts.tag) // 返回组件 name || 组件 tag
  }

  // 判断指定 name 是否符合 pattern 规则
  function matches(pattern, name) {
    if (Array.isArray(pattern)) { // 如果是数组
      return pattern.indexOf(name) > -1 // 则判断是否在集合中
    } else if (typeof pattern === 'string') { // 如果是字符串
      return pattern.split(',').indexOf(name) > -1 // 判断是否在字符串集合中
    } else if (isRegExp(pattern)) { // 如果是正则
      return pattern.test(name) // 判断是否在匹配正则
    }
    /* istanbul ignore next */
    return false
  }

  // 通过 filter 判断缓存组件是否应该销毁
  function pruneCache(keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache; // 所有缓存组件 vnode
    var keys = keepAliveInstance.keys; // keys
    var _vnode = keepAliveInstance._vnode; // 当前渲染的 vnode
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) { // 通过 filter 过滤方法来判断该 name 的组件是否应该销毁
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  // 从缓存项中清除指定
  function pruneCacheEntry(
    cache, // 缓存项
    key, // 需要清除的
    keys, // 缓存项所有的 key
    current // 删除当前的 vnode
  ) {
    var cached$$1 = cache[key]; // 提取出缓存项
    // !current || cached$$1.tag !== current.tag 这个表示，如果需要删除的组件是当前渲染的组件，此时不要执行销毁程序
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy(); // 调用删除 vnode 组件的 $destroy() 实行销毁程序
    }
    cache[key] = null; // 从缓存项中清除
    remove(keys, key); // 从 keys 项中清除该项
  }

  var patternTypes = [String, RegExp, Array];

  // keep-alive 内部组件
  var KeepAlive = {
    name: 'keep-alive', // 组件名称
    abstract: true, // 表示为内部组件

    props: { // 参数
      include: patternTypes, // 字符串或正则表达式。只有名称匹配的组件会被缓存。
      exclude: patternTypes, // 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
      max: [String, Number] // 数字。最多可以缓存多少组件实例。
    },

    created: function created() { // 初始化生命周期
      this.cache = Object.create(null); // 创建内部缓存组件
      this.keys = []; // 已经缓存组件的 keys 集合
    },

    destroyed: function destroyed() { // 销毁生命周期
      for (var key in this.cache) { // 遍历缓存集合
        pruneCacheEntry(this.cache, key, this.keys); // 销毁全部组件
      }
    },

    mounted: function mounted() { // 初次挂载生命周期
      var this$1 = this;

      // 监听 include, exclude 数据变化，变化时，及时清理需要销毁的组件
      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    // 阅读了大致的更新过程，当 keep-alive 包裹的插槽改变时，keep-alive 也会重新渲染的过程
    /**
     * if (needsForceUpdate) {
     *   vm.$slots = resolveSlots(renderChildren, parentVnode.context);
     *   vm.$forceUpdate();
     * }
     * 当 keep-ailve 插槽内的内容改变时，就会触发 keep-alive 父组件的重渲染
     * 当 keep-alive 父组件的重渲染发现 keep-alive 的 vnode 的插槽内容变动时，
     * 就会手动触发 keep-alive 的 $forceUpdate() 方法强制更新
     * 这个机制不仅仅针对 keep-alive，而是对所有插槽改变的组件
     */
    render: function render() { // 渲染函数
      var slot = this.$slots.default; // 插槽内容
      var vnode = getFirstComponentChild(slot); // 从插槽数组中找出组件 vnode
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) { // 如果存在 组件配置项
        // check pattern 检查模式
        var name = getComponentName(componentOptions); // 获取组件 name || tag
        var ref = this; // this 引用
        var include = ref.include; // 字符串或正则表达式。只有名称匹配的组件会被缓存。
        var exclude = ref.exclude; // 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
        if (
          // not included 不包括
          (include && (!name || !matches(include, name))) || // 不包含在 include 数组中
          // excluded 包含
          (exclude && name && matches(exclude, name)) // 包含在 exclude 数组中
        ) {
          return vnode // 不进行缓存操作，直接返回
        }

        var ref$1 = this;
        var cache = ref$1.cache; // cache 属性
        var keys = ref$1.keys; // keys 属性
        var key = vnode.key == null // 获取缓存 key
          // same constructor may get registered as different local components 同一个构造函数可以注册为不同的本地组件
          // so cid alone is not enough (#3269) 所以只有cid是不够的
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) { // 如果已经存在缓存 key
          vnode.componentInstance = cache[key].componentInstance; // 从缓存项中提取组件实例
          // make current key freshest 使当前的关键是新鲜的
          // 下面就是将对应的 key 放入最后面，表示是最新鲜的
          remove(keys, key); // 先从 keys 删除 key
          keys.push(key); // 再推入其中
        } else { // 如果没有开始缓存
          cache[key] = vnode; // 先进行缓存
          keys.push(key); // 将缓存 key 推入 keys 中
          // prune oldest entry 删除最老的条目
          if (this.max && keys.length > parseInt(this.max)) { // 如果设置了最大缓存数，则先将其最老的组件删除
            pruneCacheEntry(cache, keys[0], keys, this._vnode); // 清除最老的条目
          }
        }

        vnode.data.keepAlive = true; // 给 vnode.data 一个标识 - 这个标识很重要
      }
      /**
       * 如果返回的是一个 组件VNode，此时就会去渲染这个 VNode，也会生成一个 VNode 表示的 DOM
       * 这样的话，也就相当于 keep-alive 的 DOM 挂载
       */
      return vnode || (slot && slot[0]) // 返回这个 vnode
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /* 为 Vue 添加静态方法(全局 API) */

  function initGlobalAPI(Vue) {
    // config
    var configDef = {}; // config 对象
    configDef.get = function () { return config; }; // config　对象函数 -- 闭包引用 config 对象(私有变量的用法)，防止外部更改
    {
      configDef.set = function () { // 不能设置 config
        warn(
          'Do not replace the Vue.config object, set individual fields instead.'
        );
      };
    }
    Object.defineProperty(Vue, 'config', configDef); // 为 Vue 设置静态属性 config, Vue.config 是一个对象，包含 Vue 的全局配置

    // exposed util methods. 公开实效的方法
    // NOTE: these are not considered part of the public API - avoid relying on 注意:这些不被认为是公共API的一部分-避免依赖
    // them unless you are aware of the risk. 除非你知道其中的风险
    Vue.util = {
      warn: warn, // 
      extend: extend, // 合并对象方法
      mergeOptions: mergeOptions, // 合并选项方法
      defineReactive: defineReactive$$1 // 为对象添加某个响应式的属性
    };

    Vue.set = set; // 为 Vue 添加 set 静态方法
    Vue.delete = del; // 为 Vue 添加 del 静态方法
    Vue.nextTick = nextTick; // 为 Vue 添加 nextTick 静态方法

    // 2.6 explicit observable API 明确的可观测的API
    // 在 2.6 版本，将响应式 API 暴露到 Vue 静态方法中，用于让一个对象可响应。
    Vue.observable = function (obj) {
      observe(obj);
      return obj
    };

    Vue.options = Object.create(null); // 定义 options，这是个重要的参数，全局混入(也是直接将混入项合并至 options)或全局资源(组件、指令、过滤器)都会存储在这里
    // var ASSET_TYPES = [
    //   'component', // 组件
    //   'directive', // 指令
    //   'filter' // 过滤器
    // ];
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object 这用于标识扩展所有纯对象的“基”构造函数
    // components with in Weex's multi-instance scenarios. 组件与在Weex的多实例场景
    Vue.options._base = Vue; // 标识 Vue

    // 在浏览器环境下，builtInComponents只有 keep-alive 内部组件
    extend(Vue.options.components, builtInComponents); // 合并内部组件资源

    initUse(Vue); // 为 Vue 添加静态方法 use
    initMixin$1(Vue); // 为 Vue 添加静态方法 mixin：全局注册一个混入
    initExtend(Vue); //  Vue 添加静态方法 extend：使用基础 Vue 构造器，创建一个“子类”。
    initAssetRegisters(Vue); // 为 Vue 添加静态方法 component， directive，filter：用于注册资源
  }

  initGlobalAPI(Vue); // 为 Vue 添加静态方法(也是全局 API)

  // $isServer：当前 Vue 实例是否运行于服务器。只读属性
  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  // $ssrContext？应该是与 SSR 相关属性
  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get() {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation 为ssr运行时助手安装公开FunctionalRenderContext
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.6.11'; // Vue 版本

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding 应该使用道具进行绑定的属性
  /* mustUseProp 校验属性
  * 1. attr === 'value', tag 必须是 'input,textarea,option,select,progress' 其中一个 type !== 'button'
  * 2. attr === 'selected' && tag === 'option'
  * 3. attr === 'checked' && tag === 'input'
  * 4. attr === 'muted' && tag === 'video'
  * 的情况下为真
  * */
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  // 判断指定值是否为 contenteditable,draggable,spellcheck 属性
  // contenteditable：规定元素内容是否可编辑。值为 true, false
  // draggable：规定元素是否可拖动。值为 true, false, auto
  // spellcheck：规定是否对元素内容进行拼写检查。值为 ture, false
  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

  var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false' // 如果 value 是一个 null || undefined || false || 'false'
      ? 'false' // 则直接返回 'false'
      // allow arbitrary string value for contenteditable 允许contentteditable的任意字符串值
      : key === 'contenteditable' && isValidContentEditableValue(value)
        ? value
        : 'true' // 否则返回 'true'
  };

  // 判断指定值是否为需要设置为布尔值的属性
  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode(vnode) {
    var data = vnode.data; // 提取出 data 属性
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) { // 如果 vnode 是一个 组件vnode
      childNode = childNode.componentInstance._vnode; // 提取出 组件vnode 表示的 vnode
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data); // 合并 组件vnode 的 class（此时为 <my-common class='xxx'></my-common>） 和 组件根元素的 class
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  // 合并 parent 和 child 的 class 属性
  function mergeClassData(child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass), // 使用 concat 策略合并
      class: isDef(child.class) // 如果 child.class 存在
        ? [child.class, parent.class] // 则返回一个数组
        : parent.class // 否则返回 parent.class
    }
  }

  function renderClass(
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  // 根据 a,b 情况返回不一样形式
  function concat(a, b) {
    // a 存在，b 也存在 -- 返回 a + ' ' + b 格式
    // a 存在，b 不存在 -- 返回 a
    // a 不存在，b 也不存在 -- 返回 b || ''
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  // 将 value 序列化 -- 最终就是 'xx xx xx' 形式
  function stringifyClass(value) {
    if (Array.isArray(value)) { // 如果是数组
      return stringifyArray(value) // 序列化数组形式 value -- 最终序列成 'xx xx xx'
    }
    if (isObject(value)) { // 如果是对象
      return stringifyObject(value) // 序列化对象形式 value -- 最终序列成 'xx xx xx'
    }
    if (typeof value === 'string') { // 如果是 string 类型
      return value // 则直接返回
    }
    /* istanbul ignore next */
    return '' // 其他情况，返回 ''
  }

  // 序列化数组形式 value -- 最终序列成 'xx xx xx'
  function stringifyArray(value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) { // 遍历数组
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') { // 深度递归序列化 value
        if (res) { res += ' '; } // 使用 ' ' 空格拼接各项
        res += stringified;
      }
    }
    return res
  }

  // 序列化对象形式 value -- 最终序列成 'xx xx xx'
  function stringifyObject(value) {
    var res = '';
    for (var key in value) { // 遍历对象
      if (value[key]) { // 这里应该是内部保证了对象的属性值不会存在是对象的问题
        if (res) { res += ' '; }
        res += key;
      }
    }
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  // 判断标签是否为 html 标签
  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may 这个映射是有意选择的，只覆盖可能的SVG元素
  // contain child elements. 包含子元素
  // 判断是否为 svg 相关元素
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  var isPreTag = function (tag) { return tag === 'pre'; }; // 判断标签是否是 pre
  // 判断指定标签是否为 html 标签 或者 svg 标签
  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };
  // 判断指定 tag 标签是否为 svg 或 math 
  function getTagNamespace(tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML 对MathML的基本支持
    // note it doesn't support other MathML elements being component roots 注意，它不支持其他MathML元素作为组件根
    if (tag === 'math') {
      return 'math'
    }
  }

  // 检查指定标签是否为未知标签(也就是不合法标签) -- 未知标签返回 true
  var unknownElementCache = Object.create(null);
  function isUnknownElement(tag) {
    /* istanbul ignore if */
    if (!inBrowser) { // 不是浏览器环境
      return true // 未知标签
    }
    if (isReservedTag(tag)) { //　检查是否是 html 或 svg 标签
      return false // 是合法标签
    }
    tag = tag.toLowerCase(); // 小写
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) { // 检查缓存
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag); // 使用 tag 尝试创建 html 标签
    if (tag.indexOf('-') > -1) { // 下面进行检查
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  // 判断 type 是否属于 text,number,password,search,email,tel,url 其中一种
  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already. 查询一个元素选择器，如果它还不是一个元素
   * 作用：根据 el, 查找到元素
   */
  function query(el) {
    if (typeof el === 'string') { // 如果是 string
      var selected = document.querySelector(el); // 查找到元素
      if (!selected) { // 如果没有找到
        warn( // 发出警告
          'Cannot find element: ' + el
        );
        return document.createElement('div') // 新创建一个 div
      }
      return selected // 返回
    } else {
      return el // 其他情况，直接返回
    }
  }

  /*  */
  // 创建元素节点
  function createElement$1(tagName, vnode) {
    var elm = document.createElement(tagName); // 使用 tagName 创建节点
    if (tagName !== 'select') { // 如果不是 select 节点，则直接返回
      return elm
    }
    // false or null will remove the attribute but undefined will not false或null将删除该属性，但undefined不会
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple'); // 这里的 multiple 有什么问题吗？
    }
    return elm
  }

  // 创建一个具有指定的命名空间URI和限定名称的元素。
  function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  // 创建文本节点
  function createTextNode(text) {
    return document.createTextNode(text)
  }

  // 创建一个注释节点
  function createComment(text) {
    return document.createComment(text)
  }

  // 在指定节点之前插入节点
  function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild(node, child) {
    node.removeChild(child);
  }

  // 在指定父节点最后追加指定节点
  function appendChild(node, child) {
    node.appendChild(child);
  }

  // 查找指定节点的父节点
  function parentNode(node) {
    return node.parentNode
  }

  function nextSibling(node) {
    return node.nextSibling
  }

  function tagName(node) {
    return node.tagName
  }

  // 设置文本节点的文本
  function setTextContent(node, text) {
    node.textContent = text;
  }

  function setStyleScope(node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  // node 节点操作方法
  var nodeOps = /*#__PURE__*/Object.freeze({
    createElement: createElement$1, // 创建元素节点
    createElementNS: createElementNS, // 创建一个具有指定的命名空间URI和限定名称的元素。
    createTextNode: createTextNode, // 创建文本节点
    createComment: createComment, // 创建注释节点
    insertBefore: insertBefore, // 在指定节点之前插入节点
    removeChild: removeChild,
    appendChild: appendChild, // 在指定父节点最后追加指定节点
    parentNode: parentNode, // 查找指定节点的父节点
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent, // 设置文本节点的文本
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create(_, vnode) {
      registerRef(vnode);
    },
    update: function update(oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy(vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef(vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  // 判断 a 和 b 是否大致相等 - 如果大致相等的话，可以只做更新处理，否则就需要做初始化新的，销毁旧的处理
  function sameVnode(a, b) {
    return (
      a.key === b.key && ( // 判断 a 和 b 的 key 属性需要相同
        ( // 判断 a 和 b 的 tag，isComment，data 等数据基本一致
          a.tag === b.tag && // tag 标签一致
          a.isComment === b.isComment && // a 和 b 的 isComment 标记一样
          isDef(a.data) === isDef(b.data) && // 
          sameInputType(a, b) // 判断 a 和 b 如果是 input　标签并且 type 相同
        ) || ( // 在这里判断一些特殊组件(暂时还不清楚，可能是异步组件，函数式组件)
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  // 判断 a 和 b 如果是 input　标签并且 type 相同
  function sameInputType(a, b) {
    if (a.tag !== 'input') { return true } // 如果不是 input 标签，则没有必要比较
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type; // 获取 a 的 input 类型
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type; // 获取 b 的 input 类型
    // && 的优先级比 || 高
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB) // a 和 b 的类型相同 || (// 判断 type 是否属于 text,number,password,search,email,tel,url 其中一种)
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction(backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    // 使用 elm DOM 创建一个 VNode
    function emptyNodeAt(elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    // 创建一个 rmcb -- 用于当 listeners 数量为 0 时，执行删除节点操作
    // 作用：当将 dom 上的节点执行完成删除模块 cbs 相关删除操作后，执行删除节点操作
    function createRmCb(childElm, listeners) {
      function remove$$1() {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners; // 将模块数量挂载 返回函数的 listeners 属性上
      return remove$$1
    }

    // 删除节点操作
    function removeNode(el) {
      var parent = nodeOps.parentNode(el); // 找到父节点
      // element may have already been removed due to v-html / v-text 元素可能已经由于v-html / v-text被删除
      if (isDef(parent)) { // 存在父节点情况下，
        nodeOps.removeChild(parent, el); // 执行删除操作
      }
    }

    // 检查 dom 元素是否为 合法标签
    function isUnknownElement$$1(vnode, inVPre) { // inVPre：标记 标签是否还有 v-pre 指令，如果没有则是false
      return (
        !inVPre && // 标记 标签是否还有 v-pre 指令，如果没有则是false
        !vnode.ns &&
        !( // config.ignoredElements：须使 Vue 忽略在 Vue 之外的自定义元素 (e.g. 使用了 Web Components APIs)。否则，它会假设你忘记注册全局组件或者拼错了组件名称，从而抛出一个关于 Unknown custom element 的警告。
          config.ignoredElements.length && // 也就是这里查找一下这个标签是否是自定义的合法标签
          config.ignoredElements.some(function (ignore) { //some() 方法测试是否至少有一个元素通过由提供的函数实现的测试。
            return isRegExp(ignore)
              ? ignore.test(vnode.tag)
              : ignore === vnode.tag
          })
        ) &&
        config.isUnknownElement(vnode.tag) // 判断 tag 是否为合法标签
      )
    }

    var creatingElmInVPre = 0;

    function createElm(
      vnode, // 创建的 vnode
      insertedVnodeQueue, // 创建子组件队列
      parentElm, // 挂载节点的父节点
      refElm, // 挂在节点的下一个节点，用于定位位置
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render! 这个 vnode 在以前的渲染中使用过
        // now it's used as a new node, overwriting its elm would cause 现在它被用作一个新节点，重写它的elm会导致
        // potential patch errors down the road when it's used as an insertion 当它被用作插入时，潜在的补丁错误就会出现
        // reference node. Instead, we clone the node on-demand before creating 参考节点。相反，我们在创建节点之前按需克隆节点
        // associated DOM element for it. 关联的DOM元素
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check 过渡输入检查

      // 这下面一个重点，在 createComponent 判断是否为子组件渲染
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      // 元素渲染应该走到这里
      var data = vnode.data; // 获取 data 数据
      var children = vnode.children; // 获取子元素
      var tag = vnode.tag; // 获取节点标签
      if (isDef(tag)) { // 如果 tag 不为空，在这里表示标签元素
        {
          if (data && data.pre) { // 标签是否是 pre？
            creatingElmInVPre++;
          }
          if (isUnknownElement$$1(vnode, creatingElmInVPre)) { // 检查 tag 是否合法
            warn( // 不合法，发出警告
              'Unknown custom element: <' + tag + '> - did you ' +
              'register the component correctly? For recursive components, ' +
              'make sure to provide the "name" option.',
              vnode.context
            );
          }
        }

        vnode.elm = vnode.ns // 字符串值，可为此元素节点规定命名空间的名称。 可能是svg 或者 math 节点
          ? nodeOps.createElementNS(vnode.ns, tag) // 创建一个具有指定的命名空间URI和限定名称的元素。
          : nodeOps.createElement(tag, vnode); // 创建一个元素节点
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue); // 创建子节点
          if (isDef(data)) { // 判断是否存在 data 信息
            invokeCreateHooks(vnode, insertedVnodeQueue); // 将 data 添加至 dom 节点上
          }
          // 插入节点 - 如果是子组件的话，此时 parentElm, refElm 是 undefined，这个方法就什么也不做 -- 子节点不会走到这一步
          // 子节点在 createComponent 方法内部完成 插入节点 操作
          insert(parentElm, vnode.elm, refElm);
        }

        if (data && data.pre) {
          creatingElmInVPre--;
        }
      } else if (isTrue(vnode.isComment)) { // 如果是注释节点
        vnode.elm = nodeOps.createComment(vnode.text); // 创建一个注释节点
        insert(parentElm, vnode.elm, refElm); // 在 parentElm 下，在 refElm 之前插入这个注释节点
      } else { // 否则就是一个文本节点
        vnode.elm = nodeOps.createTextNode(vnode.text); // 创建一个文本节点
        insert(parentElm, vnode.elm, refElm); // 插入 dom
      }
    }

    // 子组件的创建
    function createComponent(
      vnode, // vnode
      insertedVnodeQueue, // 子组件队列
      parentElm, // 父节点
      refElm // 下一个节点
    ) {
      var i = vnode.data; // 获取 data 数据
      if (isDef(i)) { // 判断是否存在 data
        // 这里表示是否为缓存组件
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive; // 组件已经创建 && 被 keepAlive 缓存
        if (isDef(i = i.hook) && isDef(i = i.init)) { // 判断是否存在 init 的 hook 钩子
          // 就算是缓存组件,也需要通过 init 钩子去执行相关操作
          i(vnode, false /* hydrating */);
        }
        // after calling the init hook, if the vnode is a child component 调用init钩子后，如果vnode是子组件
        // it should've created a child instance and mounted it. the child 它应该创建一个子实例并挂载它。这个孩子
        // component also has set the placeholder vnode's elm. 组件还设置了占位符vnode的elm
        // in that case we can just return the element and be done. 在这种情况下，我们只需要返回元素就可以了
        if (isDef(vnode.componentInstance)) { // 是否创建好了子组件
          initComponent(vnode, insertedVnodeQueue); // 将组件推入到 insertedVnodeQueue 队列中以及为组件 dom 添加相关属性和 css 作用域
          /**
           * 原来在这里将组件 dom 插入到 dom 上的
           * 在这里就存在着插入节点的位置信息
           */
          insert(parentElm, vnode.elm, refElm); // 插入节点
          if (isTrue(isReactivated)) { // 是否是缓存节点
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    // 将组件推入到 insertedVnodeQueue 队列中以及为组件 dom 添加相关属性和 css 作用域
    function initComponent(vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) { // vnode 如果引用了 pendingInsert
        // 在这里，如果是子组件的渲染过程，子组件中的子组件都会收集到 insertedVnodeQueue 中，这样一般而言都会在根组件的 insertedVnodeQueue 被收集，此后可以在一次性调用所有组件的钩子
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert); // 将其推入到 insertedVnodeQueue 集合中
        vnode.data.pendingInsert = null; // 重置为 null
      }
      vnode.elm = vnode.componentInstance.$el; // 将组件 dom 挂在 elm 上
      if (isPatchable(vnode)) { // 判断该 vnode 渲染出来的是一个 标签元素
        invokeCreateHooks(vnode, insertedVnodeQueue); // 添加属性(class, styles, attrs, 事件等)至组件 dom 中
        setScope(vnode); // 添加作用域变量
      } else {
        // empty component root. 空的组件根
        // skip all element-related modules except for ref (#3455) 跳过所有与元素相关的模块，除了ref
        registerRef(vnode);
        // make sure to invoke the insert hook 确保调用了插入钩子
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition 黑客#4339:一个重新激活的内部过渡组件
      // does not trigger because the inner node's created hooks are not called 不触发是因为内部节点创建的钩子没有被调用
      // again. It's not ideal to involve module-specific logic in here but 一次。在这里包含特定于模块的逻辑并不理想，但是
      // there doesn't seem to be a better way to do it. 似乎没有更好的办法来做这件事
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    // 插入节点
    function insert(parent, elm, ref$$1) {
      if (isDef(parent)) { // 如果存在父节点
        if (isDef(ref$$1)) { // 并且存在坐标节点
          if (nodeOps.parentNode(ref$$1) === parent) { // 并且坐标节点的父节点与目标节点的父节点相同
            nodeOps.insertBefore(parent, elm, ref$$1); // 此时插入至坐标节点之前
          }
        } else { // 否则的话，就直接在父节点追加该节点
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    // 创建子节点
    function createChildren(
      vnode, // 节点 vnode
      children, // 子节点
      insertedVnodeQueue // 子组件队列
    ) {
      if (Array.isArray(children)) { // 如果存在子节点
        {
          checkDuplicateKeys(children); // 检查子节点 children 中是否重复注册了 key
        }
        for (var i = 0; i < children.length; ++i) { // 遍历子节点
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i); // 使用 createElm 创建子节点
        }
      } else if (isPrimitive(vnode.text)) { // 检查 vnode.text 是否为基础类型(string, number, symbol, boolean)
        // 此时如果没有子节点的话，可能存在 text 文本
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text))); // 将其文本推入 vnode 表示的 dom 下
      }
    }

    // 判断该 vnode 渲染出来的是一个 标签元素
    function isPatchable(vnode) {
      while (vnode.componentInstance) { // 如果 vnode 是一个组件 vnode，
        // 这里如果 组件vnode 渲染出来的还是一个 组件vnode，则继续递归查找，直至找到一个不是表示 组件vnode 的
        // 会有这种 组件vnode 渲染出来还是一个 组件vnode 的情况：暂时想到 keep-alive 中 render 函数返回的是一个 vnode，就是这样情况，那可以推论 router-view 应该也是返回一个 vnode
        vnode = vnode.componentInstance._vnode; // 则递归的查找这个 组件Vnode 渲染出来的 vnode
      }
      return isDef(vnode.tag)
    }

    // 为 dom 添加 class,style,attrs,domlisteners, props。。。 以及 如果是组件，则将组件钩子收集至 insertedVnodeQueue 队列中
    function invokeCreateHooks(vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) { // 遍历模块方法 cbs
        cbs.create[i$1](emptyNode, vnode); // 添加 dom 相关属性
      }
      i = vnode.data.hook; // Reuse variable 重用变量 -- 提取组件钩子
      if (isDef(i)) { // 如果存在组件钩子
        if (isDef(i.create)) { i.create(emptyNode, vnode); } // 是否存在 create 钩子 -- 暂时没有发现使用场景
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); } // insert 插入钩子
      }
    }

    // set scope id attribute for scoped CSS. 为限定CSS设置范围id属性
    // this is implemented as a special case to avoid the overhead 这是作为一种特殊情况来实现的，以避免开销
    // of going through the normal attribute patching process. 通过正常的属性修补过程
    function setScope(vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance. 对于插槽内容，它们还应该从主机实例获得scopeId
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    // 新增子节点
    function addVnodes(
      parentElm, // 父节点
      refElm, // 定位节点
      vnodes, // 需要添加的集合
      startIdx, // 开始索引
      endIdx, // 结束索引
      insertedVnodeQueue // 子组件集合 - 因为在 update 阶段，也是存在新增子组件集合的
    ) {
      for (; startIdx <= endIdx; ++startIdx) { // 遍历
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx); // 通过 vnode 创建 DOM
      }
    }

    // 销毁 vnode 表示的 dom -- 递归删除子节点 并且执行 cbs 模块的 destroy 操作
    function invokeDestroyHook(vnode) {
      var i, j;
      var data = vnode.data; // vnode.data 表示 vnode 的一些数据，如 class, attrs等等
      if (isDef(data)) { // 如果存在 data
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); } // 如果是组件 vnode 的话，就需要调用组件的销毁程序
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); } // 使用不同阶段的钩子进行 vnode 的销毁
      }
      if (isDef(i = vnode.children)) { // 是否存在子节点
        for (j = 0; j < vnode.children.length; ++j) { // 遍历子节点 
          invokeDestroyHook(vnode.children[j]); // 销毁子节点
        }
      }
    }

    // 删除 vnode 表示的节点
    function removeVnodes(
      vnodes, // 删除的 vnodes 集合
      startIdx, // 开始索引
      endIdx // 结束索引
    ) {
      for (; startIdx <= endIdx; ++startIdx) { // 遍历
        var ch = vnodes[startIdx]; //提取 vnode
        if (isDef(ch)) { // 存在的话
          if (isDef(ch.tag)) { // 存在 tag 的话，表示是标签节点或组件节点?
            removeAndInvokeRemoveHook(ch); // 执行模块 cbs 的 remove 回调 并且 执行完成后删除 DOM 删除
            invokeDestroyHook(ch); // 销毁 vnode 表示的 dom -- 递归删除子节点 并且执行 cbs 模块的 destroy 操作
          } else { // Text node 文本节点
            removeNode(ch.elm); // 直接删除文本节点即可
          }
        }
      }
    }

    // 执行模块 cbs 的 remove 回调 并且 执行完成后删除 DOM 删除
    function removeAndInvokeRemoveHook(vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) { // 如果没有
        var i;
        var listeners = cbs.remove.length + 1; // 模块 cbs 中删除模块的个数
        if (isDef(rm)) {
          // we have a recursively passed down rm callback 我们有一个递归传递的rm回调
          // increase the listeners count 增加监听器数量
          // 在这里因为如果是子组件递归调用的话，就需要将子组件的 删除回调 也执行后，只需要在 DOM 树上移除一次根组件的 DOM 即可
          rm.listeners += listeners;
        } else {
          // directly removing 直接删除
          rm = createRmCb(vnode.elm, listeners); // 创建 rm 回调，用于当 listeners 调用结束后执行删除节点操作
        }
        // recursively invoke hooks on child component root node 递归地调用子组件根节点上的钩子
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) { // 如果 vnode 是一个子组件 vnode 的话
          removeAndInvokeRemoveHook(i, rm); // 递归调用 - i 表示子组件的 vnode
        }
        for (i = 0; i < cbs.remove.length; ++i) { // 执行删除模块的回调
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) { // 如果是子组件，则调用子组件的 remove 钩子
          i(vnode, rm);
        } else {
          rm(); // 执行 rm 回调，减少一次删除模块的操作，并且内部会判断是否没有了删除模块需要操作，此时就会将 DOM 删除
        }
      } else { // 什么情况下会走这一步？
        removeNode(vnode.elm); // 直接删除 DOM
      }
    }

    // 更新子节点
    function updateChildren(
      parentElm, // 父节点
      oldCh, // 旧子节点
      newCh, // 新子节点
      insertedVnodeQueue, // 新的子组件集合 
      removeOnly
    ) {
      var oldStartIdx = 0; // 旧的子节点开始索引
      var newStartIdx = 0; // 新的子节点开始索引
      var oldEndIdx = oldCh.length - 1; // 旧的最后一个子节点索引
      var oldStartVnode = oldCh[0]; // 旧的第一个子节点
      var oldEndVnode = oldCh[oldEndIdx]; // 旧的最后一个子节点
      var newEndIdx = newCh.length - 1; // 新的最后一个子节点索引
      var newStartVnode = newCh[0]; // 新的第一个子节点
      var newEndVnode = newCh[newEndIdx]; // 新的最后一个子节点
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group> removeOnly 是使用的特殊标志
      // to ensure removed elements stay in correct relative positions 以确保被移除的元素保持在正确的相对位置
      // during leaving transitions 在离开转换
      var canMove = !removeOnly;

      {
        checkDuplicateKeys(newCh); // 对新的子节点进行 key 检查，同一级子节点的 key 不能重复
      }

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left Vnode已向左移动
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
      }
    }

    // 检查子节点 children 中是否重复注册了 key
    function checkDuplicateKeys(children) {
      var seenKeys = {}; // 对象
      for (var i = 0; i < children.length; i++) { // 遍历子节点
        var vnode = children[i];
        var key = vnode.key; // 提取每项 vnode 的 key
        if (isDef(key)) { // 如果存在 key 的话
          if (seenKeys[key]) { // 检查 key 是否已经被注册
            warn( // 不能重复注册 key, 发出警告
              ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
              vnode.context
            );
          } else {
            seenKeys[key] = true;
          }
        }
      }
    }

    function findIdxInOld(node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    // 更新 VNode 操作
    function patchVnode(
      oldVnode, // 旧的 Vnode
      vnode, // 新的 Vnode
      insertedVnodeQueue, // 新的子组件队列
      ownerArray,
      index,
      removeOnly // 是否删除全部的标识
    ) {
      if (oldVnode === vnode) { // 如果两个 Vnode 相同，则退出函数
        return
      }

      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      var elm = vnode.elm = oldVnode.elm; // 提取出以前就渲染好的 DOM

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees. 为静态树重用元素
      // note we only do this if the vnode is cloned - 注意，我们只在vnode被克隆的情况下才这样做
      // if the new node is not cloned it means the render functions have been 如果没有克隆新节点，则意味着已经克隆了渲染函数
      // reset by the hot-reload-api and we need to do a proper re-render. 通过hot-reload-api重置，我们需要做一个适当的重新渲染
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data; // data 数据
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) { // 在这里，判断 vnode 是否为组件 vnode
        i(oldVnode, vnode); // 如果是的话，就需要通过 prepatch 钩子来更新组件 - 在这里处理组件的更新
      }

      var oldCh = oldVnode.children; // oldVnode 的 子节点
      var ch = vnode.children; // vnode 的 子节点
      if (isDef(data) && isPatchable(vnode)) { // 存在 data && 该 vnode 渲染出来的是一个 标签元素
        // 此时通过 cbs 模块的更新 模块队列 来更新该节点的 data 属性
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); } // 先更新 vnode 层面的模块更新
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); } // 在更新 update 操作
      }
      if (isUndef(vnode.text)) { // 如果不是文本节点
        if (isDef(oldCh) && isDef(ch)) { // 如果新旧 vnode 都存在子节点
          // 此时就需要进行子节点的比对
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) { // 如果旧 vnode 不存在子节点，新 vnode 存在子节点
          // 此时将旧 vnode 节点清理，直接新增新 vnode 节点
          {
            checkDuplicateKeys(ch); // 检查新 vnode 的子节点的 key 是否重复
          }
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); } // 如果旧 vnode shiy
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue); // 直接新增子节点
        } else if (isDef(oldCh)) { // 如果旧 vnode 存在子节点，新 vnode 不存在子节点
          // 在这里，新vnode 应该表示为一个空节点
          removeVnodes(oldCh, 0, oldCh.length - 1); // 直接删除旧vnode 的子节点
        } else if (isDef(oldVnode.text)) { // 如果旧 vnode 是一个文本节点
          // 直接删除文本节点
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) { // 如果新 vnode是文本节点并且跟旧 vnode 的文本不一致(此时旧 vnode 可能不是文本节点，这种情况下也只需要直接设置新 vnode 的文本节点即可，旧节点 DOM 就会被剔除 DOM 树)
        nodeOps.setTextContent(elm, vnode.text); // 设置文本节点的文本
      }
      
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    // 执行子组件集合的 insert vnode 钩子 或者 将子组件收集的子子组件 pendingInsert 钩子挂在 vnode.parent.data 对象上，这样在其他地方会同意收集在最顶部的子组件集合中
    function invokeInsertHook(
      vnode, // vnode
      queue, // 子组件队列
      initial // 可能表示的是子组件的渲染
    ) {
      // delay insert hooks for component root nodes, invoke them after the 延迟组件根节点的插入钩子，然后调用它们
      // element is really inserted 元素被真正插入
      if (isTrue(initial) && isDef(vnode.parent)) { // 一般表示为子组件的渲染，因为此时还没有挂载 dom
        // 在这里，因为组件还没有挂载到 dom 树上，所以需要将调用 mounted 钩子的函数引用到 vnode 中
        vnode.parent.data.pendingInsert = queue;
      } else { // 其他情况，直接调用钩子
        for (var i = 0; i < queue.length; ++i) { // 遍历集合
          queue[i].data.hook.insert(queue[i]); // 执行 insert 钩子
        }
      }
    }

    var hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes. 注意:这是一个仅在浏览器上使用的函数，因此我们可以假设elm是DOM节点
    function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      // assert node match
      {
        if (!assertNodeMatch(elm, vnode, inVPre)) {
          return false
        }
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                /* istanbul ignore if */
                if (typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('server innerHTML: ', i);
                  console.warn('client innerHTML: ', elm.innerHTML);
                }
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                /* istanbul ignore if */
                if (typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                }
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    function assertNodeMatch(node, vnode, inVPre) {
      if (isDef(vnode.tag)) {
        return vnode.tag.indexOf('vue-component') === 0 || (
          !isUnknownElement$$1(vnode, inVPre) &&
          vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
        )
      } else {
        return node.nodeType === (vnode.isComment ? 8 : 3)
      }
    }

    // 这里是最终的通过 vnode 生成 dom 的操作
    return function patch(
      oldVnode, // 旧的 vnode, 如果是 DOM，表示是初始渲染，不需要 diff 阶段
      vnode, // 新的 vnode
      hydrating, // 应该是表示 SSR 渲染标识
      removeOnly // 是否要全部删除标志
    ) {
      if (isUndef(vnode)) { // 如果新的 vnode 不存在，此时表示销毁阶段
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); } // 此时如果旧的 vnode 存在，说明需要先销毁老节点，需要先处理好旧的 vnode
        return
      }

      // 在这里表示暂时不挂载组件，只是生成 dom -- 可能是渲染子组件 
      var isInitialPatch = false;
      var insertedVnodeQueue = []; // 子组件 vnode 队列，用于最后统一做一些渲染的处理

      if (isUndef(oldVnode)) { // oldVnode 是否是 undefined 或 null -- 可能作为组件，此时 oldVnode 为 undefined
        // empty mount (likely as component), create new root element 空挂载(可能作为组件)，创建新的根元素
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType); // oldVnode.nodeType：元素类型，如果有这个属性表示是一个 DOM 元素
        if (!isRealElement && sameVnode(oldVnode, vnode)) { // 表示是 diff 阶段
          // patch existing root node 修补现有根节点
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
        } else { // 表示是初始渲染或者新旧 vnode 不一致(此时需要删除 oldvnode, 渲染 vnode)
          if (isRealElement) { // oldVnode 是一个 DOM 元素，表示初次渲染
            // mounting to a real element 安装到一个真正的元素上
            // check if this is server-rendered content and if we can perform 检查这是否是服务器渲染的内容，是否可以执行
            // a successful hydration. 一个成功的水合作用
            // 表示这个 SSR 渲染
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) { // 元素 DOM && oldVnode 具有 SSR_ATTR(data-server-rendered) 属性
              oldVnode.removeAttribute(SSR_ATTR); // 删除 SSR_ATTR 属性
              hydrating = true; // hydrating 标识置为 true
            }
            if (isTrue(hydrating)) { // hydrating 是否为 true
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              } else {
                warn(
                  'The client-side rendered virtual DOM tree is not matching ' +
                  'server-rendered content. This is likely caused by incorrect ' +
                  'HTML markup, for example nesting block-level elements inside ' +
                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                  'full client-side render.'
                );
              }
            }
            // either not server-rendered, or hydration failed. 要么不是服务器渲染，要么是水合作用失败
            // create an empty node and replace it 创建一个空节点并替换它
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element 替换现有的元素
          var oldElm = oldVnode.elm; // 获取 oldVnode 的元素
          var parentElm = nodeOps.parentNode(oldElm); // 获取 oldVnode 元素的父元素 - 用于替换元素

          // create new node 创建新节点
          createElm(
            vnode, // vnode 
            insertedVnodeQueue, // 队列 - 用于收集渲染 vnode 的子组件，收集之后统一做一些操作
            // extremely rare edge case: do not insert if old element is in a 极其罕见的边界情况:如果旧元素在a中，则不要插入
            // leaving transition. Only happens when combining transition + 离开过渡。只有结合过渡+时才会发生
            // keep-alive + HOCs. (#4590) keep-alive + HOCs
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm) // 查找 oldElm 的一下节点 - 用于替换节点
          );

          // update parent placeholder node element, recursively 递归地更新父占位符节点元素
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node 摧毁旧的节点
          if (isDef(parentElm)) { // 如果父节点存在，则从父节点中删除
            removeVnodes([oldVnode], 0, 0); // 删除节点
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      // 如果 isInitialPatch 是 true，此时表示暂不挂载，就需要将子组件的 insert 钩子保存在 vnode 中，到时在引用
      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  // 指令模块
  var directives = {
    create: updateDirectives, // 初始化
    update: updateDirectives, // 更新
    destroy: function unbindDirectives(vnode) { // 销毁
      updateDirectives(vnode, emptyNode);
    }
  };

  // 初始化 || 更新 || 销毁 指令
  function updateDirectives(oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) { // 只要新旧 vnode 中存在指令  
      _update(oldVnode, vnode); // 就执行指令的操作
    }
  }

  /**
   * 指令的处理
   * bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
   * inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
   * update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
   * componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用
   * unbind：只调用一次，指令与元素解绑时调用
   */
  function _update(oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode; // 如果旧的 vnode 是一个空 Node，则为初始阶段
    var isDestroy = vnode === emptyNode; // 如果新的 vnode 是一个空 Node，则为销毁阶段
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context); // 规范化旧指令
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context); // 规范化新指令

    var dirsWithInsert = []; // inserted 钩子集合
    var dirsWithPostpatch = []; // componentUpdated 钩子集合

    var key, oldDir, dir;
    for (key in newDirs) { // 遍历新的指令
      oldDir = oldDirs[key]; // 对应旧指令
      dir = newDirs[key]; // 对应新指令
      if (!oldDir) { // 如果不存在旧指令 - 此时表示一个新指令刚绑定
        // new directive, bind 新指令,绑定
        callHook$1(dir, 'bind', vnode, oldVnode); // 执行 bind 绑定钩子
        if (dir.def && dir.def.inserted) {  // 是否存在 inserted 插入钩子
          dirsWithInsert.push(dir); // 此时暂时不执行，先推入集合中
        }
      } else { // 此时表示现有的指令，需要执行更新操作
        // existing directive, update 现有的指令,更新
        dir.oldValue = oldDir.value; // value：指令的绑定值
        dir.oldArg = oldDir.arg; // arg：传给指令的参数
        callHook$1(dir, 'update', vnode, oldVnode); // 执行 update 钩子
        if (dir.def && dir.def.componentUpdated) { // 是否存在 componentUpdated 钩子
          dirsWithPostpatch.push(dir); // 此时暂时不执行，推入集合中
        }
      }
    }

    if (dirsWithInsert.length) { // 是否存在 insert 钩子集合
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) { // 如果是初始阶段
        mergeVNodeHook(vnode, 'insert', callInsert); // 则将其推入到组件的钩子中，会在特定时机执行
      } else {
        callInsert(); // 如果不是在初始阶段，那么就立即执行
      }
    }

    if (dirsWithPostpatch.length) { // 是否存在 componentUpdated 钩子
      mergeVNodeHook(vnode, 'postpatch', function () { // 直接推入组件钩子中
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) { // 如果不是在初始阶段
      for (key in oldDirs) { // 执行需要销毁的钩子
        if (!newDirs[key]) {
          // no longer present, unbind 不再存在，解除束缚
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy); // 执行指令 unbind 钩子
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  // 规范化指令参数
  function normalizeDirectives$1(
    dirs, // 指令对象
    vm
  ) {
    var res = Object.create(null); // 空对象
    if (!dirs) { // 不存在指令时
      // $flow-disable-line
      return res // 返回空对象
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) { // 遍历指令集合
      dir = dirs[i];
      if (!dir.modifiers) { // modifiers：一个包含修饰符的对象 - 如果不存在修饰符对象的话
        // $flow-disable-line
        dir.modifiers = emptyModifiers; // 置为一个空对象
      }
      res[getRawDirName(dir)] = dir; // 重新命名 res
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true); // 查找到注册的指令
    }
    // $flow-disable-line
    return res
  }

  // 获取指令名称
  function getRawDirName(dir) {
    // 返回 rawName || 通过 name 和 modifiers 组合而成
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  // 执行指令对应的钩子
  function callHook$1(
    dir, // 指令对象
    hook,  // 对应钩子
    vnode,  // 新的 vnode
    oldVnode, // 旧的 vnode
    isDestroy
  ) {
    var fn = dir.def && dir.def[hook]; // 提取对应钩子
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy); // 执行钩子
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook")); // 出错时处理错误
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */
  // 初始化或更新 vnode 中的 attrs 属性
  function updateAttrs(oldVnode, vnode) {
    var opts = vnode.componentOptions; // 提取出 组件vnode 的组件配置项
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) { // 通过设置 inheritAttrs 为 false，此时可取消将 attrs 绑定到组件的根元素上
      return // 如果是组件 vnode，并且这个组件设置了不将 attrs 绑定到根组件上
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) { // 如果新旧 vnode 中都不存在 attrs 属性时 
      return // 此时直接返回
    }
    var key, cur, old;
    var elm = vnode.elm; // DOM 元素
    var oldAttrs = oldVnode.data.attrs || {}; // oldVnode 的 attrs 数据
    var attrs = vnode.data.attrs || {}; // vnode 的 attrs 数据
    // clone observed objects, as the user probably wants to mutate it 克隆观察到的对象，因为用户可能想要改变它
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) { // 遍历新的 attrs 属性
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) { // 如果新旧值不相同，则修改 DOM 的 attrs
        setAttr(elm, key, cur); // 设置属性
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio] 在IE9中，设置type可以重置输入值[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max IE/Edge在设置最大值之前将进度值降低到1
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) { // 遍历旧的 attrs
      if (isUndef(attrs[key])) { // 如果不存在新的 attrs 中，此时需要删除属性
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  // 为指定 DOM 添加属性
  function setAttr(
    el, // DOM
    key, // 添加属性key
    value // 属性值
  ) {
    if (el.tagName.indexOf('-') > -1) { // 如果 el.tagName 带有 - 的话
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) { // 如果 key 是需要设置为 boolean 的属性
      // set attribute for blank value 设置属性为空值
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) { // 如果 value 为 null 或 false
        el.removeAttribute(key); // 则需要删除属性
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>, 从技术上讲，allowfullscreen是一个布尔属性
        // but Flash expects a value of "true" when used on <embed> tag 但是Flash要求在标签上使用的值为“true”
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value); // 通过 setAttribute 方法设置属性
      }
    } else if (isEnumeratedAttr(key)) { // 如果 key 是 contenteditable,draggable,spellcheck 属性
      el.setAttribute(key, convertEnumeratedValue(key, value)); // 通过 setAttribute 方法设置
    } else if (isXlink(key)) { // 如果是 xlink: 类型
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else { // 其他情况使用 baseSetAttr 设置属性
      baseSetAttr(el, key, value);
    }
  }

  // 基础设置属性的方法
  function baseSetAttr(el, key, value) {
    if (isFalsyAttrValue(value)) { // 如果是 null || undefined || false
      el.removeAttribute(key); // 删除属性
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && value !== '' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  // attrs 模块方法
  var attrs = {
    create: updateAttrs, // 初始化方法
    update: updateAttrs // 更新方法
  };

  /*  */

  // 初始化后更新 DOM 的 class 属性
  function updateClass(oldVnode, vnode) {
    var el = vnode.elm; // 提取 DOM
    var data = vnode.data;
    var oldData = oldVnode.data;
    if ( // 简单来讲，就是没有新的 class 添加，也没有旧的 class 需要删除
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode); // 整合 class 出来 - 暂时策略不是很清楚

    // handle transition classes 处理过渡类
    var transitionClass = el._transitionClasses; // 过渡的类
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass)); // stringifyClass: 将 value 序列化 -- 最终就是 'xx xx xx' 形式
    }

    // set the class 设置类
    if (cls !== el._prevClass) { // 如果更新前后的类不相同
      el.setAttribute('class', cls); // 此时直接设置 class 属性
      el._prevClass = cls; // 这里保存了解析后的 class，用于后续更新使用
    }
  }

  // class 模块钩子
  var klass = {
    create: updateClass, // 初始化
    update: updateClass // 更新
  };

  /*  */

  var validDivisionCharRE = /[\w).+\-_$\]]/;

  function parseFilters(exp) {
    var inSingle = false;
    var inDouble = false;
    var inTemplateString = false;
    var inRegex = false;
    var curly = 0;
    var square = 0;
    var paren = 0;
    var lastFilterIndex = 0;
    var c, prev, i, expression, filters;

    for (i = 0; i < exp.length; i++) {
      prev = c;
      c = exp.charCodeAt(i);
      if (inSingle) {
        if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
      } else if (inDouble) {
        if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
      } else if (inTemplateString) {
        if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
      } else if (inRegex) {
        if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
      } else if (
        c === 0x7C && // pipe
        exp.charCodeAt(i + 1) !== 0x7C &&
        exp.charCodeAt(i - 1) !== 0x7C &&
        !curly && !square && !paren
      ) {
        if (expression === undefined) {
          // first filter, end of expression
          lastFilterIndex = i + 1;
          expression = exp.slice(0, i).trim();
        } else {
          pushFilter();
        }
      } else {
        switch (c) {
          case 0x22: inDouble = true; break         // "
          case 0x27: inSingle = true; break         // '
          case 0x60: inTemplateString = true; break // `
          case 0x28: paren++; break                 // (
          case 0x29: paren--; break                 // )
          case 0x5B: square++; break                // [
          case 0x5D: square--; break                // ]
          case 0x7B: curly++; break                 // {
          case 0x7D: curly--; break                 // }
        }
        if (c === 0x2f) { // /
          var j = i - 1;
          var p = (void 0);
          // find first non-whitespace prev char
          for (; j >= 0; j--) {
            p = exp.charAt(j);
            if (p !== ' ') { break }
          }
          if (!p || !validDivisionCharRE.test(p)) {
            inRegex = true;
          }
        }
      }
    }

    if (expression === undefined) {
      expression = exp.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
      pushFilter();
    }

    function pushFilter() {
      (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
      lastFilterIndex = i + 1;
    }

    if (filters) {
      for (i = 0; i < filters.length; i++) {
        expression = wrapFilter(expression, filters[i]);
      }
    }

    return expression
  }

  function wrapFilter(exp, filter) {
    var i = filter.indexOf('(');
    if (i < 0) {
      // _f: resolveFilter
      return ("_f(\"" + filter + "\")(" + exp + ")")
    } else {
      var name = filter.slice(0, i);
      var args = filter.slice(i + 1);
      return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
    }
  }

  /*  */



  /* eslint-disable no-unused-vars */
  // 基础警告函数
  function baseWarn(msg, range) {
    console.error(("[Vue compiler]: " + msg)); // 直接打印错误信息
  }
  /* eslint-enable no-unused-vars */

  function pluckModuleFunction(
    modules,
    key
  ) {
    return modules
      ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
      : []
  }

  function addProp(el, name, value, range, dynamic) {
    (el.props || (el.props = [])).push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
    el.plain = false;
  }

  function addAttr(el, name, value, range, dynamic) {
    var attrs = dynamic
      ? (el.dynamicAttrs || (el.dynamicAttrs = []))
      : (el.attrs || (el.attrs = []));
    attrs.push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
    el.plain = false;
  }

  // add a raw attr (use this in preTransforms)
  function addRawAttr(el, name, value, range) {
    el.attrsMap[name] = value;
    el.attrsList.push(rangeSetItem({ name: name, value: value }, range));
  }

  function addDirective(
    el,
    name,
    rawName,
    value,
    arg,
    isDynamicArg,
    modifiers,
    range
  ) {
    (el.directives || (el.directives = [])).push(rangeSetItem({
      name: name,
      rawName: rawName,
      value: value,
      arg: arg,
      isDynamicArg: isDynamicArg,
      modifiers: modifiers
    }, range));
    el.plain = false;
  }

  function prependModifierMarker(symbol, name, dynamic) {
    return dynamic
      ? ("_p(" + name + ",\"" + symbol + "\")")
      : symbol + name // mark the event as captured
  }

  function addHandler(
    el,
    name,
    value,
    modifiers,
    important,
    warn,
    range,
    dynamic
  ) {
    modifiers = modifiers || emptyObject;
    // warn prevent and passive modifier
    /* istanbul ignore if */
    if (
      warn &&
      modifiers.prevent && modifiers.passive
    ) {
      warn(
        'passive and prevent can\'t be used together. ' +
        'Passive handler can\'t prevent default event.',
        range
      );
    }

    // normalize click.right and click.middle since they don't actually fire
    // this is technically browser-specific, but at least for now browsers are
    // the only target envs that have right/middle clicks.
    if (modifiers.right) {
      if (dynamic) {
        name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
      } else if (name === 'click') {
        name = 'contextmenu';
        delete modifiers.right;
      }
    } else if (modifiers.middle) {
      if (dynamic) {
        name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
      } else if (name === 'click') {
        name = 'mouseup';
      }
    }

    // check capture modifier
    if (modifiers.capture) {
      delete modifiers.capture;
      name = prependModifierMarker('!', name, dynamic);
    }
    if (modifiers.once) {
      delete modifiers.once;
      name = prependModifierMarker('~', name, dynamic);
    }
    /* istanbul ignore if */
    if (modifiers.passive) {
      delete modifiers.passive;
      name = prependModifierMarker('&', name, dynamic);
    }

    var events;
    if (modifiers.native) {
      delete modifiers.native;
      events = el.nativeEvents || (el.nativeEvents = {});
    } else {
      events = el.events || (el.events = {});
    }

    var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);
    if (modifiers !== emptyObject) {
      newHandler.modifiers = modifiers;
    }

    var handlers = events[name];
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
    } else {
      events[name] = newHandler;
    }

    el.plain = false;
  }

  function getRawBindingAttr(
    el,
    name
  ) {
    return el.rawAttrsMap[':' + name] ||
      el.rawAttrsMap['v-bind:' + name] ||
      el.rawAttrsMap[name]
  }

  function getBindingAttr(
    el,
    name,
    getStatic
  ) {
    var dynamicValue =
      getAndRemoveAttr(el, ':' + name) ||
      getAndRemoveAttr(el, 'v-bind:' + name);
    if (dynamicValue != null) {
      return parseFilters(dynamicValue)
    } else if (getStatic !== false) {
      var staticValue = getAndRemoveAttr(el, name);
      if (staticValue != null) {
        return JSON.stringify(staticValue)
      }
    }
  }

  // note: this only removes the attr from the Array (attrsList) so that it
  // doesn't get processed by processAttrs.
  // By default it does NOT remove it from the map (attrsMap) because the map is
  // needed during codegen.
  function getAndRemoveAttr(
    el,
    name,
    removeFromMap
  ) {
    var val;
    if ((val = el.attrsMap[name]) != null) {
      var list = el.attrsList;
      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i].name === name) {
          list.splice(i, 1);
          break
        }
      }
    }
    if (removeFromMap) {
      delete el.attrsMap[name];
    }
    return val
  }

  function getAndRemoveAttrByRegex(
    el,
    name
  ) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      var attr = list[i];
      if (name.test(attr.name)) {
        list.splice(i, 1);
        return attr
      }
    }
  }

  function rangeSetItem(
    item,
    range
  ) {
    if (range) {
      if (range.start != null) {
        item.start = range.start;
      }
      if (range.end != null) {
        item.end = range.end;
      }
    }
    return item
  }

  /*  */

  /**
   * Cross-platform code generation for component v-model
   */
  function genComponentModel(
    el,
    value,
    modifiers
  ) {
    var ref = modifiers || {};
    var number = ref.number;
    var trim = ref.trim;

    var baseValueExpression = '$$v';
    var valueExpression = baseValueExpression;
    if (trim) {
      valueExpression =
        "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }
    var assignment = genAssignmentCode(value, valueExpression);

    el.model = {
      value: ("(" + value + ")"),
      expression: JSON.stringify(value),
      callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
    };
  }

  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */
  function genAssignmentCode(
    value,
    assignment
  ) {
    var res = parseModel(value);
    if (res.key === null) {
      return (value + "=" + assignment)
    } else {
      return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
    }
  }

  /**
   * Parse a v-model expression into a base path and a final key segment.
   * Handles both dot-path and possible square brackets.
   *
   * Possible cases:
   *
   * - test
   * - test[key]
   * - test[test1[key]]
   * - test["a"][key]
   * - xxx.test[a[a].test1[key]]
   * - test.xxx.a["asa"][test1[key]]
   *
   */

  var len, str, chr, index$1, expressionPos, expressionEndPos;



  function parseModel(val) {
    // Fix https://github.com/vuejs/vue/pull/7730
    // allow v-model="obj.val " (trailing whitespace)
    val = val.trim();
    len = val.length;

    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
      index$1 = val.lastIndexOf('.');
      if (index$1 > -1) {
        return {
          exp: val.slice(0, index$1),
          key: '"' + val.slice(index$1 + 1) + '"'
        }
      } else {
        return {
          exp: val,
          key: null
        }
      }
    }

    str = val;
    index$1 = expressionPos = expressionEndPos = 0;

    while (!eof()) {
      chr = next();
      /* istanbul ignore if */
      if (isStringStart(chr)) {
        parseString(chr);
      } else if (chr === 0x5B) {
        parseBracket(chr);
      }
    }

    return {
      exp: val.slice(0, expressionPos),
      key: val.slice(expressionPos + 1, expressionEndPos)
    }
  }

  function next() {
    return str.charCodeAt(++index$1)
  }

  function eof() {
    return index$1 >= len
  }

  function isStringStart(chr) {
    return chr === 0x22 || chr === 0x27
  }

  function parseBracket(chr) {
    var inBracket = 1;
    expressionPos = index$1;
    while (!eof()) {
      chr = next();
      if (isStringStart(chr)) {
        parseString(chr);
        continue
      }
      if (chr === 0x5B) { inBracket++; }
      if (chr === 0x5D) { inBracket--; }
      if (inBracket === 0) {
        expressionEndPos = index$1;
        break
      }
    }
  }

  function parseString(chr) {
    var stringQuote = chr;
    while (!eof()) {
      chr = next();
      if (chr === stringQuote) {
        break
      }
    }
  }

  /*  */

  var warn$1;

  // in some cases, the event used has to be determined at runtime 在某些情况下，所使用的事件必须在运行时确定
  // so we used some reserved tokens during compile. 因此，我们在编译期间使用了一些保留令牌
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  function model(
    el,
    dir,
    _warn
  ) {
    warn$1 = _warn;
    var value = dir.value;
    var modifiers = dir.modifiers;
    var tag = el.tag;
    var type = el.attrsMap.type;

    {
      // inputs with type="file" are read only and setting the input's
      // value will throw an error.
      if (tag === 'input' && type === 'file') {
        warn$1(
          "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
          "File inputs are read only. Use a v-on:change listener instead.",
          el.rawAttrsMap['v-model']
        );
      }
    }

    if (el.component) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else if (tag === 'select') {
      genSelect(el, value, modifiers);
    } else if (tag === 'input' && type === 'checkbox') {
      genCheckboxModel(el, value, modifiers);
    } else if (tag === 'input' && type === 'radio') {
      genRadioModel(el, value, modifiers);
    } else if (tag === 'input' || tag === 'textarea') {
      genDefaultModel(el, value, modifiers);
    } else if (!config.isReservedTag(tag)) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "v-model is not supported on this element type. " +
        'If you are working with contenteditable, it\'s recommended to ' +
        'wrap a library dedicated for that purpose inside a custom component.',
        el.rawAttrsMap['v-model']
      );
    }

    // ensure runtime directive metadata
    return true
  }

  function genCheckboxModel(
    el,
    value,
    modifiers
  ) {
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr(el, 'value') || 'null';
    var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
    var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
    addProp(el, 'checked',
      "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
    );
    addHandler(el, 'change',
      "var $$a=" + value + "," +
      '$$el=$event.target,' +
      "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
      'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
      '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
      "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
      "}else{" + (genAssignmentCode(value, '$$c')) + "}",
      null, true
    );
  }

  function genRadioModel(
    el,
    value,
    modifiers
  ) {
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr(el, 'value') || 'null';
    valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
    addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
    addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
  }

  function genSelect(
    el,
    value,
    modifiers
  ) {
    var number = modifiers && modifiers.number;
    var selectedVal = "Array.prototype.filter" +
      ".call($event.target.options,function(o){return o.selected})" +
      ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
      "return " + (number ? '_n(val)' : 'val') + "})";

    var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
    var code = "var $$selectedVal = " + selectedVal + ";";
    code = code + " " + (genAssignmentCode(value, assignment));
    addHandler(el, 'change', code, null, true);
  }

  function genDefaultModel(
    el,
    value,
    modifiers
  ) {
    var type = el.attrsMap.type;

    // warn if v-bind:value conflicts with v-model
    // except for inputs with v-bind:type
    {
      var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
      var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
      if (value$1 && !typeBinding) {
        var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
        warn$1(
          binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
          'because the latter already expands to a value binding internally',
          el.rawAttrsMap[binding]
        );
      }
    }

    var ref = modifiers || {};
    var lazy = ref.lazy;
    var number = ref.number;
    var trim = ref.trim;
    var needCompositionGuard = !lazy && type !== 'range';
    var event = lazy
      ? 'change'
      : type === 'range'
        ? RANGE_TOKEN
        : 'input';

    var valueExpression = '$event.target.value';
    if (trim) {
      valueExpression = "$event.target.value.trim()";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }

    var code = genAssignmentCode(value, valueExpression);
    if (needCompositionGuard) {
      code = "if($event.target.composing)return;" + code;
    }

    addProp(el, 'value', ("(" + value + ")"));
    addHandler(el, event, code, null, true);
    if (trim || number) {
      addHandler(el, 'blur', '$forceUpdate()');
    }
  }

  /*  */

  // normalize v-model event tokens that can only be determined at runtime. 规范化只能在运行时确定的v-model事件令牌
  // it's important to place the event as the first in the array because 将事件放置在数组的第一个位置非常重要，因为
  // the whole point is ensuring the v-model callback gets called before 关键是要确保v-model回调在之前被调用
  // user-attached handlers. user-attached 处理程序
  function normalizeEvents(on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler$1(event, handler, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler() {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

  function add$1(
    name,
    handler,
    capture,
    passive
  ) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
      var attachedTimestamp = currentFlushTimestamp;
      var original = handler;
      handler = original._wrapper = function (e) {
        if (
          // no bubbling, should always fire.
          // this is just a safety net in case event.timeStamp is unreliable in
          // certain weird environments...
          e.target === e.currentTarget ||
          // event is fired after handler attachment
          e.timeStamp >= attachedTimestamp ||
          // bail for environments that have buggy event.timeStamp implementations
          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
          // #9681 QtWebEngine event.timeStamp is negative value
          e.timeStamp <= 0 ||
          // #9448 bail if event is fired in another document in a multi-page
          // electron/nw.js app, since event.timeStamp will be using a different
          // starting reference
          e.target.ownerDocument !== document
        ) {
          return original.apply(this, arguments)
        }
      };
    }
    target$1.addEventListener(
      name,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2(
    name,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      name,
      handler._wrapper || handler,
      capture
    );
  }

  // 更新 DOM 事件
  function updateDOMListeners(oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) { // 如果新旧 vnode 上都不存在 on 事件
      return // 则不做处理
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm; // DOM 元素
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context); // 通过 updateListeners 来更新事件
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  var svgContainer;

  // 初始化或更新 DOMProps
  function updateDOMProps(oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (!(key in props)) {
        elm[key] = '';
      }
    }

    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) { vnode.children.length = 0; }
        if (cur === oldProps[key]) { continue }
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value' && elm.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
        // IE doesn't support innerHTML for SVG elements
        svgContainer = svgContainer || document.createElement('div');
        svgContainer.innerHTML = "<svg>" + cur + "</svg>";
        var svg = svgContainer.firstChild;
        while (elm.firstChild) {
          elm.removeChild(elm.firstChild);
        }
        while (svg.firstChild) {
          elm.appendChild(svg.firstChild);
        }
      } else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecesarry `checked` update.
        cur !== oldProps[key]
      ) {
        // some property updates can throw
        // e.g. `value` on <progress> w/ non-finite value
        try {
          elm[key] = cur;
        } catch (e) { }
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue(elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty(elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) { }
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers(elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData(data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding(bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle(vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle(oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  var whitespaceRE = /\s+/;

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition(def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame(fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass(el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass(el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds(
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo(el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout(delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs(s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /*  */

  function enter(vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    if (explicitEnterDuration != null) {
      checkDuration(explicitEnterDuration, 'enter', vnode);
    }

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave(vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    if (isDef(explicitLeaveDuration)) {
      checkDuration(explicitLeaveDuration, 'leave', vnode);
    }

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave() {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show && el.parentNode) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  // only used in dev mode
  function checkDuration(val, name, vnode) {
    if (typeof val !== 'number') {
      warn(
        "<transition> explicit " + name + " duration is not a valid number - " +
        "got " + (JSON.stringify(val)) + ".",
        vnode.context
      );
    } else if (isNaN(val)) {
      warn(
        "<transition> explicit " + name + " duration is NaN - " +
        'the duration expression might be incorrect.',
        vnode.context
      );
    }
  }

  function isValidDuration(val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength(fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter(_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1(vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  // 生成 patch(比较新旧 vnode，生成 dom) 工具方法
  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var directive = {
    inserted: function inserted(el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated(el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected(el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding, vm);
      }, 0);
    }
  }

  function actuallySetSelected(el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      warn(
        "<select multiple v-model=\"" + (binding.expression) + "\"> " +
        "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
        vm
      );
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption(value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue(option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart(e) {
    e.target.composing = true;
  }

  function onCompositionEnd(e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode(vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind(el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update(el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind(
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show: show
  };

  /*  */

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild(vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData(comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder(h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition(vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild(child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

  var isVShowDirective = function (d) { return d.name === 'show'; };

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render(h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(isNotTextNode);
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      // warn multiple elements
      if (children.length > 1) {
        warn(
          '<transition> can only be used on a single element. Use ' +
          '<transition-group> for lists.',
          this.$parent
        );
      }

      var mode = this.mode;

      // warn invalid mode
      if (mode && mode !== 'in-out' && mode !== 'out-in'
      ) {
        warn(
          'invalid <transition> mode: ' + mode,
          this.$parent
        );
      }

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    beforeMount: function beforeMount() {
      var this$1 = this;

      var update = this._update;
      this._update = function (vnode, hydrating) {
        var restoreActiveInstance = setActiveInstance(this$1);
        // force removing pass
        this$1.__patch__(
          this$1._vnode,
          this$1.kept,
          false, // hydrating
          true // removeOnly (!important, avoids unnecessary moves)
        );
        this$1._vnode = this$1.kept;
        restoreActiveInstance();
        update.call(this$1, vnode, hydrating);
      };
    },

    render: function render(h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
              ; (c.data || (c.data = {})).transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
            warn(("<transition-group> children must be keyed: <" + name + ">"));
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    updated: function updated() {
      var children = this.prevChildren;
      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
            if (e && e.target !== el) {
              return
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove(el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs(c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition(c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation(c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils 安装特定于平台的utils
  // 区分平台的
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag; // 判断指定标签是否为 html 标签 或者 svg 标签 - 在 web 平台上，就是区分 html 和 svg 标签，但是在 weex 平台上就是区分另外的
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement; // 检查指定标签是否为未知标签(也就是不合法标签)

  // install platform runtime directives & components 安装平台运行时指令和组件
  extend(Vue.options.directives, platformDirectives); // 添加全局指令， show 和 model
  extend(Vue.options.components, platformComponents); // 添加全局组件，transition 和 TransitionGroup

  // install platform patch function 安装平台补丁功能
  Vue.prototype.__patch__ = inBrowser ? patch : noop; // 比较新旧 vnode，完成 vnode 的渲染成 dom

  // public mount method 公共方法 -- 通用 $mount
  // 平台共用方法 -- 将 render 函数渲染成 vnode，并将其挂载到 el 上
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined; // 找到挂载点
    return mountComponent(this, el, hydrating) // 挂载方法
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        } else {
          console[console.info ? 'info' : 'log'](
            'Download the Vue Devtools extension for a better development experience:\n' +
            'https://github.com/vuejs/vue-devtools'
          );
        }
      }
      if (config.productionTip !== false &&
        typeof console !== 'undefined'
      ) {
        console[console.info ? 'info' : 'log'](
          "You are running Vue in development mode.\n" +
          "Make sure to turn on production mode when deploying for production.\n" +
          "See more tips at https://vuejs.org/guide/deployment.html"
        );
      }
    }, 0);
  }

  /*  */

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

  var buildRegex = cached(function (delimiters) {
    var open = delimiters[0].replace(regexEscapeRE, '\\$&');
    var close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
  });



  function parseText(
    text,
    delimiters
  ) {
    var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
    if (!tagRE.test(text)) {
      return
    }
    var tokens = [];
    var rawTokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match, index, tokenValue;
    while ((match = tagRE.exec(text))) {
      index = match.index;
      // push text token
      if (index > lastIndex) {
        rawTokens.push(tokenValue = text.slice(lastIndex, index));
        tokens.push(JSON.stringify(tokenValue));
      }
      // tag token
      var exp = parseFilters(match[1].trim());
      tokens.push(("_s(" + exp + ")"));
      rawTokens.push({ '@binding': exp });
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      rawTokens.push(tokenValue = text.slice(lastIndex));
      tokens.push(JSON.stringify(tokenValue));
    }
    return {
      expression: tokens.join('+'),
      tokens: rawTokens
    }
  }

  /*  */

  function transformNode(el, options) {
    var warn = options.warn || baseWarn;
    var staticClass = getAndRemoveAttr(el, 'class');
    if (staticClass) {
      var res = parseText(staticClass, options.delimiters);
      if (res) {
        warn(
          "class=\"" + staticClass + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div class="{{ val }}">, use <div :class="val">.',
          el.rawAttrsMap['class']
        );
      }
    }
    if (staticClass) {
      el.staticClass = JSON.stringify(staticClass);
    }
    var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
    if (classBinding) {
      el.classBinding = classBinding;
    }
  }

  function genData(el) {
    var data = '';
    if (el.staticClass) {
      data += "staticClass:" + (el.staticClass) + ",";
    }
    if (el.classBinding) {
      data += "class:" + (el.classBinding) + ",";
    }
    return data
  }

  var klass$1 = {
    staticKeys: ['staticClass'],
    transformNode: transformNode,
    genData: genData
  };

  /*  */

  function transformNode$1(el, options) {
    var warn = options.warn || baseWarn;
    var staticStyle = getAndRemoveAttr(el, 'style');
    if (staticStyle) {
      /* istanbul ignore if */
      {
        var res = parseText(staticStyle, options.delimiters);
        if (res) {
          warn(
            "style=\"" + staticStyle + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div style="{{ val }}">, use <div :style="val">.',
            el.rawAttrsMap['style']
          );
        }
      }
      el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
    }

    var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
    if (styleBinding) {
      el.styleBinding = styleBinding;
    }
  }

  function genData$1(el) {
    var data = '';
    if (el.staticStyle) {
      data += "staticStyle:" + (el.staticStyle) + ",";
    }
    if (el.styleBinding) {
      data += "style:(" + (el.styleBinding) + "),";
    }
    return data
  }

  var style$1 = {
    staticKeys: ['staticStyle'],
    transformNode: transformNode$1,
    genData: genData$1
  };

  /*  */

  var decoder;

  var he = {
    decode: function decode(html) {
      decoder = decoder || document.createElement('div');
      decoder.innerHTML = html;
      return decoder.textContent
    }
  };

  /*  */

  var isUnaryTag = makeMap(
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr'
  );

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var canBeLeftOpenTag = makeMap(
    'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
  );

  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  var isNonPhrasingTag = makeMap(
    'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
    'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
    'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
    'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
    'title,tr,track'
  );

  /**
   * Not type-checking this file because it's mostly vendor code.
   */

  // Regular Expressions for parsing tags and attributes
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
  var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
  var startTagOpen = new RegExp(("^<" + qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
  var doctype = /^<!DOCTYPE [^>]+>/i;
  // #7298: escape - to avoid being passed as HTML comment when inlined in page
  var comment = /^<!\--/;
  var conditionalComment = /^<!\[/;

  // Special Elements (can contain anything)
  var isPlainTextElement = makeMap('script,style,textarea', true);
  var reCache = {};

  var decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t',
    '&#39;': "'"
  };
  var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
  var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

  // #5992
  var isIgnoreNewlineTag = makeMap('pre,textarea', true);
  var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

  function decodeAttr(value, shouldDecodeNewlines) {
    var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
    return value.replace(re, function (match) { return decodingMap[match]; })
  }

  function parseHTML(html, options) {
    var stack = [];
    var expectHTML = options.expectHTML;
    var isUnaryTag$$1 = options.isUnaryTag || no;
    var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
    var index = 0;
    var last, lastTag;
    while (html) {
      last = html;
      // Make sure we're not in a plaintext content element like script/style
      if (!lastTag || !isPlainTextElement(lastTag)) {
        var textEnd = html.indexOf('<');
        if (textEnd === 0) {
          // Comment:
          if (comment.test(html)) {
            var commentEnd = html.indexOf('-->');

            if (commentEnd >= 0) {
              if (options.shouldKeepComment) {
                options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
              }
              advance(commentEnd + 3);
              continue
            }
          }

          // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
          if (conditionalComment.test(html)) {
            var conditionalEnd = html.indexOf(']>');

            if (conditionalEnd >= 0) {
              advance(conditionalEnd + 2);
              continue
            }
          }

          // Doctype:
          var doctypeMatch = html.match(doctype);
          if (doctypeMatch) {
            advance(doctypeMatch[0].length);
            continue
          }

          // End tag:
          var endTagMatch = html.match(endTag);
          if (endTagMatch) {
            var curIndex = index;
            advance(endTagMatch[0].length);
            parseEndTag(endTagMatch[1], curIndex, index);
            continue
          }

          // Start tag:
          var startTagMatch = parseStartTag();
          if (startTagMatch) {
            handleStartTag(startTagMatch);
            if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
              advance(1);
            }
            continue
          }
        }

        var text = (void 0), rest = (void 0), next = (void 0);
        if (textEnd >= 0) {
          rest = html.slice(textEnd);
          while (
            !endTag.test(rest) &&
            !startTagOpen.test(rest) &&
            !comment.test(rest) &&
            !conditionalComment.test(rest)
          ) {
            // < in plain text, be forgiving and treat it as text
            next = rest.indexOf('<', 1);
            if (next < 0) { break }
            textEnd += next;
            rest = html.slice(textEnd);
          }
          text = html.substring(0, textEnd);
        }

        if (textEnd < 0) {
          text = html;
        }

        if (text) {
          advance(text.length);
        }

        if (options.chars && text) {
          options.chars(text, index - text.length, index);
        }
      } else {
        var endTagLength = 0;
        var stackedTag = lastTag.toLowerCase();
        var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
        var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
          endTagLength = endTag.length;
          if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
            text = text
              .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
              .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
          }
          if (shouldIgnoreFirstNewline(stackedTag, text)) {
            text = text.slice(1);
          }
          if (options.chars) {
            options.chars(text);
          }
          return ''
        });
        index += html.length - rest$1.length;
        html = rest$1;
        parseEndTag(stackedTag, index - endTagLength, index);
      }

      if (html === last) {
        options.chars && options.chars(html);
        if (!stack.length && options.warn) {
          options.warn(("Mal-formatted tag at end of template: \"" + html + "\""), { start: index + html.length });
        }
        break
      }
    }

    // Clean up any remaining tags
    parseEndTag();

    function advance(n) {
      index += n;
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: [],
          start: index
        };
        advance(start[0].length);
        var end, attr;
        while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
          attr.start = index;
          advance(attr[0].length);
          attr.end = index;
          match.attrs.push(attr);
        }
        if (end) {
          match.unarySlash = end[1];
          advance(end[0].length);
          match.end = index;
          return match
        }
      }
    }

    function handleStartTag(match) {
      var tagName = match.tagName;
      var unarySlash = match.unarySlash;

      if (expectHTML) {
        if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
          parseEndTag(lastTag);
        }
        if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
          parseEndTag(tagName);
        }
      }

      var unary = isUnaryTag$$1(tagName) || !!unarySlash;

      var l = match.attrs.length;
      var attrs = new Array(l);
      for (var i = 0; i < l; i++) {
        var args = match.attrs[i];
        var value = args[3] || args[4] || args[5] || '';
        var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
          ? options.shouldDecodeNewlinesForHref
          : options.shouldDecodeNewlines;
        attrs[i] = {
          name: args[1],
          value: decodeAttr(value, shouldDecodeNewlines)
        };
        if (options.outputSourceRange) {
          attrs[i].start = args.start + args[0].match(/^\s*/).length;
          attrs[i].end = args.end;
        }
      }

      if (!unary) {
        stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
        lastTag = tagName;
      }

      if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
      }
    }

    function parseEndTag(tagName, start, end) {
      var pos, lowerCasedTagName;
      if (start == null) { start = index; }
      if (end == null) { end = index; }

      // Find the closest opened tag of the same type
      if (tagName) {
        lowerCasedTagName = tagName.toLowerCase();
        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].lowerCasedTag === lowerCasedTagName) {
            break
          }
        }
      } else {
        // If no tag name is provided, clean shop
        pos = 0;
      }

      if (pos >= 0) {
        // Close all the open elements, up the stack
        for (var i = stack.length - 1; i >= pos; i--) {
          if (i > pos || !tagName &&
            options.warn
          ) {
            options.warn(
              ("tag <" + (stack[i].tag) + "> has no matching end tag."),
              { start: stack[i].start, end: stack[i].end }
            );
          }
          if (options.end) {
            options.end(stack[i].tag, start, end);
          }
        }

        // Remove the open elements from the stack
        stack.length = pos;
        lastTag = pos && stack[pos - 1].tag;
      } else if (lowerCasedTagName === 'br') {
        if (options.start) {
          options.start(tagName, [], true, start, end);
        }
      } else if (lowerCasedTagName === 'p') {
        if (options.start) {
          options.start(tagName, [], false, start, end);
        }
        if (options.end) {
          options.end(tagName, start, end);
        }
      }
    }
  }

  /*  */

  var onRE = /^@|^v-on:/;
  var dirRE = /^v-|^@|^:|^#/;
  var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  var stripParensRE = /^\(|\)$/g;
  var dynamicArgRE = /^\[.*\]$/;

  var argRE = /:(.*)$/;
  var bindRE = /^:|^\.|^v-bind:/;
  var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;

  var slotRE = /^v-slot(:|$)|^#/;

  var lineBreakRE = /[\r\n]/;
  var whitespaceRE$1 = /\s+/g;

  var invalidAttributeRE = /[\s"'<>\/=]/;

  var decodeHTMLCached = cached(he.decode);

  var emptySlotScopeToken = "_empty_";

  // configurable state
  var warn$2;
  var delimiters;
  var transforms;
  var preTransforms;
  var postTransforms;
  var platformIsPreTag;
  var platformMustUseProp;
  var platformGetTagNamespace;
  var maybeComponent;

  function createASTElement(
    tag,
    attrs,
    parent
  ) {
    return {
      type: 1,
      tag: tag,
      attrsList: attrs,
      attrsMap: makeAttrsMap(attrs),
      rawAttrsMap: {},
      parent: parent,
      children: []
    }
  }

  /**
   * Convert HTML string to AST. 将 HTML字符串转换为 AST
   */
  function parse(
    template, // 模板字符串
    options // 选项
  ) {
    // 警告日志函数
    warn$2 = options.warn || baseWarn;
    // 判断标签是否是 pre 的工具函数
    platformIsPreTag = options.isPreTag || no;
    /* mustUseProp 校验属性
     * 1. attr === 'value', tag 必须是 'input,textarea,option,select,progress' 其中一个 type !== 'button'
     * 2. attr === 'selected' && tag === 'option'
     * 3. attr === 'checked' && tag === 'input'
     * 4. attr === 'muted' && tag === 'video'
     * 的情况下为真
     * */
    platformMustUseProp = options.mustUseProp || no;
    // 判断 tag 是否为 svg 或者 math 标签
    platformGetTagNamespace = options.getTagNamespace || no;
    // 判断指定标签是否为 html 标签 或者 svg 标签
    var isReservedTag = options.isReservedTag || no;
    // 判断是否为组件标签
    maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };

    transforms = pluckModuleFunction(options.modules, 'transformNode');
    preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
    postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

    delimiters = options.delimiters;

    var stack = [];
    var preserveWhitespace = options.preserveWhitespace !== false;
    var whitespaceOption = options.whitespace;
    var root;
    var currentParent;
    var inVPre = false;
    var inPre = false;
    var warned = false;

    function warnOnce(msg, range) {
      if (!warned) {
        warned = true;
        warn$2(msg, range);
      }
    }

    function closeElement(element) {
      trimEndingWhitespace(element);
      if (!inVPre && !element.processed) {
        element = processElement(element, options);
      }
      // tree management
      if (!stack.length && element !== root) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          {
            checkRootConstraints(element);
          }
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead.",
            { start: element.start }
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else {
          if (element.slotScope) {
            // scoped slot
            // keep it in the children list so that v-else(-if) conditions can
            // find it as the prev node.
            var name = element.slotTarget || '"default"'
              ; (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
          }
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }

      // final children cleanup
      // filter out scoped slots
      element.children = element.children.filter(function (c) { return !(c).slotScope; });
      // remove trailing whitespace node again
      trimEndingWhitespace(element);

      // check pre state
      if (element.pre) {
        inVPre = false;
      }
      if (platformIsPreTag(element.tag)) {
        inPre = false;
      }
      // apply post-transforms
      for (var i = 0; i < postTransforms.length; i++) {
        postTransforms[i](element, options);
      }
    }

    function trimEndingWhitespace(el) {
      // remove trailing whitespace node
      if (!inPre) {
        var lastNode;
        while (
          (lastNode = el.children[el.children.length - 1]) &&
          lastNode.type === 3 &&
          lastNode.text === ' '
        ) {
          el.children.pop();
        }
      }
    }

    function checkRootConstraints(el) {
      if (el.tag === 'slot' || el.tag === 'template') {
        warnOnce(
          "Cannot use <" + (el.tag) + "> as component root element because it may " +
          'contain multiple nodes.',
          { start: el.start }
        );
      }
      if (el.attrsMap.hasOwnProperty('v-for')) {
        warnOnce(
          'Cannot use v-for on stateful component root element because ' +
          'it renders multiple elements.',
          el.rawAttrsMap['v-for']
        );
      }
    }

    parseHTML(template, {
      warn: warn$2,
      expectHTML: options.expectHTML,
      isUnaryTag: options.isUnaryTag,
      canBeLeftOpenTag: options.canBeLeftOpenTag,
      shouldDecodeNewlines: options.shouldDecodeNewlines,
      shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
      shouldKeepComment: options.comments,
      outputSourceRange: options.outputSourceRange,
      start: function start(tag, attrs, unary, start$1, end) {
        // check namespace.
        // inherit parent ns if there is one
        var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

        // handle IE svg bug
        /* istanbul ignore if */
        if (isIE && ns === 'svg') {
          attrs = guardIESVGBug(attrs);
        }

        var element = createASTElement(tag, attrs, currentParent);
        if (ns) {
          element.ns = ns;
        }

        {
          if (options.outputSourceRange) {
            element.start = start$1;
            element.end = end;
            element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
              cumulated[attr.name] = attr;
              return cumulated
            }, {});
          }
          attrs.forEach(function (attr) {
            if (invalidAttributeRE.test(attr.name)) {
              warn$2(
                "Invalid dynamic argument expression: attribute names cannot contain " +
                "spaces, quotes, <, >, / or =.",
                {
                  start: attr.start + attr.name.indexOf("["),
                  end: attr.start + attr.name.length
                }
              );
            }
          });
        }

        if (isForbiddenTag(element) && !isServerRendering()) {
          element.forbidden = true;
          warn$2(
            'Templates should only be responsible for mapping the state to the ' +
            'UI. Avoid placing tags with side-effects in your templates, such as ' +
            "<" + tag + ">" + ', as they will not be parsed.',
            { start: element.start }
          );
        }

        // apply pre-transforms
        for (var i = 0; i < preTransforms.length; i++) {
          element = preTransforms[i](element, options) || element;
        }

        if (!inVPre) {
          processPre(element);
          if (element.pre) {
            inVPre = true;
          }
        }
        if (platformIsPreTag(element.tag)) {
          inPre = true;
        }
        if (inVPre) {
          processRawAttrs(element);
        } else if (!element.processed) {
          // structural directives
          processFor(element);
          processIf(element);
          processOnce(element);
        }

        if (!root) {
          root = element;
          {
            checkRootConstraints(root);
          }
        }

        if (!unary) {
          currentParent = element;
          stack.push(element);
        } else {
          closeElement(element);
        }
      },

      end: function end(tag, start, end$1) {
        var element = stack[stack.length - 1];
        // pop stack
        stack.length -= 1;
        currentParent = stack[stack.length - 1];
        if (options.outputSourceRange) {
          element.end = end$1;
        }
        closeElement(element);
      },

      chars: function chars(text, start, end) {
        if (!currentParent) {
          {
            if (text === template) {
              warnOnce(
                'Component template requires a root element, rather than just text.',
                { start: start }
              );
            } else if ((text = text.trim())) {
              warnOnce(
                ("text \"" + text + "\" outside root element will be ignored."),
                { start: start }
              );
            }
          }
          return
        }
        // IE textarea placeholder bug
        /* istanbul ignore if */
        if (isIE &&
          currentParent.tag === 'textarea' &&
          currentParent.attrsMap.placeholder === text
        ) {
          return
        }
        var children = currentParent.children;
        if (inPre || text.trim()) {
          text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
        } else if (!children.length) {
          // remove the whitespace-only node right after an opening tag
          text = '';
        } else if (whitespaceOption) {
          if (whitespaceOption === 'condense') {
            // in condense mode, remove the whitespace node if it contains
            // line break, otherwise condense to a single space
            text = lineBreakRE.test(text) ? '' : ' ';
          } else {
            text = ' ';
          }
        } else {
          text = preserveWhitespace ? ' ' : '';
        }
        if (text) {
          if (!inPre && whitespaceOption === 'condense') {
            // condense consecutive whitespaces into single space
            text = text.replace(whitespaceRE$1, ' ');
          }
          var res;
          var child;
          if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
            child = {
              type: 2,
              expression: res.expression,
              tokens: res.tokens,
              text: text
            };
          } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
            child = {
              type: 3,
              text: text
            };
          }
          if (child) {
            if (options.outputSourceRange) {
              child.start = start;
              child.end = end;
            }
            children.push(child);
          }
        }
      },
      comment: function comment(text, start, end) {
        // adding anyting as a sibling to the root node is forbidden
        // comments should still be allowed, but ignored
        if (currentParent) {
          var child = {
            type: 3,
            text: text,
            isComment: true
          };
          if (options.outputSourceRange) {
            child.start = start;
            child.end = end;
          }
          currentParent.children.push(child);
        }
      }
    });
    return root
  }

  function processPre(el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
      el.pre = true;
    }
  }

  function processRawAttrs(el) {
    var list = el.attrsList;
    var len = list.length;
    if (len) {
      var attrs = el.attrs = new Array(len);
      for (var i = 0; i < len; i++) {
        attrs[i] = {
          name: list[i].name,
          value: JSON.stringify(list[i].value)
        };
        if (list[i].start != null) {
          attrs[i].start = list[i].start;
          attrs[i].end = list[i].end;
        }
      }
    } else if (!el.pre) {
      // non root node in pre blocks with no attributes
      el.plain = true;
    }
  }

  function processElement(
    element,
    options
  ) {
    processKey(element);

    // determine whether this is a plain element after
    // removing structural attributes
    element.plain = (
      !element.key &&
      !element.scopedSlots &&
      !element.attrsList.length
    );

    processRef(element);
    processSlotContent(element);
    processSlotOutlet(element);
    processComponent(element);
    for (var i = 0; i < transforms.length; i++) {
      element = transforms[i](element, options) || element;
    }
    processAttrs(element);
    return element
  }

  function processKey(el) {
    var exp = getBindingAttr(el, 'key');
    if (exp) {
      {
        if (el.tag === 'template') {
          warn$2(
            "<template> cannot be keyed. Place the key on real elements instead.",
            getRawBindingAttr(el, 'key')
          );
        }
        if (el.for) {
          var iterator = el.iterator2 || el.iterator1;
          var parent = el.parent;
          if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
            warn$2(
              "Do not use v-for index as key on <transition-group> children, " +
              "this is the same as not using keys.",
              getRawBindingAttr(el, 'key'),
              true /* tip */
            );
          }
        }
      }
      el.key = exp;
    }
  }

  function processRef(el) {
    var ref = getBindingAttr(el, 'ref');
    if (ref) {
      el.ref = ref;
      el.refInFor = checkInFor(el);
    }
  }

  function processFor(el) {
    var exp;
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
      var res = parseFor(exp);
      if (res) {
        extend(el, res);
      } else {
        warn$2(
          ("Invalid v-for expression: " + exp),
          el.rawAttrsMap['v-for']
        );
      }
    }
  }



  function parseFor(exp) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) { return }
    var res = {};
    res.for = inMatch[2].trim();
    var alias = inMatch[1].trim().replace(stripParensRE, '');
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      res.alias = alias.replace(forIteratorRE, '').trim();
      res.iterator1 = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.iterator2 = iteratorMatch[2].trim();
      }
    } else {
      res.alias = alias;
    }
    return res
  }

  function processIf(el) {
    var exp = getAndRemoveAttr(el, 'v-if');
    if (exp) {
      el.if = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) {
        el.else = true;
      }
      var elseif = getAndRemoveAttr(el, 'v-else-if');
      if (elseif) {
        el.elseif = elseif;
      }
    }
  }

  function processIfConditions(el, parent) {
    var prev = findPrevElement(parent.children);
    if (prev && prev.if) {
      addIfCondition(prev, {
        exp: el.elseif,
        block: el
      });
    } else {
      warn$2(
        "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
        "used on element <" + (el.tag) + "> without corresponding v-if.",
        el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
      );
    }
  }

  function findPrevElement(children) {
    var i = children.length;
    while (i--) {
      if (children[i].type === 1) {
        return children[i]
      } else {
        if (children[i].text !== ' ') {
          warn$2(
            "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
            "will be ignored.",
            children[i]
          );
        }
        children.pop();
      }
    }
  }

  function addIfCondition(el, condition) {
    if (!el.ifConditions) {
      el.ifConditions = [];
    }
    el.ifConditions.push(condition);
  }

  function processOnce(el) {
    var once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
      el.once = true;
    }
  }

  // handle content being passed to a component as slot,
  // e.g. <template slot="xxx">, <div slot-scope="xxx">
  function processSlotContent(el) {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if (slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          el.rawAttrsMap['scope'],
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if (el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          el.rawAttrsMap['slot-scope'],
          true
        );
      }
      el.slotScope = slotScope;
    }

    // slot="xxx"
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
      }
    }

    // 2.6 v-slot syntax
    {
      if (el.tag === 'template') {
        // v-slot on <template>
        var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding) {
          {
            if (el.slotTarget || el.slotScope) {
              warn$2(
                "Unexpected mixed usage of different slot syntaxes.",
                el
              );
            }
            if (el.parent && !maybeComponent(el.parent)) {
              warn$2(
                "<template v-slot> can only appear at the root level inside " +
                "the receiving component",
                el
              );
            }
          }
          var ref = getSlotName(slotBinding);
          var name = ref.name;
          var dynamic = ref.dynamic;
          el.slotTarget = name;
          el.slotTargetDynamic = dynamic;
          el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
        }
      } else {
        // v-slot on component, denotes default slot
        var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding$1) {
          {
            if (!maybeComponent(el)) {
              warn$2(
                "v-slot can only be used on components or <template>.",
                slotBinding$1
              );
            }
            if (el.slotScope || el.slotTarget) {
              warn$2(
                "Unexpected mixed usage of different slot syntaxes.",
                el
              );
            }
            if (el.scopedSlots) {
              warn$2(
                "To avoid scope ambiguity, the default slot should also use " +
                "<template> syntax when there are other named slots.",
                slotBinding$1
              );
            }
          }
          // add the component's children to its default slot
          var slots = el.scopedSlots || (el.scopedSlots = {});
          var ref$1 = getSlotName(slotBinding$1);
          var name$1 = ref$1.name;
          var dynamic$1 = ref$1.dynamic;
          var slotContainer = slots[name$1] = createASTElement('template', [], el);
          slotContainer.slotTarget = name$1;
          slotContainer.slotTargetDynamic = dynamic$1;
          slotContainer.children = el.children.filter(function (c) {
            if (!c.slotScope) {
              c.parent = slotContainer;
              return true
            }
          });
          slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
          // remove children as they are returned from scopedSlots now
          el.children = [];
          // mark el non-plain so data gets generated
          el.plain = false;
        }
      }
    }
  }

  function getSlotName(binding) {
    var name = binding.name.replace(slotRE, '');
    if (!name) {
      if (binding.name[0] !== '#') {
        name = 'default';
      } else {
        warn$2(
          "v-slot shorthand syntax requires a slot name.",
          binding
        );
      }
    }
    return dynamicArgRE.test(name)
      // dynamic [name]
      ? { name: name.slice(1, -1), dynamic: true }
      // static name
      : { name: ("\"" + name + "\""), dynamic: false }
  }

  // handle <slot/> outlets
  function processSlotOutlet(el) {
    if (el.tag === 'slot') {
      el.slotName = getBindingAttr(el, 'name');
      if (el.key) {
        warn$2(
          "`key` does not work on <slot> because slots are abstract outlets " +
          "and can possibly expand into multiple elements. " +
          "Use the key on a wrapping element instead.",
          getRawBindingAttr(el, 'key')
        );
      }
    }
  }

  function processComponent(el) {
    var binding;
    if ((binding = getBindingAttr(el, 'is'))) {
      el.component = binding;
    }
    if (getAndRemoveAttr(el, 'inline-template') != null) {
      el.inlineTemplate = true;
    }
  }

  function processAttrs(el) {
    var list = el.attrsList;
    var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
    for (i = 0, l = list.length; i < l; i++) {
      name = rawName = list[i].name;
      value = list[i].value;
      if (dirRE.test(name)) {
        // mark element as dynamic
        el.hasBindings = true;
        // modifiers
        modifiers = parseModifiers(name.replace(dirRE, ''));
        // support .foo shorthand syntax for the .prop modifier
        if (modifiers) {
          name = name.replace(modifierRE, '');
        }
        if (bindRE.test(name)) { // v-bind
          name = name.replace(bindRE, '');
          value = parseFilters(value);
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          if (
            value.trim().length === 0
          ) {
            warn$2(
              ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
            );
          }
          if (modifiers) {
            if (modifiers.prop && !isDynamic) {
              name = camelize(name);
              if (name === 'innerHtml') { name = 'innerHTML'; }
            }
            if (modifiers.camel && !isDynamic) {
              name = camelize(name);
            }
            if (modifiers.sync) {
              syncGen = genAssignmentCode(value, "$event");
              if (!isDynamic) {
                addHandler(
                  el,
                  ("update:" + (camelize(name))),
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i]
                );
                if (hyphenate(name) !== camelize(name)) {
                  addHandler(
                    el,
                    ("update:" + (hyphenate(name))),
                    syncGen,
                    null,
                    false,
                    warn$2,
                    list[i]
                  );
                }
              } else {
                // handler w/ dynamic event name
                addHandler(
                  el,
                  ("\"update:\"+(" + name + ")"),
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i],
                  true // dynamic
                );
              }
            }
          }
          if ((modifiers && modifiers.prop) || (
            !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
          )) {
            addProp(el, name, value, list[i], isDynamic);
          } else {
            addAttr(el, name, value, list[i], isDynamic);
          }
        } else if (onRE.test(name)) { // v-on
          name = name.replace(onRE, '');
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
        } else { // normal directives
          name = name.replace(dirRE, '');
          // parse arg
          var argMatch = name.match(argRE);
          var arg = argMatch && argMatch[1];
          isDynamic = false;
          if (arg) {
            name = name.slice(0, -(arg.length + 1));
            if (dynamicArgRE.test(arg)) {
              arg = arg.slice(1, -1);
              isDynamic = true;
            }
          }
          addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
          if (name === 'model') {
            checkForAliasModel(el, value);
          }
        }
      } else {
        // literal attribute
        {
          var res = parseText(value, delimiters);
          if (res) {
            warn$2(
              name + "=\"" + value + "\": " +
              'Interpolation inside attributes has been removed. ' +
              'Use v-bind or the colon shorthand instead. For example, ' +
              'instead of <div id="{{ val }}">, use <div :id="val">.',
              list[i]
            );
          }
        }
        addAttr(el, name, JSON.stringify(value), list[i]);
        // #6887 firefox doesn't update muted state if set via attribute
        // even immediately after element creation
        if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, 'true', list[i]);
        }
      }
    }
  }

  function checkInFor(el) {
    var parent = el;
    while (parent) {
      if (parent.for !== undefined) {
        return true
      }
      parent = parent.parent;
    }
    return false
  }

  function parseModifiers(name) {
    var match = name.match(modifierRE);
    if (match) {
      var ret = {};
      match.forEach(function (m) { ret[m.slice(1)] = true; });
      return ret
    }
  }

  function makeAttrsMap(attrs) {
    var map = {};
    for (var i = 0, l = attrs.length; i < l; i++) {
      if (
        map[attrs[i].name] && !isIE && !isEdge
      ) {
        warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
      }
      map[attrs[i].name] = attrs[i].value;
    }
    return map
  }

  // for script (e.g. type="x/template") or style, do not decode content
  function isTextTag(el) {
    return el.tag === 'script' || el.tag === 'style'
  }

  function isForbiddenTag(el) {
    return (
      el.tag === 'style' ||
      (el.tag === 'script' && (
        !el.attrsMap.type ||
        el.attrsMap.type === 'text/javascript'
      ))
    )
  }

  var ieNSBug = /^xmlns:NS\d+/;
  var ieNSPrefix = /^NS\d+:/;

  /* istanbul ignore next */
  function guardIESVGBug(attrs) {
    var res = [];
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (!ieNSBug.test(attr.name)) {
        attr.name = attr.name.replace(ieNSPrefix, '');
        res.push(attr);
      }
    }
    return res
  }

  function checkForAliasModel(el, value) {
    var _el = el;
    while (_el) {
      if (_el.for && _el.alias === value) {
        warn$2(
          "<" + (el.tag) + " v-model=\"" + value + "\">: " +
          "You are binding v-model directly to a v-for iteration alias. " +
          "This will not be able to modify the v-for source array because " +
          "writing to the alias is like modifying a function local variable. " +
          "Consider using an array of objects and use v-model on an object property instead.",
          el.rawAttrsMap['v-model']
        );
      }
      _el = _el.parent;
    }
  }

  /*  */

  function preTransformNode(el, options) {
    if (el.tag === 'input') {
      var map = el.attrsMap;
      if (!map['v-model']) {
        return
      }

      var typeBinding;
      if (map[':type'] || map['v-bind:type']) {
        typeBinding = getBindingAttr(el, 'type');
      }
      if (!map.type && !typeBinding && map['v-bind']) {
        typeBinding = "(" + (map['v-bind']) + ").type";
      }

      if (typeBinding) {
        var ifCondition = getAndRemoveAttr(el, 'v-if', true);
        var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
        var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
        var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
        // 1. checkbox
        var branch0 = cloneASTElement(el);
        // process for on the main node
        processFor(branch0);
        addRawAttr(branch0, 'type', 'checkbox');
        processElement(branch0, options);
        branch0.processed = true; // prevent it from double-processed
        branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
        addIfCondition(branch0, {
          exp: branch0.if,
          block: branch0
        });
        // 2. add radio else-if condition
        var branch1 = cloneASTElement(el);
        getAndRemoveAttr(branch1, 'v-for', true);
        addRawAttr(branch1, 'type', 'radio');
        processElement(branch1, options);
        addIfCondition(branch0, {
          exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
          block: branch1
        });
        // 3. other
        var branch2 = cloneASTElement(el);
        getAndRemoveAttr(branch2, 'v-for', true);
        addRawAttr(branch2, ':type', typeBinding);
        processElement(branch2, options);
        addIfCondition(branch0, {
          exp: ifCondition,
          block: branch2
        });

        if (hasElse) {
          branch0.else = true;
        } else if (elseIfCondition) {
          branch0.elseif = elseIfCondition;
        }

        return branch0
      }
    }
  }

  function cloneASTElement(el) {
    return createASTElement(el.tag, el.attrsList.slice(), el.parent)
  }

  var model$1 = {
    preTransformNode: preTransformNode
  };

  var modules$1 = [
    klass$1,
    style$1,
    model$1
  ];

  /*  */

  function text(el, dir) {
    if (dir.value) {
      addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
    }
  }

  /*  */

  function html(el, dir) {
    if (dir.value) {
      addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
    }
  }

  var directives$1 = {
    model: model,
    text: text,
    html: html
  };

  /*  */
  // web 平台，compile 编译器相关的配置项
  var baseOptions = {
    expectHTML: true, // 标志 是html -- 说明是 html 文档
    modules: modules$1, // 为虚拟 dom 添加 staticClass，classBinding，staticStyle，styleBinding，for，alias，iterator1，iterator2，addRawAttr ，type ，key， ref，slotName 或者 slotScope 或者 slot，component 或者 inlineTemplate ，      plain，if ，else，elseif 属性
    directives: directives$1, // 根据判断虚拟dom的标签类型是什么？给相应的标签绑定 相应的 v-model 双数据绑定代码函数，为虚拟dom添加textContent 属性，为虚拟dom添加innerHTML 属性
    isPreTag: isPreTag, // 判断标签是否是 pre
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp, // 是否需要通过 attr 添加的属性？
    canBeLeftOpenTag: canBeLeftOpenTag,
    isReservedTag: isReservedTag, // 判断指定标签是否为 html 标签 或者 svg 标签
    getTagNamespace: getTagNamespace, // 判断指定 tag 标签是否为 svg 或 math
    staticKeys: genStaticKeys(modules$1)
  };

  /*  */

  var isStaticKey;
  var isPlatformReservedTag;

  var genStaticKeysCached = cached(genStaticKeys$1);

  /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  function optimize(root, options) {
    if (!root) { return }
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // first pass: mark all non-static nodes.
    markStatic$1(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
  }

  function genStaticKeys$1(keys) {
    return makeMap(
      'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
      (keys ? ',' + keys : '')
    )
  }

  function markStatic$1(node) {
    node.static = isStatic(node);
    if (node.type === 1) {
      // do not make component slot content static. this avoids
      // 1. components not able to mutate slot nodes
      // 2. static slot content fails for hot-reloading
      if (
        !isPlatformReservedTag(node.tag) &&
        node.tag !== 'slot' &&
        node.attrsMap['inline-template'] == null
      ) {
        return
      }
      for (var i = 0, l = node.children.length; i < l; i++) {
        var child = node.children[i];
        markStatic$1(child);
        if (!child.static) {
          node.static = false;
        }
      }
      if (node.ifConditions) {
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          var block = node.ifConditions[i$1].block;
          markStatic$1(block);
          if (!block.static) {
            node.static = false;
          }
        }
      }
    }
  }

  function markStaticRoots(node, isInFor) {
    if (node.type === 1) {
      if (node.static || node.once) {
        node.staticInFor = isInFor;
      }
      // For a node to qualify as a static root, it should have children that
      // are not just static text. Otherwise the cost of hoisting out will
      // outweigh the benefits and it's better off to just always render it fresh.
      if (node.static && node.children.length && !(
        node.children.length === 1 &&
        node.children[0].type === 3
      )) {
        node.staticRoot = true;
        return
      } else {
        node.staticRoot = false;
      }
      if (node.children) {
        for (var i = 0, l = node.children.length; i < l; i++) {
          markStaticRoots(node.children[i], isInFor || !!node.for);
        }
      }
      if (node.ifConditions) {
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          markStaticRoots(node.ifConditions[i$1].block, isInFor);
        }
      }
    }
  }

  function isStatic(node) {
    if (node.type === 2) { // expression
      return false
    }
    if (node.type === 3) { // text
      return true
    }
    return !!(node.pre || (
      !node.hasBindings && // no dynamic bindings
      !node.if && !node.for && // not v-if or v-for or v-else
      !isBuiltInTag(node.tag) && // not a built-in
      isPlatformReservedTag(node.tag) && // not a component
      !isDirectChildOfTemplateFor(node) &&
      Object.keys(node).every(isStaticKey)
    ))
  }

  function isDirectChildOfTemplateFor(node) {
    while (node.parent) {
      node = node.parent;
      if (node.tag !== 'template') {
        return false
      }
      if (node.for) {
        return true
      }
    }
    return false
  }

  /*  */

  var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
  var fnInvokeRE = /\([^)]*?\);*$/;
  var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

  // KeyboardEvent.keyCode aliases
  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    'delete': [8, 46]
  };

  // KeyboardEvent.key aliases
  var keyNames = {
    // #7880: IE11 and Edge use `Esc` for Escape key name.
    esc: ['Esc', 'Escape'],
    tab: 'Tab',
    enter: 'Enter',
    // #9112: IE11 uses `Spacebar` for Space key name.
    space: [' ', 'Spacebar'],
    // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
    up: ['Up', 'ArrowUp'],
    left: ['Left', 'ArrowLeft'],
    right: ['Right', 'ArrowRight'],
    down: ['Down', 'ArrowDown'],
    // #9112: IE11 uses `Del` for Delete key name.
    'delete': ['Backspace', 'Delete', 'Del']
  };

  // #4868: modifiers that prevent the execution of the listener
  // need to explicitly return null so that we can determine whether to remove
  // the listener for .once
  var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

  var modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: genGuard("$event.target !== $event.currentTarget"),
    ctrl: genGuard("!$event.ctrlKey"),
    shift: genGuard("!$event.shiftKey"),
    alt: genGuard("!$event.altKey"),
    meta: genGuard("!$event.metaKey"),
    left: genGuard("'button' in $event && $event.button !== 0"),
    middle: genGuard("'button' in $event && $event.button !== 1"),
    right: genGuard("'button' in $event && $event.button !== 2")
  };

  function genHandlers(
    events,
    isNative
  ) {
    var prefix = isNative ? 'nativeOn:' : 'on:';
    var staticHandlers = "";
    var dynamicHandlers = "";
    for (var name in events) {
      var handlerCode = genHandler(events[name]);
      if (events[name] && events[name].dynamic) {
        dynamicHandlers += name + "," + handlerCode + ",";
      } else {
        staticHandlers += "\"" + name + "\":" + handlerCode + ",";
      }
    }
    staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
    if (dynamicHandlers) {
      return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])"
    } else {
      return prefix + staticHandlers
    }
  }

  function genHandler(handler) {
    if (!handler) {
      return 'function(){}'
    }

    if (Array.isArray(handler)) {
      return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]")
    }

    var isMethodPath = simplePathRE.test(handler.value);
    var isFunctionExpression = fnExpRE.test(handler.value);
    var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

    if (!handler.modifiers) {
      if (isMethodPath || isFunctionExpression) {
        return handler.value
      }
      return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}") // inline statement
    } else {
      var code = '';
      var genModifierCode = '';
      var keys = [];
      for (var key in handler.modifiers) {
        if (modifierCode[key]) {
          genModifierCode += modifierCode[key];
          // left/right
          if (keyCodes[key]) {
            keys.push(key);
          }
        } else if (key === 'exact') {
          var modifiers = (handler.modifiers);
          genModifierCode += genGuard(
            ['ctrl', 'shift', 'alt', 'meta']
              .filter(function (keyModifier) { return !modifiers[keyModifier]; })
              .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
              .join('||')
          );
        } else {
          keys.push(key);
        }
      }
      if (keys.length) {
        code += genKeyFilter(keys);
      }
      // Make sure modifiers like prevent and stop get executed after key filtering
      if (genModifierCode) {
        code += genModifierCode;
      }
      var handlerCode = isMethodPath
        ? ("return " + (handler.value) + "($event)")
        : isFunctionExpression
          ? ("return (" + (handler.value) + ")($event)")
          : isFunctionInvocation
            ? ("return " + (handler.value))
            : handler.value;
      return ("function($event){" + code + handlerCode + "}")
    }
  }

  function genKeyFilter(keys) {
    return (
      // make sure the key filters only apply to KeyboardEvents
      // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
      // key events that do not have keyCode property...
      "if(!$event.type.indexOf('key')&&" +
      (keys.map(genFilterCode).join('&&')) + ")return null;"
    )
  }

  function genFilterCode(key) {
    var keyVal = parseInt(key, 10);
    if (keyVal) {
      return ("$event.keyCode!==" + keyVal)
    }
    var keyCode = keyCodes[key];
    var keyName = keyNames[key];
    return (
      "_k($event.keyCode," +
      (JSON.stringify(key)) + "," +
      (JSON.stringify(keyCode)) + "," +
      "$event.key," +
      "" + (JSON.stringify(keyName)) +
      ")"
    )
  }

  /*  */

  function on(el, dir) {
    if (dir.modifiers) {
      warn("v-on without argument does not support modifiers.");
    }
    el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
  }

  /*  */

  function bind$1(el, dir) {
    el.wrapData = function (code) {
      return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
    };
  }

  /*  */

  var baseDirectives = {
    on: on,
    bind: bind$1,
    cloak: noop
  };

  /*  */





  var CodegenState = function CodegenState(options) {
    this.options = options;
    this.warn = options.warn || baseWarn;
    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
    this.directives = extend(extend({}, baseDirectives), options.directives);
    var isReservedTag = options.isReservedTag || no;
    this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
    this.onceId = 0;
    this.staticRenderFns = [];
    this.pre = false;
  };



  function generate(
    ast,
    options
  ) {
    var state = new CodegenState(options);
    var code = ast ? genElement(ast, state) : '_c("div")';
    return {
      render: ("with(this){return " + code + "}"),
      staticRenderFns: state.staticRenderFns
    }
  }

  function genElement(el, state) {
    if (el.parent) {
      el.pre = el.pre || el.parent.pre;
    }

    if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el, state)
    } else if (el.once && !el.onceProcessed) {
      return genOnce(el, state)
    } else if (el.for && !el.forProcessed) {
      return genFor(el, state)
    } else if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
      return genChildren(el, state) || 'void 0'
    } else if (el.tag === 'slot') {
      return genSlot(el, state)
    } else {
      // component or element
      var code;
      if (el.component) {
        code = genComponent(el.component, el, state);
      } else {
        var data;
        if (!el.plain || (el.pre && state.maybeComponent(el))) {
          data = genData$2(el, state);
        }

        var children = el.inlineTemplate ? null : genChildren(el, state, true);
        code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
      }
      // module transforms
      for (var i = 0; i < state.transforms.length; i++) {
        code = state.transforms[i](el, code);
      }
      return code
    }
  }

  // hoist static sub-trees out
  function genStatic(el, state) {
    el.staticProcessed = true;
    // Some elements (templates) need to behave differently inside of a v-pre
    // node.  All pre nodes are static roots, so we can use this as a location to
    // wrap a state change and reset it upon exiting the pre node.
    var originalPreState = state.pre;
    if (el.pre) {
      state.pre = el.pre;
    }
    state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
    state.pre = originalPreState;
    return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
  }

  // v-once
  function genOnce(el, state) {
    el.onceProcessed = true;
    if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.staticInFor) {
      var key = '';
      var parent = el.parent;
      while (parent) {
        if (parent.for) {
          key = parent.key;
          break
        }
        parent = parent.parent;
      }
      if (!key) {
        state.warn(
          "v-once can only be used inside v-for that is keyed. ",
          el.rawAttrsMap['v-once']
        );
        return genElement(el, state)
      }
      return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
    } else {
      return genStatic(el, state)
    }
  }

  function genIf(
    el,
    state,
    altGen,
    altEmpty
  ) {
    el.ifProcessed = true; // avoid recursion
    return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
  }

  function genIfConditions(
    conditions,
    state,
    altGen,
    altEmpty
  ) {
    if (!conditions.length) {
      return altEmpty || '_e()'
    }

    var condition = conditions.shift();
    if (condition.exp) {
      return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
    } else {
      return ("" + (genTernaryExp(condition.block)))
    }

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp(el) {
      return altGen
        ? altGen(el, state)
        : el.once
          ? genOnce(el, state)
          : genElement(el, state)
    }
  }

  function genFor(
    el,
    state,
    altGen,
    altHelper
  ) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
    var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

    if (state.maybeComponent(el) &&
      el.tag !== 'slot' &&
      el.tag !== 'template' &&
      !el.key
    ) {
      state.warn(
        "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
        "v-for should have explicit keys. " +
        "See https://vuejs.org/guide/list.html#key for more info.",
        el.rawAttrsMap['v-for'],
        true /* tip */
      );
    }

    el.forProcessed = true; // avoid recursion
    return (altHelper || '_l') + "((" + exp + ")," +
      "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
      '})'
  }

  function genData$2(el, state) {
    var data = '{';

    // directives first.
    // directives may mutate the el's other properties before they are generated.
    var dirs = genDirectives(el, state);
    if (dirs) { data += dirs + ','; }

    // key
    if (el.key) {
      data += "key:" + (el.key) + ",";
    }
    // ref
    if (el.ref) {
      data += "ref:" + (el.ref) + ",";
    }
    if (el.refInFor) {
      data += "refInFor:true,";
    }
    // pre
    if (el.pre) {
      data += "pre:true,";
    }
    // record original tag name for components using "is" attribute
    if (el.component) {
      data += "tag:\"" + (el.tag) + "\",";
    }
    // module data generation functions
    for (var i = 0; i < state.dataGenFns.length; i++) {
      data += state.dataGenFns[i](el);
    }
    // attributes
    if (el.attrs) {
      data += "attrs:" + (genProps(el.attrs)) + ",";
    }
    // DOM props
    if (el.props) {
      data += "domProps:" + (genProps(el.props)) + ",";
    }
    // event handlers
    if (el.events) {
      data += (genHandlers(el.events, false)) + ",";
    }
    if (el.nativeEvents) {
      data += (genHandlers(el.nativeEvents, true)) + ",";
    }
    // slot target
    // only for non-scoped slots
    if (el.slotTarget && !el.slotScope) {
      data += "slot:" + (el.slotTarget) + ",";
    }
    // scoped slots
    if (el.scopedSlots) {
      data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
    }
    // component v-model
    if (el.model) {
      data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
    }
    // inline-template
    if (el.inlineTemplate) {
      var inlineTemplate = genInlineTemplate(el, state);
      if (inlineTemplate) {
        data += inlineTemplate + ",";
      }
    }
    data = data.replace(/,$/, '') + '}';
    // v-bind dynamic argument wrap
    // v-bind with dynamic arguments must be applied using the same v-bind object
    // merge helper so that class/style/mustUseProp attrs are handled correctly.
    if (el.dynamicAttrs) {
      data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
    }
    // v-bind data wrap
    if (el.wrapData) {
      data = el.wrapData(data);
    }
    // v-on data wrap
    if (el.wrapListeners) {
      data = el.wrapListeners(data);
    }
    return data
  }

  function genDirectives(el, state) {
    var dirs = el.directives;
    if (!dirs) { return }
    var res = 'directives:[';
    var hasRuntime = false;
    var i, l, dir, needRuntime;
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i];
      needRuntime = true;
      var gen = state.directives[dir.name];
      if (gen) {
        // compile-time directive that manipulates AST.
        // returns true if it also needs a runtime counterpart.
        needRuntime = !!gen(el, dir, state.warn);
      }
      if (needRuntime) {
        hasRuntime = true;
        res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
      }
    }
    if (hasRuntime) {
      return res.slice(0, -1) + ']'
    }
  }

  function genInlineTemplate(el, state) {
    var ast = el.children[0];
    if (el.children.length !== 1 || ast.type !== 1) {
      state.warn(
        'Inline-template components must have exactly one child element.',
        { start: el.start }
      );
    }
    if (ast && ast.type === 1) {
      var inlineRenderFns = generate(ast, state.options);
      return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
    }
  }

  function genScopedSlots(
    el,
    slots,
    state
  ) {
    // by default scoped slots are considered "stable", this allows child
    // components with only scoped slots to skip forced updates from parent.
    // but in some cases we have to bail-out of this optimization
    // for example if the slot contains dynamic names, has v-if or v-for on them...
    var needsForceUpdate = el.for || Object.keys(slots).some(function (key) {
      var slot = slots[key];
      return (
        slot.slotTargetDynamic ||
        slot.if ||
        slot.for ||
        containsSlotChild(slot) // is passing down slot from parent which may be dynamic
      )
    });

    // #9534: if a component with scoped slots is inside a conditional branch,
    // it's possible for the same component to be reused but with different
    // compiled slot content. To avoid that, we generate a unique key based on
    // the generated code of all the slot contents.
    var needsKey = !!el.if;

    // OR when it is inside another scoped slot or v-for (the reactivity may be
    // disconnected due to the intermediate scope variable)
    // #9438, #9506
    // TODO: this can be further optimized by properly analyzing in-scope bindings
    // and skip force updating ones that do not actually use scope variables.
    if (!needsForceUpdate) {
      var parent = el.parent;
      while (parent) {
        if (
          (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
          parent.for
        ) {
          needsForceUpdate = true;
          break
        }
        if (parent.if) {
          needsKey = true;
        }
        parent = parent.parent;
      }
    }

    var generatedSlots = Object.keys(slots)
      .map(function (key) { return genScopedSlot(slots[key], state); })
      .join(',');

    return ("scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? (",null,false," + (hash(generatedSlots))) : "") + ")")
  }

  function hash(str) {
    var hash = 5381;
    var i = str.length;
    while (i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0
  }

  function containsSlotChild(el) {
    if (el.type === 1) {
      if (el.tag === 'slot') {
        return true
      }
      return el.children.some(containsSlotChild)
    }
    return false
  }

  function genScopedSlot(
    el,
    state
  ) {
    var isLegacySyntax = el.attrsMap['slot-scope'];
    if (el.if && !el.ifProcessed && !isLegacySyntax) {
      return genIf(el, state, genScopedSlot, "null")
    }
    if (el.for && !el.forProcessed) {
      return genFor(el, state, genScopedSlot)
    }
    var slotScope = el.slotScope === emptySlotScopeToken
      ? ""
      : String(el.slotScope);
    var fn = "function(" + slotScope + "){" +
      "return " + (el.tag === 'template'
        ? el.if && isLegacySyntax
          ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
          : genChildren(el, state) || 'undefined'
        : genElement(el, state)) + "}";
    // reverse proxy v-slot without scope on this.$slots
    var reverseProxy = slotScope ? "" : ",proxy:true";
    return ("{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}")
  }

  function genChildren(
    el,
    state,
    checkSkip,
    altGenElement,
    altGenNode
  ) {
    var children = el.children;
    if (children.length) {
      var el$1 = children[0];
      // optimize single v-for
      if (children.length === 1 &&
        el$1.for &&
        el$1.tag !== 'template' &&
        el$1.tag !== 'slot'
      ) {
        var normalizationType = checkSkip
          ? state.maybeComponent(el$1) ? ",1" : ",0"
          : "";
        return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType)
      }
      var normalizationType$1 = checkSkip
        ? getNormalizationType(children, state.maybeComponent)
        : 0;
      var gen = altGenNode || genNode;
      return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''))
    }
  }

  // determine the normalization needed for the children array.
  // 0: no normalization needed
  // 1: simple normalization needed (possible 1-level deep nested array)
  // 2: full normalization needed
  function getNormalizationType(
    children,
    maybeComponent
  ) {
    var res = 0;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (el.type !== 1) {
        continue
      }
      if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
        res = 2;
        break
      }
      if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
        res = 1;
      }
    }
    return res
  }

  function needsNormalization(el) {
    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
  }

  function genNode(node, state) {
    if (node.type === 1) {
      return genElement(node, state)
    } else if (node.type === 3 && node.isComment) {
      return genComment(node)
    } else {
      return genText(node)
    }
  }

  function genText(text) {
    return ("_v(" + (text.type === 2
      ? text.expression // no need for () because already wrapped in _s()
      : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
  }

  function genComment(comment) {
    return ("_e(" + (JSON.stringify(comment.text)) + ")")
  }

  function genSlot(el, state) {
    var slotName = el.slotName || '"default"';
    var children = genChildren(el, state);
    var res = "_t(" + slotName + (children ? ("," + children) : '');
    var attrs = el.attrs || el.dynamicAttrs
      ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) {
        return ({
          // slot props are camelized
          name: camelize(attr.name),
          value: attr.value,
          dynamic: attr.dynamic
        });
      }))
      : null;
    var bind$$1 = el.attrsMap['v-bind'];
    if ((attrs || bind$$1) && !children) {
      res += ",null";
    }
    if (attrs) {
      res += "," + attrs;
    }
    if (bind$$1) {
      res += (attrs ? '' : ',null') + "," + bind$$1;
    }
    return res + ')'
  }

  // componentName is el.component, take it as argument to shun flow's pessimistic refinement
  function genComponent(
    componentName,
    el,
    state
  ) {
    var children = el.inlineTemplate ? null : genChildren(el, state, true);
    return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
  }

  function genProps(props) {
    var staticProps = "";
    var dynamicProps = "";
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var value = transformSpecialNewlines(prop.value);
      if (prop.dynamic) {
        dynamicProps += (prop.name) + "," + value + ",";
      } else {
        staticProps += "\"" + (prop.name) + "\":" + value + ",";
      }
    }
    staticProps = "{" + (staticProps.slice(0, -1)) + "}";
    if (dynamicProps) {
      return ("_d(" + staticProps + ",[" + (dynamicProps.slice(0, -1)) + "])")
    } else {
      return staticProps
    }
  }

  // #3895, #4268
  function transformSpecialNewlines(text) {
    return text
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
  }

  /*  */



  // these keywords should not appear inside expressions, but operators like
  // typeof, instanceof and in are allowed
  var prohibitedKeywordRE = new RegExp('\\b' + (
    'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
    'super,throw,while,yield,delete,export,import,return,switch,default,' +
    'extends,finally,continue,debugger,function,arguments'
  ).split(',').join('\\b|\\b') + '\\b');

  // these unary operators should not be used as property/method names
  var unaryOperatorsRE = new RegExp('\\b' + (
    'delete,typeof,void'
  ).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

  // strip strings in expressions
  var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

  // detect problematic expressions in a template 检测模板中有问题的表达式
  function detectErrors(ast, warn) {
    if (ast) { // ast，
      checkNode(ast, warn);
    }
  }

  function checkNode(node, warn) {
    if (node.type === 1) {
      for (var name in node.attrsMap) {
        if (dirRE.test(name)) {
          var value = node.attrsMap[name];
          if (value) {
            var range = node.rawAttrsMap[name];
            if (name === 'v-for') {
              checkFor(node, ("v-for=\"" + value + "\""), warn, range);
            } else if (name === 'v-slot' || name[0] === '#') {
              checkFunctionParameterExpression(value, (name + "=\"" + value + "\""), warn, range);
            } else if (onRE.test(name)) {
              checkEvent(value, (name + "=\"" + value + "\""), warn, range);
            } else {
              checkExpression(value, (name + "=\"" + value + "\""), warn, range);
            }
          }
        }
      }
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          checkNode(node.children[i], warn);
        }
      }
    } else if (node.type === 2) {
      checkExpression(node.expression, node.text, warn, node);
    }
  }

  function checkEvent(exp, text, warn, range) {
    var stripped = exp.replace(stripStringRE, '');
    var keywordMatch = stripped.match(unaryOperatorsRE);
    if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
      warn(
        "avoid using JavaScript unary operator as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim()),
        range
      );
    }
    checkExpression(exp, text, warn, range);
  }

  function checkFor(node, text, warn, range) {
    checkExpression(node.for || '', text, warn, range);
    checkIdentifier(node.alias, 'v-for alias', text, warn, range);
    checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
    checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
  }

  function checkIdentifier(
    ident,
    type,
    text,
    warn,
    range
  ) {
    if (typeof ident === 'string') {
      try {
        new Function(("var " + ident + "=_"));
      } catch (e) {
        warn(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())), range);
      }
    }
  }

  function checkExpression(exp, text, warn, range) {
    try {
      new Function(("return " + exp));
    } catch (e) {
      var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
      if (keywordMatch) {
        warn(
          "avoid using JavaScript keyword as property name: " +
          "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim()),
          range
        );
      } else {
        warn(
          "invalid expression: " + (e.message) + " in\n\n" +
          "    " + exp + "\n\n" +
          "  Raw expression: " + (text.trim()) + "\n",
          range
        );
      }
    }
  }

  function checkFunctionParameterExpression(exp, text, warn, range) {
    try {
      new Function(exp, '');
    } catch (e) {
      warn(
        "invalid function parameter expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n",
        range
      );
    }
  }

  /*  */

  var range = 2;

  function generateCodeFrame(
    source,
    start,
    end
  ) {
    if (start === void 0) start = 0;
    if (end === void 0) end = source.length;

    var lines = source.split(/\r?\n/);
    var count = 0;
    var res = [];
    for (var i = 0; i < lines.length; i++) {
      count += lines[i].length + 1;
      if (count >= start) {
        for (var j = i - range; j <= i + range || end > count; j++) {
          if (j < 0 || j >= lines.length) { continue }
          res.push(("" + (j + 1) + (repeat$1(" ", 3 - String(j + 1).length)) + "|  " + (lines[j])));
          var lineLength = lines[j].length;
          if (j === i) {
            // push underline
            var pad = start - (count - lineLength) + 1;
            var length = end > count ? lineLength - pad : end - start;
            res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
          } else if (j > i) {
            if (end > count) {
              var length$1 = Math.min(end - count, lineLength);
              res.push("   |  " + repeat$1("^", length$1));
            }
            count += lineLength + 1;
          }
        }
        break
      }
    }
    return res.join('\n')
  }

  function repeat$1(str, n) {
    var result = '';
    if (n > 0) {
      while (true) { // eslint-disable-line
        if (n & 1) { result += str; }
        n >>>= 1;
        if (n <= 0) { break }
        str += str;
      }
    }
    return result
  }

  /*  */


  // 将 code 转化为函数形式 - 用于将 render 字符串函数转换为函数形式
  function createFunction(code, errors) {
    try {
      return new Function(code)
    } catch (err) {
      errors.push({ err: err, code: code }); // 如果转化出错，则将其推入 errors 集合中
      return noop
    }
  }

  /** 主要作用:
   *  1. 缓存编译结果，通过 createCompileToFunctionFn 函数内声明的 cache 常量实现。
   *  2. 调用 compile 函数将模板字符串转成渲染函数字符串
   *  3. 调用 createFunction 函数将渲染函数字符串转成真正的渲染函数
   *  4. 打印编译错误，包括：模板字符串 -> 渲染函数字符串 以及 渲染函数字符串 -> 渲染函数 这两个阶段的错误
   */
  function createCompileToFunctionFn(compile) {
    var cache = Object.create(null); // 缓存

    // 实现编译，将字符串 template 模板转化为 render 函数和 ast 分析
    return function compileToFunctions(
      template, // 模板字符串
      options, // 配置参数
      vm // 实例
    ) {
      options = extend({}, options); // 合并选项
      var warn$$1 = options.warn || warn; // 发出警告方法
      delete options.warn; // 删除 options 中的警告方法

      /* istanbul ignore if */
      // 检测可能的CSP限制 -- 内容安全策略 (CSP)
      {
        // detect possible CSP restriction 检测可能的CSP限制 -- 内容安全策略 (CSP)
        try {
          new Function('return 1'); // 检测是否能够使用 Function 创建函数
        } catch (e) {
          if (e.toString().match(/unsafe-eval|CSP/)) {
            /**
             * '看起来你是在' +中使用Vue.js的独立构建
             * '带有禁止不安全eval的内容安全策略的环境。' +
             * '模板编译器不能在这种环境下工作。考虑' +
             * 放松政策，允许不安全eval或预编译你的' +
             * “模板到渲染函数。”
             */
            warn$$1(
              'It seems you are using the standalone build of Vue.js in an ' +
              'environment with Content Security Policy that prohibits unsafe-eval. ' +
              'The template compiler cannot work in this environment. Consider ' +
              'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
              'templates into render functions.'
            );
          }
        }
      }

      // check cache 检查缓存
      var key = options.delimiters // 是否改变了纯文本插入分隔符。
        ? String(options.delimiters) + template
        : template;
      if (cache[key]) { // 是否已经换成过了
        return cache[key] // 如果已有缓存，则直接将其返回
      }

      // compile 使用 compile 进行编译 -- 使用 createCompilerCreator 方法返回的 createCompiler 方法内定义的 compile 编译器
      var compiled = compile(template, options);

      // check compilation errors/tips 检查编译 错误/提示
      {
        if (compiled.errors && compiled.errors.length) { // 是否存在错误
          if (options.outputSourceRange) { // 是否将错误位置报告出来
            compiled.errors.forEach(function (e) {
              warn$$1( // 
                "Error compiling template:\n\n" + (e.msg) + "\n\n" +
                generateCodeFrame(template, e.start, e.end),
                vm
              );
            });
          } else {
            warn$$1(
              "Error compiling template:\n\n" + template + "\n\n" +
              compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
              vm
            );
          }
        }
        if (compiled.tips && compiled.tips.length) { // 是否存在提示信息，并且将提示信息打印出来
          if (options.outputSourceRange) {
            compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
          } else {
            compiled.tips.forEach(function (msg) { return tip(msg, vm); });
          }
        }
      }

      // turn code into functions 将代码转换为函数
      var res = {};
      var fnGenErrors = []; // 转化函数出错队列
      res.render = createFunction(compiled.render, fnGenErrors); // 转换成 render 函数形式
      res.staticRenderFns = compiled.staticRenderFns.map(function (code) { // 将 staticRenderFns 转化
        return createFunction(code, fnGenErrors)
      });

      // check function generation errors. 检查函数生成错误
      // this should only happen if there is a bug in the compiler itself. 只有在编译器本身存在错误时才应该这样做
      // mostly for codegen development use 主要用于代码生成器开发
      /* istanbul ignore if */
      {
        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) { // 检查是否存在函数生成错误
          warn$$1(
            "Failed to generate render function:\n\n" +
            fnGenErrors.map(function (ref) {
              var err = ref.err;
              var code = ref.code;

              return ((err.toString()) + " in\n\n" + code + "\n");
            }).join('\n'),
            vm
          );
        }
      }

      return (cache[key] = res) // 将其缓存并返回其编译结果
    }
  }

  /*  */
  // 根据基础编译器创建编译器
  function createCompilerCreator(baseCompile) {
    // 直接返回一个函数，函数科里化，预设一个 baseCompile 参数
    // 在下面的 createCompiler(baseOptions); 中，就会执行这个方法来生成编译器了
    return function createCompiler(baseOptions) {
      // 定义 compile 编译函数并返回
      /** 作用
       * 1. 生成最终编译器选项 finalOptions
       * 2. 对错误的收集
       * 3. 调用 baseCompile 编译模板，生成 ast，errors，render，tips,staticRenderFns 信息
       */
      function compile(
        template, // 模板字符串
        options // 配置项
      ) {
        var finalOptions = Object.create(baseOptions); // 生成一个继承 baseOptions 的对象，用于最终的配置项
        var errors = []; // 错误队列
        var tips = []; // 提示队列

        var warn = function (msg, range, tip) { // 添加错误 或 提示信息队列
          (tip ? tips : errors).push(msg); // 判断 tip 是否存在，用于判断是错误信息还是提示信息
        };

        if (options) {
          if (options.outputSourceRange) { // 这里是处理什么呢？ -- 应该是需要完善解析错误的位置信息
            // $flow-disable-line
            var leadingSpaceLength = template.match(/^\s*/)[0].length;

            warn = function (msg, range, tip) { // 添加错误位置记录
              var data = { msg: msg };
              if (range) { // 记录模板解析的位置(start 开始位置、end 结束位置)
                if (range.start != null) {
                  data.start = range.start + leadingSpaceLength;
                }
                if (range.end != null) {
                  data.end = range.end + leadingSpaceLength;
                }
              }
              (tip ? tips : errors).push(data);
            };
          }
          // merge custom modules 合并定制模块 -- 应该是依据不同平台合并不同编译选项
          if (options.modules) {
            finalOptions.modules =
              (baseOptions.modules || []).concat(options.modules);
          }
          // merge custom directives 合并定制指令 -- 应该是依据不同平台合并不同编译选项
          if (options.directives) {
            finalOptions.directives = extend(
              Object.create(baseOptions.directives || null),
              options.directives
            );
          }
          // copy other options 复制其他选项
          for (var key in options) {
            if (key !== 'modules' && key !== 'directives') {
              finalOptions[key] = options[key]; // 将 options 其他选项复制到 finalOptions 中
            }
          }
        }

        finalOptions.warn = warn; // 添加 warn 工具函数

        var compiled = baseCompile(template.trim(), finalOptions); // 通过 baseCompile 基础编译器来进行编译
        {
          detectErrors(compiled.ast, warn); // 检测 ast 中存在问题的表达式，并用 warn 推入 错误或提示 队列中
        }
        compiled.errors = errors; // 错误队列
        compiled.tips = tips; // 提示队列
        return compiled
      }

      return {
        compile: compile, // 这个是通过 baseCompile 封装，新增了一些功能(错误收集，最终编译器选项等)
        // 最终生成的编译器，对 compile 函数又进一步封装了一些功能，例如缓存编译结果，将 compile 生成的 render 渲染字符串转化为函数
        compileToFunctions: createCompileToFunctionFn(compile)
      }
    }
  }


  // `createCompilerCreator` allows creating compilers that use alternative “createCompilerCreator”允许创建使用 alternative 的编译器
  // parser/optimizer/codegen, e.g the SSR optimizing compiler. 解析器/优化器/代码根，例如SSR优化编译器
  // Here we just export a default compiler using the default parts. 这里我们只导出一个使用默认部分的默认编译器
  // 编译器创建的创造者
  var createCompiler = createCompilerCreator(
    // 这是函数一个基础编译器，把 html 变成 ast 模板对象，然后再转换成 虚拟DOM 渲染的函数参数形式
    // 返回一个对象：
    // { ast: ast // ast模板, 
    //   render: code.render // code 虚拟 DOM 需要渲染的参数函数,
    //   staticRenderFns: code.staticRenderFns // 空数组 - 表示 v-once 指令的，只渲染一次的 vdom
    // }
    function baseCompile(
      template, // 模板
      options // 解析参数
    ) {
      var ast = parse(template.trim(), options); // 生成 ast 模板 -- 这里暂时跳过一下，内容有点多
      if (options.optimize !== false) { // optimize 的主要作用是标记 static 静态节点
        optimize(ast, options); // 优化器：循环递归虚拟node，标记是不是静态节点 - 根据node.static或者 node.once 标记staticRoot的状态
      }
      var code = generate(ast, options); // 生成 render 函数字符串以及 staticRenderFns(表示 v-once 指令的，只渲染一次的 vdom)
      return {
        ast: ast, // 解析的 sat
        render: code.render, // 渲染函数字符串
        staticRenderFns: code.staticRenderFns // 只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。
      }
    });

  /** 
   * 通过对上面的简单分析，可以看出，通过 createCompiler(baseOptions) 传递不同平台(web 和 weex)的 baseOptions 用于依据不同的平台生成不同的编译器
   * 在 createCompiler 方法中，通过调用 createCompilerCreator 方法，传递给 createCompilerCreator 方法一个基础编译器(这个编译器主要负责对 template 模板进行编译成 ast, render字符串, staticRenderFns)
   * 在 createCompilerCreator 方法中，主要作用是通过闭包生成函数科里化，给 createCompiler 方法预设一个 baseCompile(基础编译器) 参数并执行 createCompiler 方法
   * 在 createCompiler 方法中，最终生成编译器，也主要是在 baseCompile 编译器的基础上再做一些额外处理，例如: 编译器选项的生成，对错误的收集等作用，最终生成一个 compile 方法，而最终还需要使用 createCompileToFunctionFn 方法对 compile 进一步增强
   * 在 createCompileToFunctionFn 方法中，通过传入的 compile 进一步增加其编译功能，主要附加：缓存编译结果，生成渲染函数 render，打印编译错误
   * 
   * 简单来讲：平台具有不同的 baseOptions，传递给基础 baseCompile 编译器，用于实现不同的编译功能 -> createCompiler 方法给 baseCompile 编译器新增额外功能，生成一个新的 compile -> createCompileToFunctionFn 方法给 compile 编译器继续新增额外的功能，这就是最终的编译器
   * 也就是通过一步步方法加强基础 baseCompile 编译器
  */

  var ref$1 = createCompiler(baseOptions); // 通过 baseOptions 生成编译器相关
  var compile = ref$1.compile;
  var compileToFunctions = ref$1.compileToFunctions; // 编译器 -- 将一个模板字符串编译成 render 函数。

  /*  */

  // check whether current browser encodes a char inside attribute values 检查当前浏览器是否在属性值中编码字符
  var div;
  function getShouldDecode(href) {
    div = div || document.createElement('div'); // 创建新元素
    div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>"; // 测试属性
    return div.innerHTML.indexOf('&#10;') > 0 // 判断测试属性是否编码字符(将传入的 \n 转化为 &#10;)
  }

  // #3663: IE encodes newlines inside attribute values while other browsers don't IE在属性值中编码换行，而其他浏览器不这样做
  var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
  // #6828: chrome encodes content in a[href] chrome 编码内容在一个 [href]
  var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

  /*  */

  var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML
  });

  // 在这里先缓存一下 $mount 方法
  var mount = Vue.prototype.$mount;
  Vue.prototype.$mount = function ( // 重新赋值 -- 依据平台来选择不同 渲染方法
    el, // 挂载点
    hydrating
  ) {
    el = el && query(el); // 找到挂载元素

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) { // 挂载点不能为 body 或 文档节点
      warn( // 此时发出警告
        "Do not mount Vue to <html> or <body> - mount to normal elements instead."
      );
      return this // 直接退出渲染
    }

    var options = this.$options; // 提取参数 options
    // resolve template/el and convert to render function 解析 template/el 并转换为渲染函数
    if (!options.render) { // 如果没有 render 配置项 -- 表示是通过模板形式的，需要编译器进行编译 -- 在用户通过 render 或者 通过 vue-loader 生成 render 时，此时是存在 render 选项的
      // 在完整构建版本中的浏览器内编译时可用
      var template = options.template; // 是否存在 template 模板
      if (template) { // 如果存在，则通过下列方法生成 render 
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            template = idToTemplate(template);
            /* istanbul ignore if */
            if (!template) {
              warn(
                ("Template element not found or is empty: " + (options.template)),
                this
              );
            }
          }
        } else if (template.nodeType) {
          template = template.innerHTML;
        } else {
          {
            warn('invalid template option:' + template, this);
          }
          return this
        }
      } else if (el) { // 如果不存在，只是存在 el
        template = getOuterHTML(el);
      }
      // 通过上述操作，应该获取到了 template 模板
      if (template) {
        /* istanbul ignore if */
        // 性能监控
        if (config.performance && mark) {
          mark('compile');
        }

        // 这下面就是另一个难点 -- 生成 render 方法 --暂时跳过部分
        // 总结一下：就是通过不同平台的配置项，利用 baseCompile 编译器将 template 进行编译成如下格式内容
        // { render: f render, // render 函数
        //   staticRenderFns: [ƒ anonymous( ),...] // 通过 v-once 只渲染元素和组件一次。
        // }
        var ref = compileToFunctions(template, { // 模板字符串
          outputSourceRange: "development" !== 'production',
          shouldDecodeNewlines: shouldDecodeNewlines, // IE在属性值中编码换行，而其他浏览器不这样做
          shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref, // chrome a[href] 中是否会编码换行
          delimiters: options.delimiters, // 改变纯文本插入分隔符。修改指令的书写风格，比如默认是{{mgs}}  delimiters: ['${', '}']之后变成这样 ${mgs}
          comments: options.comments // 当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。
        }, this);
        var render = ref.render; // render 渲染函数
        var staticRenderFns = ref.staticRenderFns; // 只渲染一次的节点
        options.render = render; // 添加到 options 上 -- 这样的话，同时也会添加到 vm.$options，因为在上面，options 引用的是 vm.$options
        options.staticRenderFns = staticRenderFns; // 添加到 options 上 -- 这样的话，同时也会添加到 vm.$options，因为在上面，options 引用的是 vm.$options

        /* istanbul ignore if */
        // 性能追踪结束
        if (config.performance && mark) {
          mark('compile end');
          measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
        }
      }
    }
    return mount.call(this, el, hydrating) // 这里应该是生成真实 dom，并且将其挂载到 el 上
  };

  /**
   * Get outerHTML of elements, taking care 小心获取元素的outerHTML
   * of SVG elements in IE as well. 也可以在IE中使用SVG元素
   * 作用：获取指定元素的全部子元素，用于做组件的模板
   */
  function getOuterHTML(el) {
    if (el.outerHTML) { // 如果存在 outerHTML 方法，则直接取 outerHTML 模板
      return el.outerHTML
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML // 否则通过将 el 挂载到新创建的元素，并通过取 innerHTML，变相实现 outerHTML 功能
    }
  }

  Vue.compile = compileToFunctions;

  return Vue;

}));
