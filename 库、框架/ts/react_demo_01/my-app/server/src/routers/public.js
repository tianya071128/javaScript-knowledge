/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-10-10 12:08:55
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-10 22:05:43
 */
const router = require('koa-router')(); // 创建一个容器
const { login } = require('../controllers/public'); // 处理器, MVC 架构?

const routers = router.post('/login', login);

module.exports = routers;
