/** commonJS 规范
 * 1. 模块中导出的是 module.exports 对象
 * 2. 所以不能通过 module.exports = ... 和 exports.xxx = xxx 混用, 因为会断开 module.exports 之间的联系
 * 3. 循环引用: a.js 引用 b.js, b.js 引用 a.js,
 *    此时 b.js 中引入的 a.js 不会执行 a.js 文件, b.js 接收的 a.js 模块变量为 undefined
 *    也就是说, 执行顺序: a.js => 引用 b.js => 执行 b.js => 引用 a.js => 不会执行全部 a.js,而是将其 require('./a.js') 导出值置为 undefined => 执行完成 b.js => 执行 a.js 剩下的代码
 */

const foo = require("./b.js");

exports.a = 1;
exports.b = 2;

console.log(1, foo);
console.log(2, foo.add);
