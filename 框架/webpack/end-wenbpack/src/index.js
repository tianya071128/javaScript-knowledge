import "./less/less01.less";
import img from "./img/01.png";
import vue from "vue";
import vueRouter from "vue-router";
import vuex from "vuex";

console.log("这是入口文件");

const Img = new Image();
Img.src = img;

document.body.appendChild(Img);

class A {
  constructor() {}
}

console.log(vue, vueRouter, vuex);
