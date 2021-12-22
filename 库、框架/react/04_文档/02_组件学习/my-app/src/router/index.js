import { useLocation, matchRoutes } from 'react-router-dom';
import { useMemo } from 'react';

import Login from '../views/login';
import Manage from '../views/manage';
import UserList from '../views/userList';
import Home from '../views/home';
import FoodList from '../views/foodList';
import OrderList from '../views/orderList';
import AdminList from '../views/adminList';
import MyTransition from '../views/myTransition';
import NestedRoute from '../views/nestedRoute';
import ThreeRoute from '../views/nestedRoute/threeRoute';

const routeConfig = {
  routes: [
    {
      path: '/login',
      element: Login,
    },
    {
      path: '/',
      element: Manage,
      meta: {
        title: '首页',
      },
      children: [
        { index: true, element: Home },
        {
          path: 'userList',
          element: UserList,
          meta: {
            title: '用户列表',
          },
        },
        { path: 'foodList', element: FoodList },
        { path: 'orderList', element: OrderList },
        { path: 'adminList', element: AdminList },
        { path: 'transition', element: MyTransition },
        {
          path: 'nestedRoute',
          element: NestedRoute,
          meta: {
            title: '二级路由',
          },
          children: [
            {
              path: 'threeRoute',
              element: ThreeRoute,
              meta: {
                title: '多级嵌套路由',
              },
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: function NotFount() {
        return <div>404</div>;
      },
    },
  ],
};

export const useMetas = function () {
  const pathname = useLocation().pathname;
  const routes = useMemo(() => {
    console.log('会触发吗?');
    return matchRoutes(routeConfig.routes, pathname);
  }, [pathname]);

  return routes.map((route) =>
    JSON.parse(JSON.stringify(route?.route?.meta ?? {}))
  );
};

export default routeConfig;
