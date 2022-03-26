import { sidebar_status_recoil } from '@/store';
import { MENU_EMBEDDED, MENU_POPUP } from '@/utils/constVal';
import { onResize } from '@/utils/DOMEvent';
import { getSidebarStatus, setSidebarStatus } from '@/utils/localStore';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';

export default function Amburger() {
  /** hook 相关 */
  const [sidebarStatus, setSidebarStatusRecoil] = useRecoilState(
    sidebar_status_recoil
  );
  const IconBalbel = useMemo(() => {
    return [1, 3].includes(sidebarStatus)
      ? MenuUnfoldOutlined
      : MenuFoldOutlined;
  }, [sidebarStatus]);
  // 初始化监听页面大小事件
  useEffect(() => {
    const isInitMent = getSidebarStatus(); // 初始化菜单时(没有切换过菜单)
    const eventDelet = onResize((w) => {
      /**
       * 1. 可视区小于 MENU_POPUP(900) 时，如果菜单模式是 3,4(嵌入式)，那么就重置为 1(弹出式收起)
       * 2. 可视区大于 MENU_POPUP(900)，并且小于 MENU_EMBEDDED(1200) 时
       */
      if (w <= MENU_POPUP) {
        if ([3, 4].includes(sidebarStatus)) {
          setSidebarStatusRecoil(sidebarStatus === 3 ? 1 : 2);
        }
      } else if (w <= MENU_EMBEDDED) {
        if (
          [1, 2].includes(sidebarStatus) ||
          ([4].includes(sidebarStatus) && isInitMent === null)
        ) {
          setSidebarStatusRecoil(3);
        }
      } else {
        if (isInitMent === null) {
          setSidebarStatusRecoil(4);
        } else if ([1, 2].includes(sidebarStatus)) {
          setSidebarStatusRecoil(sidebarStatus === 1 ? 3 : 4);
        }
      }
    });
    return () => {
      eventDelet();
    };
  }, [sidebarStatus, setSidebarStatusRecoil]);

  /** 事件处理器 */
  function handlerClick() {
    const map = [2, 1, 4, 3] as const;
    setSidebarStatusRecoil(map[sidebarStatus - 1]);
    setSidebarStatus(map[sidebarStatus - 1]);
  }

  return (
    <div className='nav_amburger' onClick={handlerClick}>
      <IconBalbel style={{ fontSize: '20px' }} />
    </div>
  );
}
