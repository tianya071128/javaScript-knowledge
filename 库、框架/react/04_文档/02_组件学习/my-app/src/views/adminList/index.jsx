import { Pagination, Table } from 'element-react';
import { useEffect, useState } from 'react';

import { adminList, adminCount } from '../../api/getData';
const columns = [
  {
    label: '姓名',
    prop: 'user_name',
    width: '180',
  },
  {
    label: '注册日期',
    prop: 'create_time',
    width: '220',
  },
  {
    label: '地址',
    width: '180',
    prop: 'city',
  },
  {
    label: '权限',
    prop: 'admin',
  },
];
function usePagination() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    (async function getCount() {
      const countData = await adminCount();
      if (countData.status === 1) {
        setCount(countData.count);
      }
    })();
  }, []);

  return [count, limit, currentPage, setCurrentPage];
}

export default function OrderList() {
  const [data, setData] = useState([]);
  const [count, limit, currentPage, setCurrentPage] = usePagination();

  useEffect(() => {
    (async function getData() {
      const res = await adminList({
        offset: (currentPage - 1) * limit,
        limit,
      });

      if (res.status === 1) {
        Array.isArray(res.data) &&
          setData(
            res.data.map((item) => ({
              create_time: item.create_time,
              user_name: item.user_name,
              admin: item.admin,
              city: item.city,
            }))
          );
      }
    })();
  }, [currentPage, limit]);

  return (
    <div className='tabel_container'>
      <Table
        style={{ width: '100%' }}
        columns={columns}
        data={data}
        highlight-current-row
      />
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <Pagination
          layout='total, prev, pager, next'
          total={count}
          pageSize={20}
          currentPage={currentPage}
          onCurrentChange={(val) => {
            setCurrentPage(val);
          }}
        />
      </div>
    </div>
  );
}
