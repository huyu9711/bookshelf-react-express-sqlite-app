import React, { useState } from 'react';

import {
  DesktopOutlined,
  PieChartOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Button, Form, Input } from 'antd';
import PriceForm from './PriceForm';
import ProjectTreeComponent from './ProjectTreeComponent';
import {Bookshelf} from './bookshelf';

const { Header, Content, Footer, Sider } = Layout;

interface DataSourceItem {
  key: string;
  name: string;
  age: number;
  address: string;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dataSource, setDataSource] = useState<DataSourceItem[]>([
    {
      key: '1',
      name: 'John Doe',
      age: 32,
      address: '10 Downing Street\nLondon\nUK'
    },
    {
      key: '2',
      name: 'Jane Doe',
      age: 42,
      address: '11 Downing Street\nLondon\nUK'
    },
  ]);
  const [form] = Form.useForm();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleAdd = () => {
    form.validateFields().then(values => {
      const newData: DataSourceItem = {
        key: (dataSource.length + 1).toString(),
        ...values
      };
      setDataSource([...dataSource, newData]);
      form.resetFields();
    });
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '20px 50px', background: colorBgContainer, borderRadius: borderRadiusLG }}>
        <Button type="primary">Home</Button>
        <Button type="default">About</Button>
        <Button type="dashed">Services</Button>
        <Button type="link">Contact</Button>
      </Header>
      <Layout>
        <Sider theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
          <div className="demo-logo-vertical" />
          <ProjectTreeComponent />
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <Bookshelf />
          </Content>
          <Footer style={{ padding: 10, textAlign: 'center' }}>
            <Button type="text" onClick={toggleCollapse} icon={isCollapsed ? <UpOutlined /> : <DownOutlined />}>
              {isCollapsed ? 'Show' : 'Hide'}
            </Button>
            {!isCollapsed && (
              <div>
                <div style={{width : '50%', float : 'left'}}>
                  <PriceForm form={form} dataSource={dataSource} handleAdd={handleAdd} />
                </div>
                <div style={{width : '50%', float : 'right'}}>
                  <PriceForm form={form} dataSource={dataSource} handleAdd={handleAdd} />
                </div>
              </div> 
            )}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
