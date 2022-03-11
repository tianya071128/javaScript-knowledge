import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

let AuthContext = React.createContext(null);

function RequireAuth({ children }) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  console.log(auth);
  return 'test';
}

export default function AutoExample(props) {
  return (
    <RequireAuth>
      <main style={{ padding: '1rem 0' }}>
        <h2>Expenses</h2>
      </main>
    </RequireAuth>
  );
}
