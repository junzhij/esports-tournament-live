import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { AdminState, BpPayload, BpPick, BpTeamPayload } from '../types';
import FormField from './FormField';

interface BpEditorProps {
  state: AdminState;
  onRefresh: () => Promise<boolean> | void;
  pushAlert: (type: 'success' | 'error', message: string) => void;
}

const positions = ['上', '野', '中', '射', '辅'];

const emptyTeam = (banCount: number): BpTeamPayload => ({
  bans: Array.from({ length: banCount }, () => ''),
  picks: positions.map((pos) => ({ pos, hero: '', player: '' }))
});

const makeEmpty = (banCount: number): BpPayload => ({
  teamA: emptyTeam(banCount),
  teamB: emptyTeam(banCount)
});

const BpEditor: React.FC<BpEditorProps> = ({ state, onRefresh, pushAlert }) => {
  const [gameNo, setGameNo] = useState(state.match.current_game_no);
  const [draft, setDraft] = useState<BpPayload>(makeEmpty(state.match.ban_count));
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const gameOptions = useMemo(() => Array.from({ length: state.match.best_of }, (_, i) => i + 1), [state.match.best_of]);

  const gameState = state.games[String(gameNo)];

  useEffect(() => {
    if (!gameState) return;
    if (isDirty) return;
    const nextDraft = gameState.bp_draft ?? gameState.bp ?? makeEmpty(state.match.ban_count);
    setDraft(nextDraft);
    setErrors([]);
  }, [gameNo, gameState, isDirty, state.match.ban_count]);

  useEffect(() => {
    if (gameNo > state.match.best_of) {
      setGameNo(state.match.best_of);
    }
  }, [gameNo, state.match.best_of]);

  const updatePick = (teamKey: 'teamA' | 'teamB', index: number, patch: Partial<BpPick>) => {
    setDraft((prev) => {
      const team = prev[teamKey];
      const picks = team.picks.map((pick, i) => (i === index ? { ...pick, ...patch } : pick));
      return { ...prev, [teamKey]: { ...team, picks } };
    });
    setIsDirty(true);
  };

  const updateBan = (teamKey: 'teamA' | 'teamB', index: number, value: string) => {
    setDraft((prev) => {
      const team = prev[teamKey];
      const bans = team.bans.map((ban, i) => (i === index ? value : ban));
      return { ...prev, [teamKey]: { ...team, bans } };
    });
    setIsDirty(true);
  };

  const validate = () => {
    const newErrors: string[] = [];
    const banCount = state.match.ban_count;
    [draft.teamA, draft.teamB].forEach((team, idx) => {
      if (team.bans.length !== banCount) {
        newErrors.push(`队伍${idx === 0 ? 'A' : 'B'} Ban 数量必须为 ${banCount}`);
      }
      if (team.picks.length !== 5) {
        newErrors.push(`队伍${idx === 0 ? 'A' : 'B'} Pick 数量必须为 5`);
      }
      team.picks.forEach((pick, pickIndex) => {
        if (!pick.pos || !pick.hero || !pick.player) {
          newErrors.push(`队伍${idx === 0 ? 'A' : 'B'} 第 ${pickIndex + 1} 行未填完整`);
        }
      });
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const loadPublished = () => {
    const next = gameState?.bp ?? makeEmpty(state.match.ban_count);
    setDraft(next);
    setIsDirty(true);
  };

  const loadDraft = () => {
    const next = gameState?.bp_draft ?? makeEmpty(state.match.ban_count);
    setDraft(next);
    setIsDirty(false);
  };

  const resetToServer = () => {
    const next = gameState?.bp_draft ?? gameState?.bp ?? makeEmpty(state.match.ban_count);
    setDraft(next);
    setIsDirty(false);
  };

  const saveDraft = async () => {
    try {
      setSaving(true);
      await api.saveBpDraft(gameNo, draft);
      pushAlert('success', 'BP 草稿已保存');
      setIsDirty(false);
      await onRefresh();
    } catch (err: any) {
      pushAlert('error', err.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await api.publishBp(gameNo);
      pushAlert('success', 'BP 已发布');
      setIsDirty(false);
      await onRefresh();
    } catch (err: any) {
      pushAlert('error', err.message ?? '发布失败');
    } finally {
      setSaving(false);
    }
  };

  const lock = async () => {
    try {
      setSaving(true);
      await api.lockBp(gameNo);
      pushAlert('success', 'BP 已锁定');
      await onRefresh();
    } catch (err: any) {
      pushAlert('error', err.message ?? '锁定失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-title">BP 编辑</div>
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
        <span className="pill">Ban 数量：{state.match.ban_count}</span>
        <span className="pill">状态：{gameState?.bp_locked ? '已锁定' : '可编辑'}</span>
        {isDirty ? <span className="pill">草稿已修改</span> : <span className="pill">与服务器一致</span>}
      </div>

      <div style={{ height: 16 }} />
      <div className="split">
        {(['teamA', 'teamB'] as const).map((teamKey, teamIndex) => (
          <div key={teamKey} className="card">
            <div className="section-title">{teamIndex === 0 ? '红队' : '蓝队'}</div>
            <div className="grid-3">
              {draft[teamKey].bans.map((ban, index) => (
                <FormField key={`${teamKey}-ban-${index}`} label={`Ban ${index + 1}`}>
                  <input
                    value={ban}
                    onChange={(e) => updateBan(teamKey, index, e.target.value)}
                    disabled={gameState?.bp_locked}
                  />
                </FormField>
              ))}
            </div>
            <div style={{ height: 12 }} />
            <div className="section-title">Pick 列表</div>
            <div className="grid-3">
              {draft[teamKey].picks.map((pick, index) => (
                <React.Fragment key={`${teamKey}-pick-${index}`}>
                  <FormField label="位置">
                    <input
                      value={pick.pos}
                      onChange={(e) => updatePick(teamKey, index, { pos: e.target.value })}
                      disabled={gameState?.bp_locked}
                    />
                  </FormField>
                  <FormField label="英雄">
                    <input
                      value={pick.hero}
                      onChange={(e) => updatePick(teamKey, index, { hero: e.target.value })}
                      disabled={gameState?.bp_locked}
                    />
                  </FormField>
                  <FormField label="选手">
                    <input
                      value={pick.player}
                      onChange={(e) => updatePick(teamKey, index, { player: e.target.value })}
                      disabled={gameState?.bp_locked}
                    />
                  </FormField>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {errors.length > 0 ? (
        <div className="alert error" style={{ marginTop: 16 }}>
          {errors.map((err) => (
            <div key={err}>{err}</div>
          ))}
        </div>
      ) : null}

      <div className="row" style={{ marginTop: 16 }}>
        <button className="button secondary" onClick={loadPublished} disabled={saving}>
          载入已发布
        </button>
        <button className="button secondary" onClick={loadDraft} disabled={saving}>
          载入草稿
        </button>
        <button className="button secondary" onClick={resetToServer} disabled={saving}>
          重置为当前服务器
        </button>
        <button className="button" onClick={saveDraft} disabled={saving || gameState?.bp_locked}>
          保存草稿
        </button>
        <button className="button" onClick={publish} disabled={saving || gameState?.bp_locked}>
          发布
        </button>
        <button className="button danger" onClick={lock} disabled={saving || gameState?.bp_locked}>
          锁定
        </button>
      </div>
    </div>
  );
};

export default BpEditor;
