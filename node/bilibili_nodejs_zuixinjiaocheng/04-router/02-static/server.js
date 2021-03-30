const http = require('http');
const path = require('path');
const fs = require('fs').promises;

const mime = require('mime');

async function myReadFile(file) {
  try {
    const p = await fs.readFile(file);
    return p;
  } catch (err) {
    return '没有找到这样的文件'
  }
}

async function readStaticFile(filePathName) {
  const mimeType = mime.getType(path.parse(filePathName).ext) || 'text/html'; // 获取文件类型
  let data = null;
  let stat = false;
  try {
    await fs.access(filePathName);
    stat = true;
  } catch (e) { };

  if (stat) {
    // 此时文件或文件夹存在
    if (mimeType) {
      // 此时表示为文件
      data = await myReadFile(filePathName);
    } else {
      // 如果是文件夹的话, 那么就返回文件夹下的 index.html
      data = await myReadFile(path.join(filePathName, './index.html'))
    }
  } else {
    data = 'file not found';
  }

  return {
    mimeType,
    data,
  }
}

http.createServer(async (req, res) => {
  let urlString = req.url;
  let filePathName = path.join(__dirname, './public', urlString);

  const { data, mimeType } = await readStaticFile(filePathName);
  res.writeHead(200, {
    'content-type': `${mimeType};charset=utf-8`,
  })

  res.write(data);
  res.end();
}).listen(8080, () => {
  console.log('localhost:8080...');
})