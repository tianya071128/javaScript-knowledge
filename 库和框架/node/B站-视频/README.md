# Node.js 是什么？

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