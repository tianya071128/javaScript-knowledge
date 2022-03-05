import { Outlet } from 'react-router-dom';
import MyMenu from './components/MyMenu';
import './index.scss';

export default function Layout() {
  return (
    <div className='_layout'>
      {/* 左侧菜单区 */}
      <MyMenu />
      <div style={{ marginLeft: '200px' }}>
        <div>右侧内容区</div>
        <Outlet />
      </div>
    </div>
  );
}
