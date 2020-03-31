/*
 * @Descripttion: 测试渲染器
 * @Author: 温祖彪
 * @Date: 2020-03-31 21:23:06
 * @LastEditTime: 2020-03-31 22:36:15
 */
import { h } from "../辅助创建 VNode 的 h 函数/h.js";
import { render } from "./render.js";

const elementVnode = h(
  "div",
  {
    style: {
      height: "100px",
      width: "100px",
      background: "red"
    }
  },
  h("div", {
    style: {
      width: "50px",
      height: "50px",
      background: "green"
    }
  })
);

// render(elementVnode, document.getElementById("app"));

// 测试 Attributes 和 DOM Properties
const elementVnode2 = h("input", {
  class: "cls-a",
  type: "checkbox",
  checked: true,
  custom: "1"
});

// render(elementVnode2, document.getElementById("app"));

// 测试事件
function handler() {
  alert("click me");
}

const elementVnode3 = h("div", {
  style: {
    width: "100px",
    height: "100px",
    backgroundColor: "red"
  },
  onclick: handler
});
render(elementVnode3, document.getElementById("app"));
