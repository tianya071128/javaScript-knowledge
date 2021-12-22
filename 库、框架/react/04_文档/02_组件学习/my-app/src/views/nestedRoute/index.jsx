import { Link, Outlet } from 'react-router-dom';

export default function NestedRoute() {
  return (
    <div>
      <Link to='threeRoute'>跳转嵌套路由</Link>
      <Outlet />
    </div>
  );
}
