import { useState } from 'react';
import { Menu } from 'antd';
import { PieChartOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useCustomRoutes } from '@/router';
import './index.scss';

/** 类型声明 start */
interface MenuTS {
  /** 唯一标识 */
  id: string;
  /** 菜单名 */
  name: string;
  /** 菜单跳转路径 */
  path?: string;
  /** 嵌套菜单 */
  children?: MenuTS[];
}
/** 类型声明 end */

const menus: MenuTS[] = [
  {
    path: '/',
    id: '1',
    name: '首页',
  },
  {
    name: '嵌套路由',
    id: '6',
    children: [
      {
        id: '2',
        path: '/test1',
        name: '嵌套路由1',
      },
      {
        id: '3',
        path: '/test2',
        name: '嵌套路由2',
      },
      {
        id: '4',
        name: '深度嵌套',
        children: [
          {
            id: '5',
            path: '/test3',
            name: '深度嵌套2',
          },
        ],
      },
    ],
  },
];

/**
 * 递归渲染子菜单
 * tip：还可以考虑下循环引用的问题
 */
function ChildMenu(menus: MenuTS[]) {
  return (
    <>
      {menus.map(({ name, children, id }) => {
        if (Array.isArray(children)) {
          // 嵌套菜单渲染
          return (
            <Menu.SubMenu key={id} icon={<MailOutlined />} title={name}>
              {ChildMenu(children)}
            </Menu.SubMenu>
          );
        } else {
          // 单层菜单渲染
          return (
            <Menu.Item key={id} icon={<PieChartOutlined />}>
              {name}
            </Menu.Item>
          );
        }
      })}
    </>
  );
}

/**
 * 加载菜单选中项
 */
function useSesolveMenuSelected() {
  // 当前选中的菜单项 key 数组
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // 当前展开的 SubMenu 菜单项 key 数组
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // 当前路由对应的注册路由信息
  const match = useCustomRoutes();

  if (match !== null) {
    const currentRote = match[0].route.meta;
  } else {
    // 没有匹配路由 - 一般不会，兼容一下
    setSelectedKeys([]);
    setOpenKeys([]);
  }
  console.log(match);
}

export default function MyMenu() {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handlerRoute = ({ key, keyPath }: MenuInfo) => {
    console.log(key, keyPath);
  };

  return (
    <div className='my_menu' style={{ width: collapsed ? '80px' : '200px' }}>
      <div className='menu_search'>搜索菜单</div>
      <Menu
        /** 当前选中的菜单项 key 数组	*/
        selectedKeys={['5']}
        /** 当前展开的 SubMenu 菜单项 key 数组 */
        // openKeys={['sub1']}
        /** 菜单类型，现在支持垂直、水平、和内嵌模式三种 */
        mode='inline'
        /** 主题颜色 */
        theme='dark'
        /** inline 时菜单是否收起状态	 */
        inlineCollapsed={collapsed}
        onClick={handlerRoute}>
        {ChildMenu(menus)}
      </Menu>
    </div>
  );
}
