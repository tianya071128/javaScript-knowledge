import { Menu, Layout } from 'element-react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useMemo } from 'react';
import Home from '../home';
import HeadTop from './HeadTop';
import './manage.css';

export default function Manage(props) {
  const defaultActive = useMemo(() => {
    console.log(props);
    return props.location.pathname.split('/').reverse()[0];
  }, [props.location.pathname]);

  const onSelect = (index) => {
    props.history.push('/' + index);
  };

  return (
    <div className='fillcontain'>
      <Layout.Col
        span={4}
        style={{ height: '100%', backgroundColor: '#324057' }}>
        <Menu
          className='el-menu-vertical-demo'
          theme='dark'
          defaultActive={defaultActive}
          onSelect={onSelect}>
          <Menu.Item index='home'>首页</Menu.Item>
          <Menu.SubMenu index='1' title='数据管理'>
            <Menu.Item index='userList'>用户列表</Menu.Item>
            <Menu.Item index='shopList'>商家列表</Menu.Item>
            <Menu.Item index='foodList'>食品列表</Menu.Item>
          </Menu.SubMenu>
          {/* <Menu.Item index='2'>导航二</Menu.Item>
          <Menu.Item index='3'>导航三</Menu.Item> */}
        </Menu>
      </Layout.Col>
      <Layout.Col span={20} style={{ height: '100%', overflow: 'auto' }}>
        <HeadTop />
        <Switch>
          {/* 注册路由 */}
          <Route path='/home' component={Home} />
          <Route path='/userList' test='etst' component={Home} />
          <Route path='/shopList' component={Home} />
          {/* <Route path='/manage' component={Manage} /> */}
          {/* <Route path='/home' component={Home} /> */}
          {/* 使导航到一个新的地址 */}
          {/* <Redirect to='/home' /> */}
        </Switch>
      </Layout.Col>
    </div>
  );
}
