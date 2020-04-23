# SplitChunks 插件

## 默认值

开箱即用 `SplitChunksPlugin` 对于大多数用户来说应该能很好的工作。

默认情况下，它仅影响按需 chunks，因为更改初始块会影响HTML文件应包含的脚本标签以运行项目。

webpack 将根据以下条件自动分割块：

* 可以共享新 chunks，或者模块来自 `node_modules` 文件夹。
* 新的块将大于 30 kb(在 min + gz 之前)
* 按需加载块时并行请求的最大数量将小于或等于 5
* 初始页面加载时并行请求的最大数量将小于或等于 3

当试图满足最后两个条件时，最好使用较大的 chunks



## 例子

### 默认值：示例1

```javascript
// index.js
import('./a'); // 动态(异步) import

// a.js
import 'react';
//...
```

**结果：将创建一个包含的单独块 `react`。在导入调用中，此块与包含的原始块并行加载 `./a`**

why？

* 条件1：该块包含来自以下模块 `node_modules`
* 条件2：`react` 大于 30 kb
* 条件3：导入调用中的并行请求数为 2
* 条件4：在初始页面加载时不影响请求

这背后的原因是什么？`react` 可能不会像您的应用程序代码那样频繁地更改。通过将其移动到单独的块中，可以将该块与应用程序代码分开进行缓存（假设您使用的是 chunkhash, records, Cache-Control或其他长期缓存方法）。



## 默认配置

```javascript
splitChunks: {
    // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
    chunks: "async",
    // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
    minSize: 30000,
    // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
    minChunks: 1,
    // 表示按需加载文件时，并行请求的最大数目。默认为5。
    maxAsyncRequests: 5,
    // 表示加载入口文件时，并行请求的最大数目。默认为3。
    maxInitialRequests: 3,
    // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
    automaticNameDelimiter: '~',
    // 设置chunk的文件名。默认为true。当为true时，splitChunks基于chunk和cacheGroups的key自动命名。
    name: true,
    // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块，就分配到该组。模块可以被多个组引用，但最终会根据priority来决定打包到哪个组中。默认将所有来自 node_modules目录的模块打包至vendors组，将两个以上的chunk所共享的模块打包至default组。
    cacheGroups: {
        vendors: {
            // 条件匹配
            test: /[\\/]node_modules[\\/]/,
            // 当命中多个时，根据 priority 权重优先级排序
            priority: -10
        },
        // 
    default: {
            minChunks: 2,
            priority: -20,
            // 如果当前模块已经被打包，则直接复用模块，而不是重新生成模块。
            reuseExistingChunk: true
        }
    }
}
```

以上配置，概括如下 4 个条件：

1. 模块在代码中被复用或来自 `node_modules` 文件夹；
2. 模块的体积大于等于 30kb(压缩之前)；
3. 当按需加载 chunks 时，并行请求的最大数量不能超过 5；
4. 初始页面加载时，并行请求的最大数量不能超过 3；