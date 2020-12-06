const path = require("path");
// html 插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 清空打包文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "../"),
  entry: {
    main: "./src/index.js",
    main2: "./src/index01.js"
  }, // 入口文件
  output: {
    filename: "[name].js", // 打包后的文件名称
    path: path.resolve(__dirname, "../dist") // 打包后的目录，必须是绝对路径
  },
  resolve: {
    // 别名
    alias: {
      $: "./src/jquery.js"
    },
    // 省略后缀
    extensions: [".js", ".json", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        },
        include: /src/, // 只转化src目录下的js
        exclude: /node_modules/ // 排除掉node_modules，优化打包速度
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 1 * 1024,
            outputPath: "images/"
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // 模板文件
      title: "end-webpack", // 用于生成的HTML文档的标题
      filename: "index.html", // 写入HTML的文件。默认为index.html。您可以在这里指定一个子目录太（如：assets/admin.html）
      favicon: path.resolve(__dirname, "../public/favicon.ico") // 将给定的图标图标路径添加到输出HTML
    })
  ]
};
