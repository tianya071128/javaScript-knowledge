import { editRouterInfo, RouteInfo } from '@/api';
import { Form, Input, Modal, Select, message } from 'antd';
import { useEffect, useState } from 'react';

export type FormDataType = Partial<RouteInfo> & {
  menuType?: 'A' | 'B';
  parent?: RouteInfo;
};

interface EditRouterProps {
  visible: boolean;
  onClose: (routerList?: RouteInfo[]) => void;
  initFormData: FormDataType;
}

let _initialValues: FormDataType = {
  menuType: 'B',
};

// 验证规则
const rules = {
  title: [{ required: true, message: '请输入菜单名' }],
  type: [{ required: true, message: '请选择菜单类型' }],
  element: [{ required: true, message: '请输入文件路径' }],
  path: [{ required: true, message: '请输入路径' }],
};

// 菜单类型
const menuTypes = [
  { label: '子菜单', value: 'A' },
  { label: '路由菜单', value: 'B' },
];

export default function EditRouter({
  visible,
  onClose,
  initFormData,
}: EditRouterProps) {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [initialValues, setInitiaValues] =
    useState<FormDataType>(_initialValues);
  const [typeDisabled, setTypeDisabled] = useState<boolean>(false);
  const [form] = Form.useForm<FormDataType>();
  const watchMenuType = Form.useWatch('menuType', form);

  useEffect(() => {
    // 先不禁用选择菜单类型，只有在编辑子菜单时才禁用
    setTypeDisabled(false);
    // 表单重置化
    if (initFormData.id) {
      // 编辑菜单
      setTitle('编辑菜单');
      setInitiaValues({ ...initFormData });
    } else if (initFormData.parent) {
      // 新增次级菜单
      setTitle('新增菜单');
      setInitiaValues({ ..._initialValues, menuType: 'B', ...initFormData });
    } else {
      // 新增顶级菜单
      setTitle('新增菜单');
      setInitiaValues({ ..._initialValues, menuType: 'A', ...initFormData });
    }
  }, [initFormData, form]);

  useEffect(() => {
    // 表单重置一下
    form && form.resetFields();
  }, [initialValues, form]);

  // 提交按钮回调
  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      // 1. 验证表单
      const formData = await form.validateFields();

      // 2. 发送交易
      const data = await editRouterInfo({ ...initFormData, ...formData });

      // 关闭弹框并且将其保存
      onClose(data.router_info);
    } finally {
      setConfirmLoading(false);
    }
  };
  // 关闭对话框回调
  const handleCancel = () => {
    confirmLoading ? message.warning('正在提交中...') : onClose();
  };

  return (
    <Modal
      title={title}
      /** 对话框是否可见 */
      visible={visible}
      /** 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 */
      onOk={handleOk}
      /** 确定按钮 loading */
      confirmLoading={confirmLoading}
      /** 点击取消回调 */
      onCancel={handleCancel}
      /** 点击蒙层是否允许关闭 */
      maskClosable={false}
      cancelText='取消'
      okText='提交'>
      <Form
        /** 表单名称，会作为表单字段 id 前缀使用	 */
        name='login_form'
        size='large'
        /** 表单默认值，只有初始化以及重置时生效	 */
        initialValues={initialValues}
        /** 原生 autocomplete 属性，禁用自动完成功能 */
        autoComplete='off'
        /** 经 Form.useForm() 创建的 form 控制实例，不提供时会自动创建 */
        form={form}
        labelCol={{ span: 4 }}
        className='login_form'>
        {initFormData.parent && (
          <Form.Item label='父级菜单' name={['parent', 'title']}>
            <Input disabled={true} />
          </Form.Item>
        )}
        <Form.Item name='menuType' label='菜单类型' rules={rules.type}>
          <Select placeholder='请选择菜单类型' disabled={typeDisabled}>
            {menuTypes.map(({ label, value }) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='title' label='菜单名' rules={rules.title}>
          <Input placeholder='菜单名' />
        </Form.Item>
        {watchMenuType === 'B' && (
          <Form.Item name='element' label='文件路径' rules={rules.element}>
            <Input placeholder='文件路径' />
          </Form.Item>
        )}
        {watchMenuType === 'B' && (
          <Form.Item name='path' label='路径' rules={rules.path}>
            <Input placeholder='路径' />
          </Form.Item>
        )}
        <Form.Item name='icon' label='图标'>
          <Input placeholder='图标名' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
