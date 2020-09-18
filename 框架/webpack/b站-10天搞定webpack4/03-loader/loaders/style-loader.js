function loader(source) {
  // 在 style-loader 中导出一个脚本文件
  let str = `
    const style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `;
  return str;
}

module.exports = loader;
