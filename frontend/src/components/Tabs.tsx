import React from 'react';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ items, activeId, onSelect }) => {
  return (
    <div className="tab-list">
      {items.map((item) => (
        <button
          key={item.id}
          className={`tab-button ${activeId === item.id ? 'active' : ''}`}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
