const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
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
  }
};
