# 输出[output]

`output` 指示 webpack 如何去输出、以及在哪里输出你的 [bundle、asset 和 其他你所打包或使用 webpack 载入的任何内容]。

```javascript
  output: {
    // webpack 如何输出结果的相关选项
    path: path.resolve(__dirname, "dist"), // string
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    filename: "bundle.js", // string
    filename: "[name].js", // 用于多个入口点(entry point)（出口点？）
    filename: "[chunkhash].js", // 用于长效缓存
    // 「入口分块(entry chunk)」的文件名模板
    publicPath: "/assets/", // string
    publicPath: "",
    publicPath: "https://cdn.example.com/",
    // 输出解析文件的目录，url 相对于 HTML 页面
    library: "MyLibrary", // string,
    // 导出库(exported library)的名称
    libraryTarget: "umd", // 通用模块定义
        libraryTarget: "umd2", // 通用模块定义
        libraryTarget: "commonjs2", // exported with module.exports
        libraryTarget: "commonjs", // 作为 exports 的属性导出
        libraryTarget: "amd", // 使用 AMD 定义方法来定义
        libraryTarget: "this", // 在 this 上设置属性
        libraryTarget: "var", // 变量定义于根作用域下
        libraryTarget: "assign", // 盲分配(blind assignment)
        libraryTarget: "window", // 在 window 对象上设置属性
        libraryTarget: "global", // property set to global object
        libraryTarget: "jsonp", // jsonp wrapper
    // 导出库(exported library)的类型
    /* 高级输出配置（点击显示） */
    pathinfo: true, // boolean
    // 在生成代码时，引入相关的模块、导出、请求等有帮助的路径信息。
    chunkFilename: "[id].js",
    chunkFilename: "[chunkhash].js", // 长效缓存(/guides/caching)
    // 「附加分块(additional chunk)」的文件名模板
    jsonpFunction: "myWebpackJsonp", // string
    // 用于加载分块的 JSONP 函数名
    sourceMapFilename: "[file].map", // string
    sourceMapFilename: "sourcemaps/[file].map", // string
    // 「source map 位置」的文件名模板
    devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
    // 「devtool 中模块」的文件名模板
    devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string
    // 「devtool 中模块」的文件名模板（用于冲突）
    umdNamedDefine: true, // boolean
    // 在 UMD 库中使用命名的 AMD 模块
    crossOriginLoading: "use-credentials", // 枚举
    crossOriginLoading: "anonymous",
    crossOriginLoading: false,
    // 指定运行时如何发出跨域请求问题
    /* 专家级输出配置（自行承担风险） */
    devtoolLineToLine: {
      test: /\.jsx$/
    },
    // 为这些模块使用 1:1 映射 SourceMaps（快速）
    hotUpdateMainFilename: "[hash].hot-update.json", // string
    // 「HMR 清单」的文件名模板
    hotUpdateChunkFilename: "[id].[hash].hot-update.js", // string
    // 「HMR 分块」的文件名模板
    sourcePrefix: "\t", // string
    // 包内前置式模块资源具有更好可读性
  },
```



## 1. output.path

`string`

output 目录对应一个绝对路径。

```javascript
module.exports = {
    //...
    output: {
        path: path.resolve(__dirname, 'dist/assets')
    }
}
```



## 2. output.filename

`string function`

**此选项决定了每个输出 bundle 的名称。**这些 bundle 将写入到 output.path 选项指定的目录下。

**注意：此选项不会影响那些「按需加载 chunk」的输出文件。对于这些文件，请使用 [`output.chunkFilename`](https://webpack.docschina.org/configuration/output/#output-chunkfilename) 选项来控制输出。通过 loader 创建的文件也不受影响。在这种情况下，你必须尝试 loader 特定的可用选项。**

* 对于单个入口起点，filename 会是一个静态名称。

  ```javascript
  module.exports = {
      //...
      output: {
          filename: 'bundle.js'
      }
  }
  ```

* 通过多个入口起点(entry point)、代码拆分(code splitting)或各种插件(plugin)创建多个 bundle，应该使用以下一种替换方式，来赋予每个 bundle 一个唯一的名称....

  * 使用入口名称

    ```javascript
    module.exports = {
        //...
        output: {
            filename: '[name].bundle.js'
        }
    }
    ```

  * 使用内部 chunk id

    ```javascript
    module.exports = {
        //...
        output: {
            filename: '[id].bundle.js'
        }
    }
    ```

  * 使用每次构建过程中，唯一的 hash 生成

    ```javascript
    module.exports = {
        //...
        output: {
            filename: '[name].[hash].bundle.js'
        }
    }
    ```

  * 使用基于每个 chunk 内容的 hash：

    ```javascript
    module.exports = {
        //...
        output: {
            filename: '[chunkhash].bundle.js'
        }
    }
    ```

  * 使用函数

    ```javascript
    module.exports = {
      //...
      output: {
        filename: (chunkData) => {
          return chunkData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
        },
      }
    };
    ```

    >| 模板        | 描述                                             |
    >| ----------- | ------------------------------------------------ |
    >| [hash]      | 模块标识符(module identifier)的 hash             |
    >| [chunkhash] | chunk 内容的 hash                                |
    >| [name]      | 模块名称                                         |
    >| [id]        | 模块标识符(module identifier)                    |
    >| [query]     | 模块的 query，例如，文件名 `?` 后面的字符串      |
    >| [function]  | The function, which can return filename [string] |
    >
    >`[hash]` 和 `[chunkhash]` 的长度可以使用 `[hash:16]`（默认为20）来指定。或者，通过指定[`output.hashDigestLength`](https://webpack.docschina.org/configuration/output/#output-hashdigestlength) 在全局配置长度。
    >
    >如果将这个选项设为一个函数，函数将返回一个包含上面表格中替换信息的对象。



## 3. output.publicPath

`stinrg: ''` `function`

对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。

```javascript
module.exports = {
  //...
  output: {
    // One of the below
    publicPath: 'https://cdn.example.com/assets/', // CDN（总是 HTTPS 协议）
    publicPath: '//cdn.example.com/assets/', // CDN（协议相同）
    publicPath: '/assets/', // 相对于服务(server-relative)
    publicPath: 'assets/', // 相对于 HTML 页面
    publicPath: '../assets/', // 相对于 HTML 页面
    publicPath: '', // 相对于 HTML 页面（目录相同）
  }
};
```



## 4. output.chunkFilename

`string`

此选项决定了非入口(non-entry) chunk 文件的名称。与 output.filename 选项类似

注意，这些文件名需要在 runtime 根据 chunk 发送的请求去生成。因此，需要在 webpack runtime 输出 bundle 值时，将 chunk id 的值对应映射到占位符(如 `[name]` 和 `[chunkhash]`)。这会增加文件大小，并且在任何 chunk 的占位符值修改后，都会使 bundle 失效。

默认使用 `[id].js` 或从 [`output.filename`](https://webpack.docschina.org/configuration/output/#output-filename) 中推断出的值（`[name]` 会被预先替换为 `[id]` 或 `[id].`）。



## 5. output.library

`string | object` （从 webpack 3.1.0 开始：此配置项用于 libraryTarget: 'umd'）

output.library 的值的作用，取决于 output.libraryTarget 选项的值；

> *有关* `output.library` *以及* `output.libraryTarget` *详细信息，请查看*[创建 library 指南](https://webpack.docschina.org/guides/author-libraries)

> ***注意，如果将*`数组`*作为* `entry`*，那么只会暴露数组中的最后一个模块。如果将*`对象`*作为* `entry`*，还可以使用* `array` *语法暴露（具体查看*[这个示例](https://github.com/webpack/webpack/tree/master/examples/multi-part-library) *for details)）。***



## 6. output.libraryTarget

`string: 'var'`

配置如何暴露 library。可以使用下面的选项中的任意一个。注意，此选项与分配给 `output.library` 的值一同使用。

