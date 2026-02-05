import React from 'react';
import { useLiveState } from '../lib/liveState';
import { useMatchTimer } from '../lib/useMatchTimer';
import { BpPayload } from '../types';

interface OverlayViewProps {
  transparent: boolean;
}

const emptyBp = (banCount: number): BpPayload => ({
  teamA: {
    bans: Array.from({ length: banCount }, () => ''),
    picks: Array.from({ length: 5 }, (_, i) => ({ pos: ['上', '野', '中', '射', '辅'][i], hero: '', player: '' }))
  },
  teamB: {
    bans: Array.from({ length: banCount }, () => ''),
    picks: Array.from({ length: 5 }, (_, i) => ({ pos: ['上', '野', '中', '射', '辅'][i], hero: '', player: '' }))
  }
});

const OverlayView: React.FC<OverlayViewProps> = ({ transparent }) => {
  const { state, connected, error } = useLiveState();
  const timerText = useMatchTimer(state?.match ?? null);

  if (!state) {
    return (
      <div className={`w-full h-screen flex items-center justify-center ${transparent ? 'bg-transparent' : 'bg-background-dark'} text-white`}>
        <div className="text-center">
          <div className="text-xl font-bold">Overlay 加载中...</div>
          {error ? <div className="text-sm text-red-400 mt-2">{error}</div> : null}
        </div>
      </div>
    );
  }

  const gameKey = String(state.match.current_game_no);
  const game = state.games[gameKey];
  const bp = game?.bp ?? emptyBp(state.match.ban_count);
  return (
    <div className={`w-full h-screen relative ${transparent ? 'bg-transparent' : 'bg-background-dark'} text-white font-display overflow-hidden`}>
      {/* Top Bar */}
      <header className="absolute top-0 left-0 w-full h-[120px] flex justify-center items-start pt-4 z-50">
        <div className="flex items-center bg-background-dark/95 border-b-2 border-primary/50 shadow-2xl rounded-b-xl px-12 py-3 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-esports-red via-white to-esports-blue opacity-80"></div>
          {/* Red Team */}
          <div className="flex items-center gap-6 pr-12 border-r border-white/10">
            <div className="flex flex-col items-end">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-red-200">{state.teams.A.name || '红队'}</h2>
            </div>
            {state.teams.A.logo_url ? (
              <img className="size-16 rounded-full object-contain bg-black/20" src={state.teams.A.logo_url} />
            ) : (
              <div className="size-16 rounded-full bg-red-900/40 border border-red-500/40" />
            )}
          </div>
          {/* Scoreboard */}
          <div className="flex flex-col items-center px-12 relative">
            <div className="text-6xl font-black leading-none tracking-tighter flex items-center gap-4">
              <span className="text-esports-red">{state.match.score_a}</span>
              <span className="text-white/20 text-4xl">-</span>
              <span className="text-esports-blue">{state.match.score_b}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase border border-primary/30">BO{state.match.best_of}</span>
              <span className="text-gray-400 text-xs font-medium">Game {state.match.current_game_no} · {timerText}</span>
            </div>
          </div>
          {/* Blue Team */}
          <div className="flex items-center gap-6 pl-12 border-l border-white/10">
            {state.teams.B.logo_url ? (
              <img className="size-16 rounded-full object-contain bg-black/20" src={state.teams.B.logo_url} />
            ) : (
              <div className="size-16 rounded-full bg-blue-900/40 border border-blue-500/40" />
            )}
            <div className="flex flex-col items-start">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-blue-200">{state.teams.B.name || '蓝队'}</h2>
            </div>
          </div>
        </div>
      </header>

      {/* Right Sidebar */}
      <aside className="absolute top-[140px] right-4 w-[340px] flex flex-col gap-4 pb-4">
        <div className="bg-background-dark/90 backdrop-blur-md rounded-lg overflow-hidden border border-white/5 shadow-lg">
          <div className="bg-gradient-to-r from-background-dark to-primary/20 px-4 py-2 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-sm tracking-widest uppercase text-white/90">BP 摘要</h3>
            <span className="material-symbols-outlined text-white/50 text-sm">grid_view</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-400 uppercase">红队 Picks</span>
                <span className="size-2 bg-esports-red rounded-full"></span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs text-white/70">
                {bp.teamA.picks.map((pick, idx) => (
                  <div key={idx} className="bg-white/5 rounded px-2 py-1 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/45 uppercase">{pick.pos || `P${idx + 1}`}</span>
                      <span className="text-esports-red/80">{pick.player || '选手待定'}</span>
                    </div>
                    <div className="mt-0.5 text-white">{pick.hero || '英雄未选'}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase">蓝队 Picks</span>
                <span className="size-2 bg-esports-blue rounded-full"></span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs text-white/70">
                {bp.teamB.picks.map((pick, idx) => (
                  <div key={idx} className="bg-white/5 rounded px-2 py-1 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/45 uppercase">{pick.pos || `P${idx + 1}`}</span>
                      <span className="text-esports-blue/80">{pick.player || '选手待定'}</span>
                    </div>
                    <div className="mt-0.5 text-white">{pick.hero || '英雄未选'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background-dark/90 backdrop-blur-md rounded-lg overflow-hidden border border-white/5 shadow-lg">
          <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-sm tracking-widest uppercase text-white/90">连接状态</h3>
            <span className={`text-xs font-bold ${connected ? 'text-green-300' : 'text-red-300'}`}>{connected ? 'LIVE' : 'OFF'}</span>
          </div>
          <div className="p-3 text-xs text-white/60">{connected ? '实时更新中' : '正在重连...'}</div>
        </div>
      </aside>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[600px] h-[40px] bg-background-dark/80 backdrop-blur-sm rounded-full flex items-center justify-between px-6 border border-white/5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">LIVE</span>
          <div className="size-1.5 bg-esports-red rounded-full animate-ping"></div>
        </div>
        <div className="text-xs text-gray-300 font-medium">{state.match.title} · BO{state.match.best_of}</div>
        <div className="text-xs text-gray-400">第 {state.match.current_game_no} 局</div>
      </div>
    </div>
  );
};

export default OverlayView;
