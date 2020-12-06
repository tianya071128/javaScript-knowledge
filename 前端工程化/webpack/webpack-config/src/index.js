// 代码分离
import(/* webpackChunkName: "chunkFile1" */ "./assets/chunkFile/chunkFile1.js");

// 测试加载图片
import test from "image/test.png";
import exclude from "image/exclude.png";

function createImg(src) {
  const img = document.createElement("img");
  img.src = src;
  document.body.appendChild(img);
}

// 测试 css
import "./assets/sass/test1";

createImg(test);
createImg(exclude);
console.log(test, exclude);

console.log($);
