import React, { useMemo, useState } from 'react';
import { useAdminState } from './hooks/useAdminState';
import Layout from './components/Layout';
import MatchSettings from './components/MatchSettings';
import BpEditor from './components/BpEditor';
import ResultEditor from './components/ResultEditor';
import RollbackPanel from './components/RollbackPanel';
import StatusBadge from './components/StatusBadge';

const tabs = [
  { id: 'match', label: '比赛设置' },
  { id: 'bp', label: 'BP 编辑' },
  { id: 'result', label: '结算发布' },
  { id: 'rollback', label: '回滚' }
];

type Alert = { type: 'success' | 'error'; message: string } | null;

const App: React.FC = () => {
  const { state, loading, error, lastUpdated, polling, refresh, resume } = useAdminState();
  const [activeTab, setActiveTab] = useState('match');
  const [alert, setAlert] = useState<Alert>(null);

  const pushAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    if (type === 'success') {
      setTimeout(() => setAlert(null), 2400);
    }
  };

  const header = useMemo(() => {
    if (!state) return null;
    const base = state.match.timer_base_seconds ?? 0;
    const startedAt = state.match.timer_started_at ? Date.parse(state.match.timer_started_at) : null;
    const elapsed = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0;
    const total = base + elapsed;
    const minutes = String(Math.floor(total / 60)).padStart(2, '0');
    const seconds = String(total % 60).padStart(2, '0');
    return (
      <div className="header">
        <div className="header-left">
          <div className="header-title">{state.match.title}</div>
          <div className="header-meta">
            <span>BO{state.match.best_of}</span>
            <span>第 {state.match.current_game_no} 局</span>
            <span>计时 {minutes}:{seconds}</span>
            <span>
              比分 {state.teams.A.name} {state.match.score_a} : {state.match.score_b} {state.teams.B.name}
            </span>
          </div>
        </div>
        <div className="header-right">
          <StatusBadge status={state.match.status} />
          <span className="small">最后同步：{lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '未同步'}</span>
          {polling ? (
            <span className="pill">轮询中</span>
          ) : (
            <button className="button secondary" onClick={resume}>
              重新连接
            </button>
          )}
        </div>
      </div>
    );
  }, [state, lastUpdated, polling, resume]);

  const body = () => {
    if (loading && !state) {
      return <div className="panel">正在加载后台状态...</div>;
    }
    if (!state) {
      return <div className="panel">未能获取数据，请检查后端。</div>;
    }
    switch (activeTab) {
      case 'match':
        return <MatchSettings state={state} onRefresh={refresh} pushAlert={pushAlert} />;
      case 'bp':
        return <BpEditor state={state} onRefresh={refresh} pushAlert={pushAlert} />;
      case 'result':
        return <ResultEditor state={state} onRefresh={refresh} pushAlert={pushAlert} />;
      case 'rollback':
        return <RollbackPanel state={state} onRefresh={refresh} pushAlert={pushAlert} />;
      default:
        return null;
    }
  };

  return (
    <Layout tabs={tabs} activeTab={activeTab} onTabSelect={setActiveTab} header={header}>
      {alert ? <div className={`alert ${alert.type}`}>{alert.message}</div> : null}
      {error ? <div className="alert error">{error.message}</div> : null}
      {body()}
    </Layout>
  );
};

export default App;
