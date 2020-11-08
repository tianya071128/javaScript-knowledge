import "@babel/polyfill";
import "./less/less01.less";
import img from "./img/01.png";
import vue from "vue";
import vueRouter from "vue-router";
import vuex from "vuex";
import test from './js/js01';

console.log("这是入口文件", "1111");

const Img = new Image();
Img.src = img;

document.body.appendChild(Img);

class A {
  constructor() {}
}

Promise.resolve(2).then(console.log);

document.body.onclick = function() {
  import(/* webpackChunkName: "chunk01" */ "./chunk/chunk01");
  import(/* webpackChunkName: "chunk02" */ "./chunk/chunk02");
  // import(/* webpackChunkName: "js01" */ "./js/js01.js");
};

console.log(vue, vueRouter, vuex, test(1, 2, 1, 3));
