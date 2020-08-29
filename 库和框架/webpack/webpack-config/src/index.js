// 代码分离
import(/* webpackChunkName: "chunkFile1" */ "./assets/chunkFile/chunkFile1.js");

// 测试加载图片
import test from "./assets/image/test.png";
import exclude from "./assets/image/exclude.png";

function createImg(src) {
  const img = document.createElement("img");
  img.src = src;
  document.body.appendChild(img);
}

createImg(test);
createImg(exclude);
console.log(test, exclude);
