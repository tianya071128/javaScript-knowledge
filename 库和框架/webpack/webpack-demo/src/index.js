import "./assets/css/style.css";

import imageUrl from "./assets/image/01.png";
import printMe from "./print.js";
import(/* webpackChunkName: "math" */ "./math.js");

import("./math");

console.log(imageUrl);
console.log(printMe);
