# XMLHttpRequest

**发送一个 HTTP 请求, 需要创建一个 XMLHttpRequest 对象, 打开一个URL, 最后发送请求. **



## 第一部分 请求方法(同步 or 异步)

请求方式有两种: **异步模式 或 同步模式**, 由 XMLHttpRequest 对象的 open() 方法的第三个参数 async 的值决定的, false为同步, true为异步, 具体见最后一部分

**一般而言, 基本上都是使用异步模式的**

**注意:** XMLHttpRequest 构造函数并不仅限于 XML 文档. 之所以使用 XML 开头是因为在其诞生之时, 原先用于异步数据交换的主要格式便是 XML.



## 第二部分 处理响应

W3C规范定义了 XHR 对象的集中类型的响应属性. 这些属性告诉客户端关于 XMLHttpRequest 返回状态的重要信息

### 一. 分析并操作 responseXML属性

当将 xhr.responseType 设置为 'document'  时, 会试图将响应数据解析为 XML 或 HTML 格式内容,  当解析失败时, responseXML 属性会为null, 解析成功时, responseXML 属性将会是一个由 XML 文档解析而来的 DOM 对象, 此处不深究(在实际运用中, 已经很少运用 XML 格式来传递数据) 



### 二. 解析和操作包含 HTML 文档的 responseText 属性

如果使用 XMLHttpRequest  从远端获取一个 HTML 页面(这比较少见), 可以通过字符串形式存放在 responseText 属性中, 或者是 存放在 responseXML 属性中



### 三. 处理二进制数据

使用 xhr对象 一般用来发送和接收文本数据, 但是也可以发送和接受二进制内容

**自从 responseType(arraybuffer, blob等) 属性目前支持大量附加的内容类型后, 已经出现了很多的现代技术, 他们使得发送和接收二进制数据变得更加容易.**

* 具体参考: [MDN - 发送和接收二进制数据](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data)



## 第三部分 绕过缓存

**当使用 GET 请求方式时, 首先会从缓存中读取内容, 绕过缓存的方法(跨浏览器方法):       给 URL 添加时间戳**

**因为本地缓存都是以 URL 作为索引的, 这样就可以使每个请求都是唯一的, 也就可以这样来绕开缓存.**

```javascript
var oReq = new XMLHttpRequest();

oReq.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
oReq.send(null);
```



## 第四部分 传递参数形式

### 一. GET 或 PUT请求方法

* 使用&拼接参数 附加到URL

  > ` ?foo=bar&baz=The%20first%20line.%0AThe%20second%20line`

### 二. POST 或 DELETE 等请求方法

* 编码类型: `application/x-www-form-urlencoded(默认)`

  ```javascript
  Content-Type: application/x-www-form-urlencoded
  
  foo=bar&baz=The+first+line.%0D%0AThe+second+line.%0D%0A
  ```

* 编码类型: `text/plain`

  ```javascript
  Content-Type: text/plain
  
  foo=bar
  baz=The first line.
  The second line.
  ```

* 编码类型: `multipart/form-data`

  ```javascript
  Content-Type: multipart/form-data; boundary=---------------------------314911788813839
  
  -----------------------------314911788813839
  Content-Disposition: form-data; name="foo"
  
  bar
  -----------------------------314911788813839
  Content-Disposition: form-data; name="baz"
  
  The first line.
  The second line.
  
  -----------------------------314911788813839--
  
  ```

* 编码类型: `application/json`

  ```javascript
  Content-Type: application/json
  
  {"foo": "bar", "baz": "The first line"}
  ```

  







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
| "ms-stream"(不是标准的)               | `response` 是下载流的一部分；此响应类型仅允许下载请求，并且仅受Internet Explorer支持。 |



#### 3. response: 响应数据(只读)

**返回的类型可以是 [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBuffer) 、 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 、 [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 、 JavaScript [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 或 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 。取决于 responseType 属性设置的值**

响应的类型如下所示(**与responseType一致**):

| 值                                    | 描述                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| ""                                    | 与设置为 "text" 相同, 是默认类型 (实际上是 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)(相当于String) ) |
| "arraybuffer"                         | 是一个包含二进制数据的 JavaScript [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |
| "blob"                                | 是一个包含二进制数据的 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象 |
| "document"                            | 是一个[HTML](https://developer.mozilla.org/en-US/docs/Glossary/HTML) [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 或 [XML](https://developer.mozilla.org/en-US/docs/Glossary/XML) [`XMLDocument`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLDocument), 这取决于接受到的数据的 MIME 类型 |
| "json"                                | 是一个 JavaScript 对象. 这个对象是通过将接受到的数据类型视为 JSON 解析得到的 |
| "text"                                | 是包含在 DOMString 对象中的文本                              |
| "moz-chunked-arraybuffer"(不是标准的) | 与`"arraybuffer"`相似，但是数据会被接收到一个流中。使用此响应类型时，响应中的值仅在 `progress` 事件的处理程序中可用，并且只包含上一次响应 `progress` 事件以后收到的数据，而不是自请求发送以来收到的所有数据。 |
| "ms-stream"(不是标准的)               | `response` 是下载流的一部分；此响应类型仅允许下载请求，并且仅受Internet Explorer支持。 |

```javascript
let xhr = new XMLHttpRequest();
      xhr.responseType = "arraybuffer";
      xhr.open("GET", "/url/api/system/system-dic/listAll");
      xhr.onload = function(e) {
        /*
          	onabort: null
			onerror: null
			onload: ƒ (e)
			onloadend: null
			onloadstart: null
			onprogress: null
			onreadystatechange: null
			ontimeout: null
			readyState: 4
			response: ArrayBuffer(65) {}
			responseText: (...)
			responseType: "arraybuffer"
			responseURL: "http://localhost:8080/url/api/system/system-dic/listAll"
			responseXML: (...)
			status: 200
			statusText: "OK"
			timeout: 0
			upload: XMLHttpRequestUpload {onloadstart: null, onprogress: null, onabort: null, onerror: null, onload: null, …}
			withCredentials: false
          */
        console.log(xhr);
      };
      xhr.send(null);
```



#### 4. responseText: 请求响应(DOMString)(只读)

**处理的是 DOMString 数据, 是返回的纯文本的值**

**当responseType为"text" 或者 ""时, 此属性才会存储着后端返回的数据**

```javascript
// 当 xhr.responseType = "json",  
// xhr.responseText: 报错信息(未能从“XMLHttpRequest”读取“responseText”属性：仅当对象的“responseType”为“”或“text”（为“json”）时才可访问该值。)

// 当 xhr.responseType="text" 或为默认值 "",
// xhr.responseText: {"msg":"您不允许访问该资源，请重新登录","ret":401}
```



#### 5. responseXML: 请求响应(Document)(只读)

**处理的是Document数据, 如果请求未成功, 尚未发送, 或者检索的数据无法正确解析为 XML 或 HTML, 则为null**

**默认是当作“text / xml” 来解析。当 responseType 设置为 “document” 并且请求已异步执行时，响应将被当作 “text / html” 来解析。responseXML 对于任何其他类型的数据以及 data: URLs 为 null**

```javascript
// 当 xhr.responseXML = "json",  
// xhr.responseXML: 报错信息(无法从“XMLHttpRequest”读取“responseXML”属性：仅当对象的“responseType”为“”或“document”（为“json”）时，才可访问该值。)

// 当 xhr.responseType="document",
// xhr.responseXML: null(解析错误)
```





#### 6. responseURL: 响应序列化URL(只读)

**返回响应的序列化URL, 如果URL为空则返回空字符串. 如果URL有锚点, 则位于URL#后面的内容会被删除. 如果URL有重定向,  responseURL 的值回事经过多次重定向后的最终URL**

```javascript
xhr.responseURL = 'http://localhost:8080/url/api/system/system-dic/listAll'
```



#### 7. status: 响应状态码(只读)

**返回响应中的数字状态码, 在请求完成前, status的值为0. 值得注意的是, 如果 XMLHttpRequest 出错, 浏览器返回的 status 也为0**

**status码是标准的 HTTP status codes. 如果服务器响应中没有明确指定 status 码, XMLHttpRequest.status 将会默认为200**

```javascript
var xhr = new XMLHttpRequest();
console.log('UNSENT', xhr.status);

xhr.open('GET', '/server', true);
console.log('OPENED', xhr.status);

xhr.onprogress = function () {
  console.log('LOADING', xhr.status);
};

xhr.onload = function () {
  console.log('DONE', xhr.status);
};

xhr.send(null);

/**
 * 输出如下：
 *
 * UNSENT（未发送） 0
 * OPENED（已打开） 0
 * LOADING（载入中） 200
 * DONE（完成） 200
 */
```



#### 8. statusText: 响应状态(DOMString)(只读)

**不同于 status 属性的区别, 这个属性包含了返回状态对应的文本信息, 例如 "OK" 或是 "Not Found".**

**如果服务器未明确指定一个状态文本信息, 则 statusText 的值将会被自动赋值为 "OK"**

```javascript
var xhr = new XMLHttpRequest();
console.log('0 UNSENT', xhr.statusText);

xhr.open('GET', '/server', true);
console.log('1 OPENED', xhr.statusText);

xhr.onprogress = function () {
  console.log('3 LOADING', xhr.statusText);
};

xhr.onload = function () {
  console.log('4 DONE', xhr.statusText);
};

xhr.send(null);

/**
 * 输出如下:
 *
 * 0 UNSENT
 * 1 OPENED
 * 3 LOADING OK
 * 4 DONE OK
 */
```



#### 9. upload: 上传过程(只读)

**返回一个 XMLHttpRequestUpload 对象, 用来表示上传的进度. **

**这个对象类似于 XMLHttpRequestUpload, 专门用来表示上传过程, 可用来实现上传过程中的相关事件**

| 事件          | 相应属性的信息类型               |
| ------------- | -------------------------------- |
| `onloadstart` | 获取开始                         |
| `onprogress`  | 数据传输进行中                   |
| `onabort`     | 获取操作终止                     |
| `onerror`     | 获取失败                         |
| `onload`      | 获取成功                         |
| `ontimeout`   | 获取操作在用户规定的时间内未完成 |
| `onloadend`   | 获取完成（不论成功与否）         |



#### 10. timeout: 超时时间(可读写)

**表示请求的最大请求时间(毫秒), 若超出该时间, 则请求会自动结束**

**是一个无符号长整型数, 默认值为0, 意味着没有超时, 当超时发生, timeout 事件将会被触发**

**在 IE 中, 超时属性可能只能在调用 open() 方法之后且在调用 send() 方法之前设置**

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/server', true);

xhr.timeout = 2000; // 超时时间，单位是毫秒

xhr.onload = function () {
  // 请求完成。在此进行处理。
  // 超时不会触发这个事件  
};

xhr.ontimeout = function (e) {
  // XMLHttpRequest 超时。在此做某事。
};

xhr.send(null);

```



#### 11. withCredentials: 跨域请求是否带有授权信息(cookie 或 授权 header 头)

**是一个布尔值, 它指示了是否该使用类似cookies,authorization headers(头部授权)或者TLS客户端证书这一类资格证书来创建一个跨站点访问控制（cross-site `Access-Control`）请求。**

**注意:　在同一个站点下（就是没有产生跨域）使用withCredentials 属性是无效的, 这个指示也会被用做响应中 cookies 被忽视的标示. **

如果在发送来自其他域的XMLHttpRequest请求之前，未设置withCredentials 为true，那么就不能为它自己的域设置cookie值。而通过设置withCredentials 为true获得的第三方cookies，将会依旧享受同源策略，因此不能被通过document.cookie或者从头部相应请求的脚本等访问。

**注意: 永远不会影响到同源请求**

**注意: 不同域下的XmlHttpRequest 响应，不论其Access-Control- header 设置什么值，都无法为它自身站点设置cookie值，除非它在请求之前将withCredentials 设为true。**

````javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/', true);
xhr.withCredentials = true;
xhr.send(null);
````



#### 12. 非标准属性

| 属性                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| channel              | nsIChannel，对象在执行请求时使用的通道。                     |
| mozAnon              | 一个布尔值，如果为真，请求将在没有cookie和身份验证header头的情况下发送。 |
| mozSystem            | 一个布尔值，如果为真，则在请求时不会强制执行同源策略。       |
| mozBackgroundRequest | 一个布尔值，它指示对象是否是后台服务器端的请求。             |



### 三. 方法

****

#### 1.  open(): 初始化一个请求.

**注意: 为已激活的请求调用此方法( open()  已被调用) 相当于调用 abort()**

```javascript
/**
     * @name: 初始化一个请求
     * @param {String} 要使用的 HTTP 方法(GET, POST, PUT...), 对于非 HTTP(S) URL 被忽略
     * @param {String} 要发送请求的URL
     * @param {Boolean?} 请求模式, true(默认值, 异步模式) | false(同步模式)
     * @param {any?} 可选的用户名用于认证用途；默认为null。
	 * @param {any?} 可选的密码用于认证用途，默认为null。
     */
xhrReq.open(method, url, async?, user?, password?);
```



#### 2. setResponseHeader(): 设置 HTTP 请求头的值

**此方法必须在 open() 和 send() 之间调用. 如果多次对同一请求头赋值, 只会生成一个合并了多个值得请求头**

**自定义一些 header 属性进行跨域请求时, 可能会遇到 "not allowed by Access-Control-Allow-Headers in preflight response" 你可能需要在你的服务器端设置 "Access-Control-Allow-Headers**

```javascript
/**
	* @name: 设置 HTTP 请求头的值
	* @param: {String} 属性的名称
	* @param: {String} 属性的值
**/
xhr.setRequestHeader(header, value);
```



#### 3. getResponseHeader(): 返回指定响应头的字符串

**如果响应尚未收到或响应中不存在该响应, 则返回 null**

**必须要指定响应头名称, 也就是必须要有一个参数, 可通过 getAllResponseHeaders() 获取全部可获取的响应头**

**如果在返回头中有多个一样的名称, 那么返回的值就会使用逗号和空号分隔的字符串.  搜索标题名称是不区分大小写的。**

```javascript
/**
	* @name: 获取 HTTP 请求头的值
	* @param: {String} 响应头名称
	* @return: 指定响应头内容, 如果响应尚未收到, 或者响应中不存在, 则返回 null
**/
xhr.getRequestHeader(name);
```



#### 4. getAllResponseHeaders(): 返回所有用 CRLF 分隔的响应头

**注意： 对于复合请求 （ multipart requests ），这个方法返回当前请求的头部，而不是最初的请求的头部。**

```javascript
/**
	* @name: 获取 HTTP 请求头的值
	* @return: 返回所有的响应头，以 CRLF 分割的字符串，或者 null 如果没有收到任何响应。
**/
xhr.getAllResponseHeaders();

/*
返回示例:
cache-control: no-cache, no-store, max-age=0, must-revalidate
connection: close
content-type: application/json;charset=UTF-8
date: Thu, 12 Dec 2019 14:53:35 GMT
expires: 0
pragma: no-cache
transfer-encoding: chunked
vary: Origin, Access-Control-Request-Method, Access-Control-Request-Headers
x-content-type-options: nosniff
x-powered-by: Express
x-xss-protection: 1; mode=block	
*/
```



#### 5. send(): 发送请求

**用于发送 HTTP 请求, 如果是异步请求(默认为异步请求), 则此方法会在请求发送后立即返回；如果是同步请求，则此方法直到响应到达后才会返回。**

```javascript
/**
	* @name: 发送请求
	* @param: {any?} 请求方法为 GET 或者 HEAD 时, 应该讲请求主题设置为 null. 请求方法为其他方法时, 其参数将作为请求主体发送至服务器
**/
xhr.send(data?);
/*
数据类型: 
1. ArrayBuffer
2. ArrayBufferView
3. Blob
4. Document
5. DOMString(也就是String)
6. FormData
注意: 
应该在发送请求即调用 send() 方法之前使用 setRequestHeader() 方法设置 Content-Type 头部来指定请求主体的数据流的 MIME 类型
*/
```



#### 6. abort(): 中止请求

**如果请求已被发出, abort() 方法将终止该请求. 当一个请求被终止, 它的readyStete 属性将被置为0**

```javascript
/**
	* @name: 中止请求(会回到 open()[打开请求状态之前] )
**/
xhr.abort();
```



#### 7. overrideMimeType():重写由服务器返回的 MIME 类型

**指定一个 MIME 类型用于替代服务器指定的类型, 使服务器响应信息中传输的数据按照该指定 MIME 类型处理. 例如强制使流方式处理为"text/xml"类型处理时会被使用到，即使服务器在响应头中并没有这样指定.**

**此方法必须在 send 方法之前调用才有效**

**如果服务器没有指定一个Content-Type 头, XMLHttpRequest 默认MIME类型为"text/xml". 如果接受的数据不是有效的XML，将会出现格”格式不正确“的错误。你能够通过调用 overrideMimeType() 指定各种类型来避免这种情况。**

```javascript
/**
	* @name: 重写响应 MIME 类型
	* @param: {MIME类型} 指定具体的 MIME 类型去代替服务器指定的 MIME 类型. 如果服务器没有指定类型, 那么默认为 "text/xml"
**/
xhr.overrideMimeType(mimeType)
```



#### 8. 非标准方法

| 方法           | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| init()         | 在 C++ 代码中初始化一个 XHR 对象。                           |
| openRequest()  | 初始化一个请求. 这个方法用于本地代码; 如果用JavaScript 代码来初始化请求，使用 open()代替. 可参考 open() 的文档。 |
| sendAsBinary() | send() 方法的变体，用来发送二进制数据。                      |



### 四. 事件

**下列事件可在  XMLHttpRequest 对象中触发, 同时大部分事件(具体见 upload属性)也可在 xhr.upload 返回 XMLHttpRequestUpload(代表上传过程)中调用 **

****

#### 1. readystatechange: 当 readyState 状态变化时调用

**会在 XMLHttpRequest 的 readyState 属性发生改变时调用(不该用于同步的 requests 对象**

```javascript
xhr.onreadystatechange = function () {
  if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    // 在这里说明调用成功了
    console.log(xhr.responseText)
  }
}
```



#### 2. load: 请求成功完成时调用

```javascript
xhr.addEventListener('load', function(e) {
    // 在这里说明调用成功了, xhr.readyState === 4
})
```



#### 3. loadstart: 开始传送数据时触发

**开始传送数据时触发, 只会触发一次**

```javascript
xhr.addEventListener("loadstart", function(e) {
  // 在 response 状态为1(调用了 send() 方法, 已经开始建立连接, 但是 response 还是为1
  console.log("开始传送数据时", xhr.response);
});
```



#### 4. progress: 下载和上传的传输周期触发

**周期性触发, 可用来实现进度条(具体发送数据在 event 中)**

****

```javascript
xhr.addEventListener("progress", function(e) {
   // e.loaded: 在周期性调用中接受到了多少信息
   // e.total: 该请求一共多少信息 
   console.log("周期性发送数据", e);
});
```



#### 5. loadend: 请求结束时触发

**当请求结束时触发, 无论请求成功(load) 还是失败(abort 或 error)**

**需要注意的是，没有方法可以确切的知道 `loadend` 事件接收到的信息是来自何种条件引起的操作终止；但是你可以在所有传输结束的时候使用这个事件处理。**

```javascript
xhr.addEventListener("loadend", function(e) {
   // 无论请求成功还是失败都会调用, 但是这里不是很好区分成功原因 或 失败原因吧
   console.log("请求结束", xhr);
});
```



#### 6. abort: 当请求停止时触发

**当请求终止时 abort 事件被触发, 例如调用了 abort() 方法**

```javascript
xhr.addEventListener("abort", function(e) {
   console.log("请求停止", xhr);
});
```



#### 7.  timeout: 请求超时时触发

**当请求时间超出预定时间而终止请求时发出**

```javascript
xhr.addEventListener("timeout", function(e) {
   console.log("请求超时", xhr);
});
```



#### 8. error: 请求错误时触发

```javascript
xhr.addEventListener("error", function(e) {
   console.log("请求错误", xhr);
});
```

