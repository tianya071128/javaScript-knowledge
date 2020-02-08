## DOM节点层次

> DOM将HTML或XML文档描绘成一个由多层节点构成的结构

### 1 Node类型

> * 所有节点类型都继承至Node类型, 因此所有节点类型都共享着相同的基本属性和方法
> * nodetType属性: 表明节点的类型
> * nodeName属性: 对于元素节点, 表示节点标签名 
> * nodeValue属性: 对于元素节点, 始终为null



### 2 Document类型

> * Document类型表示**文档**, document对象是HTMLDocument(继承至Document类型)的一个实例
> * 通过这个文档对象, 可以取得与页面有关的信息, 而且还能操作页面的外观及其底层结构

#### 2.1  文档的子节点

```javascript
document.documentElement; //取得对<html>的引用
document.childNodes[0]; //取得对<html>的引用
document.firstChild; //取得对<html>的引用
document.body; //取得对<body>的引用
document.doctype; //取得对<!DOCTYPE>的引用
```

#### 2.2 文档信息

```	javascript
document.title; //取得文档标题
document.title = "New page title"; //设置文档标题
document.URL;//取得完整的 URL
document.domain;//取得域名
document.referrer;//取得来源页面的 URL
```

#### 2.3 DOM一致性检测(检测DOM支持特性)

```javascript
document.implementation.hasFeature("XML", "1.0"); // 要检测的 DOM 功能的名称及版本号。
```



### 3 Element类型

> Element类型用于表现XML或HTML元素, 提供了对元素标签名、子节点及特性的访问.

#### 3.1 HTML元素

> 所有HTML元素都由HTMLElement类型表示
>
> ```javascript
> var div = document.getElementById("myDiv");
> alert(div.id); //"获取ID"" - 可修改
> alert(div.className); //"获取class"- 可修改
> alert(div.title); //"获取title属性"- 可修改
> alert(div.lang); //"获取元素语言"- 可修改
> alert(div.dir); //"获取文本的方向"- 可修改
> ```



### 4 Text类型

> 文本节点由 Text 类型表示，包含的是可以照字面介绍的纯文本内容。
>
> ```javascript
> appendData(text) // 将text添加到节点的末尾
> deleteData(offset, count) // 从offset指定的位置开始删除count个字符
> insertData(offset, text) // 在offset指定的位置插入text
> replaceData(offset, count, text) // 用text替换从offset指定的位置开始到offset + count为止出的文本
> splitText(offset) // 从offset指定的位置将当前文本节点分成两个文本节点
> substringData(offset, count) // 提取从offset指定的位置开始到offset + count 位置处的字符串
> ```

### 5 Comment类型

> 注释在DOM中是通过Comment类型来表示的

### 6 CDATASection类型

> 只针对基于XML的文档, 表示的是 CDATA 区域

### 7 DocumentType类型

> 包含着与文档的doctype有关信息

### 8 DocumentFragment类型

> **标识文档片段 .** 在所有节点类型中, 只有DocumentFragment在文档中没有对应的标记. 

### 9 Attr类型

> 表示元素的特性



****



## DOM扩展

### 1 HTML5相关DOM扩展

#### 1.1 与类相关的扩展

> *  getElementsByClassName(): 查找元素
> * classsList: 操作元素class

#### 1.2 焦点管理

> document.activeElement属性: 引用文档中获得焦点的元素
>
> focus()方法: 获取焦点
>
> document.hasFocus(): 判断文档是否获得了焦点

#### 1.3 HTMLDocument的变化

> document对象引入了readyState属性: 
>
> * loading: 正在加载文档.
> * complete: 已经加载完文档
>
> 检测页面的兼容模式: 
>
> ```javascript
> if (document.compatMode == "CSS1Compat"){
>     // 标准模式
> 	alert("Standards mode");
> } else {
>     // 混杂模式
> 	alert("Quirks mode");
> }
> ```
>
>  document.head: 引用文档的<head>元素

#### 1.4 字符集属性

> ```javascript
> alert(document.charset); //"UTF-16" -- 获取文档的字符集
> document.charset = "UTF-8"; // 修改文档的字符集
> ```
>
> document.defaultCharset: 根据当前浏览器及操作系统的设置, 当前文档默认的字符集应该是什么.

#### 1.5 自定义数据属性

> 为元素添加非标准的属性, 添加前缀data-.

#### 1.6 插入标记

> innerHTML属性: 返回与调用元素的所有子节点(包括元素、注释和文本节点）对应的HTML标记 -- 可读写
>
> outerHTML属性: 返回与调用它的元素及所有子节点(包括元素、注释和文本节点）对应的HTML标记 -- 可读写
>
> insertAdjacentHTML(插入位置, 要插入的HTML文本)方法: 插入指定位置
>
> 上述会造成内存和性能问题

#### 1.7 scrollIntoView()方法

> 在所有HTML元素上调用, 通过滚动浏览器或某个容器元素, 调用元素就可以出现在视口中



### 2 专有扩展

> 属于浏览器专有的扩展, 并没有成为标准

#### 2.1 children属性

> 返回子元素, 不包含注释和文本
>
> 兼容性不错

#### 2.2 contains()方法

> 判断某个节点是不是另一个节点的后代

#### 2.3 插入文本

> innerText属性: 操作元素中包含的所有文本内容, 包括子文档树中的文本 -- 设置innerText永远只会生成当前节点的一个自文本节点.
>
> outerText属性: 与innerText属性区别在于, outerText将作用范围扩大到了包含调用它的节点上

#### 2.4 滚动

```javascript
scrollIntoViewIfNeeded(alignCenter); // 只在当前元素在视口中不可见的情况下, 才滚动浏览器窗口或容器元素, 最终让它可见.
scrollByLines(lineCount); // 将元素的内容滚动指定的行高
scrollByPages(pageCount); // 将元素的内容滚动指定的页面高度
```



****



## DOM2 和 DOM3

### 1 样式

#### 1.1 访问元素的样式

> * style对象是CSSStyleDeclaration的示例, 包含HTML的style特性, 但不包含与外部样式表或嵌入样式表经层叠而来的样式
>
> * DOM2级样式 为style对象定义了一些属性 和 方法
>
>   ```javascript
>   cssText // 通过它能够访问到 style 特性中的 CSS 代码。
>   length: // 应用给元素的CSS属性的数量
>   getPropertyCSSValue(propertyName)// 返回指定属性值得CSSValue对象
>   getPropertyValue(propertyName) // 返回给定属性的字符串值
>   item(index) // 返回给定位置的CSS属性的名称
>   setProperty(propertyName,value,priority) // 将给定属性设置为相应的值, 并加上优先权标志(important或者一个空字符串)
>   ```
>
> * 元素大小
>
>   > * 偏移量: 包括元素在屏幕上占用的所有可见的空间

### 2 遍历

#### 3 范围 