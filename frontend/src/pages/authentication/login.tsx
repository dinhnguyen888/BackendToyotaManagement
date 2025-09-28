import React, { useState } from 'react';
import axios from 'axios';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  email?: string;
  password?: string;
  isAdmin?: boolean;
  remember?: boolean;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const submit = async (values: FieldType) => {
    try {
      const response = await axios.post<{ success: boolean; message: string }>('http://localhost:5192/api/XacThuc/login', {
        email: values.email,
        password: values.password,
        twoFactorCode: values.isAdmin ? 'admin' : 'user'
      });
      if (response.data.success) {
        if (values.isAdmin) {
          navigate('/baocao');
        } else {
          navigate('/sanphamcuauser');
        }
        alert('Login successful');
        if(values.isAdmin){localStorage.setItem('login', 'ok');}
        if(!values.isAdmin)
          {
            localStorage.setItem('email', values.email!)
            
          }
        window.location.reload();
      } else {
        alert('Login failed: ' + response.data.message);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: An error occurred');
    }
  };

  const register = () => {
    navigate("/register");
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    submit(values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='mt-24 mx-auto'>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ position: 'absolute', left: '0', right: '0', maxWidth: 1000 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input onChange={(e) => { setEmail(e.currentTarget.value); }} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password onChange={(e) => { setPassword(e.currentTarget.value); }} />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item name="isAdmin" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox onChange={(e) => setIsAdmin(e.target.checked)}>Login as Admin</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button className='ml-48' type="primary" htmlType="submit">
            Submit
          </Button>
          <Button className='ml-11' type="primary" onClick={register}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
