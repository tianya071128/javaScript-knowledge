import MyIcons from '@/icons';
import { Dropdown, Menu } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';

export default function Language() {
  const handlerSwith = ({ key }: MenuInfo) => {
    console.log(key);
  };

  const menu = (
    <Menu
      onClick={handlerSwith}
      items={[
        {
          label: '中文',
          key: '0',
          disabled: true,
        },
        {
          label: 'English',
          key: '1',
        },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu} placement='bottomRight' trigger={['click']} arrow>
      <div className='nav_item'>
        <MyIcons iconClass='language' style={{ fontSize: '22px' }} />
      </div>
    </Dropdown>
  );
}
