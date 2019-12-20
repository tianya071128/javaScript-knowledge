## 目录树

从 git clone 项目后, 目录树结构(大致结构)

| -- dist

| -- examples

| -- lib

| -- sandbox

| -- test

| - webpack.config.js

| - index.js

...



## webpack.config.js

对于 webpack 只了解一点, 但可以找到入口文件'./index.js'

```javascript
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
```



## index.js

