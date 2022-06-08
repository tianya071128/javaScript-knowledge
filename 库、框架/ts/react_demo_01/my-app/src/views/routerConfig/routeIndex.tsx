import { type RouteInfo, deleteMenu as deleteMenuApi } from '@/api';
import { router_list_recoil } from '@/store/user';
import { Button, Popconfirm, Table } from 'antd';
import { type ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { QuestionCircleOutlined } from '@ant-design/icons';
import EditRouter, { type FormDataType } from './EditRouter';

const RouterConfig = () => {
  const [routerList, setRouterList] = useRecoilState(router_list_recoil);
  const [visible, setVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({});
  const [deleteMenuSet, setDeleteMenuSet] = useState<Set<string>>(new Set());

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
            <Button
              type='primary'
              size='small'
              onClick={editMenu.bind(null, record)}>
              编辑
            </Button>
            {record.menuType === 'A' && (
              <Button
                size='small'
                style={{ marginLeft: '10px' }}
                onClick={addChildMenu.bind(null, record)}>
                新增菜单
              </Button>
            )}
            <Popconfirm
              title='确定要删除吗？'
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText='确定'
              showCancel={false}
              onConfirm={deleteMenu.bind(null, record.id)}>
              <Button
                type='primary'
                size='small'
                danger
                style={{ marginLeft: '10px' }}
                loading={deleteMenuSet.has(record.id)}>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  // 新增顶级菜单
  const addRouter = () => {
    setVisible(true);
    setFormData({});
  };
  // 关闭遮罩回调
  const onClose = (routerList?: RouteInfo[]) => {
    if (routerList) {
      setRouterList(routerList);
    }
    setVisible(false);
  };
  // 新增二级菜单
  const addChildMenu = (parent: RouteInfo) => {
    setVisible(true);
    setFormData({ parent });
  };
  // 删除菜单
  const deleteMenu = (id: string) => {
    if (deleteMenuSet.has(id)) return; // 不要重复删除
    setDeleteMenuSet(new Set(deleteMenuSet.add(id)));

    // 调用接口，删除 - 不使用 async/await 语法，因为 antd 的 Popconfirm 组件返回了 Promise 的话，那么就会等待 Promise 结束才关闭气泡
    deleteMenuApi({ id }).then((data) => {
      deleteMenuSet.delete(id);
      setDeleteMenuSet(new Set(deleteMenuSet));
      setRouterList(data.router_info);
    });
  };
  // 编辑菜单
  const editMenu = (routerInfo: RouteInfo) => {
    setVisible(true);
    setFormData({ ...routerInfo });
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

export default RouterConfig;
