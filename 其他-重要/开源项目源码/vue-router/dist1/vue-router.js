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
 *      instances: {}, // 这个很重要, 是存储着路由对应的组件实例
 *      enteredCbs: {}, // 这个是组件内的进入守卫 beforeRouteEnter 中通过 next(vm => vm.xx) 访问实例时, 我们需要先存储着这个回调, 在渲染组件完成后在执行
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
 * 
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
 *    3.2 confirmTransition 方法: 在这个方法中, 我们通过 this.router.match 匹配到的路由对象, 来导航路由
 *        我们在这个方法内部, 会进行导航守卫的执行, 具体策略可见方法内部注释, 主要进行这样的工作: 
 *        1. 导航被触发。
 *        2. 在失活的组件里调用 beforeRouteLeave 守卫。
 *        3. 调用全局的 beforeEach 守卫。
 *        4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
 *        5. 在路由配置里调用 beforeEnter。
 *        6. 解析异步路由组件。
 *        7.在被激活的组件里调用 beforeRouteEnter。
 *        8.调用全局的 beforeResolve 守卫 (2.5+)。
 *        9. 导航被确认。
 *        10.调用全局的 afterEach 钩子。
 *        11. 触发 DOM 更新。
 *        12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
 * 
 * 4. 在初始化导航完成操作后, 我们通过 setupListeners 来侦听历史, 我们在内部优先侦听 popstate' 事件, 而 'hashchange' 是代替使用的
 *     popstate事件: 如下所述, 我们不会响应 this.push, 点击 routerLink 等方式的变化, 但是通过 go(n), back() 等方式就会响应到
 *      需要注意的是调用 history.pushState() 或 history.replaceState() 不会触发popstate事件。
 *      只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在Javascript代码中调用history.back()或者history.forward()方法）
 *     hashchange事件: 这个事件无论是怎样变化 url 的, 只要响应到 hash 变化就会响应, 这样的话在 VueRouter.prototype.push 相关方法中就会通过 transitionTo 去导航路由
 *      在 hashchange 事件中会重复调用 transitionTo 方法, 但是没有关系, 在这个方法中, 我们会对重复路由进行处理
 * 
 * 5. 这样我们就完成了初始化导航的操作, 接下来的导航无非是通过编程式导航, 手动修改 url 等方式来改变路由, 最终都是通过 transitionTo 方法来导航路由
 * 6. RouterLink 全局组件:
 *      在这个组件中, 通过依赖 this.$route 属性来监听 this.$route 属性变化, 因为这个 $route 已经通过 Vue 的方法来进行响应式数据的
 *      具体细则见组件注释
 * 7. RouterView 全局组件:
 *      在这里, 我们是通过递归查找 $parant 父组件来确定当前视图的路由层级, 从而渲染出相应的组件
 *      我们通过注入一个 registerRouteInstance 钩子, 而且在注册 VueRouter.install 方法中, 我们通过在组件的 beforeCreate 生命周期方法中执行这个钩子, 从而将组件实例添加到 instances 属性中
 *      但是我们还需要考虑缓存组件的问题, 从而使得问题复杂化, 在 vue 的 keep-alive 机制还不是很清楚, 暂时略过部分
 *      而且响应式也是一个问题, 但是这个还涉及到 函数式组件 问题, 唉
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

  // 合并对象
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

  // 对指定字符串解码
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

  // 默认反序列化查询参数方法
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

  // 判断当前路由是否包含目标路由, 也就是说, target 路由是否被激活, 无需精准匹配
  function isIncludedRoute (current, target) {
    return (
      current.path.replace(trailingSlashRE, '/').indexOf( 
        target.path.replace(trailingSlashRE, '/')
      ) === 0 &&
      (!target.hash || current.hash === target.hash) && // hash 一致
      queryIncludes(current.query, target.query) // query 一致
    )
  }

  // query 是否包含
  function queryIncludes (current, target) {
    for (var key in target) {
      if (!(key in current)) {
        return false
      }
    }
    return true
  }

  // 执行 beforeRouteEnter 守卫中 next 的回调, 将组件实例传入其中
  function handleRouteEntered (route) {
    for (var i = 0; i < route.matched.length; i++) { // 遍历这个路由对象中的嵌套路由
      var record = route.matched[i];
      for (var name in record.instances) { // record.instances: 对应的组件实例
        var instance = record.instances[name];
        var cbs = record.enteredCbs[name];
        if (!instance || !cbs) { continue } // 如果不存在组件实例 || 不存在beforeRouteEnter 守卫中 next 的回调, 那么跳出当前循环
        delete record.enteredCbs[name]; // 我们需要删除这个回调
        for (var i$1 = 0; i$1 < cbs.length; i$1++) {
          if (!instance._isBeingDestroyed) { cbs[i$1](instance); } // 如果当前组件组件不是被在销毁阶段的话, 那么就执行这个回调
        }
      }
    }
  }

  // RouterView 全局组件
  var View = {
    name: 'RouterView',
    functional: true, // 函数式组件
    props: {
      name: { // 如果 <router-view>设置了名称，则会渲染对应的路由配置中 components 下的相应组件。
        type: String,
        default: 'default'
      }
    },
    // 函数式组件中, _: createElement 生成 VNode 函数 | ref: context, 组件上下文
    /**
     * 在这里, 我们是通过递归查找 $parant 父组件来确定当前视图的路由层级, 从而渲染出相应的组件
     * 我们通过注入一个 registerRouteInstance 钩子, 而且在注册 VueRouter.install 方法中, 我们通过在组件的 beforeCreate 生命周期方法中执行这个钩子, 从而将组件实例添加到 instances 属性中
     * 但是我们还需要考虑缓存组件的问题, 从而使得问题复杂化, 在 vue 的 keep-alive 机制还不是很清楚, 暂时略过部分
     * 而且响应式也是一个问题, 但是这个还涉及到 函数式组件 问题, 唉
     */
    render: function render (_, ref) {
      var props = ref.props; // props
      var children = ref.children; // VNode 子节点的数组
      var parent = ref.parent; // 对父组件的引用
      var data = ref.data; // 递给组件的整个数据对象，作为 createElement 的第二个参数传入组件

      // used by devtools to display a router-view badge devtools用来显示路由器视图标签
      data.routerView = true; // 用于标识这是一个路由组件, 提供给 devtools 使用 -- 同时也是用来确定当前视图的层级

      // directly use parent context's createElement() function 直接使用父上下文的 createElement() 函数
      // so that components rendered by router-view can resolve named slots 这样，router-view 渲染的组件就可以解析命名槽
      var h = parent.$createElement;
      var name = props.name;
      var route = parent.$route; // 路由对象
      var cache = parent._routerViewCache || (parent._routerViewCache = {}); // 缓存路由组件

      // determine current view depth, also check to see if the tree 确定当前视图的深度，也检查是否有树
      // has been toggled inactive but kept-alive. 已被切换为不活动但仍保持活动状态
      var depth = 0; // 层级
      var inactive = false;
      while (parent && parent._routerRoot !== parent) { // 递归查找 parent, 确定当前视图在路由树中的层级
        var vnodeData = parent.$vnode ? parent.$vnode.data : {}; // 向上查找父组件
        if (vnodeData.routerView) { // 如果父组件中存在路由组件的话
          depth++; // 说明此时层级应该 +1
        }
        if (vnodeData.keepAlive && parent._directInactive && parent._inactive) { // 缓存组件 && 这之后应该是表示组件被停用状态
          inactive = true; // 不活动缓存组件
        }
        parent = parent.$parent; // 递归查找
      }
      data.routerViewDepth = depth; // 视图层级

      // render previous view if the tree is inactive and kept-alive 如果树处于非活动状态并保持活动状态，则呈现前一个视图
      if (inactive) { // 如果当前被缓存了的话
        var cachedData = cache[name];
        var cachedComponent = cachedData && cachedData.component;
        if (cachedComponent) { // 找到缓存的视图
          // #2301
          // pass props
          if (cachedData.configProps) { // 更新 props
            fillPropsinData(cachedComponent, data, cachedData.route, cachedData.configProps);
          }
          return h(cachedComponent, data, children) // 渲染
        } else {
          // render previous empty view 渲染之前的空视图
          return h()
        }
      }

      var matched = route.matched[depth]; // 提取出当前路由层级对应的路由信息
      var component = matched && matched.components[name]; // 提取出对应路由组件

      // render empty node if no matched route or no config component 如果没有匹配的路由或配置组件，则呈现空节点
      if (!matched || !component) { // 如果没有找到的话
        cache[name] = null; // 同时缓存到父组件中
        return h() // 呈现空节点
      }

      // cache component 缓存组件
      cache[name] = { component: component }; 

      // attach instance registration hook 附加实例注册钩子
      // this will be called in the instance's injected lifecycle hooks 这将在实例的注入生命周期钩子中被调用
      data.registerRouteInstance = function (vm, val) {
        // val 如果存在的话, 说明是初始化组件阶段 -- registerInstance(this, this) 说明
        // val could be undefined for unregistration 对于未注册，val可能是未定义的
        var current = matched.instances[name];
        if (
          (val && current !== vm) ||
          (!val && current === vm)
        ) {
          matched.instances[name] = val; // 我们将组件实例挂入到 instances 属性中
        }
      }

      // also register instance in prepatch hook 同样在 prepatch 钩子中注册实例
      // in case the same component instance is reused across different routes 如果同一个组件实例在不同的路由中被重用
      // prepatch: 组件更新钩子 - 函数式组件中, 我们是没有这些组件钩子的, 我们手动添加一个, 会在更新阶段调用
      ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
        matched.instances[name] = vnode.componentInstance; // 将组件实例注册到路由信息中
      };

      // register instance in init hook 在 init 钩子中注册实例
      // in case kept-alive component be actived when routes changed 以防 keep-alive 组件在路由改变时被激活
      data.hook.init = function (vnode) {
        if (vnode.data.keepAlive && // 缓存组件
          vnode.componentInstance && // 被实例化过
          vnode.componentInstance !== matched.instances[name] // 重新被实例的话
        ) {
          matched.instances[name] = vnode.componentInstance; // 将组件实例注册到路由信息中
        }

        // if the route transition has already been confirmed then we weren't 如果路线转换已经被确认，那么我们还没有
        // able to call the cbs during confirmation as the component was not 能够在确认过程中调用cbs，因为组件没有调用
        // registered yet, so we call it here. 还没登记，所以我们称之为这里
        handleRouteEntered(route); // 执行 beforeRouteEnter 守卫中 next 的回调, 将组件实例传入其中
      };

      var configProps = matched.props && matched.props[name]; // 路由参数是否需要通过组件参数形式
      // save route and configProps in cache 在缓存中保存路由和configProps
      if (configProps) {
        extend(cache[name], {
          route: route,
          configProps: configProps
        });
        fillPropsinData(component, data, route, configProps);
      }

      return h(component, data, children) // 渲染组件, 当传递 component 组件配置项时, h 方法内部会去进行组件生成
    }
  };

  // 解析 props
  function fillPropsinData (
    component, // 组件配置项
    data, // 组件数据
    route,  // 路由对象
    configProps // 配置 props 对象
  ) {
    // resolve props
    var propsToPass = data.props = resolveProps(route, configProps); // 解析出需要 props 传参
    if (propsToPass) {
      // clone to prevent mutation 克隆防止突变
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs 将未申报的道具作为attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }
  }

  // 解析 props
  function resolveProps (
    route, // 路由对象
    config // 配置 props 对象
  ) {
    switch (typeof config) {
      case 'undefined': // 不存在, 
        return // 返回空
      case 'object': // object
        return config // 直接返回
      case 'function': // 函数
        return config(route) // 则调用这个函数
      case 'boolean': // 布尔值
        return config ? route.params : undefined
      default: // 其他情况
        {
          warn( // 发出警告
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

  // 判断是否为数组方法
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

  var warnedCustomSlot; // 警告一次标识
  var warnedTagProp; // 警告一次标识
  var warnedEventProp; // 警告一次标识

  // 全局组件 router-link
  var Link = {
    name: 'RouterLink',
    props: {
      to: { // 表示目标路由的链接。
        type: toTypes,
        required: true // 必传项
      },
      tag: { // 渲染标签
        type: String,
        default: 'a' // 默认为 a 标签
      },
      custom: Boolean,
      exact: Boolean, // 是否精准匹配模式默认类名  -- 例如: <router-link to="/" exact></router-link> 这个链接只会在地址为 / 的时候被激活
      exactPath: Boolean, // 是否精准匹配 hash, query? -- 暂时没有暴露在 API 文档上
      append: Boolean, // 设置 append 属性后，则在当前 (相对) 路径前添加基路径
      replace: Boolean, // 设置 replace 属性的话，当点击时，会调用 router.replace() 而不是 router.push()，于是导航后不会留下 history 记录。
      activeClass: String, // 设置链接激活时使用的 CSS 类名。 默认值可以通过路由的构造选项 linkActiveClass 来全局配置 -- router-link-active
      exactActiveClass: String, // 配置当链接被精确匹配的时候应该激活的 class。注意默认值也是可以通过路由构造函数选项 linkExactActiveClass 进行全局配置的 -- router-link-exact-active
      // 无障碍属性
      ariaCurrentValue: { // 当链接根据精确匹配规则激活时配置的 aria-current 的值。这个值应该是 ARIA 规范中允许的 aria-current 的值。在绝大多数场景下，默认值 page 应该是最合适的。
        type: String,
        default: 'page'
      },
      event: { // 声明可以用来触发导航的事件。可以是一个字符串或是一个包含字符串的数组。
        type: eventTypes,
        default: 'click'
      }
    },
    /**
     * 我们判断一个组件是否响应式, 应该查看这个组件的渲染函数 render 中是否依赖了响应式对象, 此时就会观察到数据变动
     * 在这里, 我们依赖了 this.$route, 所以我们会在路由变化时我们可以动态响应
     */
    render: function render (h) {
      var this$1 = this; // 组件实例

      var router = this.$router; // 路由器 - VueRotuer 实例
      // this.$route 这个属性是一个响应式数据, 在 VueRouter.install 方法中注册插件时, 我们通过 
      // Vue.util.defineReactive(this, '_route', this._router.history.current) 添加了响应式数据, 并不会深度监听, 因为 this._router.history.current 这个对象是一个冻结对象
      // 但是我们这个 routerLink 收集了 $route 依赖, 那么我们就会在 $route 变化时, 重新渲染这个组件
      var current = this.$route; // 当前路由对象

      // 解析目标位置, 返回路径相关信息
      /**
       * location: 解析出 path, hash, query ... 信息
       * route: 匹配路由对象
       * href: 完整 url
       * ... 向后兼容属性
       */
      var ref = router.resolve(
        this.to,
        current,
        this.append
      );

      var location = ref.location;
      var route = ref.route;
      var href = ref.href;

      var classes = {}; // 使用类集合
      var globalActiveClass = router.options.linkActiveClass; // 全局配置 <router-link> 默认的激活的 class。
      var globalExactActiveClass = router.options.linkExactActiveClass; // 全局配置 <router-link> 默认的精确激活的 class。
      // Support global empty active class 支持全局空活动类
      var activeClassFallback =
        globalActiveClass == null ? 'router-link-active' : globalActiveClass; // 默认为 'router-link-active'
      var exactActiveClassFallback =
        globalExactActiveClass == null // 默认为 'router-link-exact-active'
          ? 'router-link-exact-active'
          : globalExactActiveClass;
      var activeClass = // 激活路由的最终类名, 先使用组件 prop
        this.activeClass == null ? activeClassFallback : this.activeClass;
      var exactActiveClass = // 精确激活路由的最终类名, 先使用组件 prop
        this.exactActiveClass == null
          ? exactActiveClassFallback
          : this.exactActiveClass;

      var compareTarget = route.redirectedFrom // 是否为重定向路由
        ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router) // 使用重定向来源创建一个路由对象
        : route;

      // 比较 current 和 compareTarget 路由, 也就是比较当前路由和 routerLink 精准匹配路由是否相同, 决定是否使用 exactActiveClass 精准匹配类
      classes[exactActiveClass] = isSameRoute(current, compareTarget, this.exactPath); 
      classes[activeClass] = this.exact || this.exactPath // 如果需要精准匹配
        ? classes[exactActiveClass] // 那么直接使用 exactActiveClass 精准匹配的结果
        : isIncludedRoute(current, compareTarget); // 否则比较下 path, hash, query

      var ariaCurrentValue = classes[exactActiveClass] ? this.ariaCurrentValue : null; // 无障碍属性

      // 点击事件处理器
      var handler = function (e) {
        if (guardEvent(e)) {
          if (this$1.replace) {
            router.replace(location, noop);
          } else {
            router.push(location, noop);
          }
        }
      };

      var on = { click: guardEvent }; // 添加点击事件
      if (Array.isArray(this.event)) { // this.event: 用来触发导航的事件
        this.event.forEach(function (e) { // 数组时, 遍历数组
          on[e] = handler;
        });
      } else {
        on[this.event] = handler;
      }

      // 组件的 data 属性
      var data = { class: classes };

      var scopedSlot =
        !this.$scopedSlots.$hasNormal && // $hasNormal vue内部属性, 应该是表示是否为正常插槽, 此时应该表示是否使用了作用域插槽
        this.$scopedSlots.default && // 默认插槽
        this.$scopedSlots.default({ // 如果是作用域插槽, 那么我们应该传递一些值给作用域插槽使用
          href: href,
          route: route,
          navigate: handler,
          isActive: classes[activeClass],
          isExactActive: classes[exactActiveClass]
        });

      // 这是当使用作用域插槽时, 我们就由插槽来决定 routerlink 的 VNode
      if (scopedSlot) {
        if ( !this.custom) {
          // 在Vue路由器4中，v-slot API将默认使用元素包装其内容。使用自定义的支柱来移除这个警告
          !warnedCustomSlot && warn(false, 'In Vue Router 4, the v-slot API will by default wrap its content with an <a> element. Use the custom prop to remove this warning:\n<router-link v-slot="{ navigate, href }" custom></router-link>\n');
          warnedCustomSlot = true;
        }
        if (scopedSlot.length === 1) { // 插槽需要提供一个根节点
          return scopedSlot[0] // 返回这个, 由插槽内容决定显示值
        } else if (scopedSlot.length > 1 || !scopedSlot.length) { // 如果具有多个, 那么我们需要发出提示
          {
            warn(
              false,
              // 正在尝试使用一个作用域插槽，但它没有提供确切的一个子。用span元素包装内容
              ("<router-link> with to=\"" + (this.to) + "\" is trying to use a scoped slot but it didn't provide exactly one child. Wrapping the content with a span element.")
            );
          }
          return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot) // 如果插槽没有返回返回节点, 则使用 '' : 使用 span 包括插槽
        }
      }

      {
        if ('tag' in this.$options.propsData && !warnedTagProp) {
          warn(
            false,
            // < Router -link>的标签道具已弃用，并已在Vue路由器4中移除。使用v-slot API删除此警告:https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link。
            // 这个警告是为了兼容 vueRouter 4
            "<router-link>'s tag prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link."
          );
          warnedTagProp = true;
        }
        if ('event' in this.$options.propsData && !warnedEventProp) {
          warn(
            false,
            // < Router -link>的事件道具已弃用，并已在Vue路由器4中移除。使用v-slot API删除此警告:https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link
            "<router-link>'s event prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link."
          );
          warnedEventProp = true;
        }
      }

      // 否则我们就将内部生成 VNode
      if (this.tag === 'a') { // 如果 tag 为 a 标签的话
        data.on = on; // 元素事件
        data.attrs = { href: href, 'aria-current': ariaCurrentValue }; // 元素属性
      } else {
        // find the first <a> child and apply listener and href 找到第一个子节点并应用listener和href
        var a = findAnchor(this.$slots.default); // 找到 children 表示的第一个 a 节点
        if (a) {
          // in case the <a> is a static node 如果是一个静态节点
          a.isStatic = false;
          var aData = (a.data = extend({}, a.data)); 
          aData.on = aData.on || {}; // 添加事件
          // transform existing events in both objects into arrays so we can push later 将两个对象中的现有事件转换为数组，以便稍后推送
          for (var event in aData.on) {
            var handler$1 = aData.on[event];
            if (event in on) {
              aData.on[event] = Array.isArray(handler$1) ? handler$1 : [handler$1];
            }
          }
          // append new listeners for router-link 为router-link添加新的监听器
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
          // doesn't have <a> child, apply listener to self 没有子节点，将listener应用到self
          data.on = on;
        }
      }

      // h 渲染 Vnode, this.$slots.default 表示子节点
      return h(this.tag, data, this.$slots.default)
    }
  };

  // 我们需要处理各种点击方式
  function guardEvent (e) {
    // don't redirect with control keys 不要用控制键重定向
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
    // don't redirect when preventDefault called 当 preventDefault 调用时不要重定向
    if (e.defaultPrevented) { return }
    // don't redirect on right click 不要用右键重定向
    if (e.button !== undefined && e.button !== 0) { return }
    // don't redirect if `target="_blank"` 如果'target="_blank"，不要重定向
    if (e.currentTarget && e.currentTarget.getAttribute) {
      var target = e.currentTarget.getAttribute('target');
      if (/\b_blank\b/i.test(target)) { return }
    }
    // this may be a Weex event which doesn't have this method 这可能是一个 Weex 事件，没有这个方法
    if (e.preventDefault) {
      e.preventDefault();
    }
    return true
  }

  // 找到 children 表示的第一个 a 节点
  function findAnchor (children) {
    if (children) { 
      var child;
      for (var i = 0; i < children.length; i++) { // 遍历 children
        child = children[i];
        if (child.tag === 'a') { // 如果找到
          return child // 直接返回这个节点 vnode
        }
        if (child.children && (child = findAnchor(child.children))) { // 否则, 我们就递归查找
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
      instances: {}, // 这个很重要, 是存储着路由对应的组件实例
      enteredCbs: {}, // 这个是组件内的进入守卫 beforeRouteEnter 中通过 next(vm => vm.xx) 访问实例时, 我们需要先存储着这个回调, 在渲染组件完成后在执行
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
   *   instances: {}, // 这个很重要, 是存储着路由对应的组件实例
   *   enteredCbs: {}, // 这个是组件内的进入守卫 beforeRouteEnter 中通过 next(vm => vm.xx) 访问实例时, 我们需要先存储着这个回调, 在渲染组件完成后在执行
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

  // 设置全局唯一 key
  function setStateKey (key) {
    return (_key = key)
  }

  /*  */

  // 保存着不同页面对应的 key
  var positionStore = Object.create(null);

  // 设置滚动相关信息, 主要是通过监听 popstate 事件, 每次页面变动时, 保存旧页面的滚动位置, 设置新页面的 key, 具体滚动行为应该在页面渲染 OK 后我们再处理的
  function setupScroll () {
    // Prevent browser scroll behavior on History popstate 防止浏览器滚动历史 popstate 行为
    // window.history.scrollRestoration: 允许web应用程序在历史导航上显式地设置默认滚动恢复行为, auto: 将恢复用户已滚动到的页面上的位置。 | manual: 未还原页上的位置。用户必须手动滚动到该位置。
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'; // 不需要浏览器滚动默认行为
    }
    // Fix for #1585 for Firefox 修复了 #1585 的 Firefox 浏览器
    // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678 添加第三个可选属性来解决safari https://bugs.webkit.org/show_bug.cgi?id=182678中的一个bug
    // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with 修复了 #2774 对从 Windows 文件共享加载的应用程序没有映射到网络驱动器的支持:替换位置。起源与
    // window.location.protocol + '//' + window.location.host
    // location.host contains the port and location.hostname doesn't 位置。host包含端口和位置。主机名不
    var protocolAndPath = window.location.protocol + '//' + window.location.host;
    var absolutePath = window.location.href.replace(protocolAndPath, '');
    // preserve existing history state as it could be overriden by the user 保留现有的历史状态，因为它可能会被用户覆盖
    var stateCopy = extend({}, window.history.state); // 复制一个 window.history.state 副本
    stateCopy.key = getStateKey();
    window.history.replaceState(stateCopy, '', absolutePath);
    // 设置侦听 popstate 事件侦听器
    // handlePopState 方法: 处理 popstate 事件, 保存旧页面的滚动位置, 设置新页面的 key
    window.addEventListener('popstate', handlePopState);
    return function () { // 返回一个取消这个历史侦听器的方法
      window.removeEventListener('popstate', handlePopState);
    }
  }

  // 处理滚动位置
  function handleScroll (
    router, // 路由器 - VueRouter
    to, // 即将要进入的目标 - 下一个路由
    from, // 当前导航正要离开的路由 - 上一个路由
    isPop // 是否使用以前的滚动位置 - 在通过浏览器前进后退的时候置为 true
  ) {
    if (!router.app) { // 如果该路由器应用程序
      return // 说明这个路由器是闲置状态
    }

    var behavior = router.options.scrollBehavior; // 用户定义滚动行为
    if (!behavior) { // 如果没有定义的话, 不做处理
      return
    }

    {
      // 检测用户定义是否为 true, 否则触发警告
      assert(typeof behavior === 'function', "scrollBehavior must be a function"); // scrollBehavior必须是一个函数
    }

    // wait until re-render finishes before scrolling 等到重新渲染完成后再滚动
    // 我们借助 $nextTick 方法来等待页面渲染 OK 后我们就可以做滚动位置的跳转
    router.app.$nextTick(function () {
      var position = getScrollPosition(); // 获取页面 key 对应的滚动位置 - 如果是新页面, 那么应该为 undefined
      // 调用 behavior 用户定义滚动方法, 来判断用户返回的滚动位置
      var shouldScroll = behavior.call(
        router, // 在路由器的上下文中执行
        to, // 下一个路由
        from, // 上一个路由
        isPop ? position : null
      );

      if (!shouldScroll) { // 如果返回为 false 值
        return
      }

      if (typeof shouldScroll.then === 'function') { // 如果返回一个 promise
        shouldScroll
          .then(function (shouldScroll) { // 成功态
            scrollToPosition((shouldScroll), position);
          })
          .catch(function (err) { // 失败态
            { // 发出错误
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

  // 处理 popstate 事件, 保存旧页面的滚动位置, 设置新页面的 key
  function handlePopState (e) {
    saveScrollPosition(); // 每次 url 响应的时候都需要保存当前页面的滚动位置 - 在这时候, 页面还没有重新渲染, 所以我们保存的是旧页面信息
    if (e.state && e.state.key) { // 但是 e.state 信息是对应的新页面
      setStateKey(e.state.key); // 此时我们就需要设置新页面 key
    }
  }

  // 获取当前页面 key 对应的滚动位置
  function getScrollPosition () {
    var key = getStateKey();
    // 获取当前页面的滚动位置
    if (key) {
      return positionStore[key]
    }
  }

  // 获取元素的位置
  function getElementPosition (el, offset) {
    var docEl = document.documentElement;
    /**
     * getBoundingClientRect用于获取某个元素相对于视窗的位置集合
     */
    var docRect = docEl.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - docRect.left - offset.x,
      y: elRect.top - docRect.top - offset.y
    }
  }

  // 验证滚动位置是否为 number 类型的对象
  function isValidPosition (obj) {
    return isNumber(obj.x) || isNumber(obj.y)
  }

  // 规范化滚动位置 position
  function normalizePosition (obj) {
    return {
      x: isNumber(obj.x) ? obj.x : window.pageXOffset,
      y: isNumber(obj.y) ? obj.y : window.pageYOffset
    }
  }

  // 规范化 offset 滚动位置, 我们需要返回 number 值
  function normalizeOffset (obj) {
    return {
      x: isNumber(obj.x) ? obj.x : 0,
      y: isNumber(obj.y) ? obj.y : 0
    }
  }

  // 判断是否为 number 类型
  function isNumber (v) {
    return typeof v === 'number'
  }

  var hashStartsWithNumberRE = /^#\d/;

  // 最终实现滚动行为 - 我们通过解析出滚动位置, 通过 window.scrollTo 原生方法来处理
  function scrollToPosition (
    shouldScroll, // 期望滚动位置
    position // 存储的滚动位置
  ) {
    var isObject = typeof shouldScroll === 'object';
    // shouldScroll.selector: 模拟“滚动到锚点” -- 例如: selector: to.hash
    if (isObject && typeof shouldScroll.selector === 'string') {
      // getElementById would still fail if the selector contains a more complicated query like #main[data-attr] getElementById仍然会失败，如果选择器包含一个更复杂的查询#main[data-attr]
      // but at the same time, it doesn't make much sense to select an element with an id and an extra selector 但与此同时，选择一个带有id和额外选择器的元素没有多大意义
      var el = hashStartsWithNumberRE.test(shouldScroll.selector) // $flow-disable-line
        ? document.getElementById(shouldScroll.selector.slice(1)) // $flow-disable-line
        : document.querySelector(shouldScroll.selector);

      // 找到锚点元素
      if (el) {
        var offset =
          shouldScroll.offset && typeof shouldScroll.offset === 'object'
            ? shouldScroll.offset
            : {};
        offset = normalizeOffset(offset); // 规范化 offset 滚动位置, 我们需要返回 number 值
        position = getElementPosition(el, offset); // 获取锚点的位置
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll); // 使用 shouldScroll 用户定义位置
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll); // 使用 shouldScroll 用户定义位置
    }

    // 我们在上面代码的目的就在于找出我们需要滚动的位置, 如果用户传入的 shouldScroll 有效, 优先使用
    if (position) {
      // $flow-disable-line
      /**
       * window.scrollTo: 滚动到文档中的某个坐标。
       * options 是一个包含三个属性的对象: behavior 表示滚动行为,支持参数 smooth(平滑滚动),instant(瞬间滚动),默认值auto
       */
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

  // 运行队列 queue
  /** 策略
   * 我们通过 step 方法执行每一项队列, 在每一项队列中将其处理流程转移到 fn 中, 在 fn 中通过回调来确定执行下一个队列的时机
   * 也就是说控制流程是这样的: step -> fn -> step
   */
  function runQueue (
    queue, // 队列
    fn, // 解析每个队列的回调
    cb // 运行完成队列 queue 后的回调
  ) {
    var step = function (index) {
      if (index >= queue.length) { // 如果已经运行完队列时, 那么我们此时就执行 cb 回调即可
        cb();
      } else { // 否则, 接着运行
        if (queue[index]) { // 如果队列中存在值的话, 那么我们就通过 fn 去处理这个值, 并且将执行下一个队列交给 fn 做为回调
          // 接下来控制流程转移到 fn 回调中
          fn(queue[index], function () {
            step(index + 1); // 我们在执行完每项队列值时, 通过回调形式我们就会执行下一个队列
          });
        } else { // 如果该队列项中为空(因为在之前的提取队列的过程, 我们并没有去除空项)
          step(index + 1); // 此时我们直接执行下一个队列
        }
      }
    };
    step(0); // 开始运行 - 从 0 开始
  }

  // When changing thing, also edit router.d.ts 当修改内容时，也要编辑 router.d.ts
  var NavigationFailureType = {
    redirected: 2, // next('/xx') || next({ path: '/xx' }) 重定向导航
    aborted: 4, // next(false) 终止导航
    cancelled: 8, // 有了新的导航
    duplicated: 16 // 冗余导航
  };

  // 创建错误对象, 代表路由导航时, 通过在守卫中 next('/xx') 重定向的错误信息
  function createNavigationRedirectedError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.redirected, // 错误编码
      // 重新定向时从 from.fullPath 到 to 通过导航守卫
      ("Redirected when going from \"" + (from.fullPath) + "\" to \"" + (stringifyRoute( // 提示信息
        to
      )) + "\" via a navigation guard.")
    )
  }

  // 创建错误对象, 代表是冗余导航, 例如 this.$router.push(this.route) 时导航到当前路由
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

  // 创建错误对象, 代表路由导航, 突然有了新的导航
  function createNavigationCancelledError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.cancelled,
      // 导航取消从 from.fullPath 到 to.fullPath 有了新的导航
      ("Navigation cancelled from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" with a new navigation.")
    )
  }

  // 创建错误对象, 代表路由导航时, 通过在守卫中 next(false) 终止导航
  function createNavigationAbortedError (from, to) {
    return createRouterError(
      from,
      to,
      NavigationFailureType.aborted,
      // 导航流产从 from.fullPath 到 to.fullPath 通过导航守卫
      ("Navigation aborted from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" via a navigation guard.")
    )
  }

  // 创建一个错误对象
  function createRouterError (from, to, type, message) {
    var error = new Error(message);
    error._isRouter = true; // 标识这个错误对象是这个库生成的
    error.from = from;
    error.to = to;
    error.type = type;

    return error
  }

  var propertiesToLog = ['params', 'query', 'hash'];

  // 序列化路由信息 - 用于提示用户信息
  function stringifyRoute (to) {
    if (typeof to === 'string') { return to }
    if ('path' in to) { return to.path }
    var location = {};
    propertiesToLog.forEach(function (key) {
      if (key in to) { location[key] = to[key]; }
    });
    return JSON.stringify(location, null, 2)
  }

  // 判断 err 是否为 Error 实例
  function isError (err) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1
  }

  // 判断是否为内部构造的错误
  // 如果传入了 errorType, 还需要比较 err 错误类型是否为 errorType 类型
  function isNavigationFailure (err, errorType) {
    return (
      isError(err) && // 是 Error 实例
      err._isRouter && // 是内部构造的错误
      (errorType == null || err.type === errorType)
    )
  }

  /*  */

  // 解析异步组件
  /**
   * 策略: 我们通过遍历 matched 路由信息集合, 来遍历执行需要解析的异步组件, 我们通过 pending 变量来判断需要解析的异步组件个数, 当最终为 0 时, next 执行下一步
   *       我们通过解析 promise, 还可能是回调形式, 但是最终会执行 resolve/reject 方法解析, 在这个方法获取到我们需要的组件配置
   *       并且我们将解析后的组件配置覆盖原来的路由注册组件 match.components[key] = resolvedDef; 这样我们就只需要解析一次
   *       如果在发生错误的时候, 那么在 reject 内部, 就会去调用 next(error) 来通知外部, 那么就会造成导航失败
   */
  function resolveAsyncComponents (matched) {
    // 返回一个函数 - 我们先需要执行各个离开守卫, 然后我们再来进行解析异步组件的步骤
    return function (to, from, next) {
      var hasAsync = false; // 是否为异步组件
      var pending = 0; // 异步组件的个数
      var error = null;

      // 我们借助 flatMapComponents 方法来执行每个路由信息表示的组件
      flatMapComponents(matched, 
        function (
          def, // 组件配置项
          _, // 组件实例 - 如果存在的话
          match, // 路由信息
          key // 命名视图的 key
        ) {
          // if it's a function and doesn't have cid attached, 如果它是一个函数，没有 cid 连接
          // assume it's an async component resolve function. 假设它是一个异步组件解析函数
          // we are not using Vue's default async resolving mechanism because 我们没有使用 Vue 默认的异步解析机制，因为
          // we want to halt the navigation until the incoming component has been 我们想要停止导航，直到传入的组件已经完成
          // resolved. 解决
          // 从注释可以看出, 我们并没有使用 vue 的异步组件机制, 而自己实现
          if (typeof def === 'function' && def.cid === undefined) { // def.cid: 如果存在, 表示是 Vue 构造器或子类
            hasAsync = true; // 此时存在异步组件
            pending++; // 异步组件的个数 + 1

            // 通过 once 保证我们只执行这个 fn 回调一次, 因为 resolve/reject 可能多次执行
            // 成功回调
            var resolve = once(function (resolvedDef) {
              if (isESModule(resolvedDef)) {
                resolvedDef = resolvedDef.default; // 如果是模块机制, 那么我们就取 default
              }
              // save resolved on async factory in case it's used elsewhere 保存在异步工厂上的解析，以防它在其他地方使用
              def.resolved = typeof resolvedDef === 'function' // 如果是一个函数
                ? resolvedDef // 那么直接返回
                : _Vue.extend(resolvedDef); // 创建 Vue 子类
              match.components[key] = resolvedDef; // 将异步组件解析后的结果附加在 components 上, 因为只需要解析一次异步组件, 解析完成后覆盖掉
              pending--; // 将异步组件的次数 -1
              if (pending <= 0) { // 如果没有需要解析的异步组件后
                next(); // 那么我们直接执行下一步
              }
            });

            var reject = once(function (reason) {
              var msg = "Failed to resolve async component " + key + ": " + reason; // 解析异步组件失败
              warn(false, msg); // 发出警告
              // 我们需要保证只会发射一次错误, 因为重复调用 next(error) 是会出现问题的
              if (!error) { // 如果不存在错误
                error = isError(reason)
                  ? reason
                  : new Error(msg);
                next(error);
              }
            });

            /**
             * 异步路由的方式: 
             * (resolve, reject) => { resolve({组件配置}) } -- 通过回调形式
             * () => new Promise(resolve({组件配置})) -- promise 形式
             */
            var res;
            try { // 
              res = def(resolve, reject); // 解决 回调形式 异步组件
            } catch (e) {
              reject(e); // 如果出错的话, 通过 reject 处理
            }
            if (res) { // 存在返回值
              if (typeof res.then === 'function') { // 返回一个 promise 的话
                res.then(resolve, reject);
              } else {
                // new syntax in Vue 2.3 Vue 2.3中的新语法
                // 如果返回的是一个异步组件形式, 还需要解析这个异步组件, 总而言之, 我们需要的是一个最终的路由配置对象
                var comp = res.component; 
                if (comp && typeof comp.then === 'function') {
                  comp.then(resolve, reject);
                }
              }
            }
          }
        });

      if (!hasAsync) { next(); } // 如果不存在异步组件的话, 那我们直接执行下一步
    }
  }

  // 封装处理 路由信息集合, 通过 fn 回调决定返回我们需要的组件内信息
  function flatMapComponents (
    matched, // 路由信息集合
    fn // 回调
  ) {
    return flatten(matched.map(function (m) { // 遍历 mathched 数组, 并返回特定格式
      // 遍历路由信息的 components 数组
      return Object.keys(m.components).map(function (key) { return fn( // 我们抽取出一些数据, 传递给 fn 回调, 让 fn 回调决定我们需要哪些内容
        m.components[key], // 组件 value
        m.instances[key], // 这个很重要, 是存储着路由对应的组件实例
        m, // 路由信息
        key // 命名视图的 key, 默认为 default
      ); })
    }))
  }

  // 拍平数组, 但是只能将二维数组拍平为一维数组 -- 例如: [1, [2, 3, [4, 5]]] -- [1, 2, 3, [4, 5]]
  function flatten (arr) {
    return Array.prototype.concat.apply([], arr) // 借用 concat 方法
  }

  // 是否支持 symbol
  var hasSymbol =
    typeof Symbol === 'function' &&
    typeof Symbol.toStringTag === 'symbol';

  // 判断是模块形式
  function isESModule (obj) {
    return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
  }

  // in Webpack 2, require.ensure now also returns a Promise 在 Webpack 2中，require。确保现在也返回一个承诺
  // so the resolve/reject functions may get called an extra time 因此，resolve/reject函数可能会被多调用一段时间
  // if the user uses an arrow function shorthand that happens to 如果用户使用箭头函数，就会发生
  // return that Promise. 返回这一承诺
  function once (fn) {
    // 通过 called 变量保证我们只会执行这个函数一次
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
    this.pending = null; // 正在导航的路由
    this.ready = false; // 是否初始化导航结束
    this.readyCbs = []; // 监听初始化导航成功回调
    this.readyErrorCbs = []; // 监听初始化导航失败回调
    this.errorCbs = []; // 错误回调
    this.listeners = []; // 取消历史侦听器集合
  };

  // 监听路由导航成功
  History.prototype.listen = function listen (cb) {
    this.cb = cb; // 添加回调, 我们只需要一个监听器, 没有暴露给外部
  };

  // 该方法把一个回调排队，在路由完成初始导航时调用，这意味着它可以解析所有的异步进入钩子和路由初始化相关联的异步组件。
  // 也就是只会在初始化导航的时候有效
  History.prototype.onReady = function onReady (cb, errorCb) {
    if (this.ready) { // 如果已经初始化导航过
      cb(); // 那么就直接执行这个回调
    } else {
      this.readyCbs.push(cb); // 否则的话, 我们就将其推入到集合中
      if (errorCb) { // 如果还注册了错误回调的话
        this.readyErrorCbs.push(errorCb); // 也需要将其推入集合中
      }
    }
  };

  // 注册一个回调，该回调会在路由导航过程中出错时被调用。
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
      route, // 渲染路由
      function () { // 成功回调
        this$1.updateRoute(route); // 更新 this.current 当前路由的引用
        onComplete && onComplete(route); // 导航成功回调
        this$1.ensureURL(); // 通过 this.current 当前路由来修正 url

        // 我们在这里执行 afterEach 全局后置守卫
        this$1.router.afterHooks.forEach(function (hook) {
          hook && hook(route, prev); // 直接执行这个守卫即可
        });

        // fire ready cbs once 可点火cbs一次
        // 如果存在监听初始化导航的回调, 那么只需要执行一次
        if (!this$1.ready) { // 是否初始化标识
          this$1.ready = true; // 置为 true, 只会执行一次
          this$1.readyCbs.forEach(function (cb) { // 执行 readyCbs 集合
            cb(route);
          });
        }
      },
      function (err) { // 失败回调
        if (onAbort) {
          onAbort(err); // 导航失败回调
        }
        if (err && !this$1.ready) { // 存在错误 && 是初始化导航过程失败
          // Initial redirection should not mark the history as ready yet 初始重定向不应该将历史记录标记为已经准备好
          // because it's triggered by the redirection instead 因为它是由重定向触发的
          // https://github.com/vuejs/vue-router/issues/3225
          // https://github.com/vuejs/vue-router/issues/3331
          if (!isNavigationFailure(err, NavigationFailureType.redirected) || prev !== START) { // 如果不是重导航错误 || 上一个路由不是初始路由 -- 我们在这样情况下才判断是需要处理的错误
            this$1.ready = true; // 置为 true
            this$1.readyErrorCbs.forEach(function (cb) { // 执行初始化导航失败回调
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
    var this$1 = this; // VueRouter 路由器实例

    var current = this.current; // 当前路由 - 也就是上一个路由
    this.pending = route; // 等待渲染的路由对象

    // 处理导航错误的情况
    var abort = function (err) {
      // changed after adding errors with 在添加错误后更改
      // https://github.com/vuejs/vue-router/pull/3047 before that change, https://github.com/vuejs/vue-router/pull/3047 在此之前
      // redirect and aborted navigation would produce an err == null 重定向和中止导航将产生 err == null
      if (!isNavigationFailure(err) && isError(err)) { // 如果不是内部构造的 err && 是错误 error 实例
        if (this$1.errorCbs.length) { // 如果用户注册了错误回调
          this$1.errorCbs.forEach(function (cb) { // 那么就将错误抛给用户处理
            cb(err);
          });
        } else { // 如果没有注册错误回调, 那么就通过 console.error 直接抛出
          warn(false, 'uncaught error during route navigation:'); // uncaught error during route navigation: 导航时的未捕获错误
          console.error(err);
        }
      }
      onAbort && onAbort(err); // 将其交给 onAbort 导航失败回调
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
    /** 完整的导航解析流程
     * 导航被触发。
     * 在失活的组件里调用 beforeRouteLeave 守卫。
     * 调用全局的 beforeEach 守卫。
     * 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
     * 在路由配置里调用 beforeEnter。
     * 解析异步路由组件。
     * 在被激活的组件里调用 beforeRouteEnter。
     * 调用全局的 beforeResolve 守卫 (2.5+)。
     * 导航被确认。
     * 调用全局的 afterEach 钩子。
     * 触发 DOM 更新。
     * 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
     */
    /**
     * 1. 在失活的组件里调用 beforeRouteLeave 守卫 --- extractLeaveGuards(deactivated): 解析 beforeRouteLeave 离开守卫
     *       - 在这里的逻辑是, 直接从 deactivated 失活路由信息中提取出我们需要的执行的守卫信息, 在 deactivated 中都是已经渲染过的路由组件, 我们直接从组件中就可以提取出来的
     *         并且离开守卫是先执行 子路由 -> 父路由
     * 2. 调用全局的 beforeEach 守卫 --- this.router.beforeHooks: 全局的前置守卫
     * 3. 在重用的组件里调用 beforeRouteUpdate 守卫 --- extractUpdateHooks(updated): 重用的组件里调用 beforeRouteUpdate 守卫
     *       - 逻辑: 从 updated 更新路由信息集合中提取出 beforeRouteUpdate 守卫, 与离开守卫类似, 但是不同的是我们执行的时机是 父路由 -> 子路由
     * 4. 在路由配置里调用 beforeEnter --- activated.map(function (m) { return m.beforeEnter; }): 提取出路由独享的 beforeEnter 进入守卫
     *       - 我们只需要从 路由信息 中提取出 beforeEnter 选项即可
     * 5. 解析异步路由组件 --- resolveAsyncComponents(activated): 如果是刚激活的路由, 那么组件配置有可能是异步组件, 那么我们需要解析异步组件
     *       - 我们将内部解析异步组件, 而不是借助 vue 的异步组件机制
     * 接下来的导航过程在下面, 这里的队列到此为止, 因为异步路由的解析过程又是异步的, 所以我们需要重新建立一个队列机制
     */
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

    /** 这是我们执行每一项的方法 - 也就是执行守卫的方法
     * 在方法内部我们可以看到, 我们会将 route(对应 to 参数, 即将进入的路由), current(对应 from 参数, 即将离开的路由), fn(对应 next 参数, 决定导航行为)
     * 我们执行用户定义的守卫, 将控制权转移给用户的守卫中, 在守卫通过调用 next 方法, 又将控制权移交给我们,
     * 我们查看第三个参数 next, fn 回调的时候可以看到, 我们接收用户传入的 to 参数, 用来决定导航行为, 通过 to 参数的不同, 策略就不同
     * 1. 如果是 next(false) 的时候 -- 导航失败, 交给 abort 处理, 并通过 ensureURL 方法修正 url, 此时退出队列执行
     * 2. 如果是 next(new Error()) 的时候 -- 导航失败, 类似 next(false)
     * 3. 如果是 next('/xx') || next({ path: '/xx', name: '/xx' }) 的时候 -- 导航重定向, 我们也需要通过 abort 方法通知导航重定向, 
     *    并且直接通过 this.replace 或 this.push 方法来重新触发导航操作, 此时守卫队列也不会在执行
     * 4. 其他情况, 一般为 next() 情况, 此时继续执行下一个守卫队列
     */
    var iterator = function (
      hook, // 队列值
      next // 执行下一个队列的方法
    ) {
      // 在上面一点点地方, 会 this.pending = route 赋值
      // 此时有可能是有的新的导航, 那么我们此时就需要终止这个旧导航
      if (this$1.pending !== route) { // 如果当前处理的 route 路由不是正在导航的路由 pending
        return abort(createNavigationCancelledError(current, route)) // 那么就报错
      }
      try { // 将守卫中的错误捕获
        // 我们开始执行每一个钩子
        hook(
          route, // 下一个路由, 即是守卫中的 to 参数
          current,  // 正要离开的路由, 即是守卫中的 from 参数
          function (to) { // 调用该方法来 resolve 这个钩子
            if (to === false) { // 如果是 next(false) 的时候
              // next(false) -> abort navigation, ensure current URL 中止导航，确保当前URL
              /**
               * 例如我们手动修改 url, 从 /bar -> /foo, 此时 url 表现为 /foo, 假设在 /bar 的路由守卫中我们 next(false)
               * 此时我们应该终止路由导航, 就需要将 url 重置为 /bar, 此时通过 this.current 路由对象即可重置
               * 此时虽然会被 popstate(hashchange) 事件监听到, 但是在 popstate(hashchange) 事件处理器中, 我们会判断 this.current 如果是当前 url 的路由对象, 那么我们就不会处理这个 url 变动
               * 上面这个判断是错误的, 我们通过 ensureURL 重置 url 的时候, 因为如果是在 popstate(hashchange) 事件中重置的 url, 此时是不会重复触发 popstate(hashchange) 事件
               */
              this$1.ensureURL(true); // 通过 this.current 路由对象来修正 url
              abort(createNavigationAbortedError(current, route)); // 发出错误信息
            } else if (isError(to)) { // 如果是 next(new Error()) 的时候
              this$1.ensureURL(true); // 通过 this.current 路由对象来修正 url
              abort(to); // 直接使用用户定义的错误信息 to 来处理
            } else if ( // 如果是 next('/xx') || next({ path: '/xx', name: '/xx' })
              typeof to === 'string' ||
              (typeof to === 'object' &&
                (typeof to.path === 'string' || typeof to.name === 'string'))
            ) {
              // next('/') or next({ path: '/' }) -> redirect next('/')或next({path: '/'}) ->重定向
              abort(createNavigationRedirectedError(current, route));
              // 如果是重导航的情况的话, 那么我们就直接丢弃了这个钩子队列, 让其自行回收内存
              // 通过 this.replace 或 this.push 方法来重新触发导航操作
              // 那么为什么不通过 this$1.ensureURL(true) 修正路由呢? 因为我们还需要再次导航到 to 对应的路由
              if (typeof to === 'object' && to.replace) { // 如果是 replace 替换路由情况
                this$1.replace(to);
              } else {
                this$1.push(to);
              }
            } else { // 其他情况, 一般表示为正常导航
              // confirm transition and pass on the value 确认转换并传递值
              next(to); // 执行下一个队列
            }
          });
      } catch (e) { // 如果在守卫中出现错误了
        abort(e); // 那么就通过 abort 处理
      }
    };

    // 运行队列 queue
    /** 策略
     * 我们通过 step 方法执行每一项队列, 在每一项队列中将其处理流程转移到 fn 中, 在 fn 中通过回调来确定执行下一个队列的时机
     * 也就是说控制流程是这样的: step -> fn -> step
     */
    runQueue(queue, iterator, function () {
      // wait until async components are resolved before 等待异步组件之前被解析
      // extracting in-component enter guards 提取组件内的输入守卫
      /** 完整的导航解析流程
       * 导航被触发。
       * 在失活的组件里调用 beforeRouteLeave 守卫。
       * 调用全局的 beforeEach 守卫。
       * 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
       * 在路由配置里调用 beforeEnter。
       * 解析异步路由组件。
       * 在被激活的组件里调用 beforeRouteEnter。
       * 调用全局的 beforeResolve 守卫 (2.5+)。
       * 导航被确认。
       * 调用全局的 afterEach 钩子。
       * 触发 DOM 更新。
       * 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
       */
      /**
       * 在上面的 queue 队列中, 我们已经处理到解析异步组件完成, 那么接下来就是处理进入相关的守卫
       * 
       * 6. 在被激活的组件里调用 beforeRouteEnter --- extractEnterGuards(activated): 提取出 beforeRouteEnter 进入守卫
       *    -- 与其他组件守卫类似, 直接提取出来, 但是有一点特殊的, 就是这个守卫无法直接访问实例, 需要通过 next(vm => { // vm 组件实例 }) 访问
       *    -- 但是在这里, 我们的组件还没有初始化, 那么我们就先收集这个回调, 在组件初始化后在执行即可
       * 7. 调用全局的 beforeResolve 守卫 --- this$1.router.resolveHooks: 提取全局解析守卫 beforeResolve, 和 router.beforeEach 类似, 只是调用时机不同
       * 8. 调用全局的 afterEach 钩子 --- this$1.router.afterHooks: 我们在上面导航成功 onComplete 回调中执行这个守卫, 直接执行即可, 这个守卫已经无法更改导航结果
       * 9. 触发 DOM 更新 --- 
       * 10. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入 --- handleRouteEntered(route) 这个方法完成
       *      --- 在 handleRouteEntered(route) 方法中, 我们通过判断 route.matched 嵌套路由记录判断每个路由信息的 enteredCbs 属性中是否存在 next 回调, 因为我们会将 next 的回调收集到 enteredCbs 属性中
       *      --- 而组件实例则存在于 instances 属性中, 这样我们 next 回调和 vm 组件实例的元素就存在了, 只需要执行这个 next 回调并传入 vm 实例即可
       */
      var enterGuards = extractEnterGuards(activated); // 提取 beforeRouteEnter 进入守卫
      var queue = enterGuards.concat(this$1.router.resolveHooks); // 提取全局解析守卫 beforeResolve
      runQueue(queue, iterator, function () {
        // 走到这一步, 已经执行了全局的解析守卫, 导航已经被确定, 不同在通过 next(false) 形式取消导航了
        if (this$1.pending !== route) { // 如果当前处理的 route 路由不是正在导航的路由 pending, 可能是存在新的导航
          return abort(createNavigationCancelledError(current, route)) // 导航失败回调
        }
        this$1.pending = null; // 将正在渲染的导航引用置为 null, 我们此时说明已经确定导航
        onComplete(route); // 执行导航成功回调
        if (this$1.router.app) {
          // 我们通过 $nextTick 来等待组件渲染好后, 执行 beforeRouteEnter 守卫中 next 回调
          this$1.router.app.$nextTick(function () {
            handleRouteEntered(route);
          });
        }
      });
    });
  };

  // 更新当前路由引用
  History.prototype.updateRoute = function updateRoute (route) {
    this.current = route; // 更新引用
    this.cb && this.cb(route); // 如果存在监听导航成功引用的话, 那么我们就执行这个监听器
  };

  // 应该由子类实现 - 抽象方法
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

  // 在路由信息集合中提取出指定 name 的值
  function extractGuards (
    records, // 组件信息集合
    name, // 提取信息 name
    bind, // 绑定守卫上下文指向对应的组件实例 - 如果存在实例的话
    reverse // 颠倒数组中元素的顺序
  ) {
    // flatMapComponents: 封装处理 路由信息集合, 通过 fn 回调决定返回我们需要的组件内信息
    var guards = flatMapComponents(records, function (def /** 组件选项 */, instance /** 组件对应的实例, 判断是否已经初始化 */, match /** 路由信息 */, key /** 命名视图的 key, 默认为 default */) { 
      var guard = extractGuard(def, name); // 提取出指定 name 的守卫
      if (guard) { // 如果存在的话
        return Array.isArray(guard) // 如果是一个数组
          ? guard.map(function (guard) { return bind(guard, instance, match, key); }) // 那么调用数组, 再去通过 bind 去绑定上下文组件 vm 实例
          : bind(guard, instance, match, key)
      }
    });
    // 我们通过 guards 已经提取好了我们需要的组件守卫
    return flatten(reverse ? guards.reverse() : guards) // flatten: 拍平二维数组, 
  }

  // 从组件中提取出指定的守卫
  /**
   * beforeRouteLeave: 离开守卫, 因为需要调用离开守卫的组件是已经被渲染过的, 所以如果我们注册的懒路由, 此时也是被渲染了的, 那么直接在组件中的去取用
   */
  function extractGuard (
    def, // 组件配置项
    key // 提取选项 name
  ) {
    if (typeof def !== 'function') { // 如果不等于 function 的时候
      // extend now so that global mixins are applied. 现在就扩展，以便应用全局混合
      def = _Vue.extend(def); // 在这里通过 extend 进行组件的选项的合并
    }
    return def.options[key] // 提取出指定的守卫
  }

  // 获取失活的组件离开守卫
  function extractLeaveGuards (deactivated) {
    // deactivated: 失活组件集合
    // beforeRouteLeave: 在组件中定义的离开守卫
    // bindGuard: 绑定守卫的上下文以及函数柯里化
    /**
     * 我们可以通过第四个参数 true 判断: 离开守卫是先执行子路由的
     * 因为我们 deactivated 的顺序是栈顶是父路由 -> 子路由, 在这里 true 表示颠倒解析后的守卫顺序, 那么就可以得出离开守卫是从 子路由 -> 父路由
     */
    return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
  }

  // 获取更新的组件更新守卫
  function extractUpdateHooks (updated) {
    /**
     * 与组件离开守卫类似
     * 但是我们没有传递第四个参数, 这样就不需要颠倒数组顺序, 那么我们执行的实际应该 父路由 -> 子路由
     */
    return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
  }

  // 绑定守卫的上下文以及函数柯里化
  function bindGuard (guard, instance) {
    if (instance) { // instance: 组件对应的组件实例, 如果是已经渲染过的组件
      // 如果存在组件实例的话, 那我们的守卫上下文 this 应该指向这个组件实例
      return function boundRouteGuard () {
        return guard.apply(instance, arguments)
      }
    }
  }

  // 获取激活路由的 beforeRouteEnter 进入守卫
  function extractEnterGuards (
    activated
  ) {
    return extractGuards(
      activated,
      'beforeRouteEnter',
      /** 
       * beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。
       * 不过，你可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
       */
      function (guard, _, match, key) { // 用于对守卫进行进一步封装, 绑定上下文, 以及在渲染 DOM 后将 vm 实例传递给 next 的回调中
        return bindEnterGuard(guard /**守卫 */, match /**路由信息 */, key /**命名视图的 key, 默认为 default */)
      }
    )
  }

  // 对 beforeRouteEnter 进入守卫进行进一步封装
  function bindEnterGuard (
    guard, // 守卫
    match, // 路由信息
    key // 命名视图
  ) {
    // 进行封装, 返回一个封装后的函数
    return function routeEnterGuard (to, from, next) {
      // 在这个函数内部, 执行守卫, 将 to, from, 原封不动的传递进去, 但是我们需要对 next 进行额外的处理
      return guard(to, from, function (cb) { // 我们需要传递一个
        if (typeof cb === 'function') { // 如果用户在守卫内部通过 next(vm => vm.xxx) 来访问 vm 实例时
          // 我们需要将 vm 组件实例作为参数传递进去
          if (!match.enteredCbs[key]) { // 在路由信息中存储着 enteredCbs 属性, 用于是否存在 beforeRouteEnter 进入守卫中引用了 vm 实例的
            match.enteredCbs[key] = [];
          }
          match.enteredCbs[key].push(cb); // 将这个回调存储起来, 将来执行
        }
        next(cb); // 我们成功将 cb 回调收集了起来, 之后我们继续 next, 将控制流程交给守卫队列执行机制
      })
    }
  }

  /*  */

  var HTML5History = /*@__PURE__*/(function (History) {
    // 构造器
    function HTML5History (router, base) {
      History.call(this, router, base); // 同样的, 通过 History 父类创建相关属性

      this._startLocation = getLocation(this.base); // 获取开始路径
    }

    if ( History ) HTML5History.__proto__ = History; // 构造器继承
    HTML5History.prototype = Object.create( History && History.prototype ); // 原型链继承
    HTML5History.prototype.constructor = HTML5History; // constructor 指针修复引用

    // 设置历史侦听器
    HTML5History.prototype.setupListeners = function setupListeners () {
      var this$1 = this;

      if (this.listeners.length > 0) { // 防止重复侦听
        return
      }

      var router = this.router; // VueRouter 实例, 路由器
      var expectScroll = router.options.scrollBehavior; // 用户自定义滚动行为
      var supportsScroll = supportsPushState && expectScroll;  // 是否支持 history.pushState 原生方法

      if (supportsScroll) {
        // 如果支持 history.pushState 方法, 并且用户需要控制滚动行为, 那么我们就通过 setupScroll 初始化滚动
        // 并且将  setupScroll() 返回值(返回一个取消 popstate 事件侦听器方法)推入到取消侦听器集合中
        this.listeners.push(setupScroll());
      }

      var handleRoutingEvent = function () {
        var current = this$1.current;

        // Avoiding first `popstate` event dispatched in some browsers but first 避免在某些浏览器中首先分派“popstate”事件
        // history route not updated since async guard at the same time. 由于异步保护，历史路由没有同时更新
        var location = getLocation(this$1.base);
        if (this$1.current === START && location === this$1._startLocation) {
          return
        }

        // 通过 transitionTo 导航路由
        this$1.transitionTo(location, function (route) {
          if (supportsScroll) {
            handleScroll(router, route, current, true); // 滚动行为
          }
        });
      };
      // 在 mode 为 history 模式时, 我们是选择侦听 popstate 事件
      window.addEventListener('popstate', handleRoutingEvent);
      this.listeners.push(function () {
        window.removeEventListener('popstate', handleRoutingEvent);
      });
    };

    // 导航路由, 与 HashHistory 方法相同
    HTML5History.prototype.go = function go (n) {
      window.history.go(n);
    };

    // 导航路由, 与 HashHistory 方法相同
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

    // 导航路由, 与 HashHistory 方法相同
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

    // 通过当前路由对象 this.current 来设置 url
    HTML5History.prototype.ensureURL = function ensureURL (push) {
      if (getLocation(this.base) !== this.current.fullPath) { // 如果当前 url 表现不是路由对象 fullPath 表示的路由,
        var current = cleanPath(this.base + this.current.fullPath);
        push ? pushState(current) : replaceState(current); // 那么就修正 url
      }
    };

    // 获取 location 路径
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

    // this is delayed until the app mounts 这将延迟到应用安装完成
    // to avoid the hashchange listener being fired too early 避免过早地触发 hashchange 监听器
    HashHistory.prototype.setupListeners = function setupListeners () {
      var this$1 = this;

      if (this.listeners.length > 0) { // 如果已经存在侦听器的话
        return
      }

      var router = this.router; // 路由器 - VueRouter 实例
      var expectScroll = router.options.scrollBehavior; // 控制滚动行为的方法
      var supportsScroll = supportsPushState && expectScroll; // 是否支持 history.pushState 原生方法

      if (supportsScroll) {
        // 如果支持 history.pushState 方法, 并且用户需要控制滚动行为, 那么我们就通过 setupScroll 初始化滚动
        // 并且将  setupScroll() 返回值(返回一个取消 popstate 事件侦听器方法)推入到取消侦听器集合中
        this.listeners.push(setupScroll());
      }

      // 事件处理器
      var handleRoutingEvent = function () {
        var current = this$1.current; // 当前路由对象
        if (!ensureSlash()) { // 判断当前 hash 模式下 url 是否符合规则, 否则重置路由 - 如果返回了 false, 那么 url 就会被重置, 就会再次触发历史事件, 那么这次的事件就略过
          return
        }
        // 通过 transitionTo 来进行路由的导航完成, 当导航完成时, 我们就会使用传入的回调
        // getHash(): 匹配路径
        this$1.transitionTo(getHash(), function (route) {
          // 路由导航成功后, 进行滚动位置的修正
          if (supportsScroll) {
            handleScroll(this$1.router, route, current, true); // 滚动行为
          }
          if (!supportsPushState) { // 如果不支持 history.pushstate 的话
            replaceHash(route.fullPath); // 那么就使用当前 url
          }
        });
      };
      /** 
       * popstate事件: 如下所述, 我们不会响应 this.push, 点击 routerLink 等方式的变化, 但是通过 go(n), back() 等方式就会响应到
       *  需要注意的是调用 history.pushState() 或 history.replaceState() 不会触发popstate事件。
       *  只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在Javascript代码中调用history.back()或者history.forward()方法）
       * 
       * hashchange事件: 这个事件无论是怎样变化 url 的, 只要响应到 hash 变化就会响应, 这样的话在 VueRouter.prototype.push 相关方法中就会通过 transitionTo 去导航路由
       *  在 hashchange 事件中会重复调用 transitionTo 方法, 但是没有关系, 在这个方法中, 我们会对重复路由进行处理
       */
      var eventType = supportsPushState ? 'popstate' : 'hashchange'; // 优先使用 popstate 事件
      window.addEventListener( // 侦听历史事件
        eventType,
        handleRoutingEvent
      );
      this.listeners.push(function () { // 将取消这个侦听器的方法推入到集合中
        window.removeEventListener(eventType, handleRoutingEvent);
      });
    };

    // 导航路由 - 追加历史记录
    HashHistory.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current; // 保存将要离开的路由 -- 上一个路由
      // 我们在这里不会通过 url 变化来触发历史监听器, 因为在 history.popstate 方法不会触发 popstate 事件
      // 而对于 hashchange 事件来讲, 虽然之后还是会触发历史监听器, 但是在内部我们已经处理了重复导航的问题, 所以不会存在问题
      // 所以我们在这里手动调用 transitionTo 方法来导航路由
      this.transitionTo(
        location,
        function (route) {
          pushHash(route.fullPath); // 导航成功后通过 pushHash 修正 url
          handleScroll(this$1.router, route, fromRoute, false); // 设置滚动位置
          onComplete && onComplete(route); // 执行成功回调
        }, 
        onAbort // 导航失败直接执行失败回调
      );
    };

    // 与 push 方法类似, 只会会替换路由
    HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(
        location,
        function (route) {
          replaceHash(route.fullPath); // 使用 replaceHash 方法替换 url
          handleScroll(this$1.router, route, fromRoute, false);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    // 直接通过 window.history.go 方式来触发历史侦听器, 这个相当于点击浏览器的回退按钮
    HashHistory.prototype.go = function go (n) {
      window.history.go(n);
    };

    // // 通过当前路由对象 this.current 来设置 url
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

    this.app = null; // 主应用程序
    this.apps = []; // 配置了这个路由器的应用程序
    this.options = options; // 路由配置项
    this.beforeHooks = []; // 全局离开守卫
    this.resolveHooks = []; // 全局解析守卫
    this.afterHooks = []; // 全局后置守卫
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

  // 在 VueRouter 上添加 currentRoute 属性 - 
  var prototypeAccessors = { currentRoute: { configurable: true } };

  // 根据指定路径, 来匹配用户注册的路由信息, 并封装为路由对象
  VueRouter.prototype.match = function match (raw, current, redirectedFrom) {
    return this.matcher.match(raw, current, redirectedFrom) // 借用 matcher 内部封装 api 来操作用户注册信息进行匹配
  };

  // 设置 VueRouter.prototype 上添加 currentRoute 的 getter, 用于获取当前路由对象
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
      // 处理初始滚动
      var handleInitialScroll = function (routeOrError) {
        var from = history.current; // 当前路由对象
        var expectScroll = this$1.options.scrollBehavior; // 滚动行为
        var supportsScroll = supportsPushState && expectScroll; // 是否支持 history.pushState 原生方法

        if (supportsScroll && 'fullPath' in routeOrError) {
          handleScroll(this$1, routeOrError, from, false); // 借助 handleScroll 方法进行滚动
        }
      };
      // 导航成功或失败都走这个回调 - 在这里我们会进行初始化历史侦听器, 以响应 url 的变化
      var setupListeners = function (routeOrError) {
        history.setupListeners(); // 设置历史侦听器
        handleInitialScroll(routeOrError);
      };
      history.transitionTo(
        history.getCurrentLocation(), // 需要匹配的路由路径 - 在 hash 模式下, 获取的是 # 后面的内部
        setupListeners,
        setupListeners
      );
    }

    // 监听路由导航成功
    history.listen(function (route) {
      // route: 导航成功的路由
      this$1.apps.forEach(function (app) {
        app._route = route; // 我们需要修正 app 应用程序的 _route 指向 route 路由对象, 保证通过 $route 访问 _route 的时候, 是正确的
      });
    });
  };

  // 添加全局前置守卫
  VueRouter.prototype.beforeEach = function beforeEach (fn) {
    // 通过 registerHook 添加
    return registerHook(this.beforeHooks, fn)
  };

  // 添加全局解析守卫
  VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
    return registerHook(this.resolveHooks, fn) // 添加到 resolveHooks 集合中
  };

  // 添加全局后置守卫
  VueRouter.prototype.afterEach = function afterEach (fn) {
    return registerHook(this.afterHooks, fn)
  };

  // 该方法把一个回调排队，在路由完成初始导航时调用，这意味着它可以解析所有的异步进入钩子和路由初始化相关联的异步组件。
  // 也就是只会在初始化导航的时候有效
  VueRouter.prototype.onReady = function onReady (cb, errorCb) {
    this.history.onReady(cb, errorCb);
  };

  // 注册一个回调，该回调会在路由导航过程中出错时被调用。
  VueRouter.prototype.onError = function onError (errorCb) {
    this.history.onError(errorCb);
  };

  // 导航路由 -- 这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。
  VueRouter.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') { // 如果没有注册成功失败回调 && 支持 promise 形式
      return new Promise(function (resolve, reject) { // 那么返回一个 promise
        this$1.history.push(location, resolve, reject); // 借助 history 实例跳转
      })
    } else {
      this.history.push(location, onComplete, onAbort);
    }
  };

  // 导航路由 -- 它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。
  VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') { // 如果没有注册成功失败回调 && 支持 promise 形式
      return new Promise(function (resolve, reject) { // 那么返回一个 promise
        this$1.history.replace(location, resolve, reject);
      })
    } else {
      this.history.replace(location, onComplete, onAbort); // 借助 history 实例跳转
    }
  };

  // 向前或者后退多少步
  VueRouter.prototype.go = function go (n) {
    this.history.go(n);
  };

  // 回退一步
  VueRouter.prototype.back = function back () {
    this.go(-1);
  };

  // 前进一步
  VueRouter.prototype.forward = function forward () {
    this.go(1);
  };

  // 返回目标位置或是当前路由匹配的组件数组 (是数组的定义/构造类，不是实例) -- 并没有在 API 文档上体现, 并且没有在内部使用
  VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
    var route = to // 如果传递了 to
      ? to.matched // 是否传递了一个路由对象进来
        ? to // 此时直接使用
        : this.resolve(to).route // 否则通过 resolve 方法解析
      : this.currentRoute; // 否则直接使用当前路由对象
    if (!route) { // 如果没有找到
      return []
    }
    return [].concat.apply(
      [],
      route.matched.map(function (m) { // 返回组件数组
        return Object.keys(m.components).map(function (key) {
          return m.components[key]
        })
      })
    )
  };

  // 解析目标位置, 返回路径相关信息, 路由对象等信息
  /**
   * location: 解析出 path, hash, query ... 信息
   * route: 匹配路由对象
   * href: 完成 url
   * ... 向后兼容属性
   */
  VueRouter.prototype.resolve = function resolve (
    to, // 去往的路径信息(例如: {name: 'xx'} || '/xx')
    current, // 当前默认的路由 (通常你不需要改变它)
    append // 在 current 路由上附加路径 (如同 router-link)
  ) {
    current = current || this.history.current; // 默认为当前路由
    var location = normalizeLocation(to, current, append, this); // 通过匹配信息和当前路由对象来解析出 path, hash, query ... 信息
    var route = this.match(location, current); // 匹配路由对象
    var fullPath = route.redirectedFrom || route.fullPath; // 优先使用重定向来源的路由的名字 || 自身路由 -- 如果是重定向的话, 那么我们需要重定向来源的路由的名字
    var base = this.history.base; // 基路由
    var href = createHref(base, fullPath, this.mode); // 创建一个最终路径
    return {
      location: location,
      route: route,
      href: href,
      // for backwards compat 为了向后兼容
      normalizedTo: location,
      resolved: route
    }
  };

  // 获取所有活跃的路由记录列表。
  VueRouter.prototype.getRoutes = function getRoutes () {
    return this.matcher.getRoutes()
  };

  // 添加一条新路由规则。如果该路由规则有 name，并且已经存在一个与之相同的名字，则会覆盖它。 -- addRoute(route: RouteConfig): () => void
  // 添加一条新的路由规则记录作为现有路由的子路由。如果该路由规则有 name，并且已经存在一个与之相同的名字，则会覆盖它。 -- addRoute(parentName: string, route: RouteConfig): () => void
  VueRouter.prototype.addRoute = function addRoute (parentOrRoute, route) {
    this.matcher.addRoute(parentOrRoute, route); // 通过 this.matcher 去完成这个操作
    /** 
     * this.history.current === START 如果条件满足
     * 说明还没有完成初始导航
     * 或者路由器被卸载
     */
    if (this.history.current !== START) { // 这一步是因为, 如果当前路由对象不是初始路由, 说明初始导航还没有完成
      this.history.transitionTo(this.history.getCurrentLocation()); // 总之我们需要重新导航一次, 因为当前路由可能使我们刚添加进来的
    }
  };

  // 动态添加更多的路由规则。 -- 已废弃：使用 router.addRoute() 代替。
  VueRouter.prototype.addRoutes = function addRoutes (routes) {
    { // 方法被弃用, 发出警告
      warn(false, 'router.addRoutes() is deprecated and has been removed in Vue Router 4. Use router.addRoute() instead.'); // Router . addrroutes()已弃用，已在Vue路由器4中移除。使用router.addRoute ()
    }
    this.matcher.addRoutes(routes); // 与 addRoute 同理
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation());
    }
  };

  Object.defineProperties( VueRouter.prototype, prototypeAccessors ); // 在 VueRotuer.prototype 中添加属性

  // 添加全局各式守卫
  function registerHook (
    list, // 对应守卫的集合
    fn // 添加守卫
  ) {
    list.push(fn); // 直接添加进守卫集合
    return function () { // 并且返回一个可以移除这个守卫的方法
      var i = list.indexOf(fn); // 很简单, 从这个守卫集合中去除这个守卫即可
      if (i > -1) { list.splice(i, 1); }
    }
  }

  // 创建一个 href 路径
  function createHref (base, fullPath, mode) {
    var path = mode === 'hash' ? '#' + fullPath : fullPath; // 如果是 hash 模式, 则使用 # 拼接路径
    return base ? cleanPath(base + '/' + path) : path // 返回拼接路径
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
