function loader(source) {
  // loader 的参数就是源代码
  console.log("loader1~~");
  return source;
}

module.exports = loader;
