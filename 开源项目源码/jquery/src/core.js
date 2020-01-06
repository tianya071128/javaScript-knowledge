/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-01-06 20:45:05
 * @LastEditTime: 2020-01-06 22:46:01
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

  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object" && typeof target !== "function") {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        copy = options[name];

        // Prevent Object.prototype pollution
        // Prevent never-ending loop
        if (name === "__proto__" || target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (
          deep &&
          copy &&
          (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          src = target[name];

          // Ensure proper type for the source value
          if (copyIsArray && !Array.isArray(src)) {
            clone = [];
          } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
            clone = {};
          } else {
            clone = src;
          }
          copyIsArray = false;

          // Never move original objects, clone them
          target[name] = jQuery.extend(deep, clone, copy);

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

jQuery.extend({
  // Unique for each copy of jQuery on the page
  expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

  // Assume jQuery is ready without the ready module
  isReady: true,

  error: function(msg) {
    throw new Error(msg);
  },

  noop: function() {},

  isPlainObject: function(obj) {
    var proto, Ctor;

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if (!obj || toString.call(obj) !== "[object Object]") {
      return false;
    }

    proto = getProto(obj);

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if (!proto) {
      return true;
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return (
      typeof Ctor === "function" &&
      fnToString.call(Ctor) === ObjectFunctionString
    );
  },

  isEmptyObject: function(obj) {
    var name;

    for (name in obj) {
      return false;
    }
    return true;
  },

  // Evaluates a script in a global context
  globalEval: function(code, options) {
    DOMEval(code, { nonce: options && options.nonce });
  },

  each: function(obj, callback) {
    var length,
      i = 0;

    if (isArrayLike(obj)) {
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

  // Retrieve the text value of an array of DOM nodes
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
