import { Menu, Layout } from 'element-react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useMemo } from 'react';

import HeadTop from './HeadTop';
import './manage.css';

export default function Manage() {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultActive = useMemo(() => {
    return location.pathname.substring(1).split('/')[0];
  }, [location.pathname]);

  const onSelect = (index) => {
    navigate('/' + index);
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
          <Menu.Item index=''>首页</Menu.Item>
          <Menu.SubMenu index='1' title='数据管理'>
            <Menu.Item index='userList'>用户列表</Menu.Item>
            <Menu.Item index='foodList'>食品列表</Menu.Item>
            <Menu.Item index='orderList'>订单列表</Menu.Item>
            <Menu.Item index='adminList'>管理员列表</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu index='2' title='demo'>
            <Menu.Item index='transition'>动画</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu index='3' title='嵌套路由'>
            <Menu.Item index='nestedRoute'>二级路由</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Layout.Col>
      <Layout.Col span={20} style={{ height: '100%', overflow: 'auto' }}>
        <HeadTop />
        <Outlet />
      </Layout.Col>
    </div>
  );
}
