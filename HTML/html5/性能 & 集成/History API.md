# History API

DOM中 **window** 对象 通过 **history** 对象提供了对浏览器的会话历史的访问. 暴露了很多有用的方法和属性, 允许在用户浏览历史中向前和向后跳转, 同时--从HTML5开始--提供了对 history 栈中内容的操作



## 第一部分 方法

### 1. back(): 向后跳转

back()方法会在会话历史记录中向后移动一页。**如果没有上一页，则此方法调用不执行任何操作**

```javascript
/**
       * @name: 和用户点击浏览器回退按钮的效果相同。
       * @return: none
*/
window.history.back()
```

### 2. forward(): 向前跳转

forward()方法会在会话历史记录中向前移动一页。**如果没有下一页，则此方法调用不执行任何操作**

```javascript
/**
       * @name: 和用户点击浏览器前进按钮的效果相同。
       * @return: none
*/
window.history.forward();
```

### 3. go(): 跳转到某一特定页面

从会话历史记录中加载特定页面。你可以使用它在历史记录中前后移动，**具体取决于delta参数的值**

 **注意:** IE 支持传递URLs作为参数给 go(); 这在Gecko是不标准且不支持的。 

```javascript
/**
       * @name: 跳转至某一特定页面
       * @params: { delta? : 负值表示向后移动，正值表示向前移动。如果未向该函数传参或delta相等于0，则该函数与调用location.reload()具有相同的效果。 }
       * @return: none
*/
window.history.go(delta);
```



## 第二部分 属性

### 1. length: 返回历史列表中网址数

通过查看长度属性的值来确定的历史堆栈中页面的数量(包含该文档相关)

**注意：**Internet Explorer和Opera从0开始，而Firefox、Chrome和Safari从1开始



## 第三部分 H5新增方法

HTML5引入了 **history.pushState()** 和 **history.replaceState()** 方法，它们分别可以添加和修改历史记录条目。这些方法通常与 **window.onpopstate** 配合使用。

### 1. pushState()方法: 添加历史记录

**注意**: 调用 pushState() 后浏览器并不会立即加载这个URL，但可能会在稍后某些情况下加载这个URL，比如在用户重新打开浏览器时。新URL不必须为绝对路径。如果新URL是相对路径，那么它将被作为相对于当前URL处理。新URL必须与当前URL同源，否则 pushState() 会抛出一个异常。该参数是可选的，缺省为当前URL。 

**注意** pushState() 绝对不会触发 hashchange 事件，即使新的URL与旧的URL仅哈希不同也是如此。

```javascript
/**
       * @name: 添加历史记录
       * @params: { stateObj: 状态对象,  状态对象state是一个JavaScript对象，通过pushState () 创建新的历史记录条目。无论什么时候用户导航到新的状态，popstate事件就会被触发，且该事件的state属性包含该历史记录条目状态对象的副本。
       * @params: { title: Firefox 目前忽略这个参数，但未来可能会用到 }
       * @parama: { URL?: 定义了新的历史URL记录 }
       * @return: none
*/
window.history.pushState(stateObj, title, url)

```

### 2. replaceState(): 修改当前历史记录

与 history.pushState() 非常相似，区别在于  replaceState()  是修改了当前的历史记录项而不是新建一个。

**注意**: 这并不会阻止其在全局浏览器历史记录中创建一个新的历史记录项。



### 3. 相关事件: popstate

**popstate事件**: 每当处于激活状态的历史记录条目发生变化时,popstate事件就会在对应window对象上触发. 如果当前处于激活状态的历史记录条目是由history.pushState()方法创建,或者由history.replaceState()方法修改过的, 则popstate事件对象的state属性包含了这个历史记录条目的state对象的一个拷贝.

**调用`history.pushState()`或者`history.replaceState()`不会触发popstate事件. `popstate`事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用`history.back()、history.forward()、history.go()`方法).**

**当网页加载时,各浏览器对`popstate`事件是否触发有不同的表现,Chrome 和 Safari会触发`popstate`事件, 而Firefox不会.**



### 4. 获取当前状态

**页面加载时，或许会有个非null的状态对象。这是有可能发生的，举个例子，假如页面（通过pushState() 或 replaceState() 方法）设置了状态对象而后用户重启了浏览器。那么当页面重新加载时，页面会接收一个onload事件，但没有 popstate 事件。然而，假如你读取了history.state属性，你将会得到如同popstate 被触发时能得到的状态对象。**

**你可以读取当前历史记录项的状态对象state，而不必等待popstate 事件， 只需要这样使用history.state 属性： **

```javascript
let currentState = history.state;
```

