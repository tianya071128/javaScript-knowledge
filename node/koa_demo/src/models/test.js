/*
 * @Descripttion: 连接的 testMongo 数据库的 test 集合
 * @Author: 温祖彪
 * @Date: 2021-09-13 17:45:06
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-14 16:34:56
 */
const mongoose = require('../db');
// 创建模式, 用于约束集合
const testSchema = new mongoose.Schema(
  {
    name: {
      type: String, // 类型
      required: true, // 必填
      index: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18, //
      max: 65,
    },
  },
  {
    collection: 'test',
  }
);

// 创建模型
const Test = mongoose.model('Test', testSchema, 'tests');

module.exports = Test;
