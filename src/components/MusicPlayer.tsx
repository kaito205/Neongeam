import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  { id: '1', title: 'Nightcall 1984', artist: 'Neon Voyager', duration: '3:45', url: '#' },
  { id: '2', title: 'Synth City', artist: 'Digital Drift', duration: '4:12', url: '#' },
  { id: '3', title: 'Cyber Sunset', artist: 'Retro Wave', duration: '2:58', url: '#' },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<number | null>(null);

  const track = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.5));
      }, 200);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="bg-vapor-dark border-2 border-neon-pink p-4 w-72 shadow-[0_0_15px_#ff00ff] rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-neon-purple rounded flex items-center justify-center animate-pulse shadow-[0_0_10px_#9d00ff]">
          <Music className="text-white" size={24} />
        </div>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={track.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="text-xs font-bold text-neon-cyan truncate"
            >
              {track.title}
            </motion.div>
          </AnimatePresence>
          <div className="text-[10px] text-neon-purple uppercase tracking-tight">{track.artist}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 bg-fuchsia-900 mb-4 rounded-full overflow-hidden">
        <motion.div
           className="absolute top-0 left-0 h-full bg-neon-pink"
           animate={{ width: `${progress}%` }}
           transition={{ duration: 0.2 }}
        />
      </div>

      <div className="flex justify-between items-center px-4">
        <button onClick={prevTrack} className="text-neon-cyan hover:scale-110 transition-transform">
          <SkipBack size={20} />
        </button>
        <button
          onClick={togglePlay}
          className="w-10 h-10 bg-neon-pink rounded-full flex items-center justify-center text-white shadow-[0_0_15px_#ff00ff] hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-neon-cyan hover:scale-110 transition-transform">
          <SkipForward size={20} />
        </button>
      </div>

      <div className="mt-4 flex justify-between text-[10px] font-mono text-neon-purple">
        <span>02:45 / {track.duration}</span>
        <span>STEREO</span>
      </div>
    </div>
  );
};
