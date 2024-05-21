// PriceForm.tsx
import React from "react";
import { Form, Input, Button } from "antd";
import PriceTable from "./PriceTable";
const { TextArea } = Input;

interface PriceFormProps {
  form: any;
  dataSource: any[];
  handleAdd: () => void;
}

const PriceForm: React.FC<PriceFormProps> = ({
  form,
  dataSource,
  handleAdd,
}) => {
  return (
    <>
      <PriceTable />
      <Form form={form} layout="inline" onFinish={handleAdd}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="age"
          rules={[{ required: true, message: "Please input age!" }]}
        >
          <Input placeholder="Age" type="number" />
        </Form.Item>
        <Form.Item
          name="address"
          rules={[{ required: true, message: "Please input address!" }]}
        >
          <TextArea
            autoSize={{ minRows: 1, maxRows: 5 }}
            placeholder="Address"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default PriceForm;
