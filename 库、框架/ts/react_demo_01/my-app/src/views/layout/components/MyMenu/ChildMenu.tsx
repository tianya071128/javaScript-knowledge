import { Menu } from 'antd';
import MyIcons from '@/icons';
import { Menus } from './utils';
import { MENU_DEFAULT_ICON } from '@/utils/constVal';

/**
 * 递归渲染子菜单
 * 注意：这里还不能改动为函数式组件，似乎是 Menu 问题
 * tip：还可以考虑下循环引用的问题
 */
export default function ChildMenu(menus: Menus[]) {
  return (
    <>
      {menus.map(({ title, children, id, icon, hidden }) => {
        if (Array.isArray(children)) {
          // 嵌套菜单渲染
          return (
            <Menu.SubMenu
              key={id}
              icon={<MyIcons iconClass={icon || MENU_DEFAULT_ICON} />}
              title={title}>
              {ChildMenu(children)}
            </Menu.SubMenu>
          );
        } else {
          // 单层菜单渲染
          return (
            !hidden && (
              <Menu.Item
                key={id}
                icon={<MyIcons iconClass={icon || MENU_DEFAULT_ICON} />}>
                {title}
              </Menu.Item>
            )
          );
        }
      })}
    </>
  );
}
