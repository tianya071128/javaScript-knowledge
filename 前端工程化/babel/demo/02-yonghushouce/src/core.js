// 导入 @babel/core
var babel = require('@babel/core');
var options = {};
var ast = null;

// 1. 解析字符串形式的 JS 代码
ast = babel.transform(`let name = 2;
console.log('test');`, options); // => { code, map, ast }
// 2. 解析文件，使用异步 api
// babel.transformFile("filename.js", options, function (err, result) {
//   ast = result; // => { code, map, ast }
// });
// // 3. 解析文件，使用同步 api：
// ast = babel.transformFileSync("./index.js", options); // => { code, map, ast }
// // 4. 直接从 AST 中进行转换：
// babel.transformFromAst(ast, code, options); // => { code, map, ast }

console.log(ast);