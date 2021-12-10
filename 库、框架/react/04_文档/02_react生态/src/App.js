import { Link, Routes, Route } from 'react-router-dom';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';

import './App.css';
import Expenses from './views/expenses';
import Invoices from './views/invoices';
import Invoice from './views/invoice';

const { SubMenu } = Menu;

function App() {
  const onSelectMenu = (item) => {
    console.log(item);
  };
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '256px', height: '100vh' }}>
        <Menu
          defaultSelectedKeys={['5']}
          mode='inline'
          theme='dark'
          style={{ height: '100vh' }}
          onSelect={onSelectMenu}>
          <Menu.Item key='invoices' icon={<PieChartOutlined />}>
            <Link to='/invoices'>发票</Link>
          </Menu.Item>
          <Menu.Item key='expenses' icon={<DesktopOutlined />}>
            <Link to='/expenses'>费用</Link>
          </Menu.Item>
          <Menu.Item key='3' icon={<ContainerOutlined />}>
            Option 3
          </Menu.Item>
          <SubMenu key='sub1' icon={<MailOutlined />} title='Navigation One'>
            <Menu.Item key='5'>Option 5</Menu.Item>
            <Menu.Item key='6'>Option 6</Menu.Item>
            <Menu.Item key='7'>Option 7</Menu.Item>
            <Menu.Item key='8'>Option 8</Menu.Item>
          </SubMenu>
          <SubMenu
            key='sub2'
            icon={<AppstoreOutlined />}
            title='Navigation Two'>
            <Menu.Item key='9'>Option 9</Menu.Item>
            <Menu.Item key='10'>Option 10</Menu.Item>
            <SubMenu key='sub3' title='Submenu'>
              <Menu.Item key='11'>Option 11</Menu.Item>
              <Menu.Item key='12'>Option 12</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
      </div>
      <div>
        <Routes>
          <Route path='/expenses' element={<Expenses />} />
          <Route path='/invoices' element={<Invoices />}>
            <Route path=':invoiceId' element={<Invoice />} />
            {/* 类似于 path: ""， 当没有匹配路由的时候会渲染这个 */}
            <Route
              index
              element={
                <main style={{ padding: '1rem' }}>
                  <p>选择一个发票</p>
                </main>
              }
            />
          </Route>
          <Route
            path='*'
            element={
              <main style={{ padding: '1rem' }}>
                <p>这里什么都没有</p>
              </main>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
