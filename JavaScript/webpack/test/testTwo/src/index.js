/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-13 11:02:13
 * @LastEditTime: 2020-04-19 21:53:00
 */
import _ from "lodash";

const dom = $("<div>");
dom.html(_.join(["wen", "zubiao", "hello", "wold"], "---"));
$("body").append(dom);
