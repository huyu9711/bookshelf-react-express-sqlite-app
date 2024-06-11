import React, { useState } from 'react';
import { Menu, Dropdown, Modal, Form, Input, Button } from 'antd';
import { DownOutlined, DesktopOutlined } from '@ant-design/icons';

interface NodeData {
  title: string;
  key: string;
  children?: NodeData[];
}

const initialData: NodeData[] = [
  { title: 'Root Node', key: '0-0', children: [] }
];

interface ProjectMenuComponentProps {
  collapsed: boolean;
}

const ProjectMenuComponent: React.FC<ProjectMenuComponentProps> = ({ collapsed }) => {
  const [treeData, setTreeData] = useState<NodeData[]>(initialData);
  const [filteredData, setFilteredData] = useState<NodeData[]>(initialData);
  const [searchValue, setSearchValue] = useState('');
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'rename'>('add');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [form] = Form.useForm();

  const onMenuItemSelected = (key: string) => {
    const findNode = (nodes: NodeData[], key: string): NodeData | null => {
      for (const node of nodes) {
        if (node.key === key) return node;
        if (node.children) {
          const found = findNode(node.children, key);
          if (found) return found;
        }
      }
      return null;
    };
    setSelectedNode(findNode(treeData, key));
  };

  const showModal = (type: 'add' | 'rename') => {
    setModalType(type);
    setIsModalVisible(true);
    if (type === 'rename') {
      form.setFieldsValue({ name: selectedNode?.title });
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (selectedNode) {
        if (modalType === 'add') {
          const newKey = `${selectedNode.key}-${selectedNode.children?.length || 0}`;
          const newNode: NodeData = { title: values.name, key: newKey };
          const updateTree = (nodes: NodeData[]): NodeData[] => {
            return nodes.map(n => {
              if (n.key === selectedNode.key) {
                return { ...n, children: [...(n.children || []), newNode] };
              }
              if (n.children) {
                return { ...n, children: updateTree(n.children) };
              }
              return n;
            });
          };
          const newTreeData = updateTree(treeData);
          setTreeData(newTreeData);
          setFilteredData(newTreeData);
          setSelectedKeys([newKey]);
        } else if (modalType === 'rename') {
          const updateTree = (nodes: NodeData[]): NodeData[] => {
            return nodes.map(n => {
              if (n.key === selectedNode.key) {
                return { ...n, title: values.name };
              }
              if (n.children) {
                return { ...n, children: updateTree(n.children) };
              }
              return n;
            });
          };
          const newTreeData = updateTree(treeData);
          setTreeData(newTreeData);
          setFilteredData(newTreeData);
        }
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    if (selectedNode) {
      const deleteNode = (nodes: NodeData[]): NodeData[] => {
        return nodes.filter(n => n.key !== selectedNode.key).map(n => ({
          ...n,
          children: n.children ? deleteNode(n.children) : []
        }));
      };
      const newTreeData = deleteNode(treeData);
      setTreeData(newTreeData);
      setFilteredData(newTreeData);
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);

    if (!value) {
      setFilteredData(treeData);
      return;
    }

    const filterTree = (nodes: NodeData[]): NodeData[] => {
      return nodes
        .map(node => {
          if (node.title.includes(value)) {
            return { ...node };
          }
          if (node.children) {
            const children = filterTree(node.children);
            if (children.length) {
              return { ...node, children };
            }
          }
          return null;
        })
        .filter(node => node) as NodeData[];
    };

    setFilteredData(filterTree(treeData));
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => showModal('add')}>
        新建
      </Menu.Item>
      <Menu.Item onClick={() => showModal('rename')}>
        重命名
      </Menu.Item>
      <Menu.Item onClick={handleDelete}>
        删除
      </Menu.Item>
    </Menu>
  );

  const renderMenuItems = (data: NodeData[]): React.ReactNode[] => {
    return data.map(item => (
      <Menu.SubMenu
        key={item.key}
        title={collapsed ? null : item.title}
        icon={<DesktopOutlined />}
        onTitleClick={() => {
          setSelectedKeys([item.key]);
        }}
        onTitleMouseEnter={() => {
          if (item.key) {
            onMenuItemSelected(item.key);
          }          
        }}
      >
        {item.children ? renderMenuItems(item.children) : null}
      </Menu.SubMenu>
    ));
  };

  return (
    <div>
      <Input.Search
        placeholder="搜索节点"
        value={searchValue}
        onChange={onSearch}
        style={{ marginBottom: 8 }}
      />
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            const key = (e.target as HTMLElement).closest('.ant-menu-submenu')?.getAttribute('data-menu-id');
            // if (key) {
            //   onMenuItemSelected(key);
            // }
            console.log(key);
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            onClick={({ key }) => {
              setSelectedKeys([key as string])
            }}
          >
            {renderMenuItems(filteredData)}
          </Menu>
        </div>
      </Dropdown>
      <Modal title={modalType === 'add' ? "新建节点" : "重命名节点"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名字" rules={[{ required: true, message: '请输入名字' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectMenuComponent;