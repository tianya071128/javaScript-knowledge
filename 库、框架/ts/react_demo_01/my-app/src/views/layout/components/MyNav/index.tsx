import Amburger from './Amburger';
import NavBreadcrumb from './NavBreadcrumb';

import './index.scss';
import SearchMenu from './SearchMenu';

export default function MyNav() {
  return (
    <div className='my_nav'>
      <div className='nav_left'>
        <Amburger />
        <NavBreadcrumb />
      </div>
      <div className='nav_right'>
        <SearchMenu />
      </div>
    </div>
  );
}
