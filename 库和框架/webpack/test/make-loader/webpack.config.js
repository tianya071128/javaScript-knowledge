/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-23 20:19:26
 * @LastEditTime: 2020-04-23 20:28:52
 */
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, "./loaders/replaceLoader.js"),
            options: {
              name: "lee"
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  }
};
