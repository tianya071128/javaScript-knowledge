/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-15 10:42:56
 * @LastEditTime: 2020-04-15 10:44:41
 */
function counter() {
  var div = document.createElement("div");
  div.setAttribute("id", "counter");
  div.innerHTML = 1;
  div.onclick = function() {
    div.innerHTML = parseInt(div.innerHTML, 10) + 1;
  };
  document.body.appendChild(div);
}

export default counter;
