import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './index.scss';

export default function Login(props: any) {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
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
        /** 提交表单且数据验证成功后回调事件	 */
        onFinish={onFinish}
        /** 提交表单且数据验证失败后回调事件	 */
        onFinishFailed={onFinishFailed}
        /** 原生 autocomplete 属性，禁用自动完成功能 */
        autoComplete='off'
        className='login_form'>
        <Form.Item
          name='username'
          rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder='账号' prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder='密码' prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
