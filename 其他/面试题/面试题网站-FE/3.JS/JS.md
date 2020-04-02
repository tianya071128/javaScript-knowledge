## 1. Ajax 原理

- `Ajax`的原理简单来说是在用户和服务器之间加了—个中间层(`AJAX`引擎)，通过`XmlHttpRequest`对象来向服务器发异步请求，从服务器获得数据，然后用`javascrip`t来操作`DOM`而更新页面。使用户操作与服务器响应异步化。这其中最关键的一步就是从服务器获得请求数据
- `Ajax`的过程只涉及`JavaScript`、`XMLHttpRequest`和`DOM`。`XMLHttpRequest`是`aja`x的核心机制

**ajax 有那些优缺点?**

- 优点：
  - 通过异步模式，提升了用户体验.
  - 优化了浏览器和服务器之间的传输，减少不必要的数据往返，减少了带宽占用.
  - `Ajax`在客户端运行，承担了一部分本来由服务器承担的工作，减少了大用户量下的服务器负载。
  - `Ajax`可以实现动态不刷新（局部刷新）
- 缺点：
  - 安全问题 `AJAX`暴露了与服务器交互的细节。
  - 对搜索引擎的支持比较弱。
  - 不容易调试。



## 2. 跨域问题

* **通过jsonp跨域**

*  **document.domain + iframe跨域** 

  >  此方案仅限主域相同，子域不同的跨域应用场景 

  1.）父窗口：(http://www.domain.com/a.html)

  ```html
  <iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
  <script>
      document.domain = 'domain.com';
      var user = 'admin';
  </script>
  ```

  2.）子窗口：(http://child.domain.com/b.html)

  ```javascript
  document.domain = 'domain.com';
  // 获取父窗口中变量
  alert('get js data from parent ---> ' + window.parent.user);
  ```

- **nginx代理跨域**
- **nodejs中间件代理跨域**
- **后端在头部信息里面设置安全域名**



## 3. 内存泄漏

- 内存泄漏指任何对象在您不再拥有或需要它之后仍然存在
- `setTimeout` 的第一个参数使用字符串而非函数的话，会引发内存泄漏
- 闭包使用不当



## 4. XML和JSON的区别？

- 数据体积方面
  - `JSON`相对`于XML`来讲，数据的体积小，传递的速度更快些。
- 数据交互方面
  - `JSON`与`JavaScript`的交互更加方便，更容易解析处理，更好的数据交互
- 数据描述方面
  - `JSON`对数据的描述性比`XML`较差
- 传输速度方面
  - `JSON`的速度要远远快于`XML`



## 5. attribute和property的区别是什么

[查看这里](https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html#answer-6004028)

理解 HTML 属性和 DOM 属性之间的区别，是了解 Angular 绑定如何工作的关键。**Attribute 是由 HTML 定义的。Property 是从 DOM（文档对象模型）节点访问的。**

- 一些 HTML Attribute 可以 1:1 映射到 Property；例如，“ id”。
- 某些 HTML Attribute 没有相应的 Property。例如，`aria-*`。
- 某些 DOM Property 没有相应的 Attribute。例如，`textContent`。

重要的是要记住，*HTML Attribute* 和 *DOM Property* 是不同的，就算它们具有相同的名称也是如此。



## 6. 快速的让一个数组乱序

```javascript
var arr = [1,2,3,4,5,6,7,8,9,10];
arr.sort(function(){
    // 利用 random() 的随机数字
    return Math.random() - 0.5;
})
console.log(arr);
```



## 7.  如何渲染几万条数据并不卡住界面

> 这道题考察了如何在不卡住页面的情况下渲染数据，也就是说不能一次性将几万条都渲染出来，而应该一次渲染部分 `DOM`，那么就可以通过 `requestAnimationFrame` 来每 `16 ms` 刷新一次

```javascript
setTimeout(() => {
      // 插入十万条数据
      const total = 100000
      // 一次插入 20 条，如果觉得性能不好就减少
      const once = 20
      // 渲染数据总共需要几次
      const loopCount = total / once
      let countOfRender = 0
      let ul = document.querySelector("ul");
      function add() {
        // 优化性能，插入不会造成回流
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < once; i++) {
          const li = document.createElement("li");
          li.innerText = Math.floor(Math.random() * total);
          fragment.appendChild(li);
        }
        ul.appendChild(fragment);
        countOfRender += 1;
        loop();
      }
      function loop() {
        if (countOfRender < loopCount) {
          // 在下次重绘之前调用指定的回调函数, 回调函数执行次数通常与浏览器屏幕刷新次数相匹配
          // 也可使用 setTimeout 模拟
          window.requestAnimationFrame(add);
        }
      }
      loop();
    }, 0);
```



## 8. 数组去重方法总结

[总结](http://blog.poetries.top/FE-Interview-Questions/base/#_74-数组去重方法总结)



## 9. 怎么判断两个对象相等？

```javascript
obj={
    a:1,
    b:2
}
obj2={
    a:1,
    b:2
}
obj3={
    a:1,
    b:'2'
}

// 通过转化为字符串来判断 -- 有些数据类型 JSON.stringify 不支持
JSON.stringify(obj)==JSON.stringify(obj2);//true
JSON.stringify(obj)==JSON.stringify(obj3);//false
```



## 10. 什么是单线程，和异步的关系

- 单线程 - 只有一个线程，只能做一件事
- 原因 - 避免DOM渲染的冲突
  - 浏览器需要渲染 `DOM`
  - `JS` 可以修改 `DOM` 结构
  - `JS` 执行的时候，浏览器 `DOM` 渲染会暂停
  - 两段 JS 也不能同时执行（都修改 `DOM` 就冲突了）
  - `webworker` 支持多线程，但是不能访问 `DOM`
- 解决方案 - 异步



## 11. == 和 ===区别，什么情况用 ==

```javascript
// [] == ![] => true

// [] 转成 true，然后取反变成 false
[] == false
// 根据第 8 条得出
[] == ToNumber(false)
[] == 0
// 根据第 10 条得出
ToPrimitive([]) == 0
// [].toString() -> ''
'' == 0
// 根据第 6 条得出
0 == 0 // -> true
```





## 13. 执行上下文

> 当执行 JS 代码时，会产生三种执行上下文

- 全局执行上下文
- 函数执行上下文
- `eval` 执行上下文

> 每个执行上下文中都有三个重要的属性

- 变量对象（`VO`），包含变量、函数声明和函数的形参，该属性只能在全局上下文中访问
- 作用域链（`JS` 采用词法作用域，也就是说变量的作用域是在定义时就决定了）
- `this`

```js
var a = 10
function foo(i) {
  var b = 20
}
foo()
```

> 对于上述代码，执行栈中有两个上下文：全局上下文和函数 foo 上下文。

```js
stack = [
    globalContext,
    fooContext
]
```

> 对于全局上下文来说，`VO`大概是这样的

```js
globalContext.VO === globe
globalContext.VO = {
    a: undefined,
	foo: <Function>,
}
```

> 对于函数 `foo` 来说，`VO` 不能访问，只能访问到活动对象（`AO`）

```js
fooContext.VO === foo.AO
fooContext.AO {
    i: undefined,
	b: undefined,
    arguments: <>
}
// arguments 是函数独有的对象(箭头函数没有)
// 该对象是一个伪数组，有 `length` 属性且可以通过下标访问元素
// 该对象中的 `callee` 属性代表函数本身
// `caller` 属性代表函数的调用者
```

> 对于作用域链，可以把它理解成包含自身变量对象和上级变量对象的列表，通过 `[[Scope]]`属性查找上级变量

```js
fooContext.[[Scope]] = [
    globalContext.VO
]
fooContext.Scope = fooContext.[[Scope]] + fooContext.VO
fooContext.Scope = [
    fooContext.VO,
    globalContext.VO
]
```

> 接下来让我们看一个老生常谈的例子，`var`

```js
b() // call b
console.log(a) // undefined

var a = 'Hello world'

function b() {
	console.log('call b')
}
```

> 想必以上的输出大家肯定都已经明白了，这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理解。但是更准确的解释应该是：在生成执行上下文时，会有两个阶段。第一个阶段是创建的阶段（具体步骤是创建 `VO`），`JS` 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 `undefined`，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

- 在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

```js
b() // call b second

function b() {
	console.log('call b fist')
}
function b() {
	console.log('call b second')
}
var b = 'Hello world'
```

> `var`会产生很多错误，所以在 `ES6`中引入了 `let`。`let`不能在声明前使用，但是这并不是常说的 `let` 不会提升，`let` 提升了声明但没有赋值，因为临时死区导致了并不能在声明前使用。

- 对于非匿名的立即执行函数需要注意以下一点

```js
var foo = 1
(function foo() {
    foo = 10
    console.log(foo)
}()) // -> ƒ foo() { foo = 10 ; console.log(foo) }
```

> 因为当 `JS` 解释器在遇到非匿名的立即执行函数时，会创建一个辅助的特定对象，然后将函数名称作为这个对象的属性，因此函数内部才可以访问到 `foo`，但是这个值又是只读的，所以对它的赋值并不生效，所以打印的结果还是这个函数，并且外部的值也没有发生更改。

```js
specialObject = {};

Scope = specialObject + Scope;

foo = new FunctionExpression;
foo.[[Scope]] = Scope;
specialObject.foo = foo; // {DontDelete}, {ReadOnly}

delete Scope[0]; // remove specialObject from the front of scope chain
```















 