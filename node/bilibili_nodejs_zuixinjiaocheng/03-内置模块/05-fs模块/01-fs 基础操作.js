const fs = require('fs');

/** 文件夹操作 */

// 增 --- 创建文件夹操作 
// fs.mkdir('logs', (err) => {
//   if (err) throw err;
// 
//   console.log('文件夹创建成功')
// })

// 删 --- 删除文件夹
// fs.rmdir('./log', () => {
//   console.log('删除成功');
// })

// 改 --- 修改文件(夹)名称
// fs.rename('./logs', './log', () => {
//   console.log('文件夹名修改成功');
// })

// 查 -- 读取文件夹
// fs.readdir('./logs', (err, result) => {
//   console.log(result);
// })

/**  文件操作   */

// 增 --- 写入文件
// fs.writeFile('./logs/log1.log', 'hello \nworld', (err) => {
//   console.log('写入成功');
// })

// 删 --- 删除文件
// fs.unlink('./logs/log1.log', (err) => {
//   console.log('删除成功');
// })

// 改 --- 修改文件 - 在原有基础上追加
// fs.appendFile('./logs/log1.log', '!!!', (err) => {
//   console.log('修改文件成功')
// })

// 查 --- 查询文件内容
// fs.readFile('./logs/log1.log', 'utf-8', (err, content) => {
//   console.log(content);
// })

/** 其他 api */
// 查询文件(夹)信息
// fs.stat('./', (err, result) => {
//   console.log(result); // 文件(夹)信息
//   console.log(result.isDirectory()); // 判断是否为文件夹
// });

// 观察文件(夹)变化 - 会有比较多的兼容性问题
// fs.watch('./logs/log-0.log', (err) => {
//   console.log('file has change.');
// })

// 观察文件变化 - 只针对文件, 兼容性问题较少
// fs.watchFile('./logs/log-1.log', (curr, prev) => {
//   console.log(curr, prev)
// })  