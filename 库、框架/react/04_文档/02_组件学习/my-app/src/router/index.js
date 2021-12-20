import Login from '../views/login';
import Manage from '../views/manage';
import UserList from '../views/userList';
import Home from '../views/home';
import FoodList from '../views/foodList';
import OrderList from '../views/orderList';
import AdminList from '../views/adminList';
import MyTransition from '../views/myTransition';

// {/* <Route path='/home' component={Home} />
//           <Route path='/userList' component={UserList} />
//           <Route path='/foodList' component={FoodList} />
//           <Route path='/orderList' component={OrderList} />
//           <Route path='/adminList' component={AdminList} />
//           <Route path='/transition' component={MyTransition} /> */}
//         {/* <Route path='/manage' component={Manage} /> */}
//         {/* <Route path='/home' component={Home} /> */}

const routeConfig = {
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      component: Manage,
      routes: [
        { index: true, component: Home },
        { path: 'userList', component: UserList },
        { path: 'foodList', component: FoodList },
        { path: 'orderList', component: OrderList },
        { path: 'adminList', component: AdminList },
        { path: 'transition', component: MyTransition },
      ],
    },
    {
      path: '*',
      component: function NotFount() {
        return <div>404</div>;
      },
    },
  ],
};

export default routeConfig;
