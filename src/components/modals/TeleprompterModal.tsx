import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Type } from 'lucide-react';

interface TeleprompterModalProps {
  title: string;
  hookText: string;
  fullScript?: string;
  onClose: () => void;
  isDarkMode: boolean;
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  title,
  hookText,
  fullScript,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(150); // words per minute
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mode, setMode] = useState<'hook_only' | 'full_script'>('hook_only');
  const [countdown, setCountdown] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeText = mode === 'hook_only' ? hookText : `${hookText}\n\n${fullScript || ''}`;

  // Start with countdown
  const handleStart = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setIsPlaying(true);
    }
  }, [countdown]);

  // Elapsed timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Auto-scroll logic
  useEffect(() => {
    let animId: number;
    const scrollStep = () => {
      if (isPlaying && scrollRef.current) {
        // Adjust scroll speed roughly proportional to wpm
        const pixelsPerFrame = (speed / 150) * 0.75;
        scrollRef.current.scrollTop += pixelsPerFrame;
      }
      animId = requestAnimationFrame(scrollStep);
    };
    if (isPlaying) {
      animId = requestAnimationFrame(scrollStep);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speed]);

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[90vh] bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase">
              Hook Rehearsal Studio
            </span>
            <h3 className="text-sm sm:text-base font-bold truncate max-w-md">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content switcher & settings */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-zinc-900 border-b border-zinc-800/80 text-xs">
          <div className="flex items-center gap-1 bg-zinc-800 p-0.5 rounded-lg">
            <button
              onClick={() => setMode('hook_only')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                mode === 'hook_only' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Hook Only (3-5s)
            </button>
            {fullScript && (
              <button
                onClick={() => setMode('full_script')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  mode === 'full_script' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Full Script
              </button>
            )}
          </div>

          {/* Font size toggle */}
          <div className="flex items-center gap-2 text-zinc-400">
            <Type className="w-3.5 h-3.5" />
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-zinc-700 text-white' : ''}`}
            >
              M
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-zinc-700 text-white' : ''}`}
            >
              L
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded ${fontSize === 'xlarge' ? 'bg-zinc-700 text-white' : ''}`}
            >
              XL
            </button>
          </div>
        </div>

        {/* Teleprompter Display Screen */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-8 py-16 text-center select-none no-scrollbar relative flex flex-col items-center"
        >
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
              <span className="text-7xl font-extrabold text-indigo-400 animate-ping">
                {countdown}
              </span>
            </div>
          )}

          {/* Eye-level indicator line */}
          <div className="sticky top-20 w-full flex items-center justify-between pointer-events-none opacity-40 px-4">
            <div className="w-8 h-px bg-indigo-500" />
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
              Eye Line Target
            </span>
            <div className="w-8 h-px bg-indigo-500" />
          </div>

          <div
            className={`max-w-xl mx-auto my-auto leading-relaxed font-semibold transition-all ${
              fontSize === 'normal'
                ? 'text-xl sm:text-2xl'
                : fontSize === 'large'
                ? 'text-2xl sm:text-3xl'
                : 'text-3xl sm:text-4xl'
            } text-zinc-100 drop-shadow`}
          >
            {activeText || (
              <span className="text-zinc-500 italic text-lg">
                No hook text written yet. Add a hook in the Idea Editor or Hook Workshop to rehearse it.
              </span>
            )}
          </div>
        </div>

        {/* Bottom Playback Controls */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-4 shrink-0">
          {/* Elapsed Timer */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-zinc-800 text-indigo-400 font-mono text-sm font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>00:{String(elapsedSeconds).padStart(2, '0')}</span>
            </div>
            {mode === 'hook_only' && (
              <span className="text-[11px] text-zinc-400 hidden sm:inline">
                Target: 3s – 6s
              </span>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Reset position and timer"
              className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {isPlaying ? (
              <button
                onClick={() => setIsPlaying(false)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Practice</span>
              </button>
            )}
          </div>

          {/* Scroll Speed Slider */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-zinc-400">Pace</span>
            <input
              type="range"
              min="90"
              max="240"
              step="10"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-24 accent-indigo-500"
            />
            <span className="text-xs font-mono text-zinc-300">{speed} wpm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
