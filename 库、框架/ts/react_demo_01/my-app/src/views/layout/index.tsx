import { login } from '@/api';
import { Outlet } from 'react-router-dom';
import MyMenu from './components/MyMenu';
import MyNav from './components/MyNav';
import './index.scss';

export default function Layout() {
  const handlerLogin = async function () {
    const data = await login({ user_id: 'admin', user_pwd: '123456' });

    console.log(data);
  };
  return (
    <div className='_layout'>
      {/* 左侧菜单区 */}
      <MyMenu />
      <div style={{ marginLeft: '200px' }}>
        {/* 右侧 nav */}
        <MyNav />
        <Outlet />
      </div>
    </div>
  );
}
