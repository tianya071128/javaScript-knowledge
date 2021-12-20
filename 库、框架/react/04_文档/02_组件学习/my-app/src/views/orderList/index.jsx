import { Form, Loading, Pagination, Table } from 'element-react';
import { useEffect, useState } from 'react';

import {
  getOrderList,
  getOrderCount,
  getResturantDetail,
  getUserInfo,
  getAddressById,
} from '../../api/getData';
const cacheOrderDetails = {};
const columns = [
  {
    type: 'expand',
    expandPannel: function (data) {
      return (
        <Loading loading={!cacheOrderDetails[data.id]}>
          <Form
            labelPosition='left'
            inline={true}
            className='demo-table-expand'>
            <Form.Item label='用户名'>
              <span>{data.user_name}</span>
            </Form.Item>
            <Form.Item label='店铺名称'>
              <span>{data.restaurant_name}</span>
            </Form.Item>
            <Form.Item label='收货地址'>
              <span>{data.address}</span>
            </Form.Item>
            <Form.Item label='店铺 ID'>
              <span>{data.restaurant_id}</span>
            </Form.Item>
            <Form.Item label='店铺地址'>
              <span>{data.restaurant_address}</span>
            </Form.Item>
          </Form>
        </Loading>
      );
    },
  },
  {
    label: '订单 ID',
    prop: 'id',
    width: '220',
  },
  {
    label: '总价格',
    prop: 'total_amount',
    width: '220',
  },
  {
    label: '订单状态',
    prop: 'status',
  },
];
function usePagination() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    (async function getCount() {
      const countData = await getOrderCount();
      if (countData.status === 1) {
        setCount(countData.count);
      }
    })();
  }, []);

  return [count, limit, currentPage, setCurrentPage];
}

export default function OrderList(params) {
  const [data, setData] = useState([]);
  const [expendRow, setExpendRow] = useState([]);
  const [count, limit, currentPage, setCurrentPage] = usePagination();

  const onExpand = async (row, status) => {
    if (status) {
      setExpendRow([...expendRow, row.index]);
    } else {
      const s = new Set(expendRow);
      s.delete(row.index);

      setExpendRow([...s]);
    }

    if (status && !cacheOrderDetails[row.id]) {
      const restaurant = await getResturantDetail(row.restaurant_id);
      const userInfo = await getUserInfo(row.user_id);
      const addressInfo = await getAddressById(row.address_id);
      const newData = [...data];

      newData.splice(row.index, 1, {
        ...row,
        ...(cacheOrderDetails[row.id] = {
          restaurant_name: restaurant.name,
          restaurant_address: restaurant.address,
          address: addressInfo.address,
          user_name: userInfo.username,
        }),
      });
      setData(newData);
    }
  };

  useEffect(() => {
    (async function getData() {
      const data = await getOrderList({
        offset: (currentPage - 1) * limit,
        limit,
      });

      setData(
        data.map((item, index) => ({
          id: item.id,
          total_amount: item.total_amount,
          status: item.status_bar.title,
          user_id: item.user_id,
          restaurant_id: item.restaurant_id,
          address_id: item.address_id,
          index: index,
          ...(cacheOrderDetails[item.id] ?? {}),
        }))
      );
    })();
  }, [currentPage, limit]);

  return (
    <div className='tabel_container'>
      <Table
        style={{ width: '100%' }}
        columns={columns}
        data={data}
        highlight-current-row
        onExpand={onExpand}
        expandRowKeys={expendRow}
      />
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <Pagination
          layout='total, prev, pager, next'
          total={count}
          pageSize={20}
          currentPage={currentPage}
          onCurrentChange={(val) => {
            setExpendRow([]);
            setCurrentPage(val);
          }}
        />
      </div>
    </div>
  );
}
