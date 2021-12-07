import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import Login from './views/login';

function App() {
  return (
    <div className='App'>
      <Switch>
        {/* 注册路由 */}
        <Route path='/login' component={Login} />
        {/* <Route path='/home' component={Home} /> */}
        {/* 使导航到一个新的地址 */}
        <Redirect to='/login' />
      </Switch>
    </div>
  );
}

export default App;
