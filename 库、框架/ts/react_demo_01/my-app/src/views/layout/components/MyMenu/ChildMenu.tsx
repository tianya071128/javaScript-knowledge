import { Menus } from '@/store/user';
import { HeartTwoTone } from '@ant-design/icons';
// import * as Icons from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { Menu } from 'antd';
import MyIcons from '@/icons';

/**
 * 递归渲染子菜单
 * 注意：这里还不能改动为函数式组件，似乎是 Menu 问题
 * tip：还可以考虑下循环引用的问题
 */
export default function ChildMenu(menus: Menus[]) {
  return (
    <>
      {menus.map(({ title, children, id }) => {
        if (Array.isArray(children)) {
          // 嵌套菜单渲染
          return (
            <Menu.SubMenu
              key={id}
              icon={
                <Icon
                  component={() => {
                    return MyIcons({ iconClass: 'bug' });
                  }}
                />
              }
              title={title}>
              {ChildMenu(children)}
            </Menu.SubMenu>
          );
        } else {
          // 单层菜单渲染
          return (
            <Menu.Item key={id} icon={<HeartTwoTone twoToneColor='#eb2f96' />}>
              {title}
            </Menu.Item>
          );
        }
      })}
    </>
  );
}
