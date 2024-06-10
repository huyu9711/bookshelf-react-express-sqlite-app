// src/App.tsx
import React, { useState } from 'react';
import { Tree, Dropdown, Menu, Modal, Form, Input, Button } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { DownOutlined } from '@ant-design/icons';

interface NodeData {
  title: string;
  key: string;
  children?: NodeData[];
}

const initialData: NodeData[] = [
  { title: 'Root Node', key: '0-0', children: [] }
];

const ProjectTreeComponent: React.FC = () => {
  const [treeData, setTreeData] = useState<NodeData[]>(initialData);
  const [filteredData, setFilteredData] = useState<NodeData[]>(initialData);
  const [searchValue, setSearchValue] = useState('');
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'rename'>('add');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const onRightClick = ({ node }: any) => {
    setSelectedNode(node);
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
          setExpandedKeys([...expandedKeys, selectedNode.key]);
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

  const onDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: NodeData[], key: string, callback: (node: NodeData, i: number, data: NodeData[]) => void) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    const data = [...treeData];

    let dragObj: NodeData;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.push(dragObj!);
      });
    } else if (
      (info.node.children || []).length > 0 && info.node.expanded && dropPosition === 1
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj!);
      });
    } else {
      let ar: NodeData[] = [];
      let i: number;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }

    setTreeData(data);
    setFilteredData(data);
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
    setExpandedKeys(value ? filteredData.map(node => node.key) : []);
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

  return (
    <div>
      <Input.Search
        placeholder="搜索节点"
        value={searchValue}
        onChange={onSearch}
        style={{ marginBottom: 8 }}
      />
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <Tree
          treeData={filteredData}
          onRightClick={onRightClick}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          selectedKeys={selectedKeys}
          onSelect={setSelectedKeys}
          draggable
          onDrop={onDrop}
          switcherIcon={<DownOutlined />}
        />
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

export default ProjectTreeComponent;
