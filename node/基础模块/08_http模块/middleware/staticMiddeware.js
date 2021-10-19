/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-10-19 09:10:16
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-10-19 15:01:54
 */
const { access, readFile, stat } = require("fs").promises;
const { cwd } = require("process");
const path = require("path");
const { createHash } = require("crypto");
var mime = require("mime-types");
// {
//   path: '/public/index.html',
//   query: {},
//   method: 'get',
//   ip: '::1',
//   port: 55573
// }
// 我们做一个很简单的静态资源, 资源目录: /public, 强缓存 60s

// 生成文件内容 ETag - 用于对比文件内容 ETag 是否一致
const getHash = function (str) {
  const shasum = createHash("sha1");
  return shasum.update(str).digest("base64");
};
module.exports = function staticMiddeware(ctx) {
  return new Promise(async (resolve, reject) => {
    const { req, res, path: urlPath, method } = ctx;
    // 如果不是 GET 请求, 退出
    if (method !== "get") return resolve();
    // 如果路径不是访问 /pulic, 退出
    if (urlPath.indexOf("/public") !== 0) return resolve();

    let filePath = path.normalize(path.join(cwd(), urlPath));
    // 先读取一下文件内容, 如果文件读取失败, 那么就由后面的去判断, 一般来说通过 access 判断后, 读取不会失败
    let fileData = null;

    // 判断一下这个文件是否存在
    try {
      await access(filePath);
    } catch (e) {
      // 不存在这个文件, 直接退出
      return resolve();
    }

    // 读取文件内容
    try {
      fileData = await readFile(filePath);
    } catch {
      return resolve();
    }

    // 文件的 ETag
    let fileTag = getHash(fileData);
    // 文件信息
    const fileStat = await stat(filePath);
    // 文件的最后修改日期
    let fileModifyDate = fileStat.mtime.toUTCString();
    // 文件 mime
    let fileType = mime.lookup(filePath) || "application/octet-stream";

    // 接下来检测一下是否需要协商缓存
    const reqEtag = ctx.getHeader("if-none-match");
    // 通过 ETag 来检查缓存是否新鲜
    if (reqEtag) {
      // 判断 ETag 是否一致
      if (fileTag === reqEtag) {
        console.log('进入了缓存请求');
        // 注意注意: 在浏览器上的地址栏上输入 url, 会强制请求过来, 并且状态码就算返回了 304, 还是会显示 200,
        res.writeHead(304, "Not Modified", {
          "Cache-Control": "max-age=60",
          "ETag": fileTag
        });
        res.end();
        return reject("后续不要执行了");
      }
    }

    // 如果 ETage 不存在, 但是 if-modified-since 存在, 根据文件修改日期来判断缓存
    const reqModifyDate = ctx.getHeader("if-modified-since");
    if (!reqEtag && reqModifyDate) {
      // 如果日期一致, 表示没有修改, 返回 304
      if (fileModifyDate === reqModifyDate) {
        res.writeHead(304, "Not Modified");
        res.end();
        return reject("后续不要执行了");
      }
    }

    // 如果都不满足, 那么就需要响应 200 过去了
    res.setHeader("Content-Type", fileType);
    res.setHeader("Content-Length", fileData.length);
    res.setHeader("Cache-Control", "max-age=60");
    res.setHeader("ETag", fileTag);
    res.end(fileData);

    reject("后面就不要执行了");
  });
};
