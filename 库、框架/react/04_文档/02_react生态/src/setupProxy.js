/*
 * @Descripttion: 配置 proxy -- 您无需在任何地方导入此文件。它在您启动开发服务器时自动注册。
 * @Author: 温祖彪
 * @Date: 2021-11-21 11:48:52
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-21 22:34:07
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://elm.cangdu.org',
      // true： 重写 Host 的值就是 target 值
      // false：不重写 Host, 还是原请求 Host
      changeOrigin: true, //  是否重写请求报文中 Host 的值,
      pathRewrite: { '^/api': '' }, // 重写路径
    })
  );
};
