/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-23 10:29:39
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-23 15:24:57
 */
const { mkdir, writeFile, stat } = require("fs").promises;
const path = require("path");

const fileData = [
  {
    name: "file2",
    dir: true,
    children: [
      {
        name: "test01",
      },
      {
        name: "test02",
        dir: true,
      },
      {
        name: "test03",
      },
      {
        name: "test04",
        dir: true,
        children: [
          {
            name: "test01",
          },
          {
            name: "test02",
            dir: true,
            children: [
              {
                name: "test01",
              },
            ],
          },
        ],
      },
    ],
  },
];

async function init(pathStr) {
  if (typeof pathStr !== "string") {
    throw new TypeError("类型错误: 请输入字符串");
  }

  // 我们需要确保传入的路径是存在的, 如果不存在则创建
  const tatolPath = path.resolve(__dirname, pathStr);
  const pathList = tatolPath.split(path.sep);
  let _i = 0;
  let mkdirPath = "";

  // 找出不存在路径在第几级
  for (let i = 0; i < pathList.length; i++) {
    const dirPath = path.resolve(tatolPath, Array(i).fill("..").join("/"));
    // 判断该路径是否存在
    try {
      const stats = await stat(dirPath);
      if (!stats.isFile()) {
        _i = i;
        mkdirPath = dirPath;
        break;
      }
    } catch (e) {}
  }

  // 为不存在的路径补全
  if (_i !== 0) {
    for (let i = _i; i > 0; i--) {
      mkdirPath = path.resolve(mkdirPath, pathList[pathList.length - i]);
      await mkdir(mkdirPath);
    }
  }

  // 递归创建文件(夹)
  async function mkdirOrFile(fileChildren, basePath) {
    for (const { name, dir, children } of fileChildren) {
      const pathStr = path.resolve(basePath, name);
      // 如果是文件夹
      if (dir) {
        await mkdir(pathStr);
        children && mkdirOrFile(children, pathStr);
      } else {
        writeFile(pathStr, "测试一下");
      }
    }
  }

  mkdirOrFile(fileData, tatolPath);
}

try {
  init("./");
} catch (e) {
  console.log("错误信息", e);
}
