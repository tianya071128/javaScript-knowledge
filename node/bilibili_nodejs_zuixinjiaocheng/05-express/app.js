const path = require('path');
const express = require('express');
const router = require('./router');

const app = express(); // 2. 生成一个 app

// 托管静态文件 -- 使用 express.static 内置中间件函数
app.use('/static', express.static(path.join(__dirname, './public')))

// 注册路由模块
app.use('/', router);


// 3. 启动 8080 服务
app.listen(8080, () => {
  console.log('localhost:8080');
})