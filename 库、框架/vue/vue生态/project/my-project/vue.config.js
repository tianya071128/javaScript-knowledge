const path = require("path");
// 返回相对于当前上下文目录的绝对路径
const resolve = dir => path.join(__dirname, dir);
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV); // 是否为生产环境


const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 压缩插件
const vConsolePlugin = require('vconsole-webpack-plugin'); // console 插件

// 添加打包分析
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  publicPath: "./", // 默认'/'，部署应用包时的基本 URL
  outputDir: process.env.outputDir || "dist", // 'dist', 生产环境构建文件的目录
  assetsDir: "", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: !IS_PROD, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  // 是一个函数, 允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    config.resolve.alias.set("@", resolve("src"));

    // 添加 cdn
    const cdn = {
      // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
      css: ["//unpkg.com/element-ui@2.10.1/lib/theme-chalk/index.css"],
      js: [
        "//unpkg.com/vue@2.6.10/dist/vue.min.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
        "//unpkg.com/vue-router@3.0.6/dist/vue-router.min.js",
        "//unpkg.com/vuex@3.1.1/dist/vuex.min.js",
        "//unpkg.com/axios@0.19.0/dist/axios.min.js",
        "//unpkg.com/element-ui@2.10.1/lib/index.js"
      ]
    };

    // html中添加cdn
    config.plugin("html").tap(args => {
      args[0].cdn = cdn;
      return args;
    });

    // 判断是否为打包分析命令
    if (process.env.IS_ANALYZ) {
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "static"
        }
      ]);
    }

    // 添加 svg 组件
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.exclude.add(/node_modules/);
    svgRule
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });

    const imagesRule = config.module.rule("images");
    imagesRule.exclude.add(resolve("src/icons"));
    config.module.rule("images").test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
  },
  // function | object
  // function: 则会接收被解析的配置作为参数。该函数既可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
  // object: 会通过 webpack-merge 合并到最终的配置中。
  configureWebpack: config => {
    // 去掉 console.log
    const plugins = [];

    // 判断是否为生产环境
    if (IS_PROD) {
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ["console.log"] //移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
    }

    // 测试环境
    if (process.env.IS_TEST) {
      plugins.push(new vConsolePlugin({
        enable: true // 发布代码前记得改回 false
      }))
    }

    config.externals = {
      vue: "Vue",
      "element-ui": "ELEMENT",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios"
    };

    config.plugins = [...config.plugins, ...plugins];
  }
};
