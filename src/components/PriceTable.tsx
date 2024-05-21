import React from "react";
import { Table } from "antd";

interface DataSourceItem {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (text: string) => (
      <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
    ),
  },
];

const data: DataSourceItem[] = [
  {
    key: "1",
    name: "John Doe",
    age: 32,
    address: "10 Downing Street\nLondon\nUK",
  },
  {
    key: "2",
    name: "Jane Doe",
    age: 42,
    address: "11 Downing Street\nLondon\nUK",
  },
];

const PriceTable: React.FC = () => (
  <Table columns={columns} dataSource={data} pagination={false} />
);

export default PriceTable;
