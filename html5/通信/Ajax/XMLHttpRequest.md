# XMLHttpRequest

**发送一个 HTTP 请求, 需要创建一个 XMLHttpRequest 对象, 打开一个URL, 最后发送请求. **



## 第一部分 请求类型

请求方式有两种: **异步模式 或 同步模式**, 由 XMLHttpRequest 对象的 open() 方法的第三个参数 async 的值决定的, false为同步, true为异步, 具体见最后一部分

**一般而言, 基本上都是使用异步模式的**

**注意:** XMLHttpRequest 构造函数并不仅限于 XML 文档. 之所以使用 XML 开头是因为在其诞生之时, 原先用于异步数据交换的主要格式便是 XML.







## 接口文档

**尽管名称如此, XMLHttpRequest 可以用于获取任何类型的数据, 而不仅仅是 XML, 它甚至支持 HTTP 以外的协议(包括file:// 和 FTP)**

**如果您的通信流程需要从服务器接收事件或消息数据, 可以选择SSE, 对于全双工的通信, WebSocket 则可能是更好的选择**

### 一. 构造函数

****

[XMLHttpRequest()](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/XMLHttpRequest)

​	该构造函数用于初始化一个 XMLHttpRequest 对象. **在调用下列任何其他方法之前, 必须先调用该构造函数, 或通过其他方式间接得到一个 XMLHttpRequest**

```javascript
/**
   * @name: 创建一个 XMLHttpRequest 对象
   * @return: XMLHttpRequest 对象
   */
var myRequest = new XMLHttpRequest();
```

### 二. 属性

**此接口继承了 [`XMLHttpRequestEventTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget) 和 [`EventTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget) 的属性。**

****

#### 1. readyState: 请求状态码(只读)

​	返回一个 XMLHttpRequest 代理当前所处的状态. 一个 XHR 代理总是处于下列状态中的一个: 

| 值   | 状态             | 描述                                                       |
| ---- | ---------------- | ---------------------------------------------------------- |
| 0    | UNSENT           | 代理被创建, 但尚未调用 open() 方法                         |
| 1    | OPENED           | open() 方法已经被调用                                      |
| 2    | HEADERS_RECEIVED | send() 方法已经被调用, 并且头部和状态已经可获得            |
| 3    | LOADING          | 下载中; responseText属性已经包含部分数据                   |
| 4    | DONE             | 下载操作已经完成, **这意味着数据传输已经彻底完成或失败。** |

```javascript
// 示例 -- 状态为2的无法检测到?
var xhr = new XMLHttpRequest(); // readyState 为 0
xhr.open('GET', '/api', true); // readyState 为 1
xhr.onprogress = function () {
   // readyState 为 3
}

xhr.onload = function () {
    // readyState 为 4
}
xhr.send(null);
```



#### 2. responseType: 响应类型(可写)

**是一个枚举类型的属性, 返回响应数据的类型. 允许手动设置返回数据的类型. 默认为 'text' 类型(设置为空字符串时, 采用 'text' 类型)**

**当手动设置为一个特定的类型时, 你需要确保服务器所返回的类型和你所设置的返回值类型是兼容的.**

**当服务器返回的返回值类型 和 所设置的响应类型不兼容时, 服务器返回的数据变成了 null, 即使服务器返回了数据**

**给一个同步模式的请求, 设置  responseType 会抛出一个 InvalidAccessError 的异常**

***要在 open() 初始化请求之后调用, 并且要在调用 send() 发送请求到服务器之前调用***

| 值                                    | 描述                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| ""                                    | 与设置为 "text" 相同, 是默认类型 (实际上是 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)(相当于String) ) |
| "arraybuffer"                         | 是一个包含二进制数据的 JavaScript [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |
| "blob"                                | 是一个包含二进制数据的 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象 |
| "document"                            | 是一个[HTML](https://developer.mozilla.org/en-US/docs/Glossary/HTML) [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 或 [XML](https://developer.mozilla.org/en-US/docs/Glossary/XML) [`XMLDocument`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLDocument), 这取决于接受到的数据的 MIME 类型 |
| "json"                                | 是一个 JavaScript 对象. 这个对象是通过将接受到的数据类型视为 JSON 解析得到的 |
| "text"                                | 是包含在 DOMString 对象中的文本                              |
| "moz-chunked-arraybuffer"(不是标准的) | 与`"arraybuffer"`相似，但是数据会被接收到一个流中。使用此响应类型时，响应中的值仅在 `progress` 事件的处理程序中可用，并且只包含上一次响应 `progress` 事件以后收到的数据，而不是自请求发送以来收到的所有数据。 |
| "ms-stream"                           | `response` 是下载流的一部分；此响应类型仅允许下载请求，并且仅受Internet Explorer支持。 |



#### 3. response: 响应类型(只读)

**返回的类型可以是 [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBuffer) 、 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 、 [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 、 JavaScript [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 或 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 。取决于 responseType 属性设置的值**

