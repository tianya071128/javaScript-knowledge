import { Breadcrumb } from 'antd';
import { getMenus, useGetRouteMenu } from '../MyMenu/utils';
import { Link } from 'react-router-dom';
import MyIcons from '@/icons';

export default function NavBreadcrumb() {
  const menuRoutes = useGetRouteMenu();
  const menus = getMenus();
  const homeMenu = menus[0];

  // 如果不是首页，那么添加一个首页
  if (!menuRoutes.some((item) => item.id === homeMenu.id)) {
    menuRoutes.unshift({
      ...homeMenu,
    });
  }

  return (
    <Breadcrumb style={{ marginLeft: '10px' }}>
      {menuRoutes.map(({ title, path, id }, i) => {
        return (
          <Breadcrumb.Item key={id}>
            {path && i !== menuRoutes.length - 1 ? (
              <Link to={path}>
                {homeMenu.id === id ? (
                  <MyIcons iconClass='HomeOutlined' />
                ) : (
                  title
                )}
              </Link>
            ) : homeMenu.id === id ? (
              <MyIcons iconClass='HomeOutlined' />
            ) : (
              title
            )}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
