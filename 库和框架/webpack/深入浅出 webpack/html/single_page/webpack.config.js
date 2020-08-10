const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: __dirname + "/index.js",
  output: {
    filename: "[name].boundle.js",
    path: __dirname + "/build"
  },
  plugins: [
    // 配置生成 html 文件
    new HtmlWebpackPlugin({
      title: "DevOps Monitor",
      template: "index.html", // 模板
      minify: {
        removeComments: true, // 移除注释
        collapseWhitespace: true, // 移除 document 中空白的文本节点
        collapseInlineTagWhitespace: true // 压缩行级元素的空白。。。
      }
    })
  ]
};
