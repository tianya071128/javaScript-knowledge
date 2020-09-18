const loaderUtils = require("loader-utils");
const mime = require("mime");
const validateOptions = require("schema-utils");
const fs = require("fs");

function loader(source) {
  const { limit } = loaderUtils.getOptions(this);
  if (limit && limit > source.length) {
    return `module.exports="data: ${mime.getType(
      this.resourcePath
    )};base64,${source.toString("base64")}"`;
  } else {
    return require("./file-loader").call(this, source); // 在 loader 中调用其他 loader
  }
}

loader.raw = true;

module.exports = loader;
