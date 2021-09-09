/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:37:00
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-09 16:33:55
 */
const router = require('koa-router')(); // 创建一个容器
const { testGET, testPOST } = require('../controllers/v1'); // 处理器, MVC 架构?

// 可以在这里处理这里这个模块的路由, 例如统一判断登录...
router.use((ctx, next) => {
  // console.log('会经过这里嘛?');
  next();
});

const routers = router.get('/test/get', testGET).post('/test/post', testPOST);

module.exports = routers;
