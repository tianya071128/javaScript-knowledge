/*
 * @Descripttion: 判断数组的类型: null 和 undefined ...
 * @Author: 温祖彪
 * @Date: 2020-01-06 20:45:05
 * @LastEditTime: 2020-01-09 22:56:42
 */
import class2type from "../var/class2type.js";
import toString from "../var/toString.js";

function toType(obj) {
  if (obj == null) {
    return obj + "";
  }

  return typeof obj === "object"
    ? class2type[toString.call(obj)] || "object"
    : typeof obj;
}

export default toType;
