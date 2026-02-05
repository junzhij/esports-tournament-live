import React from 'react';
import { useLiveState } from '../lib/liveState';

interface ResultViewProps {
  transparent: boolean;
}

const ResultView: React.FC<ResultViewProps> = ({ transparent }) => {
  const { state, connected, error } = useLiveState();

  if (!state) {
    return (
      <div className={`w-full h-screen flex items-center justify-center ${transparent ? 'bg-transparent' : 'bg-background-dark'} text-white`}>
        <div className="text-center">
          <div className="text-2xl font-bold">结算加载中...</div>
          {error ? <div className="text-sm text-red-400 mt-2">{error}</div> : null}
        </div>
      </div>
    );
  }

  const gameKey = String(state.match.current_game_no);
  const game = state.games[gameKey];
  const result = game?.result;
  const winnerName = result ? (result.winner === 'A' ? state.teams.A.name : state.teams.B.name) : '待定';
  const winnerColor = result?.winner === 'A' ? 'text-esports-red' : 'text-esports-blue';

  return (
    <div className={`w-full h-screen flex flex-col ${transparent ? 'bg-transparent' : 'bg-background-dark'} text-white font-display overflow-hidden relative`}>
      <span className="hidden text-esports-red text-esports-blue"></span>
      <header className="flex h-[140px] shrink-0 items-center justify-between border-b border-white/10 bg-[#111318]/80 px-12 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-3xl font-bold text-white">{state.teams.A.name || '红队'}</span>
            <span className="text-sm font-medium text-gray-400 tracking-wider">SCORE</span>
          </div>
          <div className="flex items-center gap-4 px-4">
            <span className="text-5xl font-black text-white">{state.match.score_a}</span>
            <span className="h-8 w-px bg-white/20"></span>
            <span className="text-5xl font-black text-white/40">{state.match.score_b}</span>
          </div>
          <div className="flex flex-col items-start opacity-80">
            <span className="text-3xl font-bold text-white">{state.teams.B.name || '蓝队'}</span>
            <span className="text-sm font-medium text-gray-400 tracking-wider">SCORE</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="bg-gold-gradient bg-clip-text text-transparent text-5xl font-black italic tracking-tighter gold-text-glow">RESULT</h1>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-esports-gold-light mt-1">Game {state.match.current_game_no}</div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">连接状态</p>
          <span className={`text-sm font-bold ${connected ? 'text-green-300' : 'text-red-300'}`}>{connected ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-8">
        <div className="relative flex w-full max-w-6xl overflow-hidden rounded-2xl border border-esports-gold/30 bg-card-gradient shadow-[0_0_50px_rgba(198,164,86,0.1)]">
          <div className="relative w-5/12 min-w-[360px] bg-gradient-to-b from-[#1a202c] to-[#101622] flex flex-col justify-between p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded bg-esports-gold px-4 py-1.5 shadow-lg shadow-yellow-900/20">
                <span className="material-symbols-outlined text-black text-[20px] font-bold">trophy</span>
                <span className="text-sm font-black tracking-wider text-black">胜方</span>
              </div>
              <h2 className={`mt-6 text-4xl font-black ${winnerColor}`}>{winnerName || '待定'}</h2>
              <p className="text-sm text-white/60 mt-2">BO{state.match.best_of} · 比分 {state.match.score_a}:{state.match.score_b}</p>
            </div>
            <div className="text-xs text-white/50">{state.match.title}</div>
          </div>

          <div className="relative flex w-7/12 flex-col justify-center p-10">
            <div className="mb-6 border-b border-white/10 pb-4">
              <div className="flex items-end gap-4">
                <h3 className="text-5xl font-black uppercase leading-none tracking-tight text-white">{result?.mvp.player || 'MVP 待定'}</h3>
                <span className="mb-2 text-xl font-medium text-esports-gold-light opacity-80">{result?.mvp.hero || '英雄未定'}</span>
              </div>
              <div className="mt-2 text-gray-400 text-sm">KDA：{result?.mvp.kda || '-'}</div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">输出占比</p>
                <p className="font-display text-2xl font-bold text-white">{result?.key_stats.damage_share || '--'}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">承伤占比</p>
                <p className="font-display text-2xl font-bold text-white">{result?.key_stats.damage_taken_share || '--'}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">参团率</p>
                <p className="font-display text-2xl font-bold text-white">{result?.key_stats.participation || '--'}</p>
              </div>
            </div>

            {result?.highlight_text ? (
              <div className="text-sm text-white/70">高光：{result.highlight_text}</div>
            ) : (
              <div className="text-sm text-white/50">等待填写高光描述</div>
            )}
          </div>
        </div>
      </main>

      <footer className="h-[120px] w-full border-t border-white/10 bg-[#111318]/90 px-12 py-5 backdrop-blur-md flex items-center justify-between">
        <div className="text-sm text-white/70">当前局：第 {state.match.current_game_no} 局</div>
        <div className="text-sm text-white/70">状态：{state.match.status === 'running' ? '进行中' : '已结束'}</div>
      </footer>
    </div>
  );
};

export default ResultView;
