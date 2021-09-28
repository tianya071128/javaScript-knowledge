/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-26 10:02:55
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-26 10:08:08
 */
const { open } = require("fs").promises;

/**
 * fsPromise.open(path, flags[, mode]): 打开 <FileHandle> 文件流
 *  * flags <string> | <number> 请参阅对文件系统 flags 的支持。 默认值: 'r'。
 *  * mode <string> | <integer> 如果创建文件，则设置文件模式（权限和粘性位）。 默认值: 0o666 （可读可写）
 */
async function test01() {
  try {
    const dir = await open("./file/05.txt");
    console.log(dir);
    
  } catch (err) {
    console.error(err);
  }
}

test01();
