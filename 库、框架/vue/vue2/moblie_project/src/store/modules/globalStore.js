/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-15 22:23:26
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-17 11:17:55
 */
import {
  ADD_KEEP_ALIVE_ROUTER,
  DELETE_KEEP_ALIVE_ROUTER,
  ADD_LOADING,
  DELETE_LOADING,
} from '../mutationTypes';

export default {
  state: {
    keepAliveRouterNames: [], // keep-alive 缓存路由集
    loading: 0, // 控制 loading 的变量
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
    },
    // loading++
    [ADD_LOADING](state) {
      state.loading++;
    },
    // loading--
    [DELETE_LOADING](state) {
      if (--state.loading < 0) {
        // 容错机制
        state.loading = 0;
      }
    },
  },
};
