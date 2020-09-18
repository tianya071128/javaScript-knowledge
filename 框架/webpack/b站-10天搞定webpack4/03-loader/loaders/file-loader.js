const loaderUtils = require("loader-utils");

function loader(source) {
  const filename = loaderUtils.interpolateName(this, "[hash].[ext]", {
    content: source
  });

  this.emitFile(filename, source); // 发射文件
  return `module.exports="${filename}"`;
}
loader.raw = true; // 二进制

module.exports = loader;
