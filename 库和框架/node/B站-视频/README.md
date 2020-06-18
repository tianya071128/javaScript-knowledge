## 1 Node.js 是什么？

* Node.js® 是一个基于 [Chrome V8 引擎](https://v8.dev/) 的 JavaScript 运行时。
  * Node.js 不是一门语言
  * Node.js 不是库、不是框架
  * Node.js 是一个 JS 运行时环境
  * 简单讲就是 Node.js 可以解析和执行 JS 代码
  * JS 可以完全脱离浏览器来运行，一切都归功于 Node.js
* 浏览器中的 JS
  * ES
  * BOM
  * DOM
* Node.js 中的 JS
  * **没有 BOM、DOM**
  * ES
  * 在 Node 这个 JS 执行环境中为 JS 提供了一些服务器级别的操作 API
    * 文件读写
    * 网络服务的构建
    * 网络通信
    * HTPP 服务器
    * 。。。
* 事件驱动(event-driven)、非阻塞 IO 模型(异步)、轻量和高效；



## 2 Node.js 能做什么？

* Web 服务器后台（主要）
* 命令行工具
  * npm(node)
  * git(c 语言)
* 对于前端开发而言，接触 node 最多的是它的命令行工具
  * webpack
  * npm
  * gulp。。。



## 3 Node 中的 JS

* EcmaScript

* 核心模块

  Node 为 JS 提供了很多服务器级别的 API,这些 API 绝大多数都被包装到了一个具名的核心模块中了.

  例如文件操作的 `fs` 核心模块, http 服务构建的 `http` 模块, `path` 路径操作模块

* 模块化系统

  * 具名的核心模块: 例如 fs、http

  * 用户自己编写的文件模块

    **在 Node 中, 没有全局作用域, 只有模块作用域**



## 4 自动重启服务工具

使用 `nodemon` 工具

```shell
# 安装
npm install --global nodemon

# 使用
nodemon app.js # 将 node app.js 启动命令变成 nodemon app.js
```



## 5 Express

### 5.1 安装

```shell
npm install --save express
```

hello world:

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {});

app.listen(3000, () => {})
```



### 5.2 基本路由

get

```javascript
app.get('/', function(req, res) {
    res.send('Hello Wordl')
})
```

post

```javascript
app.post('/', function(req, res) {
    res.send('Got a POST request')
})
```



### 5.3 静态服务

```javascript
app.use(express.stait('public'));
app.use(express.stait('files'));

// 重命名
app.use('/stait', express.stait('./public/'));
```

### 5.4 在 express 中使用 art-template 

安装:

```shell
npm install --save art-template express-art-template
```

使用:

```javascript
var express = require('express');
var app = express();

// view engine setup
app.engine('art', require('express-art-template'));
app.set('view', {
    debug: process.env.NODE_ENV !== 'production'
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'art');

// routes
app.get('/', function (req, res) {
    res.render('index.art', {
        user: {
            name: 'aui',
            tags: ['art', 'template', 'nodejs']
        }
    });
});
```



### 5.5 获取 GET 请求参数

req 内置了 query 属性

```javascript
req.query
```



### 5.6 获取表单 POST 请求体数据

使用中间件: `body-parser`



安装:

```shell
npm install body-parser
```

配置:

```javascript
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// 配置 application/x-www-form-urlencoded , 在 req 中可通过 req.body 获取请求体数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
```

