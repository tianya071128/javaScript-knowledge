import { Dispatch, SetStateAction, useState } from 'react';
import { Menu } from 'antd';
import { PieChartOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useCustomRoutes } from '@/router';
import './index.scss';
import { cache } from '@/utils';
import { useNavigate } from 'react-router-dom';

/** 类型声明 start */
interface MenuTS {
  /** 唯一标识 */
  id: string;
  /** 菜单名 */
  title: string;
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
    title: '首页',
  },
  {
    title: '嵌套路由',
    id: '6',
    children: [
      {
        id: '2',
        path: '/test1',
        title: '嵌套路由1',
      },
      {
        id: '3',
        path: '/test2',
        title: '嵌套路由2',
      },
      {
        id: '4',
        title: '深度嵌套',
        children: [
          {
            id: '5',
            path: '/test3',
            title: '深度嵌套2',
          },
        ],
      },
    ],
  },
  {
    title: '嵌套路由',
    id: '7',
    children: [
      {
        id: '8',
        title: '深度嵌套',
        children: [
          {
            id: '9',
            path: '/test4',
            title: '深度嵌套2',
          },
        ],
      },
    ],
  },
];

/**
 * 根据 id 查找菜单列表
 */
const getMenuRouteInfo = cache(function (id: string) {
  let result: MenuTS[] | undefined;
  const recursion = function (menus: MenuTS[], routes: MenuTS[]) {
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
 * 递归渲染子菜单
 * tip：还可以考虑下循环引用的问题
 */
function ChildMenu(menus: MenuTS[]) {
  return (
    <>
      {menus.map(({ title, children, id }) => {
        if (Array.isArray(children)) {
          // 嵌套菜单渲染
          return (
            <Menu.SubMenu key={id} icon={<MailOutlined />} title={title}>
              {ChildMenu(children)}
            </Menu.SubMenu>
          );
        } else {
          // 单层菜单渲染
          return (
            <Menu.Item key={id} icon={<PieChartOutlined />}>
              {title}
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
function useSesolveMenuSelected(): [
  string[],
  string[],
  Dispatch<SetStateAction<string[]>>
] {
  // 当前选中的菜单项 key 数组
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // 当前展开的 SubMenu 菜单项 key 数组
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // 当前路由对应的注册路由信息
  const match = useCustomRoutes();

  let _selectedKeys: string[] = [];
  let _openKeys: string[] = [];

  if (match !== null) {
    const currentRoute = match[match.length - 1].route.meta;
    let id: string | undefined; // 选中菜单的 id;
    if (
      ((id = currentRoute?.activeMenu) || (id = currentRoute?.id)) &&
      id !== selectedKeys[0] // 只有当路由变化时才需要重新计算，似乎可以使用 useEffect 更好的完成
    ) {
      // 根据 id 查找出选中的菜单项和展开的菜单项
      const menuRoutes = getMenuRouteInfo(id) || [];
      _selectedKeys.push(id);
      menuRoutes.forEach(({ id: childId }) => {
        if (childId !== id) {
          _openKeys.push(childId);
        }
      });
      setSelectedKeys(_selectedKeys);
      setOpenKeys([...new Set([..._openKeys, ...openKeys])]);
    }
  }
  return [selectedKeys, openKeys, setOpenKeys];
}

export default function MyMenu() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKeys, openKeys, setOpenKeys] = useSesolveMenuSelected();
  const navigate = useNavigate();

  // 点击菜单进行跳转
  const handlerRoute = ({ key, keyPath }: MenuInfo) => {
    const menuRoutes = getMenuRouteInfo(key);

    if (Array.isArray(menuRoutes)) {
      const path = menuRoutes[menuRoutes.length - 1].path;

      path && navigate(path);
    }
  };

  // SubMenu 展开/关闭的回调 - 实时控制子菜单
  const onOpenChange = (keys: string[]) => {
    setOpenKeys([...keys]);
  };

  return (
    <div className='my_menu' style={{ width: collapsed ? '80px' : '200px' }}>
      <div className='menu_search'>搜索菜单</div>
      <Menu
        /** 当前选中的菜单项 key 数组	*/
        selectedKeys={selectedKeys}
        /** 当前展开的 SubMenu 菜单项 key 数组 */
        openKeys={openKeys}
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
      </Menu>
    </div>
  );
}
