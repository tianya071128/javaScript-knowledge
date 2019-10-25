## 1. DOM节点层次

> DOM将HTML或XML文档描绘成一个由多层节点构成的结构

### 1.1 Node类型

> * 所有节点类型都继承至Node类型, 因此所有节点类型都共享着相同的基本属性和方法
> * nodetType属性: 表明节点的类型
> * nodeName属性: 对于元素节点, 表示节点标签名 
> * nodeValue属性: 对于元素节点, 始终为null

### 1.2 Document类型

> * Document类型表示**文档**, document对象是HTMLDocument(继承至Document类型)的一个实例
> * 通过这个文档对象, 可以取得与页面有关的信息, 而且还能操作页面的外观及其底层结构

#### 1.2.1  文档的子节点

```javascript
document.documentElement; //取得对<html>的引用
document.childNodes[0]; //取得对<html>的引用
document.firstChild; //取得对<html>的引用
document.body; //取得对<body>的引用
document.doctype; //取得对<!DOCTYPE>的引用
```

#### 1.2.2 文档信息

```	javascript
document.title; //取得文档标题
document.title = "New page title"; //设置文档标题
document.URL;//取得完整的 URL
document.domain;//取得域名
document.referrer;//取得来源页面的 URL
```

#### 1.2.3 DOM一致性检测(检测DOM支持特性)

```javascript
document.implementation.hasFeature("XML", "1.0"); // 要检测的 DOM 功能的名称及版本号。
```

### 1.3 Element类型

> Element类型用于表现XML或HTML元素, 提供了对元素标签名、子节点及特性的访问.

#### 1.3.1 HTML元素

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

### 1.4 Text类型

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

### 1.5 Comment类型

> 注释在DOM中是通过Comment类型来表示的

### 1.6 CDATASection类型

> 只针对基于XML的文档, 表示的是 CDATA 区域

### 1.7 DocumentType类型

> 包含着与文档的doctype有关信息

### 1.8 DocumentFragment类型

> **标识文档片段 .** 在所有节点类型中, 只有DocumentFragment在文档中没有对应的标记. 

### 1.9 Attr类型

> 表示元素的特性

***********

**************

***************







## 7. DOM相关API

### 节点关系

* childNodes属性: 访问子节点
* parentNode属性: 访问父节点
* previousSibling属性: 上一个子节点, 对于第一个节点, 属性值为null
* nextSibling属性: 下一个子节点, 对于最后一个节点, 属性值为null
* firstChild属性: 访问父节点的第一个子节点
* lastChild属性: 访问父节点的最后一个子节点
* ownerDocument属性: 表示整个文档的文档节点
* hasChildNodes()方法: 包含一或多个子节点时返回true

### 操作节点

* appendChild(node)

     ```javascript
  /**
  	 * @name: 在子节点末尾添加一个节点
       * @param {node: 节点} 
       * @return: 新增的节点
       */
  ```

* insertBefore

  ```	javascript
  /**		
  	 * @name: 在子节点特定位置插入节点
       * @param {newnode: 要插入节点, } 
       * @param {existingnode: 要插入节点, } 
       * @return: 新增的节点
       */
  ```

* replaceChild(newNode, oldNode): newNode替换oldNode节点, 并且oldNode节点将被删除

  ```javascript
  /**
       * @param {newnode: 要插入节点, } 
       * @param {oldNode: 替换节点, } 
       * @return: 替换节点
       */
  ```

* removeChild(removeNode): 删除节点

  ```javascript
  /**
       * @param {removeNode: 删除节点, } 
       * @return: 删除节点
       */
  ```

* cloneNode(boolean): 克隆节点

  ```javascript
  /**
       * @param {boolean: true为深克隆,子节点也会克隆, false为浅克隆, 只克隆父节点 } 
       * @return: 克隆节点
       */
  ```

* normalize(): 处理文档树中文本节点,  合并相邻的文本节点并删除空的文本节点。 

  ```javascript
  /**
       * @return: 没有返回值
       */
  ```

### 查找元素

*  getElementById(#id): 根据ID查找指定元素

  ```javascript
  /**
       * @param {#id: 要取得元素的ID } 
       * @return: 指定元素
       */
  ```

* getElementsByTagName(tagName): 取得相同标签名的NodeList元素集合

  ```javascript
  /**
       * @param {tagName: 标签名 } 
       * @return: NodeList元素集合
       */
  
  // ====== 
  document.getElementsByTagName("*"); // 取得文档所有元素
  ```

* getElementsByName(name): 取得带有给定name特性的所有元素

  ```javascript
  /**
       * @param {name: 元素name特性值 } 
       * @return: NodeList元素集合
       */
  ```

* 特殊集合

  ```javascript
  document.anchors // 包含文档中所有带name特性的<a>元素
  document.forms // 包含文档中所有的<form>元素
  document.images // 包含文档中所有的 <img> 元素
  document.links// 包含文档中所有带 href特性的 <a> 元素。
  ```


### 取得元素特性

* getAttribute(attributename ): 获取元素特性

  ```javascript
  /**
       * @param {attributename: 元素特性名 } 
       * @return: 元素指定特性值
       */
  ```

* setAttribute(attributename, attributevalue): 设置元素特性

  ```javascript
  /**
       * @param {attributename: 要设置的特性名 } 
       * @param {attributevalue: 要设置的特性值 } 
       * @return: 没有返回值
       */
  ```

* removeAttribute(attributename): 删除元素特性

  ```javascript
  /**
       * @param {attributename: 要删除的特性名 } 
       * @return: 没有返回值
       */
  ```

### 创建节点

* document.createElement(nodeName): 创建元素节点

  ```javascript
  /**
       * @param {nodeName: 元素标签名(div) 或 完整的元素标签(<div id=\"myNewDiv\" class=\"box\"></div >) } 
       * @return: 元素对象
       */
  ```

* document.createTextNode(textName): 创建文本节点

  ```javascript
  /**
       * @param {textName: 节点内容 } 
       * @return: 文本节点对象
       */
  ```

* document.createDocumentFragment(): 创建文档对象. 将文档对象添加到文档时, 只会将文档对象所有子节点添加进去. ***文档对象本身永远不会成为文档树的一部分***

  ```javascript
  
  /**
       * @param none
       * @return: 文档对象
       */
  ```

*  document.createAttribute( attributename) : 创建特性节点

  ```javascript
  /**
       * @param {attributename: 特性值 } 
       * @return: 特性节点
       */
  ```

  



















