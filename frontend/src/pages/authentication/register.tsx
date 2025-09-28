import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type FieldType = {
  nguoiDung?: string;
  matKhau?: string;
  confirm?: string;
  email?: string;
  remember?: boolean;
};

const Register: React.FC = () => {
  const [nguoiDung, setNguoiDung] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [confirm, setConfirm] = useState('');
  const [vaiTro, setVaiTro] = useState('user'); // Ví dụ: vai trò mặc định là "user"

  const navigate = useNavigate();

  const submit = async () => {
    if (matKhau !== confirm) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5192/api/XacThuc', { // Điều chỉnh URL theo backend của bạn
        nguoiDung,
        matKhau,
        vaiTro
      });

      if (response.data) {
        alert('Registration successful');
        navigate('/');


      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const onFinish = (values: FieldType) => {
    console.log('Success:', values);
    submit();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='mt-24'>
      <Form
        name="register"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ position: 'absolute', left: '0', right: '0', maxWidth: 1000 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="nguoiDung"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input onChange={(e) => setNguoiDung(e.currentTarget.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="matKhau"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password onChange={(e) => setMatKhau(e.currentTarget.value)} />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirm"
          dependencies={['matKhau']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('matKhau') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password onChange={(e) => setConfirm(e.currentTarget.value)} />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
