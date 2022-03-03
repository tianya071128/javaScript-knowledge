import { Form, Input, Button } from 'antd';
import { useState } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { login } from '@/api';
import { setLocalStore } from '@/utils/localStore';

import './index.scss';

import { type Rule } from 'antd/lib/form';

/** 类型声明 start */
interface Rules {
  [prop: string]: Rule[];
}
/** 类型声明 end */

/** 静态方法和属性 */
const rules: Rules = {
  username: [{ required: true, message: '请输入您的账号' }],
  password: [{ required: true, message: '请输入您的密码' }],
};
/** 静态方法和属性 end */

export default function Login(props: any) {
  const [isSubmit, setIsSubmit] = useState<boolean>(false); // 是否在提交状态标识
  const [form] = Form.useForm();

  // 点击按钮提交
  const onSubmit = async function () {
    setIsSubmit(true);

    try {
      const params = await form.validateFields();

      const data = await login(params);

      // 将 token 本地存储
      setLocalStore('token', data.token);

      // 将登录信息存入到 recoil 中
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className='_login_'>
      <h3 className='login_title'>系统登录</h3>
      <Form
        /** 表单名称，会作为表单字段 id 前缀使用	 */
        name='login_form'
        size='large'
        /** label 标签布局 */
        // labelCol={{ span: 8 }}
        /** 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol	 */
        // wrapperCol={{ span: 16 }}
        /** 表单默认值，只有初始化以及重置时生效	 */
        // initialValues={{ remember: true }}
        /** 原生 autocomplete 属性，禁用自动完成功能 */
        autoComplete='off'
        /** 经 Form.useForm() 创建的 form 控制实例，不提供时会自动创建 */
        form={form}
        className='login_form'>
        <Form.Item name='username' rules={rules.username}>
          <Input placeholder='账号' prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item name='password' rules={rules.password}>
          <Input.Password placeholder='密码' prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item>
          <Button
            loading={isSubmit}
            type='primary'
            htmlType='button'
            onClick={onSubmit}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
