import { MENU_EMBEDDED, MENU_POPUP } from '@/utils/constVal';
import { getSidebarStatus, type SidebarStatus } from '@/utils/localStore';
import { atom } from 'recoil';

export const sidebar_status_recoil = atom<SidebarStatus>({
  key: 'sidebar_status',
  default: (function () {
    const sidebar = getSidebarStatus();
    const w = document.documentElement.clientWidth;

    if (sidebar === null) {
      // 没有初始值时，由可视区决定
      return w <= MENU_POPUP ? 1 : w <= MENU_EMBEDDED ? 3 : 4;
    } else {
      // 由初始值决定
      return w <= MENU_POPUP ? 1 : [2, 4].includes(sidebar) ? 4 : 3;
    }
  })(),
});
