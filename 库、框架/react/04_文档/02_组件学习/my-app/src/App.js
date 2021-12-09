import { Redirect, Route, Switch } from 'react-router-dom';
import './index.css';
import Login from './views/login';
import Manage from './views/manage';

function App() {
  return (
    <div className='fillcontain'>
      <Switch>
        {/* 注册路由 */}
        <Route path='/login' component={Login} />
        <Route path='/' component={Manage} />
        {/* <Route path='/home' component={Home} /> */}
        {/* 使导航到一个新的地址 */}
        <Redirect to='/login' />
      </Switch>
    </div>
  );
}

export default App;
