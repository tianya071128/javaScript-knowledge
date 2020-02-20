**ES2018(简称ES9)**

* 异步迭代
* Promise.finally()
* Rest/Spread 属性
* 正则相关
  * 正则表达式命名捕获组（Regular Expression Named Capture Groups）
  * 正则表达式反向断言（lookbehind）
  * 正则表达式dotAll模式
  * 正则表达式 Unicode 转义
  * 非转义序列的模板字符串



## 1. 异步迭代

ES9 新增的 `for...await...of` 可以用来遍历具有 `Symbol.asynccIterator` 方法的数据结构，也就是异步迭代器，且会等待前一个成员的状态改变后才会遍历到下一个成员，相当于 `async` 函数内部的 `await`。

```javascript
// for of遍历
function Gen (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(time)
    }, time)
  })
}
async function test () {
  let arr = [Gen(2000), Gen(100), Gen(3000)]
  for (let item of arr) {
    console.log(Date.now(), item.then(console.log))
  }
}
test();
// 结果表明 for...of 方法不能遍历异步迭代器
/*  结果:
    1582183938224 Promise {<pending>}
    1582183938224 Promise {<pending>}
    1582183938224 Promise {<pending>}
    100
    2000
    3000
*/

// 使用 for...await...of
async function test () {
  let arr = [Gen(2000), Gen(100), Gen(3000)]
  for await (let item of arr) {
    console.log(Date.now(), item)
  }
}
/* 结果
   1575536194608 2000
   1575536194608 100
   1575536195608 3000
*/
```

**详情见 [阮一峰-异步遍历器](http://es6.ruanyifeng.com/#docs/async-iterator)**



## 2. Promise.prototype.finally()

`.finally()` 方法 返回一个 Promise，在promise执行结束时，无论结果是fulfilled或者是rejected，在执行then()和catch()后，都会执行finally指定的回调函数。

```javascript
fetch('https://www.google.com')
  .then((response) => {
    console.log(response.status);
  })
  .catch((error) => { 
    console.log(error);
  })
  .finally(() => { 
    document.querySelector('#spinner').style.display = 'none';
  });
```



## 3. Rest/Spread 属性

ES6 引入了 Rest参数和扩展运算符，只用于数组。

ES9 为**对象解构**提供了和数组一样的  Rest 参数和展开操作符。

```javascript
// Rest参数
const myObject = {
  a: 1,
  b: 2,
  c: 3
};

const { a, ...x } = myObject;
// a = 1
// x = { b: 2, c: 3 }

// 展开操作符
const input = {
  a: 1,
  b: 2
}
const output = {
  ...input,
  c: 3
}
input.a='浪里行舟'
console.log(input,output) // {a: "浪里行舟", b: 2} {a: 1, b: 2, c: 3}
```



## 4. 新的正则表达式特性

略



