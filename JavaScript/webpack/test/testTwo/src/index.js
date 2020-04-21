/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-04-13 11:02:13
 * @LastEditTime: 2020-04-21 10:51:47
 */
import _ from "lodash";
import $ from "jquery";

const dom = $("<div>");
dom.html(_.join(["wen", "zubiao", "hello", "wold"], "---"));
$("body").append(dom);

console.log(this);
