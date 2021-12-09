import { useRef, useState } from 'react';
import { Form, Input, Button, Message } from 'element-react';
import { login } from '../../api/getData';
import './login.css';

export default function Login({ history }) {
  const formRef = useRef(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [rules] = useState({
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur',
      },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  });

  const onChange = (type, value) => {
    setForm({
      ...form,
      [type]: value,
    });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    formRef.current.validate(async (valid) => {
      if (!valid) return false;

      const res = await login({
        user_name: form.username,
        password: form.password,
      });

      if (res.status == 1) {
        Message({
          message: '登录成功',
          type: 'success',
        });

        history.push('/manage');
      } else {
        Message({
          message: res.message,
          type: 'error',
        });
      }
    });
  };

  return (
    <div className='login_page fillcontain'>
      <section className='form_contianer'>
        <div className='manage_tip'>
          <p>elm后台管理系统</p>
        </div>
        <Form
          ref={formRef}
          model={form}
          rules={rules}
          className='demo-ruleForm'>
          <Form.Item prop='username'>
            <Input
              value={form.username}
              onChange={onChange.bind(this, 'username')}
              placeholder='用户名'
            />
          </Form.Item>
          <Form.Item prop='password'>
            <Input
              type='password'
              value={form.password}
              onChange={onChange.bind(this, 'password')}
              placeholder='密码'
            />
          </Form.Item>
          <Button type='primary' className='submit_btn' onClick={loginSubmit}>
            登录
          </Button>
        </Form>
        <p className='tip mt15'>温馨提示：</p>
        <p className='tip'>未登录过的新用户，自动注册</p>
        <p className='tip'>注册过的用户可凭账号密码登录</p>
      </section>
    </div>
  );
}
