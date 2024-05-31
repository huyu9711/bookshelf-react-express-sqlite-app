// FormComponent.tsx
import React from 'react';
import { Form, Input, Button } from 'antd';

interface FormComponentProps {
  onClose: () => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ onClose }) => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
    onClose();
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormComponent;