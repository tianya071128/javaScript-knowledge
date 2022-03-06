import { useMemo } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { dynamic_routes_recoil } from '@/store/user';
import Login from '@/views/login';

/** 类型声明 */
interface RouteConfig {
  routes: _Route[];
}

export interface RouteMeta {
  /** 不出现在菜单栏中，但是指向菜单栏的某项(应该用 id 来区分) */
  activeMenu?: string;
  /** 路由标题 */
  title?: string;
  /** 路由 id */
  id?: string;
  /** 路由元信息可以任意定义 */
  [prop: string]: any;
}

export interface _Route {
  /** 路径 */
  path?: string;
  /** 路由组件 */
  // element: (...args: any) => JSX.Element;
  element: any;
  /** 索引路由 */
  index?: boolean;
  /** 嵌套路由(子路由) */
  children?: _Route[];
  /** meta */
  meta?: RouteMeta;
}

/** 类型声明 end */

// 静态路由
const staticRoutes: _Route[] = [
  {
    path: '/login',
    element: Login,
  },
];

// const routeConfig: RouteConfig = {
//   routes: ,
// };

/**
 * 获取当前路由信息
 */
export const useCustomRoutes = function () {
  const pathname = useLocation().pathname;
  const route = useRouteConfig();
  return useMemo(() => {
    return matchRoutes(route.routes, pathname);
  }, [pathname, route]);
};

// 获取注册路由表，结合动态路由和静态路由
export const useRouteConfig = function () {
  const dynamicRoutes = useRecoilValue(dynamic_routes_recoil);
  const route: RouteConfig = {
    routes: [...staticRoutes, ...dynamicRoutes],
  };
  return route;
};
