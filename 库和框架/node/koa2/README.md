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