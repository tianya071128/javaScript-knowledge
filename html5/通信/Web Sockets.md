# Web Sockets

**WebSockets**是一种先进的技术. 它可以在用户的浏览器和服务器之间打开交互式通信会话. 使用此API, 您可以向服务器发送消息并接受事件驱动的响应, 而无需通过轮询服务器的方式以获得响应



## 第一部分 特点

1. 最大特点: **服务器可以主动向客户端推送信息, 同时, 客户端也可以主动向服务器发送消息, 是真正的双向平等对话**

![webSockets](./image/webSockets.png 'webSockets')

2. 建立在 **TCP协议** 之上, 服务器端的实现比较容易
3. 与 HTTP 协议有着良好的兼容性. 默认端口也是80和443, 并且握手阶段采用 HTTP 协议,  因此握手时不容易屏蔽, 能通过各种 HTTP 代理服务器
4. 数据格式比较轻量, 性能开销小, 通信高效
5. **没有同源限制, 客户端可以与任意服务器通信**
6. 协议标识符是 ws (如果是加密, 则为 wss(对应HTTPS)), 服务器网址就是 URL.

![webSockets2](./image/webSockets2.jpg 'webSockets2')

## 第部分 参考资料

* [阮一峰-WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)

