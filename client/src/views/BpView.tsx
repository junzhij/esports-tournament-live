import React from 'react';
import { useLiveState } from '../lib/liveState';
import { BpPayload } from '../types';

interface BpViewProps {
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

const BpView: React.FC<BpViewProps> = ({ transparent }) => {
  const { state, connected, error } = useLiveState();

  if (!state) {
    return (
      <div className={`w-full h-screen flex items-center justify-center ${transparent ? 'bg-transparent' : 'bg-background-dark'} text-white`}>
        <div className="text-center">
          <div className="text-2xl font-bold">正在加载 BP...</div>
          {error ? <div className="text-sm text-red-400 mt-2">{error}</div> : null}
        </div>
      </div>
    );
  }

  const gameKey = String(state.match.current_game_no);
  const game = state.games[gameKey];
  const bp = game?.bp ?? emptyBp(state.match.ban_count);

  return (
    <div className={`w-full h-screen flex flex-col ${transparent ? 'bg-transparent' : 'bg-background-dark'} text-white font-display overflow-hidden`}>
      <header className="h-[120px] shrink-0 w-full bg-[#151b28] border-b border-white/5 flex items-center justify-between px-10 relative z-20">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tight">{state.match.title}</h1>
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mt-1">BO{state.match.best_of} · 第 {state.match.current_game_no} 局</p>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8">
          <div className="text-5xl font-bold text-esports-red">{state.match.score_a}</div>
          <div className="flex flex-col items-center">
            <div className="px-3 py-1 bg-white/10 rounded text-xs font-bold tracking-widest mb-1 text-white/80">比分</div>
            <div className="text-xl font-bold text-white uppercase tracking-wider">VS</div>
          </div>
          <div className="text-5xl font-bold text-esports-blue">{state.match.score_b}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${connected ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
          {game?.bp_locked ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-200">已锁定</span>
          ) : null}
        </div>
      </header>

      <main className="flex flex-1 w-full">
        {(['A', 'B'] as const).map((side) => {
          const team = state.teams[side];
          const teamBp = side === 'A' ? bp.teamA : bp.teamB;
          const colorText = side === 'A' ? 'text-esports-red' : 'text-esports-blue';
          const borderColor = side === 'A' ? 'border-esports-red' : 'border-esports-blue';
          const borderColorLight = side === 'A' ? 'border-esports-red/40' : 'border-esports-blue/40';
          const borderColorSoft = side === 'A' ? 'border-esports-red/30' : 'border-esports-blue/30';
          return (
            <section key={side} className="flex-1 flex flex-col p-6 gap-4 bg-[#101622]/50">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black italic tracking-tight">
                  <span className={colorText}>{team.name || (side === 'A' ? '红队' : '蓝队')}</span>
                </h2>
                {team.logo_url ? (
                  <img className="w-12 h-12 object-contain" src={team.logo_url} />
                ) : (
                  <div className={`w-12 h-12 rounded-full border ${borderColorLight} bg-white/5`} />
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 flex-1">
                {teamBp.picks.map((pick, idx) => (
                  <div key={idx} className={`relative flex items-center bg-[#1a202c] rounded-xl overflow-hidden border-l-4 ${borderColor}`}>
                    <div className="w-24 h-full flex items-center justify-center bg-black/20 text-white/30 text-sm font-bold">{pick.pos}</div>
                    <div className="flex-1 flex flex-col justify-center px-4">
                      <p className="text-2xl font-black text-white leading-none">{pick.hero || '等待选择'}</p>
                      <p className={`text-base font-medium mt-1 ${colorText}`}>{pick.player || '选手待定'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase text-white/40 tracking-widest">Ban</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {teamBp.bans.map((ban, idx) => (
                    <div key={idx} className={`h-16 w-16 rounded bg-[#1a202c] border ${borderColorSoft} flex items-center justify-center text-xs text-white/70`}>
                      {ban || '空'}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <footer className="h-[80px] w-full bg-[#0c1018] border-t border-white/5 flex items-center justify-between px-10 text-sm text-white/60">
        <span>状态：{game?.bp_locked ? '已锁定' : '等待发布 / 可编辑'}</span>
        <span>数据源：{connected ? '实时连接' : '断线重连中'}</span>
      </footer>
    </div>
  );
};

export default BpView;
