// 这个就是 fs 的 promise 形式
const fs = require('fs').promises;

fs.readFile('./logs/log1.log', 'utf-8')
  .then(result =>　{
    console.log(result);
  })
