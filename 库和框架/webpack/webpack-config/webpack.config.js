const path = require("path");

module.exports = {
  mode: "development",
  // 入口 - 起点或是应用程序的起点入口。
  // entry: "./src/index.js" // 传入字符串时，chunk 的名称则为 chunk
  // entry: ["./src/index.js", "./src/assets/entry/entry1.js"] // 当为数组形式，则会将数组入口导出到一个 chunk 上。并且当配合 output.library 时，那么只会暴露数组中的最后一个模块
  entry: { app: "./index.js" }, // 推荐 - 对象形式，则会打包为多个 chunk，chunk 的 name 为对象的 key。
  // entry: () => "./src/index.js" // 函数形式，返回上面三种形式之一。可以用来实现动态入口
  context: path.resolve(__dirname, "src") // string 类型，webpack 的主目录，entry 和 module.rules.loader 选项是相对于此目录解析的
};
