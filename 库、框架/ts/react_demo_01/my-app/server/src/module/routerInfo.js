/*
 * @Descripttion: 连接的 shuli 数据库的 reactRouterInfo 集合
 * @Author: 温祖彪
 * @Date: 2021-09-13 17:45:06
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-14 23:05:55
 */
const mongoose = require('../db');
// 创建模式, 用于约束集合
const routerInfoScheam = new mongoose.Schema({
  user_type: {
    type: String,
    required: true,
  },
  router_info: {
    type: Array,
    required: true,
  },
});

// 创建模型 -- 模型代表着数据库的集合, 用于操作集合
const RouterInfo = mongoose.model('reactRouterInfo', routerInfoScheam);

module.exports = RouterInfo;
