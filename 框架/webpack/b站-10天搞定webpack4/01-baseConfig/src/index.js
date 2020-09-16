import "./assets/module/module01.js";
import "./assets/css/css01.css";
import "@babel/polyfill";
import "./assets/img/01.png";

console.log(1);

let fn = () => {
  console.log("fn");
};
fn();

class A {
  a = 1;
}

let a = new A();

console.log(a.a);

"aaa".includes("a");

console.log(DEV);
