/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-01-06 20:45:05
 * @LastEditTime: 2020-01-09 23:01:00
 */
import arr from "./var/arr.js";
import getProto from "./var/getProto.js";
import slice from "./var/slice.js";
import flat from "./var/flat.js";
import push from "./var/push.js";
import indexOf from "./var/indexOf.js";
import class2type from "./var/class2type.js";
import toString from "./var/toString.js";
import hasOwn from "./var/hasOwn.js";
import fnToString from "./var/fnToString.js";
import ObjectFunctionString from "./var/ObjectFunctionString.js";
import support from "./var/support.js";
import isWindow from "./var/isWindow.js";
import DOMEval from "./core/DOMEval.js";
import toType from "./core/toType.js";

// 使用自定义编译时，版本字符串可能会变大.
// eslint-disable-next-line max-len
var version = "@VERSION",
  rhtmlSuffix = /HTML$/i,
  // 定义 jQuery 的本地副本
  jQuery = function(selector, context) {
    // jQuery 对象实际上只是 init 构造函数 'enhanced'
    // 如果调用 jQuery，则需要 init（如果不包括，则允许抛出错误）
    return new jQuery.fn.init(selector, context);
  };

// jQuery.fn => 暴露jQuery.prototype, 就可以针对 jQuery 对象扩展方法
jQuery.fn = jQuery.prototype = {
  // 当前使用的 jQuery 版本
  jquery: version,

  // 修改了 prototype, 重置 construtor 属性
  constructor: jQuery,

  // jQuery 对象的默认长度为0(length: jQuery 对象中元素的个数。)
  length: 0,

  // toArray: 把jQuery集合中所有DOM元素恢复成一个数组。
  /*
		$('li').toArray(); ==> [<li id="foo">, <li id="bar">]
	*/
  toArray: function() {
    return slice.call(this);
  },

  // 取得其中一个匹配的元素。 num表示取得第几个匹配的元素。从0开始，返回的是DOM对象
  /*
		<img src="test1.jpg"/> <img src="test2.jpg"/>
		$("img").get(0); ==> [ <img src="test1.jpg"/> ]
	*/
  get: function(num) {
    // 当没有传递参数时, 或者传递为 null 时, 返回全部元素
    if (num == null) {
      return slice.call(this);
    }

    // 只返回集合中的一个元素 -- 传递了参数的情况下
    return num < 0 ? this[num + this.length] : this[num];
  },

  // 获取一个元素数组并将其推到堆栈上
  // (返回新的匹配元素集)
  pushStack: function(elems) {
    // 构建新的 jQuery 匹配元素集 -- this.constructor() 会调用 jQuery() 方法, 从而调用 jQuery.fn.init() 方法, 构建一个空元素的 jQuery 元素集
    // 在通过 jQuery.merge() 方法, 将参数 elems 元素或元素集添加到空元素的 jQuery 元素集上
    var ret = jQuery.merge(this.constructor(), elems);

    // 将旧对象添加到堆栈中（作为引用） -- 保持 jQuery 元素集链, 方便使用 end 变为前一次的状态
    ret.prevObject = this;

    // 返回新形成的元素集
    return ret;
  },

  // 对匹配集中的每个元素执行回调.
  each: function(callback) {
    // 这些方法会在其他地方添加
    return jQuery.each(this, callback);
  },

  // 将一组元素转换成其他数组（不论是否是元素数组）
  map: function(callback) {
    return this.pushStack(
      jQuery.map(this, function(elem, i) {
        return callback.call(elem, i, elem);
      })
    );
  },

  // 选取一个匹配的子集
  slice: function() {
    // slice.apply(this, arguments) => 利用 Array.prototype.slice 方法来装换为数组, 并且截取数组
    // this.pushStack() => 将截取后的数组转化为 jQuery 元素集
    return this.pushStack(slice.apply(this, arguments));
  },

  // 获取第一个元素
  first: function() {
    return this.eq(0);
  },

  // 获取最后个元素
  last: function() {
    return this.eq(-1);
  },

  // 获取奇数项
  even: function() {
    return this.pushStack(
      // jQuery.greq(): 使用过滤函数过滤数组元素。
      jQuery.grep(this, function(_elem, i) {
        return (i + 1) % 2;
      })
    );
  },

  // 获取奇数项
  odd: function() {
    return this.pushStack(
      jQuery.grep(this, function(_elem, i) {
        return i % 2;
      })
    );
  },

  // 获取当前链式操作中第 i 个jQuery对象，返回jQuery对象
  eq: function(i) {
    var len = this.length,
      j = +i + (i < 0 ? len : 0);
    return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
  },

  // 回到最近的一个"破坏性"操作之前
  end: function() {
    // 如果之前没有破坏性操作，则返回一个空集
    return this.prevObject || this.constructor();
  }
};

// 在 jQuer 函数上添加静态成员, 并且通过 jQuery.fn(引用的就是 jQuery.prototype ) 向 jQuery.prototype 添加方法
// jQuery.extend: 扩展jQuery对象本身。用来在jQuery命名空间上增加新函数。 -- 当为一个参数时, 扩展 jQuery 本身, 当为多个参数对象时, 用于将一个或多个对象的内容合并到目标对象(类似于混入)
// jQeury.fn.extend: 扩展 jQuery 元素集来提供新的方法（通常用来制作插件）
jQuery.extend = jQuery.fn.extend = function() {
  var options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // 处理深度复制的情况
  if (typeof target === "boolean") {
    deep = target;

    // 跳过布尔值和目标
    target = arguments[i] || {};
    i++;
  }

  // 当目标是字符串或其他内容时，跳过布尔值和 targetHandle 大小写（在deep copy中可能）
  if (typeof target !== "object" && typeof target !== "function") {
    target = {};
  }

  // 如果只传递了一个参数，则扩展 jQuery 本身
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // 仅处理非空/未定义的值
    if ((options = arguments[i]) != null) {
      // 扩展基对象
      for (name in options) {
        copy = options[name];

        // 防止 Object.prototype 污染
        // 防止永无止境的循环
        if (name === "__proto__" || target === copy) {
          continue;
        }

        // 如果合并纯对象或数组，则递归
        if (
          deep &&
          copy &&
          (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          // 目标是否存在该属性
          src = target[name];

          // 确保源值的类型正确
          if (copyIsArray && !Array.isArray(src)) {
            clone = [];
          } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
            clone = {};
          } else {
            clone = src;
          }
          copyIsArray = false;

          // 不要移动原始对象，克隆它们
          target[name] = jQuery.extend(deep, clone, copy);

          // 不要引入未定义的值
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // 返回修改后的对象
  return target;
};

// 添加 jQuery 静态成员
jQuery.extend({
  // 页面上 jQuery 的每个副本都是唯一的
  expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

  // 假设 jQuery 在没有 ready 模块的情况下已经就绪
  isReady: true,

  // 抛出错误方法
  error: function(msg) {
    throw new Error(msg);
  },

  noop: function() {},

  // 判断是否为全局对象(Object).
  isPlainObject: function(obj) {
    var proto, Ctor;

    // 检测明显的阴性
    // 使用 toString 而不是 jQuery.type 捕获宿主对象
    if (!obj || toString.call(obj) !== "[object Object]") {
      return false;
    }

    // 获取对象原型
    proto = getProto(obj);

    // 没有原型的对象（例如，`Object.create（null）`）是普通的
    if (!proto) {
      return true;
    }

    // 具有原型的对象是简单的，如果它们是由全局对象函数构造的
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return (
      typeof Ctor === "function" &&
      fnToString.call(Ctor) === ObjectFunctionString
    );
  },

  // 判断是否为空对象
  isEmptyObject: function(obj) {
    var name;

    for (name in obj) {
      return false;
    }
    return true;
  },

  // 在全局上下文中运行 script
  globalEval: function(code, options) {
    DOMEval(code, { nonce: options && options.nonce });
  },

  // 通用遍历方法，可用于遍历对象和数组。
  // 回调函数拥有两个参数：第一个为对象的成员或数组的索引，第二个为对应变量或内容。如果需要退出 each 循环可使回调函数返回 false，其它返回值将被忽略。
  each: function(obj, callback) {
    var length,
      i = 0;

    if (isArrayLike(obj)) {
      // 遍历数组
      length = obj.length;
      for (; i < length; i++) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          break;
        }
      }
    } else {
      for (i in obj) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          break;
        }
      }
    }

    return obj;
  },

  // 检索 DOM 节点数组的文本值
  text: function(elem) {
    var node,
      ret = "",
      i = 0,
      nodeType = elem.nodeType;

    if (!nodeType) {
      // If no nodeType, this is expected to be an array
      while ((node = elem[i++])) {
        // Do not traverse comment nodes
        ret += jQuery.text(node);
      }
    } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
      // Use textContent for elements
      // innerText usage removed for consistency of new lines (jQuery #11153)
      if (typeof elem.textContent === "string") {
        return elem.textContent;
      } else {
        // Traverse its children
        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
          ret += jQuery.text(elem);
        }
      }
    } else if (nodeType === 3 || nodeType === 4) {
      return elem.nodeValue;
    }

    // Do not include comment or processing instruction nodes

    return ret;
  },

  // results is for internal usage only
  makeArray: function(arr, results) {
    var ret = results || [];

    if (arr != null) {
      if (isArrayLike(Object(arr))) {
        jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
      } else {
        push.call(ret, arr);
      }
    }

    return ret;
  },

  inArray: function(elem, arr, i) {
    return arr == null ? -1 : indexOf.call(arr, elem, i);
  },

  isXMLDoc: function(elem) {
    var namespace = elem.namespaceURI,
      docElem = (elem.ownerDocument || elem).documentElement;

    // Assume HTML when documentElement doesn't yet exist, such as inside
    // document fragments.
    return !rhtmlSuffix.test(
      namespace || (docElem && docElem.nodeName) || "HTML"
    );
  },

  merge: function(first, second) {
    var len = +second.length,
      j = 0,
      i = first.length;

    for (; j < len; j++) {
      first[i++] = second[j];
    }

    first.length = i;

    return first;
  },

  grep: function(elems, callback, invert) {
    var callbackInverse,
      matches = [],
      i = 0,
      length = elems.length,
      callbackExpect = !invert;

    // Go through the array, only saving the items
    // that pass the validator function
    for (; i < length; i++) {
      callbackInverse = !callback(elems[i], i);
      if (callbackInverse !== callbackExpect) {
        matches.push(elems[i]);
      }
    }

    return matches;
  },

  // arg is for internal usage only
  map: function(elems, callback, arg) {
    var length,
      value,
      i = 0,
      ret = [];

    // Go through the array, translating each of the items to their new values
    if (isArrayLike(elems)) {
      length = elems.length;
      for (; i < length; i++) {
        value = callback(elems[i], i, arg);

        if (value != null) {
          ret.push(value);
        }
      }

      // Go through every key on the object,
    } else {
      for (i in elems) {
        value = callback(elems[i], i, arg);

        if (value != null) {
          ret.push(value);
        }
      }
    }

    // Flatten any nested arrays
    return flat(ret);
  },

  // A global GUID counter for objects
  guid: 1,

  // jQuery.support is not used in Core but other projects attach their
  // properties to it so it needs to exist.
  support: support
});

if (typeof Symbol === "function") {
  jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
}

// Populate the class2type map
jQuery.each(
  "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
    " "
  ),
  function(_i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  }
);

// 判断是否为数组或类数组
function isArrayLike(obj) {
  var length = !!obj && obj.length,
    type = toType(obj);

  if (typeof obj === "function" || isWindow(obj)) {
    return false;
  }

  return (
    type === "array" ||
    length === 0 ||
    (typeof length === "number" && length > 0 && length - 1 in obj)
  );
}

export default jQuery;
