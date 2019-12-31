## 节点关系

* childNodes属性: 访问子节点
* parentNode属性: 访问父节点
* previousSibling属性: 上一个子节点, 对于第一个节点, 属性值为null
* nextSibling属性: 下一个子节点, 对于最后一个节点, 属性值为null
* firstChild属性: 访问父节点的第一个子节点
* lastChild属性: 访问父节点的最后一个子节点
* ownerDocument属性: 表示整个文档的文档节点
* hasChildNodes()方法: 包含一或多个子节点时返回true

****

> **以上的会返回文本节点和注释, 在DOM扩展中以下属性解决了这一差异**
>
> 兼容性: IE 9+...

* childElementCount属性: 返回子元素(不包含文本节点和注释)的个数。
* firstElementChild属性: 指向第一个子元素;firstChild的元素版
* lastElementChild属性: 指向最后一个子元素; lastChild的元素版
* previousElementSibling属性: 指向前一个同辈元素; previousSibling的元素版
* nextElementSibling属性: 指向后一个同辈元素; nextSibling的元素版

* children属性: 访问子节点; childNodes的元素版



## 操作节点

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



## 查找元素

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

* querySelector(CSS选择符); 返回CSS选择符命中的第一个元素, 如果没有找到命中的, 返回null

  ```javascript
  /**
       * @param {CSS选择符: CSS选择器 } 
       * @return: 匹配的第一个元素
       */
  ```

* querySelectorAll(CSS选择符); 返回CSS选择符命中的所有元素(NodeList元素集合), 如果没有找到命中的, 返回null

  ```javascript
  /**
       * @param {CSS选择符: CSS选择器 } 
       * @return: 匹配的NodeList元素集合
       */
  ```

*  getElementsByClassName(className): 查找文档中多有指定类名的NodeList元素集合

  ```javascript
  /**
       * @param {className: 你需要获取的元素类名。多个类名使用空格分隔，如 "test demo"。
       * @return:所有指定类名的元素集合，作为 NodeList 对象。
       */
  ```

* 特殊集合

  ```javascript
  document.anchors // 包含文档中所有带name特性的<a>元素
  document.forms // 包含文档中所有的<form>元素
  document.images // 包含文档中所有的 <img> 元素
  document.links// 包含文档中所有带 href特性的 <a> 元素。
  ```

   
  
## 取得元素特性

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



## 创建节点

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



## 操作class: classList

> classList属性是新集合类型DOMTokenList的实例

```javascript
div.classList.add(value); // 将给定的字符串值添加到列表中, 如果值已经存在, 就不添加了
div.classList.contains(value); // 表示列表中是否存在给定的值
div.classList.remove(value); // 从列表中删除给定的字符串
div.classList.toggle(value); // 如果列表中已经存在给定的值, 删除它; 如果列表中没有给定的值, 添加它
```



## 焦点管理

* document.activeElement属性: 引用DOM中当期获得了焦点的元素

  > 文档刚刚加载完成时, document.activeElement保存的是document.body元素, 文档加载期间, document.activeElement的值为null.

* focus(): 用于为元素设置焦点

  ```javascript
  /**
       * @return: 没有返回值
       */
  ```

  > 元素获取焦点的方式有: 页面加载、用户输入(通过是通过按Tab键)、调用focus()方法

* hasFocus(): 用于检测文档(或文档内的任一元素)是否获取焦点

  ```javascript
  /**
       * @param none
       * @return: true: 获取焦点 | false: 未获取焦点
       */
  ```



## 自定义数据属性: dataset

> dataset属性的值时DOMStringMap的一个实例. 在这个实例中, 每个data-name形式的属性都会有一个对应的属性, ***属性名没有data-前缀***

```javascript
// 示例
var div = document.getElementById("myDiv");

//取得自定义属性的值
var appId = div.dataset.appId;
var myName = div.dataset.myname;

//设置值
div.dataset.appId = 23456;
div.dataset.myname = "Michael";
```



## 页面滚动: scrollIntoView()

> **在所有HTML元素上调用, 通过滚动浏览器或某个容器元素, 调用元素就可以出现在视口中**
>
> 实际上, 为某个元素设置焦点也会导致浏览器滚动并显示出获得焦点的元素
>
> 详情见MDN



## 元素样式 以及 大小

* document.defaultView.getComputedStyle(element, [pseudoElt]): 获取当前元素的所有计算的样式, 包含从样式表层叠而来的样式

  ```javascript
  /**
       * @param element: 用于获取计算样式的Element
       * @param pseudoElt(可选): 指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）
       * @return: 返回的style是一个实时的CSSStyleDeclaration 对象，当元素的样式更改时，它会自动更新本身。
       */
  // 返回值时一个对象, 包含元素的样式, 对象为只读对象, 不可写入
  ```

* 偏移量: 包括元素在屏幕上占用的所有可见的空间

  ```javascript
  // 都是只读属性, 不可写
  offsetHeight // 元素的高度 + 水平滚动条 + 上下内边距 + 上下边框
  offsetWidth: // 元素的宽度 + 垂直滚动条 + 左右内边距 + 左右边框
  offsetLeft: // 元素的左外边距至包含元素的左内边框之间的像素距离
  offsetTop: // 元素的上外边距至包含元素的上内边框之间的像素距离
  offsetParent // 包含元素的引用, 不一定与parentNode的值相等 --只读属性，返回一个指向最近的（closest，指包含层级上的最近）包含该元素的定位元素。如果没有定位的元素，则 offsetParent 为最近的 table, td, th或body元素。当元素的 style.display 设置为 "none" 时，offsetParent 返回 null。
  ```

  ![偏移量](../image/偏移量.png '偏移量')

* 客户区大小: 元素内容及其内边距所占据的空间大小

  ```javascript
  // 都是只读属性, 不可写
  clientWidth // 元素的高度 + 上下内边距-- 不包含滚动条以及滚动的距离
  clientHeight: // 元素的宽度 + 左右内边距 -- 不包含滚动条以及滚动的距离
  
  // 用来确定客户端客户区大小(可视区大小): 
  function getViewport(){
  	if (document.compatMode == "BackCompat"){
  		return {
  			width: document.body.clientWidth,
  			height: document.body.clientHeight
  		};
  	} else {
  		return {
  			width:  						document.documentElement.clientWidth,
  			height:
            document.documentElement.clientHeight
  		};
  	}
  }
  ```

  ![客户区](../image/客户区.png '客户区')

* 滚动大小: 包含滚动内容的元素大小

  ```javascript
  
  scrollHeight // 在没有滚动条的情况下, 元素内容的总高度 -- 只读属性
  scrollWidth: // 在没有滚动条的情况下, 元素内容的总宽度-- 只读属性
  scrollLeft: // 被隐藏在内容区域左侧的像素数. -- 可读写
  scrollTop // 被隐藏在内容区域上方的像素数. -- 可读写
  
  // 确定文档的总高度(包括基于视口的最小高度), 
  var docHeight = Math.max(document.documentElement.scrollHeight,
  document.documentElement.clientHeight);
  var docWidth = Math.max(document.documentElement.scrollWidth,
  document.documentElement.clientWidth);
  ```

  ![滚动大小](../image/滚动大小.png '滚动大小')

* 确定元素大小: 确定元素在页面中相对于视口的位置

  ```javascript
  // IE8-的起始坐标为(2, 2) == 有兼容性问题 
  getBoundingClientRect()
   /**
       * @param none
       * @return: TextRectangle对象
       	rectObject.top：元素上边到视窗上边的距离;
          rectObject.right：元素右边到视窗左边的距离;
  		rectObject.bottom：元素下边到视窗上边的距离;
          rectObject.left：元素左边到视窗左边的距离;
       */
  ```

  ![元素大小](../image/元素大小.png '元素大小')



## 节点遍历 及 范围


*  节点遍历

   ```javascript
   /*
     *  @param: root: 作为搜索起点的树中的节点
     *  @param: whatToshow: 要访问哪些节点的数字代码
     *  @param: filter: 是一个NodeFilter对象, 或者一个表示应该接受还是拒绝某种特定节点的函数
     *  @param: entityReferenceExpansion: 要访问哪些节点的数字代码
     *  @return: 返回一个NodeIterator实例, 包含root中返回filter条件的所有节点
   */
   var iterator = document.createNodeIterator(root, 		NodeFilter.SHOW_ELEMENT,
   filter, false);
   // 返回的iterator有两个主要方法: nextNode() 和 previousNode()
   // 存在兼容性问题
   ```

   ```javascript
   /*
     *  @param: root: 作为搜索起点的树中的节点
     *  @param: whatToshow: 要访问哪些节点的数字代码
     *  @param: filter: 是一个NodeFilter对象, 或者一个表示应该接受还是拒绝某种特定节点的函数
     *  @param: entityReferenceExpansion: 要访问哪些节点的数字代码
     *  @return: 返回一个NodeIterator实例, 包含root中返回filter条件的所有节点
   */
   var walker = document.createTreeWalker(root, 		NodeFilter.SHOW_ELEMENT,
   filter, false);
   /* 返回的walker主要方法: 
   	parentNode(): 遍历到当前节点的父节点
   	firstChild(): 遍历到当前节点的第一个子节点
   	lastChild(): 遍历到当前节点的最后一个子节点
   	nextSibling(): 遍历到当前节点的下一个同辈节点
   	previousSibling(): 遍历到当前节点的上一个同辈节点
   	currentNode属性; 在上一次遍历中返回的节点
   */
   ```

* 范围: document.createRange() -- 见MDN