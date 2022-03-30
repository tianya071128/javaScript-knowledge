import Amburger from './Amburger';
import NavBreadcrumb from './NavBreadcrumb';

import './index.scss';

export default function MyNav() {
  return (
    <div className='my_nav'>
      <div className='nav_left'>
        <Amburger />
        <NavBreadcrumb />
      </div>
    </div>
  );
}
