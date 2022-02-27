import { login } from '@/api';

async function sendLogin() {
  const data = await login({
    user_id: 'admin',
    user_pwd: '123456',
  });

  // data.isError;
}

function App() {
  return <div onClick={sendLogin}>发送请求</div>;
}

export default App;
