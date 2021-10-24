/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-25 16:23:11
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-26 23:24:44
 */

/**
 * 第一步：连接数据库
 */
const mongoose = require('mongoose');
// => URI > mongodb://用户名:密码@主机:端口/数据库名称
/**
 * 在这里发现一个问题，使用 admin 超级管理员账号去登录除去 admin 数据库登录不成功，需要使用指定数据库的用户去登录
 */
const MONGODB_URI = 'mongodb://test:123456@127.0.0.1:27017/test';
// => 连接数据库
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
}, (err) => {
  if (err) {
    console.log('mongodb connect fail!', err);
    return;
  }
  console.log('mongodb connect success!');
});

/**
 * 第二步：设置数据模型，用于操作集合
 * 注意: 第一个参数 api 表示集合名称, 在实际中集合名是 apis, 会自动添加一个 s
 */
const testModel = mongoose.model('api', {
  name: String,
  age: Number,
  sex: {
    type: String,
    default: '男'
  }
})

/**
 * 第三步: 通过数据模型操作数据库
 */

/** 增 */
// 创建一个 model 模型实例
// const insertObj = new testModel({
//   name: '彪3',
//   age: 22,
//   sex: "男"
// })
// 通过实例 save() 添加数据
// insertObj.save().then(data => console.log('添加成功', data)).catch(err => console.log('添加失败', err));

/** 删 */
// Model.deleteMany(条件, 配置项)：删除匹配的文档
// Model.deleteOne(): 删除匹配的第一条
// testModel.deleteOne({ name: 'asdf' }).then(data => console.log('删除结果', data)) //  deletedCount: 0 }: 没有匹配结果没有删除文档
//   .catch(err => console.log('删除失败', err));

/** 改 */
// Model.updateMany(条件, 更新数据, 配置项)：更新匹配的文档 -- 参数作用与 MongoDB 更新命令差不多
// Model.updateOne(): 更新匹配的第一条
// 第二个参数可以使用操作符
// testModel.updateOne({ name: '彪1' }, { $inc: { age: 45 } }).then(data => console.log('更新成功', data)) //  deletedCount: 0 }: 没有匹配结果没有删除文档
//   .catch(err => console.log('更新失败', err));

/** 查 */
/**
 * Model.find(条件[, 需要的列[, 其他配置项]])\
 *  条件: 即查询条件
 *  需要的列: 对应 MongoDB.find() 的第二个参数, 表示需要哪些字段
 *  其他配置项: 如分页, 排序
 */
// testModel.find({}, 'name age')
//   .then(data => console.log('查询结果', data)) // [{ _id: new ObjectId("61507b709ddcee7f45672da8"), name: '彪', age: 18 }]
//   .catch(err => console.log('查询失败', err));

// 分页: skip: 跳过 1 条, limit: 限制查询 2 条, sort: 根据 age 排序
// testModel.find({}, 'name age', { skip: 1, limit: 2, sort: { age: -1 } })
//   .then(data => console.log('查询结果', data)) // [{ _id: new ObjectId("61507b709ddcee7f45672da8"), name: '彪', age: 18 }]
//   .catch(err => console.log('查询失败', err));

// 其他 api
// Model.findOne() // 只查询一条
// Model.findById() // 根据 _id 查询一条
// Model.findOneAndDelete()
// Model.findOneAndRemove()
// Model.findOneAndReplace()
// Model.findOneAndUpdate()
// Model.findByIdAndDelete()
// Model.findByIdAndRemove()
// Model.findByIdAndUpdate()