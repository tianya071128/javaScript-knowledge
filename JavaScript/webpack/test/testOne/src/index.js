/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-09 21:16:28
 * @LastEditTime: 2020-04-11 18:02:26
 */

async function getComponent() {
  var element = document.createElement("div");
  const { default: _ } = await import(
    /* webpackChunkName: "lodash" */ "lodash"
  );

  element.innerHTML = _.join(["Hello", "webpack"], " ");

  return element;
}

getComponent().then(component => {
  document.body.appendChild(component);
});
