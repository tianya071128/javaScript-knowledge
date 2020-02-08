## 1 window对象

### 1.1 取得窗口左边和上边的位置

> ``` javascript
> var leftPos = (typeof window.screenLeft == "number") ?
> window.screenLeft : window.screenX;
> var topPos = (typeof window.screenTop == "number") ?
> window.screenTop : window.screenY;
> ```

### 1.2 将窗口移动至一个新位置

> moveTo(X, Y): 移动至指定位置
>
> moveBy(X, Y): 移动到一个新位置

### 1.3 窗口大小

> ``` javascript
> var pageWidth = window.innerWidth,
> 	pageHeight = window.innerHeight;
> if (typeof pageWidth != "number"){
> 	if (document.compatMode == "CSS1Compat"){
> 		pageWidth = document.documentElement.clientWidth;
> 		pageHeight = document.documentElement.clientHeight;
> 	} else {
> 		pageWidth = document.body.clientWidth;
> 		pageHeight = document.body.clientHeight;
> 	}
> }
> ```

### 1.4 调整浏览器的大小

> resizeTo(X, Y): 调整至指定宽高
>
> resizeBy(X, Y): 接收新窗口与原窗口的宽度和高度之差

### 1.5 导航和打开窗口

> window.open(url, 已有窗口或框架的名称, 窗口的特性, 是否取代浏览器历史记录)
>
> return: 返回指向新窗口的引用(类似于window对象)
>
> window.close(): 关闭窗口, 只能关闭通过window.open()打开的窗口



## 2 location对象

> location对象提供了与当前窗口中加载的文档有关的信息, 还提供了一些导航功能

### 2.1 位置操作

> location.assign(url): 打开新URL, 并生成一条浏览器历史记录
>
> > 这个方法和设置location.hrder 和 window.location效果一样, 底层都是调用这个方法

> location.replace(URL): 打开新URL, 但会替换原来的历史记录

> location.reload(): 重新加载该页面
>
> > 传递为true时, 就会从服务器中重新加载

## 3 navigator对象

> 可用以 识别客户端浏览器 -- 用户代理字符串检测设备类型 -- 用来检测插件

## 4 screen对象

> 用以识别屏幕显示器的对象

## 5 history对象

> 用以识别用户上网的历史记录 -- 由于安全限制, 不能查询到历史记录的详情

> history.go(步数): 在历史记录中跳转
>
> history.back(): 模仿浏览器的'后退'键
>
> history.forward(): 模仿浏览器的'前进'键
>
> history.length: 保存这历史记录的数量







































