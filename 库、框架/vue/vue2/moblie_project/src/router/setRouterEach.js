/*
 * @Descripttion:
 * @Author: 温祖彪
 * @Date: 2021-09-15 21:47:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-09-17 09:33:05
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
    Array.isArray(toKeepAliveNames) &&
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

// 处理缓存路由 - 由当前路由跳转目的地决定
function _resolveAfterEachKeepAlive(to, from) {
  const toName = to.name, // 进入路由 Name
    fromName = from.name, // 离开路由 Name
    fromKeepAliveNames = from.meta?.toKeepAliveNames,
    toKeepAliveNames = to.meta?.toKeepAliveNames;

  // 判断离开路由是否需要继续缓存
  if (
    Array.isArray(fromKeepAliveNames) &&
    !fromKeepAliveNames.includes(toName)
  ) {
    // 因为是离开路由, 让其静默失败
    store.commit(DELETE_KEEP_ALIVE_ROUTER, fromName);
  }

  // 在判断一下进入路由是否需要缓存
  if (!!toKeepAliveNames && typeof toName === 'string') {
    store.commit(ADD_KEEP_ALIVE_ROUTER, toName);
  }
}

export default function(router) {
  // 设置全局前置守卫
  router.beforeEach(async (to, from, next) => {
    // 0. 处理缓存路由
    await _resolveKeepAliveRouter(to, from);

    // 1. 当离开缓存路由时, 通过 toKeepAliveNames 判断是否缓存
    _resolveAfterEachKeepAlive(to, from);

    next();
  });
}
