import { useCustomRoutes } from '@/router';
import { sidebar_status_recoil } from '@/store';
import { menus_recoil, type Menus } from '@/store/user';
import { cache } from '@/utils';
import { MENU_WIDTH_MAP } from '@/utils/constVal';
import { banPageScroll } from '@/utils/DOMOperation';
import { type SidebarStatus } from '@/utils/localStore';

import { Menu } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useRecoilState, useRecoilValue } from 'recoil';
import ChildMenu from './ChildMenu';
import './index.scss';

/**
 * 根据 id 查找菜单列表
 */
const getMenuRouteInfo = cache(function (id: string, menus: Menus[]) {
  let result: Menus[] | undefined;
  const recursion = function (menus: Menus[], routes: Menus[]) {
    for (const menu of menus) {
      let copyRoutes = routes.slice(0);
      copyRoutes.push(menu);
      if (id === menu.id) {
        // 取得结果，结束递归
        result = copyRoutes;
        throw new Error('抛出错误，提前结束递归，取巧');
      } else if (Array.isArray(menu.children)) {
        // 存在子菜单，继续递归
        recursion(menu.children, copyRoutes);
      }
    }
  };

  try {
    recursion(menus, []);
  } catch (e) {
    if (result) {
      return result;
    }
  }
});

/**
 * 加载菜单选中项
 */
function useSesolveMenuSelected(
  menus: Menus[],
  sidebarStatus: SidebarStatus
): [string[], string[], Dispatch<SetStateAction<string[]>>] {
  // 当前选中的菜单项 key 数组
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // 当前展开的 SubMenu 菜单项 key 数组
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // 当前路由对应的注册路由信息
  const match = useCustomRoutes();
  const oldSidebarStatus = useRef(sidebarStatus);

  let _selectedKeys: string[] = [];
  let _openKeys: string[] = [];

  const currentRoute = match && match[match.length - 1].route.meta;
  let id: string | undefined; // 选中菜单的 id;
  if (
    currentRoute &&
    ((id = currentRoute?.activeMenu) || (id = currentRoute?.id)) &&
    (id !== selectedKeys[0] ||
      (oldSidebarStatus.current === 3 &&
        oldSidebarStatus.current !== sidebarStatus)) // 只有当路由变化时才需要重新计算，似乎可以使用 useEffect 更好的完成
  ) {
    // 根据 id 查找出选中的菜单项和展开的菜单项
    const menuRoutes = getMenuRouteInfo(id, menus) || [];
    _selectedKeys.push(id);
    menuRoutes.forEach(({ id: childId }) => {
      if (childId !== id) {
        _openKeys.push(childId);
      }
    });
    setSelectedKeys(_selectedKeys);

    // 根据菜单展开状态来判断需要展开的菜单项
    let totalOpenKeys: string[] = [];
    if (sidebarStatus !== 3) {
      totalOpenKeys = [...new Set([..._openKeys, ...openKeys])];
    }
    setOpenKeys(totalOpenKeys);
  }
  oldSidebarStatus.current = sidebarStatus;

  return [selectedKeys, openKeys, setOpenKeys];
}

export default function MyMenu() {
  /** hook 区域 */
  const [sidebarStatus, setSidebarStatusRecoil] = useRecoilState(
    sidebar_status_recoil
  );
  const menus = useRecoilValue(menus_recoil);
  const [selectedKeys, openKeys, setOpenKeys] = useSesolveMenuSelected(
    menus,
    sidebarStatus
  );
  const collapsed = useMemo(() => {
    return sidebarStatus === 3;
  }, [sidebarStatus]);
  const marginLeft = useMemo(() => {
    return MENU_WIDTH_MAP.get(sidebarStatus) + 'px';
  }, [sidebarStatus]);
  const navigate = useNavigate();
  const oldSidebarStatus = useRef<SidebarStatus>();
  const resetScroll = useRef<() => void>();

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
    const menuRoutes = getMenuRouteInfo(key, menus);

    if (Array.isArray(menuRoutes)) {
      const path = menuRoutes[menuRoutes.length - 1].path;

      path && navigate(path);
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
          {ChildMenu(menus)}
          {/* <ChildMenu menus={} /> */}
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
