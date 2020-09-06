const path = require("path");
// 生成 html
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取出 css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// css 压缩
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// js 压缩
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  mode: "production", // 模式
  entry: "./src/index.js", // 入口
  output: {
    filename: "bundle.[hash:4].js", // 打包后的文件名
    path: path.resolve(__dirname, "dist") // 路径必须是一个绝对路径
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html"
    }),
    // 提取出 css
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css"
    })
  ],
  optimization: {
    // 在 mode 为 'production' 模式下才生效
    minimizer: [
      // 针对 js 进行压缩，在 'production' 模式下，会自动生效的，但是如果设置了 optimization.minimizer，则会覆盖 webpack 提供的默认设置，因此在这里需要指定 JS 压缩
      new UglifyjsWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      // 针对 CSS 进行压缩
      new OptimizeCssAssetsWebpackPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      }
    ]
  }
};
