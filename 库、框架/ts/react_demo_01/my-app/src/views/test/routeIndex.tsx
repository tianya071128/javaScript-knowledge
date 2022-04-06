import { Link } from 'react-router-dom';

export default function Test() {
  return (
    <div>
      这是 Test<Link to={'/test2'}>跳转</Link>
    </div>
  );
}
