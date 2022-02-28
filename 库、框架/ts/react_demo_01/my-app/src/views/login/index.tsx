import { Form, Input, Button, Checkbox } from 'antd';

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
      <Form
        /** 表单名称，会作为表单字段 id 前缀使用	 */
        name='loginForm'
        /** label 标签布局 */
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        /** 表单默认值，只有初始化以及重置时生效	 */
        initialValues={{ remember: true }}
        /** 提交表单且数据验证成功后回调事件	 */
        onFinish={onFinish}
        /** 提交表单且数据验证失败后回调事件	 */
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        className='login_form'>
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='remember'
          valuePropName='checked'
          wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
