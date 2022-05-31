import { Routes, Route } from 'react-router-dom';
import { type _Route, useRouteConfig } from '@/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { router_list_recoil, user_info_recoil } from './store/user';
import { useEffect } from 'react';
import { getRouterInfo } from './api';

/** 类型声明 */
interface RouteProp {
  key: string;
  element: React.ReactNode | null;
  path?: string;
  index?: true;
}
/** 类型声明 end */

function routeComponentHot(
  Component: _Route['element'],
  { beforeEnter }: _Route
) {
  return !!beforeEnter ? beforeEnter(Component) : Component;
}

// 渲染路由
function renderRoute(routes: _Route[]) {
  return routes.map((route) => {
    // 对路由组件进行封装
    const Component = routeComponentHot(route.element, route);

    /** 封装一下 Route 组件的 props */
    const routeProp: RouteProp = {
      key: route.path || 'index',
      element: Component,
    };
    if (route.path) {
      routeProp.path = route.path;
    }
    if (route.index) {
      routeProp.index = true;
    }
    return (
      <Route {...routeProp}>
        {route.children && renderRoute(route.children)}
      </Route>
    );
  });
}

function App() {
  const router = useRouteConfig();
  const [routerList, setRouterList] = useRecoilState(router_list_recoil);
  const userInfo = useRecoilValue(user_info_recoil);

  useEffect(() => {
    const getRouterList = async () => {
      const data = await getRouterInfo();
      setRouterList(data);
    };

    if (userInfo && !routerList) {
      // 此时去获取路由列表
      getRouterList();
    }
  }, [userInfo, routerList, setRouterList]);

  /** 在登录情况下，接口获取下路由 */
  if (userInfo && !routerList) {
    // 此时获取路由信息中
    return null;
  }
  return (
    <>
      <Routes>{renderRoute(router.routes)}</Routes>
    </>
  );
}

export default App;
