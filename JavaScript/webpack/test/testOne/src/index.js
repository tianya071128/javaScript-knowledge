/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-09 21:16:28
 * @LastEditTime: 2020-04-09 22:25:07
 */
import _ from "lodash";

function component() {
  let element = document.createElement("div");

  element.innerHTML = _.join(["Hello", "webpack"], " ");

  return element;
}

document.body.appendChild(component());
