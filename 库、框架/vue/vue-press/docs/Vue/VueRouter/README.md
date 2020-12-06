# API 参考

## `<router-link>`

`<router-link>` 组件支持用户在具有路由功能的应用中 (点击) 导航。 通过 `to` 属性指定目标地址，默认渲染成带有正确链接的 `<a>` 标签，可以通过配置 `tag` 属性生成别的标签.。另外，当目标路由成功激活时，链接元素自动设置一个表示激活的 CSS 类名。

`<router-link>` 比起写死的 \<a href="..."> 会好一些，理由如下：

- 无论是 HTML5 history 模式还是 hash 模式，它的表现行为一致，所以，当你要切换路由模式，或者在 IE9 降级使用 hash 模式，无须作任何变动。
- 在 HTML5 history 模式下，`router-link` 会守卫点击事件，让浏览器不再重新加载页面。
- 当你在 HTML5 history 模式下使用 `base` 选项之后，所有的 `to` 属性都不需要写 (基路径) 了。

### `v-slot` API (3.1.0 新增)

`router-link` 通过一个[作用域插槽](https://cn.vuejs.org/v2/guide/components-slots.html#作用域插槽)暴露底层的定制能力。这是一个更高阶的 API，主要面向库作者，但也可以为开发者提供便利，多数情况用在一个类似 *NavLink* 这样的组件里。

**在使用 `v-slot` API 时，需要向 `router-link` 传入一个单独的子元素**。否则 `router-link` 将会把子元素包裹在一个 `span` 元素内。

```html
<router-link
  to="/about"
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <NavLink :active="isActive" :href="href" @click="navigate"
    >{{ route.fullPath }}</NavLink
  >
</router-link>
```

- `href`：解析后的 URL。将会作为一个 `a` 元素的 `href` attribute。
- `route`：解析后的规范化的地址。
- `navigate`：触发导航的函数。**会在必要时自动阻止事件**，和 `router-link` 同理。
- `isActive`：如果需要应用[激活的 class](https://router.vuejs.org/zh/api/#active-class) 则为 `true`。允许应用一个任意的 class。
- `isExactActive`：如果需要应用[精确激活的 class](https://router.vuejs.org/zh/api/#exact-active-class) 则为 `true`。允许应用一个任意的 class。

### 示例：将激活的 class 应用在外层元素

有的时候我们可能想把激活的 class 应用到一个外部元素而不是 `` 标签本身，这时你可以在一个 `router-link` 中包裹该元素并使用 `v-slot` property 来创建链接：

```html
<router-link
  to="/foo"
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <li
    :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
  >
    <a :href="href" @click="navigate">{{ route.fullPath }}</a>
  </li>
</router-link>
```

> 提示
>
> 如果你在 `<a>` 元素上添加一个 `target="_blank"`，则 `@click="navigate"` 处理器会被忽略。

## `<router-link>` Props

### to

- 类型: `string | Location`

- required

  表示目标路由的链接。当被点击后，内部会立刻把 `to` 的值传到 `router.push()`，所以这个值可以是一个字符串或者是描述目标位置的对象。

  ```html
  <!-- 字符串 -->
  <router-link to="home">Home</router-link>
  <!-- 渲染结果 -->
  <a href="home">Home</a>
  
  <!-- 使用 v-bind 的 JS 表达式 -->
  <router-link v-bind:to="'home'">Home</router-link>
  
  <!-- 不写 v-bind 也可以，就像绑定别的属性一样 -->
  <router-link :to="'home'">Home</router-link>
  
  <!-- 同上 -->
  <router-link :to="{ path: 'home' }">Home</router-link>
  
  <!-- 命名的路由 -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
  
  <!-- 带查询参数，下面的结果为 /register?plan=private -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}"
    >Register</router-link
  >
  ```

### replace

- 类型: `boolean`

- 默认值: `false`

  设置 `replace` 属性的话，当点击时，会调用 `router.replace()` 而不是 `router.push()`，于是导航后不会留下 history 记录。

  ```html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

### append

- 类型: `boolean`

- 默认值: `false`

  设置 `append` 属性后，则在当前 (相对) 路径前添加基路径。例如，我们从 `/a` 导航到一个相对路径 `b`，如果没有配置 `append`，则路径为 `/b`，如果配了，则为 `/a/b`

  ```html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

### tag

- 类型: `string`

- 默认值: `"a"`

  有时候想要 `` 渲染成某种标签，例如 ``。 于是我们使用 `tag` prop 类指定何种标签，同样它还是会监听点击，触发导航。

  ```html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- 渲染结果 -->
  <li>foo</li>
  ```

### active-class

- 类型: `string`

- 默认值: `"router-link-active"`

  设置链接激活时使用的 CSS 类名。默认值可以通过路由的构造选项 `linkActiveClass` 来全局配置。

### exact

- 类型: `boolean`

- 默认值: `false`

  “是否激活”默认类名的依据是**包含匹配**。 举个例子，如果当前的路径是 `/a` 开头的，那么 `` 也会被设置 CSS 类名。

  按照这个规则，每个路由都会激活 ``！想要链接使用“精确匹配模式”，则使用 `exact` 属性：

  ```html
  <!-- 这个链接只会在地址为 / 的时候被激活 -->
  <router-link to="/" exact></router-link>
  ```

  查看更多关于激活链接类名的例子[可运行](https://jsfiddle.net/8xrk1n9f/)

### event

- 类型: `string | Array`

- 默认值: `'click'`

  声明可以用来触发导航的事件。可以是一个字符串或是一个包含字符串的数组。

### exact-active-class

- 类型: `string`

- 默认值: `"router-link-exact-active"`

  配置当链接被精确匹配的时候应该激活的 class。注意默认值也是可以通过路由构造函数选项 `linkExactActiveClass` 进行全局配置的。

## `<router-view>`

`` 组件是一个 functional 组件，渲染路径匹配到的视图组件。`` 渲染的组件还可以内嵌自己的 `<router-view>`，根据嵌套路径，渲染嵌套组件。

其他属性 (非 router-view 使用的属性) 都直接传给渲染的组件， 很多时候，每个路由的数据都是包含在路由参数中。

因为它也是个组件，所以可以配合 `<transition>` 和 `<keep-alive>` 使用。如果两个结合一起用，要确保在内层使用 `<keep-alive>`：

```html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```

## `<router-view>` Props

### name

- 类型: `string`

- 默认值: `"default"`

  如果 `<router-view>`设置了名称，则会渲染对应的路由配置中 `components` 下的相应组件

## Router 构建选项

### routes

- 类型: `Array<RouteConfig>`

  `RouteConfig` 的类型定义：

  ```ts
  interface RouteConfig = {
    path: string,
    component?: Component,
    name?: string, // 命名路由
    components?: { [name: string]: Component }, // 命名视图组件
    redirect?: string | Location | Function,
    props?: boolean | Object | Function,
    alias?: string | Array<string>,
    children?: Array<RouteConfig>, // 嵌套路由
    beforeEnter?: (to: Route, from: Route, next: Function) => void,
    meta?: any,
  
    // 2.6.0+
    caseSensitive?: boolean, // 匹配规则是否大小写敏感？(默认值：false)
    pathToRegexpOptions?: Object // 编译正则的选项
  }
  ```

### mode

- 类型: `string`

- 默认值: `"hash" (浏览器环境) | "abstract" (Node.js 环境)`

- 可选值: `"hash" | "history" | "abstract"`

  配置路由模式:

  - `hash`: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。
  - `history`: 依赖 HTML5 History API 和服务器配置。查看 [HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html)。
  - `abstract`: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。**如果发现没有浏览器的 API，路由会自动强制进入这个模式。**

### base

- 类型: `string`

- 默认值: `"/"`

  应用的基路径。例如，如果整个单页应用服务在 `/app/` 下，然后 `base` 就应该设为 `"/app/"`。

### linkActiveClass

- 类型: `string`

- 默认值: `"router-link-active"`

  全局配置 `<router-link>` 默认的激活的 class。参考 [router-link](https://router.vuejs.org/zh/api/#router-link)。

### linkExactActiveClass

- 类型: `string`

- 默认值: `"router-link-exact-active"`

  全局配置 `<router-link>` 默认的精确激活的 class。可同时翻阅 [router-link](https://router.vuejs.org/zh/api/#router-link)。

### scrollBehavior

- 类型: `Function`

  签名:

  ```text
  type PositionDescriptor =
    { x: number, y: number } |
    { selector: string } |
    ?{}
  
  type scrollBehaviorHandler = (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => PositionDescriptor | Promise<PositionDescriptor>
  ```

  更多详情参考[滚动行为](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html)。

### parseQuery / stringifyQuery

- 类型: `Function`

  提供自定义查询字符串的解析/反解析函数。覆盖默认行为。

### fallback

- 类型: `boolean`

  当浏览器不支持 `history.pushState` 控制路由是否应该回退到 `hash` 模式。默认值为 `true`。

  在 IE9 中，设置为 `false` 会使得每个 `router-link` 导航都触发整页刷新。它可用于工作在 IE9 下的服务端渲染应用，因为一个 hash 模式的 URL 并不支持服务端渲染。

## Router 实例属性

### router.app

- 类型: `Vue instance`

  配置了 `router` 的 Vue 根实例。

### router.mode

- 类型: `string`

  路由使用的[模式](https://router.vuejs.org/zh/api/#mode)。

### router.currentRoute

- 类型: `Route`

  当前路由对应的[路由信息对象](https://router.vuejs.org/zh/api/#路由对象)。

## Router 实例方法

### router.beforeEach

### router.beforeResolve

### router.afterEach

函数签名：

```js
router.beforeEach((to, from, next) => {
  /* 必须调用 `next` */
})

router.beforeResolve((to, from, next) => {
  /* 必须调用 `next` */
})

router.afterEach((to, from) => {})
```

增加全局的导航守卫。参考[导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)。

在 2.5.0+ 这三个方法都返回一个移除已注册的守卫/钩子的函数。

### router.push

### router.replace

### router.go

### router.back

### router.forward

函数签名：

```js
router.push(location, onComplete?, onAbort?)
router.push(location).then(onComplete).catch(onAbort)
router.replace(location, onComplete?, onAbort?)
router.replace(location).then(onComplete).catch(onAbort)
router.go(n)
router.back()
router.forward()
```

动态的导航到一个新 URL。参考[编程式导航](https://router.vuejs.org/zh/guide/essentials/navigation.html)。

### router.getMatchedComponents

函数签名：

```js
const matchedComponents: Array<Component> = router.getMatchedComponents(location?)
```

返回目标位置或是当前路由匹配的组件数组 (是数组的定义/构造类，不是实例)。通常在服务端渲染的数据预加载时使用。

### router.resolve

函数签名：

```js
const resolved: {
  location: Location;
  route: Route;
  href: string;
} = router.resolve(location, current?, append?)
```

解析目标位置 (格式和 `` 的 `to` prop 一样)。

- `current` 是当前默认的路由 (通常你不需要改变它)
- `append` 允许你在 `current` 路由上附加路径 (如同 [`router-link`](https://router.vuejs.org/zh/api/#router-link.md-props))

### router.addRoutes

函数签名：

```js
router.addRoutes(routes: Array<RouteConfig>)
```

动态添加更多的路由规则。参数必须是一个符合 `routes` 选项要求的数组。

### router.onReady

函数签名：

```js
router.onReady(callback, [errorCallback])
```

该方法把一个回调排队，在路由完成初始导航时调用，这意味着它可以解析所有的异步进入钩子和路由初始化相关联的异步组件。

这可以有效确保服务端渲染时服务端和客户端输出的一致。

第二个参数 `errorCallback` 只在 2.4+ 支持。它会在初始化路由解析运行出错 (比如解析一个异步组件失败) 时被调用。

### router.onError

函数签名：

```js
router.onError(callback)
```

注册一个回调，该回调会在路由导航过程中出错时被调用。注意被调用的错误必须是下列情形中的一种：

- 错误在一个路由守卫函数中被同步抛出；
- 错误在一个路由守卫函数中通过调用 `next(err)` 的方式异步捕获并处理；
- 渲染一个路由的过程中，需要尝试解析一个异步组件时发生错误。

## 路由对象

一个**路由对象 (route object)** 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的**路由记录 (route records)**。

路由对象是不可变 (immutable) 的，每次成功的导航后都会产生一个新的对象。

路由对象出现在多个地方:

- 在组件内，即 `this.$route`

- 在 `$route` 观察者回调内

- `router.match(location)` 的返回值

- 导航守卫的参数：

  ```js
  router.beforeEach((to, from, next) => {
    // `to` 和 `from` 都是路由对象
  })
  ```

- `scrollBehavior` 方法的参数:

  ```js
  const router = new VueRouter({
    scrollBehavior(to, from, savedPosition) {
      // `to` 和 `from` 都是路由对象
    }
  })
  ```

### 路由对象属性

- **$route.path**

  - 类型: `string`

    字符串，对应当前路由的路径，总是解析为绝对路径，如 `"/foo/bar"`。

- **$route.params**

  - 类型: `Object`

    一个 key/value 对象，包含了动态片段和全匹配片段，如果没有路由参数，就是一个空对象。

- **$route.query**

  - 类型: `Object`

    一个 key/value 对象，表示 URL 查询参数。例如，对于路径 `/foo?user=1`，则有 `$route.query.user == 1`，如果没有查询参数，则是个空对象。

- **$route.hash**

  - 类型: `string`

    当前路由的 hash 值 (带 `#`) ，如果没有 hash 值，则为空字符串。

- **$route.fullPath**

  - 类型: `string`

    完成解析后的 URL，包含查询参数和 hash 的完整路径。

- **$route.matched**

  - 类型: `Array`

  一个数组，包含当前路由的所有嵌套路径片段的**路由记录** 。路由记录就是 `routes` 配置数组中的对象副本 (还有在 `children` 数组)。

  ```js
  const router = new VueRouter({
    routes: [
      // 下面的对象就是路由记录
      {
        path: '/foo',
        component: Foo,
        children: [
          // 这也是个路由记录
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  当 URL 为 `/foo/bar`，`$route.matched` 将会是一个包含从上到下的所有对象 (副本)。

- **$route.name**

  当前路由的名称，如果有的话。(查看[命名路由](https://router.vuejs.org/zh/guide/essentials/named-routes.html))

- **$route.redirectedFrom**

  如果存在重定向，即为重定向来源的路由的名字。(参阅[重定向和别名](https://router.vuejs.org/zh/guide/essentials/redirect-and-alias.html))

## 组件注入

### 注入的属性

通过在 Vue 根实例的 `router` 配置传入 router 实例，下面这些属性成员会被注入到每个子组件。

- **this.$router**

  router 实例。

- **this.$route**

  当前激活的[路由信息对象](https://router.vuejs.org/zh/api/#路由对象)。这个属性是只读的，里面的属性是 immutable (不可变) 的，不过你可以 watch (监测变化) 它。

### 增加的组件配置选项

- **beforeRouteEnter**

- **beforeRouteUpdate**

- **beforeRouteLeave**

  查看[组件内的守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#组件内的守卫)。



## 导航守卫

译者注

“导航”表示路由正在发生改变。

正如其名，`vue-router` 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。有多种机会植入路由导航过程中：全局的, 单个路由独享的, 或者组件级的。

记住**参数或查询的改变并不会触发进入/离开的导航守卫**。你可以通过[观察 `$route` 对象](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#响应路由参数的变化)来应对这些变化，或使用 `beforeRouteUpdate` 的组件内守卫。

## 全局前置守卫

你可以使用 `router.beforeEach` 注册一个全局前置守卫：

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 **等待中**。

每个守卫方法接收三个参数：

- **`to: Route`**: 即将要进入的目标 [路由对象](https://router.vuejs.org/zh/api/#路由对象)
- **`from: Route`**: 当前导航正要离开的路由
- **`next: Function`**: 一定要调用该方法来 **resolve** 这个钩子。执行效果依赖 `next` 方法的调用参数。
  - **`next()`**: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 **confirmed** (确认的)。
  - **`next(false)`**: 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
  - **`next('/')` 或者 `next({ path: '/' })`**: 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true`、`name: 'home'` 之类的选项以及任何用在 [`router-link` 的 `to` prop](https://router.vuejs.org/zh/api/#to) 或 [`router.push`](https://router.vuejs.org/zh/api/#router-push) 中的选项。
  - **`next(error)`**: (2.4.0+) 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 [`router.onError()`](https://router.vuejs.org/zh/api/#router-onerror) 注册过的回调。

**确保要调用 `next` 方法，否则钩子就不会被 resolved。**

## 全局解析守卫

> 2.5.0 新增

在 2.5.0+ 你可以用 `router.beforeResolve` 注册一个全局守卫。这和 `router.beforeEach` 类似，区别是在导航被确认之前，**同时在所有组件内守卫和异步路由组件被解析之后**，解析守卫就被调用。

## 全局后置钩子

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

```js
router.afterEach((to, from) => {
  // ...
})
```

## 路由独享的守卫

你可以在路由配置上直接定义 `beforeEnter` 守卫：

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

这些守卫与全局前置守卫的方法参数是一样的。

## 组件内的守卫

最后，你可以在路由组件内直接定义以下路由导航守卫：

- `beforeRouteEnter`
- `beforeRouteUpdate` (2.2 新增)
- `beforeRouteLeave`

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```

`beforeRouteEnter` 守卫 **不能** 访问 `this`，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建。

不过，你可以通过传一个回调给 `next`来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```

注意 `beforeRouteEnter` 是支持给 `next` 传递回调的唯一守卫。对于 `beforeRouteUpdate` 和 `beforeRouteLeave` 来说，`this` 已经可用了，所以**不支持**传递回调，因为没有必要了。

```js
beforeRouteUpdate (to, from, next) {
  // just use `this`
  this.name = to.params.name
  next()
}
```

这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 `next(false)` 来取消。

```js
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```

## 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。