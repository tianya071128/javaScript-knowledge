/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-13 10:40:11
 * @LastEditTime: 2020-04-21 11:07:26
 */
const webpack = require("webpack");
const path = require("path");

const devConfig = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    // contentBase
    // 默认打开浏览器
    open: false,
    // 开启 HMR
    hot: true,
    hotOnly: true
  },
  module: {
    rules: [
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
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    filename: "[name].js",
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: ""
  }
};

module.exports = devConfig;
