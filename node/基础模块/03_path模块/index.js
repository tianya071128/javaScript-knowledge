const path = require('path');

/**
 * path.dirname(path): 返回指定路径的目录名
 *  * path <string>: 路径
 *  * 返回 <string>: 目录名
 */
console.log(path.dirname(__filename)); // C:\Users\Administrator\Desktop\javaScript-knowledge\node\基础模块\03_path模块

/**
 * path.extname(path): 返回 path 的扩展名
 *  * path <string>: 路径
 *  * 返回 <string>: 扩展名
 */
console.log(path.extname('index.js')); // .js

/**
 * path.join([...paths]): 将 path 片段规范连接在一起
 *  * ...paths: 路径片段
 *  * 返回: 路径
 */
console.log(path.join('./test', 'test2')); // test\test2

/**
 * path.resolve([...paths]): 将 path 片段连接成一个绝对路径
 *  * ...paths: 路径片段
 *  * 返回: 绝对路径
 */
// 如果在处理完所有给定的 path 片段之后，还没有生成绝对路径，则使用当前工作目录。
console.log(path.resolve('bar', 'foo')); // C:\Users\Administrator\Desktop\javaScript-knowledge\node\基础模块\03_path模块\bar\foo
console.log(path.resolve('/bar', 'foo')); // C:\bar\foo
