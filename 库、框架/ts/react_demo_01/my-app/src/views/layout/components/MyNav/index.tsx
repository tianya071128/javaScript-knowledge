import Amburger from './Amburger';
import NavBreadcrumb from './NavBreadcrumb';

import './index.scss';
import SearchMenu from './SearchMenu';
import Fullscreen from './Fullscreen';
import Language from './Language';

export default function MyNav() {
  return (
    <div className='my_nav'>
      <div className='nav_left'>
        {/* 菜单收缩 */}
        <Amburger />
        {/* 面包屑 */}
        <NavBreadcrumb />
      </div>
      <div className='nav_right'>
        {/* 搜索菜单 */}
        <SearchMenu />
        {/* 全屏 */}
        <Fullscreen />
        {/* 国际化 */}
        <Language />
      </div>
    </div>
  );
}
