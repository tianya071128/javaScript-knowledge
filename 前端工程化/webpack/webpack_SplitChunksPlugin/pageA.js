/*
 * @Descripttion: 
 * @Author: 温祖彪
 * @Date: 2021-06-16 15:58:00
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-06-16 16:11:31
 */
import vendor1 from "vendor1";
import utility1 from "./utility1";
import utility2 from "./utility2";

console.log(vendor1, utility1, utility2);

export default () => {
  //懒加载
  import("./async1");
  import("./async2");
  console.log("pageA");
};