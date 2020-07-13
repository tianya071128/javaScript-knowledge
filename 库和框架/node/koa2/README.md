# Koa

## 1. 应用程序

Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。

**一个关键的设计点是在其低级中间件层中提供高级“语法糖”。这提高了互操作性，稳健型，并使书写中间件更加愉快。**

这包括诸如内容协商，缓存清理，代理支持和重定向等常见任务的方法。尽管提供了相当多的有用的方法 Koa 仍保持了一个很小的体积，因为没有捆绑中间件。



### 1.1 级联

Koa 中间件以更传统的方式级联，使用 `saync` 功能，可以实现“真实”的中间件。通过一系列功能直接传递控制，直到一个返回，Koa调用“下游”，然后控制流回“上游”。

例子：

```javascript
const Koa = require('koa');
const app = new Koa();

// logger 中间件
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
})

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
})

// response
app.use(async ctx => {
    ctx.body = 'Hello World';
})

app.listen(3000);
```

**当请求开始时首先请求流通过 `x-response-time` 和 `logging` 中间件，然后继续移交控制给 `response` 中间件。当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。**



## 1.2 设置

应用程序设置是 app 实例上的属性，目前支持如下：

* `app.env` 默认是 **NODE_ENV** 或 "development"
* `app.keys` 签名的 cookie 密钥数组
* `app.proxy` 当真正的代理头字段将被信任时
* 忽略 `.subdomains` 的 `app.subdomainOffset` 偏移量，默认为 2
* `app.proxyIpHeader` 代理 ip 消息头, 默认为 `X-Forwarded-For`
* `app.maxIpsCount` 从代理 ip 消息头读取的最大 ips, 默认为 0 (代表无限)

设置方式有以下两种

```javascript
// 将设置传递给构造函数
const Koa = require('koa');
const app = new Koa({ proxy: true });

// 动态设计
const Koa = require('koa');
const app = new Koa();
app.proxy = true;
```



### 1.3 app.listen(...)

Koa 应用程序不是 HTTP 服务器的 1 对 1 展现。可以将一个或多个 Koa 应用程序安装在一起以形成具有单个 HTTP 服务器的更大应用程序。

```javascript
// 无作用的 Koa 应用程序被绑定到 3000 端口：
const Koa = require('koa');
const app = new Koa();
app.listen(3000);
// 这里的 app.listen(...) 方法只是以下方法的语法糖:
const http = require('http');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);

/****/
// 可以将同一个应用程序同时作为 HTTP 和 HTTPS 或多个地址：
const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
https.createServer(app.callback()).listen(3001);
```



### 1.4 app.callback()

**返回适用于 `http.createServer()` 方法的回调函数来处理请求。你也可以使用此回调函数将 koa 应用程序挂载到 Connect/Express 应用程序中。**



### 1.5 app.use(function)

**将给定的中间件方法添加到此应用程序。`app.use()` 返回 `this`, 因此可以链式表达.**

```javascript
app.use(someMiddleware)
app.use(someOtherMiddleware)
app.listen(3000)

// 等同于
app.use(someMiddleware)
  .use(someOtherMiddleware)
  .listen(3000)
```



### 1.6 app.keys=

设置签名的 Cookie 密钥。

这些被传递给 [KeyGrip](https://github.com/crypto-utils/keygrip)，但是你也可以传递你自己的 `KeyGrip` 实例。

```javascript
app.keys = ['im a newer secret', 'i like turtle'];
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');
```



### 1.7 app.context

`app.context` 是从其创建 `ctx` 的原型。您可以通过编辑 `app.context` 为 `ctx` 添加其他属性。这对于将 `ctx` 添加到整个应用程序中使用的属性或方法非常有用，这可能会更加有效（不需要中间件）和/或 更简单（更少的 `require()`），而更多地依赖于`ctx`，这可以被认为是一种反模式。

例如，要从 `ctx` 添加对数据库的引用：

```js
app.context.db = db();

app.use(async ctx => {
  console.log(ctx.db);
});
```

注意:

- `ctx` 上的许多属性都是使用 `getter` ，`setter` 和 `Object.defineProperty()` 定义的。你只能通过在 `app.context` 上使用 `Object.defineProperty()` 来编辑这些属性（不推荐）。查阅 https://github.com/koajs/koa/issues/652.
- 安装的应用程序目前使用其父级的 `ctx` 和设置。 因此，安装的应用程序只是一组中间件。



### 1.8 错误处理

默认情况下，将所有错误输出到 stderr，除非 `app.silent` 为 `true`。 当 `err.status` 是 `404` 或 `err.expose` 是 `true` 时默认错误处理程序也不会输出错误。 要执行自定义错误处理逻辑，如集中式日志记录，您可以添加一个 “error” 事件侦听器：

```js
app.on('error', err => {
  log.error('server error', err)
});
```

如果 req/res 期间出现错误，并且 _无法_ 响应客户端，`Context`实例仍然被传递：

```js
app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});
```

当发生错误 _并且_ 仍然可以响应客户端时，也没有数据被写入 socket 中，Koa 将用一个 500 “内部服务器错误” 进行适当的响应。在任一情况下，为了记录目的，都会发出应用级 “错误”。





## 2. 上下文（Context）

Koa Context 将 node 的 `request` 和 `response` 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。 这些操作在 HTTP 服务器开发中频繁使用，它们被添加到此级别而不是更高级别的框架，这将强制中间件重新实现此通用功能。

_每个_ 请求都将创建一个 `Context`，并在中间件中作为接收器引用，或者 `ctx` 标识符，如以下代码片段所示：

```js
app.use(async ctx => {
  ctx; // 这是 Context
  ctx.request; // 这是 koa Request
  ctx.response; // 这是 koa Response
});
```

为方便起见许多上下文的访问器和方法直接委托给它们的 `ctx.request`或 `ctx.response` ，不然的话它们是相同的。 例如 `ctx.type` 和 `ctx.length` 委托给 `response` 对象，`ctx.path` 和 `ctx.method` 委托给 `request`。

### 2.1 API

`Context` 具体方法和访问器.

#### 2.1.1 ctx.req

Node 的 request 对象



#### 2.1.2 ctx.res

Node 的 response 对象

绕过 Koa 的 response 处理是 **不被支持的**. 应避免使用以下 node 属性：

- `res.statusCode`
- `res.writeHead()`
- `res.write()`
- `res.end()`



#### 2.1.3 ctx.request

koa 的 `Request` 对象.



#### 2.1.4 ctx.response

koa 的 `Response` 对象.



#### 2.1.5 ctx.state

推荐的命名空间，用于通过中间件传递信息和你的前端视图。

```js
ctx.state.user = await User.find(id);
```



#### 2.1.6 ctx.app

应用程序实例引用



#### 2.1.7 ctx.app.emit

Koa 应用扩展了内部 [EventEmitter](https://nodejs.org/dist/latest-v11.x/docs/api/events.html)。`ctx.app.emit` 发出一个类型由第一个参数定义的事件。对于每个事件，您可以连接 "listeners"，这是在发出事件时调用的函数。有关更多信息，请参阅[错误处理文档](https://koajs.com/#error-handling)。



#### 2.1.8 ctx.cookies.get(name, [options])

通过 `options` 获取 cookie `name`:

- `signed` 所请求的cookie应该被签名

koa 使用 [cookies](https://github.com/pillarjs/cookies) 模块，其中只需传递参数。



#### 2.1.9 ctx.cookies.set(name, value, [options])

通过 `options` 设置 cookie `name` 的 `value` :

- maxAge: 一个数字, 表示从 Date.now() 得到的毫秒数.
  - `expires`: 一个 `Date` 对象, 表示 cookie 的到期日期 (默认情况下在会话结束时过期).
  - `path`: 一个字符串, 表示 cookie 的路径 (默认是`/`).
  - `domain`: 一个字符串, 指示 cookie 的域 (无默认值).
  - `secure`: 一个布尔值, 表示 cookie 是否仅通过 HTTPS 发送 (HTTP 下默认为 `false`, HTTPS 下默认为 `true`). [阅读有关此参数的更多信息](https://github.com/pillarjs/cookies#secure-cookies).
  - `httpOnly`: 一个布尔值, 表示 cookie 是否仅通过 HTTP(S) 发送，, 且不提供给客户端 JavaScript (默认为 `true`).
  - `sameSite`: 一个布尔值或字符串, 表示该 cookie 是否为 "相同站点" cookie (默认为 `false`). 可以设置为 `'strict'`, `'lax'`, `'none'`, 或 `true` (映射为 `'strict'`).
  - `signed`: 一个布尔值, 表示是否要对 cookie 进行签名 (默认为 `false`). 如果为 `true`, 则还会发送另一个后缀为 `.sig` 的同名 cookie, 使用一个 27-byte url-safe base64 SHA1 值来表示针对第一个 [Keygrip](https://www.npmjs.com/package/keygrip) 键的 *cookie-name*=*cookie-value* 的哈希值. 此签名密钥用于检测下次接收 cookie 时的篡改.
  - `overwrite`: 一个布尔值, 表示是否覆盖以前设置的同名的 cookie (默认是 `false`). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（无论路径或域）是否在设置此Cookie 时从 Set-Cookie 消息头中过滤掉.

koa 使用传递简单参数的 [cookies](https://github.com/pillarjs/cookies) 模块。