const { Buffer } = require("buffer"); // 虽然 Buffer 可以全局使用, 但推荐使用 require 引用
/** 1. buffer 的创建 */

/**
 * 1.1 Buffer.alloc(size[, fill[, encoding]]): 分配 size 个字节的新 Buffer。 如果 fill 为 undefined，则 Buffer 将以零填充。
 *  size: 新的 Buffer 所需的长度。
 *  fill: 用于预填充新 Buffer 的值。 => 默认为 0
 *  encoding: 如果 fill 是字符串，则这就是它的编码。 => 默认为 utf8
 * 注意: Buffer.alloc 可确保新创建的 Buffer 实例的内容永远不会包含来自先前分配的敏感数据，包括可能尚未分配给 Buffer 的数据。
 */
const buf01 = Buffer.alloc(5, "a"); // 如果指定了 fill 或 encoding, 那么内部会通过 Buffer.fill() 方法进行 buffer 的填充
console.log(buf01); // <Buffer 61 61 61 61 61>

/**
 * 1.2 Buffer.allocUnsafe(size): 分配 size 个字节的新 Buffer。
 *  size: 新的 Buffer 所需的长度。
 * 注意: 这个 Buffer 分配的内存是没有初始化的, 因此可能是包含敏感的旧数据, 因此可以使用 Buffer.fill 来初始化
 */
const buf02 = Buffer.allocUnsafe(10);
console.log(buf02); // <Buffer 04 12 23 55 22 12 00 00 00 22>
buf02.fill(0);
console.log(buf02); // <Buffer 00 00 00 00 00 00 00 00 00 00>

/**
 * 1.3 Buffer.form(): 根据参数不同, 作用也不同
 *  1.3.1 Buffer.form(array): 使用 0 – 255 范围内的字节 array 分配新的 Buffer。 该范围之外的数组条目将被截断以符合它。
 *  1.3.2 Buffer.form(buffer): 将传入的 buffer 数据复制到新的 Buffer 实例上。
 *  1.3.3 Buffer.from(string[, encoding]): 创建包含 string 的新 Buffer。encoding 参数标识将 string 转换为字节时要使用的字符编码。
 *  1.3.4 Buffer.from(object[, offsetOrEncoding[, length]]): 支持 Symbol.toPrimitive 或 valueOf() 的对象。
 */
const buf4 = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
console.log(buf4); // <Buffer 62 75 66 66 65 72>
const buf5 = Buffer.from(buf4);
console.log(buf5); // <Buffer 62 75 66 66 65 72> => 与传入的 buf4 数据一致
const buf6 = Buffer.from("this is a tést");
console.log(buf6); // <Buffer 74 68 69 73 20 69 73 20 61 20 74 c3 a9 73 74>
/**
 * 1.3.5 Buffer.from(arrayBuffer[, byteOffset[, length]]): 这将创建 ArrayBuffer 的视图，而无需复制底层内存。
 *  arrayBuffer <ArrayBuffer> | <SharedArrayBuffer> ArrayBuffer、SharedArrayBuffer，例如 TypedArray 的 .buffer 属性。
 *  byteOffset <integer> 要暴露的第一个字节的索引。 默认值: 0。
 *  length <integer> 要暴露的字节数。 默认值: arrayBuffer.byteLength - byteOffset。
 */
const arr = new Uint16Array(2);
arr[0] = 5000;
arr[1] = 4000;const buf = Buffer.from(arr.buffer);
const buf7 = Buffer.from(arr.buffer); // 与 `arr` 共享内存。
console.log(buf7); // <Buffer 88 13 a0 0f>
arr[1] = 6000; // 更改原始的 Uint16Array 也会更改缓冲区。
console.log(buf7); // <Buffer 88 13 70 17>