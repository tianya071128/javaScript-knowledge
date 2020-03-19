/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-18 21:11:03
 */
import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

function Vue(options) {
  // vue 必须要用 new 调用
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  // 会在下面调用的方法中添加原型方法
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
// update 函数，将 VNode 渲染成真实的 DOM
lifecycleMixin(Vue);
// 向原型中添加 render 函数
renderMixin(Vue);

export default Vue;
