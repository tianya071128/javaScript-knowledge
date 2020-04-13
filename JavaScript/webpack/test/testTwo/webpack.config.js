/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-13 10:40:11
 * @LastEditTime: 2020-04-13 22:26:38
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: ["./src/index.js"],
  output: {
    filename: "dist.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: ""
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          // loader 的配置项
          options: {
            // 打包文件名称
            // [name]: 图片原本的名字 | [hash]: 文件 hash 值 | [ext]：文件后缀
            name: "[name]_[hash].[ext]",
            // 导出文件夹
            outputPath: "images/",
            limit: 2400
          }
        }
      },
      {
        test: /\.(eot|ttf|svg)$/,
        loader: "file-loader"
      },
      {
        test: /\.scss$/,
        // loader执行顺序：从下到上，从右到左
        use: [
          // 将 JS 字符串生成为 style 节点
          "style-loader",
          // 将 CSS 转化成 CommonJS 模块
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              // url: 是否对 url() 进行资源上的处理。默认值：true
              // false：将url(路径)原样输出，url("./icon.jpg") => url("./icon.jpg")
              // true：将url(路径)进行路径编译，url("./icon.jpg") => url(images/icon_822166a….jpg)
              // Function：返回布尔值
              url: (url, resourcePath) => {
                console.log(url, resourcePath);

                return url.includes(".jpg");
              },
              // 与 url 类似，控制 @import 路径问题
              import: true
            }
          },
          "sass-loader", // 将 Sass 编译成 CSS，默认使用 Node Sass
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 定义模板文件
      template: "./index.html",
      title: "webpack"
    }),
    new CleanWebpackPlugin()
  ]
};
