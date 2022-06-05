/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-08 10:37:00
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-21 22:05:46
 */
const router = require('koa-router')(); // 创建一个容器
const { check_token } = require('../utils/token'); // 验证 token 是否过期
const {
  getRouterInfoController,
  resolveRouterInfoController,
} = require('../controllers/v1');

// 统一中间件, 需要登录验证
router.use(check_token);

// routerList.forEach((item) => {
//   const { method, path, controller, valid } = item;
//   router[method](path, paramValidator(valid), controller);
// });
router
  .get('/routerInfo', getRouterInfoController)
  .post('/routerInfo', resolveRouterInfoController);

module.exports = router;
