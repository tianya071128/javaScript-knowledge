/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-09 16:35:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-24 23:37:00
 * @LastEditTime: 2021-10-18 09:00:02
 */
const path = require('path');
const cors = require('@koa/cors'); // 跨域
const staticCache = require('koa-static-cache'); // 静态资源
const koaBody = require('koa-bodyparser'); // body 请求体处理

const routers = require('../routers/index'); // 加载路由器
const formidable = require('./formidable'); // 解决文件上传问题
const response = require('./response');
const error = require('./error');
const log = require('./log');

/**
 * 跨域处理
 */
const mdCors = cors({
  origin: '*', // 允许跨域的请求
  credentials: true, // 是否允许携带 cookie
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
});

/**
 * 参数解析, 
 */
// 文件上传解析
const mdFormidable = formidable();

// 这里有一个问题是不能处理 multipart 文件类型, 可使用 formidable 处理文件
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
 * 记录请求日志
 */
const mdLogger = log();


/**
 * 静态资源处理
 */
const mdStatic = staticCache(path.join(__dirname, '../../public'), {
  maxAge: 365 * 24 * 60 * 60,
});

/**
 * 统一返回格式
 */
const mdResHandler = response();
/**
 * 错误处理
 */
const mdErrorHandler = error();

/**
 * 路由处理
 */
const mdRoute = routers.routes();
const mdRouterAllowed = routers.allowedMethods();

// 注意这些中间件的顺序问题
module.exports = [mdCors, mdStatic, mdFormidable, mdKoaBody, mdLogger, mdResHandler, mdErrorHandler, mdRoute, mdRouterAllowed];
