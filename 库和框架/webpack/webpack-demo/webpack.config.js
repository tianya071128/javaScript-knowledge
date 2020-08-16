const path = require("path");
// 构建 html 文件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 清除 /dist 文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js"
  },
  devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      // 处理 CSS
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      // 处理图片
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images/"
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: "./dist",
    hot: true // 开启热更新(HMR)
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "test",
      window: {
        env: {
          apiHost: "http://myapi.com/api/v1"
        }
      }
    }),
    // 模块热替换
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
