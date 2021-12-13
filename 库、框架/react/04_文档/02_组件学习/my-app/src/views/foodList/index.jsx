import { Button, Form, Message, Pagination, Table } from 'element-react';
import { useEffect, useState } from 'react';

import { getFoods, getFoodsCount, deleteFood } from '../../api/getData';
import './foodList.css';

function usePagination() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  useEffect(async () => {
    const countData = await getFoodsCount();
    if (countData.status == 1) {
      setCount(countData.count);
    } else {
      throw new Error('获取数据失败');
    }
  }, []);

  return [count, limit, currentPage, setCurrentPage];
}

function Operation({ itemId: id }) {
  const handleDelete = async () => {
    const res = await deleteFood(id);

    if (res.status !== 1) {
      Message({
        message: '删除食品成功',
        type: 'success',
      });
      // 重新获取总数, 数据
    } else {
      Message.error(res.message);
    }
  };

  return (
    <span>
      <Button size='small'>编辑</Button>
      <Button size='small' type='danger' onClick={handleDelete}>
        删除
      </Button>
    </span>
  );
}

export default function FoodList(props) {
  const columns = [
    {
      type: 'expand',
      expandPannel: function (data) {
        return (
          <Form
            labelPosition='left'
            inline={true}
            className='demo-table-expand'>
            <Form.Item label='食品名称'>
              <span>{data.name}</span>
            </Form.Item>
            <Form.Item label='餐馆名称'>
              <span>{data.restaurant_name}</span>
            </Form.Item>
            <Form.Item label='食品 ID'>
              <span>{data.item_id}</span>
            </Form.Item>
            <Form.Item label='餐馆 ID'>
              <span>{data.restaurant_id}</span>
            </Form.Item>
            <Form.Item label='食品介绍'>
              <span>{data.description}</span>
            </Form.Item>
            <Form.Item label='餐馆地址'>
              <span>{data.restaurant_address}</span>
            </Form.Item>
            <Form.Item label='食品评分'>
              <span>{data.rating}</span>
            </Form.Item>
            <Form.Item label='食品分类'>
              <span>{data.category_name}</span>
            </Form.Item>
            <Form.Item label='月销量'>
              <span>{data.month_sales}</span>
            </Form.Item>
          </Form>
        );
      },
    },
    {
      label: '食品名称',
      prop: 'name',
    },
    {
      label: '食品介绍',
      prop: 'description',
    },
    {
      label: '评分',
      prop: 'rating',
    },
    {
      label: '操作',
      width: 160,
      render: (row, column, index) => {
        return <Operation itemId={row.item_id} />;
      },
    },
  ];
  const [data, setData] = useState([]);
  const [count, limit, currentPage, setCurrentPage] = usePagination();

  useEffect(async () => {
    const data = await getFoods({
      offset: (currentPage - 1) * limit,
      limit,
    });

    setData(
      data.map((item) => ({
        name: item.name,
        item_id: item.item_id,
        description: item.description,
        rating: item.rating,
        month_sales: item.month_sales,
        restaurant_id: item.restaurant_id,
        category_id: item.category_id,
        image_path: item.image_path,
        specfoods: item.specfoods,
        index: item.index,
      }))
    );
  }, [currentPage]);

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
          onCurrentChange={(val) => setCurrentPage(val)}
        />
      </div>
    </div>
  );
}
