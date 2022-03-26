import { atom, selector } from 'recoil';
import { getUserInfo } from '@/utils/localStore';
import type { LoginResult, RouteInfo } from '@/api';
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
function getElement(elementPath?: string) {
  // 注意：路由组件因为是懒加载，应该存在特定其他页面的标识
  // 因为 webpack 打包时对待动态表达式时，会加载潜在的请求的每个模块
  const Element = React.lazy(
    () => import(`@/views/${elementPath}/routeIndex.tsx`)
  );
  return (
    <React.Suspense fallback={<>...</>}>
      <Element />
    </React.Suspense>
  );
}
// 根据登录信息加工动态路由部分
export const dynamic_routes_recoil = selector<_Route[]>({
  key: 'dynamicRoutes',
  get: ({ get }) => {
    const userInfo = get(user_info_recoil);
    if (
      !userInfo ||
      !Array.isArray(userInfo.routeList) ||
      userInfo.routeList.length === 0
    )
      return [];
    const routeList = JSON.parse(
      JSON.stringify(userInfo.routeList)
    ) as RouteInfo[];

    // 存在有效数据
    const _routes: _Route[] = [];
    const resolveRoute = function (routes: RouteInfo[]) {
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
            path: route.path.replace(/^\//, ''),
            element: getElement(route.element),
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

export type Menus = Omit<RouteInfo, 'element'>;
// 获取菜单数据
export const menus_recoil = selector<Menus[]>({
  key: 'menus_recoil',
  get({ get }) {
    const userInfo = get(user_info_recoil);
    if (
      !userInfo ||
      !Array.isArray(userInfo.routeList) ||
      userInfo.routeList.length === 0
    )
      return [];

    const routeList = JSON.parse(
      JSON.stringify(userInfo.routeList)
    ) as RouteInfo[];
    const _menus: Menus[] = [];
    const resolveMenu = function (menus: RouteInfo[], parent: Menus[]) {
      for (const menu of menus) {
        if (!menu.hidden) {
          delete menu.element;
          parent.push(menu);
          if (Array.isArray(menu.children)) {
            resolveMenu(menu.children, (menu.children = []));
          }
        }
      }
    };

    resolveMenu(routeList, _menus);

    return _menus;
  },
});
