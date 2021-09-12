/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:37:00
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-12 11:58:50
 */
const router = require('koa-router')(); // 创建一个容器
const { testGET, testPOST, testPostFormData } = require('../controllers/v1'); // 处理器, MVC 架构?

// 可以在这里处理这里这个模块的路由, 例如统一判断登录...
// router.use(async (ctx, next) => {
//   // console.log('会经过这里嘛?');
//   await next(); // 这里需要使用 await 一下， 不能的话，会让错误不能继续捕获下去
// });

const routers = router.get('/test/get', testGET).post('/test/post', testPOST).post('/test/postFormData', testPostFormData);

module.exports = routers;
