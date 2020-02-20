**ES2017(简称ES8)**

* async/await
* Object.values()
* Object.entries()
* String padding: padStart() 和 padEnd()，填充字符串达到当前长度
* 函数参数列表结尾允许逗号
* Object.getOwnPropertyDescriptors()
* ShareArrayBuffer 和 Atomics 对象，用于从共享内存位置读取和写入



## 1. async/await

详情见 [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/async)



## 2. Object.values(), Object.entries()

ES5 引入了 Object.keys() 方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历属性的键名

Object.values(): 返回一个数组，成员是参数对象 自身的所有可遍历属性的键值。

Object.entries(): 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。



## 3. String padding

ES8 中 String 新增了两个实例函数 `String.prototype.padStart` 和 `String.prototype.padEnd` ，允许将空字符串或其他字符串添加到原始字符串的开头或结尾。

```javascript
'x'.padStart(4, 'ab') // 'abax'
'x'.padEnd(5, 'ab') // 'xabab'
```



## 4. 函数参数列表结尾允许逗号

主要作用是方便使用git进行多人协作开发时修改同一个函数减少不必要的行变更。



## 5. Object.getOwnPropertyDescriptors()

ES5 的 `Object.getOwnPropertyDescriptor()` 方法会返回某个对象属性的描述对象（descriptor)。

ES8 引入的 `Object.getOwnPropertyDescriptors()` 方法，返回指定对象所有自身属性（非继承属性）的描述对象。

```javascript
const obj2 = {
	name: 'Jine',
	get age() { return '18' }
};
Object.getOwnPropertyDescriptors(obj2)
// {
//   age: {
//     configurable: true,
//     enumerable: true,
//     get: function age(){}, //the getter function
//     set: undefined
//   },
//   name: {
//     configurable: true,
//     enumerable: true,
//		value:"Jine",
//		writable:true
//   }
// }
```



## 6. SharedArrayBuffer对象 和 Atomics对象

SharedArrayBuffer 对象用来表示一个通用的，固定长度的原始二进制数据缓冲区，类似于 ArrayBuffer 对象，它们都可以用来在共享内存（shared memory）上创建视图。与 ArrayBuffer 不同的是，SharedArrayBuffer 不能被分离。

Atomics 对象提供了一组静态方法用来对 SharedArrayBuffer 对象进行原子操作。