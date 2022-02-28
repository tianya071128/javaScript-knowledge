import Login from '@/views/login';

/** 类型声明 */
interface RouteConfig {
  routes: _Routes[];
}

export interface _Routes {
  path: string; // 路由路径
  element: (...args: any) => JSX.Element; // 当前路由组件
  index?: false;
  children?: _Routes[]; // 嵌套路由
}

/** 类型声明 end */

const routeConfig: RouteConfig = {
  routes: [
    {
      path: '/login',
      element: Login,
    },
  ],
};

export default routeConfig;
