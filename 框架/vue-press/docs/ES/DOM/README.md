## HTML DOM Document 对象

### HTML DOM 节点

在 HTML DOM (Document Object Model) 中 , 每一个元素都是 **节点**:

- 文档是一个文档节点。
- 所有的HTML元素都是元素节点。
- 所有 HTML 属性都是属性节点。
- 文本插入到 HTML 元素是文本节点。are text nodes。
- 注释是注释节点。

------

### Document 对象

当浏览器载入 HTML 文档, 它就会成为 **Document 对象**。

Document 对象是 HTML 文档的根节点。

Document 对象使我们可以从脚本中对 HTML 页面中的所有元素进行访问。

**提示：**Document 对象是 Window 对象的一部分，可通过 window.document 属性对其进行访问。



------

### Document 对象属性和方法

HTML文档中可以使用以下属性和方法:

| 属性 / 方法                                                  | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [document.activeElement](https://www.runoob.com/jsref/prop-document-activeelement.html) | 返回当前获取焦点元素                                         |
| [document.addEventListener()](https://www.runoob.com/jsref/met-document-addeventlistener.html) | 向文档添加句柄                                               |
| [document.adoptNode(node)](https://www.runoob.com/jsref/met-document-adoptnode.html) | 从另外一个文档返回 adapded 节点到当前文档。                  |
| [document.anchors](https://www.runoob.com/jsref/coll-doc-anchors.html) | 返回对文档中所有 Anchor 对象的引用。                         |
| document.applets                                             | 返回对文档中所有 Applet 对象的引用。**注意:** HTML5 已不支持 \<applet> 元素。 |
| [document.baseURI](https://www.runoob.com/jsref/prop-doc-baseuri.html) | 返回文档的绝对基础 URI                                       |
| [document.body](https://www.runoob.com/jsref/prop-doc-body.html) | 返回文档的body元素                                           |
| [document.close()](https://www.runoob.com/jsref/met-doc-close.html) | 关闭用 document.open() 方法打开的输出流，并显示选定的数据。  |
| [document.cookie](https://www.runoob.com/jsref/prop-doc-cookie.html) | 设置或返回与当前文档有关的所有 cookie。                      |
| [document.createAttribute()](https://www.runoob.com/jsref/met-document-createattribute.html) | 创建一个属性节点                                             |
| [document.createComment()](https://www.runoob.com/jsref/met-document-createcomment.html) | createComment() 方法可创建注释节点。                         |
| [document.createDocumentFragment()](https://www.runoob.com/jsref/met-document-createdocumentfragment.html) | 创建空的 DocumentFragment 对象，并返回此对象。               |
| [document.createElement()](https://www.runoob.com/jsref/met-document-createelement.html) | 创建元素节点。                                               |
| [document.createTextNode()](https://www.runoob.com/jsref/met-document-createtextnode.html) | 创建文本节点。                                               |
| [document.doctype](https://www.runoob.com/jsref/prop-document-doctype.html) | 返回与文档相关的文档类型声明 (DTD)。                         |
| [document.documentElement](https://www.runoob.com/jsref/prop-document-documentelement.html) | 返回文档的根节点                                             |
| [document.documentMode](https://www.runoob.com/jsref/prop-doc-documentmode.html) | 返回用于通过浏览器渲染文档的模式                             |
| [document.documentURI](https://www.runoob.com/jsref/prop-document-documenturi.html) | 设置或返回文档的位置                                         |
| [document.domain](https://www.runoob.com/jsref/prop-doc-domain.html) | 返回当前文档的域名。                                         |
| document.domConfig                                           | **已废弃**。返回 normalizeDocument() 被调用时所使用的配置。  |
| [document.embeds](https://www.runoob.com/jsref/coll-doc-embeds.html) | 返回文档中所有嵌入的内容（embed）集合                        |
| [document.forms](https://www.runoob.com/jsref/coll-doc-forms.html) | 返回对文档中所有 Form 对象引用。                             |
| [document.getElementsByClassName()](https://www.runoob.com/jsref/met-document-getelementsbyclassname.html) | 返回文档中所有指定类名的元素集合，作为 NodeList 对象。       |
| [document.getElementById()](https://www.runoob.com/jsref/met-document-getelementbyid.html) | 返回对拥有指定 id 的第一个对象的引用。                       |
| [document.getElementsByName()](https://www.runoob.com/jsref/met-doc-getelementsbyname.html) | 返回带有指定名称的对象集合。                                 |
| [document.getElementsByTagName()](https://www.runoob.com/jsref/met-document-getelementsbytagname.html) | 返回带有指定标签名的对象集合。                               |
| [document.images](https://www.runoob.com/jsref/coll-doc-images.html) | 返回对文档中所有 Image 对象引用。                            |
| [document.implementation](https://www.runoob.com/jsref/prop-document-implementation.html) | 返回处理该文档的 DOMImplementation 对象。                    |
| [document.importNode()](https://www.runoob.com/jsref/met-document-importnode.html) | 把一个节点从另一个文档复制到该文档以便应用。                 |
| [document.inputEncoding](https://www.runoob.com/jsref/prop-document-inputencoding.html) | 返回用于文档的编码方式（在解析时）。                         |
| [document.lastModified](https://www.runoob.com/jsref/prop-doc-lastmodified.html) | 返回文档被最后修改的日期和时间。                             |
| [document.links](https://www.runoob.com/jsref/coll-doc-links.html) | 返回对文档中所有 Area 和 Link 对象引用。                     |
| [document.normalize()](https://www.runoob.com/jsref/met-document-normalize.html) | 删除空文本节点，并连接相邻节点                               |
| [document.normalizeDocument()](https://www.runoob.com/jsref/met-document-normalizedocument.html) | 删除空文本节点，并连接相邻节点的                             |
| [document.open()](https://www.runoob.com/jsref/met-doc-open.html) | 打开一个流，以收集来自任何 document.write() 或 document.writeln() 方法的输出。 |
| [document.querySelector()](https://www.runoob.com/jsref/met-document-queryselector.html) | 返回文档中匹配指定的CSS选择器的第一元素                      |
| [document.querySelectorAll()](https://www.runoob.com/jsref/met-document-queryselectorall.html) | document.querySelectorAll() 是 HTML5中引入的新方法，返回文档中匹配的CSS选择器的所有元素节点列表 |
| [document.readyState](https://www.runoob.com/jsref/prop-doc-readystate.html) | 返回文档状态 (载入中……)                                      |
| [document.referrer](https://www.runoob.com/jsref/prop-doc-referrer.html) | 返回载入当前文档的文档的 URL。                               |
| [document.removeEventListener()](https://www.runoob.com/jsref/met-document-removeeventlistener.html) | 移除文档中的事件句柄(由 addEventListener() 方法添加)         |
| [document.renameNode()](https://www.runoob.com/jsref/met-document-renamenode.html) | 重命名元素或者属性节点。                                     |
| [document.scripts](https://www.runoob.com/jsref/coll-doc-scripts.html) | 返回页面中所有脚本的集合。                                   |
| [document.strictErrorChecking](https://www.runoob.com/jsref/prop-document-stricterrorchecking.html) | 设置或返回是否强制进行错误检查。                             |
| [document.title](https://www.runoob.com/jsref/prop-doc-title.html) | 返回当前文档的标题。                                         |
| [document.URL](https://www.runoob.com/jsref/prop-doc-url.html) | 返回文档完整的URL                                            |
| [document.write()](https://www.runoob.com/jsref/met-doc-write.html) | 向文档写 HTML 表达式 或 JavaScript 代码。                    |
| [document.writeln()](https://www.runoob.com/jsref/met-doc-writeln.html) | 等同于 write() 方法，不同的是在每个表达式之后写一个换行符。  |



------

### 警告 !!!

在 W3C DOM核心，文档对象 继承节点对象的所有属性和方法。

很多属性和方法在文档中是没有意义的。

**HTML 文档对象可以避免使用这些节点对象和属性：**

| 属性 / 方法              | 避免的原因                  |
| :----------------------- | :-------------------------- |
| document.attributes      | 文档没有该属性              |
| document.hasAttributes() | 文档没有该属性              |
| document.nextSibling     | 文档没有下一节点            |
| document.nodeName        | 这个通常是 #document        |
| document.nodeType        | 这个通常是 9(DOCUMENT_NODE) |
| document.nodeValue       | 文档没有一个节点值          |
| document.ownerDocument   | 文档没有主文档              |
| document.ownerElement    | 文档没有自己的节点          |
| document.parentNode      | 文档没有父节点              |
| document.previousSibling | 文档没有兄弟节点            |
| document.textContent     | 文档没有文本节点            |



## HTML DOM 元素对象

------

### HTML DOM 节点

在 HTML DOM (Document Object Model) 中, 每个东西都是 **节点** :

- 文档本身就是一个文档对象
- 所有 HTML 元素都是元素节点
- 所有 HTML 属性都是属性节点
- 插入到 HTML 元素文本是文本节点
- 注释是注释节点

------

### 元素对象

在 HTML DOM 中, **元素对象**代表着一个 HTML 元素。

元素对象 的 **子节点**可以是, 可以是元素节点，文本节点，注释节点。

**NodeList 对象** 代表了节点列表，类似于 HTML元素的子节点集合。

元素可以有属性。属性属于属性节点（查看下一章节）。



------

### 属性和方法

以上属性和方法可适用于所有 HTML 元素：

| 属性 / 方法                                                  | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [*element*.accessKey](https://www.runoob.com/jsref/prop-html-accesskey.html) | 设置或返回accesskey一个元素                                  |
| [*element*.addEventListener()](https://www.runoob.com/jsref/met-element-addeventlistener.html) | 向指定元素添加事件句柄                                       |
| [*element*.appendChild()](https://www.runoob.com/jsref/met-node-appendchild.html) | 为元素添加一个新的子元素                                     |
| [*element*.attributes](https://www.runoob.com/jsref/prop-node-attributes.html) | 返回一个元素的属性数组                                       |
| [*element*.childNodes](https://www.runoob.com/jsref/prop-node-childnodes.html) | 返回元素的一个子节点的数组                                   |
| [*element*.children](https://www.runoob.com/jsref/prop-element-children.html) | 返回元素的子元素的集合                                       |
| [*element*.classList](https://www.runoob.com/jsref/prop-element-classList.html) | 返回元素的类名，作为 DOMTokenList 对象。                     |
| [*element*.className](https://www.runoob.com/jsref/prop-html-classname.html) | 设置或返回元素的class属性                                    |
| *element*.clientHeight                                       | 在页面上返回内容的可视高度（不包括边框，边距或滚动条）       |
| *element*.clientWidth                                        | 在页面上返回内容的可视宽度（不包括边框，边距或滚动条）       |
| [*element*.cloneNode()](https://www.runoob.com/jsref/met-node-clonenode.html) | 克隆某个元素                                                 |
| [*element*.compareDocumentPosition()](https://www.runoob.com/jsref/met-node-comparedocumentposition.html) | 比较两个元素的文档位置。                                     |
| [*element*.contentEditable](https://www.runoob.com/jsref/prop-html-contenteditable.html) | 设置或返回元素的内容是否可编辑                               |
| [*element*.dir](https://www.runoob.com/jsref/prop-html-dir.html) | 设置或返回一个元素中的文本方向                               |
| [*element*.firstChild](https://www.runoob.com/jsref/prop-node-firstchild.html) | 返回元素的第一个子节点                                       |
| [*element*.focus()](https://www.runoob.com/jsref/met-html-focus.html) | 设置文档或元素获取焦点                                       |
| [*element*.getAttribute()](https://www.runoob.com/jsref/met-element-getattribute.html) | 返回指定元素的属性值                                         |
| [*element*.getAttributeNode()](https://www.runoob.com/jsref/met-element-getattributenode.html) | 返回指定属性节点                                             |
| [*element*.getElementsByTagName()](https://www.runoob.com/jsref/met-element-getelementsbytagname.html) | 返回指定标签名的所有子元素集合。                             |
| [*element*. getElementsByClassName()](https://www.runoob.com/jsref/met-element-getelementsbyclassname.html) | 返回文档中所有指定类名的元素集合，作为 NodeList 对象。       |
| *element*.getFeature()                                       | 返回指定特征的执行APIs对象。                                 |
| *element*.getUserData()                                      | 返回一个元素中关联键值的对象。                               |
| [*element*.hasAttribute()](https://www.runoob.com/jsref/met-element-hasattribute.html) | 如果元素中存在指定的属性返回 true，否则返回false。           |
| [*element*.hasAttributes()](https://www.runoob.com/jsref/met-node-hasattributes.html) | 如果元素有任何属性返回true，否则返回false。                  |
| [*element*.hasChildNodes()](https://www.runoob.com/jsref/met-node-haschildnodes.html) | 返回一个元素是否具有任何子元素                               |
| [*element*.hasFocus()](https://www.runoob.com/jsref/met-document-hasfocus.html) | 返回布尔值，检测文档或元素是否获取焦点                       |
| [*element*.id](https://www.runoob.com/jsref/prop-html-id.html) | 设置或者返回元素的 id。                                      |
| [*element*.innerHTML](https://www.runoob.com/jsref/prop-html-innerhtml.html) | 设置或者返回元素的内容。                                     |
| [*element*.insertBefore()](https://www.runoob.com/jsref/met-node-insertbefore.html) | 现有的子元素之前插入一个新的子元素                           |
| [*element*.isContentEditable](https://www.runoob.com/jsref/prop-html-iscontenteditable.html) | 如果元素内容可编辑返回 true，否则返回false                   |
| [*element*.isDefaultNamespace()](https://www.runoob.com/jsref/met-node-isdefaultnamespace.html) | 如果指定了namespaceURI 返回 true，否则返回 false。           |
| [*element*.isEqualNode()](https://www.runoob.com/jsref/met-node-isequalnode.html) | 检查两个元素是否相等                                         |
| [*element*.isSameNode()](https://www.runoob.com/jsref/met-node-issamenode.html) | 检查两个元素所有有相同节点。                                 |
| [*element*.isSupported()](https://www.runoob.com/jsref/met-node-issupported.html) | 如果在元素中支持指定特征返回 true。                          |
| [*element*.lang](https://www.runoob.com/jsref/prop-html-lang.html) | 设置或者返回一个元素的语言。                                 |
| [*element*.lastChild](https://www.runoob.com/jsref/prop-node-lastchild.html) | 返回的最后一个子节点                                         |
| [*element*.namespaceURI](https://www.runoob.com/jsref/prop-node-namespaceuri.html) | 返回命名空间的 URI。                                         |
| [*element*.nextSibling](https://www.runoob.com/jsref/prop-node-nextsibling.html) | 返回该元素紧跟的一个节点                                     |
|                                                              |                                                              |
| [*element*.nextElementSibling](https://www.runoob.com/jsref/prop-element-nextelementsibling.html) | 返回指定元素之后的下一个兄弟元素（相同节点树层中的下一个元素节点）。 |
| [*element*.nodeName](https://www.runoob.com/jsref/prop-node-nodename.html) | 返回元素的标记名（大写）                                     |
| [*element*.nodeType](https://www.runoob.com/jsref/prop-node-nodetype.html) | 返回元素的节点类型                                           |
| [*element*.nodeValue](https://www.runoob.com/jsref/prop-node-nodevalue.html) | 返回元素的节点值                                             |
| [*element*.normalize()](https://www.runoob.com/jsref/met-node-normalize.html) | 使得此成为一个"normal"的形式，其中只有结构（如元素，注释，处理指令，CDATA节和实体引用）隔开Text节点，即元素（包括属性）下面的所有文本节点，既没有相邻的文本节点也没有空的文本节点 |
| *element*.offsetHeight                                       | 返回任何一个元素的高度包括边框和填充，但不是边距             |
| *element*.offsetWidth                                        | 返回元素的宽度，包括边框和填充，但不是边距                   |
| *element*.offsetLeft                                         | 返回当前元素的相对水平偏移位置的偏移容器                     |
| *element*.offsetParent                                       | 返回元素的偏移容器                                           |
| *element*.offsetTop                                          | 返回当前元素的相对垂直偏移位置的偏移容器                     |
| [*element*.ownerDocument](https://www.runoob.com/jsref/prop-node-ownerdocument.html) | 返回元素的根元素（文档对象）                                 |
| [*element*.parentNode](https://www.runoob.com/jsref/prop-node-parentnode.html) | 返回元素的父节点                                             |
| [*element*.previousSibling](https://www.runoob.com/jsref/prop-node-previoussibling.html) | 返回某个元素紧接之前元素                                     |
| [*element*.previousElementSibling](https://www.runoob.com/jsref/prop-element-previouselementsibling.html) | 返回指定元素的前一个兄弟元素（相同节点树层中的前一个元素节点）。 |
| [*element*.querySelector()](https://www.runoob.com/jsref/met-element-queryselector.html) | 返回匹配指定 CSS 选择器元素的第一个子元素                    |
| document.querySelectorAll()                                  | 返回匹配指定 CSS 选择器元素的所有子元素节点列表              |
| [*element*.removeAttribute()](https://www.runoob.com/jsref/met-element-removeattribute.html) | 从元素中删除指定的属性                                       |
| [*element*.removeAttributeNode()](https://www.runoob.com/jsref/met-element-removeattributenode.html) | 删除指定属性节点并返回移除后的节点。                         |
| [*element*.removeChild()](https://www.runoob.com/jsref/met-node-removechild.html) | 删除一个子元素                                               |
| [*element*.removeEventListener()](https://www.runoob.com/jsref/met-element-removeeventlistener.html) | 移除由 addEventListener() 方法添加的事件句柄                 |
| [*element*.replaceChild()](https://www.runoob.com/jsref/met-node-replacechild.html) | 替换一个子元素                                               |
| *element*.scrollHeight                                       | 返回整个元素的高度（包括带滚动条的隐蔽的地方）               |
| *element*.scrollLeft                                         | 返回当前视图中的实际元素的左边缘和左边缘之间的距离           |
| *element*.scrollTop                                          | 返回当前视图中的实际元素的顶部边缘和顶部边缘之间的距离       |
| *element*.scrollWidth                                        | 返回元素的整个宽度（包括带滚动条的隐蔽的地方）               |
| [*element*.setAttribute()](https://www.runoob.com/jsref/met-element-setattribute.html) | 设置或者改变指定属性并指定值。                               |
| [*element*.setAttributeNode()](https://www.runoob.com/jsref/met-element-setattributenode.html) | 设置或者改变指定属性节点。                                   |
| *element*.setIdAttribute()                                   |                                                              |
| *element*.setIdAttributeNode()                               |                                                              |
| *element*.setUserData()                                      | 在元素中为指定键值关联对象。                                 |
| *element*.style                                              | 设置或返回元素的样式属性                                     |
| [*element*.tabIndex](https://www.runoob.com/jsref/prop-html-tabindex.html) | 设置或返回元素的标签顺序。                                   |
| [*element*.tagName](https://www.runoob.com/jsref/prop-element-tagname.html) | 作为一个字符串返回某个元素的标记名（大写）                   |
| [*element*.textContent](https://www.runoob.com/jsref/prop-node-textcontent.html) | 设置或返回一个节点和它的文本内容                             |
| [*element*.title](https://www.runoob.com/jsref/prop-html-title.html) | 设置或返回元素的title属性                                    |
| *element*.toString()                                         | 一个元素转换成字符串                                         |
| [*nodelist*.item()](https://www.runoob.com/jsref/met-nodelist-item.html) | 返回某个元素基于文档树的索引                                 |
| [*nodelist*.length](https://www.runoob.com/jsref/prop-nodelist-length.html) | 返回节点列表的节点数目。                                     |



## HTML DOM 属性 对象

------

### HTML DOM 节点

在 HTML DOM (Document Object Model) 中, 所有的都是 **节点**：

- 文档是文档节点
- 所有 HTML 元素是元素节点
- 所有 HTML 属性都是属性节点
- 插入到 HTML 元素中的文本为文本节点
- 注释是注释节点

### Attr 对象

在 HTML DOM 中, **Attr 对象** 代表一个 HTML 属性。

HTML属性总是属于HTML元素。

------

### NamedNodeMap 对象

在 HTML DOM 中, the **NamedNodeMap 对象** 表示一个无顺序的节点列表。

我们可通过节点名称来访问 NamedNodeMap 中的节点。

| 属性 / 方法                                                  | 描述                                                        |
| :----------------------------------------------------------- | :---------------------------------------------------------- |
| [*attr*.isId](https://www.runoob.com/jsref/prop-attr-isid.html) | 如果属性是 ID 类型，则 isId 属性返回 true，否则返回 false。 |
| [*attr*.name](https://www.runoob.com/jsref/prop-attr-name.html) | 返回属性名称                                                |
| [*attr*.value](https://www.runoob.com/jsref/prop-attr-value.html) | 设置或者返回属性值                                          |
| [*attr*.specified](https://www.runoob.com/jsref/prop-attr-specified.html) | 如果属性被指定返回 true ，否则返回 false                    |
|                                                              |                                                             |
| [*nodemap*.getNamedItem()](https://www.runoob.com/jsref/met-namednodemap-getnameditem.html) | 从节点列表中返回的指定属性节点。                            |
| [*nodemap*.item()](https://www.runoob.com/jsref/met-namednodemap-item.html) | 返回节点列表中处于指定索引号的节点。                        |
| [*nodemap*.length](https://www.runoob.com/jsref/prop-namednodemap-length.html) | 返回节点列表的节点数目。                                    |
| [*nodemap*.removeNamedItem()](https://www.runoob.com/jsref/met-namednodemap-removenameditem.html) | 删除指定属性节点                                            |
| [*nodemap*.setNamedItem()](https://www.runoob.com/jsref/met-namednodemap-setnameditem.html) | 设置指定属性节点(通过名称)                                  |



### DOM 4 警告 !!!

在 W3C DOM 内核中, Attr (属性) 对象继承节点对象的所有属性和方法 。

在 DOM 4 中, Attr (属性) 对象不再从节点对象中继承。

**从长远的代码质量来考虑，在属性对象中你需要避免使用节点对象属性和方法:**

| 属性 / 方法                              | 避免原因                   |
| :--------------------------------------- | :------------------------- |
| *attr*.appendChild()                     | 属性没有子节点             |
| *attr*.attributes                        | 属性没有属性               |
| *attr*.baseURI                           | 使用 document.baseURI 替代 |
| *attr*.childNodes                        | 属性没有子节点             |
| *attr*.cloneNode()                       | 使用 attr.value 替代       |
| *attr*.firstChild                        | 属性没有子节点             |
| *attr*.hasAttributes()                   | 属性没有属性               |
| *attr*.hasChildNodes                     | 属性没有子节点             |
| *attr*.insertBefore()                    | 属性没有子节点             |
| *attr*.isEqualNode()                     | 没有意义                   |
| *attr*.isSameNode()                      | 没有意义                   |
| *attr*.isSupported()                     | 通常为 true                |
| *attr*.lastChild                         | 属性没有子节点             |
| *attr*.nextSibling                       | 属性没有兄弟节点           |
| *attr*.nodeName                          | 使用 *attr*.name 替代      |
| *attr*.nodeType                          | 通常为 2 (ATTRIBUTE-NODE)  |
| *attr*.nodeValue                         | 使用 *attr*.value 替代     |
| *attr*.normalize()                       | 属性没有规范               |
| *attr*.ownerDocument                     | 通常为你的 HTML 文档       |
| *attr*.ownerElement                      | 你用来访问属性的 HTML 元素 |
| *attr*.parentNode                        | 你用来访问属性的 HTML 元素 |
| *attr*.previousSibling                   | 属性没有兄弟节点           |
| *attr*.removeChild                       | 属性没有子节点             |
| *attr*.replaceChild                      | 属性没有子节点             |
| *attr*.textContent使用 *attr*.value 替代 |                            |



## HTML DOM 事件

------

### HTML DOM 事件

HTML DOM 事件允许Javascript在HTML文档元素中注册不同事件处理程序。

事件通常与函数结合使用，函数不会在事件发生前被执行！ (如用户点击按钮)。

**提示：** 在 W3C 2 级 DOM 事件中规范了事件模型。

------

### HTML DOM 事件

**DOM：** 指明使用的 DOM 属性级别。

### 鼠标事件

| 属性                                                         | 描述                                   | DOM  |
| :----------------------------------------------------------- | :------------------------------------- | :--- |
| [onclick](https://www.runoob.com/jsref/event-onclick.html)   | 当用户点击某个对象时调用的事件句柄。   | 2    |
| [oncontextmenu](https://www.runoob.com/jsref/event-oncontextmenu.html) | 在用户点击鼠标右键打开上下文菜单时触发 |      |
| [ondblclick](https://www.runoob.com/jsref/event-ondblclick.html) | 当用户双击某个对象时调用的事件句柄。   | 2    |
| [onmousedown](https://www.runoob.com/jsref/event-onmousedown.html) | 鼠标按钮被按下。                       | 2    |
| [onmouseenter](https://www.runoob.com/jsref/event-onmouseenter.html) | 当鼠标指针移动到元素上时触发。         | 2    |
| [onmouseleave](https://www.runoob.com/jsref/event-onmouseleave.html) | 当鼠标指针移出元素时触发               | 2    |
| [onmousemove](https://www.runoob.com/jsref/event-onmousemove.html) | 鼠标被移动。                           | 2    |
| [onmouseover](https://www.runoob.com/jsref/event-onmouseover.html) | 鼠标移到某元素之上。                   | 2    |
| [onmouseout](https://www.runoob.com/jsref/event-onmouseout.html) | 鼠标从某元素移开。                     | 2    |
| [onmouseup](https://www.runoob.com/jsref/event-onmouseup.html) | 鼠标按键被松开。                       | 2    |

### 键盘事件

| 属性                                                         | 描述                       | DOM  |
| :----------------------------------------------------------- | :------------------------- | :--- |
| [onkeydown](https://www.runoob.com/jsref/event-onkeydown.html) | 某个键盘按键被按下。       | 2    |
| [onkeypress](https://www.runoob.com/jsref/event-onkeypress.html) | 某个键盘按键被按下并松开。 | 2    |
| [onkeyup](https://www.runoob.com/jsref/event-onkeyup.html)   | 某个键盘按键被松开。       | 2    |

### 框架/对象（Frame/Object）事件

| 属性                                                         | 描述                                                         | DOM  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--- |
| [onabort](https://www.runoob.com/jsref/event-onabort.html)   | 图像的加载被中断。 ( \<object>)                               | 2    |
| [onbeforeunload](https://www.runoob.com/jsref/event-onbeforeunload.html) | 该事件在即将离开页面（刷新或关闭）时触发                     | 2    |
| [onerror](https://www.runoob.com/jsref/event-onerror.html)   | 在加载文档或图像时发生错误。 ( \<object>, \<body>和 \<frameset>) |      |
| [onhashchange](https://www.runoob.com/jsref/event-onhashchange.html) | 该事件在当前 URL 的锚部分发生修改时触发。                    |      |
| [onload](https://www.runoob.com/jsref/event-onload.html)     | 一张页面或一幅图像完成加载。                                 | 2    |
| [onpageshow](https://www.runoob.com/jsref/event-onpageshow.html) | 该事件在用户访问页面时触发                                   |      |
| [onpagehide](https://www.runoob.com/jsref/event-onpagehide.html) | 该事件在用户离开当前网页跳转到另外一个页面时触发             |      |
| [onresize](https://www.runoob.com/jsref/event-onresize.html) | 窗口或框架被重新调整大小。                                   | 2    |
| [onscroll](https://www.runoob.com/jsref/event-onscroll.html) | 当文档被滚动时发生的事件。                                   | 2    |
| [onunload](https://www.runoob.com/jsref/event-onunload.html) | 用户退出页面。 ( \<body> 和 \<frameset>)                       | 2    |

### 表单事件

| 属性                                                         | 描述                                                         | DOM  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--- |
| [onblur](https://www.runoob.com/jsref/event-onblur.html)     | 元素失去焦点时触发                                           | 2    |
| [onchange](https://www.runoob.com/jsref/event-onchange.html) | 该事件在表单元素的内容改变时触发( \<input>, \<keygen>, \<select>, 和 \<textarea>) | 2    |
| [onfocus](https://www.runoob.com/jsref/event-onfocus.html)   | 元素获取焦点时触发                                           | 2    |
| [onfocusin](https://www.runoob.com/jsref/event-onfocusin.html) | 元素即将获取焦点时触发                                       | 2    |
| [onfocusout](https://www.runoob.com/jsref/event-onfocusout.html) | 元素即将失去焦点时触发                                       | 2    |
| [oninput](https://www.runoob.com/jsref/event-oninput.html)   | 元素获取用户输入时触发                                       | 3    |
| [onreset](https://www.runoob.com/jsref/event-onreset.html)   | 表单重置时触发                                               | 2    |
| [onsearch](https://www.runoob.com/jsref/event-onsearch.html) | 用户向搜索域输入文本时触发 ( <input="search">)               |      |
| [onselect](https://www.runoob.com/jsref/event-onselect.html) | 用户选取文本时触发 ( \<input> 和 \<textarea>)                  | 2    |
| [onsubmit](https://www.runoob.com/jsref/event-onsubmit.html) | 表单提交时触发                                               | 2    |

### 剪贴板事件

| 属性                                                       | 描述                           | DOM  |
| :--------------------------------------------------------- | :----------------------------- | :--- |
| [oncopy](https://www.runoob.com/jsref/event-oncopy.html)   | 该事件在用户拷贝元素内容时触发 |      |
| [oncut](https://www.runoob.com/jsref/event-oncut.html)     | 该事件在用户剪切元素内容时触发 |      |
| [onpaste](https://www.runoob.com/jsref/event-onpaste.html) | 该事件在用户粘贴元素内容时触发 |      |

### 打印事件

| 属性                                                         | 描述                                                 | DOM  |
| :----------------------------------------------------------- | :--------------------------------------------------- | :--- |
| [onafterprint](https://www.runoob.com/jsref/event-onafterprint.html) | 该事件在页面已经开始打印，或者打印窗口已经关闭时触发 |      |
| [onbeforeprint](https://www.runoob.com/jsref/event-onbeforeprint.html) | 该事件在页面即将开始打印时触发                       |      |

### 拖动事件

| 事件                                                         | 描述                                 | DOM  |
| :----------------------------------------------------------- | :----------------------------------- | :--- |
| [ondrag](https://www.runoob.com/jsref/event-ondrag.html)     | 该事件在元素正在拖动时触发           |      |
| [ondragend](https://www.runoob.com/jsref/event-ondragend.html) | 该事件在用户完成元素的拖动时触发     |      |
| [ondragenter](https://www.runoob.com/jsref/event-ondragenter.html) | 该事件在拖动的元素进入放置目标时触发 |      |
| [ondragleave](https://www.runoob.com/jsref/event-ondragleave.html) | 该事件在拖动元素离开放置目标时触发   |      |
| [ondragover](https://www.runoob.com/jsref/event-ondragover.html) | 该事件在拖动元素在放置目标上时触发   |      |
| [ondragstart](https://www.runoob.com/jsref/event-ondragstart.html) | 该事件在用户开始拖动元素时触发       |      |
| [ondrop](https://www.runoob.com/jsref/event-ondrop.html)     | 该事件在拖动元素放置在目标区域时触发 |      |

### 多媒体（Media）事件

| 事件                                                         | 描述                                                         | DOM  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--- |
| [onabort](https://www.runoob.com/jsref/event-onabort-media.html) | 事件在视频/音频（audio/video）终止加载时触发。               |      |
| [oncanplay](https://www.runoob.com/jsref/event-oncanplay.html) | 事件在用户可以开始播放视频/音频（audio/video）时触发。       |      |
| [oncanplaythrough](https://www.runoob.com/jsref/event-oncanplaythrough.html) | 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发。 |      |
| [ondurationchange](https://www.runoob.com/jsref/event-ondurationchange.html) | 事件在视频/音频（audio/video）的时长发生变化时触发。         |      |
| onemptied                                                    | 当期播放列表为空时触发                                       |      |
| [onended](https://www.runoob.com/jsref/event-onended.html)   | 事件在视频/音频（audio/video）播放结束时触发。               |      |
| [onerror](https://www.runoob.com/jsref/event-onerror-media.html) | 事件在视频/音频（audio/video）数据加载期间发生错误时触发。   |      |
| [onloadeddata](https://www.runoob.com/jsref/event-onloadeddata.html) | 事件在浏览器加载视频/音频（audio/video）当前帧时触发触发。   |      |
| [onloadedmetadata](https://www.runoob.com/jsref/event-onloadedmetadata.html) | 事件在指定视频/音频（audio/video）的元数据加载后触发。       |      |
| [onloadstart](https://www.runoob.com/jsref/event-onloadstart.html) | 事件在浏览器开始寻找指定视频/音频（audio/video）触发。       |      |
| [onpause](https://www.runoob.com/jsref/event-onpause.html)   | 事件在视频/音频（audio/video）暂停时触发。                   |      |
| [onplay](https://www.runoob.com/jsref/event-onplay.html)     | 事件在视频/音频（audio/video）开始播放时触发。               |      |
| [onplaying](https://www.runoob.com/jsref/event-onplaying.html) | 事件在视频/音频（audio/video）暂停或者在缓冲后准备重新开始播放时触发。 |      |
| [onprogress](https://www.runoob.com/jsref/event-onprogress.html) | 事件在浏览器下载指定的视频/音频（audio/video）时触发。       |      |
| [onratechange](https://www.runoob.com/jsref/event-onratechange.html) | 事件在视频/音频（audio/video）的播放速度发送改变时触发。     |      |
| [onseeked](https://www.runoob.com/jsref/event-onseeked.html) | 事件在用户重新定位视频/音频（audio/video）的播放位置后触发。 |      |
| [onseeking](https://www.runoob.com/jsref/event-onseeking.html) | 事件在用户开始重新定位视频/音频（audio/video）时触发。       |      |
| [onstalled](https://www.runoob.com/jsref/event-onstalled.html) | 事件在浏览器获取媒体数据，但媒体数据不可用时触发。           |      |
| [onsuspend](https://www.runoob.com/jsref/event-onsuspend.html) | 事件在浏览器读取媒体数据中止时触发。                         |      |
| [ontimeupdate](https://www.runoob.com/jsref/event-ontimeupdate.html) | 事件在当前的播放位置发送改变时触发。                         |      |
| [onvolumechange](https://www.runoob.com/jsref/event-onvolumechange.html) | 事件在音量发生改变时触发。                                   |      |
| [onwaiting](https://www.runoob.com/jsref/event-onwaiting.html) | 事件在视频由于要播放下一帧而需要缓冲时触发。                 |      |

### 动画事件

| 事件                                                         | 描述                            | DOM  |
| :----------------------------------------------------------- | :------------------------------ | :--- |
| [animationend](https://www.runoob.com/jsref/event-animationend.html) | 该事件在 CSS 动画结束播放时触发 |      |
| [animationiteration](https://www.runoob.com/jsref/event-animationiteration.html) | 该事件在 CSS 动画重复播放时触发 |      |
| [animationstart](https://www.runoob.com/jsref/event-animationstart.html) | 该事件在 CSS 动画开始播放时触发 |      |

### 过渡事件

| 事件                                                         | 描述                          | DOM  |
| :----------------------------------------------------------- | :---------------------------- | :--- |
| [transitionend](https://www.runoob.com/jsref/event-transitionend.html) | 该事件在 CSS 完成过渡后触发。 |      |

### 其他事件

| 事件                                                         | 描述                                                         | DOM  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--- |
| onmessage                                                    | 该事件通过或者从对象(WebSocket, Web Worker, Event Source 或者子 frame 或父窗口)接收到消息时触发 |      |
| onmousewheel                                                 | 已废弃。 使用 [onwheel](https://www.runoob.com/jsref/event-onwheel.html) 事件替代 |      |
| [ononline](https://www.runoob.com/jsref/event-ononline.html) | 该事件在浏览器开始在线工作时触发。                           |      |
| [onoffline](https://www.runoob.com/jsref/event-onoffline.html) | 该事件在浏览器开始离线工作时触发。                           |      |
| onpopstate                                                   | 该事件在窗口的浏览历史（history 对象）发生改变时触发。       |      |
| [onshow](https://www.runoob.com/jsref/event-onshow.html)     | 该事件当 \<menu> 元素在上下文菜单显示时触发                   |      |
| onstorage                                                    | 该事件在 Web Storage(HTML 5 Web 存储)更新时触发              |      |
| [ontoggle](https://www.runoob.com/jsref/event-ontoggle.html) | 该事件在用户打开或关闭 \<details> 元素时触发                  |      |
| [onwheel](https://www.runoob.com/jsref/event-onwheel.html)   | 该事件在鼠标滚轮在元素上下滚动时触发                         |      |

### 事件对象

#### 常量

| 静态变量        | 描述                                 | DOM  |
| :-------------- | :----------------------------------- | :--- |
| CAPTURING-PHASE | 当前事件阶段为捕获阶段(1)            | 1    |
| AT-TARGET       | 当前事件是目标阶段,在评估目标事件(1) | 2    |
| BUBBLING-PHASE  | 当前的事件为冒泡阶段 (3)             | 3    |

#### 属性

| 属性                                                         | 描述                                           | DOM  |
| :----------------------------------------------------------- | :--------------------------------------------- | :--- |
| [bubbles](https://www.runoob.com/jsref/event-bubbles.html)   | 返回布尔值，指示事件是否是起泡事件类型。       | 2    |
| [cancelable](https://www.runoob.com/jsref/event-cancelable.html) | 返回布尔值，指示事件是否可拥可取消的默认动作。 | 2    |
| [currentTarget](https://www.runoob.com/jsref/event-currenttarget.html) | 返回其事件监听器触发该事件的元素。             | 2    |
| eventPhase                                                   | 返回事件传播的当前阶段。                       | 2    |
| [target](https://www.runoob.com/jsref/event-target.html)     | 返回触发此事件的元素（事件的目标节点）。       | 2    |
| [timeStamp](https://www.runoob.com/jsref/event-timestamp.html) | 返回事件生成的日期和时间。                     | 2    |
| [type](https://www.runoob.com/jsref/event-type.html)         | 返回当前 Event 对象表示的事件的名称。          | 2    |

#### 方法

| 方法              | 描述                                     | DOM  |
| :---------------- | :--------------------------------------- | :--- |
| initEvent()       | 初始化新创建的 Event 对象的属性。        | 2    |
| preventDefault()  | 通知浏览器不要执行与事件关联的默认动作。 | 2    |
| stopPropagation() | 不再派发事件。                           | 2    |

### 目标事件对象

#### 方法

| 方法                  | 描述                                                    | DOM  |
| :-------------------- | :------------------------------------------------------ | :--- |
| addEventListener()    | 允许在目标事件中注册监听事件(IE8 = attachEvent())       | 2    |
| dispatchEvent()       | 允许发送事件到监听器上 (IE8 = fireEvent())              | 2    |
| removeEventListener() | 运行一次注册在事件目标上的监听事件(IE8 = detachEvent()) | 2    |

### 事件监听对象

#### 方法

| 方法          | 描述                         | DOM  |
| :------------ | :--------------------------- | :--- |
| handleEvent() | 把任意对象注册为事件处理程序 | 2    |

### 文档事件对象

#### 方法

| 方法          | 描述 | DOM  |
| :------------ | :--- | :--- |
| createEvent() |      | 2    |

### 鼠标/键盘事件对象

#### 属性

| 属性                                                         | 描述                                                         | DOM  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--- |
| [altKey](https://www.runoob.com/jsref/event-altkey.html)     | 返回当事件被触发时，"ALT" 是否被按下。                       | 2    |
| [button](https://www.runoob.com/jsref/event-button.html)     | 返回当事件被触发时，哪个鼠标按钮被点击。                     | 2    |
| [clientX](https://www.runoob.com/jsref/event-clientx.html)   | 返回当事件被触发时，鼠标指针的水平坐标。                     | 2    |
| [clientY](https://www.runoob.com/jsref/event-clienty.html)   | 返回当事件被触发时，鼠标指针的垂直坐标。                     | 2    |
| [ctrlKey](https://www.runoob.com/jsref/event-ctrlkey.html)   | 返回当事件被触发时，"CTRL" 键是否被按下。                    | 2    |
| [Location](https://www.runoob.com/jsref/event-key-location.html) | 返回按键在设备上的位置                                       | 3    |
| [charCode](https://www.runoob.com/jsref/event-key-charcode.html) | 返回onkeypress事件触发键值的字母代码。                       | 2    |
| [key](https://www.runoob.com/jsref/event-key-key.html)       | 在按下按键时返回按键的标识符。                               | 3    |
| [keyCode](https://www.runoob.com/jsref/event-key-keycode.html) | 返回onkeypress事件触发的键的值的字符代码，或者 onkeydown 或 onkeyup 事件的键的代码。 | 2    |
| [which](https://www.runoob.com/jsref/event-key-which.html)   | 返回onkeypress事件触发的键的值的字符代码，或者 onkeydown 或 onkeyup 事件的键的代码。 | 2    |
| [metaKey](https://www.runoob.com/jsref/event-metakey.html)   | 返回当事件被触发时，"meta" 键是否被按下。                    | 2    |
| [relatedTarget](https://www.runoob.com/jsref/event-relatedtarget.html) | 返回与事件的目标节点相关的节点。                             | 2    |
| [screenX](https://www.runoob.com/jsref/event-screenx.html)   | 返回当某个事件被触发时，鼠标指针的水平坐标。                 | 2    |
| [screenY](https://www.runoob.com/jsref/event-screeny.html)   | 返回当某个事件被触发时，鼠标指针的垂直坐标。                 | 2    |
| [shiftKey](https://www.runoob.com/jsref/event-shiftkey.html) | 返回当事件被触发时，"SHIFT" 键是否被按下。                   | 2    |

#### 方法

| 方法                | 描述                   | W3C  |
| :------------------ | :--------------------- | :--- |
| initMouseEvent()    | 初始化鼠标事件对象的值 | 2    |
| initKeyboardEvent() | 初始化键盘事件对象的值 | 3    |



## Console 对象

Console 对象提供了访问浏览器调试模式的信息到控制台。

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [assert()](https://www.runoob.com/jsref/met-console-assert.html) | 如果断言为 false，则在信息到控制台输出错误信息。             |
| [clear()](https://www.runoob.com/jsref/met-console-clear.html) | 清除控制台上的信息。                                         |
| [count()](https://www.runoob.com/jsref/met-console-count.html) | 记录 count() 调用次数，一般用于计数。                        |
| [error()](https://www.runoob.com/jsref/met-console-error.html) | 输出错误信息到控制台                                         |
| [group()](https://www.runoob.com/jsref/met-console-group.html) | 在控制台创建一个信息分组。 一个完整的信息分组以 console.group() 开始，console.groupEnd() 结束 |
| [groupCollapsed()](https://www.runoob.com/jsref/met-console-groupcollapsed.html) | 在控制台创建一个信息分组。 类似 console.group() ，但它默认是折叠的。 |
| [groupEnd()](https://www.runoob.com/jsref/met-console-groupend.html) | 设置当前信息分组结束                                         |
| [info()](https://www.runoob.com/jsref/met-console-info.html) | 控制台输出一条信息                                           |
| [log()](https://www.runoob.com/jsref/met-console-log.html)   | 控制台输出一条信息                                           |
| [table()](https://www.runoob.com/jsref/met-console-table.html) | 以表格形式显示数据                                           |
| [time()](https://www.runoob.com/jsref/met-console-time.html) | 计时器，开始计时间，与 timeEnd() 联合使用，用于算出一个操作所花费的准确时间。 |
| [timeEnd()](https://www.runoob.com/jsref/met-console-timeend.html) | 计时结束                                                     |
| [trace()](https://www.runoob.com/jsref/met-console-trace.html) | 显示当前执行的代码在堆栈中的调用路径。                       |
| [warn()](https://www.runoob.com/jsref/met-console-warn.html) | 输出警告信息，信息最前面加一个黄色三角，表示警告             |



## CSS 样式声明对象(CSSStyleDeclaration)

### CSSStyleDeclaration 对象

CSSStyleDeclaration 对象表示一个 CSS 属性-值（property-value）对的集合。

------

### CSSStyleDeclaration 对象属性

| 属性                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [cssText](https://www.runoob.com/jsref/prop-cssstyle-csstext.html) | 设置或返回样式声明文本，cssText 对应的是 HTML 元素的 style 属性。 |
| [length](https://www.runoob.com/jsref/prop-cssstyle-length.html) | 返回样式中包含多少条声明。                                   |
| [parentRule](https://www.runoob.com/jsref/prop-cssstyle-parentrule.html) | 返回包含当前规则的规则。                                     |

------

### CSSStyleDeclaration 对象方法

| 方法                                                         | 描述                                              |
| :----------------------------------------------------------- | :------------------------------------------------ |
| [getPropertyPriority()](https://www.runoob.com/jsref/met-cssstyle-getpropertypriority.html) | 返回指定的 CSS 属性是否设置了 "important!" 属性。 |
| [getPropertyValue()](https://www.runoob.com/jsref/met-cssstyle-getpropertyvalue.html) | 返回指定的 CSS 属性值。                           |
| [item()](https://www.runoob.com/jsref/met-cssstyle-item.html) | 通过索引方式返回 CSS 声明中的 CSS 属性名。        |
| [removeProperty()](https://www.runoob.com/jsref/met-cssstyle-removeproperty.html) | 移除 CSS 声明中的 CSS 属性。                      |
| [setProperty()](https://www.runoob.com/jsref/met-cssstyle-setproperty.html) | 在 CSS 声明块中新建或者修改 CSS 属性。            |



## DOM HTMLCollection

HTMLCollection 是 HTML 元素的集合。

HTMLCollection 对象类似一个包含 HTML 元素的数组列表。

[getElementsByTagName()](https://www.runoob.com/jsref/met-element-getelementsbytagname.html) 方法返回的就是一个 HTMLCollection 对象。

------

### 属性和方法

下表列出了 HTMLCollection 对象中的属性和方法：

| 属性 / 方法                                                  | 描述                                               |
| :----------------------------------------------------------- | :------------------------------------------------- |
| [item()](https://www.runoob.com/jsref/met-htmlcollection-item.html) | 返回 HTMLCollection 中指定索引的元素。             |
| [length](https://www.runoob.com/jsref/prop-htmlcollection-length.html) | 返回 HTMLCollection 中元素的数量。                 |
| [namedItem()](https://www.runoob.com/jsref/met-htmlcollection-nameditem.html) | 返回 HTMLCollection 中指定 ID 或 name 属性的元素。 |

------

### 实例

返回所有 p 元素的集合，该集合是一个 HTMLCollection 对象：

var x = document.getElementsByTagName("p");



计算文档中 p 元素的数量：

var x = document.getElementsByTagName("P"); document.write(x.length);



循环输出 HTMLCollection 对象中的所有元素：

var x = document.getElementsByTagName("P"); document.write(x.length);