/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-03-30 22:53:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-31 23:53:10
 */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./router/index');

const app = express();

// 注册中间件 - bodyParser 解析 body 数据
// bodyParser.urlencoded -- 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// bodyParser.json -- 解析 application/json
app.use(bodyParser.json());

// 托管静态资源中间件
app.use(express.static(path.join(__dirname, 'public'))); // 路径是相对于您启动node过程的目录的, 所以使用服务的绝对路径更为保险

// art-template 模板引擎
app.engine('art', require('express-art-template'));
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'art');


app.use('/', router);


app.listen(8080, () => {
  console.log('localhost: 8000')
})