import { sidebar_status_recoil } from '@/store';
import { MENU_WIDTH_MAP } from '@/utils/constVal';
import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import MyMenu from './components/MyMenu';
import MyNav from './components/MyNav';
import './index.scss';

export default function Layout() {
  const sidebarStatus = useRecoilValue(sidebar_status_recoil);
  const marginLeft = useMemo(() => {
    return (sidebarStatus === 2 ? 0 : MENU_WIDTH_MAP.get(sidebarStatus)) + 'px';
  }, [sidebarStatus]);
  return (
    <div className='_layout'>
      {/* 左侧菜单区 */}
      <MyMenu />
      <div className='layout_content' style={{ marginLeft }}>
        {/* 右侧 nav */}
        <MyNav />
        <Outlet />
      </div>
    </div>
  );
}
