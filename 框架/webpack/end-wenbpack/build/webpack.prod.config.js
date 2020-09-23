const path = require("path");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");
// 将CSS代码提取为独立文件的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 清空打包文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(baseWebpackConfig, {
  mode: "production",
  output: {
    filename: "js/[name].[chunkhash:6].js", // 打包后的文件名称
    path: path.resolve(__dirname, "../dist") // 打包后的目录，必须是绝对路径
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 解析 css
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      },
      {
        test: /\.less$/, // 解析 less
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
      }
    ]
  }
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:6].css"
    }), //为抽取出的独立的CSS文件设置配置参数
    new CleanWebpackPlugin()
  ]
});
