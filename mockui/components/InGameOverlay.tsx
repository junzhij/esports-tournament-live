import React from 'react';
import { IMAGES } from '../constants';

const InGameOverlay: React.FC = () => {
  return (
    <div className="w-full h-full relative font-display text-white overflow-hidden bg-transparent">
        {/* Mock Game Background (Replaceable with transparency in OBS) */}
        <div className="absolute inset-0 -z-10 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.GAME_BG}')` }}></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
        
        {/* Top Bar */}
        <header className="absolute top-0 left-0 w-full h-[120px] flex justify-center items-start pt-4 z-50">
            <div className="flex items-center bg-background-dark/95 border-b-2 border-primary/50 shadow-2xl rounded-b-xl px-12 py-3 backdrop-blur-md relative overflow-hidden">
                {/* Decorative Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-esports-red via-white to-esports-blue opacity-80"></div>
                {/* Red Team */}
                <div className="flex items-center gap-6 pr-12 border-r border-white/10">
                    <div className="flex flex-col items-end">
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-red-200">Crimson Fury</h2>
                        <span className="text-xs text-red-400 font-medium">LPL Region</span>
                    </div>
                    <div className="size-16 rounded-full bg-gradient-to-br from-red-900 to-red-600 p-1 ring-2 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                        <img alt="Red Team Logo" className="w-full h-full rounded-full bg-black/20" src={IMAGES.LOGO_RED_SHAPE} />
                    </div>
                </div>
                {/* Scoreboard */}
                <div className="flex flex-col items-center px-12 relative">
                    <div className="text-6xl font-black leading-none tracking-tighter flex items-center gap-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        <span className="text-esports-red">2</span>
                        <span className="text-white/20 text-4xl">-</span>
                        <span className="text-esports-blue">1</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase border border-primary/30">BO5</span>
                        <span className="text-gray-400 text-xs font-medium">Game 4 • 24:15</span>
                    </div>
                </div>
                {/* Blue Team */}
                <div className="flex items-center gap-6 pl-12 border-l border-white/10">
                    <div className="size-16 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 p-1 ring-2 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <img alt="Blue Team Logo" className="w-full h-full rounded-full bg-black/20" src={IMAGES.LOGO_BLUE_SHAPE} />
                    </div>
                    <div className="flex flex-col items-start">
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-blue-200">Azure Kings</h2>
                        <span className="text-xs text-blue-400 font-medium">LCK Region</span>
                    </div>
                </div>
            </div>
        </header>

        {/* Right Sidebar (Stats & MVP) */}
        <aside className="absolute top-[140px] right-4 w-[340px] flex flex-col gap-4 pb-4">
            {/* Current Match State / Objective Timer Mockup */}
            <div className="bg-background-dark/90 backdrop-blur-md rounded-lg overflow-hidden border border-white/5 shadow-lg">
                <div className="bg-gradient-to-r from-background-dark to-primary/20 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-sm tracking-widest uppercase text-white/90">Objectives</h3>
                    <span className="material-symbols-outlined text-primary text-lg">timer</span>
                </div>
                <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-400">hexagon</span>
                            <span className="text-sm font-medium">Baron Nashor</span>
                        </div>
                        <span className="text-sm font-mono text-white bg-black/40 px-2 py-0.5 rounded">04:20</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-yellow-500">local_fire_department</span>
                            <span className="text-sm font-medium">Dragon Soul</span>
                        </div>
                        <span className="text-sm font-mono text-green-400 bg-black/40 px-2 py-0.5 rounded">Spawned</span>
                    </div>
                </div>
            </div>

            {/* Ban / Pick Summary */}
            <div className="bg-background-dark/90 backdrop-blur-md rounded-lg overflow-hidden border border-white/5 shadow-lg flex-1">
                <div className="bg-gradient-to-r from-background-dark to-primary/20 px-4 py-3 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-sm tracking-widest uppercase text-white/90">Ban / Pick Phase</h3>
                    <span className="material-symbols-outlined text-white/50 text-sm">grid_view</span>
                </div>
                <div className="p-4 space-y-6">
                    {/* Red Team Picks */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-red-400 uppercase">Crimson Picks</span>
                            <span className="size-2 bg-esports-red rounded-full animate-pulse"></span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            <div className="relative group aspect-square">
                                <img alt="Hero Portrait" className="w-full h-full object-cover rounded border border-esports-red/30 group-hover:border-esports-red transition-colors" src={IMAGES.P1_FACE} />
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 text-[8px] text-center py-0.5">TOP</div>
                            </div>
                            <div className="relative group aspect-square">
                                <img alt="Hero Portrait" className="w-full h-full object-cover rounded border border-esports-red/30 group-hover:border-esports-red transition-colors" src={IMAGES.P2_FACE} />
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 text-[8px] text-center py-0.5">JGL</div>
                            </div>
                            <div className="relative group aspect-square">
                                <img alt="Hero Portrait" className="w-full h-full object-cover rounded border border-esports-red/30 group-hover:border-esports-red transition-colors grayscale opacity-50" src={IMAGES.P3_FACE} />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <span className="material-symbols-outlined text-white text-lg drop-shadow-md">lock</span>
                                </div>
                            </div>
                            <div className="relative group aspect-square bg-white/5 rounded border border-white/10 flex items-center justify-center">
                                <span className="text-[10px] text-white/20">...</span>
                            </div>
                            <div className="relative group aspect-square bg-white/5 rounded border border-white/10 flex items-center justify-center">
                                <span className="text-[10px] text-white/20">...</span>
                            </div>
                        </div>
                    </div>

                    {/* Blue Team Picks */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-blue-400 uppercase">Azure Picks</span>
                            <span className="size-2 bg-esports-blue rounded-full"></span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                             <div className="relative group aspect-square">
                                <img alt="Hero Portrait" className="w-full h-full object-cover rounded border border-esports-blue/30 group-hover:border-esports-blue transition-colors" src={IMAGES.P4_FACE} />
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 text-[8px] text-center py-0.5">TOP</div>
                            </div>
                            <div className="relative group aspect-square">
                                <img alt="Hero Portrait" className="w-full h-full object-cover rounded border border-esports-blue/30 group-hover:border-esports-blue transition-colors" src={IMAGES.P5_FACE} />
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 text-[8px] text-center py-0.5">JGL</div>
                            </div>
                             <div className="relative group aspect-square">
                                <img alt="Hero Portrait" className="w-full h-full object-cover rounded border border-esports-blue/30 group-hover:border-esports-blue transition-colors" src={IMAGES.P6_FACE} />
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 text-[8px] text-center py-0.5">MID</div>
                            </div>
                            <div className="relative group aspect-square bg-white/5 rounded border border-white/10 flex items-center justify-center">
                                <div className="animate-pulse w-4 h-0.5 bg-esports-blue"></div>
                            </div>
                            <div className="relative group aspect-square bg-white/5 rounded border border-white/10 flex items-center justify-center">
                                <span className="text-[10px] text-white/20">...</span>
                            </div>
                        </div>
                    </div>

                    {/* Bans Section */}
                    <div className="pt-4 border-t border-white/10">
                        <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-2 tracking-wider">Banned Champions</h4>
                        <div className="flex justify-between gap-4">
                            {/* Red Bans */}
                            <div className="flex gap-1">
                                <div className="size-8 rounded overflow-hidden relative grayscale opacity-70">
                                    <img className="w-full h-full object-cover" src={IMAGES.BAN_1} />
                                    <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center"><span className="material-symbols-outlined text-xs">block</span></div>
                                </div>
                                <div className="size-8 rounded overflow-hidden relative grayscale opacity-70">
                                    <img className="w-full h-full object-cover" src={IMAGES.BAN_3} />
                                    <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center"><span className="material-symbols-outlined text-xs">block</span></div>
                                </div>
                            </div>
                            {/* Blue Bans */}
                             <div className="flex gap-1">
                                <div className="size-8 rounded overflow-hidden relative grayscale opacity-70">
                                    <img className="w-full h-full object-cover" src={IMAGES.BAN_4} />
                                    <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center"><span className="material-symbols-outlined text-xs">block</span></div>
                                </div>
                                <div className="size-8 bg-white/5 rounded border border-white/5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MVP Candidate Highlight */}
            <div className="bg-background-dark/90 backdrop-blur-md rounded-lg overflow-hidden border border-white/5 shadow-lg mt-auto">
                <div className="relative h-48 overflow-hidden">
                    <img alt="Player photo" className="w-full h-full object-cover object-top opacity-80" src={IMAGES.PLAYER_FOCUSED} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-[10px] px-1.5 py-0.5 rounded border border-yellow-500/30 mb-1 font-bold">
                                    <span className="material-symbols-outlined text-[12px]">star</span>
                                    MVP Candidate
                                </div>
                                <h3 className="text-xl font-bold text-white leading-none">Faker</h3>
                                <p className="text-sm text-gray-400">Mid Laner</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-mono font-bold text-green-400">7/0/4</div>
                                <div className="text-[10px] uppercase text-gray-500">KDA Ratio</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/20">
                    <div className="p-2 text-center">
                        <div className="text-xs text-gray-400 uppercase text-[9px]">Gold</div>
                        <div className="font-mono font-bold text-sm">12.4k</div>
                    </div>
                     <div className="p-2 text-center">
                        <div className="text-xs text-gray-400 uppercase text-[9px]">Dmg/Min</div>
                        <div className="font-mono font-bold text-sm">845</div>
                    </div>
                     <div className="p-2 text-center">
                        <div className="text-xs text-gray-400 uppercase text-[9px]">KP%</div>
                        <div className="font-mono font-bold text-sm">82%</div>
                    </div>
                </div>
            </div>
        </aside>

        {/* Bottom Info */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[600px] h-[40px] bg-background-dark/80 backdrop-blur-sm rounded-full flex items-center justify-between px-6 border border-white/5 shadow-xl">
             <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Live Stats</span>
                <div className="size-1.5 bg-esports-red rounded-full animate-ping"></div>
            </div>
             <div className="text-xs text-gray-300 font-medium">
                Next Match: <span className="text-white font-bold">Team Liquid</span> vs <span className="text-white font-bold">G2 Esports</span> (16:00 CET)
            </div>
             <div className="flex items-center gap-2 grayscale opacity-50">
                <img alt="Sponsor Logo" className="h-3 object-contain" src={IMAGES.SPONSOR_LOGITECH} />
            </div>
        </div>
    </div>
  );
};

export default InGameOverlay;