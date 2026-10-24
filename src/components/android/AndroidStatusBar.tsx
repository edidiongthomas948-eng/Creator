import React, { useState, useEffect } from 'react';
import { Wifi, Signal, BatteryCharging } from 'lucide-react';

interface AndroidStatusBarProps {
  isDarkMode: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ isDarkMode }) => {
  const [time, setTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full flex items-center justify-between px-6 pt-3 pb-2 text-xs font-medium select-none z-30 transition-colors ${
        isDarkMode ? 'text-zinc-200 bg-zinc-900/90' : 'text-zinc-800 bg-zinc-50/90'
      } backdrop-blur-md`}
    >
      {/* Left: Clock */}
      <div className="flex items-center gap-1.5 font-mono tracking-tight font-semibold text-[13px]">
        <span>{time}</span>
      </div>

      {/* Center: Punch-hole camera notch */}
      <div className="w-4 h-4 rounded-full bg-black ring-1 ring-zinc-700/50 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-900/80"></div>
      </div>

      {/* Right: Network, Wi-Fi, Battery */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold tracking-wider font-mono opacity-80">5G</span>
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <BatteryCharging className="w-4 h-4 text-emerald-500" />
          <span className="text-[11px] font-mono tabular-nums">98%</span>
        </div>
      </div>
    </div>
  );
};
