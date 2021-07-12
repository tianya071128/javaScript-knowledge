/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-04-17 22:53:23
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-17 23:11:30
 */
// getting-started.js
const mongoose = require('mongoose');
// 连接本地数据库 -- 返回一个状态待定的连接
mongoose.connect('mongodb://localhost/lagou-admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;
// 连接失败
db.on('error', console.error.bind(console, 'connection error:'));

// 建立一个 schema
const usersSchema = mongoose.Schema({
  username: String,
  password: String
})

// 将这个 schema 编译成一个 Model
const Users = mongoose.model('users', usersSchema);

exports.Users = Users;

