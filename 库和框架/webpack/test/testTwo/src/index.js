/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-13 11:02:13
 * @LastEditTime: 2020-04-23 19:05:44
 */
import axios from "axios";
import "element-ui";

axios.get("/react/api/header.json").then(res => {
  console.log(res);
});

document.body.onclick = () => {
  import(/* webpackChunkName: "test" */ "./test");
};
