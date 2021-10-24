const { Buffer } = require("buffer");

/** 1. 字符串转 buffer */
// 通过 Buffer.from(str[, encoding]);
const buf = Buffer.from("测试一下 buffer"); // 不穿 encoding 默认为 utf8
console.log(buf); // <Buffer e6 b5 8b e8 af 95 e4 b8 80 e4 b8 8b 20 62 75 66 66 65 72>
// 可以通过 buf.write(string[, offset[, length]][, encoding]) 向 buf 中写入数据
buf.write("下一测试");
// 注意: 从测试中可得知, buffer 是一个具有固定大小的内存容器, 通过 write 写入只是在这块容器中操作的
console.log(buf.toString()); // 打印: 下一测试 buffer

/** 2. Buffer 转字符串 */
// 通过 buf.toString([encoding[, start[, end]]]) 方法转换
console.log(buf.toString()); // 下一测试 buffer


/** 3. Buffer 不支持的编码类型 */
// 不是所有的编码都能够支持, 如果不支持的编码就需要借助其他模块实现
// 通过 Buffer.isEncoding(encoding) 方法可以检查 Buffer 是否支持这种编码
console.log(Buffer.isEncoding('utf8')); // true
console.log(Buffer.isEncoding('win1251')); // false => 不支持的编码类型