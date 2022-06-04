import MyIcons from '@/icons';
import { router_list_recoil } from '@/store/user';
import { getLocalStore } from '@/utils/localStore';
import { Dropdown, Menu } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

type LanguageType = 'zh-CN' | 'en';

export default function Language() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<LanguageType>(
    getLocalStore('i18nextLng')
  );
  const [routerList, setRouterList] = useRecoilState(router_list_recoil);

  const handlerSwith = ({ key }: MenuInfo) => {
    setLanguage(key as LanguageType);
    i18n.changeLanguage(key);
    setRouterList(JSON.parse(JSON.stringify(routerList)));
  };

  const menu = (
    <Menu
      onClick={handlerSwith}
      items={[
        {
          label: '中文',
          key: 'zh-CN',
          disabled: language === 'zh-CN',
        },
        {
          label: 'English',
          key: 'en',
          disabled: language === 'en',
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
