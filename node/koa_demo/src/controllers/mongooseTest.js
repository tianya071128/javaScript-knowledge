/*
 * @Descripttion: 测试 mongoose 文件
 * @Author: 温祖彪
 * @Date: 2021-09-14 10:02:59
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-15 10:13:28
 */
const Test = require('../models/test');

// 增
async function add(document) {
  const result = await new Test(document).save();
  console.log('新增结果', result);
}

// add({
//   name: '温',
//   age: 26, // 如果传入的值不符合模型的约束的话, 则会报错
// });

// 查
async function query(...args) {
  const result = await Test.find(...args);
  console.log('查询结果', result);
}

query();
