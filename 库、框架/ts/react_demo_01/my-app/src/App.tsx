import { Routes, Route } from 'react-router-dom';
import router, { type _Routes } from '@/router';

function routeComponentHot(Component: _Routes['element'], route: _Routes) {
  return function (props: object) {
    return <Component {...props} />;
  };
}

// 渲染路由
function renderRoute(routes: _Routes[]) {
  return routes.map((route) => {
    const Component = routeComponentHot(route.element, route);
    return (
      <Route
        key={route.path || 'index'}
        index={route.index}
        path={route.path}
        element={<Component />}>
        {route.children && renderRoute(route.children)}
      </Route>
    );
  });
}

function App() {
  return (
    <>
      <Routes>{renderRoute(router.routes)}</Routes>
    </>
  );
}

export default App;
