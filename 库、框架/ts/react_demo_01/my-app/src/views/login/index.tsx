import { Form, Input, Button } from 'antd';
import { useState } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/api';
import { setToken, setUserInfo } from '@/utils/localStore';
import { type Rule } from 'antd/lib/form';
import { useSetRecoilState } from 'recoil';
import './index.scss';
import { user_info_recoil } from '@/store/user';
import { useNavigate } from 'react-router-dom';

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

export default function Login() {
  const [isSubmit, setIsSubmit] = useState<boolean>(false); // 是否在提交状态标识
  const [form] = Form.useForm();
  const setUserInfoRecoil = useSetRecoilState(user_info_recoil);
  const navigate = useNavigate();

  // 点击按钮提交
  const onSubmit = async function () {
    setIsSubmit(true);

    try {
      const params = await form.validateFields();

      const data = await login(params);

      // 将 token 本地存储
      setToken(data.token);

      // 将登录信息存入到 recoil 中和 localStorage 中
      setUserInfo(data.userInfo);
      setUserInfoRecoil(data.userInfo);
      navigate('/test2');
    } catch (e) {
      // error -- Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
      // 路由已经跳转，但是还是在这里更改了状态
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
        initialValues={{ username: 'admin', password: '123456' }}
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
