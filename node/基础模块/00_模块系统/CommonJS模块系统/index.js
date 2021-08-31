/**
 * 1. 缓存: 模块加载会进行缓存
 * 2. 循环引用: 模块会返回可能尚未完成的模块
 *      例如: 当 main.js 加载 a.js 时，a.js 依次加载 b.js。 此时，b.js 尝试加载 a.js。 为了防止无限循环，将 a.js 导出对象的未完成副本返回给 b.js 模块。
 * 3. 模块封装器: CommonJS 模块实现的机制
 *    ((function(exports, require, module, __filename, __dirname) {
 *        // 模块代码实际存在于此处
 *    });)
 */

/** 模块作用域: 相关变量 */
// 1. __dirname: 当前模块的文件目录
console.log(__dirname); // C:\Users\Administrator\Desktop\javaScript-knowledge\node\基础模块\00_模块系统\CommonJS模块系统

// 2. __filename: 当前模块的文件名
console.log(__filename); // C:\Users\Administrator\Desktop\javaScript-knowledge\node\基础模块\00_模块系统\CommonJS模块系统\index.js

// 3. require(id): 导入模块
const fn = require("./module/01");
fn();

// 4. require.cache: 缓存的模块, 通过操作这个变量会导致模块的重新加载
console.log(Object.keys(require.cache));
delete require.cache[
  "C:\\Users\\Administrator\\Desktop\\javaScript-knowledge\\node\\基础模块\\00_模块系统\\CommonJS模块系统\\module\\01.js"
]; // 删除缓存
require("./module/01");

// 5. require.main: 表示 Node.js 进程的启动脚本
// console.log(require.main);

/** module 对象: 导出对象 */
// 1. module.exports: 默认导出
module.exports = {}; // 可以导出一个常量或者类...
// 2. module.id: 模块的标识符
console.log(module); // module 对象上存在着其他属性或方法
