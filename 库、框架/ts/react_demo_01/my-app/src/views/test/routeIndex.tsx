import { type RouteInfo } from '@/api';
import { router_list_recoil } from '@/store/user';
import { Button, Table } from 'antd';
import { type ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import EditRouter, { type FormDataType } from './EditRouter';

// 表格列配置
const columns: ColumnsType<RouteInfo> = [
  {
    title: '菜单名',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '文件路径',
    dataIndex: 'element',
    key: 'element',
    width: '20%',
  },
  {
    title: '路径',
    dataIndex: 'path',
    width: '20%',
    key: 'path',
  },
  {
    title: '',
    dataIndex: 'operation',
    width: '25%',
    render(_: any, record: RouteInfo) {
      return (
        <>
          <Button type='primary' size='small'>
            编辑
          </Button>
          <Button
            type='primary'
            size='small'
            danger
            style={{ marginLeft: '10px' }}>
            删除
          </Button>
        </>
      );
    },
  },
];

const App = () => {
  const [routerList, setRouterList] = useRecoilState(router_list_recoil);
  const [visible, setVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({});

  // 新增顶级菜单
  const addRouter = () => {
    setVisible(true);
    setFormData({});
  };
  // 关闭遮罩回调
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Table
        title={() => (
          <Button type='primary' onClick={addRouter}>
            新增菜单
          </Button>
        )}
        /** 主键 */
        rowKey='id'
        /** 表格列的配置描述 */
        columns={columns}
        /** 数据数组 */
        dataSource={routerList || []}
      />
      <EditRouter visible={visible} onClose={onClose} initFormData={formData} />
    </>
  );
};

export default App;
