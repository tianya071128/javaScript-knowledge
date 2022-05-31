/*
 * @Descripttion: 整合所有子路由
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:31:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-10 12:12:54
 */
const router = require('koa-router')(); // 创建路由容器
const v1 = require('./v1');
const { login } = require('../controllers'); // 处理器, MVC 架构?

router.post('/login', login);

// allowedMethods: 返回单独的中间件, 用于响应OPTIONS带有Allow包含允许方法的标头的请求
router.use('/v1', v1.routes(), v1.allowedMethods());

module.exports = router;
