# 目录

- [第 1 题: 写 React / Vue 项目时为什么要在列表组件中写 key，其作用是什么？](#第-1-题:-写-React-/-Vue-项目时为什么要在列表组件中写-key，其作用是什么？)
- [第 2 题: ['1', '2', '3'].map(parseInt) what & why ?](<#第-2-题:-['1',-'2',-'3'].map(parseInt)-what-&-why-?>)
- [第 3 题: 什么是防抖和节流？有什么区别？如何实现？](#第-3-题:-什么是防抖和节流？有什么区别？如何实现？)
- [第 4 题: 介绍下 Set、Map、WeakSet 和 WeakMap 的区别？](#第-4-题:-介绍下-Set、Map、WeakSet-和-WeakMap-的区别？)
- [第 5 题：介绍下深度优先遍历和广度优先遍历，如何实现？](#第-5 题：介绍下深度优先遍历和广度优先遍历，如何实现？)

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

























