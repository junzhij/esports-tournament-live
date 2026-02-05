import React from 'react';
import Tabs, { TabItem } from './Tabs';

interface LayoutProps {
  tabs: TabItem[];
  activeTab: string;
  onTabSelect: (id: string) => void;
  header: React.ReactNode;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ tabs, activeTab, onTabSelect, header, children }) => {
  return (
    <div className="app-shell">
      <aside className="side-nav">
        <div className="brand">
          <div className="brand-title">班赛直播后台</div>
          <div className="brand-sub">Admin Console</div>
        </div>
        <Tabs items={tabs} activeId={activeTab} onSelect={onTabSelect} />
      </aside>
      <main className="main-panel">
        {header}
        {children}
      </main>
    </div>
  );
};

export default Layout;
