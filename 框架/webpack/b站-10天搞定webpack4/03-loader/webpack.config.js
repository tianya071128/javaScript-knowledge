const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "dist")
  },
  resolveLoader: {
    // 查找 loader 的目录
    modules: ["node_modules", path.resolve(__dirname, "loaders")]
  },
  devtool: "source-map",
  module: {
    // loader 的顺序问题，从右到左，从下到上
    // loader 的分类：pre(在前面的) | post(后面) | normal(正常)
    // loader 的顺序：pre
    rules: [
      {
        test: /\.less/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.png$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 1 * 1024
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: "banner-loader",
          options: {
            text: "江西",
            filename: path.resolve(__dirname, "banner.js")
          }
        }
      }
      // {
      //   test: /\.js/,
      //   use: {
      //     loader: "babel-loader"
      //   }
      // }
    ]
  }
};
