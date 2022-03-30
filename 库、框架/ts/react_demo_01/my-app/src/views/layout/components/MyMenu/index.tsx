import { sidebar_status_recoil } from '@/store';
import { MENU_WIDTH_MAP } from '@/utils/constVal';
import { banPageScroll } from '@/utils/DOMOperation';
import { type SidebarStatus } from '@/utils/localStore';
import { Menu } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useRecoilState } from 'recoil';
import ChildMenu from './ChildMenu';
import { getMenuRouteInfo, getMenus, useSesolveMenuSelected } from './utils';
import './index.scss';

export default function MyMenu() {
  /** hook 区域 */
  const [sidebarStatus, setSidebarStatusRecoil] = useRecoilState(
    sidebar_status_recoil
  );
  const [selectedKeys, openKeys, setOpenKeys] =
    useSesolveMenuSelected(sidebarStatus);
  const collapsed = useMemo(() => {
    return sidebarStatus === 3;
  }, [sidebarStatus]);
  const marginLeft = useMemo(() => {
    return MENU_WIDTH_MAP.get(sidebarStatus) + 'px';
  }, [sidebarStatus]);
  const navigate = useNavigate();
  const oldSidebarStatus = useRef<SidebarStatus>();
  const resetScroll = useRef<() => void>();
  const location = useLocation();

  useEffect(() => {
    if (sidebarStatus === 2 && oldSidebarStatus.current !== 2) {
      // 遮罩层弹出 - 禁止滚动
      resetScroll.current = banPageScroll();
    } else if (sidebarStatus !== 2 && oldSidebarStatus.current === 2) {
      // 遮罩层取消 - 恢复滚动
      resetScroll.current?.();
    }
    oldSidebarStatus.current = sidebarStatus;
  }, [sidebarStatus]);

  /** 事件处理区域 */
  // 点击菜单进行跳转
  const handlerRoute = ({ key, keyPath }: MenuInfo) => {
    const menuRoutes = getMenuRouteInfo(key);

    if (Array.isArray(menuRoutes)) {
      const path = menuRoutes[menuRoutes.length - 1].path;

      path && navigate(path);
      if (sidebarStatus === 2 && path !== location.pathname) {
        setSidebarStatusRecoil(1);
      }
    }
  };
  // SubMenu 展开/关闭的回调 - 实时控制子菜单
  const onOpenChange = (keys: string[]) => {
    setOpenKeys([...keys]);
  };
  const maskHandler = () => {
    setSidebarStatusRecoil(1);
  };

  return (
    <>
      <div className='my_menu'>
        <Menu
          style={{ width: marginLeft }}
          /** 当前选中的菜单项 key 数组	*/
          selectedKeys={selectedKeys}
          /** 当前展开的 SubMenu 菜单项 key 数组 */
          openKeys={sidebarStatus === 3 ? undefined : openKeys}
          /** 菜单类型，现在支持垂直、水平、和内嵌模式三种 */
          mode='inline'
          /** 主题颜色 */
          theme='dark'
          /** inline 时菜单是否收起状态	 */
          inlineCollapsed={collapsed}
          /** SubMenu 展开/关闭的回调	 */
          onOpenChange={onOpenChange}
          onClick={handlerRoute}>
          {ChildMenu(getMenus())}
        </Menu>
      </div>
      {/* 嵌入式菜单 - 遮罩层 */}
      <CSSTransition
        in={sidebarStatus === 2}
        timeout={300}
        unmountOnExit
        classNames='mask_animation'>
        {<div className='menu_mask_bg' onClick={maskHandler}></div>}
      </CSSTransition>
    </>
  );
}
