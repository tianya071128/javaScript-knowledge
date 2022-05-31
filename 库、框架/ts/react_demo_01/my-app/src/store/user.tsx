import { atom, selector } from 'recoil';
import { getUserInfo } from '@/utils/localStore';
import type { LoginResult, RouteInfo } from '@/api';
import { _Route } from '@/router';
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * 登录信息的操作
 */
// 全部登录信息
export const user_info_recoil = atom<LoginResult['userInfo'] | null>({
  key: 'user_info',
  default: getUserInfo(),
});

// 路由信息
export const router_list_recoil = atom<RouteInfo[] | null>({
  key: 'router_list',
  default: null,
});

// 对动态路由部分进行操作
function getElement(elementPath?: string) {
  // 注意：路由组件因为是懒加载，应该存在特定其他页面的标识
  // 因为 webpack 打包时对待动态表达式时，会加载潜在的请求的每个模块
  const Element = React.lazy(() =>
    import(`@/views/${elementPath}/routeIndex.tsx`).catch((e) => {
      e.filePath = `src/views/${elementPath}/routeIndex.tsx`;
      throw e;
    })
  );
  return (
    /**
     * 这里为什么要使用 key？
     *   假设有如下路由：
     *      /home  -> 正常
     *      /test  -> 异常
     *   当从 /test 切换到 /home 时，react-router 就会生成如下组件树：
     *    <Outlet>
     *      <...>
     *        <ErrorBoundary>
     *    此时如果没有 key 的话，ErrorBoundary 组件会被重用，此时 ErrorBoundary 组件就会进入更新阶段，还保留着 /test 路由组件时的渲染错误
     *    添加 key 后，ErrorBoundary 组件就不会被重用
     */
    <ErrorBoundary key={`src/views/${elementPath}/routeIndex.tsx`}>
      <React.Suspense fallback={<>...</>}>
        <Element />
      </React.Suspense>
    </ErrorBoundary>
  );
}
// 根据登录信息加工动态路由部分
export const dynamic_routes_recoil = selector<_Route[]>({
  key: 'dynamicRoutes',
  get: ({ get }) => {
    const routeList = get(router_list_recoil) || [];

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
