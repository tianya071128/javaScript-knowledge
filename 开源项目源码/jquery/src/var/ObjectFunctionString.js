/*
 * @Descripttion: ({}).hasOwnProperty.toString.call(Object); 返回全局函数 Object 的 "function Object() { [native code] }"
 * @Author: 温祖彪
 * @Date: 2020-01-06 20:45:05
 * @LastEditTime: 2020-01-09 22:15:58
 */
import fnToString from "./fnToString.js";

export default fnToString.call(Object);
