const exporess = require('express'); // 1.引入

const app = exporess(); // 2. 生成一个 app

// 注册一个路由 - 回调函数相当于一个中间件
app.use('/', (req, res, next) => { // 中间件通过 next() 方法传递给下一个
  res.send('hello');
  console.log('中间件01');
  next();
}, (req, res) => {
  console.log('中间件02')
})

app.listen(8080, () => {
  console.log('localhost:8080');
})