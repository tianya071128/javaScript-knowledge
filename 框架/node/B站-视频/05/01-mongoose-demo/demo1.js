const mongoose = require("mongoose");

// 连接 MongoDB 数据库
mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 创建一个模型
// 就是在设计数据库
// MongoDB 是动态的, 非常灵活, 只需要在代码中设计你的数据库就可以了
const Cat = mongoose.model("Cat", { name: String });

// 实例化一个 Cat
const kitty = new Cat({ name: "Zildjian" });
// 持久化保存 kitty
kitty.save().then(() => console.log("meow"));
