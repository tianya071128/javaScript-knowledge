/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-13 11:02:13
 * @LastEditTime: 2020-04-13 15:46:17
 */
import avatar from "./icon.jpg";
import "./index.scss";

// var img = new Image();
// img.src = avatar;

let img = document.createElement("div");
img.classList.add("avatar");

var root = document.getElementById("root");
root.appendChild(img);
