import { Routes, Route } from 'react-router-dom';
import router from './router';
import './index.css';

function routeComponentHot(Component, route) {
  return function (props) {
    return <Component {...props} />;
  };
}

// 渲染路由
function renderRoute(routes) {
  return routes.map((route) => {
    const Component = routeComponentHot(route.element, route);
    return (
      <Route
        key={route.path || 'index'}
        index={route.index}
        path={route.path}
        element={<Component />}>
        {Array.isArray(route.children) && renderRoute(route.children)}
      </Route>
    );
  });
}

function App() {
  return (
    <div className='fillcontain'>
      <Routes>
        {Array.isArray(router?.routes) && renderRoute(router.routes)}
      </Routes>
    </div>
  );
}

export default App;
