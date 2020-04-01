/*
 * @Descripttion: 测试
 * @Author: 温祖彪
 * @Date: 2020-04-01 16:26:56
 * @LastEditTime: 2020-04-01 17:16:26
 */
import { h, Fragment, Portal } from "../辅助创建 VNode 的 h 函数/h.js";
import { render } from "../渲染器/render.js";

// ======== 测试替换 VNode ========

// 旧的 VNode 是一个 div 标签
const prevVNode = h("div", null, "旧的 VNode");

class MyComponent {
  render() {
    return h("h1", null, "新的 VNode");
  }
}
// 新的 VNode 是一个组件
const nextVNode = h(MyComponent);

// 先后渲染新旧 VNode 到 #app
// render(prevVNode, document.getElementById("app"));
// render(nextVNode, document.getElementById("app"));

// ======== end ========

// ======== 测试更新 VNodeData ========

const handler = () => alert("clicked");

// 旧的 VNode
const prevVNode2 = h("div", {
  style: {
    width: "100px",
    height: "100px",
    backgroundColor: "red"
  },
  onclick: handler
});

// 新的 VNode
const nextVNode2 = h("div", {
  style: {
    width: "100px",
    height: "100px",
    border: "1px solid green"
  }
});

render(prevVNode2, document.getElementById("app"));

setTimeout(() => {
  render(nextVNode2, document.getElementById("app"));
}, 5000);

// ======== end ========
