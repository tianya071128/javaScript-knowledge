const fs = require('fs');
const { appendFile, readFile, unlink, writeFile, rename, copyFile, stat } =
  fs.promises;
/**
 * 追加写入文件 - 这个不会替换掉文件
 * fsPromises.appendFile(path, data[, options]): 将数据追加到文件中, 如果文件不存在, 那么就创建文件
 *  path: 路径
 *  data: 数据
 *  options: <string> | <Object>: 可指定编码集, 以及其他配置
 * 注意: 如果文件夹不存在的话, 不会自动创建文件夹
 *
 * 写入文件 - 会整体替换文件内容
 * fsPromise.writeFile(file, data[, options]): 参数类似
 */
async function appen(...args) {
  try {
    await appendFile(...args);
    // await writeFile(...args); // 会替换掉写入的内容
    console.log('成功');
  } catch (e) {
    console.log('失败', e);
  }
}

// appen('file/02.txt', '测试一下写入文件\n');

/**
 * 读取文件
 * fsPromise.readFile(path[, options])
 *  path: 路径
 *  options: <string> | <Object>: 可指定编码集, 以及其他配置, 若没有指定编码, 默认返回 <Buffer>
 */
async function read(...args) {
  try {
    const data = await readFile(...args);
    console.log('读取成功', data);
  } catch (e) {
    console.log('读取失败', e);
  }
}

// read('file/02.txt', 'utf-8');

/**
 * 删除文件 - 如果 path 是一个符号链接, 则删除则个符号链接
 * fsPromise.unlink(path)
 */
async function deleteFile(...args) {
  try {
    await unlink(...args);
    console.log('删除成功');
  } catch (e) {
    console.log('删除失败', e);
  }
}

// deleteFile('./file2/test.js');

/**
 * 复制文件 - 默认情况下, 如果 dest 目标文件名存在, 则会对其进行覆盖. 不能复制文件夹
 * fsPromise.copyFile(src, dest[, mode])
 */
async function copy(...args) {
  try {
    await copyFile(...args);
    console.log('复制成功');
  } catch (e) {
    console.log('复制失败', e);
  }
}
// copy('file/03.txt', 'file/04.txt');

/**
 * 修改目录或文件名
 * fsPromise.rename(oldPath, newPath)
 */
async function xiugai(...args) {
  try {
    await rename(...args);
    console.log('修改成功');
  } catch (e) {
    console.log('修改失败', e);
  }
}
// xiugai('file/03.js', 'file/03.txt');

/**
 * 查看文件信息 - 返回 fs.Stats 类
 * fsPromise.stat(path[, options])
 */
async function view(...args) {
  try {
    const stats = await stat(...args);
    console.log('查看成功', stats);
  } catch (e) {
    console.log('查看失败', e); // 如果不存在, 则会报错
  }
}
view('file/03.txt');
