/*
 * @Descripttion: 判断是否为 window
 * @Author: 温祖彪
 * @Date: 2020-01-06 20:45:05
 * @LastEditTime: 2020-01-09 22:58:33
 */
export default function isWindow(obj) {
  return obj != null && obj === obj.window;
}
