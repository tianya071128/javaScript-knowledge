const HtmlWebpackPlugin = require("html-webpack-plugin"); //用于自动生成html入口文件的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //将CSS代码提取为独立文件的插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //CSS模块资源优化插件

module.exports = {
  mode: "development",
  entry: "./main.js",
  output: {
    filename: "main.bundle.js",
    path: __dirname + "/dist"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/, //排除node_modules文件夹
        use: [
          {
            loader: MiniCssExtractPlugin.loader //建议生产环境采用此方式解耦CSS文件与js文件
          },
          {
            loader: "css-loader", //CSS加载器
            options: { importLoaders: 2 } //指定css-loader处理前最多可以经过的loader个数
          },
          {
            loader: "postcss-loader" //承载autoprefixer功能
          },
          {
            loader: "sass-loader" // SCSS加载器，webpack默认使用node-sass进行编译
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(), //生成入口html文件
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }) //为抽取出的独立的CSS文件设置配置参数
  ],
  optimization: {
    // 对生成的CSS文件进行代码压缩 mode='production'时生效
    minimizer: [new OptimizeCssAssetsPlugin()]
  }
};
