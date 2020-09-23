import "./less/less01.less";
import img from "./img/01.png";

console.log("这是入口文件 123456");

const Img = new Image();
Img.src = img;

document.body.appendChild(Img);

class A {
  constructor() {}
}
