import React, { useState } from 'react';
import { SpaceInvaders } from './components/SpaceInvaders';
import { MusicPlayer } from './components/MusicPlayer';
import { CRTOverlay, VaporwaveSkyline } from './components/Effects';
import { Trophy, RefreshCw, Github } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('highScore') || '0'));

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('highScore', newScore.toString());
    }
  };

  const handleGameOver = (finalScore: number) => {
    console.log('Game Over! Final Score:', finalScore);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <VaporwaveSkyline />
      <CRTOverlay />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
        {/* Main Column */}
        <div className="flex flex-col items-center gap-6">
          <header className="text-center mb-4">
               <motion.h1 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl md:text-8xl font-bold italic tracking-tighter text-glow text-white italic transform -skew-x-12"
               >
                NEON <span className="text-neon-pink">AEGIS</span>
               </motion.h1>
               <div className="text-neon-cyan font-mono text-sm tracking-[0.5em] mt-2 uppercase">
                 Tactical Inversion Protocol
               </div>
          </header>

          {/* Game Window */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="group relative"
          >
            {/* Window Frame Decor */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            
            <div className="relative bg-black rounded-lg overflow-hidden border border-white/20">
                {/* Window Bar */}
                <div className="bg-zinc-900 border-bottom border-white/10 px-4 py-1 flex justify-between items-center bg-gradient-to-r from-zinc-800 to-zinc-900">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">invaders.exe</div>
                    <div className="w-10" />
                </div>
                
                <SpaceInvaders onScoreUpdate={handleScoreUpdate} onGameOver={handleGameOver} />
            </div>
          </motion.div>

          <footer className="mt-4 text-white/50 font-mono text-[10px] uppercase flex gap-8">
            <span className="flex items-center gap-1"><RefreshCw size={10}/> R TO RESTART</span>
            <span className="flex items-center gap-1">ARROW KEYS TO MOVE</span>
            <span className="flex items-center gap-1">SPACE TO FIRE</span>
          </footer>
        </div>

        {/* Sidebar / Controls */}
        <aside className="flex flex-col gap-6 self-center lg:self-start pt-32">
           {/* Stats Card */}
           <motion.div 
             initial={{ x: 50, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="bg-black/60 backdrop-blur-md border-2 border-neon-cyan p-6 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.2)]"
           >
              <div className="flex items-center gap-3 text-neon-cyan mb-2">
                <Trophy size={20} />
                <h3 className="font-bold uppercase tracking-wider">Hall of Fame</h3>
              </div>
              <div className="space-y-4">
                <div>
                    <div className="text-[10px] text-white/50 uppercase mb-1">Total Points</div>
                    <div className="text-3xl font-mono text-white">{score.toString().padStart(6, '0')}</div>
                </div>
                <div>
                    <div className="text-[10px] text-white/50 uppercase mb-1">System Best</div>
                    <div className="text-2xl font-mono text-neon-pink">{highScore.toString().padStart(6, '0')}</div>
                </div>
              </div>
           </motion.div>

           <motion.div
             initial={{ x: 50, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
           >
            <MusicPlayer />
           </motion.div>

           {/* Flavor Decor */}
           <div className="mt-Auto flex justify-center opacity-20 hover:opacity-50 transition-opacity">
              <Github size={24} className="text-white" />
           </div>
        </aside>
      </div>
    </div>
  );
}
