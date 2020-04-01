/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-01 16:54:12
 * @LastEditTime: 2020-04-01 17:07:55
 */

// 需要当做 DOM Prop 处理的属性
const DOMPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/;
// 用来更新 VNodeData 的数据
export function patchData(el, key, prevValue, nextValue) {
  switch (key) {
    case "style":
      // 将新的样式数据应用到元素
      for (let k in nextValue) {
        el.style[k] = nextValue[k];
      }
      // 移除已经不存在的样式
      for (let k in prevValue) {
        if (!nextValue.hasOwnProperty(k)) {
          el.style[k] = "";
        }
      }
      break;
    case "class":
      el.className = nextValue;
      break;
    default:
      if (key[0] === "o" && key[1] === "n") {
        // 事件
        // 移除旧事件
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue);
        }
        // 添加新事件
        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue);
        }
      } else if (domPropsRE.test(key)) {
        // 当作 DOM Prop 处理
        el[key] = nextValue;
      } else {
        // 当作 Attr 处理
        el.setAttribute(key, nextValue);
      }
      break;
  }
}
