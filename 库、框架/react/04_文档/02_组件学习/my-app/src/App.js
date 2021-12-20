import { Routes, Route } from 'react-router-dom';
import router from './router';
import './index.css';

// 渲染路由
function renderRoute(routes) {
  return routes.map((route) => {
    return (
      <Route
        key={route.path || 'index'}
        index={route.index}
        path={route.path}
        element={<route.component />}>
        {Array.isArray(route.routes) && renderRoute(route.routes)}
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
      {/* <Switch> */}
      {/* 注册路由 */}
      {/* <Route path='/login' component={Login} /> */}
      {/* <Route path='/' component={Manage} /> */}
      {/* <Route path='/home' component={Home} /> */}
      {/* 使导航到一个新的地址 */}
      {/* <Redirect to='/login' /> */}
      {/* </Switch> */}
    </div>
  );
}

export default App;
