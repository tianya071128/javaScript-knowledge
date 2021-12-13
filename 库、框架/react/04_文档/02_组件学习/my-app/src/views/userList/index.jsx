import { Pagination, Table } from 'element-react';
import { useEffect, useState } from 'react';

import { getUserList, getUserCount } from '../../api/getData';
import './userList.css';

function usePagination() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  useEffect(async () => {
    const countData = await getUserCount();
    if (countData.status == 1) {
      setCount(countData.count);
    } else {
      throw new Error('获取数据失败');
    }
  }, []);

  return [count, limit, currentPage, setCurrentPage];
}

export default function UserList() {
  const columns = [
    {
      label: '#',
      prop: 'index',
      width: '100',
    },
    {
      label: '注册日期',
      prop: 'registe_time',
      width: '220',
    },
    {
      label: '用户姓名',
      prop: 'username',
      width: '220',
    },
    {
      label: '注册地址',
      prop: 'city',
    },
  ];
  const [data, setData] = useState([]);
  const [count, limit, currentPage, setCurrentPage] = usePagination();

  useEffect(async () => {
    const data = await getUserList({
      offset: (currentPage - 1) * limit,
      limit,
    });

    setData(
      data.map((item, index) => ({
        index: index + 1,
        username: item.username,
        registe_time: item.registe_time,
        city: item.city,
      }))
    );
  }, [currentPage]);

  const handleCurrentChange = (val) => {
    setCurrentPage(val);
  };

  return (
    <div className='tabel_container'>
      <Table
        style={{ width: '100%' }}
        columns={columns}
        data={data}
        highlight-current-row
      />
      <div style={{ 'text-align': 'left', 'margin-top': '20px' }}>
        <Pagination
          layout='total, prev, pager, next'
          total={count}
          pageSize={20}
          currentPage={currentPage}
          onCurrentChange={handleCurrentChange}
        />
      </div>
    </div>
  );
}
