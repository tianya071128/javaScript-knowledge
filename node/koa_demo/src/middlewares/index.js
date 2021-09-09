/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-09 16:35:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-09 17:33:12
 */
const path = require('path');
const cors = require('@koa/cors'); // 跨域
const staticCache = require('koa-static-cache'); // 静态资源
const koaBody = require('koa-bodyparser'); // body 请求体处理

const routers = require('../routers/index'); // 加载路由器

/**
 * 跨域处理
 */
const mdCors = cors({
  origin: '*', // 允许跨域的请求
  credentials: true, // 是否允许携带 cookie
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
});

/**
 * 参数解析, 这里有一个问题是不能处理 multipart 文件类型, 可使用 formidable 处理文件
 */
const mdKoaBody = koaBody({
  /**
   * json: application/json
   * form: application/x-www-form-urlencoded
   */
  enableTypes: ['json', 'form', 'text', 'xml'], // 解析类型
  formLimit: '56kb',
  jsonLimit: '1mb',
  textLimit: '1mb',
  xmlLimit: '1mb',
  strict: true,
});

/**
 * 静态资源处理
 */
const mdStatic = staticCache(path.join(__dirname, '../../public'), {
  maxAge: 365 * 24 * 60 * 60,
});

/**
 * 路由处理
 */
const mdRoute = routers.routes();
const mdRouterAllowed = routers.allowedMethods();

module.exports = [mdCors, mdKoaBody, mdRoute, mdRouterAllowed, mdStatic];
