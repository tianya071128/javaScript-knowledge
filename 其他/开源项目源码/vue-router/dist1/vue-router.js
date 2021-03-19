/**
 * 我们要明白 vue-router 的几个关键点, 在这里尝试使用文字来记录思路, 具体需要查看源码信息
 * 1. 用户注册路由信息:
 *    我们在初始化 new VueRouter 实例时, 我们在内部就会对路由注册的信息进行操作, 具体而言, 我们会将其注册信息解析成 
 *    pathList(路由集合), pathMap(路径与路由信息集合), nameMap(name 与路由信息结合) 这样的数据结构, 路由信息会根据用户注册的信息来统一规范化格式
 *    例如: 
 *    { 
 *      path: normalizedPath, // 路径
 *      regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
 *      components: route.components || { default: route.component }, // path 对应的组件, 最终会统一为 { xx: xx, xx: xx } -- 会兼容其命名视图
 *      alias: route.alias // 是否存在别名
 *        ? typeof route.alias === 'string' // 如果存在别名并且为 string 类型
 *          ? [route.alias] // 组装成数组
 *          : route.alias // 此时应该为数组, 所以直接使用
 *        : [], // 不存在别名 - 返回 []
 *      instances: {},
 *      enteredCbs: {},
 *      name: name, // 命名路由的 name
 *      parent: parent, // 父路由
 *      matchAs: matchAs, // 别名对应的原始路径 - 用于当为别名路径时查找到正确的路径
 *      redirect: route.redirect, // 重定向路径
 *      beforeEnter: route.beforeEnter, // 路由独享的守卫
 *      meta: route.meta || {}, // 路由元信息
 *      props: // 路由组件通过 props 形式传参
 *        route.props == null // 没有注册 props
 *          ? {} // 返回 {}
 *          : route.components // 如果注册了命名视图的话
 *            ? route.props // 直接使用, 需要跟命名视图注册的组件对应
 *            : { default: route.props } // 封装一下 
 *    }
 *    在内部会通过闭包来引用这些数据, 返回一些公共 api 可以进行操作, 例如动态添加路由, 根据匹配信息来匹配对应路由信息
 * 
 * 2. 路由器初始化
 *    在存在组件配置了这个路由器时, 我们才会去进行一些初始化, 例如渲染当前路由, 侦听路由变化等操作, 在这里初始化是因为, 如果还没有组件配置这个路由器的话, 那我们这个路由器就相当于停用状态
 *    而在 install 注册插件的时候, 我们就去全局混入和全局注册一些组件等信息, 在全局混入中混入 beforeCreate 生命周期, 我们在这里会在根组件配置路由器 router(即 VueRouter 实例) 时候, 去调用 VueRouter.init 初始化
 *    初始化时, 首先通过 transitionTo 方法来渲染当前 url 对应的路由, 因为在这里我们还没有渲染初始 url, 所以在这里渲染一下, 渲染完成后我们会去侦听 url 变化, 这样就可以响应 url 变化来渲染不同的路由组件
 * 3. transitionTo: 这个方法非常关键, 主要进行两步: this.router.match 来匹配路由信息并创建路由对象, this.confirmTransition 来渲染组件, 执行守卫钩子等
 *    3.1 this.router.match: 根据匹配信息来匹配用户注册的路由信息并且创建路由对象
 *        我们通过操作 pathList, pathMap, nameMap 等数据, 来匹配传入的 location(路径信息), 找出对应的注册路由信息, 并根据这个路由信息来创建一个路由对象
 *        路由对象结构为: 
 *        var route = {
 *          name: location.name || (record && record.name), // name 值
 *          meta: (record && record.meta) || {}, // 元信息
 *          path: location.path || '/', // 路径
 *          hash: location.hash || '', // hash 值
 *          query: query, // 查询参数
 *          params: location.params || {}, // params 值
 *          fullPath: getFullPath(location, stringifyQuery), // 根据 path, hash, query 来拼接成最终路径
 *          matched: record ? formatMatch(record) : [] // 一个数组，包含当前路由的所有嵌套路径片段的路由记录 。
 *        };
 */

/*!
  * vue-router v3.5.1
  * (c) 2021 Evan You
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VueRouter = factory());
}(this, (function () { 'use strict';

  /*  */

  // 如果 condition 条件不满足, 则直接抛出错误, 已退出调用栈
  function assert (condition, message) {
    if (!condition) {
      throw new Error(("[vue-router] " + message))
    }
  }

  // 如果不满足 condition 条件, 那么就发出一个警告
  function warn (condition, message) {
    if ( !condition) {
      typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
    }
  }

  function extend (a, b) {
    for (var key in b) {
      a[key] = b[key];
    }
    return a
  }

  /*  */

  var encodeReserveRE = /[!'()*]/g;
  var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
  var commaRE = /%2C/g;

  // fixed encodeURIComponent which is more conformant to RFC3986:
  // - escapes [!'()*]
  // - preserve commas
  var encode = function (str) { return encodeURIComponent(str)
      .replace(encodeReserveRE, encodeReserveReplacer)
      .replace(commaRE, ','); };

  // 对制定字符串解码
  function decode (str) {
    try {
      return decodeURIComponent(str) // 通过原生方法 decodeURIComponent 解码
    } catch (err) {
      { // 编码错误
        warn(false, ("Error decoding \"" + str + "\". Leaving it intact."));
      }
    }
    return str
  }

  // 解析查询参数
  function resolveQuery (
    query, // 在这里表示的从 路径path 中解析出来的查询参数
    extraQuery, // 额外的查询参数
    _parseQuery // 用户自定义序列化查询参数方法
  ) {
    if ( extraQuery === void 0 ) extraQuery = {}; // 如果没有额外的查询参数, 则置为 {}

    var parse = _parseQuery || parseQuery; // 如果没有自定义序列化查询参数方法, 那么就使用内部序列化
    var parsedQuery;
    try {
      parsedQuery = parse(query || ''); // 通过解析器解析 query 序列化
    } catch (e) {
       warn(false, e.message); // 如果解析失败, 那么就警告一下
      parsedQuery = {}; // 非必要错误, 没有必要停止调用栈, 重置一下
    }
    for (var key in extraQuery) { // extraQuery: 这是已经解析过的参数, 就没有必要重复序列化
      var value = extraQuery[key];
      // 在这里, 如果 extraQuery 与 parsedQuery 的 key 重复了的话, 竟然是以 extraQuery 为准
      parsedQuery[key] = Array.isArray(value) // 如果 value 是一个数组的话
        ? value.map(castQueryParamValue)
        : castQueryParamValue(value);
    }
    return parsedQuery
  }

  // 返回指定 value 解析后值
  var castQueryParamValue = function (value) { return (value == null || typeof value === 'object' ? value : String(value)); };

  // 默认序列化查询参数方法
  function parseQuery (query) {
    var res = {};

    query = query.trim().replace(/^(\?|#|&)/, ''); // 去除开头的 ? # & 的字符

    if (!query) { // 如果不存在查询字符串
      return res // 那么直接返回
    }

    query.split('&').forEach(function (param) { // 通过 & 分隔字符串
      var parts = param.replace(/\+/g, ' ').split('='); // 以 = 分隔字符串
      var key = decode(parts.shift()); // 对 query 的 key 进行解码操作
      var val = parts.length > 0 ? decode(parts.join('=')) : null; // 如果 key 对应 value 存在, 则进行解码, 否则为 null

      /**
       * 由下列策略可知, 对重复定义的查询参数并不会覆盖, 而是尽可能转成一个数组, 当只有一个的时候, 就以字符串形式
       */
      if (res[key] === undefined) { // 如果没有重复定义
        res[key] = val; // 直接定义
      } else if (Array.isArray(res[key])) { // 如果已经存在, 并且值为数组
        res[key].push(val); // 则将其推入数组
      } else { // 如果已经存在, 但不是一个数组
        res[key] = [res[key], val]; // 那么就组装成一个数组
      }
    });

    return res // 返回
  }

  // 默认序列化 query 方法
  function stringifyQuery (obj) {
    var res = obj
      ? Object.keys(obj)
        .map(function (key) {
          var val = obj[key];

          if (val === undefined) {
            return ''
          }

          if (val === null) {
            return encode(key)
          }

          if (Array.isArray(val)) {
            var result = [];
            val.forEach(function (val2) {
              if (val2 === undefined) {
                return
              }
              if (val2 === null) {
                result.push(encode(key));
              } else {
                result.push(encode(key) + '=' + encode(val2));
              }
            });
            return result.join('&')
          }

          return encode(key) + '=' + encode(val)
        })
        .filter(function (x) { return x.length > 0; })
        .join('&')
      : null;
    return res ? ("?" + res) : ''
  }

  /*  */

  var trailingSlashRE = /\/?$/;

  // 最终创建一个路由对象的地方
  function createRoute (
    record, // 路由信息
    location, // 路径信息 
    redirectedFrom, // 重定向信息
    router // VueRouter 实例
  ) {
    var stringifyQuery = router && router.options.stringifyQuery; // 自定义序列化参数方法 - 将对象转化为字符串

    var query = location.query || {}; // 查询参数
    try {
      query = clone(query); // 克隆 query - 应该是为了不影响原始值
    } catch (e) {}

    // 路由对象
    var route = {
      name: location.name || (record && record.name), // name 值
      meta: (record && record.meta) || {}, // 元信息
      path: location.path || '/', // 路径
      hash: location.hash || '', // hash 值
      query: query, // 查询参数
      params: location.params || {}, // params 值
      fullPath: getFullPath(location, stringifyQuery), // 根据 path, hash, query 来拼接成最终路径
      matched: record ? formatMatch(record) : [] // 一个数组，包含当前路由的所有嵌套路径片段的路由记录 。
    };
    if (redirectedFrom) { // 如果存在重定向信息
      route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery); // 还需要额外添加一个 redirectedFrom 属性 -- 如果存在重定向，即为重定向来源的路由的名字
    }
    return Object.freeze(route) // 将其冻结并返回
  }

  // 克隆一个值出来
  function clone (value) {
    if (Array.isArray(value)) { // 是数组
      return value.map(clone) // 递归数组
    } else if (value && typeof value === 'object') { // 对象形式
      var res = {};
      for (var key in value) {
        res[key] = clone(value[key]); // 递归对象
      }
      return res
    } else { // 其他值
      return value // 返回原始值
    }
  }

  // the starting route that represents the initial state 表示初始状态的起始路由
  var START = createRoute(null, {
    path: '/'
  });

  // 包含当前路由的所有嵌套路径片段的路由记录 。
  function formatMatch (record) {
    var res = [];
    while (record) { // 递归
      res.unshift(record); // 推入到 res 集合中
      record = record.parent; // 查找父路由
    }
    return res
  }

  // 根据 path, hash, query 来拼接成最终路径
  function getFullPath (
    ref, // 路径信息
    _stringifyQuery // 序列化方法
  ) {
    var path = ref.path; // 提取出 path 信息
    var query = ref.query; if ( query === void 0 ) query = {}; // query 信息
    var hash = ref.hash; if ( hash === void 0 ) hash = ''; // hash 信息

    var stringify = _stringifyQuery || stringifyQuery; // 如果没有自定义序列化 query 方法, 则使用默认方法
    return (path || '/') + stringify(query) + hash // 拼接路径
  }

  // 比较 a 和 b 是否相同
  function isSameRoute (a, b, onlyPath) {
    if (b === START) { // 如果 b 为空路由对象
      return a === b // 那么两个直接比较
    } else if (!b) { // 如果 b 不存在
      return false // 直接返回 false
    } else if (a.path && b.path) { // 如果 a 和 b 的 path 都存在
      // a 和 b 的 path 相同 && hash 相同 && query 相同
      return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') && (onlyPath ||
        a.hash === b.hash &&
        isObjectEqual(a.query, b.query))
    } else if (a.name && b.name) { // 如果 a 和 b 的 name 都存在
      // a 和 b 的 name 相同 && hash 相同 && query 相同 && params 相同
      return (
        a.name === b.name &&
        (onlyPath || (
          a.hash === b.hash &&
        isObjectEqual(a.query, b.query) &&
        isObjectEqual(a.params, b.params))
        )
      )
    } else {
      return false
    }
  }

  // 比较 a 和 b 是否相同
  function isObjectEqual (a, b) {
    if ( a === void 0 ) a = {}; // 重置 a
    if ( b === void 0 ) b = {}; // 重置 b

    // handle null value #1566 处理空值
    if (!a || !b) { return a === b } // 如果  a 和 b 存在空值, 直接相比
    var aKeys = Object.keys(a).sort(); // 属性进行升序
    var bKeys = Object.keys(b).sort(); // 属性进行升序
    if (aKeys.length !== bKeys.length) { // 如果属性数量不一致
      return false // 那么表示不相等
    }
    return aKeys.every(function (key, i) { // 判断 a 和 b 的是否相等 - 遍历比较 a 和 b 的属性值
      var aVal = a[key];
      var bKey = bKeys[i];
      if (bKey !== key) { return false } // 如果 bKey 不跟 aKey 相同 - 那么直接表示不相同, 返回 false, 退出循环
      var bVal = b[key];
      // query values can be null and undefined 查询值可以为null和未定义
      if (aVal == null || bVal == null) { return aVal === bVal } // 如果 aVal 或 bVal 存在空值, 那么直接比较及可靠, 无需递归比较
      // check nested equality 检查嵌套平等
      if (typeof aVal === 'object' && typeof bVal === 'object') { // 如果都为 object, 那么就需要递归比较
        return isObjectEqual(aVal, bVal)
      }
      return String(aVal) === String(bVal) // 其他情况, 统一进行 String 转化后比较
    })
  }

  function isIncludedRoute (current, target) {
    return (
      current.path.replace(trailingSlashRE, '/').indexOf(
        target.path.replace(trailingSlashRE, '/')
      ) === 0 &&
      (!target.hash || current.hash === target.hash) &&
      queryIncludes(current.query, target.query)
    )
  }

  function queryIncludes (current, target) {
    for (var key in target) {
      if (!(key in current)) {
        return false
      }
    }
    return true
  }

  function handleRouteEntered (route) {
    for (var i = 0; i < route.matched.length; i++) {
      var record = route.matched[i];
      for (var name in record.instances) {
        var instance = record.instances[name];
        var cbs = record.enteredCbs[name];
        if (!instance || !cbs) { continue }
        delete record.enteredCbs[name];
        for (var i$1 = 0; i$1 < cbs.length; i$1++) {
          if (!instance._isBeingDestroyed) { cbs[i$1](instance); }
        }
      }
    }
  }

  var View = {
    name: 'RouterView',
    functional: true,
    props: {
      name: {
        type: String,
        default: 'default'
      }
    },
    render: function render (_, ref) {
      var props = ref.props;
      var children = ref.children;
      var parent = ref.parent;
      var data = ref.data;

      // used by devtools to display a router-view badge
      data.routerView = true;

      // directly use parent context's createElement() function
      // so that components rendered by router-view can resolve named slots
      var h = parent.$createElement;
      var name = props.name;
      var route = parent.$route;
      var cache = parent._routerViewCache || (parent._routerViewCache = {});

      // determine current view depth, also check to see if the tree
      // has been toggled inactive but kept-alive.
      var depth = 0;
      var inactive = false;
      while (parent && parent._routerRoot !== parent) {
        var vnodeData = parent.$vnode ? parent.$vnode.data : {};
        if (vnodeData.routerView) {
          depth++;
        }
        if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
          inactive = true;
        }
        parent = parent.$parent;
      }
      data.routerViewDepth = depth;

      // render previous view if the tree is inactive and kept-alive
      if (inactive) {
        var cachedData = cache[name];
        var cachedComponent = cachedData && cachedData.component;
        if (cachedComponent) {
          // #2301
          // pass props
          if (cachedData.configProps) {
            fillPropsinData(cachedComponent, data, cachedData.route, cachedData.configProps);
          }
          return h(cachedComponent, data, children)
        } else {
          // render previous empty view
          return h()
        }
      }

      var matched = route.matched[depth];
      var component = matched && matched.components[name];

      // render empty node if no matched route or no config component
      if (!matched || !component) {
        cache[name] = null;
        return h()
      }

      // cache component
      cache[name] = { component: component };

      // attach instance registration hook
      // this will be called in the instance's injected lifecycle hooks
      data.registerRouteInstance = function (vm, val) {
        // val could be undefined for unregistration
        var current = matched.instances[name];
        if (
          (val && current !== vm) ||
          (!val && current === vm)
        ) {
          matched.instances[name] = val;
        }
      }

      // also register instance in prepatch hook
      // in case the same component instance is reused across different routes
      ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
        matched.instances[name] = vnode.componentInstance;
      };

      // register instance in init hook
      // in case kept-alive component be actived when routes changed
      data.hook.init = function (vnode) {
        if (vnode.data.keepAlive &&
          vnode.componentInstance &&
          vnode.componentInstance !== matched.instances[name]
        ) {
          matched.instances[name] = vnode.componentInstance;
        }

        // if the route transition has already been confirmed then we weren't
        // able to call the cbs during confirmation as the component was not
        // registered yet, so we call it here.
        handleRouteEntered(route);
      };

      var configProps = matched.props && matched.props[name];
      // save route and configProps in cache
      if (configProps) {
        extend(cache[name], {
          route: route,
          configProps: configProps
        });
        fillPropsinData(component, data, route, configProps);
      }

      return h(component, data, children)
    }
  };

  function fillPropsinData (component, data, route, configProps) {
    // resolve props
    var propsToPass = data.props = resolveProps(route, configProps);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }
  }

  function resolveProps (route, config) {
    switch (typeof config) {
      case 'undefined':
        return
      case 'object':
        return config
      case 'function':
        return config(route)
      case 'boolean':
        return config ? route.params : undefined
      default:
        {
          warn(
            false,
            "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
            "expecting an object, function or boolean."
          );
        }
    }
  }

  /*  */

  // 解析相对路径 - 例如当前路径为 /a/b/c - 用户需要跳转 ../../d/c 这样的情况下, 就需要解析成最终能使用的路径 /a/d/c
  function resolvePath (
    relative, // 相对路径
    base, // 基础路径
    append // 是否追加路由
  ) {
    var firstChar = relative.charAt(0);
    if (firstChar === '/') { // 如果需要解析的路径是以 / 开头的话, 表示是一个绝对路径
      return relative // 此时直接返回
    }

    if (firstChar === '?' || firstChar === '#') { // 如果是以 ? 或 #, 表示是一个 hash 或 查询参数
      return base + relative // 此时直接在 base 基础路径上追加上去
    }

    var stack = base.split('/');

    // remove trailing segment if: 删除后段 如果:
    // - not appending 没有附加
    // - appending to trailing slash (last segment is empty) 在尾斜杠后面追加(最后一个段为空)
    if (!append || !stack[stack.length - 1]) {
      stack.pop(); // 为什么要这样做呢?
    }

    // resolve relative path 解决相对路径
    var segments = relative.replace(/^\//, '').split('/'); // 以 / 分隔为数组
    for (var i = 0; i < segments.length; i++) { // 遍历
      var segment = segments[i];
      if (segment === '..') { // 如果是 .. -- 表示向上一级
        stack.pop(); // 此时去除 base 最后一项
      } else if (segment !== '.') { // 如果不是 .. 并且不是 . -- 此时表示向下一级
        stack.push(segment); // 将路径追加到 stack 中
      }
    }

    // ensure leading slash 确保领先的削减
    if (stack[0] !== '') { // 确保第一个无意义
      stack.unshift('');
    }

    return stack.join('/') // 这样的话就会保证是以 / 开头的字符串
  }
  
  // 解析传入的路径, 返回 { path: 不包含 hash 和 查询参数的路径, query: 查询参数, hash: hash值 }
  function parsePath (path) {
    var hash = '';
    var query = '';

    var hashIndex = path.indexOf('#'); // 查找到对应的 # 位置
    if (hashIndex >= 0) { // 如果存在的话
      hash = path.slice(hashIndex); // 获取到 hash 值
      path = path.slice(0, hashIndex); // 并且从 path 路径中去除 hash 值
    }

    var queryIndex = path.indexOf('?'); // 查找到 ? 位置
    if (queryIndex >= 0) { // 如果存在
      query = path.slice(queryIndex + 1); // 获取到查询参数 query
      path = path.slice(0, queryIndex); // 同理, 从 path 路径中去除 query 参数
    }

    // 返回解析好的 path
    return {
      path: path,
      query: query,
      hash: hash
    }
  }

  // 将 // 转化为 /
  function cleanPath (path) {
    return path.replace(/\/\//g, '/')
  }

  var isarray = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
  };

  /**
   * Expose `pathToRegexp`.
   */
  var pathToRegexp_1 = pathToRegexp;
  var parse_1 = parse;
  var compile_1 = compile;
  var tokensToFunction_1 = tokensToFunction;
  var tokensToRegExp_1 = tokensToRegExp;

  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */
  var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
  ].join('|'), 'g');

  /**
   * Parse a string for the raw tokens.
   *
   * @param  {string}  str
   * @param  {Object=} options
   * @return {!Array}
   */
  function parse (str, options) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var defaultDelimiter = options && options.delimiter || '/';
    var res;

    while ((res = PATH_REGEXP.exec(str)) != null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length;

      // Ignore already escaped sequences.
      if (escaped) {
        path += escaped[1];
        continue
      }

      var next = str[index];
      var prefix = res[2];
      var name = res[3];
      var capture = res[4];
      var group = res[5];
      var modifier = res[6];
      var asterisk = res[7];

      // Push the current path onto the tokens.
      if (path) {
        tokens.push(path);
        path = '';
      }

      var partial = prefix != null && next != null && next !== prefix;
      var repeat = modifier === '+' || modifier === '*';
      var optional = modifier === '?' || modifier === '*';
      var delimiter = res[2] || defaultDelimiter;
      var pattern = capture || group;

      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        partial: partial,
        asterisk: !!asterisk,
        pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
      });
    }

    // Match any characters still remaining.
    if (index < str.length) {
      path += str.substr(index);
    }

    // If the path exists, push it onto the end.
    if (path) {
      tokens.push(path);
    }

    return tokens
  }

  /**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @param  {Object=}            options
   * @return {!function(Object=, Object=)}
   */
  function compile (str, options) {
    return tokensToFunction(parse(str, options), options)
  }

  /**
   * Prettier encoding of URI path segments.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeURIComponentPretty (str) {
    return encodeURI(str).replace(/[\/?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeAsterisk (str) {
    return encodeURI(str).replace(/[?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Expose a method for transforming tokens into the path function.
   */
  function tokensToFunction (tokens, options) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length);

    // Compile all the patterns before compilation.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'object') {
        matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
      }
    }

    return function (obj, opts) {
      var path = '';
      var data = obj || {};
      var options = opts || {};
      var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          path += token;

          continue
        }

        var value = data[token.name];
        var segment;

        if (value == null) {
          if (token.optional) {
            // Prepend partial segment prefixes.
            if (token.partial) {
              path += token.prefix;
            }

            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to be defined')
          }
        }

        if (isarray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
          }

          if (value.length === 0) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to not be empty')
            }
          }

          for (var j = 0; j < value.length; j++) {
            segment = encode(value[j]);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment;
          }

          continue
        }

        segment = token.asterisk ? encodeAsterisk(value) : encode(value);

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
        }

        path += token.prefix + segment;
      }

      return path
    }
  }

  /**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */
  function escapeString (str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
  }

  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */
  function escapeGroup (group) {
    return group.replace(/([=!:$\/()])/g, '\\$1')
  }

  /**
   * Attach the keys as a property of the regexp.
   *
   * @param  {!RegExp} re
   * @param  {Array}   keys
   * @return {!RegExp}
   */
  function attachKeys (re, keys) {
    re.keys = keys;
    return re
  }

  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {string}
   */
  function flags (options) {
    return options && options.sensitive ? '' : 'i'
  }

  /**
   * Pull out keys from a regexp.
   *
   * @param  {!RegExp} path
   * @param  {!Array}  keys
   * @return {!RegExp}
   */
  function regexpToRegexp (path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          partial: false,
          asterisk: false,
          pattern: null
        });
      }
    }

    return attachKeys(path, keys)
  }

  /**
   * Transform an array into a regexp.
   *
   * @param  {!Array}  path
   * @param  {Array}   keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function arrayToRegexp (path, keys, options) {
    var parts = [];

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source);
    }

    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

    return attachKeys(regexp, keys)
  }

  /**
   * Create a path regexp from string input.
   *
   * @param  {string}  path
   * @param  {!Array}  keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function stringToRegexp (path, keys, options) {
    return tokensToRegExp(parse(path, options), keys, options)
  }

  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {!Array}          tokens
   * @param  {(Array|Object)=} keys
   * @param  {Object=}         options
   * @return {!RegExp}
   */
  function tokensToRegExp (tokens, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options);
      keys = [];
    }

    options = options || {};

    var strict = options.strict;
    var end = options.end !== false;
    var route = '';

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        route += escapeString(token);
      } else {
        var prefix = escapeString(token.prefix);
        var capture = '(?:' + token.pattern + ')';

        keys.push(token);

        if (token.repeat) {
          capture += '(?:' + prefix + capture + ')*';
        }

        if (token.optional) {
          if (!token.partial) {
            capture = '(?:' + prefix + '(' + capture + '))?';
          } else {
            capture = prefix + '(' + capture + ')?';
          }
        } else {
          capture = prefix + '(' + capture + ')';
        }

        route += capture;
      }
    }

    var delimiter = escapeString(options.delimiter || '/');
    var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    if (!strict) {
      route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
    }

    if (end) {
      route += '$';
    } else {
      // In non-ending mode, we need the capturing groups to match as much as
      // possible by using a positive lookahead to the end or next path segment.
      route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
    }

    return attachKeys(new RegExp('^' + route, flags(options)), keys)
  }

  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(string|RegExp|Array)} path
   * @param  {(Array|Object)=}       keys
   * @param  {Object=}               options
   * @return {!RegExp}
   */
  function pathToRegexp (path, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options);
      keys = [];
    }

    options = options || {};

    if (path instanceof RegExp) {
      return regexpToRegexp(path, /** @type {!Array} */ (keys))
    }

    if (isarray(path)) {
      return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
    }

    return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
  }
  pathToRegexp_1.parse = parse_1;
  pathToRegexp_1.compile = compile_1;
  pathToRegexp_1.tokensToFunction = tokensToFunction_1;
  pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

  /*  */

  // $flow-disable-line
  var regexpCompileCache = Object.create(null);

  // 通过 path 来拼接 params最终路径 - 例如: 用户定义路由: /a/:b -- 传递了 { b: 5 } -- 此时解析成 /a/5 
  function fillParams (
    path, // 路径
    params, // 路由参数
    routeMsg // 提示信息
  ) {
    params = params || {}; // 路由参数
    try {
      var filler =
        regexpCompileCache[path] ||
        (regexpCompileCache[path] = pathToRegexp_1.compile(path)); // 通过 path-to-regexp 插件来完成匹配的

      // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }} 修复#2505解析星号路由{name: 'not-found'， params: {pathMatch: '/not-found'}}
      // and fix #3106 so that you can work with location descriptor object having params.pathMatch equal to empty string 并修复#3106，以便您可以使用带有参数的位置描述符对象。pathMatch等于空字符串
      if (typeof params.pathMatch === 'string') { params[0] = params.pathMatch; }

      return filler(params, { pretty: true })
    } catch (e) { // 如果解析出错了的话
      {
        // Fix #3072 no warn if `pathMatch` is string 修复#3072如果' pathMatch '是字符串不会发出警告的问题
        warn(typeof params.pathMatch === 'string', ("missing param for " + routeMsg + ": " + (e.message)));
      }
      return '' // 返回 ''
    } finally {
      // delete the 0 if it was added
      delete params[0];
    }
  }

  /*  */
  // 通过匹配信息和当前路由对象来解析出 path, hash, query ... 信息
  function normalizeLocation (
    raw, // 匹配信息 - 例如通过 路径path, 命名路由name 等
    current, // 路由对象
    append, // 
    router // 路由器 - VueRouter 实例
  ) {
    var next = typeof raw === 'string' ? { path: raw } : raw; // 如果是 string 类型的话, 则将其封装成对象形式
    // named target 指定的目标
    if (next._normalized) { // 如果是已经解析过的信息
      return next // 则直接返回
    } else if (next.name) { // 如果存在 name 信息
      next = extend({}, raw); // 复制副本
      var params = next.params; // 是否存在 params 路由参数
      if (params && typeof params === 'object') { // 如果是一个对象
        next.params = extend({}, params); // 那么复制一个 params 副本
      }
      return next // 将其返回
    }

    // relative params 相关的参数
    if (!next.path && next.params && current) { // 如果没有定义 path 路径 && 定义了路由参数 && 存在当前路由对象
      next = extend({}, next); // 复制一个副本
      next._normalized = true; // 标识已经解析
      var params$1 = extend(extend({}, current.params), next.params); // 将当前路由的路由参数和匹配信息中的路由参数合并
      if (current.name) { // 如果存在命名路由
        next.name = current.name;
        next.params = params$1;
      } else if (current.matched.length) {
        var rawPath = current.matched[current.matched.length - 1].path;
        next.path = fillParams(rawPath, params$1, ("path " + (current.path)));
      } else {
        warn(false, "relative params navigation requires a current route.");
      }
      return next
    }

    var parsedPath = parsePath(next.path || ''); // 解析传入的路径, 返回 { path: 不包含 hash 和 查询参数的路径, query: 查询参数, hash: hash值 }
    var basePath = (current && current.path) || '/'; // 当前路径
    // 最终匹配路径(不包含 hash 和 query)
    var path = parsedPath.path // 如果存在路径
      ? resolvePath(parsedPath.path, basePath, append || next.append) // 解析相对路径 - 例如当前路径为 /a/b/c - 用户需要跳转 ../../d/c 这样的情况下, 就需要解析成最终能使用的路径 /a/d/c
      : basePath;

    // 解析出 query 查询参数对象 -- { a: xx, b: xx, c: [xx, xx] }
    var query = resolveQuery(
      parsedPath.query,
      next.query,
      router && router.options.parseQuery // 用户自定义的序列话查询参数的方法
    );

    var hash = next.hash || parsedPath.hash; // 如果传入了 hash 的话, 优先使用, 否则使用通过 prth 路径解析出来的 hash 
    if (hash && hash.charAt(0) !== '#') { // 我们需要保证 hash 是以 # 开头的
      hash = "#" + hash;
    }

    // 返回一个解析后路径相关
    return {
      _normalized: true,
      path: path,
      query: query,
      hash: hash
    }
  }

  /*  */

  // work around weird flow bug
  var toTypes = [String, Object];
  var eventTypes = [String, Array];

  var noop = function () {};

  var warnedCustomSlot;
  var warnedTagProp;
  var warnedEventProp;

  var Link = {
    name: 'RouterLink',
    props: {
      to: {
        type: toTypes,
        required: true
      },
      tag: {
        type: String,
        default: 'a'
      },
      custom: Boolean,
      exact: Boolean,
      exactPath: Boolean,
      append: Boolean,
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      ariaCurrentValue: {
        type: String,
        default: 'page'
      },
      event: {
        type: eventTypes,
        default: 'click'
      }
    },
    render: function render (h) {
      var this$1 = this;

      var router = this.$router;
      var current = this.$route;
      var ref = router.resolve(
        this.to,
        current,
        this.append
      );
      var location = ref.location;
      var route = ref.route;
      var href = ref.href;

      var classes = {};
      var globalActiveClass = router.options.linkActiveClass;
      var globalExactActiveClass = router.options.linkExactActiveClass;
      // Support global empty active class
      var activeClassFallback =
        globalActiveClass == null ? 'router-link-active' : globalActiveClass;
      var exactActiveClassFallback =
        globalExactActiveClass == null
          ? 'router-link-exact-active'
          : globalExactActiveClass;
      var activeClass =
        this.activeClass == null ? activeClassFallback : this.activeClass;
      var exactActiveClass =
        this.exactActiveClass == null
          ? exactActiveClassFallback
          : this.exactActiveClass;

      var compareTarget = route.redirectedFrom
        ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router)
        : route;

      classes[exactActiveClass] = isSameRoute(current, compareTarget, this.exactPath);
      classes[activeClass] = this.exact || this.exactPath
        ? classes[exactActiveClass]
        : isIncludedRoute(current, compareTarget);

      var ariaCurrentValue = classes[exactActiveClass] ? this.ariaCurrentValue : null;

      var handler = function (e) {
        if (guardEvent(e)) {
          if (this$1.replace) {
            router.replace(location, noop);
          } else {
            router.push(location, noop);
          }
        }
      };

      var on = { click: guardEvent };
      if (Array.isArray(this.event)) {
        this.event.forEach(function (e) {
          on[e] = handler;
        });
      } else {
        on[this.event] = handler;
      }

      var data = { class: classes };

      var scopedSlot =
        !this.$scopedSlots.$hasNormal &&
        this.$scopedSlots.default &&
        this.$scopedSlots.default({
          href: href,
          route: route,
          navigate: handler,
          isActive: classes[activeClass],
          isExactActive: classes[exactActiveClass]
        });

      if (scopedSlot) {
        if ( !this.custom) {
          !warnedCustomSlot && warn(false, 'In Vue Router 4, the v-slot API will by default wrap its content with an <a> element. Use the custom prop to remove this warning:\n<router-link v-slot="{ navigate, href }" custom></router-link>\n');
          warnedCustomSlot = true;
        }
        if (scopedSlot.length === 1) {
          return scopedSlot[0]
        } else if (scopedSlot.length > 1 || !scopedSlot.length) {
          {
            warn(
              false,
              ("<router-link> with to=\"" + (this.to) + "\" is trying to use a scoped slot but it didn't provide exactly one child. Wrapping the content with a span element.")
            );
          }
          return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot)
        }
      }

      {
        if ('tag' in this.$options.propsData && !warnedTagProp) {
          warn(
            false,
            "<router-link>'s tag prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link."
          );
          warnedTagProp = true;
        }
        if ('event' in this.$options.propsData && !warnedEventProp) {
          warn(
            false,
            "<router-link>'s event prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link."
          );
          warnedEventProp = true;
        }
      }

      if (this.tag === 'a') {
        data.on = on;
        data.attrs = { href: href, 'aria-current': ariaCurrentValue };
      } else {
        // find the first <a> child and apply listener and href
        var a = findAnchor(this.$slots.default);
        if (a) {
          // in case the <a> is a static node
          a.isStatic = false;
          var aData = (a.data = extend({}, a.data));
          aData.on = aData.on || {};
          // transform existing events in both objects into arrays so we can push later
          for (var event in aData.on) {
            var handler$1 = aData.on[event];
            if (event in on) {
              aData.on[event] = Array.isArray(handler$1) ? handler$1 : [handler$1];
            }
          }
          // append new listeners for router-link
          for (var event$1 in on) {
            if (event$1 in aData.on) {
              // on[event] is always a function
              aData.on[event$1].push(on[event$1]);
            } else {
              aData.on[event$1] = handler;
            }
          }

          var aAttrs = (a.data.attrs = extend({}, a.data.attrs));
          aAttrs.href = href;
          aAttrs['aria-current'] = ariaCurrentValue;
        } else {
          // doesn't have <a> child, apply listener to self
          data.on = on;
        }
      }

      return h(this.tag, data, this.$slots.default)
    }
  };

  function guardEvent (e) {
    // don't redirect with control keys
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
    // don't redirect when preventDefault called
    if (e.defaultPrevented) { return }
    // don't redirect on right click
    if (e.button !== undefined && e.button !== 0) { return }
    // don't redirect if `target="_blank"`
    if (e.currentTarget && e.currentTarget.getAttribute) {
      var target = e.currentTarget.getAttribute('target');
      if (/\b_blank\b/i.test(target)) { return }
    }
    // this may be a Weex event which doesn't have this method
    if (e.preventDefault) {
      e.preventDefault();
    }
    return true
  }

  function findAnchor (children) {
    if (children) {
      var child;
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.tag === 'a') {
          return child
        }
        if (child.children && (child = findAnchor(child.children))) {
          return child
        }
      }
    }
  }

  var _Vue;

  // 在这里注册插件
  function install (Vue) {
    // install.installed 标识：判断是否已经注册 
    // _Vue：Vue 引用
    if (install.installed && _Vue === Vue) { return } // 虽然说 Vue.use() 内部会防止重复注册插件, 在这里内部还是会防止重复注册插件
    install.installed = true; // 将标识置为 true

    _Vue = Vue; // 缓存 vue 构造器

    var isDef = function (v) { return v !== undefined; };

    var registerInstance = function (vm, callVal) {
      var i = vm.$options._parentVnode;
      if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
        i(vm, callVal);
      }
    };

    // 全局混入, 这样就会影响全部的组件实例
    Vue.mixin({
      // beforeCreate: 在数据准备前执行
      beforeCreate: function beforeCreate () {
        if (isDef(this.$options.router)) { // 是否是配置了 router 的 Vue 根实例 -- 这里表示的就是一个路由树对应的根
          /**
           * 在这里, 初始化配置了 router 的根组件, 因为当存在组件配置了 router 的时候, 我们这时候就需要去处理路由问题
           */
          this._routerRoot = this; // 添加一个私有属性 _routeRoot -- 用于子孙组件定位到根
          this._router = this.$options.router; // 添加一个私有属性 _router, 这个就是 VueRotuer 实例, 用于控制路由 -- 只会在根实例上存在, 其他组件会通过 _routerRoot 访问
          this._router.init(this); // 当根组件开始挂载的时机, 就去初始化路由, 以及监听路由变化以响应路由变化
          Vue.util.defineReactive(this, '_route', this._router.history.current); // 初始化一个 _route 路由对象
        } else { // 不是根实例的话
          this._routerRoot = (this.$parent && this.$parent._routerRoot) || this; // 我们通过 _routerRoot 来操控路由
        }
        registerInstance(this, this);
      },
      // destroyed: 组件销毁后执行
      destroyed: function destroyed () {
        registerInstance(this);
      }
    });

    // 在 Vue 原型上添加 $router, 用于每个实例进行路由控制 -- 这个其实就是 VueRouter 实例
    Object.defineProperty(Vue.prototype, '$router', {
      get: function get () { return this._routerRoot._router }
    });

    // 在 Vue 原型上添加 $route, 用于每个实例访问路由信息
    Object.defineProperty(Vue.prototype, '$route', {
      get: function get () { return this._routerRoot._route }
    });

    Vue.component('RouterView', View); // 注册了 RouteView 全局组件
    Vue.component('RouterLink', Link); // 注册了 RouterLink  全局组件

    var strats = Vue.config.optionMergeStrategies; // 组件选项合并策略
    // use the same hook merging strategy for route hooks 对路由钩子使用相同的钩子合并策略
    /** 这三个组件内的守卫的合并策略借用 created 内部策略
     * beforeRouteEnter: 渲染组件前的守卫
     * beforeRouteLeave: 组件被复用时调用
     * beforeRouteLeave: 离开该路由时调用
     */
    strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
  }

  /*  */

  var inBrowser = typeof window !== 'undefined';

  /*  */
  // 通过解析 routes 用户注册路由表成内部使用特定格式
  /**
   * pathList: 路径集合 ['/foo', '/xx/xx']
   * pathMap: path 与 路由信息 映射关系 { /foo: { path: xx, components: xx, xx }, xx: xx }
   * nameMap: name 与 路由信息 映射关系 { Bar: { xx } }
   */
  function createRouteMap (
    routes, // 用户注册路由表
    oldPathList, // 以前解析的 路径集合 - 用于当动态添加路由时使用
    oldPathMap, // 以前解析的 path 与 路由信息 映射关系 - 用于当动态添加路由时使用 
    oldNameMap, // 以前解析的 name 与 路由信息 映射关系 - 用于当动态添加路由时使用
    parentRoute // 父路由信息
  ) {
    // the path list is used to control path matching priority 路径列表用于控制路径匹配的优先级
    var pathList = oldPathList || []; // 路径集合
    // $flow-disable-line
    var pathMap = oldPathMap || Object.create(null); // path 与 路由信息 映射关系
    // $flow-disable-line
    var nameMap = oldNameMap || Object.create(null); // name 与 路由信息 映射关系

    routes.forEach(function (route) { // 遍历 routes 用户注册路由表
      addRouteRecord(pathList, pathMap, nameMap, route, parentRoute); // 解析用户注册路由
    });

    // ensure wildcard routes are always at the end 确保通配符路由总是在最后
    for (var i = 0, l = pathList.length; i < l; i++) { // 遍历 path 集合
      if (pathList[i] === '*') { // 如果发现了 * 通配符
        pathList.push(pathList.splice(i, 1)[0]); // 将其推入到最后
        // 为什么这里还需要继续遍历了? 在 addRouteRecord 方法内部, 应该是已经防重复的
        l--;
        i--;
      }
    }

    {
      // warn if routes do not include leading slashes 如果路由没有包含前导斜杠，则发出警告
      var found = pathList
      // check for missing leading slash 检查缺少前导斜杠
        .filter(function (path) { return path && path.charAt(0) !== '*' && path.charAt(0) !== '/'; }); // 注册的路由除了 * 外, 都需要 / 开头

      if (found.length > 0) { // 不符合规则的路由
        var pathNames = found.map(function (path) { return ("- " + path); }).join('\n'); // 提示信息
        warn(false, ("Non-nested routes must include a leading slash character. Fix the following routes: \n" + pathNames)); // 提示
      }
    }

    return {
      pathList: pathList,
      pathMap: pathMap,
      nameMap: nameMap
    }
  }

  // 添加路由信息
  function addRouteRecord (
    pathList, // 路径集合
    pathMap, // path 与 路由信息 的映射集
    nameMap, // name 与 路由信息 的映射集
    route, // 用户注册信息
    parent, // 父路由
    matchAs // 如果该路由为别名路由, matchAs 保存的是原始路径
  ) {
    var path = route.path; // 用户注册路由
    var name = route.name; // 用户注册路由的命名
    // 对注册信息进行友好提示
    {
      // path 必须注册
      assert(path != null, "\"path\" is required in a route configuration."); // “path”在路由配置中是必需的
      // component 注册不能为组件的 id
      assert(
        typeof route.component !== 'string',
        "route config \"component\" for path: " + (String( // 路径路由配置\"component\"
          path || name
        )) + " cannot be a " + "string id. Use an actual component instead." // 不能是字符串id。请使用实际的组件代替
      );

      // 路径中不能包含未编码的字符
      warn(
        // eslint-disable-next-line no-control-regex
        !/[^\u0000-\u007F]+/.test(path),
        "Route with path \"" + path + "\" contains unencoded characters, make sure " + // 带path的路由包含未编码的字符，请确保
          "your path is correctly encoded before passing it to the router. Use " + // 在将路径传递到路由器之前，路径被正确编码。使用
          "encodeURI to encode static segments of your path." // encodeURI对路径的静态段进行编码
      );
    }

    var pathToRegexpOptions =
      route.pathToRegexpOptions || {}; // pathToRegexpOptions: 编译正则的选项 - 这是一个更高级的匹配规则
    // 最终返回 /xx/xx/xx 形式
    var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict); // 规范 path 路径, 根据用户注册 path, 父路由信息, 编译规则 来提取出 path

    if (typeof route.caseSensitive === 'boolean') { // 匹配规则是否大小写敏感？(默认值：false)
      pathToRegexpOptions.sensitive = route.caseSensitive;
    }

    // 当前 path 对应的路由信息
    var record = {
      path: normalizedPath, // 路径
      regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
      components: route.components || { default: route.component }, // path 对应的组件, 最终会统一为 { xx: xx, xx: xx } -- 会兼容其命名视图
      alias: route.alias // 是否存在别名
        ? typeof route.alias === 'string' // 如果存在别名并且为 string 类型
          ? [route.alias] // 组装成数组
          : route.alias // 此时应该为数组, 所以直接使用
        : [], // 不存在别名 - 返回 []
      instances: {},
      enteredCbs: {},
      name: name, // 命名路由的 name
      parent: parent, // 父路由
      matchAs: matchAs, // 别名对应的原始路径 - 用于当为别名路径时查找到正确的路径
      redirect: route.redirect, // 重定向路径
      beforeEnter: route.beforeEnter, // 路由独享的守卫
      meta: route.meta || {}, // 路由元信息
      props: // 路由组件通过 props 形式传参
        route.props == null // 没有注册 props
          ? {} // 返回 {}
          : route.components // 如果注册了命名视图的话
            ? route.props // 直接使用, 需要跟命名视图注册的组件对应
            : { default: route.props } // 封装一下
    };

    if (route.children) { // 如果存在子路由
      // Warn if route is named, does not redirect and has a default child route. 如果路由被命名，不会重定向并且有一个默认的子路由，则发出警告
      // If users navigate to this route by name, the default child will 如果用户按名称导航到此路由，则默认子路由将导航到此路由
      // not be rendered (GH Issue #629) 不显示
      {
        if (
          route.name && // 当前注册了命名路由
          !route.redirect && // 并且没有注册重定向
          route.children.some(function (child) { return /^\/?$/.test(child.path); }) // 子路由中注册了 '' 或 '/' 路径信息
        ) {
          warn(
            false,
            "Named Route '" + (route.name) + "' has a default child route. " + // 命名的路由 有一个默认的子路由
              "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " + //  当导航到这个命名的路由时
              "the default child route will not be rendered. Remove the name from " + // 默认的子路由将不会被呈现。把名字从
              "this route and use the name of the default child route for named " + // 此路由并使用默认子路由的名称进行命名
              "links instead." // 链接而不是
          );
        }
      }
      route.children.forEach(function (child) { // 遍历子路由
        var childMatchAs = matchAs // 通过这个属性来将别名路由链接到正确的路径上
          ? cleanPath((matchAs + "/" + (child.path))) // 组装子路由的别名
          : undefined;
        addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs); // 递归解析子路由
      });
    }

    if (!pathMap[record.path]) { // 如果该路由没有被注册 - 在这里可以看出, 先注册的路由优先级更高
      pathList.push(record.path); // 则将其推入 路径集合 中
      pathMap[record.path] = record; // 以及推入到 路径与路由信息 集合中
    }

    /**
     * 别名路由的策略: 如果是别名路由, 那么就将别名同样以 addRouteRecord 方式注册到路由集合中, 但是会通过 matchAs 属性来识别别名
     * 并且当注册别名路由的子路由时,也同样这样注册, 只需要 matchAs 属性链接到正确的路由信息中
     */
    if (route.alias !== undefined) { // 如果存在注册别名
      var aliases = Array.isArray(route.alias) ? route.alias : [route.alias]; // 保证数据为数组形式
      for (var i = 0; i < aliases.length; ++i) { // 遍历别名
        var alias = aliases[i];
        if ( alias === path) { // 如果别名路径与注册路径相同
          warn( // 此时符合规则, pass
            false,
            // 发现与路径具有相同值的别名, 您必须删除该别名。它在开发过程中会被忽略
            ("Found an alias with the same value as the path: \"" + path + "\". You have to remove that alias. It will be ignored in development.")
          );
          // skip in dev to make it work 跳过 dev 让它工作
          continue
        }

        var aliasRoute = { // 组件别名路由信息
          path: alias,
          children: route.children
        };
        // 同样将别名路由也一样注册路由信息
        addRouteRecord(
          pathList,
          pathMap,
          nameMap,
          aliasRoute,
          parent,
          record.path || '/' // matchAs
        );
      }
    }

    if (name) { // 如果注册了
      if (!nameMap[name]) { // 如果没有推入过 name 集合中
        nameMap[name] = record; // 推入其中
      } else if ( !matchAs) { // 如果不是别名路由 - 说明 name 被重复定义 
        warn( // 将抛出错误
          false,
          "Duplicate named routes definition: " + // 重复命名路由定义
            "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
        );
      }
    }
  }

  function compileRouteRegex (
    path,
    pathToRegexpOptions
  ) {
    var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
    {
      var keys = Object.create(null);
      regex.keys.forEach(function (key) {
        warn(
          !keys[key.name],
          ("Duplicate param keys in route with path: \"" + path + "\"")
        );
        keys[key.name] = true;
      });
    }
    return regex
  }

  /**
   * 返回解析后的 path - 最终返回 /xxx/xxx
   */
  function normalizePath (
    path, // 路径
    parent, // 父路由信息
    strict // 暂时不理会
  ) {
    if (!strict) { path = path.replace(/\/$/, ''); } // 将末尾的 / 去除
    if (path[0] === '/') { return path } // 如果 path 为 /, 则直接返回
    if (parent == null) { return path } // 如果 path 为 null || undefined, 则直接返回
    return cleanPath(((parent.path) + "/" + path)) // 否则就需要根据父路由来进行拼接
  }

  /*  */


  // 在这个方法内部, 会将用户注册路由表解析成内部使用数据格式, 通过闭包引用, 返回一个操作这些内部数据, 例如: 根据条件匹配路由, 动态添加路由等方式
  /**
   * 会将用户注册的路由表信息最终解析成 
   * { 
   *   path: normalizedPath, // 路径
   *   regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
   *   components: route.components || { default: route.component }, // path 对应的组件, 最终会统一为 { xx: xx, xx: xx } -- 会兼容其命名视图
   *   alias: route.alias // 是否存在别名
   *     ? typeof route.alias === 'string' // 如果存在别名并且为 string 类型
   *       ? [route.alias] // 组装成数组
   *       : route.alias // 此时应该为数组, 所以直接使用
   *     : [], // 不存在别名 - 返回 []
   *   instances: {},
   *   enteredCbs: {},
   *   name: name, // 命名路由的 name
   *   parent: parent, // 父路由
   *   matchAs: matchAs, // 别名对应的原始路径 - 用于当为别名路径时查找到正确的路径
   *   redirect: route.redirect, // 重定向路径
   *   beforeEnter: route.beforeEnter, // 路由独享的守卫
   *   meta: route.meta || {}, // 路由元信息
   *   props: // 路由组件通过 props 形式传参
   *     route.props == null // 没有注册 props
   *       ? {} // 返回 {}
   *       : route.components // 如果注册了命名视图的话
   *         ? route.props // 直接使用, 需要跟命名视图注册的组件对应
   *         : { default: route.props } // 封装一下 
   * }
   * pathList: 路由路径 key 的集合, 便于快速查找, 查找速度更快
   * pathMap: 路径 path 与 路由信息 的映射对象
   * nameMap: 命名路由 name 与 路由信息 的映射对象
   */
  function createMatcher (
    routes, // 用户路由注册
    router // VueRouter 实例
  ) {
    /**
     * pathList: 路径集合 ['/foo', '/xx/xx']
     * pathMap: path 与 路由信息 映射关系 { /foo: { path: xx, components: xx, xx }, xx: xx }
     * nameMap: name 与 路由信息 映射关系 { Bar: { xx } }
     */
    var ref = createRouteMap(routes); // 解析路由
    var pathList = ref.pathList;
    var pathMap = ref.pathMap;
    var nameMap = ref.nameMap;

    // 已废弃 - 动态添加更多的路由规则
    function addRoutes (routes) {
      // 添加一个新路由 - 直接通过 createRouteMap 方法, 会将 routes 注册路由解析相应路由信息对象添加到对应集合中
      createRouteMap(routes, pathList, pathMap, nameMap);
    }

    /**
      * 根据参数不同, 有两种用法:
      * 添加一条新路由规则。 -- addRoute(route: RouteConfig): () => void
      * 添加一条新的路由规则记录作为现有路由的子路由 -- addRoute(parentName: string, route: RouteConfig): () => void
      */
    function addRoute (parentOrRoute, route) {
      // 如果第一个参数不是对象类型, 那么就说明是 添加一条新的路由规则记录作为现有路由的子路由, 此时要找出父路由
      // 在这里是通过 name 来查找的, 因为 name 具有唯一性, 并不存在这是个别名路由的情况
      var parent = (typeof parentOrRoute !== 'object') ? nameMap[parentOrRoute] : undefined;
      // $flow-disable-line
      createRouteMap([route || parentOrRoute], pathList, pathMap, nameMap, parent); // 添加路由

      // add aliases of parent 添加父类的别名
      if (parent) {
        createRouteMap(
          // $flow-disable-line route is defined if parent is
          // 如果父路由存在别名的话, 就注册这个别名路由, 并且子路由为 route 需要注册的路由
          /**
           * 因为在之前 parent 的路由已经被注册的, 别名也是被注册了的, 此时重复注册在内部不会处理的
           * 继而只会 children 子路由, 那么就会将子路由对应的别名路由解析后推入到集合中
           */
          parent.alias.map(function (alias) { return ({ path: alias, children: [route] }); }),
          pathList,
          pathMap,
          nameMap,
          parent
        );
      }
    }

    // 获取所有活跃的路由记录列表
    function getRoutes () {
      return pathList.map(function (path) { return pathMap[path]; })
    }

    function match (
      raw, // 匹配路径
      currentRoute, // 当前路由对象
      redirectedFrom // 重定向信息 - 我们需要传递这个, 来判断是否为重定向过来的, 因为在创建路由对象时, 需要 redirectedFrom 属性添加 - 如果存在重定向，即为重定向来源的路由的名字
    ) {
      // 通过匹配信息和当前路由对象来解析出 path, hash, query... 路由信息
      var location = normalizeLocation(raw, currentRoute, false, router);
      var name = location.name; // 存在命名路由嘛?

      if (name) { // 如果存在命名路由
        var record = nameMap[name]; // 从解析出来的路由信息集合中找出 name 对应的路由信息
        {
          warn(record, ("Route with name '" + name + "' does not exist")); // 如果没有找到的话, 发出个警告
        }
        if (!record) { return _createRoute(null, location) } // 没有找到, 那么我们直接创建一个只包含路径信息的路由对象
        var paramNames = record.regex.keys // 应该是表示用户注册 params 信息
          .filter(function (key) { return !key.optional; })
          .map(function (key) { return key.name; });

        // 如果是通过 name 跳转路由的话, 那么 params 一定是通过 { params: {} } 方式传递的, 所以无需在 path 中解析出来
        if (typeof location.params !== 'object') { // 如果 params 不是一个对象
          location.params = {}; // 那么封装成一个对象
        }

        if (currentRoute && typeof currentRoute.params === 'object') { // 如果当前路由存在 params 的话
          for (var key in currentRoute.params) { // 遍历以前的 params 
            // !(key in location.params) 不存在 location 匹配信息中
            // paramNames.indexOf(key) > -1 当前 params 存在与匹配的路由信息中的params
            // 在这里, 猜测可能是如果匹配路由定义的 params 没有传递, 但是在当前路由中存在的话, 那么就复用一下 params
            if (!(key in location.params) && paramNames.indexOf(key) > -1) {
              location.params[key] = currentRoute.params[key];
            }
          }
        }

        // 解析出最终路由
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom) // 创建路由对象
      } else if (location.path) { // 在这里就说明不是通过命名路由跳转, 那么 params 的定义信息也就无用了
        location.params = {}; // 路由参数
        for (var i = 0; i < pathList.length; i++) { // 遍历 pathList 注册路径集合
          var path = pathList[i]; // 路径
          var record$1 = pathMap[path]; // 提取出路由信息
          // matchRoute 方法来匹配注册到的路由, 若是匹配到了, 在方法内部, 就会解析好 params 参数
          if (matchRoute(record$1.regex, location.path, location.params)) {
            return _createRoute(record$1, location, redirectedFrom) // 匹配到了的话就创建一个路由对象返回
          }
        }
      }
      // no match 不匹配
      return _createRoute(null, location) // 创建一个空的路由对象
    }

    // 解析重定向路由
    /**
     * 重定向策略: 就是根据重定向规则来找到最终的路由信息, 并且内部通过 match 去匹配是否存在这个重定向路径
     */
    function redirect (
      record, // 重定向路由信息
      location // 路径信息
    ) {
      var originalRedirect = record.redirect; // 重定向路径
      var redirect = typeof originalRedirect === 'function' // 如果是一个函数的话, 那么是动态返回重定向目标
      /**
       * createRoute(record, location, null, router): 创建传入函数中的路由对象
       * redirect: to => {
       *   // 方法接收 目标路由 作为参数
       *   // return 重定向的 字符串路径/路径对象
       * }}
       */
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

      // 因为有可能是一个对象形式的: { name: 'foo' }
      if (typeof redirect === 'string') { // 如果是 字符串 类型, 说明是一个最终 path 路径
        redirect = { path: redirect }; // 组装成对象形式
      }

      // 如果不存在(可能只是定义了 redirect 为函数但是没有返回值), 或者 redirect 不是对象(可能定义为其他数据类型)
      if (!redirect || typeof redirect !== 'object') { 
        {
          warn( // 发出警告
            false, ("invalid redirect option: " + (JSON.stringify(redirect)))
          );
        }
        return _createRoute(null, location) // 创建一个空路由对象
      }

      var re = redirect; // 重定向信息
      var name = re.name; // 命名路由
      var path = re.path; // 路径
      var query = location.query; // 查询参数
      var hash = location.hash; // hash
      var params = location.params; // 路由参数
      query = re.hasOwnProperty('query') ? re.query : query; // 如果重定向信息已经包含了 query, 优先使用
      hash = re.hasOwnProperty('hash') ? re.hash : hash; // 如果重定向信息已经包含了 hash, 优先使用
      params = re.hasOwnProperty('params') ? re.params : params; // 如果重定向信息已经包含了 params, 优先使用

      if (name) { // 如果是通过 name 跳转的话
        // resolved named direct 解决命名直接
        var targetRecord = nameMap[name]; // 找到目标路由信息
        { // 如果没有找到的话, 那么就直接报错处理, 因为会用户定义的, 所以这时候需要退出调用栈, 通知用户
          assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
        }
        // 通过 match 重新来生成一个路由对象
        return match({
          _normalized: true,
          name: name,
          query: query,
          hash: hash,
          params: params
        }, undefined, location)
      } else if (path) { // 如果是通过 path 跳转的话
        // 1. resolve relative redirect 解决相对重定向
        /**
         * 例如: 定义路由为: { path: '/a', children: [{ path: 'c', redirect: '../c' }] }
         * 此时我们需要结合 ../c 和 /a 路径来解析, 因为 ../c 是一个相对路径
         */
        var rawPath = resolveRecordPath(path, record);
        // 2. resolve params 解析路由参数 - 根据 params 来确定最终路径
        var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
        // 3. rematch with existing query and hash 与现有查询和散列重新匹配
        return match({
          _normalized: true, // 表示不需要在重新解析 location
          path: resolvedPath,
          query: query,
          hash: hash
        }, undefined, location)
      } else { // 其他情况, 发出警告, 返回一个空路由对象
        {
          warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
        }
        return _createRoute(null, location)
      }
    }

    /**
     * 解析别名策略:
     * 也就是找到别名对应的实际路由, 实际渲染的就是这个对应的路由信息, 但是会改变 path 路径, 用于在 url 还是展示 别名路由
     */
    function alias (
      record, // 路由信息
      location, // 路径信息
      matchAs // 别名路径
    ) {
      // 解析最终实际应该渲染的路由 - 但是在 url 表现上, 还是会展示这个 url
      var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
      var aliasedMatch = match({ // 通过这个 path 路径来创建路由对象 - 这个一般而言是可以找到的
        _normalized: true,
        path: aliasedPath
      });
      if (aliasedMatch) { // 匹配别名的路由信息
        var matched = aliasedMatch.matched; // 一个数组，包含当前路由的所有嵌套路径片段的路由记录
        var aliasedRecord = matched[matched.length - 1]; // 这个数组的最后一个, 就是我们最终渲染的路由对象
        location.params = aliasedMatch.params; // 路由参数
        return _createRoute(aliasedRecord, location) // 创建最终的路由对象 - 在这里基本上都会采用实际渲染的路由信息, 但是会改变 path 路径
      }
      return _createRoute(null, location) // 否则就返回一个空的路由对象
    }

    // 创建路由对象
    function _createRoute (
      record, // 用户路由信息
      location, // 路径信息
      redirectedFrom // 重定向信息
    ) {
      if (record && record.redirect) { // 如果是重定向路由
        /**
         * 重定向策略: 就是根据重定向规则来找到最终的路由信息, 并且内部通过 match 去匹配是否存在这个重定向路径
         */
        return redirect(record, redirectedFrom || location)
      }
      if (record && record.matchAs) { // 如果是别名路由
        /**
         * 解析别名策略:
         * 也就是找到别名对应的实际路由, 实际渲染的就是这个对应的路由信息, 但是会改变 path 路径, 用于在 url 还是展示 别名路由
         */
        return alias(record, location, record.matchAs)
      }
      // 创建一个路由对象
      return createRoute(record, location, redirectedFrom, router)
    }

    // 返回一个 api 对象, 用于操作解析好的数据
    return {
      match: match, // 最主要的方法, 用于指定信息来匹配相应路由, 并根据这些信息来创建一个最终的路由对象
      /**
       * 根据参数不同, 有两种用法:
       * 添加一条新路由规则。 -- addRoute(route: RouteConfig): () => void
       * 添加一条新的路由规则记录作为现有路由的子路由 -- addRoute(parentName: string, route: RouteConfig): () => void
       */
      addRoute: addRoute,
      getRoutes: getRoutes, // 获取所有活跃的路由记录列表
      addRoutes: addRoutes // 已废弃 - 动态添加更多的路由规则
    }
  }

  // 通过 path 来匹配用户注册的路由信息
  function matchRoute (
    regex, // 匹配规则
    path, // 路径
    params // 路由参数
  ) {
    var m = path.match(regex); // 正则相关

    if (!m) { // 表示没有匹配上
      return false // 返回true
    } else if (!params) { // 不需要解析路由参数
      return true // 直接返回 true
    }

    // 这下面, 又是利用了引用类型的特性, 传入的 params 是一个对象, 在这里给这个对象添加属性同时也会影响传入的对象
    for (var i = 1, len = m.length; i < len; ++i) { // 这下面就是通过正则来解析 path 后得出的 params
      var key = regex.keys[i - 1];
      if (key) {
        // Fix #1994: using * with props: true generates a param named 0
        params[key.name || 'pathMatch'] = typeof m[i] === 'string' ? decode(m[i]) : m[i];
      }
    }

    return true
  }

  // 解决相对路径问题
  /**
   * 例如: 定义路由为: { path: '/a', children: [{ path: 'c', redirect: '../c' }] }
   * 此时我们需要结合 ../c 和 /a 路径来解析, 因为 ../c 是一个相对路径
   */
  function resolveRecordPath (path, record) {
    // 在这里就需要根据 record.parent 父路由来确定最终路径
    // 如果 path 是以 / 开头的话,这样表示一个绝对路径, 那么就会直接返回 path
    return resolvePath(path, record.parent ? record.parent.path : '/', true)
  }

  /*  */

  // use User Timing api (if present) for more accurate key precision 使用用户计时api(如果有的话)来实现更精确的键精度
  var Time =
    inBrowser && window.performance && window.performance.now
      ? window.performance
      : Date;

  // 提供一个唯一标识的 key
  function genStateKey () {
    return Time.now().toFixed(3)
  }

  // 全局先取一个 key
  var _key = genStateKey();

  // 获取当前全局唯一 key
  function getStateKey () {
    return _key
  }

  function setStateKey (key) {
    return (_key = key)
  }

  /*  */

  // 保存着不同页面对应的 key
  var positionStore = Object.create(null);

  function setupScroll () {
    // Prevent browser scroll behavior on History popstate
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Fix for #1585 for Firefox
    // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
    // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with
    // window.location.protocol + '//' + window.location.host
    // location.host contains the port and location.hostname doesn't
    var protocolAndPath = window.location.protocol + '//' + window.location.host;
    var absolutePath = window.location.href.replace(protocolAndPath, '');
    // preserve existing history state as it could be overriden by the user
    var stateCopy = extend({}, window.history.state);
    stateCopy.key = getStateKey();
    window.history.replaceState(stateCopy, '', absolutePath);
    window.addEventListener('popstate', handlePopState);
    return function () {
      window.removeEventListener('popstate', handlePopState);
    }
  }

  function handleScroll (
    router,
    to,
    from,
    isPop
  ) {
    if (!router.app) {
      return
    }

    var behavior = router.options.scrollBehavior;
    if (!behavior) {
      return
    }

    {
      assert(typeof behavior === 'function', "scrollBehavior must be a function");
    }

    // wait until re-render finishes before scrolling
    router.app.$nextTick(function () {
      var position = getScrollPosition();
      var shouldScroll = behavior.call(
        router,
        to,
        from,
        isPop ? position : null
      );

      if (!shouldScroll) {
        return
      }

      if (typeof shouldScroll.then === 'function') {
        shouldScroll
          .then(function (shouldScroll) {
            scrollToPosition((shouldScroll), position);
          })
          .catch(function (err) {
            {
              assert(false, err.toString());
            }
          });
      } else {
        scrollToPosition(shouldScroll, position);
      }
    });
  }

  // 保存当前页面的滚动位置信息
  function saveScrollPosition () {
    var key = getStateKey(); // 获取当前页面 key 信息
    if (key) { // 如果存在
      positionStore[key] = { // 那么将当前 key 对应的页面的滚动位置保存在 positionStore 中
        x: window.pageXOffset,
        y: window.pageYOffset
      };
    }
  }

  function handlePopState (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  }

  function getScrollPosition () {
    var key = getStateKey();
    if (key) {
      return positionStore[key]
    }
  }

  function getElementPosition (el, offset) {
    var docEl = document.documentElement;
    var docRect = docEl.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - docRect.left - offset.x,
      y: elRect.top - docRect.top - offset.y
    }
  }

  function isValidPosition (obj) {
    return isNumber(obj.x) || isNumber(obj.y)
  }

  function normalizePosition (obj) {
    return {
      x: isNumber(obj.x) ? obj.x : window.pageXOffset,
      y: isNumber(obj.y) ? obj.y : window.pageYOffset
    }
  }

  function normalizeOffset (obj) {
    return {
      x: isNumber(obj.x) ? obj.x : 0,
      y: isNumber(obj.y) ? obj.y : 0
    }
  }

  function isNumber (v) {
    return typeof v === 'number'
  }

  var hashStartsWithNumberRE = /^#\d/;

  function scrollToPosition (shouldScroll, position) {
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      // getElementById would still fail if the selector contains a more complicated query like #main[data-attr]
      // but at the same time, it doesn't make much sense to select an element with an id and an extra selector
      var el = hashStartsWithNumberRE.test(shouldScroll.selector) // $flow-disable-line
        ? document.getElementById(shouldScroll.selector.slice(1)) // $flow-disable-line
        : document.querySelector(shouldScroll.selector);

      if (el) {
        var offset =
          shouldScroll.offset && typeof shouldScroll.offset === 'object'
            ? shouldScroll.offset
            : {};
        offset = normalizeOffset(offset);
        position = getElementPosition(el, offset);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      // $flow-disable-line
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          left: position.x,
          top: position.y,
          // $flow-disable-line
          behavior: shouldScroll.behavior
        });
      } else {
        window.scrollTo(position.x, position.y);
      }
    }
  }

  /*  */
  // 是否支持 history 模式
  var supportsPushState =
    inBrowser && // 是否为浏览器环境
    (function () {
      var ua = window.navigator.userAgent; // 查找 UA 

      if ( // 当遇到下列机型时, 直接表示不支持 history 模式
        (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1
      ) {
        return false
      }
      // 通过检测原生是否支持 history.pushState 方法
      return window.history && typeof window.history.pushState === 'function'
    })();

  // 追加或替换路由, 以 history 模式
  function pushState (url, replace) {
    /**
     * window.history 方式无刷新追加历史记录方式, 传递的 { key: 页面标识 } 状态对象
     * 每当用户导航到新状态时，都会触发popstate (en-US)事件，并且该事件的状态属性包含历史记录条目的状态对象的副本。
     * 所以我们通过这种方式来记录页面的滚动位置, 这样就可以在通过前进后退方式时, 保持与浏览器行为一致并且也可以定制
     */
    saveScrollPosition(); // 保存着当前页面的滚动位置
    // try...catch the pushState call to get around Safari try...catch pushState调用以绕过Safari
    // DOM Exception 18 where it limits to 100 pushState calls DOM异常18，其中它限制100个pushState调用
    var history = window.history;
    try {
      if (replace) { // 如果是替换路由的话
        // preserve existing history state as it could be overriden by the user 保留现有的历史状态，因为它可能会被用户覆盖
        // history.state: 返回一个表示历史堆栈顶部的状态的值.这是一种可以不必等待popstate (en-US) 事件而查看状态的方式。 -- 也就是当前页面通过 history.replaceState(或者history.pushState) 方式添加的状态对象
        var stateCopy = extend({}, history.state); // 需要保存页面状态对象
        stateCopy.key = getStateKey(); // 页面 key 还是需要重置的
        history.replaceState(stateCopy, '', url); // 重置路由
      } else { // 否则是追加路由
        history.pushState({ key: setStateKey(genStateKey()) }, '', url);
      }
    } catch (e) { // 如果被限制了的话, 直接通过 location 方式
      window.location[replace ? 'replace' : 'assign'](url);
    }
  }

  // 替换路由 - 通过 history 方式
  function replaceState (url) {
    pushState(url, true);
  }

  /*  */

  function runQueue (queue, fn, cb) {
    var step = function (index) {
      if (index >= queue.length) {
        cb();
      } else {
        if (queue[index]) {
          fn(queue[index], function () {
            step(index + 1);
          });
        } else {
          step(index + 1);
        }
      }
    };
    step(0);
  }

  // When changing thing, also edit router.d.ts
  var NavigationFailureType = {
    redirected: 2,
    aborted: 4,
    cancelled: 8,
    duplicated: 16
  };

  function createNavigationRedirectedError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.redirected,
      ("Redirected when going from \"" + (from.fullPath) + "\" to \"" + (stringifyRoute(
        to
      )) + "\" via a navigation guard.")
    )
  }

  function createNavigationDuplicatedError (from, to) {
    var error = createRouterError(
      from,
      to,
      NavigationFailureType.duplicated,
      ("Avoided redundant navigation to current location: \"" + (from.fullPath) + "\".") // 避免到当前位置的冗余导航
    );
    // backwards compatible with the first introduction of Errors 向后兼容第一次引入错误
    error.name = 'NavigationDuplicated';
    return error
  }

  function createNavigationCancelledError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.cancelled,
      ("Navigation cancelled from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" with a new navigation.")
    )
  }

  function createNavigationAbortedError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.aborted,
      ("Navigation aborted from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" via a navigation guard.")
    )
  }

  function createRouterError (from, to, type, message) {
    var error = new Error(message);
    error._isRouter = true;
    error.from = from;
    error.to = to;
    error.type = type;

    return error
  }

  var propertiesToLog = ['params', 'query', 'hash'];

  function stringifyRoute (to) {
    if (typeof to === 'string') { return to }
    if ('path' in to) { return to.path }
    var location = {};
    propertiesToLog.forEach(function (key) {
      if (key in to) { location[key] = to[key]; }
    });
    return JSON.stringify(location, null, 2)
  }

  function isError (err) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1
  }

  function isNavigationFailure (err, errorType) {
    return (
      isError(err) &&
      err._isRouter &&
      (errorType == null || err.type === errorType)
    )
  }

  /*  */

  function resolveAsyncComponents (matched) {
    return function (to, from, next) {
      var hasAsync = false;
      var pending = 0;
      var error = null;

      flatMapComponents(matched, function (def, _, match, key) {
        // if it's a function and doesn't have cid attached,
        // assume it's an async component resolve function.
        // we are not using Vue's default async resolving mechanism because
        // we want to halt the navigation until the incoming component has been
        // resolved.
        if (typeof def === 'function' && def.cid === undefined) {
          hasAsync = true;
          pending++;

          var resolve = once(function (resolvedDef) {
            if (isESModule(resolvedDef)) {
              resolvedDef = resolvedDef.default;
            }
            // save resolved on async factory in case it's used elsewhere
            def.resolved = typeof resolvedDef === 'function'
              ? resolvedDef
              : _Vue.extend(resolvedDef);
            match.components[key] = resolvedDef;
            pending--;
            if (pending <= 0) {
              next();
            }
          });

          var reject = once(function (reason) {
            var msg = "Failed to resolve async component " + key + ": " + reason;
             warn(false, msg);
            if (!error) {
              error = isError(reason)
                ? reason
                : new Error(msg);
              next(error);
            }
          });

          var res;
          try {
            res = def(resolve, reject);
          } catch (e) {
            reject(e);
          }
          if (res) {
            if (typeof res.then === 'function') {
              res.then(resolve, reject);
            } else {
              // new syntax in Vue 2.3
              var comp = res.component;
              if (comp && typeof comp.then === 'function') {
                comp.then(resolve, reject);
              }
            }
          }
        }
      });

      if (!hasAsync) { next(); }
    }
  }

  function flatMapComponents (
    matched,
    fn
  ) {
    return flatten(matched.map(function (m) {
      return Object.keys(m.components).map(function (key) { return fn(
        m.components[key],
        m.instances[key],
        m, key
      ); })
    }))
  }

  function flatten (arr) {
    return Array.prototype.concat.apply([], arr)
  }

  var hasSymbol =
    typeof Symbol === 'function' &&
    typeof Symbol.toStringTag === 'symbol';

  function isESModule (obj) {
    return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
  }

  // in Webpack 2, require.ensure now also returns a Promise
  // so the resolve/reject functions may get called an extra time
  // if the user uses an arrow function shorthand that happens to
  // return that Promise.
  function once (fn) {
    var called = false;
    return function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (called) { return }
      called = true;
      return fn.apply(this, args)
    }
  }

  /*  */

  // history 各个构造器的基类
  var History = function History (router, base) {
    this.router = router; // 保存着 VueRouter 实例 - 保存着用户注册的相关信息
    this.base = normalizeBase(base); // 规范化 base 基路径 -- 最终解析成 /xx/xx
    // start with a route object that stands for "nowhere" 从一个表示“无处”的route对象开始
    /** 一个路由对象 (route object) 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的路由记录 (route records)
     * fullPath: '/',
     * hash: '',
     * matched: [],
     * meta: {},
     * path: '/',
     * query: {},
     * ...
     */
    this.current = START; // 初始化为一个初始路由
    // 添加一些属性, 暂时不知有何作用
    this.pending = null;
    this.ready = false;
    this.readyCbs = [];
    this.readyErrorCbs = [];
    this.errorCbs = [];
    this.listeners = [];
  };

  History.prototype.listen = function listen (cb) {
    this.cb = cb;
  };

  History.prototype.onReady = function onReady (cb, errorCb) {
    if (this.ready) {
      cb();
    } else {
      this.readyCbs.push(cb);
      if (errorCb) {
        this.readyErrorCbs.push(errorCb);
      }
    }
  };

  History.prototype.onError = function onError (errorCb) {
    this.errorCbs.push(errorCb);
  };

  // 跳转到指定路由, 渲染组件, 执行钩子 - 最终底层方法
  History.prototype.transitionTo = function transitionTo (
    location, // 需要匹配的路由路径
    onComplete, // 成功回调
    onAbort // 失败回调
  ) {
    var this$1 = this; // 实例引用

    var route;
    // catch redirect option https://github.com/vuejs/vue-router/issues/3201 抓重定向选择
    try {
      // this.current: 当前路由对象
      route = this.router.match(location, this.current); // 匹配路由 - 根据匹配的信息来创建一个路由对象
    } catch (e) {
      // 发现错误, 那么执行 errorCbs 错误回调集合 - 这个是用户注册的错误处理回调
      this.errorCbs.forEach(function (cb) {
        cb(e);
      });
      // Exception should still be thrown 仍然应该抛出异常
      throw e
    }
    var prev = this.current; // 上一下路由

    // 在上面, 我们已经根据匹配信息来创建了路由对象了, 那么还需要根据这个路由对象来执行组件守卫, 组件渲染, url 更新等操作
    this.confirmTransition(
      route,
      function () {
        this$1.updateRoute(route);
        onComplete && onComplete(route);
        this$1.ensureURL();
        this$1.router.afterHooks.forEach(function (hook) {
          hook && hook(route, prev);
        });

        // fire ready cbs once
        if (!this$1.ready) {
          this$1.ready = true;
          this$1.readyCbs.forEach(function (cb) {
            cb(route);
          });
        }
      },
      function (err) {
        if (onAbort) {
          onAbort(err);
        }
        if (err && !this$1.ready) {
          // Initial redirection should not mark the history as ready yet
          // because it's triggered by the redirection instead
          // https://github.com/vuejs/vue-router/issues/3225
          // https://github.com/vuejs/vue-router/issues/3331
          if (!isNavigationFailure(err, NavigationFailureType.redirected) || prev !== START) {
            this$1.ready = true;
            this$1.readyErrorCbs.forEach(function (cb) {
              cb(err);
            });
          }
        }
      }
    );
  };

  // 根据这个路由对象来执行组件守卫, 组件渲染, url 更新等操作
  History.prototype.confirmTransition = function confirmTransition (
    route, // 需要处理的路由对象
    onComplete,  // 成功回调
    onAbort // 失败回调
  ) {
    debugger;
    var this$1 = this; // VueRouter 路由器实例

    var current = this.current; // 当前路由 - 也就是上一个路由
    this.pending = route; // 等待渲染的路由对象
    var abort = function (err) {
      // changed after adding errors with
      // https://github.com/vuejs/vue-router/pull/3047 before that change,
      // redirect and aborted navigation would produce an err == null
      if (!isNavigationFailure(err) && isError(err)) {
        if (this$1.errorCbs.length) {
          this$1.errorCbs.forEach(function (cb) {
            cb(err);
          });
        } else {
          warn(false, 'uncaught error during route navigation:');
          console.error(err);
        }
      }
      onAbort && onAbort(err);
    };
    var lastRouteIndex = route.matched.length - 1; // 等待渲染路由的所有嵌套路由 - 最后一个索引
    var lastCurrentIndex = current.matched.length - 1; // 上一个路由的所有嵌套路由集合的最后一个索引
    // 在这一段, 可以猜测为应该是路由完全相同的情况下, 不进行操作
    /**
     * 例如从 /bar/foo 跳转到 /bar/foo, 这时候我们是不需要处理的
     */
    if (
      isSameRoute(route, current) && // 比较两个路由是否相同
      // in the case the route map has been dynamically appended to 在这种情况下，路线图被动态地附加到
      lastRouteIndex === lastCurrentIndex && // 还需要比较两个是否存在相同的嵌套路由长度
      route.matched[lastRouteIndex] === current.matched[lastCurrentIndex] // 表示这个路由对应的用户注册路由信息是否相同, 在这里是直接通过 === 比较, 因为这里的对象都是 VueRouter 实例初始化的时候初始化的
    ) {
      this.ensureURL(); // 校正 url
      return abort(createNavigationDuplicatedError(current, route))
    }

    // 解析我们需要更新的路由信息 - 因为有一些路由是复用的, 并不是所有的路由都需要处理
    /**
     * 例如: /foo/bar 到 /foo/xxx 的时候, 我们不需要去处理 /foo 对应的路由信息
     */
    var ref = resolveQueue(
      this.current.matched,
      route.matched
    );
      var updated = ref.updated; // 需要更新的路由信息 - 此时可能由于路由复用产生了 query 和 params 变动
      var deactivated = ref.deactivated; // 失活的路由信息
      var activated = ref.activated; // 激活的路由信息

    // 解析守卫的队列 - 我们需要根据上述解析出的各种路由信息来收集需要执行的队列
    var queue = [].concat(
      // in-component leave guards 在组件离开守卫
      extractLeaveGuards(deactivated),
      // global before hooks 全局钩子之前
      this.router.beforeHooks,
      // in-component update hooks 在组件更新钩子
      extractUpdateHooks(updated),
      // in-config enter guards 进行守卫
      activated.map(function (m) { return m.beforeEnter; }),
      // async components 异步组件
      resolveAsyncComponents(activated)
    );

    var iterator = function (hook, next) {
      if (this$1.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      try {
        hook(route, current, function (to) {
          if (to === false) {
            // next(false) -> abort navigation, ensure current URL
            this$1.ensureURL(true);
            abort(createNavigationAbortedError(current, route));
          } else if (isError(to)) {
            this$1.ensureURL(true);
            abort(to);
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort(createNavigationRedirectedError(current, route));
            if (typeof to === 'object' && to.replace) {
              this$1.replace(to);
            } else {
              this$1.push(to);
            }
          } else {
            // confirm transition and pass on the value
            next(to);
          }
        });
      } catch (e) {
        abort(e);
      }
    };

    runQueue(queue, iterator, function () {
      // wait until async components are resolved before
      // extracting in-component enter guards
      var enterGuards = extractEnterGuards(activated);
      var queue = enterGuards.concat(this$1.router.resolveHooks);
      runQueue(queue, iterator, function () {
        if (this$1.pending !== route) {
          return abort(createNavigationCancelledError(current, route))
        }
        this$1.pending = null;
        onComplete(route);
        if (this$1.router.app) {
          this$1.router.app.$nextTick(function () {
            handleRouteEntered(route);
          });
        }
      });
    });
  };

  History.prototype.updateRoute = function updateRoute (route) {
    this.current = route;
    this.cb && this.cb(route);
  };

  History.prototype.setupListeners = function setupListeners () {
    // Default implementation is empty
  };

  History.prototype.teardown = function teardown () {
    // clean up event listeners
    // https://github.com/vuejs/vue-router/issues/2341
    this.listeners.forEach(function (cleanupListener) {
      cleanupListener();
    });
    this.listeners = [];

    // reset current history route
    // https://github.com/vuejs/vue-router/issues/3294
    this.current = START;
    this.pending = null;
  };

  // 规范化 base 基路径 -- 最终解析成 /xx/xx
  function normalizeBase (base) {
    if (!base) { // 如果不存在基路径的话
      if (inBrowser) { // 在浏览器环境下,就需要尝试在 base 标签中查找是否定义了
        // respect <base> tag 尊重<基础>标记
        var baseEl = document.querySelector('base'); // 查找 base 标签
        base = (baseEl && baseEl.getAttribute('href')) || '/'; // 尝试找到 href 属性, 没有则定义为 /
        // strip full URL origin strip完整的URL来源
        base = base.replace(/^https?:\/\/[^\/]+/, ''); // 如果 base 是一个 https? 开头的, 则将其去掉
      } else {
        base = '/'; // 否则直接置为 /
      }
    }
    // make sure there's the starting slash 确保有起始斜杠
    if (base.charAt(0) !== '/') { // 如果开头不是 / 
      base = '/' + base; // 则添加 / 开头
    }
    // remove trailing slash 去除末尾斜杠
    return base.replace(/\/$/, '')
  }

  // 解析我们需要更新的路由信息 - 因为有一些路由是复用的, 并不是所有的路由都需要处理
  /**
   * 例如: /foo/bar 到 /foo/xxx 的时候, 我们不需要去处理 /foo 对应的路由信息
   */
  function resolveQueue (
    current, // 上一个路由
    next // 渲染路由 - 下一个路由
  ) {
    var i;
    var max = Math.max(current.length, next.length); // 找出长度最大值
    /**
     * 假设 /foo/bar 跳转到 /foo/xxx/xxx 的时候, 我们 current 为 [/foo, /foo/bar], 而 next 为 [/foo, /foo/xxx, /foo/xxx/xxx]
     * 我们观察这样的数据结构, 我们就知道最顶端是不需要更新的, 此时我们需要找出两个数组开始不同的地方
     */
    for (i = 0; i < max; i++) { // 从前往后遍历
      if (current[i] !== next[i]) { // 当存在两者不一致的时候, 此时我们就找出了需要更新的路由信息
        break
      }
    }
    return {
      updated: next.slice(0, i), // 需要更新的路由信息集合
      activated: next.slice(i), // 激活的路由信息集合
      deactivated: current.slice(i) // 失活的路由信息集合
    }
  }

  function extractGuards (
    records,
    name,
    bind,
    reverse
  ) {
    var guards = flatMapComponents(records, function (def, instance, match, key) {
      var guard = extractGuard(def, name);
      if (guard) {
        return Array.isArray(guard)
          ? guard.map(function (guard) { return bind(guard, instance, match, key); })
          : bind(guard, instance, match, key)
      }
    });
    return flatten(reverse ? guards.reverse() : guards)
  }

  function extractGuard (
    def,
    key
  ) {
    if (typeof def !== 'function') {
      // extend now so that global mixins are applied.
      def = _Vue.extend(def);
    }
    return def.options[key]
  }

  function extractLeaveGuards (deactivated) {
    return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
  }

  function extractUpdateHooks (updated) {
    return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
  }

  function bindGuard (guard, instance) {
    if (instance) {
      return function boundRouteGuard () {
        return guard.apply(instance, arguments)
      }
    }
  }

  function extractEnterGuards (
    activated
  ) {
    return extractGuards(
      activated,
      'beforeRouteEnter',
      function (guard, _, match, key) {
        return bindEnterGuard(guard, match, key)
      }
    )
  }

  function bindEnterGuard (
    guard,
    match,
    key
  ) {
    return function routeEnterGuard (to, from, next) {
      return guard(to, from, function (cb) {
        if (typeof cb === 'function') {
          if (!match.enteredCbs[key]) {
            match.enteredCbs[key] = [];
          }
          match.enteredCbs[key].push(cb);
        }
        next(cb);
      })
    }
  }

  /*  */

  var HTML5History = /*@__PURE__*/(function (History) {
    function HTML5History (router, base) {
      History.call(this, router, base);

      this._startLocation = getLocation(this.base);
    }

    if ( History ) HTML5History.__proto__ = History;
    HTML5History.prototype = Object.create( History && History.prototype );
    HTML5History.prototype.constructor = HTML5History;

    HTML5History.prototype.setupListeners = function setupListeners () {
      var this$1 = this;

      if (this.listeners.length > 0) {
        return
      }

      var router = this.router;
      var expectScroll = router.options.scrollBehavior;
      var supportsScroll = supportsPushState && expectScroll;

      if (supportsScroll) {
        this.listeners.push(setupScroll());
      }

      var handleRoutingEvent = function () {
        var current = this$1.current;

        // Avoiding first `popstate` event dispatched in some browsers but first
        // history route not updated since async guard at the same time.
        var location = getLocation(this$1.base);
        if (this$1.current === START && location === this$1._startLocation) {
          return
        }

        this$1.transitionTo(location, function (route) {
          if (supportsScroll) {
            handleScroll(router, route, current, true);
          }
        });
      };
      window.addEventListener('popstate', handleRoutingEvent);
      this.listeners.push(function () {
        window.removeEventListener('popstate', handleRoutingEvent);
      });
    };

    HTML5History.prototype.go = function go (n) {
      window.history.go(n);
    };

    HTML5History.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(location, function (route) {
        pushState(cleanPath(this$1.base + route.fullPath));
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      }, onAbort);
    };

    HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(location, function (route) {
        replaceState(cleanPath(this$1.base + route.fullPath));
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      }, onAbort);
    };

    HTML5History.prototype.ensureURL = function ensureURL (push) {
      if (getLocation(this.base) !== this.current.fullPath) {
        var current = cleanPath(this.base + this.current.fullPath);
        push ? pushState(current) : replaceState(current);
      }
    };

    HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
      return getLocation(this.base)
    };

    return HTML5History;
  }(History));

  // 从路径中截取除去 base 部分(如果 base 是在路径开头部分就需要去除)
  function getLocation (base) {
    var path = window.location.pathname; // 返回当前页面的路径和文件名(类似https://www.baidu.com/xx)
    // 如果 path 是以 base 开头的话
    if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
      path = path.slice(base.length); // 截取出除去 base 的部分
    }
    // window.location.search 包含URL参数的一个DOMString，开头有一个“?”。
    // window.location.hash 包含块标识符的DOMString，开头有一个“#”。
    return (path || '/') + window.location.search + window.location.hash
  }

  /*  */

  // 继承至 History 类
  var HashHistory = /*@__PURE__*/(function (History) {
    // 构造器
    function HashHistory (router, base, fallback) {
      // 借用 History 构造器 - 为实例添加一些一些属性
      History.call(this, router, base);
      /**
       * 在这下面, 都是因为需要将 url 规范为我们需要的样式
       * 因为用户输入 url 的模式不一致的, 但是我们需要尝试将其路由重置为 https://xx.xx.xx#/ 模式
       */

      // check history fallback deeplinking 检查历史回退深链接
      // fallback: 如果是回退至 hash 模式情况下
      // 需要通过 checkFallback 来判断是否重置路由, 如果通过 checkFallback 重置了路由, 那么就不需要继续进行路由的重置了
      if (fallback && checkFallback(this.base)) {
        return
      }
      // 规范下 url, 我们需要保证 url 是符合 https://xx.xx.xx#/xx/xx 形式前端路由的
      ensureSlash();
    }

    if ( History ) HashHistory.__proto__ = History; // 构造器也建立一个继承链
    HashHistory.prototype = Object.create( History && History.prototype ); // 原型链继承, 直接通过 Object.create() 方式, 简单快捷
    HashHistory.prototype.constructor = HashHistory; // 保持 constructor 指针引用

    // this is delayed until the app mounts
    // to avoid the hashchange listener being fired too early
    HashHistory.prototype.setupListeners = function setupListeners () {
      var this$1 = this;

      if (this.listeners.length > 0) {
        return
      }

      var router = this.router;
      var expectScroll = router.options.scrollBehavior;
      var supportsScroll = supportsPushState && expectScroll;

      if (supportsScroll) {
        this.listeners.push(setupScroll());
      }

      var handleRoutingEvent = function () {
        var current = this$1.current;
        if (!ensureSlash()) {
          return
        }
        this$1.transitionTo(getHash(), function (route) {
          if (supportsScroll) {
            handleScroll(this$1.router, route, current, true);
          }
          if (!supportsPushState) {
            replaceHash(route.fullPath);
          }
        });
      };
      var eventType = supportsPushState ? 'popstate' : 'hashchange';
      window.addEventListener(
        eventType,
        handleRoutingEvent
      );
      this.listeners.push(function () {
        window.removeEventListener(eventType, handleRoutingEvent);
      });
    };

    HashHistory.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(
        location,
        function (route) {
          pushHash(route.fullPath);
          handleScroll(this$1.router, route, fromRoute, false);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(
        location,
        function (route) {
          replaceHash(route.fullPath);
          handleScroll(this$1.router, route, fromRoute, false);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    HashHistory.prototype.go = function go (n) {
      window.history.go(n);
    };

    // 校正 url - 使 url 表现与路有对象表示一致
    HashHistory.prototype.ensureURL = function ensureURL (push) {
      var current = this.current.fullPath; // 当前路由的完整路径
      if (getHash() !== current) { // 当前 url 是否与路由对象的完整路径相同
        push ? pushHash(current) : replaceHash(current); // 校正 url
      }
    };

    // 获取当前路由对应的路径 - # 后面的部分
    HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
      return getHash() // 返回获取的 # 后面的路径 - 此为前端路由路径
    };

    return HashHistory;
  }(History));

  // 在这里, 由于是从 history 模式回退至 hash 模式
  // 此时需要根据 base 来将 url 重置为 /# 模式, 以用于前端路由跳转
  // 例如: https://xx.xx.xx/xx/xx -- base 为 https://xx.xx.xx
  // 此时解析出来的 location 为 /xx/xx, 不满足条件 /^\/#/(以 /# 开头) 匹配
  // 那么就需要重置 url 上的路由
  function checkFallback (base) {
    var location = getLocation(base); // 获取解析后的路径
    if (!/^\/#/.test(location)) { // 如果解析后的路径不是以 /# 开头的话
      window.location.replace(cleanPath(base + '/#' + location)); // 那么就规范下路径问题
      return true
    }
  }

  // 判断当前 hash 模式下 url 是否符合规则, 否则重置路由
  function ensureSlash () {
    var path = getHash(); // 获取 hash 值 - 不包含 # 部分
    if (path.charAt(0) === '/') { // 如果是以 / 开头的话, 则直接返回 true
      return true
    }
    replaceHash('/' + path); // 此时替换 hash 路由
    return false
  }

  // 获取 hash 值 - 不包含 #
  function getHash () {
    // We can't use window.location.hash here because it's not 我们不能用 window.location.hash 因为它不是
    // consistent across browsers - Firefox will pre-decode it! 跨浏览器的一致性- Firefox将预解码它
    var href = window.location.href; // 由上注释可知, 需要 href 来获取 hash 值
    var index = href.indexOf('#'); // 找到 # 位置
    // empty path 空的路径
    if (index < 0) { return '' } // 如果不存在 # 的话, 那么就返回 ''

    href = href.slice(index + 1); // 截取出 hash 值

    return href
  }

  // 获取 url -- path 表示 hash 路由, 根据 path 传入的, 拼接出 url
  function getUrl (path) {
    var href = window.location.href; // 当前完整 url
    var i = href.indexOf('#'); // 找到 # 位置
    var base = i >= 0 ? href.slice(0, i) : href; // 截取出除去 # 后面的信息
    return (base + "#" + path) // 拼接出完整 url
  }

  function pushHash (path) {
    if (supportsPushState) {
      pushState(getUrl(path));
    } else {
      window.location.hash = path;
    }
  }

  // 替换 hash - 如果支持 history 形式替换就使用, 否则回退使用 location 方式
  function replaceHash (path) {
    if (supportsPushState) { // 是否支持 history 追加历史记录
      // getUrl(path): 获取 url -- path 表示 hash 路由, 根据 path 传入的, 拼接出 url
      replaceState(getUrl(path)); // 替换路由
    } else { // 否则直接使用 replace 方法
      window.location.replace(getUrl(path));
    }
  }

  /*  */

  var AbstractHistory = /*@__PURE__*/(function (History) {
    function AbstractHistory (router, base) {
      History.call(this, router, base);
      this.stack = [];
      this.index = -1;
    }

    if ( History ) AbstractHistory.__proto__ = History;
    AbstractHistory.prototype = Object.create( History && History.prototype );
    AbstractHistory.prototype.constructor = AbstractHistory;

    AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      this.transitionTo(
        location,
        function (route) {
          this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
          this$1.index++;
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      this.transitionTo(
        location,
        function (route) {
          this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    AbstractHistory.prototype.go = function go (n) {
      var this$1 = this;

      var targetIndex = this.index + n;
      if (targetIndex < 0 || targetIndex >= this.stack.length) {
        return
      }
      var route = this.stack[targetIndex];
      this.confirmTransition(
        route,
        function () {
          var prev = this$1.current;
          this$1.index = targetIndex;
          this$1.updateRoute(route);
          this$1.router.afterHooks.forEach(function (hook) {
            hook && hook(route, prev);
          });
        },
        function (err) {
          if (isNavigationFailure(err, NavigationFailureType.duplicated)) {
            this$1.index = targetIndex;
          }
        }
      );
    };

    AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
      var current = this.stack[this.stack.length - 1];
      return current ? current.fullPath : '/'
    };

    AbstractHistory.prototype.ensureURL = function ensureURL () {
      // noop
    };

    return AbstractHistory;
  }(History));

  /*  */

  // VueRouter 构造器
  var VueRouter = function VueRouter (options) {
    if ( options === void 0 ) options = {}; // 如果 options 为空, 则将其置为 {}

    this.app = null;
    this.apps = [];
    this.options = options; // 路由配置项
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];
    // 操作用户注册路由表信息
    this.matcher = createMatcher(options.routes || [], this);

    var mode = options.mode || 'hash'; // 路由模式 - 默认为 hash
    // options.fallback: 当浏览器不支持 history.pushState 控制路由是否应该回退到 hash 模式
    // 但是在 this.fallback 中做了额外处理
    // -- true: 表示模式为 history 并且应该回退至 hash 模式下
    // -- false: 情况可能为: 不是 history 模式 | 支持 history 模式 | 不能回退至 history 模式
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false;
    if (this.fallback) { // 如果需要回退至 hash 模式下
      mode = 'hash';
    }
    if (!inBrowser) { // 不是浏览器环境
      mode = 'abstract'; // 也需要重置模式
    }
    this.mode = mode;

    // 根据模式不同, 来初始化不同的操作路由实例
    // this.history 存储着路由操作的方法, 用于操作路由跳转, 路由匹配, 组件渲染等工作
    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base);
        break
      case 'hash':
        // options.base: 应用的基路径
        this.history = new HashHistory(this, options.base, this.fallback);
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base);
        break
      default:
        {
          // 如果没有匹配到模式, 则发出错误警告
          // 这种可能场景是: 用户注册的 mode 选项不是上述三种中的任一种
          assert(false, ("invalid mode: " + mode));
        }
    }
  };

  var prototypeAccessors = { currentRoute: { configurable: true } };

  // 根据指定路径, 来匹配用户注册的路由信息, 并封装为路由对象
  VueRouter.prototype.match = function match (raw, current, redirectedFrom) {
    return this.matcher.match(raw, current, redirectedFrom) // 借用 matcher 内部封装 api 来操作用户注册信息进行匹配
  };

  prototypeAccessors.currentRoute.get = function () {
    return this.history && this.history.current
  };
  /**
   * 初始化监听路由操作, 只有当组件开始配置了 router 时, 才有需要进行路由初始化
   */
  VueRouter.prototype.init = function init (app /* Vue component instance */) {
      var this$1 = this; // VueRouter 实例引用

    
      assert(
        install.installed, // 插件是否实例化过
        "not installed. Make sure to call `Vue.use(VueRouter)` " + // 没有安装。确保调用' Vue.use(VueRouter) '
          "before creating root instance." // 在创建根实例之前
      );

    this.apps.push(app); // 将其推入到 app 集合中

    // set up app destroyed handler 设置app销毁处理程序
    // https://github.com/vuejs/vue-router/issues/2639
    app.$once('hook:destroyed', function () { // 监听当前 app 实例的销毁钩子
      // clean out app from this.apps array once destroyed 从这清理应用程序。应用程序数组一旦被破坏
      var index = this$1.apps.indexOf(app); // 找出当前 app 在 apps 集合的索引
      if (index > -1) { this$1.apps.splice(index, 1); } // 如果找到了, 那么在 apps 集合中删除该 app
      // ensure we still have a main app or null if no apps 确保我们仍然有一个主应用程序，如果没有应用程序，则为null
      // we do not release the router so it can be reused 我们释放路由器不是为了重复使用
      if (this$1.app === app) { this$1.app = this$1.apps[0] || null; } // 如果当前主应用程序 app 是该 app 的话, 那我们需要确保存在应用程序使用着这个路由器

      if (!this$1.app) { this$1.history.teardown(); } // 如果不存在了主应用程序 app 的话, 那说明没有应用程序使用这个路由器, 那么就将这个路由器注销掉, 将不再响应路由变化
    });

    // main app previously initialized 主应用程序已初始化
    // return as we don't need to set up new history listener 返回，因为我们不需要设置新的历史侦听器
    if (this.app) { // 当已经存在主应用程序时, 说明这个路由器已经初始化, 没有必要重复侦听路由变化
      return
    }

    this.app = app; // 设置主应用程序

    var history = this.history; // 操控路由的实例

    if (history instanceof HTML5History || history instanceof HashHistory) { // 如果是 HTML5History 实例 || HashHistory 实例 -- 在这种情况下
      var handleInitialScroll = function (routeOrError) {
        var from = history.current;
        var expectScroll = this$1.options.scrollBehavior;
        var supportsScroll = supportsPushState && expectScroll;

        if (supportsScroll && 'fullPath' in routeOrError) {
          handleScroll(this$1, routeOrError, from, false);
        }
      };
      var setupListeners = function (routeOrError) {
        history.setupListeners();
        handleInitialScroll(routeOrError);
      };
      history.transitionTo(
        history.getCurrentLocation(), // 需要匹配的路由路径 - 在 hash 模式下, 获取的是 # 后面的内部
        setupListeners,
        setupListeners
      );
    }

    history.listen(function (route) {
      this$1.apps.forEach(function (app) {
        app._route = route;
      });
    });
  };

  VueRouter.prototype.beforeEach = function beforeEach (fn) {
    return registerHook(this.beforeHooks, fn)
  };

  VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
    return registerHook(this.resolveHooks, fn)
  };

  VueRouter.prototype.afterEach = function afterEach (fn) {
    return registerHook(this.afterHooks, fn)
  };

  VueRouter.prototype.onReady = function onReady (cb, errorCb) {
    this.history.onReady(cb, errorCb);
  };

  VueRouter.prototype.onError = function onError (errorCb) {
    this.history.onError(errorCb);
  };

  VueRouter.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        this$1.history.push(location, resolve, reject);
      })
    } else {
      this.history.push(location, onComplete, onAbort);
    }
  };

  VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        this$1.history.replace(location, resolve, reject);
      })
    } else {
      this.history.replace(location, onComplete, onAbort);
    }
  };

  VueRouter.prototype.go = function go (n) {
    this.history.go(n);
  };

  VueRouter.prototype.back = function back () {
    this.go(-1);
  };

  VueRouter.prototype.forward = function forward () {
    this.go(1);
  };

  VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
    var route = to
      ? to.matched
        ? to
        : this.resolve(to).route
      : this.currentRoute;
    if (!route) {
      return []
    }
    return [].concat.apply(
      [],
      route.matched.map(function (m) {
        return Object.keys(m.components).map(function (key) {
          return m.components[key]
        })
      })
    )
  };

  VueRouter.prototype.resolve = function resolve (
    to,
    current,
    append
  ) {
    current = current || this.history.current;
    var location = normalizeLocation(to, current, append, this);
    var route = this.match(location, current);
    var fullPath = route.redirectedFrom || route.fullPath;
    var base = this.history.base;
    var href = createHref(base, fullPath, this.mode);
    return {
      location: location,
      route: route,
      href: href,
      // for backwards compat
      normalizedTo: location,
      resolved: route
    }
  };

  VueRouter.prototype.getRoutes = function getRoutes () {
    return this.matcher.getRoutes()
  };

  VueRouter.prototype.addRoute = function addRoute (parentOrRoute, route) {
    this.matcher.addRoute(parentOrRoute, route);
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation());
    }
  };

  VueRouter.prototype.addRoutes = function addRoutes (routes) {
    {
      warn(false, 'router.addRoutes() is deprecated and has been removed in Vue Router 4. Use router.addRoute() instead.');
    }
    this.matcher.addRoutes(routes);
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation());
    }
  };

  Object.defineProperties( VueRouter.prototype, prototypeAccessors );

  function registerHook (list, fn) {
    list.push(fn);
    return function () {
      var i = list.indexOf(fn);
      if (i > -1) { list.splice(i, 1); }
    }
  }

  function createHref (base, fullPath, mode) {
    var path = mode === 'hash' ? '#' + fullPath : fullPath;
    return base ? cleanPath(base + '/' + path) : path
  }

  VueRouter.install = install;
  VueRouter.version = '3.5.1';
  VueRouter.isNavigationFailure = isNavigationFailure;
  VueRouter.NavigationFailureType = NavigationFailureType;
  VueRouter.START_LOCATION = START;

  if (inBrowser && window.Vue) {
    window.Vue.use(VueRouter);
  }

  return VueRouter;

})));
