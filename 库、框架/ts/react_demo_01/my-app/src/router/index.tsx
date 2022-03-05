import { useMemo } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import Login from '@/views/login';
import Layout from '@/views/layout';

/** 类型声明 */
interface RouteConfig {
  routes: _Routes[];
}

export interface RouteMeta {
  /** 不出现在菜单栏中，但是指向菜单栏的某项(应该用 id 来区分) */
  activeMenu?: string;
  /** 路由标题 */
  title?: string;
  /** 路由 id */
  id?: string;
}

export interface _Routes {
  /** 路径 */
  path?: string;
  /** 路由组件 */
  element: (...args: any) => JSX.Element;
  /** 索引路由 */
  index?: boolean;
  /** 嵌套路由(子路由) */
  children?: _Routes[];
  /** meta */
  meta?: RouteMeta;
}

/** 类型声明 end */

const routeConfig: RouteConfig = {
  routes: [
    {
      path: '/login',
      element: Login,
    },
    {
      path: '/',
      element: Layout,
      children: [
        {
          index: true,
          element: function () {
            return <div>test1</div>;
          },
          meta: {
            id: '1',
            title: '首页',
          },
        },
        {
          path: 'test1',
          element: function () {
            return <div>test1</div>;
          },
          meta: {
            id: '2',
            title: '嵌套路由1',
          },
        },
        {
          path: 'test2',
          element: function () {
            return <div>test2</div>;
          },
          meta: {
            id: '3',
            title: '嵌套路由1',
          },
        },
        {
          path: 'test3',
          element: function () {
            return <div>test3</div>;
          },
          meta: {
            id: '5',
            title: '嵌套路由1',
          },
        },
        {
          path: 'test4',
          element: function () {
            return <div>test3</div>;
          },
          meta: {
            activeMenu: '/test3',
            id: '6',
          },
        },
      ],
    },
  ],
};

export const useCustomRoutes = function () {
  const pathname = useLocation().pathname;
  return useMemo(() => {
    return matchRoutes(routeConfig.routes, pathname);
  }, [pathname]);

  // return routes.map((route) =>
  //   JSON.parse(JSON.stringify(route?.route?.meta ?? {}))
  // );
};

export default routeConfig;
