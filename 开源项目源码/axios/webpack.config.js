/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2019-12-18 21:29:18
 * @LastEditTime: 2019-12-20 21:37:37
 */
var webpack = require('webpack');
var config = {};

function generateConfig(name) {
  var uglify = name.indexOf('min') > -1;
  var config = {
    // 入口文件
    entry: './index.js',
    output: {
      path: 'dist/',
      filename: name + '.js',
      sourceMapFilename: name + '.map',
      library: 'axios',
      libraryTarget: 'umd'
    },
    node: {
      process: false
    },
    devtool: 'source-map'
  };

  config.plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ];

  if (uglify) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    );
  }

  return config;
}

['axios', 'axios.min'].forEach(function(key) {
  config[key] = generateConfig(key);
});

module.exports = config;
