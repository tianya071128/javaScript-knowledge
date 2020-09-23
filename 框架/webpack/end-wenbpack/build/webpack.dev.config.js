const path = require("path");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");

const webpackConfig = merge(baseWebpackConfig, {
  mode: "development", // development production
  devServer: {
    host: "localhost", // 默认是localhost
    port: 3000, // 端口
    // open: true, // 自动打开浏览器
    hot: true // 开启热更新
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 解析 css
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.less$/, // 解析 less
        use: ["style-loader", "css-loader", "less-loader"]
      }
    ]
  }
});
module.exports = webpackConfig;
