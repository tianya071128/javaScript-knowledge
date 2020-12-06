# Koa 框架教程

Node 主要用在开发 Web 应用。这决定了使用 Node，往往离不开 Web 应用框架

Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高。本身代码只有 1000 多行，所有功能都通过插件实现。



## 1. 基本用法

### 1.1 架设 HTTP 服务

```javascript
const Koa = require('koa');
const app = new Koa();

app.listen(3000)
```



### 1.2 Context 对象

Koa 提供一个 Context 对象，表示一次对话的上下文（包括 HTTP 请求和 HTTP 回复）。通过加工这个对象，就可以控制返回给用户的内容



### 1.3 HTTP Response 的类型

Koa 默认的返回类型是 `text/planin`， 如果想返回其他类型的内容。可以先用 `ctx.request.accepts` 判断一下，客户端希望接受什么数据（根据 HTTP Request 的 Accept 字段），然后使用 `ctx.response.type` 指定返回类型。

```javascript
const main = ctx => {
  if (ctx.request.accepts('xml')) {
    ctx.response.type = 'xml';
    ctx.response.body = '<data>Hello World</data>';
  } else if (ctx.request.accepts('json')) {
    ctx.response.type = 'json';
    ctx.response.body = { data: 'Hello World' };
  } else if (ctx.request.accepts('html')) {
    ctx.response.type = 'html';
    ctx.response.body = '<p>Hello World</p>';
  } else {
    ctx.response.type = 'text';
    ctx.response.body = 'Hello World';
  }
};
```



### 1.4 网页模板

读取模板文件，返回给用户

```javascript
const fs = require('fs');

const main = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./demos/template.html');
};
```



## 2. 路由

### 2.1 原生路由

通过 `ctx.request.path` 可以获取用户请求的路径，由此实现简单的路由

```javascript
const main = ctx => {
  if (ctx.request.path !== '/') {
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">Index Page</a>';
  } else {
    ctx.response.body = 'Hello World';
  }
};
```



### 2.2 koa-route 模块

```javascript
const route = require('koa-route');

const about = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = '<a href="/">Index Page</a>';
};

const main = ctx => {
  ctx.response.body = 'Hello World';
};

app.use(route.get('/', main));
app.use(route.get('/about', about));
```



### 2.3 koa-static 模块

提供静态资源（图片、字体、样式表、脚本......）

```javascript
const path = require('path');
const serve = require('koa-static');

const main = serve(path.join(__dirname));
app.use(main);
```





## 3. 中间件

Koa 的最大特色，也是最重要的一个设计，就是中间件。



### 3.1 中间件的合成

[`koa-compose`](https://www.npmjs.com/package/koa-compose)模块可以将多个中间件合成为一个。

```javascript
const compose = require('koa-compose');

const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  next();
}

const main = ctx => {
  ctx.response.body = 'Hello World';
};

const middlewares = compose([logger, main]);
app.use(middlewares);
```



## 4. 错误处理

### 4.1 ctx.throw() 方法

用来抛出错误

```javascript
const main = ctx => {
  ctx.throw(500);
};

// ctx.response.status设置成404，就相当于ctx.throw(404)，返回404错误。
ctx.throw(400);
// 等价于
ctx.response.status = 404;
ctx.response.body = 'Page Not Found'
```



### 4.2 处理错误的中间件

为了方便处理错误，最好使用`try...catch`将其捕获。但是，为每个中间件都写`try...catch`太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。

**`try...catch` 不能捕获 `ctx.response.status = 404` *

```javascript
const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      message: err.message
    };
  }
};

const main = ctx => {
  ctx.throw(500);
};

app.use(handler);
app.use(main);
```



### 4.3 error 事件的监听

运行过程中一旦出错，Koa 会触发一个`error`事件。监听这个事件，也可以处理错误。

```javascript
const main = ctx => {
  ctx.throw(500);
};

app.on('error', (err, ctx) =>
  console.error('server error', err);
);
```



### 4.4 释放 error 事件

需要注意的是，如果错误被`try...catch`捕获，就不会触发`error`事件。这时，必须调用`ctx.app.emit()`，手动释放`error`事件，才能让监听函数生效。

```javascript
const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.type = 'html';
    ctx.response.body = '<p>Something wrong, please contact administrator.</p>';
    ctx.app.emit('error', err, ctx);
  }
};

const main = ctx => {
  ctx.throw(500);
};

app.on('error', function(err) {
  console.log('logging error ', err.message);
  console.log(err);
});

```

