const express = require("express");
const router = require("./router/index");

const app = express();

// 注册路由
router(app);

app.use(express.static("./public"));

app.listen(3000, () => {
  console.log(`成功监听端口：${3000}`);
});
