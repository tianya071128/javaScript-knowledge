const babel = require("@babel/core");
const loaderUtils = require("loader-utils");

function loader(source) {
  const options = loaderUtils.getOptions(this); // 获取 optinos - loader 参数
  let cb = this.async(); // 标识异步

  babel.transform(
    source,
    {
      ...options,
      sourceMap: true,
      filename: this.resourePath
    },
    function(err, result) {
      console.log(result.code);
      cb(err, result.code, result.map);
    }
  );
}

module.exports = loader;
