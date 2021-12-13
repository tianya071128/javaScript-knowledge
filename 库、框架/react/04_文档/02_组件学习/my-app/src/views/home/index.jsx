import { useEffect, useState } from 'react';
import dtime from 'time-formater';
import {
  userCount,
  orderCount,
  getUserCount,
  getOrderCount,
  adminDayCount,
  adminCount,
} from '../../api/getData';

import './home.css';

export default function Home() {
  const [userCountNum, setUserCount] = useState(0);
  const [orderCountNum, setOrderCountNum] = useState(0);
  const [adminCountNum, setAdminCountNum] = useState(0);
  const [allUserCount, setAllUserCount] = useState(0);
  const [allOrderCount, setAllOrderCountm] = useState(0);
  const [allAdminCount, setAllAdminCount] = useState(0);

  useEffect(async () => {
    const today = dtime().format('YYYY-MM-DD');
    const promiseAll = [
      userCount(today),
      orderCount(today),
      adminDayCount(today),
      getUserCount(),
      getOrderCount(),
      adminCount(),
    ];
    const dataList = await Promise.all(promiseAll);

    setUserCount(dataList[0].count);
    setOrderCountNum(dataList[1].count);
    setAdminCountNum(dataList[2].count);
    setAllUserCount(dataList[3].count);
    setAllOrderCountm(dataList[4].count);
    setAllAdminCount(dataList[5].count);
  }, []);

  return (
    <section className='data_section'>
      <header className='section_title'>数据统计</header>
      <div className='same_day' style={{ marginBottom: '15px' }}>
        <div className='data_list today_head'>
          <span className='data_num data_head'>当日数据:</span>
        </div>
        <div className='data_list'>
          <span className='data_num'>{userCountNum}</span>新增用户
        </div>
        <div className='data_list'>
          <span className='data_num'>{orderCountNum}</span>新增订单
        </div>
        <div className='data_list'>
          <span className='data_num'>{adminCountNum}</span>新增管理员
        </div>
      </div>
      <div className='same_day'>
        <div className='data_list all_head'>
          <span className='data_num data_head'>当日数据:</span>
        </div>
        <div className='data_list'>
          <span className='data_num'>{allUserCount}</span>新增用户
        </div>
        <div className='data_list'>
          <span className='data_num'>{allOrderCount}</span>新增订单
        </div>
        <div className='data_list'>
          <span className='data_num'>{allAdminCount}</span>新增管理员
        </div>
      </div>
    </section>
  );
}
