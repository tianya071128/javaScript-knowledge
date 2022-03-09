import { Navigate, useLocation } from 'react-router-dom';

export default function JumpLogin() {
  const location = useLocation();

  return (
    <Navigate
      to={`/login?form=${location.pathname + location.search + location.hash}`}
      state={location.state}
      replace
    />
  );
}
