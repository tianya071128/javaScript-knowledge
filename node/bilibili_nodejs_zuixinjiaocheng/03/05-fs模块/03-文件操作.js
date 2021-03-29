const fs = require('fs').promises;

// 循环创建文件
// for (let index = 0; index < 10; index++) {
//   fs.writeFile(`./logs/log-${index}.log`, `log-${index}`)
//     .then((result) => {
//       console.log(result);
//     })
// }

fs.readdir('./')
  .then(content => {
    content.forEach(value => {
      // 查询每个文件(夹)的信息
      fs.stat(value)
        .then(result => {
          if (result.isDirectory()) {
            // 如果是文件夹
            fs.readdir(`./${value}`)
              .then(value02 => console.log(value02))
          } else {
            console.log(value);
          }
        })
    })
  }) 