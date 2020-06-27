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



## 6. MongoDB

### 6.1 关系型数据库和非关系型数据库

* 关系型数据库:

  > 表与表之间存在关系. 例如 mySQL.
  >
  > * 所有的关系型数据库都需要通过 `sql` 语言来操作
  > * 所有的关系型数据库在操作之前都需要设计表结构
  > * 数据库存在约束
  >   * 唯一的
  >   * 主键
  >   * 默认值
  >   * 非空

* 非关系型数据库

  > 非关系型数据库非常的灵活
  >
  > 有的非关系型数据库就是 key-valkue 结构
  >
  > MongoDB 比较接近关系型数据库的非关系型数据库
  >
  > ...
  
* MongoDB 数据库的基本概念

  * 可以有多个数据库
  * 一个数据库中可以有多个集合(表)
  * 一个集合中可以多个文档(表记录)
  * 文档结构很灵活, 没有任何限制
  * MongoDB 非常灵活, 不需要 MySQL 一样先创建数据库、表、设计库。

### 6.2 安装

* 安装
* 配置环境变量
*  `mongod --version` 测试是否安装成功



### 6.3 启动和关闭数据库

启动:

```shell
# mongodb 默认使用执行 mongod 命令所处盘符根目录下的 /data/db 作为自己的存储目录
# 此时可以手动新建一个 /data/db
mongod
```

如果想要修改默认的数据存储目录, 可以:

```shell
mongod --dbpath=目录
```

停止:

```shell
ctrl + c 或 关闭控制台
```



### 6.4 连接和退出数据库

连接:

```shell
# 改名了默认连接本机的 MongoDB 服务
mongo
```

退出: 

```shell
# 在连接状态输入 exit 退出连接
```



### 6.5 基本命令

* `show dbs`
  * 查看显示所有数据库
* `db`
  * 查看当前操作的数据库
* `use 数据库名称`
  * 切换到指定的数据(如果不存在则新建)
* 插入数据



### 6.6 在 node 中使用 mongoDB

1. 使用官方的 `mongodb` 包来操作

2. 使用第三方 mongoose 来操作 MongoDB 数据库

   > `mongoose` : 基于 `mongodb` 封装



## 7. mongoose

### 7.1 设计架构

```javascript
var mongoose = require("mongoose");

var Scheam = mongoose.Schema;

// 1. 连接数据库 -- test 库
// 指定连接的数据库不需要存在,当你插入第一条数据后会自动创建
mongoose.connect("mongodb://localhost/test");

// 2. 设计集合结构(表结构)
var userSchema = new Scheam({
  username: {
    type: String,
    required: true // 必须有
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String
  }
});

/**
 * @name: 3. 将文档结构发布为模型
 * @param {String} 表示数据库的集合名词
 * @param {Scheam} 架构
 * @return 模型构造函数
 */
var User = mongoose.model("User", userSchema);
```

### 7.2 增

```javascript
// 4. 使用模型构造函数, 操作数据
var admin = new User({
  username: "admin",
  password: "123456",
  email: "admin@admin.com"
});

admin.save().then(() => {
  console.log("保存成功");
});
```



### 7.3 查

查询所有: 

```javascript
User.find().then(ret => {
  console.log("查询成功", ret);
});
```

条件查询: 

```javascript
User.find({
  username: "zs"
}).then(ret => {
  console.log(ret);
});
```

只查询一个:

```javascript
User.findOne({
  username: "zs"
}).then(ret => {
  console.log(ret);
});
```



### 7.4 删

根据条件删除所有:

```javascript
User.remove({
    username: 'zs'
}).then(ret => console.log('删除成功', ret))
```

根据条件删除一个:

```javascript
Model.findOneAndRemove(conditions, [options], [callback])
```

根据 id 删除一个:

```javascript
Model.findByIdAndRemove(id, [options], [callback])
```



### 7.5 改

根据条件更新所有:

```javascript
Model.update(confitions, doc, [optinos], [callback])
```

根据指定条件更新一个:

```javascript
Model.findOneAndUpdate([conditions], [update], [options], [callback])
```

根据 id 更新一个:

```javascript
User.findByIdAndUpdate('xxx', {
    password: '123'
}).then(ret => {})
```

