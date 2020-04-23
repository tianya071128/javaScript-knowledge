# devtool[source-map]

此选项控制是否生成，以及如何生成 source map。

使用 [`SourceMapDevToolPlugin`](https://webpack.docschina.org/plugins/source-map-dev-tool-plugin) (插件) 进行更细粒度的配置。查看 [`source-map-loader`](https://webpack.docschina.org/loaders/source-map-loader) 来处理已有的 source map。

```javascript
devtool: "source-map", // enum
  devtool: "inline-source-map", // 嵌入到源文件中
  devtool: "eval-source-map", // 将 SourceMap 嵌入到每个模块中
  devtool: "hidden-source-map", // SourceMap 不在源文件中引用
  devtool: "cheap-source-map", // 没有模块映射(module mappings)的 SourceMap 低级变体(cheap-variant)
  devtool: "cheap-module-source-map", // 有模块映射(module mappings)的 SourceMap 低级变体
  devtool: "eval", // 没有模块映射，而是命名模块。以牺牲细节达到最快。
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // 牺牲了构建速度的 `source-map' 是最详细的。
```



## devtool

`string` `false`

选择一种 suorce map 格式来增强调试过程。不同的值会明显影响到构建(build)和重新构建(rebuild)的速度。

> **你可以直接使用 SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin 来替代使用 devtool 选项，因为它有更多的选项。切勿同时使用 devtool 选项和 SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin 插件。devtool 选项在内部添加过这些插件，所以你最终将应用两次插件。**

具体配置值见文档