const fs = require("fs");
const path = require("path");
const babylon = require("babylon");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

class Compiler {
  constructor(config) {
    // entry output
    this.config = config; // 配置对象
    // 1. 确定入口文件
    this.entryId;
    // 2. 确定所有的依赖关系
    this.modules = {};
    this.entry = config.entry; // 入口路径
    this.root = process.cwd(); // 工作路径
  }
  // 解析源码
  parse(source, parentPath) {
    // 将源码解析成 AST
    const ast = babylon.parse(source);
    const dependencies = []; // 依赖的数组 - 用于递归解析模块
    // 处理 AST,
    traverse(ast, {
      CallExpression(p) {
        const node = p.node; // 对应的节点
        if (node.callee.name === "require") {
          node.callee.name = "__webpack_require__";
          let moduleName = node.arguments[0].value; // 取到的就是模块的引用名字
          moduleName = moduleName + (path.extname(moduleName) ? "" : ".js");
          moduleName = path.join(parentPath, moduleName); // 拿到模块路径

          dependencies.push(moduleName);

          node.arguments = [t.stringLiteral(moduleName)];
        }
      }
    });
    const sourceCode = generator(ast).code;
    return { sourceCode, dependencies };
  }
  // 获取模块内容
  getSource(modulePath) {
    const content = fs.readFileSync(modulePath, "utf8");
    return content;
  }
  // 构建模块
  buildModule(modulePath, isEntry) {
    // 拿到模块的内容
    let source = this.getSource(modulePath);
    // 模块id
    const moduleName = "./" + path.relative(this.root, modulePath);

    // 开始就需要将主入口文件执行
    if (isEntry) {
      this.entryId = moduleName; // 保存入口的名字
    }

    // 解析需要把 source 源码进行改造 返回一个依赖列表
    const { sourceCode, dependencies } = this.parse(
      source,
      path.dirname(moduleName)
    );
    // 把相对路径和模块中的内容对应起来
    this.modules[moduleName] = sourceCode;

    // 递归解析模块
    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root, dep), false);
    });
  }
  // 发射文件 - 打包后的文件
  emitFile() {
    // 输出目录
    const main = path.join(
      this.config.output.path,
      this.config.output.filename
    );

    fs.writeFileSync(main, JSON.stringify(this.modules));
  }
  // 开始运行方法
  run() {
    // 执行，并且创建模块的依赖关系
    this.buildModule(path.resolve(this.root, this.entry), true);
    // 发射一个文件 打包后的文件
    this.emitFile();
  }
}

module.exports = Compiler;
