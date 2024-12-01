import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('Успешная авторизация!');
      navigate('/');
    } catch (error) {
      message.error('Провал авторизации!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleLogin} layout="vertical">
      <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
