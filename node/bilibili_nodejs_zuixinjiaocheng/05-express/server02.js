/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-03-30 22:53:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-31 00:00:41
 */
const express = require('express');
const bodyParser = require('body-parser')
const router = require('./router/index');

const app = express();

// 注册中间件 - bodyParser 解析 body 数据
// bodyParser.urlencoded -- 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// bodyParser.json -- 解析 application/json
app.use(bodyParser.json());

app.use('/', router);


app.listen(8080, () => {
  console.log('localhost: 8000')
})