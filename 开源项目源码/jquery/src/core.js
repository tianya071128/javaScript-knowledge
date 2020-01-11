/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-01-06 20:45:05
 * @LastEditTime : 2020-01-11 14:34:11
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
  jQuery = function (selector, context) {
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
  toArray: function () {
    return slice.call(this);
  },

  // 取得其中一个匹配的元素。 num表示取得第几个匹配的元素。从0开始，返回的是DOM对象
  /*
		<img src="test1.jpg"/> <img src="test2.jpg"/>
		$("img").get(0); ==> [ <img src="test1.jpg"/> ]
	*/
  get: function (num) {
    // 当没有传递参数时, 或者传递为 null 时, 返回全部元素
    if (num == null) {
      return slice.call(this);
    }

    // 只返回集合中的一个元素 -- 传递了参数的情况下
    return num < 0 ? this[num + this.length] : this[num];
  },

  // 获取一个元素数组并将其推到堆栈上
  // (返回新的匹配元素集)
  pushStack: function (elems) {
    // 构建新的 jQuery 匹配元素集 -- this.constructor() 会调用 jQuery() 方法, 从而调用 jQuery.fn.init() 方法, 构建一个空元素的 jQuery 元素集
    // 在通过 jQuery.merge() 方法, 将参数 elems 元素或元素集添加到空元素的 jQuery 元素集上
    var ret = jQuery.merge(this.constructor(), elems);

    // 将旧对象添加到堆栈中（作为引用） -- 保持 jQuery 元素集链, 方便使用 end 变为前一次的状态
    ret.prevObject = this;

    // 返回新形成的元素集
    return ret;
  },

  // 对匹配集中的每个元素执行回调.
  each: function (callback) {
    // 这些方法会在其他地方添加
    return jQuery.each(this, callback);
  },

  // 将一组元素转换成其他数组（不论是否是元素数组）
  map: function (callback) {
    return this.pushStack(
      jQuery.map(this, function (elem, i) {
        return callback.call(elem, i, elem);
      })
    );
  },

  // 选取一个匹配的子集
  slice: function () {
    // slice.apply(this, arguments) => 利用 Array.prototype.slice 方法来装换为数组, 并且截取数组
    // this.pushStack() => 将截取后的数组转化为 jQuery 元素集
    return this.pushStack(slice.apply(this, arguments));
  },

  // 获取第一个元素
  first: function () {
    return this.eq(0);
  },

  // 获取最后个元素
  last: function () {
    return this.eq(-1);
  },

  // 获取奇数项
  even: function () {
    return this.pushStack(
      // jQuery.greq(): 使用过滤函数过滤数组元素。
      jQuery.grep(this, function (_elem, i) {
        return (i + 1) % 2;
      })
    );
  },

  // 获取奇数项
  odd: function () {
    return this.pushStack(
      jQuery.grep(this, function (_elem, i) {
        return i % 2;
      })
    );
  },

  // 获取当前链式操作中第 i 个jQuery对象，返回jQuery对象
  eq: function (i) {
    var len = this.length,
      j = +i + (i < 0 ? len : 0);
    return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
  },

  // 回到最近的一个"破坏性"操作之前
  end: function () {
    // 如果之前没有破坏性操作，则返回一个空集
    return this.prevObject || this.constructor();
  }
};

// 在 jQuer 函数上添加静态成员, 并且通过 jQuery.fn(引用的就是 jQuery.prototype ) 向 jQuery.prototype 添加方法
// jQuery.extend: 扩展jQuery对象本身。用来在jQuery命名空间上增加新函数。 -- 当为一个参数时, 扩展 jQuery 本身, 当为多个参数对象时, 用于将一个或多个对象的内容合并到目标对象(类似于混入)
// jQeury.fn.extend: 扩展 jQuery 元素集来提供新的方法（通常用来制作插件）
jQuery.extend = jQuery.fn.extend = function () {
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
  error: function (msg) {
    throw new Error(msg);
  },

  noop: function () { },

  // 判断是否为全局对象(Object).
  isPlainObject: function (obj) {
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
  isEmptyObject: function (obj) {
    var name;

    for (name in obj) {
      return false;
    }
    return true;
  },

  // 在全局上下文中运行 script
  globalEval: function (code, options) {
    DOMEval(code, { nonce: options && options.nonce });
  },

  // 通用遍历方法，可用于遍历对象和数组。
  // 回调函数拥有两个参数：第一个为对象的成员或数组的索引，第二个为对应变量或内容。如果需要退出 each 循环可使回调函数返回 false，其它返回值将被忽略。
  each: function (obj, callback) {
    var length,
      i = 0;
    // 判断是否为数组或类数组
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
  text: function (elem) {
    var node,
      ret = "",
      i = 0,
      nodeType = elem.nodeType;

    if (!nodeType) {
      // 如果没有 nodeType，则这应该是一个数组
      while ((node = elem[i++])) {
        // 不遍历注释节点
        ret += jQuery.text(node);
      }
    } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
      // nodeType: 1(一个 元素 节点) | 9(一个 Document 节点。) | 11(一个 DocumentFragment 节点)
      // 对元素使用textContent
      // 为保持新行的一致性，删除了innerText用法（jQuery#11153）
      if (typeof elem.textContent === "string") {
        return elem.textContent;
      } else {
        // 遍历它的子对象 -- 有意思的递归, 递归有多种实现方式, 不止于 while 和 函数
        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
          ret += jQuery.text(elem);
        }
      }
    } else if (nodeType === 3 || nodeType === 4) {
      // nodeType: 3(Element 或者 Attr 中实际的  文字) | 4(一个 CDATASection，例如 <!CDATA[[ … ]]>。)
      return elem.nodeValue;
    }

    // 不包括注释或处理指令节点

    return ret;
  },

  // results 仅供内部使用
  // 将一个类似数组的对象转换为真正的数组对象。
  makeArray: function (arr, results) {
    // 当只传递一个参数 arr 时, 此时为转化
    // 当传递二个参数 arr results 时, 将 arr 添加进 results
    var ret = results || [];

    if (arr != null) {
      // Object() 可用于将基本数据类型转化为对象, 复杂数据类型直接返回
      if (isArrayLike(Object(arr))) {
        // 将 arr 合并到 ret 中
        jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
      } else {
        // 不是类数组的话, 就直接将其添加到 ret 上
        push.call(ret, arr);
      }
    }

    return ret;
  },

  // 在数组中查找指定值并返回它的索引值（如果没有找到，则返回-1）
  inArray: function (elem, arr, i) {
    return arr == null ? -1 : indexOf.call(arr, elem, i);
  },

  // 判断一个DOM节点是否位于XML文档中，或者其本身就是XML文档
  isXMLDoc: function (elem) {
    var namespace = elem.namespaceURI,
      docElem = (elem.ownerDocument || elem).documentElement;

    // 当文档元素不存在时，假设HTML，例如内部
    // 文档片段.
    return !rhtmlSuffix.test(
      namespace || (docElem && docElem.nodeName) || "HTML"
    );
  },

  // 合并两个数组内容到第一个数组
  merge: function (first, second) {
    var len = +second.length,
      j = 0,
      i = first.length;

    for (; j < len; j++) {
      first[i++] = second[j];
    }

    // 因为有些类数组的 length 可能不是自动随着 first 数组变化, 所以此时可以手动调整
    first.length = i;

    return first;
  },

  // 过滤并返回满足指定函数的数组元素
  grep: function (elems, callback, invert) {
    var callbackInverse,
      matches = [],
      i = 0,
      length = elems.length,
      callbackExpect = !invert;

    // 遍历数组，只保存项目
    // 通过验证函数的
    for (; i < length; i++) {
      callbackInverse = !callback(elems[i], i);
      if (callbackInverse !== callbackExpect) {
        matches.push(elems[i]);
      }
    }

    return matches;
  },

  // arg 仅供内部使用
  // 指定函数处理数组中的每个元素(或对象的每个属性)，并将处理结果封装为新的数组返回
  map: function (elems, callback, arg) {
    var length,
      value,
      i = 0,
      ret = [];

    // 遍历数组，将每个项转换为它们的新值
    if (isArrayLike(elems)) {
      length = elems.length;
      for (; i < length; i++) {
        value = callback(elems[i], i, arg);

        if (value != null) {
          ret.push(value);
        }
      }

      // 遍历 Object 上每个 key,
    } else {
      for (i in elems) {
        value = callback(elems[i], i, arg);

        if (value != null) {
          ret.push(value);
        }
      }
    }

    // 展平任何嵌套数组
    return flat(ret);
  },

  // 对象的全局 GUID 计数器
  guid: 1,

  // 核心中没有使用 jQuery.support，但其他项目附加了
  // 属性，因此它需要存在。.
  support: support
});

if (typeof Symbol === "function") {
  // jQuery.fn 默认采用数组的 Symbol.iterator 
  jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
}

// 填充 class2type 映射
jQuery.each(
  "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
    " "
  ),
  function (_i, name) {
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
