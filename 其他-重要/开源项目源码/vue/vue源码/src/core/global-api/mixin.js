/*
 * @Descripttion:在 Vue 上添加 mixin 这个全局API。
 * @Author: 温祖彪
 * @Date: 2020-03-06 22:40:51
 * @LastEditTime: 2020-03-23 22:07:28
 */
/* @flow */

import { mergeOptions } from "../util/index";

export function initMixin(Vue: GlobalAPI) {
  // 在 Vue 上添加 mixin 全局API.
  Vue.mixin = function(mixin: Object) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
