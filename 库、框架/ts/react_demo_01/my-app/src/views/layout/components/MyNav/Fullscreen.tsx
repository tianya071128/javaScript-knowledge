import MyIcons from '@/icons';
import { Tooltip } from 'antd';
import { useEffect } from 'react';
import screenfull from 'screenfull';

export default function Fullscreen() {
  useEffect(() => {
    screenfull.on('change', () => {
      console.log(screenfull.isFullscreen);
    });
  }, []);
  // setInterval(() => {
  //   console.log(screenfull.isFullscreen);
  // }, 1000);
  return (
    <Tooltip title='Title'>
      <div className='full_screen'>
        <MyIcons iconClass='FullscreenOutlined' style={{ fontSize: '22px' }} />
        <MyIcons
          iconClass='FullscreenExitOutlined'
          style={{ fontSize: '22px' }}
        />
      </div>
    </Tooltip>
  );
}
