# 前言

主要根据[MDN-H5教程]( https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5 )来分类学习, 分为多个模块

## 性能 & 集成

**提供了非常显著的性能优化和更有效的计算机硬件使用**

* 拖放

  > HTML5 的拖放 API 能够支持在网站内部和网站之间拖放项目。同时也提供了一个更简单的供扩展和基于 Mozilla 的应用程序使用的 API。

* 全屏

  > 为一个网页或者应用程序控制使用整个屏幕，而不显示浏览器界面。

* HTML 焦点管理

  > 支持新的 HTML5 activeElement 和 hasFocus 属性。

* History API 

  > 允许对浏览器历史记录进行操作。这对于那些交互地加载新信息的页面尤其有用。

* contentEditable 属性：把你的网站改变成 wiki !

  > HTML5 已经把 contentEditable 属性标准化了。了解更多关于这个特性的内容。

*  [Web Workers](https://developer.mozilla.org/zh-CN/docs/DOM/Using_web_workers) 

  > 能够把 JavaScript 计算委托给后台线程，通过允许这些活动以防止使交互型事件变得缓慢。 
  >
  > **Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢**

*  [基于 Web 的协议处理程序](https://developer.mozilla.org/zh-CN/docs/Web-based_protocol_handlers) 

  >  你现在可以使用 `navigator.registerProtocolHandler()` 方法把 web 应用程序注册成一个协议处理程序。 

* 

## 多媒体

**使 video 和 audio 成为了在所有 Web 中的一等公民。**

* 使用 HTML5 音视频

  > \<audio> 和 \<video> 元素嵌入并支持新的多媒体内容的操作。



## 语义

**能够让你更恰当地描述你的内容是什么**

*  [HTML5 中的区块和段落元素](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Sections_and_Outlines_of_an_HTML5_document) 

  > HTML5 中新的区块和段落元素一览: \<section>, \<article>, \<nav>, \<header>, \<footer>, \<aside> 和 \<hgroup>.

*  [使用 HTML5 的音频和视频](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Using_HTML5_audio_and_video) 

  > \<audio> 和 \<video> 元素嵌入和允许操作新的多媒体内容。

*  **新的语义元素** 

  > 除了节段，媒体和表单元素之外，还有众多的新元素，例如 \<mark>， \<figure>， \<figcaption>， \<data>， \<time>， \<output>， \<progress>， 或者 \<meter>和\<main>，这增加了有效的 HTML5 元素的数量。

*  [MathML](https://developer.mozilla.org/zh-CN/docs/MathML) 

  >  允许直接嵌入数学公式。 

*  [HTML5 入门](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5/Introduction_to_HTML5) 

  >  本文介绍了如何标示在网页设计或 Web 应用程序中使用 HTML5 时碰到的问题。 

