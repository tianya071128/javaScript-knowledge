const express = require('express');

// 路由中间件
const router = express.Router();

router
  .get('/index', (req, res, next) => {
    const query = req.query; // 获取前端 query 参数

    res.send('index pages');
  })
  .post('/index', (req, res, next) => {
    const data = req.body;

    res.send(data);
  })
  .get('/api/list', (req, res, next) => {
    const dataArray = (new Array(1000)).fill(1).map((item, index) => 'line' + index);

    // 通过 art-template 注入到 res 的方法渲染模板并返回给前端
    res.render('list', {
      data: dataArray
    })
  })

module.exports = router;