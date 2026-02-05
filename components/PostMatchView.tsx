import React from 'react';
import { IMAGES } from '../constants';

const PostMatchView: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-white h-screen flex flex-col selection:bg-esports-gold selection:text-black font-display overflow-hidden relative">
        {/* Background texture/pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #C6A456 0%, transparent 40%)' }}></div>
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Top Bar (140px) */}
        <header className="relative z-10 flex h-[140px] shrink-0 items-center justify-between border-b border-white/10 bg-[#111318]/80 px-12 backdrop-blur-md">
            {/* Series Score Left */}
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold text-white">TL</span>
                    <span className="text-sm font-medium text-gray-400 tracking-wider">TEAM LIQUID</span>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded bg-blue-900/20 border border-blue-500/30">
                    <img className="h-10 w-10 object-contain opacity-80" src={IMAGES.LOGO_TL} />
                </div>
                <div className="flex items-center gap-4 px-4">
                    <span className="text-5xl font-black text-white">2</span>
                    <span className="h-8 w-px bg-white/20"></span>
                    <span className="text-5xl font-black text-white/40">1</span>
                </div>
                 <div className="flex h-16 w-16 items-center justify-center rounded bg-red-900/20 border border-red-500/30 grayscale opacity-60">
                    <img className="h-10 w-10 object-contain opacity-80" src={IMAGES.LOGO_T1} />
                </div>
                <div className="flex flex-col items-start opacity-60">
                    <span className="text-3xl font-bold text-white">T1</span>
                    <span className="text-sm font-medium text-gray-400 tracking-wider">T1 ESPORTS</span>
                </div>
            </div>
            
            {/* Main Title Center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <h1 className="bg-gold-gradient bg-clip-text text-transparent text-6xl font-black italic tracking-tighter gold-text-glow">VICTORY</h1>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="h-px w-8 bg-esports-gold"></span>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-esports-gold-light">Match Complete</p>
                    <span className="h-px w-8 bg-esports-gold"></span>
                </div>
            </div>

            {/* Event Branding Right */}
             <div className="flex flex-col items-end gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">World Championship 2024</p>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-esports-gold text-[20px]">trophy</span>
                    <span className="text-xl font-bold text-white">Grand Finals</span>
                </div>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Game 3 of 5</span>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex flex-1 items-center justify-center p-8">
            {/* Centerpiece MVP Card */}
            <div className="relative flex w-full max-w-7xl overflow-hidden rounded-2xl border border-esports-gold/30 bg-card-gradient shadow-[0_0_50px_rgba(198,164,86,0.1)]">
                {/* Hero Portrait (Left Side) */}
                <div className="relative w-5/12 min-w-[400px]">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${IMAGES.FAKER_PORTRAIT}')` }}></div>
                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#101622]/90"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-[#101622] via-transparent to-transparent"></div>
                     {/* MVP Badge */}
                     <div className="absolute left-6 top-6 flex items-center gap-2 rounded bg-esports-gold px-4 py-1.5 shadow-lg shadow-yellow-900/20">
                        <span className="material-symbols-outlined text-black text-[20px] font-bold">star</span>
                        <span className="text-sm font-black tracking-wider text-black">MVP OF THE MATCH</span>
                     </div>
                </div>

                {/* Stats & Info (Right Side) */}
                <div className="relative flex w-7/12 flex-col justify-center p-10 pl-0">
                    {/* Player Header */}
                     <div className="mb-8 border-b border-white/10 pb-6">
                        <div className="flex items-end gap-4">
                            <h2 className="text-7xl font-black uppercase leading-none tracking-tight text-white">Faker</h2>
                            <span className="mb-2 text-2xl font-medium text-esports-gold-light opacity-80">Mid Lane</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-gray-400">
                             <span className="material-symbols-outlined text-[18px]">sports_esports</span>
                             <span className="text-lg uppercase tracking-wide">Playing as <span className="text-white font-bold">Ahri</span></span>
                        </div>
                     </div>
                     
                     {/* Key Stats Grid */}
                     <div className="mb-8 grid grid-cols-4 gap-4">
                        {/* KDA */}
                        <div className="group flex flex-col gap-1 rounded-lg border border-white/5 bg-white/5 p-4 transition-colors hover:border-esports-gold/30 hover:bg-white/10">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-esports-gold-light">K / D / A</p>
                            <p className="font-display text-3xl font-bold text-white">8 / 1 / 12</p>
                            <p className="text-xs text-green-400 font-medium">20.0 KDA</p>
                        </div>
                        {/* Damage Share */}
                         <div className="group flex flex-col gap-1 rounded-lg border border-white/5 bg-white/5 p-4 transition-colors hover:border-esports-gold/30 hover:bg-white/10">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-esports-gold-light">Damage %</p>
                            <p className="font-display text-3xl font-bold text-white">32.5%</p>
                            <p className="text-xs text-esports-gold font-medium">#1 in Game</p>
                        </div>
                         {/* Kill Participation */}
                         <div className="group flex flex-col gap-1 rounded-lg border border-white/5 bg-white/5 p-4 transition-colors hover:border-esports-gold/30 hover:bg-white/10">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-esports-gold-light">KP %</p>
                            <p className="font-display text-3xl font-bold text-white">85%</p>
                            <p className="text-xs text-gray-500 font-medium">Team Avg: 62%</p>
                        </div>
                         {/* CS/Min */}
                        <div className="group flex flex-col gap-1 rounded-lg border border-white/5 bg-white/5 p-4 transition-colors hover:border-esports-gold/30 hover:bg-white/10">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-esports-gold-light">CS / Min</p>
                            <p className="font-display text-3xl font-bold text-white">9.8</p>
                            <p className="text-xs text-green-400 font-medium">+1.2 vs Avg</p>
                        </div>
                     </div>

                     {/* Performance Tags */}
                     <div className="flex flex-wrap gap-3">
                         <div className="flex items-center gap-2 rounded-full border border-esports-gold/20 bg-esports-gold/10 px-4 py-1.5 text-esports-gold-light">
                             <span className="material-symbols-outlined text-[16px]">bolt</span>
                             <span className="text-sm font-bold uppercase tracking-wide">Legendary</span>
                         </div>
                         <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-gray-300">
                             <span className="material-symbols-outlined text-[16px]">swords</span>
                             <span className="text-sm font-bold uppercase tracking-wide">Top Damage</span>
                         </div>
                          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-gray-300">
                             <span className="material-symbols-outlined text-[16px]">psychology</span>
                             <span className="text-sm font-bold uppercase tracking-wide">Playmaker</span>
                         </div>
                          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-gray-300">
                             <span className="material-symbols-outlined text-[16px]">visibility</span>
                             <span className="text-sm font-bold uppercase tracking-wide">Visionary</span>
                         </div>
                     </div>
                </div>
            </div>
        </main>

        {/* Bottom Section (160px) */}
        <footer className="relative z-10 grid h-[160px] shrink-0 grid-cols-[1.5fr_1fr] gap-8 border-t border-white/10 bg-[#111318]/90 px-12 py-5 backdrop-blur-md">
            {/* Match Highlights */}
            <div className="flex flex-col justify-center border-r border-white/10 pr-8">
                <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-esports-gold text-[20px]">videocam</span>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Match Highlights</h3>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-[10px] font-mono text-esports-gold bg-esports-gold/10 px-1.5 rounded">22:15</span>
                        <p className="text-sm text-gray-300 line-clamp-1"><span className="text-white font-medium">Baron Steal:</span> Faker interrupts the enemy jungler with Charm to secure Baron.</p>
                    </div>
                     <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-[10px] font-mono text-esports-gold bg-esports-gold/10 px-1.5 rounded">34:40</span>
                        <p className="text-sm text-gray-300 line-clamp-1"><span className="text-white font-medium">Base Defense:</span> Triple kill defense at the nexus towers turns the tide.</p>
                    </div>
                     <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-[10px] font-mono text-esports-gold bg-esports-gold/10 px-1.5 rounded">38:12</span>
                        <p className="text-sm text-gray-300 line-clamp-1"><span className="text-white font-medium">Game Ending:</span> Perfect elder dragon fight execution.</p>
                    </div>
                </div>
            </div>
            
            {/* Next Game Teaser */}
            <div className="flex items-center justify-between pl-4">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-esports-gold mb-1">Coming Up Next</p>
                    <p className="text-xl font-bold text-white">Lower Bracket Finals</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>Starts in 12:00</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg bg-white/5 p-3 border border-white/5">
                    <img className="h-10 w-10 object-contain" src={IMAGES.G2_LOGO} />
                    <span className="font-black text-gray-500">VS</span>
                    <img className="h-10 w-10 object-contain" src={IMAGES.FNATIC_LOGO} />
                </div>
            </div>
        </footer>
    </div>
  );
};

export default PostMatchView;
