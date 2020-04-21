/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-13 11:02:13
 * @LastEditTime: 2020-04-21 18:14:50
 */
import axios from "axios";

axios.get("/react/api/header.json").then(res => {
  console.log(res);
});
