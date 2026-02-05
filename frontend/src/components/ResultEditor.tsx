import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { AdminState, ResultPayload } from '../types';
import FormField from './FormField';

interface ResultEditorProps {
  state: AdminState;
  onRefresh: () => Promise<boolean> | void;
  pushAlert: (type: 'success' | 'error', message: string) => void;
}

const makeEmpty = (): ResultPayload => ({
  winner: 'A',
  mvp: { player: '', hero: '', kda: '' },
  key_stats: { damage_share: '', damage_taken_share: '', participation: '' },
  highlight_text: ''
});

const ResultEditor: React.FC<ResultEditorProps> = ({ state, onRefresh, pushAlert }) => {
  const [gameNo, setGameNo] = useState(state.match.current_game_no);
  const [draft, setDraft] = useState<ResultPayload>(makeEmpty());
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const gameOptions = useMemo(() => Array.from({ length: state.match.best_of }, (_, i) => i + 1), [state.match.best_of]);
  const gameState = state.games[String(gameNo)];

  useEffect(() => {
    if (!gameState) return;
    if (isDirty) return;
    setDraft(gameState.result_draft ?? gameState.result ?? makeEmpty());
  }, [gameNo, gameState, isDirty]);

  useEffect(() => {
    if (gameNo > state.match.best_of) {
      setGameNo(state.match.best_of);
    }
  }, [gameNo, state.match.best_of]);

  const update = (patch: Partial<ResultPayload>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setIsDirty(true);
  };

  const updateMvp = (patch: Partial<ResultPayload['mvp']>) => {
    setDraft((prev) => ({ ...prev, mvp: { ...prev.mvp, ...patch } }));
    setIsDirty(true);
  };

  const updateStats = (patch: Partial<ResultPayload['key_stats']>) => {
    setDraft((prev) => ({ ...prev, key_stats: { ...prev.key_stats, ...patch } }));
    setIsDirty(true);
  };

  const publish = async () => {
    try {
      setSaving(true);
      await api.publishResult(gameNo, draft);
      pushAlert('success', '结算已发布');
      setIsDirty(false);
      await onRefresh();
    } catch (err: any) {
      pushAlert('error', err.message ?? '发布失败');
    } finally {
      setSaving(false);
    }
  };

  const loadPublished = () => {
    setDraft(gameState?.result ?? makeEmpty());
    setIsDirty(true);
  };

  const loadDraft = () => {
    setDraft(gameState?.result_draft ?? makeEmpty());
    setIsDirty(false);
  };

  return (
    <div className="panel">
      <div className="panel-title">结算发布</div>
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
        {isDirty ? <span className="pill">草稿已修改</span> : <span className="pill">与服务器一致</span>}
      </div>

      <div style={{ height: 16 }} />
      <div className="grid-2">
        <div className="card">
          <div className="section-title">胜方与 MVP</div>
          <FormField label="胜方">
            <select value={draft.winner} onChange={(e) => update({ winner: e.target.value as 'A' | 'B' })}>
              <option value="A">红队</option>
              <option value="B">蓝队</option>
            </select>
          </FormField>
          <div className="grid-3" style={{ marginTop: 12 }}>
            <FormField label="MVP 选手">
              <input value={draft.mvp.player} onChange={(e) => updateMvp({ player: e.target.value })} />
            </FormField>
            <FormField label="MVP 英雄">
              <input value={draft.mvp.hero} onChange={(e) => updateMvp({ hero: e.target.value })} />
            </FormField>
            <FormField label="KDA">
              <input value={draft.mvp.kda} onChange={(e) => updateMvp({ kda: e.target.value })} />
            </FormField>
          </div>
        </div>
        <div className="card">
          <div className="section-title">关键数据</div>
          <div className="grid-3">
            <FormField label="输出占比">
              <input value={draft.key_stats.damage_share} onChange={(e) => updateStats({ damage_share: e.target.value })} />
            </FormField>
            <FormField label="承伤占比">
              <input value={draft.key_stats.damage_taken_share} onChange={(e) => updateStats({ damage_taken_share: e.target.value })} />
            </FormField>
            <FormField label="参团率">
              <input value={draft.key_stats.participation} onChange={(e) => updateStats({ participation: e.target.value })} />
            </FormField>
          </div>
          <FormField label="高光描述" hint="可选">
            <textarea value={draft.highlight_text ?? ''} onChange={(e) => update({ highlight_text: e.target.value })} />
          </FormField>
        </div>
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <button className="button secondary" onClick={loadPublished} disabled={saving}>
          载入已发布
        </button>
        <button className="button secondary" onClick={loadDraft} disabled={saving}>
          载入草稿
        </button>
        <button className="button" onClick={publish} disabled={saving}>
          发布结算
        </button>
      </div>

      {gameState?.result ? (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="section-title">已发布概览</div>
          <div className="kv">
            <div>胜方</div>
            <div>{gameState.result.winner === 'A' ? '红队' : '蓝队'}</div>
            <div>MVP</div>
            <div>{gameState.result.mvp.player} / {gameState.result.mvp.hero}</div>
            <div>KDA</div>
            <div>{gameState.result.mvp.kda}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResultEditor;
