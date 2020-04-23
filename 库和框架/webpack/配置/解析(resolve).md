# 解析[resolve]

**这些选项能设置模块如何被解析。webpack 提供合理的默认值，但是还是可能会修改一些解析的细节。**

```javascript
  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    // 用于查找模块的目录
    extensions: [".js", ".json", ".jsx", ".css"],
    // 使用的扩展名
    alias: {
      // 模块别名列表
      "module": "new-module",
      // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"
      "only-module$": "new-module",
      // 起别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"
      "module": path.resolve(__dirname, "app/third/module.js"),
      // 起别名 "module" -> "./app/third/module.js" 和 "module/file" 会导致错误
      // 模块别名相对于当前上下文导入
    },
    /* 可供选择的别名语法（点击展示） */
    alias: [
      {
        name: "module",
        // 旧的请求
        alias: "new-module",
        // 新的请求
        onlyModule: true
        // 如果为 true，只有 "module" 是别名
        // 如果为 false，"module/inner/path" 也是别名
      }
    ],
    /* 高级解析选项（点击展示） */
    symlinks: true,
    // 遵循符号链接(symlinks)到新位置
    descriptionFiles: ["package.json"],
    // 从 package 描述中读取的文件
    mainFields: ["main"],
    // 从描述文件中读取的属性
    // 当请求文件夹时
    aliasFields: ["browser"],
    // 从描述文件中读取的属性
    // 以对此 package 的请求起别名
    enforceExtension: false,
    // 如果为 true，请求必不包括扩展名
    // 如果为 false，请求可以包括扩展名
    moduleExtensions: ["-module"],
    enforceModuleExtension: false,
    // 类似 extensions/enforceExtension，但是用模块名替换文件
    unsafeCache: true,
    unsafeCache: {},
    // 为解析的请求启用缓存
    // 这是不安全，因为文件夹结构可能会改动
    // 但是性能改善是很大的
    cachePredicate: (path, request) => true,
    // predicate function which selects requests for caching
    plugins: [
      // ...
    ]
    // 应用于解析器的附加插件
  },
```



## resolve.extensions

`[string]: ['.wasm', '.mjs', '.js', '.json']`

自动解析确定该的扩展

**注意:使用此选项，会覆盖默认数组，这就意味着 webpack 将不再尝试使用默认扩展来解析模块**

```javascript
module.exports = {
  //...
  resolve: {
     // import xx from './xx' 查找文件时，自动查找数组中的后缀名文件
    extensions: ['.wasm', '.mjs', '.js', '.json']
  }
};
```



## resolve.mainFiles

`[string]: ['index']`

解析目录时要使用的文件名

```javascript
module.exports = {
  //...
  resolve: {
    // import xx from './xx/' 这样解析目录时，会去查找该目录下的index 和 test 文件。
    mainFiles: ['index', 'test']
  }
};
```



## resolve.alias

`object`

创建 import 或 require 的别名，来确保模块引入变得更简单(起别名)

```javascript
module.exports = {
  //...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/')
    }
  }
};
```

