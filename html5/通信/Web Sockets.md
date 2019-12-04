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



## 第二部分 WebSocket 接口

### 1. 构造函数

返回一个 WebSocket 对象

```javascript
/*
	* @name: WebSocket构造函数
	* @params: {String} url: 要连接的URL
	* @params: {String|Array?} protocols: 一个协议字符串或者一个包含协议字符串的数组。这些字符串用于指定子协议，这样单个服务器可以实现多个WebSocket子协议（例如，您可能希望一台服务器能够根据指定的协议（protocol）处理不同类型的交互）。如果不指定协议字符串，则假定为空字符串。
*/
var aWebSocket = new WebSocket(url [, protocols]);
```



### 2. 常量

| **Constant**           | **Value** |
| ---------------------- | --------- |
| `WebSocket.CONNECTING` | `0`       |
| `WebSocket.OPEN`       | `1`       |
| `WebSocket.CLOSING`    | `2`       |
| `WebSocket.CLOSED`     | `3`       |

以上是 WebSocket 构造函数的原型中存在的一些常量, 可通过 `WebSocket.readyState`对照上述常量判断 WebSocket 连接 当前所处的状态

```javascript
switch (ws.readyState) {
  case WebSocket.CONNECTING:
    // do something
    break;
  case WebSocket.OPEN:
    // do something
    break;
  case WebSocket.CLOSING:
    // do something
    break;
  case WebSocket.CLOSED:
    // do something
    break;
  default:
    // this never happens
    break;
}
```



### 3. 属性

* `WebSocket.url`(只读)

  **WebSocket 的绝对路径**

* `WebSocket.readyState`(只读)

  **当前的链接状态**

* `WebSocket.bufferedAmount`(只读)

  **未发送至服务器的字节数**

  ```javascript
  // 可用来判断发送是否结束
  var data = new ArrayBuffer(10000000);
  socket.send(data);
  
  if (socket.bufferedAmount === 0) {
    // 发送完毕
  } else {
    // 发送还没结束
  }
  ```

* 其他属性

  1. `WebSocket.extensions`(只读)

     **服务器选择的扩展**

  2. `WebSocket.binaryType`

     **使用二进制的数据类型连接**

  3. `WebSocket.protocol `(只读)

     **服务器选择的下属协议**

### 4. 方法





## 第部分 参考资料

* [阮一峰-WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)