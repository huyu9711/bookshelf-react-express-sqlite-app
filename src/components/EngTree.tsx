import React, { useState } from 'react';
import type { DataNode } from 'antd/lib/tree';
import TreeComponent from './TreeComponent';
import ContextMenu from './ContextMenu';
import FormComponent from './FormComponent'
import { Modal } from 'antd';

const EngTree: React.FC = () => {
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; node: DataNode | null }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  const handleRightClick = (event: React.MouseEvent, node: DataNode) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      node,
    });
  };

  const handleMenuClick = (key: string) => {
    // alert(`Clicked on ${key} for node ${contextMenu.node?.title}`);
    showModal();
  };

  const handleClose = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    console.log(isModalVisible);
    setIsModalVisible(false);
  };

  return (
    <div>
      <TreeComponent onRightClick={handleRightClick} />
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        node={contextMenu.node}
        onMenuClick={handleMenuClick}
        onClose={handleClose}
      />
      <Modal
        title="Form"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
      >
        <FormComponent onClose={handleCancel} />
      </Modal>      
    </div>
  );
};
  
export default EngTree;