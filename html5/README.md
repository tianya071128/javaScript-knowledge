# 前言

主要根据[MDN-H5教程]( https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5 )来分类学习, 分为多个模块



## 性能 & 集成

**提供了非常显著的性能优化和更有效的计算机硬件使用**

* [拖放](https://developer.mozilla.org/zh-CN/docs/DragDrop/Drag_and_Drop)

  > HTML5 的拖放 API 能够支持在网站内部和网站之间拖放项目。同时也提供了一个更简单的供扩展和基于 Mozilla 的应用程序使用的 API。

* [全屏 API](https://developer.mozilla.org/zh-CN/docs/DOM/Using_fullscreen_mode)

  > 为一个网页或者应用程序控制使用整个屏幕，而不显示浏览器界面。

* [HTML 中的焦点管理](https://developer.mozilla.org/zh-CN/docs/HTML/Focus_management_in_HTML)

  > 支持新的 HTML5 activeElement 和 hasFocus 属性。

* [History API](https://developer.mozilla.org/zh-CN/docs/DOM/Manipulating_the_browser_history)

  > 允许对浏览器历史记录进行操作。这对于那些交互地加载新信息的页面尤其有用。

* [contentEditable 属性：把你的网站改变成 wiki !](https://developer.mozilla.org/zh-CN/docs/HTML/Content_Editable)

  > HTML5 已经把 contentEditable 属性标准化了。了解更多关于这个特性的内容。

*  [Web Workers](https://developer.mozilla.org/zh-CN/docs/DOM/Using_web_workers) 

  > 能够把 JavaScript 计算委托给后台线程，通过允许这些活动以防止使交互型事件变得缓慢。 
  >
  > **Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢**

*  [基于 Web 的协议处理程序](https://developer.mozilla.org/zh-CN/docs/Web-based_protocol_handlers) 

  >  你现在可以使用 `navigator.registerProtocolHandler()` 方法把 web 应用程序注册成一个协议处理程序。 

* [XMLHttpRequest ](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) **Level 2**

  > 允许异步读取页面的某些部分，允许其显示动态内容，根据时间和用户行为而有所不同。这是在 [Ajax](https://developer.mozilla.org/zh-CN/docs/AJAX)背后的技术。


## 多媒体

**使 video 和 audio 成为了在所有 Web 中的一等公民。**

* 使用 HTML5 音视频

  > \<audio> 和 \<video> 元素嵌入并支持新的多媒体内容的操作。

*  [WebRTC](https://developer.mozilla.org/zh-CN/docs/WebRTC) 

  > 这项技术, 其中的RTC代表的是计时通信, 允许连接到其他人, 在浏览器中直接控制视频会议, 而不需要一个插件或是外部的应用程序

*  [使用 Camera API](https://developer.mozilla.org/zh-CN/docs/DOM/Using_the_Camera_API) 

  > 允许使用, 操作计算机摄像头, 并从中存储图像.
  
*  **Track 和 WebVTT** 

  >  \<track> 元素支持字幕和章节。WebVTT 一个文本轨道格式。



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

*  [HTML5 兼容的解析器](https://developer.mozilla.org/zh-CN/docs/HTML/HTML5/HTML5_Parser) 

  >  用于把 HTML5 文档的字节转换成 DOM 的解释器，已经被扩展了，并且现在精确地定义了在所有情况下使用的行为，甚至当碰到无效的 HTML 这种情况。这就导致了 HTML5 兼容的浏览器之间极大的可预测性和互操作性。



## 2D/3D 绘图 & 效果

**提供了一个更加分化范围的呈现选择**

* [Canvas 教程](https://developer.mozilla.org/zh-CN/docs/Canvas_tutorial)

  > 了解有关新的 \<canvas> 元素以及如何在火狐中绘制图像和其他对象。

*  [HTML5 针对 \<canvas> 元素的文本 API](https://developer.mozilla.org/zh-CN/docs/Drawing_text_using_a_canvas) 

  > HTML5 文本 API 现在由 \<canvas> 元素支持。

*  [WebGL](https://developer.mozilla.org/zh-CN/docs/WebGL) 

  > WebGL 通过引入了一套非常地符合 OpenGL ES 2.0 并且可以用在 HTML5 <canvas> 元素中的 API 给 Web 带来了 3D 图像功能。

*  [SVG](https://developer.mozilla.org/zh-CN/docs/SVG) 

  > 一个基于 XML 的可以直接嵌入到 HTML 中的矢量图像格式。



## 通信

*  [Web Sockets](https://developer.mozilla.org/zh-CN/docs/WebSockets) 

  > 允许在页面和服务器之间建立持久连接并通过这种方法来交换非 HTML 数据

* [Server-sent events](https://developer.mozilla.org/zh-CN/docs/Server-sent_events/Using_server-sent_events)

  > 允许服务器向客户端推送事件，而不是仅在响应客户端请求时服务器才能发送数据的传统范式。

* [WebRTC](https://developer.mozilla.org/zh-CN/docs/WebRTC)

  > 这项技术，其中的 RTC 代表的是即时通信，允许连接到其他人，直接在浏览器中控制视频会议，而不需要一个插件或是外部的应用程序。