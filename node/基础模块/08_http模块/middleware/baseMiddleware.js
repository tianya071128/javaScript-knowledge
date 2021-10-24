/*
 * @Descripttion: 
 * @Author: 温祖彪
 * @Date: 2021-10-15 16:55:52
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-19 09:32:13
 */
const { URL } = require('url');
// 生成一个访问请求字段的函数
const getHeader = function(req) {
  return function (str) {
    str = str.toLocaleLowerCase();
    return req.headers[str];
  }
}

module.exports = function baseMiddleware(ctx) {
  return new Promise((resolve, reject) => {
    const { req } = ctx;
    const url = new URL(req.url, `http://${req.headers.host}`);
    // ctx.url = url;
    ctx.path = url.pathname; // 路径, 不带 查询参数 的
    ctx.query = {}; // 查询字符串
    ctx.method = req.method.toLocaleLowerCase(); // 请求方法
    ctx.ip = req.socket.remoteAddress; // 请求 ip
    ctx.port = req.socket.remotePort; // 请求 port(端口号)
    ctx.getHeader = getHeader(req); // 

    url.searchParams.forEach((value, name) => {
      if (ctx.query.hasOwnProperty(name)) {
        // 如果存在多个, 生成数组
        ctx.query[name] = Array.isArray(ctx.query[name]) ? ctx.query[name].push(value) : [ctx.query[name], value]
      } else {
        ctx.query[name] = value;
      }
    })

    resolve(ctx);
  })
}