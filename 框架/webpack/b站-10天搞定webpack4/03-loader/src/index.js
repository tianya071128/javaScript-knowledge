class A {
  constructor() {}
}

const a = new A();

import p from "./01.png";
const img = document.createElement("img");
img.src = p;
document.body.appendChild(img);
