/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-15 21:47:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-16 00:17:42
 */
import Vue from 'vue';
import store from '@/store';
import {
  ADD_KEEP_ALIVE_ROUTER,
  DELETE_KEEP_ALIVE_ROUTER,
} from '@/store/mutationTypes';

// 加载缓存路由, 由 router 的 meta 中 keepAliveNames 决定, 通过判断进入的路由是否符合条件来判断
async function _resolveKeepAliveRouter(to, from) {
  const toName = to.name, // 进入路由 Name
    fromName = from.name, // 离开路由 Name
    toKeepAliveNames = to.meta?.keepAliveNames; // 进入路由需要缓存的路由

  // 判断进入的路由是否已经缓存并且需要清除缓存
  if (
    store.state.globalStore.keepAliveRouterNames.includes(toName) &&
    !toKeepAliveNames.includes(fromName)
  ) {
    store.commit(DELETE_KEEP_ALIVE_ROUTER, toName);

    // 我们需要先让其缓存的组件销毁掉
    await Vue.nextTick();
  }

  // 在判断是否需要缓存
  if (typeof toName === 'string' && !!toKeepAliveNames) {
    store.commit(ADD_KEEP_ALIVE_ROUTER, toName);
  }
}

export default function(router) {
  // 设置全局前置守卫
  router.beforeEach(async (to, from, next) => {
    // 0. 处理缓存路由
    await _resolveKeepAliveRouter(to, from);

    // 1. 当离开缓存路由时, 通过 toKeepAliveNames 判断是否缓存
    // _resolveAfterEachKeepAlive(to, from);

    next();
  });
}
