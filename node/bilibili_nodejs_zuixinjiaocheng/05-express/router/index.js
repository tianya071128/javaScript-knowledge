const express = require('express');

// 路由中间件
const router = express.Router();

router
  // test: 1. 路由参数 2. res.send() 是否可以重复调用 3. 执行 next() 后是否会继续进入下一个中间件
  .get('/users/:userId', (req, res, next) => {
    // 路由参数 - 类似于 vue-router 的 params
    const params = req.params; // { userId: id }

    res.send(params);

    // res.send('是否会替换掉'); // no - 不能重复发送请求
    // 当使用了 send 方法时, 是否还会执行下面代码? -- yes, 还是会执行的
    console.log('是否执行?');

    next(); // 执行 next 后是否会进入下一个中间件? -- yes, 还是会走到这一个中间件
  }, (req, res, next) => {
    console.log('中间件');
  })

module.exports = router;