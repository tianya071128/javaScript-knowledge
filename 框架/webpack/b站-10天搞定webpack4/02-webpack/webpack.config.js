const path = require("path");

class P {
  apply(compiler) {
    compiler.hooks.emit.tap("emit", function() {
      console.log("自定义钩子");
    });
  }
}

module.exports = {
  entry: "./src/index.js",
  output: {
    path: "dist",
    filename: "main.js"
  },
  plugins: [new P()]
};
