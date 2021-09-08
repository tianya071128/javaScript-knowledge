/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:37:00
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-08 16:56:13
 */
const router = require('koa-router')(); // 创建一个容器
const { getTest } = require('../controllers/v1'); // 处理器, MVC 架构?

const routers = router.get('/test', getTest);

module.exports = routers;
