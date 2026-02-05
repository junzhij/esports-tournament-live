import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { AdminState, TeamInfo, TeamSide } from '../types';
import FormField from './FormField';

interface MatchSettingsProps {
  state: AdminState;
  onRefresh: () => Promise<boolean> | void;
  pushAlert: (type: 'success' | 'error', message: string) => void;
}

const bestOfOptions = [1, 3, 5];
const banOptions = [3, 5];

const MatchSettings: React.FC<MatchSettingsProps> = ({ state, onRefresh, pushAlert }) => {
  const [matchForm, setMatchForm] = useState(state.match);
  const [teamA, setTeamA] = useState<TeamInfo>(state.teams.A);
  const [teamB, setTeamB] = useState<TeamInfo>(state.teams.B);
  const [saving, setSaving] = useState(false);
  const [matchDirty, setMatchDirty] = useState(false);
  const [teamADirty, setTeamADirty] = useState(false);
  const [teamBDirty, setTeamBDirty] = useState(false);

  useEffect(() => {
    if (!matchDirty) {
      setMatchForm(state.match);
    }
    if (!teamADirty) {
      setTeamA(state.teams.A);
    }
    if (!teamBDirty) {
      setTeamB(state.teams.B);
    }
  }, [state]);

  const gameOptions = useMemo(() => {
    return Array.from({ length: matchForm.best_of }, (_, i) => i + 1);
  }, [matchForm.best_of]);

  const updateTeam = async (side: TeamSide, payload: TeamInfo) => {
    try {
      setSaving(true);
      await api.updateTeam(side, payload);
      pushAlert('success', `${side === 'A' ? '红队' : '蓝队'} 已保存`);
      if (side === 'A') {
        setTeamADirty(false);
      } else {
        setTeamBDirty(false);
      }
      await onRefresh();
    } catch (err: any) {
      pushAlert('error', err.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const updateMatch = async () => {
    try {
      setSaving(true);
      await api.updateMatch({
        title: matchForm.title,
        best_of: matchForm.best_of,
        ban_count: matchForm.ban_count,
        current_game_no: matchForm.current_game_no,
        status: matchForm.status
      });
      pushAlert('success', '比赛设置已保存');
      setMatchDirty(false);
      await onRefresh();
    } catch (err: any) {
      pushAlert('error', err.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-title">比赛配置</div>
      <div className="grid-3">
        <FormField label="比赛名">
          <input
            value={matchForm.title}
            onChange={(e) => {
              setMatchForm({ ...matchForm, title: e.target.value });
              setMatchDirty(true);
            }}
          />
        </FormField>
        <FormField label="BO 赛制">
          <select
            value={matchForm.best_of}
            onChange={(e) => {
              setMatchForm({ ...matchForm, best_of: Number(e.target.value) });
              setMatchDirty(true);
            }}
          >
            {bestOfOptions.map((opt) => (
              <option key={opt} value={opt}>
                BO{opt}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Ban 数量">
          <select
            value={matchForm.ban_count}
            onChange={(e) => {
              setMatchForm({ ...matchForm, ban_count: Number(e.target.value) });
              setMatchDirty(true);
            }}
          >
            {banOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} Ban
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="当前局号">
          <select
            value={matchForm.current_game_no}
            onChange={(e) => {
              setMatchForm({ ...matchForm, current_game_no: Number(e.target.value) });
              setMatchDirty(true);
            }}
          >
            {gameOptions.map((opt) => (
              <option key={opt} value={opt}>
                第 {opt} 局
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="比赛状态">
          <select
            value={matchForm.status}
            onChange={(e) => {
              setMatchForm({ ...matchForm, status: e.target.value as any });
              setMatchDirty(true);
            }}
          >
            <option value="running">进行中</option>
            <option value="finished">已结束</option>
          </select>
        </FormField>
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="button" onClick={updateMatch} disabled={saving}>
          保存比赛设置
        </button>
        <button
          className="button secondary"
          onClick={() => {
            setMatchForm(state.match);
            setMatchDirty(false);
          }}
          disabled={saving}
        >
          重置为服务器
        </button>
        {matchDirty ? <span className="pill">已修改</span> : <span className="pill">已同步</span>}
      </div>

      <div style={{ height: 24 }} />
      <div className="panel-title">队伍配置</div>
      <div className="split">
        <div className="card">
          <div className="section-title">红队</div>
          <div className="grid-2">
            <FormField label="队名">
              <input
                value={teamA.name}
                onChange={(e) => {
                  setTeamA({ ...teamA, name: e.target.value });
                  setTeamADirty(true);
                }}
              />
            </FormField>
            <FormField label="队徽 URL">
              <input
                value={teamA.logo_url}
                onChange={(e) => {
                  setTeamA({ ...teamA, logo_url: e.target.value });
                  setTeamADirty(true);
                }}
              />
            </FormField>
            <FormField label="主色">
              <input
                type="color"
                value={teamA.color}
                onChange={(e) => {
                  setTeamA({ ...teamA, color: e.target.value });
                  setTeamADirty(true);
                }}
              />
            </FormField>
            <FormField label="颜色 HEX">
              <input
                value={teamA.color}
                onChange={(e) => {
                  setTeamA({ ...teamA, color: e.target.value });
                  setTeamADirty(true);
                }}
              />
            </FormField>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button" onClick={() => updateTeam('A', teamA)} disabled={saving}>
              保存红队
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setTeamA(state.teams.A);
                setTeamADirty(false);
              }}
              disabled={saving}
            >
              重置
            </button>
            {teamADirty ? <span className="pill">已修改</span> : <span className="pill">已同步</span>}
          </div>
        </div>
        <div className="card">
          <div className="section-title">蓝队</div>
          <div className="grid-2">
            <FormField label="队名">
              <input
                value={teamB.name}
                onChange={(e) => {
                  setTeamB({ ...teamB, name: e.target.value });
                  setTeamBDirty(true);
                }}
              />
            </FormField>
            <FormField label="队徽 URL">
              <input
                value={teamB.logo_url}
                onChange={(e) => {
                  setTeamB({ ...teamB, logo_url: e.target.value });
                  setTeamBDirty(true);
                }}
              />
            </FormField>
            <FormField label="主色">
              <input
                type="color"
                value={teamB.color}
                onChange={(e) => {
                  setTeamB({ ...teamB, color: e.target.value });
                  setTeamBDirty(true);
                }}
              />
            </FormField>
            <FormField label="颜色 HEX">
              <input
                value={teamB.color}
                onChange={(e) => {
                  setTeamB({ ...teamB, color: e.target.value });
                  setTeamBDirty(true);
                }}
              />
            </FormField>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button" onClick={() => updateTeam('B', teamB)} disabled={saving}>
              保存蓝队
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setTeamB(state.teams.B);
                setTeamBDirty(false);
              }}
              disabled={saving}
            >
              重置
            </button>
            {teamBDirty ? <span className="pill">已修改</span> : <span className="pill">已同步</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSettings;
