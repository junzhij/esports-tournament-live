import React from 'react';
import { IMAGES } from '../constants';

const BanPickView: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full bg-background-dark text-white font-display overflow-hidden selection:bg-primary/30">
      {/* Top Bar (120px) */}
      <header className="h-[120px] shrink-0 w-full bg-[#151b28] border-b border-white/5 flex items-center justify-between px-10 relative z-20 shadow-xl">
        {/* Left: Tournament Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Challenger Series</h1>
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mt-1">Winter Championship • Finals</p>
        </div>
        {/* Center: Score Board */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8">
          {/* Red Score */}
          <div className="text-5xl font-bold text-esports-red text-shadow">1</div>
          <div className="flex flex-col items-center">
            <div className="px-3 py-1 bg-white/10 rounded text-xs font-bold tracking-widest mb-1 text-white/80">BO5</div>
            <div className="text-xl font-bold text-white uppercase tracking-wider">Game 3</div>
          </div>
          {/* Blue Score */}
          <div className="text-5xl font-bold text-esports-blue text-shadow">1</div>
        </div>
        {/* Right: League/Sponsor or Extra Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase font-bold">Patch</p>
            <p className="text-lg font-bold">14.2</p>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-white/50">public</span>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex flex-1 w-full relative h-[calc(100vh-120px)]">
        {/* Background Accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-esports-red/10 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-esports-blue/10 to-transparent"></div>
        </div>
        
        {/* RED TEAM SECTION (Left) */}
        <section className="flex-1 flex flex-col p-6 pr-2 gap-4 relative z-10 border-r border-white/5 bg-[#101622]/50">
          {/* Team Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-4xl font-black text-white italic tracking-tighter drop-shadow-lg">
              <span className="text-esports-red">RED</span> WARRIORS
            </h2>
            <div className="h-10 w-10 bg-esports-red/20 rounded-full flex items-center justify-center border border-esports-red/50">
              <span className="material-symbols-outlined text-esports-red">swords</span>
            </div>
          </div>
          {/* Vertical Picks */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Slot 1: Picked */}
            <div className="flex-1 relative flex items-center bg-[#1a202c] rounded-xl overflow-hidden border-l-4 border-esports-red group">
              <div className="w-24 h-full flex items-center justify-center bg-black/20 text-white/30 group-hover:text-esports-red transition-colors">
                <span className="material-symbols-outlined text-3xl">arrow_upward</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4 z-10 relative">
                <p className="text-sm font-bold text-white/50 uppercase tracking-wider">Top Lane</p>
                <p className="text-2xl font-black text-white leading-none">Aatrox</p>
                <p className="text-base text-esports-red font-medium mt-1">PlayerOne</p>
              </div>
              <div className="absolute inset-y-0 right-0 w-3/5 bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.AATROX}')`, clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#1a202c]"></div>
              </div>
            </div>
            {/* Slot 2: Picked */}
            <div className="flex-1 relative flex items-center bg-[#1a202c] rounded-xl overflow-hidden border-l-4 border-esports-red group">
              <div className="w-24 h-full flex items-center justify-center bg-black/20 text-white/30 group-hover:text-esports-red transition-colors">
                <span className="material-symbols-outlined text-3xl">park</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4 z-10 relative">
                <p className="text-sm font-bold text-white/50 uppercase tracking-wider">Jungle</p>
                <p className="text-2xl font-black text-white leading-none">Sejuani</p>
                <p className="text-base text-esports-red font-medium mt-1">JungleKing</p>
              </div>
              <div className="absolute inset-y-0 right-0 w-3/5 bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.SEJUANI}')`, clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#1a202c]"></div>
              </div>
            </div>
            {/* Slot 3: PICKING (Active) */}
            <div className="flex-1 relative flex items-center bg-[#252f3e] rounded-xl overflow-hidden border-2 border-yellow-500 locked-glow">
              <div className="absolute inset-0 bg-yellow-500/5 animate-pulse z-0"></div>
              <div className="w-24 h-full flex items-center justify-center bg-black/20 text-yellow-500 relative z-10">
                <span className="material-symbols-outlined text-3xl">adjust</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4 z-10 relative">
                <p className="text-sm font-bold text-yellow-500 uppercase tracking-wider animate-pulse">Picking...</p>
                <p className="text-3xl font-black text-white leading-none tracking-tight">Ahri</p>
                <p className="text-base text-white/60 font-medium mt-1">FakerFan</p>
              </div>
              <div className="absolute inset-y-0 right-0 w-3/5 bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.AHRI}')`, clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)', opacity: 0.8 }}>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#252f3e]"></div>
              </div>
            </div>
            {/* Slot 4: Empty */}
            <div className="flex-1 relative flex items-center bg-[#131821] pattern-diagonal-stripes rounded-xl overflow-hidden border-l-4 border-white/5 opacity-60">
              <div className="w-24 h-full flex items-center justify-center text-white/10">
                <span className="material-symbols-outlined text-3xl">my_location</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4">
                <p className="text-sm font-bold text-white/30 uppercase tracking-wider">Bot</p>
                <p className="text-2xl font-black text-white/20 leading-none">Waiting...</p>
              </div>
            </div>
            {/* Slot 5: Empty */}
            <div className="flex-1 relative flex items-center bg-[#131821] pattern-diagonal-stripes rounded-xl overflow-hidden border-l-4 border-white/5 opacity-60">
              <div className="w-24 h-full flex items-center justify-center text-white/10">
                <span className="material-symbols-outlined text-3xl">local_hospital</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4">
                <p className="text-sm font-bold text-white/30 uppercase tracking-wider">Support</p>
                <p className="text-2xl font-black text-white/20 leading-none">Waiting...</p>
              </div>
            </div>
          </div>
          {/* Bans Header & Slots */}
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase text-white/40 tracking-widest">Red Bans</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            <div className="flex gap-3">
              {[IMAGES.BAN_1, IMAGES.BAN_2, IMAGES.BAN_3].map((img, i) => (
                <div key={i} className="h-16 w-16 rounded bg-[#1a202c] border border-esports-red/30 grayscale hover:grayscale-0 transition-all bg-cover bg-center relative" style={{ backgroundImage: `url('${img}')` }}>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40"><span className="material-symbols-outlined text-red-500 text-3xl font-bold">block</span></div>
                </div>
              ))}
              <div className="h-16 w-16 rounded bg-[#131821] border border-white/5 flex items-center justify-center"></div>
              <div className="h-16 w-16 rounded bg-[#131821] border border-white/5 flex items-center justify-center"></div>
            </div>
          </div>
        </section>

        {/* CENTER STATUS (Absolute) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[140px] -translate-x-1/2 z-30 flex flex-col items-center pt-8 pointer-events-none">
          {/* Timer Circle */}
          <div className="w-24 h-24 rounded-full bg-[#1a2332] border-4 border-white/10 flex items-center justify-center shadow-2xl relative mb-6">
            <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
              <circle className="text-esports-red" cx="48" cy="48" fill="transparent" r="44" stroke="currentColor" strokeDasharray="276" strokeDashoffset="60" strokeWidth="4"></circle>
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white leading-none">24</span>
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest mt-1">SEC</span>
            </div>
          </div>
          {/* VS Badge */}
          <div className="text-6xl font-black italic text-white/10 select-none mb-12">VS</div>
          {/* Phase Indicator */}
          <div className="bg-[#1a2332] px-4 py-3 rounded-lg border border-white/10 text-center shadow-lg w-[180px]">
            <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Current Phase</p>
            <p className="text-lg font-bold text-esports-red animate-pulse">Red Picking</p>
          </div>
        </div>

        {/* BLUE TEAM SECTION (Right) */}
        <section className="flex-1 flex flex-col p-6 pl-2 gap-4 relative z-10 bg-[#101622]/50 text-right">
          {/* Team Header */}
          <div className="flex items-center justify-between mb-2 flex-row-reverse">
            <h2 className="text-4xl font-black text-white italic tracking-tighter drop-shadow-lg">
              <span className="text-esports-blue">BLUE</span> SQUAD
            </h2>
            <div className="h-10 w-10 bg-esports-blue/20 rounded-full flex items-center justify-center border border-esports-blue/50">
              <span className="material-symbols-outlined text-esports-blue">shield</span>
            </div>
          </div>
          {/* Vertical Picks */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Slot 1: Locked */}
            <div className="flex-1 relative flex flex-row-reverse items-center bg-[#1a202c] rounded-xl overflow-hidden border-r-4 border-esports-blue group">
              <div className="w-24 h-full flex items-center justify-center bg-black/20 text-white/30 group-hover:text-esports-blue transition-colors">
                <span className="material-symbols-outlined text-3xl">arrow_upward</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4 z-10 relative">
                <p className="text-sm font-bold text-white/50 uppercase tracking-wider">Top Lane</p>
                <p className="text-2xl font-black text-white leading-none">Ornn</p>
                <p className="text-base text-esports-blue font-medium mt-1">TopG</p>
              </div>
              <div className="absolute inset-y-0 left-0 w-3/5 bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.ORNN}')`, clipPath: 'polygon(0 0, 80% 0, 100% 100%, 0% 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1a202c]"></div>
              </div>
            </div>
             {/* Slot 2: Locked */}
             <div className="flex-1 relative flex flex-row-reverse items-center bg-[#1a202c] rounded-xl overflow-hidden border-r-4 border-esports-blue group">
              <div className="w-24 h-full flex items-center justify-center bg-black/20 text-white/30 group-hover:text-esports-blue transition-colors">
                <span className="material-symbols-outlined text-3xl">park</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4 z-10 relative">
                <p className="text-sm font-bold text-white/50 uppercase tracking-wider">Jungle</p>
                <p className="text-2xl font-black text-white leading-none">Vi</p>
                <p className="text-base text-esports-blue font-medium mt-1">Punchy</p>
              </div>
              <div className="absolute inset-y-0 left-0 w-3/5 bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.VI}')`, clipPath: 'polygon(0 0, 80% 0, 100% 100%, 0% 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1a202c]"></div>
              </div>
            </div>
            {/* Slot 3: Empty (Waiting for Turn) */}
            <div className="flex-1 relative flex flex-row-reverse items-center bg-[#131821] pattern-diagonal-stripes rounded-xl overflow-hidden border-r-4 border-white/5 opacity-80">
              <div className="w-24 h-full flex items-center justify-center text-white/10">
                <span className="material-symbols-outlined text-3xl">adjust</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4 z-10 relative">
                <p className="text-sm font-bold text-white/30 uppercase tracking-wider">Mid</p>
                <p className="text-2xl font-black text-white/40 leading-none">Picking Soon</p>
                <p className="text-base text-white/20 font-medium mt-1">MidLaner</p>
              </div>
            </div>
             {/* Slot 4: Empty */}
             <div className="flex-1 relative flex flex-row-reverse items-center bg-[#131821] pattern-diagonal-stripes rounded-xl overflow-hidden border-r-4 border-white/5 opacity-60">
              <div className="w-24 h-full flex items-center justify-center text-white/10">
                <span className="material-symbols-outlined text-3xl">my_location</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4">
                <p className="text-sm font-bold text-white/30 uppercase tracking-wider">Bot</p>
                <p className="text-2xl font-black text-white/20 leading-none">Waiting...</p>
              </div>
            </div>
             {/* Slot 5: Empty */}
             <div className="flex-1 relative flex flex-row-reverse items-center bg-[#131821] pattern-diagonal-stripes rounded-xl overflow-hidden border-r-4 border-white/5 opacity-60">
              <div className="w-24 h-full flex items-center justify-center text-white/10">
                <span className="material-symbols-outlined text-3xl">local_hospital</span>
              </div>
              <div className="flex-1 flex flex-col justify-center px-4">
                <p className="text-sm font-bold text-white/30 uppercase tracking-wider">Support</p>
                <p className="text-2xl font-black text-white/20 leading-none">Waiting...</p>
              </div>
            </div>
          </div>
          {/* Bans Header & Slots */}
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2 flex-row-reverse">
              <span className="text-xs font-bold uppercase text-white/40 tracking-widest">Blue Bans</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            <div className="flex gap-3 justify-end">
              {[IMAGES.BAN_4, IMAGES.BAN_5].map((img, i) => (
                 <div key={i} className="h-16 w-16 rounded bg-[#1a202c] border border-esports-blue/30 grayscale hover:grayscale-0 transition-all bg-cover bg-center relative" style={{ backgroundImage: `url('${img}')` }}>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40"><span className="material-symbols-outlined text-esports-blue text-3xl font-bold">block</span></div>
                </div>
              ))}
              <div className="h-16 w-16 rounded bg-[#131821] border border-white/5 flex items-center justify-center"></div>
              <div className="h-16 w-16 rounded bg-[#131821] border border-white/5 flex items-center justify-center"></div>
              <div className="h-16 w-16 rounded bg-[#131821] border border-white/5 flex items-center justify-center"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BanPickView;
