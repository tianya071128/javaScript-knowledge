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