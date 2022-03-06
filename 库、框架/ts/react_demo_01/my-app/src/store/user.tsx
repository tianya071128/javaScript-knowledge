import { atom, selector } from 'recoil';
import { getUserInfo } from '@/utils/localStore';
import type { LoginResult } from '@/api';
import { _Route } from '@/router';
import React from 'react';

/**
 * 登录信息的操作
 */
// 全部登录信息
export const user_info_recoil = atom<LoginResult['userInfo'] | null>({
  key: 'user_info',
  default: getUserInfo(),
});

// 对动态路由部分进行操作
function getElement(elementPath: string, path?: string) {
  return function () {
    return (
      <div>
        测试一下{elementPath}
        {path}
      </div>
    );
  };
}
export const dynamic_routes_recoil = selector<_Route[]>({
  key: 'dynamicRoutes',
  get: ({ get }) => {
    const userInfo = get(user_info_recoil);
    if (!userInfo) return [];
    const routeList = userInfo.routeList;
    if (!Array.isArray(routeList) || routeList.length === 0) return [];

    // 存在有效数据
    const _routes: _Route[] = [];
    const resolveRoute = function (routes: typeof routeList) {
      for (const route of routes) {
        // 作为信息额外信息使用
        const meta = { ...route };
        delete meta.children;
        delete meta.path;
        if (route.path === '/') {
          // 此时为首页索引路由，特殊处理
          _routes.push({
            index: true,
            element: getElement(route.element),
            meta,
          });
        } else if (!route.children && route.path) {
          // 此时为点击子菜单
          _routes.push({
            path: route.path,
            element: getElement(route.element, route.path),
            meta,
          });
        } else if (Array.isArray(route.children)) {
          // 递归处理
          resolveRoute(route.children);
        } else {
          // 其他情况下，静默不处理
        }
      }
    };

    resolveRoute(routeList);
    return _routes;
  },
});
