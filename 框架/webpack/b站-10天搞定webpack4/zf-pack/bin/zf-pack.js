#! /usr/bin/env node

// 1) 需要找到当前执行名的路径 拿到配置文件 webpack.config.js
const path = require("path");
const config = require(path.resolve("webpack.config.js")); // 拿到配置对象
const Compiler = require("../lib/Compiler.js");
const compiler = new Compiler(config);
compiler.hooks.entryOption.call();

compiler.run(); // 启动编译
