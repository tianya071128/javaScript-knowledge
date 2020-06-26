const express = require("express");

// 创建路由容器
const router = express.Router();

router.get("/cities", function(req, res) {
  res.send("hello, world");
});

module.exports = router;
