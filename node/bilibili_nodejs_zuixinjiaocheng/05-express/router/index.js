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

module.exports = router;