const fs = require("fs");

/** 直接通过 += 拼接 */
const rs = fs.createReadStream("test.md", { highWaterMark: 11 });
rs.setEncoding("utf8"); // 设置编码为 utf8 => 这种也只能处理 UTF-8、Base64和UCS-2/UTF-16LE 等编码类型
let data = "";
rs.on("data", function (chunk) {
  data += chunk; // data += chunk => 会隐式调用 data = data.toString() + chunk.toString()
});
rs.on("end", function () {
  // 乱码? => 因为这个读取流设置 highWaterMark: 11, 每个 chunk 是 11 字节, 而中文是宽字符, 所以会出现乱码现象
  // console.log(data); // 如果没有设置 setEncoding 时, 打印: 床前明��光，疑���地上霜；举头��明月，���头思故乡。
  console.log(data); // 床前明月光，疑是地上霜；举头望明月，低头思故乡。
});

/** 最佳实践, 通过 buffer.concat() 方法拼接成完整的 buffer */
const res = fs.createReadStream("test.md", { highWaterMark: 11 });
let chunks = [];
let size = 0;
res.on("data", function (chunk) {
  chunks.push(chunk); // 将所有的 chunk 存储到 chunks 中
  size += chunk.length;
});
res.on("end", function () {
  var buf = Buffer.concat(chunks, size);
  console.log(buf.toString('utf8')); // 床前明月光，疑是地上霜；举头望明月，低头思故乡。
});
