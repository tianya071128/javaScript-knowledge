/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-15 22:23:26
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-15 22:34:03
 */
import {
  ADD_KEEP_ALIVE_ROUTER,
  DELETE_KEEP_ALIVE_ROUTER
} from '../mutationTypes';

export default {
  state: {
    keepAliveRouterNames: [] // keep-alive 缓存路由集
  },
  mutations: {
    // 新增需要缓存的路由
    [ADD_KEEP_ALIVE_ROUTER](state, payload) {
      if (state.keepAliveRouterNames.includes(payload)) return;

      if (typeof payload === 'string') {
        state.keepAliveRouterNames.push(payload);
      }
    },
    // 删除需要缓存的路由
    [DELETE_KEEP_ALIVE_ROUTER](state, payload) {
      const arr = state.keepAliveRouterNames;

      if (typeof payload === 'string') {
        const i = arr.indexOf(payload);
        if (i > -1) arr.splice(i, 1);
      }
    }
  }
};
