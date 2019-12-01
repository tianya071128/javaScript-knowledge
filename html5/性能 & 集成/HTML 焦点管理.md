# 焦点管理

## 第一部分 相关属性

### 1. activeElement: 引用文档中获得焦点的元素

**注意**: HTMLElement接口并没有实现这个方法, 通过 document.activeElement 引用 

**注意2**: activeElement并不是只会引用表单元素, 而是引用**当前活动元素**



## 第二部分 相关方法

### 1. focus(): 获取焦点

```javascript
/**
       * @name: 获取焦点 
       * @return: none
*/

element.focus()

// ============== 示例 =============
document.getElementById("myAnchor").focus();
```



### 2. blur(): 失去焦点

```javascript
/**
       * @name: 失去焦点 
       * @return: none
*/

element.blur()

// ============== 示例 =============
document.getElementById("myAnchor").blur();
```

### 3. hasFocus(): 判断是否获取焦点

**当查看一个文档时，当前文档中获得焦点的元素一定是当前文档的活动元素，但一个文档中的活动元素不一定获得了焦点.。例如， 一个在后台的窗口中的活动元素一定没有获得焦点**

**注意**: HTMLElement接口并没有实现这个方法, 可以配合activeElement属性来管理页面中的焦点

```javascript
/**
       * @name: 失去焦点 
       * @return: none
*/

document.hasFocus()

// ============== 示例 =============
document.hasFocus()
```



## 第三部分 事件

### 1. blur: 失去焦点

> 并不能通过 event.preventDefault() 方式阻止失去焦点

### 2. focus: 获取焦点时

> 并不能通过 event.preventDefault() 方式阻止失去焦点

### 3. focusin: 即将获取焦点时触发

> onfocusin 事件类似于 onfocus 事件。 主要的区别是 onfocus 事件不支持冒泡。

### 4. focusout: 即将失去焦点时触发

> onfocusout 事件类似于 onblur 事件。 主要的区别是 onblur 事件不支持冒泡。