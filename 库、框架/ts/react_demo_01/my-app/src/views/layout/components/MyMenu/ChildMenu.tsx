import * as Icons from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { Menu } from 'antd';
import MyIcons, { svgNames } from '@/icons';
import { Menus } from './utils';

// 获取图标方法
function getIcon(icon?: string) {
  let AntdIcons: typeof Icons.CloudSyncOutlined;
  if (!icon) {
    // 返回默认图标
    return () => <Icons.CloudSyncOutlined />;
  } else if ((AntdIcons = (Icons as any)[icon])) {
    return () => <AntdIcons />;
  } else if (svgNames.includes(icon)) {
    return () => <MyIcons iconClass={icon} />;
  } else {
    // 返回默认图标
    return () => <Icons.CloudSyncOutlined />;
  }
}

/**
 * 递归渲染子菜单
 * 注意：这里还不能改动为函数式组件，似乎是 Menu 问题
 * tip：还可以考虑下循环引用的问题
 */
export default function ChildMenu(menus: Menus[]) {
  return (
    <>
      {menus.map(({ title, children, id, icon }) => {
        if (Array.isArray(children)) {
          // 嵌套菜单渲染
          return (
            <Menu.SubMenu
              key={id}
              icon={<Icon component={getIcon(icon)} />}
              title={title}>
              {ChildMenu(children)}
            </Menu.SubMenu>
          );
        } else {
          // 单层菜单渲染
          return (
            <Menu.Item key={id} icon={<Icon component={getIcon(icon)} />}>
              {title}
            </Menu.Item>
          );
        }
      })}
    </>
  );
}
