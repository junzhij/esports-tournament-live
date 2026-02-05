import React, { useState } from 'react';
import BanPickView from './components/BanPickView';
import InGameOverlay from './components/InGameOverlay';
import PostMatchView from './components/PostMatchView';

enum View {
  BAN_PICK = 'BAN_PICK',
  IN_GAME = 'IN_GAME',
  POST_MATCH = 'POST_MATCH'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.BAN_PICK);
  const [showNav, setShowNav] = useState(true);

  // Toggle navigation visibility
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h') {
        setShowNav(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-screen relative">
      {/* View Container */}
      <div className="w-full h-full">
        {currentView === View.BAN_PICK && <BanPickView />}
        {currentView === View.IN_GAME && <InGameOverlay />}
        {currentView === View.POST_MATCH && <PostMatchView />}
      </div>

      {/* Floatin Navigation Controls */}
      {showNav && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex gap-4 shadow-2xl transition-opacity hover:opacity-100 opacity-90">
          <button 
            onClick={() => setCurrentView(View.BAN_PICK)}
            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${currentView === View.BAN_PICK ? 'bg-esports-red text-white shadow-lg shadow-red-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Ban/Pick
          </button>
          <button 
            onClick={() => setCurrentView(View.IN_GAME)}
            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${currentView === View.IN_GAME ? 'bg-primary text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            In-Game
          </button>
          <button 
            onClick={() => setCurrentView(View.POST_MATCH)}
            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${currentView === View.POST_MATCH ? 'bg-esports-gold text-black shadow-lg shadow-yellow-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Post-Match
          </button>
          <div className="w-px bg-white/10 mx-2"></div>
          <button onClick={() => setShowNav(false)} className="text-xs text-gray-500 hover:text-white uppercase font-bold tracking-widest flex items-center">
            Hide (Press 'h')
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
