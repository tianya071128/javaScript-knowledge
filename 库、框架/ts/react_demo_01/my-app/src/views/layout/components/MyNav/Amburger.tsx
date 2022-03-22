import { onResize } from '@/utils/DOMEvent';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

export default function Amburger() {
  // 初始化监听页面大小事件
  useEffect(() => {
    const eventDelet = onResize(
      (w) => {
        console.log(w);
      },
      { immediate: true }
    );
    return () => {
      eventDelet();
    };
  }, []);

  return (
    <div className='nav_amburger'>
      <MenuUnfoldOutlined style={{ fontSize: '20px' }} />
    </div>
  );
}
