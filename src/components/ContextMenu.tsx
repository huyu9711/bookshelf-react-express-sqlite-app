// ContextMenu.tsx
import React from 'react';
import { Menu, Dropdown } from 'antd';
import { DataNode } from 'antd/lib/tree';
import type { MenuProps } from 'antd';

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  node: DataNode | null;
  onMenuClick: (key: string) => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ visible, x, y, node, onMenuClick, onClose }) => {
  const handleMenuClick = ({ key }: { key: string }) => {
    onMenuClick(key);
    onClose();
  };

  const menu = (
    <Menu style={{ position: 'absolute', top: y, left: x }} onClick={handleMenuClick}>
      <Menu.Item key="cut">Cut</Menu.Item>
      <Menu.Item key="copy">Copy</Menu.Item>
      <Menu.Item key="paste">Paste</Menu.Item>
    </Menu>
  );

  const items: MenuProps['items'] = [
    {
      label: '1st menu item',
      key: '1',
    },
    {
      label: '2nd menu item',
      key: '2',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
  ];

  return (
    visible && (
      <div onContextMenu={(e) => e.preventDefault()}>
        <Dropdown overlay={menu} open={true} trigger={['contextMenu']} onOpenChange={onClose}>
          <div />
        </Dropdown>
      </div>
    )
  );
};

export default ContextMenu;