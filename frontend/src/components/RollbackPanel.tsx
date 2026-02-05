import React, { useMemo, useState } from 'react';
import { api } from '../api/client';
import { AdminState } from '../types';
import FormField from './FormField';

interface RollbackPanelProps {
  state: AdminState;
  onRefresh: () => Promise<boolean> | void;
  pushAlert: (type: 'success' | 'error', message: string) => void;
}

const RollbackPanel: React.FC<RollbackPanelProps> = ({ state, onRefresh, pushAlert }) => {
  const [gameNo, setGameNo] = useState(state.match.current_game_no);
  const [saving, setSaving] = useState(false);

  const gameOptions = useMemo(() => Array.from({ length: state.match.best_of }, (_, i) => i + 1), [state.match.best_of]);
  const gameState = state.games[String(gameNo)];

  const rollback = async (type: 'bp' | 'result') => {
    const ok = window.confirm(`确认回滚 ${type === 'bp' ? 'BP' : '结算'}？`);
    if (!ok) return;

    try {
      setSaving(true);
      await api.rollback(gameNo, type);
      pushAlert('success', `${type === 'bp' ? 'BP' : '结算'} 已回滚`);
      await onRefresh();
    } catch (err: any) {
      pushAlert('error', err.message ?? '回滚失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-title">回滚面板</div>
      <div className="row">
        <FormField label="选择局号">
          <select value={gameNo} onChange={(e) => setGameNo(Number(e.target.value))}>
            {gameOptions.map((opt) => (
              <option key={opt} value={opt}>
                第 {opt} 局
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="split" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="section-title">已发布 BP</div>
          {gameState?.bp ? (
            <div className="small">红队 Pick：{gameState.bp.teamA.picks.map((p) => p.hero).join(' / ')}</div>
          ) : (
            <div className="small">暂无已发布 BP</div>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button danger" onClick={() => rollback('bp')} disabled={saving}>
              回滚 BP
            </button>
          </div>
        </div>
        <div className="card">
          <div className="section-title">已发布 结算</div>
          {gameState?.result ? (
            <div className="small">
              胜方：{gameState.result.winner === 'A' ? '红队' : '蓝队'}，MVP：{gameState.result.mvp.player}
            </div>
          ) : (
            <div className="small">暂无已发布结算</div>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button danger" onClick={() => rollback('result')} disabled={saving}>
              回滚 结算
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollbackPanel;
