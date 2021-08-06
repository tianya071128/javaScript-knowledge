/*
 * @Descripttion: 测试渲染器
 * @Author: 温祖彪
 * @Date: 2020-03-31 21:23:06
 * @LastEditTime: 2020-04-01 17:06:00
 */
import { h, Fragment, Portal } from "../辅助创建 VNode 的 h 函数/h.js";
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

render(elementVnode, document.getElementById("app"));

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

const elementVnode3 = h(
  "div",
  {
    style: {
      width: "100px",
      height: "100px",
      backgroundColor: "red"
    },
    onclick: handler
  },
  "我是文本"
);
// render(elementVnode3, document.getElementById("app"));

// 测试 Fragment
const elementVnode4 = h(
  "div",
  {
    style: {
      height: "100px",
      width: "100px",
      backgroundColor: "red"
    }
  },
  h(Fragment, null, [
    h("span", null, "我是标题1..."),
    h("span", null, "我是标题2...")
  ])
);

// render(elementVnode4, document.getElementById("app"));

// 测试 Portal
const elementVnode5 = h(
  "div",
  {
    style: {
      height: "100px",
      width: "100px",
      backgroundColor: "red"
    }
  },
  h(Portal, { target: "#portal-box" }, [
    h("span", null, "我是标题1...."),
    h("span", null, "我是标题2....")
  ])
);

// render(elementVnode5, document.getElementById("app"));

// 测试有状态组件
class MyComponent {
  render() {
    return h(
      "div",
      {
        style: {
          background: "green"
        }
      },
      [
        h("span", null, "我是组件的标题1...."),
        h("span", null, "我是组件的标题2.....")
      ]
    );
  }
}

const compVnode = h(MyComponent);
// render(compVnode, document.getElementById("app"));

// 测试函数式组件
function MyFunctionalComponent() {
  // 返回要渲染的内容描述, 即 VNode
  return h(
    "div",
    {
      style: {
        backgroundColor: "green"
      }
    },
    [
      h("span", null, "我是组件的标题1....."),
      h("span", null, "我是组件的标题2.....")
    ]
  );
}

const compVnode2 = h(MyFunctionalComponent);

// render(compVnode2, document.getElementById("app"));
