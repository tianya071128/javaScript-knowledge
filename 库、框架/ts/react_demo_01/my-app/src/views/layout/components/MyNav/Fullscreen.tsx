import MyIcons from '@/icons';
import { useEffect, useState } from 'react';
import screenfull from 'screenfull';

export default function Fullscreen() {
  const isEnabled = useState<boolean>(screenfull.isFullscreen); // 是否支持全屏 API
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    screenfull.isFullscreen
  );
  useEffect(() => {
    if (!isEnabled) return;
    let callback: () => void;
    screenfull.on(
      'change',
      (callback = () => {
        setIsFullscreen(screenfull.isFullscreen);
      })
    );
    return () => screenfull.off('change', callback);
  }, [isEnabled]);

  // 事件处理者
  const handlerFullscreen = () => {
    screenfull.toggle();
  };

  if (!isEnabled) return null;
  return (
    <div className='nav_item full_screen' onClick={handlerFullscreen}>
      {!isFullscreen ? (
        <MyIcons iconClass='FullscreenOutlined' style={{ fontSize: '22px' }} />
      ) : (
        <MyIcons
          iconClass='FullscreenExitOutlined'
          style={{ fontSize: '22px' }}
        />
      )}
    </div>
  );
}
