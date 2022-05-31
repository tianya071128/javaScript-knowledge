/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-13 17:34:45
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-24 23:35:44
 */
// => 导入模块
const mongoose = require('mongoose');
const config = require('../../config'); // 加载配置文件
// => URI > mongodb://用户名:密码@主机:端口/数据库名称
const MONGODB_URI = config.dbUrl;
// => 连接数据库
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('mongodb connect fail!', err);
    return;
  }
  console.log('mongodb connect success!');
});
module.exports = mongoose;
