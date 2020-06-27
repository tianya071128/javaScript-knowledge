var mongoose = require("mongoose");

var Scheam = mongoose.Schema;

// 1. 连接数据库 -- test 库
// 指定连接的数据库不需要存在,当你插入第一条数据后会自动创建
mongoose.connect("mongodb://localhost/test");

// 2. 设计集合结构(表结构)
var userSchema = new Scheam({
  username: {
    type: String,
    required: true // 必须有
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String
  }
});

/**
 * @name: 3. 将文档结构发布为模型
 * @param {String} 表示数据库的集合名词
 * @param {Scheam} 架构
 * @return 模型构造函数
 */
var User = mongoose.model("User", userSchema);

// 4. 使用模型构造函数, 新增数据
// var admin = new User({
//   username: "zs",
//   password: "123456",
//   email: "admin@admin.com"
// });

// admin.save().then(() => {
//   console.log("保存成功");
// });

// 5. 查询数据

// 查询全部
User.find().then(ret => {
  console.log("查询成功", ret);
});
// 按条件查询
User.find({
  username: "zs"
}).then(ret => {
  console.log(ret);
});
// 只查询一个, 返回对象
User.findOne({
  username: "zs"
}).then(ret => {
  console.log(ret);
});
