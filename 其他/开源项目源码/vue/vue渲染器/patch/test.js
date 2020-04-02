/*
 * @Descripttion: 测试
 * @Author: 温祖彪
 * @Date: 2020-04-01 16:26:56
 * @LastEditTime: 2020-04-02 11:52:52
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

// render(prevVNode2, document.getElementById("app"));

// setTimeout(() => {
//   render(nextVNode2, document.getElementById("app"));
// }, 5000);

// ======== end ========

// ======== 测试: 标签元素 -- 子节点都是单个 ========

// 旧的 VNode
const prevVNode3 = h(
  "div",
  null,
  h("p", {
    style: {
      height: "100px",
      width: "100px",
      background: "red"
    }
  })
);

// 新的 VNode
const nextVNode3 = h(
  "div",
  null,
  h("p", {
    style: {
      height: "100px",
      width: "100px",
      background: "green"
    }
  })
);

// render(prevVNode3, document.getElementById("app"));

// 2秒后更新
// setTimeout(() => {
//   render(nextVNode3, document.getElementById("app"));
// }, 5000);

// ======== end ========

// ======== 测试: 标签元素 -- 新的 VNode 没有子节点 ========

// 旧的 VNode
const prevVNode4 = h(
  "div",
  null,
  h("p", {
    style: {
      height: "100px",
      width: "100px",
      background: "red"
    }
  })
);

// 新的 VNode
const nextVNode4 = h("div");

// render(prevVNode4, document.getElementById("app"));

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode4, document.getElementById("app"));
// }, 2000);

// ======== end ========

// ======== 测试: 标签元素 -- 旧 VNode 只有一个子节点, 新 VNode 具有多个子节点 ========

// 旧的 VNode
const prevVNode5 = h("div", null, h("p", null, "只有一个子节点"));

// 新的 VNode
const nextVNode5 = h("div", null, [
  h("p", null, "子节点 1"),
  h("p", null, "子节点 2")
]);

// render(prevVNode5, document.getElementById("app"));

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode5, document.getElementById("app"));
// }, 2000);

// ======== end ========

// ======== 测试: 标签元素 ========

// 旧的 VNode
const prevVNode6 = h(
  "div",
  {
    style: {
      height: "100px",
      width: "100px",
      background: "red"
    }
  },
  [h("p", null, "子节点 1"), h("p", null, "子节点 2")]
);

// 新的 VNode
const nextVNode6 = h(
  "div",
  {
    style: {
      height: "100px",
      width: "100px"
      // background: "red"
    }
  },
  [h("p", null, "子节点 1"), h("p", null, "子节点 2")]
);

// render(prevVNode6, document.getElementById("app"));

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode6, document.getElementById("app"));
// }, 2000);

// ======== end ========

// ======== 测试: 文本节点 ========

// 旧的 VNode
const prevVNode7 = h("p", null, "旧文本");

// 新的 VNode
const nextVNode7 = h("p", null, "新文本");

// render(prevVNode7, document.getElementById("app"));

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode7, document.getElementById("app"));
// }, 2000);

// ======== end ========

// ======== 测试: 更新 Fragment ========

// 旧的 VNode
const prevVNode8 = h(Fragment, null, [
  h("p", null, "旧片段子节点 1"),
  h("p", null, "旧片段子节点 2")
]);

// 新的 VNode
const nextVNode8 = h(Fragment, null, [
  h("p", null, "新片段子节点 1"),
  h("p", null, "新片段子节点 2")
]);

// render(prevVNode8, document.getElementById("app"));

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode8, document.getElementById("app"));
// }, 2000);

// ======== end ========

// ======== 测试: 更新 Fragment ========

// 旧的 VNode
const prevVNode9 = h(Portal, { target: "#old-container" }, [
  h("p", null, "旧片段子节点 1"),
  h("p", null, "旧片段子节点 2")
]);

// 新的 VNode
const nextVNode9 = h(Portal, { target: "#new-container" }, [
  h("p", null, "新片段子节点 1"),
  h(Fragment, null, [
    h("p", null, "新片段子节点 1"),
    h("p", null, "新片段子节点 2")
  ])
]);

render(prevVNode9, document.getElementById("app"));

// // 2秒后更新
setTimeout(() => {
  render(nextVNode9, document.getElementById("app"));
}, 2000);

// ======== end ========
