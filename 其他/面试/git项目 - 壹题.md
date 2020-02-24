# 目录

- [第 1 题: 写 React / Vue 项目时为什么要在列表组件中写 key，其作用是什么？](#第-1-题:-写-React-/-Vue-项目时为什么要在列表组件中写-key，其作用是什么？)
- [第 2 题: ['1', '2', '3'].map(parseInt) what & why ?](<#第-2-题:-['1',-'2',-'3'].map(parseInt)-what-&-why-?>)
- [第 3 题: 什么是防抖和节流？有什么区别？如何实现？](#第-3-题:-什么是防抖和节流？有什么区别？如何实现？)
- [第 4 题: 介绍下 Set、Map、WeakSet 和 WeakMap 的区别？](#第-4-题:-介绍下-Set、Map、WeakSet-和-WeakMap-的区别？)
- [第 5 题：介绍下深度优先遍历和广度优先遍历，如何实现？](#第-5 题：介绍下深度优先遍历和广度优先遍历，如何实现？)
- [第 7 题：ES5/ES6 的继承除了写法以外还有什么区别？](#第-7-题：ES5/ES6-的继承除了写法以外还有什么区别？)
- [第 10 题：异步笔试题](#第-10-题：异步笔试题)
- [第 11 题：算法手写题](#第-11-题：算法手写题)
- [第 12 题：JS 异步解决方案的发展历程以及优缺点。](#第-12-题：JS 异步解决方案的发展历程以及优缺点。)
- [第 13 题：Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？](#第-13-题：Promise-构造函数是同步执行还是异步执行，那么-then-方法呢？)
- [第 14 题：情人节福利题，如何实现一个 new](#第-14-题：情人节福利题，如何实现一个-new)
- [第 21 题：有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣](#第 21 题：有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣)
- [第 22 题：介绍下重绘和回流（Repaint & Reflow），以及如何进行优化](#第 22 题：介绍下重绘和回流（Repaint & Reflow），以及如何进行优化)
- [第 26 题: 介绍模块化发展历程](#第 26 题: 介绍模块化发展历程)
- [第 27 题：全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取](#第-27-题：全局作用域中，用-const-和-let-声明的变量不在 window 上，那到底在哪里？如何去获取？)
- [第 30 题：两个数组合并成一个数组](#第 30 题：两个数组合并成一个数组)
- [第 31 题：改造下面的代码，使之输出0 - 9，写出你能想到的所有解法。](#第 31 题：改造下面的代码，使之输出0 - 9，写出你能想到的所有解法。)
- [第 32 题：Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。](#第 32 题：Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。)
- [第 33 题：下面的代码打印什么内容，为什么？](#第 33 题：下面的代码打印什么内容，为什么？)
- [第 34 题：简单改造下面的代码，使之分别打印 10 和 20。](#第 34 题：简单改造下面的代码，使之分别打印 10 和 20。)
- [第 36 题：使用迭代的方式实现 flatten 函数。](#第 36 题：使用迭代的方式实现 flatten 函数。)

## 第 1 题: 写 React / Vue 项目时为什么要在列表组件中写 key，其作用是什么？

> vue 和 react 都是采用 diff 算法来对比新旧虚拟节点，从而更新节点。通过 key 可以将节点复用(diff 算法不懂, 暂不深究)

## 第 2 题: ['1', '2', '3'].map(parseInt) what & why ?

> ```javascript
> // [1, NaN, NaN]
> console.log(['1', '2', '3'].map(parseInt));
> ```
>
> map 方法的回调是会接收三个参数: 当前值, 索引, 数组本身
>
> parseInt 方法接收两个参数: 要被处理的值, 解析基数
>
> 这个运行过程为:
>
> 1. parseInt("1", 0) // //radix 为 0 时，且 string 参数不以“0x”和“0”开头时，按照 10 为基数处理。这个时候返回 1
> 2. parseInt('2', 1) //基数为 1（1 进制）表示的数中，最大值小于 2，所以无法解析，返回 NaN
> 3. parseInt('3', 2) //基数为 2（2 进制）表示的数中，最大值小于 3，所以无法解析，返回 NaN

## 第 3 题: 什么是防抖和节流？有什么区别？如何实现？

> 防抖: 触发高频时间后 n 秒内函数只会执行一次, 如果 n 秒内再次触发, 则重新计算时间
>
> 场景: resize 事件, 搜索框搜索事件...
>
> ```javascript
> function debounce(fn, time = 100) {
>   // 严谨来讲, 这里应该对参数进行验证
>
>   let timer = null; // 定时器
>   return function() {
>     if (timer) clearTimeout(timer); // 每次触发防抖函数, 就需要将之前的定时器清除
>     timer = setTimeout((...arg) => {
>       // 使用 apply 保持 fn 回调函数内部的 this 指针正确, 并将其参数传递给 fn 回调
>       fn.apply(this, arg);
>     }, time);
>   };
> }
> ```
>
> 节流: 高频事件触发, 但在 n 秒内只会执行一次, 节流会稀释函数的执行频率
>
> 场景: mousemove , scroll 等等持续触发事件
>
> ```javascript
> function throttle(fn, time = 100) {
>   // 严谨来讲, 这里应该对参数进行验证
>
>   let canRun = false; // 标记是否在执行函数
>   return function(...arg) {
>     if (canRun) return;
>     canRun = true;
>     // 放在外面执行是为了先一步执行, 不要等到 time 时间后在执行
>     fn.apply(this, arg);
>
>     setTimeout(() => {
>       canRun = false;
>     }, time);
>   };
> }
> ```

## 第 4 题: 介绍下 Set、Map、WeakSet 和 WeakMap 的区别？

> Set 和 Map 的区别:
>
> 1. Set 只有键值, 没有键名, 也没有索引, Map 是键值对的集合, 类似于对象
> 2. Set 成员是唯一的, Map 键名是唯一的(主要通过键名来快速访问数据). 
> 3. Set 和 Map 键的比较使用的是 `Object.is()`, 因此 `5`与 `"5"` 同时作为键, 因为它们类型不同.
>
> Set 与 WeakSet的区别:
>
> 1. WeakSet的成员只能是对象, 且为弱引用
> 2. WeakSet因为是对象弱引用, 所以无法取得成员的引用, 对其成员只能通过 add(), has(), delete() 有限的方法操作, 没有迭代方法(forEach(), values()...)
>
> Map 与 WeakMap 的区别:
>
> 1. WeakMap的成员的键名只能是对象, 且为弱引用,
>
>    键值可以使任意对象, 且不是弱引用,
>
> 2. WeakMap因为是对象弱引用, 所以无法取得成员的引用, 对其成员只能通过 set(), get(), has(), delete() 有限的方法操作, 没有迭代方法(forEach(), values()...)



## 第 5 题：介绍下深度优先遍历和广度优先遍历，如何实现？

以 DOM 遍历为例

```javascript
// HTML 结构
<body>
  <div class="class-1">
    <div class="class-1-1"></div>
    <div class="class-1-2">
      <div class="class-1-2-1"></div>
      <div class="class-1-2-2"></div>
    </div>
    <div class="class-1-3"></div>
  </div>
  <div class="class-2">
    <div class="class-2-1"></div>
  </div>
  <div class="class-3">
    <div class="class-3-1">
      <div class="class-3-1-1"></div>
    </div>
  </div>
</body>

// js
let node = document.body;

  // 深度优先遍历方法
  let deepTraversal1 = (node, nodeList = []) => {
    if (node === null) return;

    nodeList.push(node);
    let nodes = node.children;
    for (const item of nodes) {
      deepTraversal1(item, nodeList);
    }
    return nodeList;
  }
  console.log(deepTraversal1(node));


  let deepTraversal2 = (node) => {
    if (node === null) return;
    let nodeList = [];
    nodeList.push(node);

    let nodes = node.children;
    for (const item of nodes) {
      nodeList.concat(deepTraversal2(item));
    }

    return nodeList;
  }
  console.log(deepTraversal1(node));

  // 非递归
  let deepTraversal3 = (node) => {
    if (node === null) return;
    let nodeList = [],
      stack = [];
    stack.push(node);
    while (stack.length) {
      let item = stack.pop(),
        nodes = item.children;
      nodeList.push(item);

      for (let index = nodes.length - 1; index >= 0; index--) {
        stack.push(nodes[index]);
      }
    }

    return nodeList
  }
  console.log(deepTraversal3(node));

  // 生成器和迭代器
  let deepTraversal4 = function* (node) {
    if (node === null) {
      return;
    }
    yield node
    let nodes = node.children;

    for (const item of nodes) {
      yield* deepTraversal4(item);
    }
  }
  console.log([...deepTraversal4(node)]);

  // 2. 广度优先
  let widthTraversal2 = (node) => {
    if (node === null) return;
    let nodeList = [],
      stack = [];
    stack.push(node);
    while (stack.length) {
      let item = stack.shift(),
        nodes = item.children;
      nodeList.push(item);

      for (const item of nodes) {
        stack.push(item);
      }
    }

    return nodeList
  }
  console.log(widthTraversal2(node));
```







## 第 7 题：ES5/ES6 的继承除了写法以外还有什么区别？

根据书籍《深入理解ES6》中所述， ES5/ES6 的继承处理写法以外大致还有以下几点

1. 会自动继承静态成员, 也就是说, 类的构造函数也会被继承, 派生类.\__proto__ === 基类,

   而在 ES5 中, 构造器函数.\__proto__ === Function.prototype

   ```javascript
   class Rectangle {
       constructor(length, width) {
           this.length = length;
           this.width = width;
   }
       getArea() {
           return this.length * this.width;
   }
       static create(length, width) {
           return new Rectangle(length, width);
       }
   }

   class Square extends Rectangle {
       constructor(length) {
           // 与 Rectangle.call(this, length, length) 相同
           super(length, length);
       }
   }

   class Square2 extends Square {
       constructor(length) {
           // 与 Rectangle.call(this, length, length) 相同
           super(length, length);
       }
   }
   ```

   打印结果: 

   ![image-20200106142823782](C:\Users\Administrator\Desktop\md\面试\image\ES6类继承.png)

2. **在 ES5 的传统继承中, `this` 的值会先被派生类( 例如 `MyArray` ) 创建, 随后基类构造器(例如 `Array.apply()` 方法)才被调用. 这意味着 `this` 一开始就是 `MyArray` 的实例, 之后才使用了 `Array` 的附加属性对其进行了装饰**

   **在 ES6 基于类的继承中, `this` 的值会先被基类(`Array`)创建, 随后才被派生类的构造器(`MyArray`)所修改. 结果是 `this` 初始就拥有作为基类的内置对象的所有功能, 并能正确接受与之关联的所有功能**

   ```javascript
   // 在 ES5 中尝试继承数组
   function MyArray() {
   	Array.apply(this, arguments);
   }

   MyArray.prototype = Object.create(Array.prototype, {
   	constructor: {
   		value: MyArray,
   		writable: true,
   		configurable: true,
   		enumerable: true
   	}
   });

   // MyArray 实例上的 lengt 属性以及数值属性, 其行为与内置数组并不一致, 因为这些功能并未被涵盖在 Array.apply() 或 数组原型中
   var colors = new MyArray();
   colors[0] = "red";
   console.log(colors.length); // 0

   colors.length = 0;
   console.log(colors[0]); // "red"

   // ES6的继承内置对象
   class MyArray extends Array {
       // 空代码块
   }
   // 行为与正规数组一直
   var colors = new MyArray();
   colors[0] = "red";
   console.log(colors.length); // 1
   colors.length = 0;
   console.log(colors[0]); // undefined
   ```



## 第 10 题：异步笔试题

```javascript
// 下面代码的运行结果
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
    // 自己改了一下
    console.log('还会执行吗?');
}).then(function() {
    console.log('promise2');
});
console.log('script end');
```

解析答案: 

srcipt start --> async1 start --> async2 --> promise1 --> script end --> async1 end --> promise2 --> setTimeout

主要考察: 事件循环(Event Loop)

> 宏任务:  
>
> (macro)task（又称之为宏任务）:  script(整体代码)、setTimeout、setInterval、I/O、UI交互事件、postMessage、MessageChannel、setImmediate(Node.js 环境) 
>
> 微任务:
>
>  microtask（又称为微任务） : Promise.then、MutaionObserver、process.nextTick(Node.js 环境)
>
> 主要参考[git-答案解析](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7)



## 第 11 题：算法手写题

> 已知如下数组：
>
> var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
>
> 编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

```javascript
// 自己实现的 -- 使用了 ES6 的快速去重方法
function sort(arr) {
    let flat = (arr2) => {
        let itemList = [];
        for(let item of arr2) {
            if (Array.isArray(item)) {
                itemList = arrList.concat(flat(item));
            } else {
                itemList.push(item);
            }
        }
        return itemList
    }
    return [...new Set(a(arr))].sort((a, b) => a - b);
}
sort([ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10])

// 使用 flat() 方法
Array.from(new Set(arr.flat(Infinity))).sort((a,b)=>{ return a-b})

// 基本数据类型 OK, 其他类型会出错
[...new Set(String(arr).split(','))].sort((a, b) => a - b).map(Number)
```



## 第 12 题：JS 异步解决方案的发展历程以及优缺点。

发展历程:

1. 回调函数 (callback)

   > 优点: 解决了同步的问题, 不阻塞主线程执行
   >
   > 缺点: 
   >
   > 1. 多层嵌套回调时, 会导致回调地狱, 代码不易理解并且难以调试
   > 2. 嵌套过深的话, 很难处理错误
   > 3. 嵌套代码耦合性太高, 难以控制操作, 如果调用其他库的 API, 回调不易控制(控制反转)
   >
   > ```javascript
   > ajax('XXX1', () => {
   >     // callback 函数体
   >     ajax('XXX2', () => {
   >         // callback 函数体
   >         ajax('XXX3', () => {
   >             // callback 函数体
   >         })
   >     })
   > })
   > ```

2. Promise

   > 优点: 解决了回调地狱的问题 
   >
   > 缺点: 
   >
   > 1. 无法取消 Promise. 一旦定义了 then() 方法, 后面就无法取消这个 Promise
   >
   > ```javascript
   > ajax('XXX1')
   >   .then(res => {
   >       // 操作逻辑
   >       return ajax('XXX2')
   >   }).then(res => {
   >       // 操作逻辑
   >       return ajax('XXX3')
   >   }).then(res => {
   >       // 操作逻辑
   >   })
   > ```

3. Generator

   > 优点:  **可以控制函数的执行**，可以配合 co 函数库使用 
   >
   > ```javascript
   > function *fetch() {
   >     yield ajax('XXX1', () => {})
   >     yield ajax('XXX2', () => {})
   >     yield ajax('XXX3', () => {})
   > }
   > let it = fetch()
   > let result1 = it.next()
   > let result2 = it.next()
   > let result3 = it.next()
   > ```

4. Async/awiat

   >  Generator 函数的语法糖, 简化了 Generator 处理异步的操作
   >
   >  优点: 代码清晰, 以同步代码形式处理异步
   >
   >  缺点: 错误处理不方便
   >
   >  ```javascript
   >  async function test() {
   >   // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
   >   // 如果有依赖性的话，其实就是解决回调地狱的例子了
   >   await fetch('XXX1')
   >   await fetch('XXX2')
   >   await fetch('XXX3')
   >  }
   >  ```



## 第 13 题：Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？

```javascript
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve(5);
  console.log(2);
}).then(val => {
  console.log(val);
});

promise.then(() => {
  console.log(3);
});

console.log(4);

setTimeout(function() {
  console.log(6);
});

```

执行结果: 124536;

由结果而知: Promise 构造函数是同步执行的, 而 then 方法是异步执行的, 而且 then 方法是事件循环(Event Loop)的微任务, 而 setTimeout 是宏任务, 所以 5,3 在 6 之前打印.



## 第 14 题：情人节福利题，如何实现一个 new

```javascript
function _new(fn, ...arg) {
	if (typeof fn !== 'function') {
        throw '第一个参数必须为函数'
    }
    // new 作用: 返回一个对象, 并且该对象的 __proto__ 为构造函数的 prototype
    let newObj = Object.create(fn.prototype);
    // new 作用: 调用构造函数, 并且构造函数内部的 this 指针为 new 创建的对象
    let result = fn.apply(newObj, arg);
    // new 作用: 当构造函数返回一个复杂类型数据时, new 就会舍弃 new 创建的对象, 使用构造函数返回的对象
    if (typeof result === 'function' || (typeof result === 'object') && result != null)
        return result;
    // new 作用: 返回 new 创建对象
    return newObj;
}
```



## 第 21 题：有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣

> Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()

> 准确性来讲: 
>
> 1. **Object.prototype.toString.call()**: 数组是 [object Array], 跨框架( iframes )时也是准确, 但是在 ES6 中, 如果重置了知名符号 Symbol.toStringTag 时就不准确
>
>    ```javascript
>    var realarray=[]
>    realarray[Symbol.toStringTag]='Wen'
>    Object.prototype.toString.call(realarray) // [object Wen]
>    ```
>
> 2. **instanceof**:  `instanceof` 的内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`。 **这种方式不准确, 因为原型是可以修改的, 并且跨框架( iframes )时不准确**
>
>    ```javascript
>    // 修改原型
>    var arr = {};
>    Object.setPrototypeOf(arr, Object.prototype);
>    arr instanceof Array; // false 
>
>    // 跨框架
>    var iframe = document.createElement('iframe');
>    document.body.appendChild(iframe);
>    xArray = window.frames[window.frames.length-1].Array;
>    var arr = new xArray(1,2,3); // [1,2,3]
>
>    arr instanceof Array; // false
>    ```
>
> 3. Array.isArray(): ES5 新增方法, 方法稳定性最好, 但是只能检测是否为数组



## 第 22 题：介绍下重绘和回流（Repaint & Reflow），以及如何进行优化

> [重绘和重排(回流)](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/24)

## 第 26 题: 介绍模块化发展历程

> 见 [模块化发展](https://www.processon.com/view/link/5c8409bbe4b02b2ce492286a#map)

## 第 27 题：全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取？

> 在 ES5 中, 顶层对象的属性和全局变量是等价的, var 命令和 function 命令声明的全局变量, 挂载在顶层对象上(浏览器环境上是window)
>
> ```javascript
> var a = 12;
> function f(){};
>
> console.log(window.a); // 12
> console.log(window.f); // f() {}
> ```
>
> 在 ES6 中规定, var 命令和 function 命令声明的全局变量, 依旧是顶层对象的属性, **但是 let 命令、 const 命令、class 命令声明的全局变量, 不属于顶层对象的属性**
>
> ```javascript
> let aa = 1;
> const bb = 2;
> console.log(window.aa); // undefined
> console.log(window.bb); // undefined
> ```



## 第 30 题：两个数组合并成一个数组

请把两个数组 ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 和 ['A', 'B', 'C', 'D']，合并为 ['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']。

```javascript
// 自己简单答案
let r = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'],
    r2 = ['A', 'B', 'C', 'D'];
console.log([...r, ...r2].sort((a, b) => {
    if (a.charCodeAt(0) < b.charCodeAt(0) || ) return -1;    
    if (a.charCodeAt(0) > b.charCodeAt(0)) return 1;

    if (a.length > b.length) return -1;
}))

// 精炼答案
['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'].concat(['A', 'B', 'C', 'D']).sort((a, b) => (b.includes(a) ? a < b : a > b) ? 1 : -1);

```



## 第 31 题：改造下面的代码，使之输出0 - 9，写出你能想到的所有解法。

```javascript
for (var i = 0; i< 10; i++){
	setTimeout(() => {
		console.log(i);
    }, 1000)
}
```

```javascript
// 1 - var 替换为 let
for (let i = 0; i< 10; i++){
	setTimeout(() => {
		console.log(i);
    }, 1000)
}

// 2 - 闭包
for (var i = 0; i< 10; i++){
	setTimeout(((i) => {
        return () => {
			console.log(i);
    	}
    })(i), 1000)
}
```

```javascript
// 答案解析
// 方法一

// 原理：

// 利用 setTimeout 函数的第三个参数，会作为回调函数的第一个参数传入
// 利用 bind 函数部分执行的特性
// 代码 1：

for (var i = 0; i < 10; i++) {
  setTimeout(i => {
    console.log(i);
  }, 1000, i)
}
// 代码 2：

for (var i = 0; i < 10; i++) {
  setTimeout(console.log, 1000, i)
}
// 代码 3：

for (var i = 0; i < 10; i++) {
  setTimeout(console.log.bind(Object.create(null), i), 1000)
}
// 方法二

// 原理：

// 利用 let 变量的特性 — 在每一次 for 循环的过程中，let 声明的变量会在当前的块级作用域里面（for 循环的 body 体，也即两个花括号之间的内容区域）创建一个文法环境（Lexical Environment），该环境里面包括了当前 for 循环过程中的 i，具体链接
// 代码 1：

for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000)
}
等价于

for (let i = 0; i < 10; i++) {
  let _i = i;// const _i = i;
  setTimeout(() => {
    console.log(_i);
  }, 1000)
}
方法三

原理：

// 利用函数自执行的方式，把当前 for 循环过程中的 i 传递进去，构建出块级作用域。IIFE 其实并不属于闭包的范畴。参考链接如下：
// difference-between-closures-and-iifes-in-javascript
// IIFE 是闭包?
// 利用其它方式构建出块级作用域
// 代码 1：

for (var i = 0; i < 10; i++) {
  (i => {
    setTimeout(() => {
      console.log(i);
    }, 1000)
  })(i)
}
// 代码 2：

for (var i = 0; i < 10; i++) {
  try {
    throw new Error(i);
  } catch ({
    message: i
  }) {
    setTimeout(() => {
      console.log(i);
    }, 1000)
  }
}
// 方法四

// 原理：

// 很多其它的方案只是把 console.log(i) 放到一个函数里面，因为 setTimeout 函数的第一个参数只接受函数以及字符串，如果是 js 语句的话，js 引擎应该会自动在该语句外面包裹一层函数
// 代码 1：

for (var i = 0; i < 10; i++) {
  setTimeout(console.log(i), 1000)
}
// 代码 2：

for (var i = 0; i < 10; i++) {
  setTimeout((() => {
    console.log(i);
  })(), 1000)
}
// 代码 3：

for (var i = 0; i < 10; i++) {
  setTimeout((i => {
    console.log(i);
  })(i), 1000)
}
// 代码 5：

for (var i = 0; i < 10; i++) {
  setTimeout((i => {
    console.log(i);
  }).apply(Object.create(null), [i]), 1000)
}
// 代码 6：

for (var i = 0; i < 10; i++) {
  setTimeout((i => {
    console.log(i);
  }).apply(Object.create(null), { length: 1, '0': i }), 1000)
}
// 方法五

// 原理：

// 利用 eval 或者 new Function 执行字符串，然后执行过程同方法四
// 代码 1：

for (var i = 0; i < 10; i++) {
  setTimeout(eval('console.log(i)'), 1000)
}
// 代码 2：

for (var i = 0; i < 10; i++) {
  setTimeout(new Function('i', 'console.log(i)')(i), 1000)
}
// 代码 3：

for (var i = 0; i < 10; i++) {
  setTimeout(new Function('console.log(i)')(), 1000)
}
```



## 第 32 题：Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。

[题目解析](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/47)



## 第 33 题：下面的代码打印什么内容，为什么？

```javascript
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();

// 打印
// ƒ b(){
//     b = 20;
//     console.log(b); 
// }

```

[答案解析1](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/48)

[答案解析2](https://segmentfault.com/q/1010000002810093)



## 第 34 题：简单改造下面的代码，使之分别打印 10 和 20。

```javascript
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();
```

```javascript
// 个人答案
// 打印 10
var b = 10;
(function b(){
    b = 20;
    console.log(window.b); 
})();
// 打印 20 
var b = 10;
(function b(){
    var b = 20;
    console.log(b); 
})();
```



### 第 36 题：使用迭代的方式实现 flatten 函数。

