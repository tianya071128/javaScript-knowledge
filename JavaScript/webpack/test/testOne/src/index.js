/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-09 21:16:28
 * @LastEditTime: 2020-04-21 10:28:45
 */
function component() {
  var element = document.createElement("div");

  element.innerHTML = _.join(["Hello", "webpack"], " ");

  return element;
}

document.body.appendChild(component());
