// TreeComponent.tsx
import React, { useMemo, useRef, useState } from 'react';
import { Input, Tree, TreeDataNode } from 'antd';
import { DataNode } from 'antd/lib/tree';

const { Search } = Input;

const defaultData: DataNode[] = [
  {
    title: 'Parent 1',
    key: '0-0',
    children: [
      { title: 'Child 1', key: '0-0-0' },
      { title: 'Child 2', key: '0-0-1' },
    ],
  },
];

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: TreeDataNode[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key as string });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(defaultData);

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

interface TreeComponentProps {
  onRightClick: (event: React.MouseEvent, node: DataNode) => void;
}

const TreeComponent: React.FC<TreeComponentProps> = ({ onRightClick }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const treeRef = useRef<HTMLDivElement>(null);
  const handleRightClick = ({ event, node }: { event: React.MouseEvent; node: DataNode }) => {
    onRightClick(event, node);
  };
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const treeData = useMemo(() => {
    const loop = (data: TreeDataNode[]): TreeDataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(defaultData);
  }, [searchValue]);
  
  return (
    <div  ref={treeRef} style={{ position: 'relative' }}>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />    
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onRightClick={handleRightClick}
        treeData={treeData}
      />
    </div>
  );
};

export default TreeComponent;