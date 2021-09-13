/*
 * @Descripttion: 连接的 testMongo 数据库的 test 集合
 * @Author: 温祖彪
 * @Date: 2021-09-13 17:45:06
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-13 17:45:07
 */
// 文件位置：./models/hero.js
const mongoose = require('../../db/testMongo');
const heroSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 65,
    },
    tel: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: '保密',
    },
  },
  {
    collection: 'heros',
  }
);

const Hero = mongoose.model('Hero', heroSchema, 'heros');

module.exports = Hero;
