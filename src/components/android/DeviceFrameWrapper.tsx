import React from 'react';
import { Smartphone, Monitor, Sun, Moon, Download, RotateCcw } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  showDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onExportData: () => void;
  onResetData: () => void;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  isDarkMode,
  onToggleTheme,
  showDeviceFrame,
  onToggleDeviceFrame,
  onExportData,
  onResetData,
}) => {
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-start transition-colors duration-200 ${
        isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'
      }`}
    >
      {/* Top Utility & Control Bar */}
      <header className="w-full flex items-center justify-between px-4 sm:px-8 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md z-40 sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-500/20">
            C
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Creator Desk
          </span>
          <span className="hidden sm:inline-flex items-center text-xs text-zinc-600 dark:text-zinc-400">
            <span>Android Edition</span>
            <span className="mx-1.5 opacity-40">·</span>
            <span>Material 3</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Export JSON */}
          <button
            onClick={onExportData}
            title="Export content library (JSON)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all creator data to initial demo state?')) {
                onResetData();
              }
            }}
            title="Reset to demo ideas"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

          {/* Toggle Phone Frame / Full View */}
          <button
            onClick={onToggleDeviceFrame}
            title={showDeviceFrame ? 'Switch to Full Screen View' : 'Switch to Android Phone Frame'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            {showDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Wide View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="w-full flex-1 flex items-center justify-center py-2 sm:py-6 px-1 sm:px-4">
        {showDeviceFrame ? (
          // Android Phone Chassis Frame
          <div className="relative mx-auto my-auto transition-all duration-300 ease-out">
            {/* Outer chassis rim & shadow */}
            <div className="relative w-[390px] sm:w-[420px] h-[844px] max-h-[calc(100vh-80px)] bg-zinc-900 rounded-[50px] p-3 shadow-2xl ring-1 ring-zinc-800/80 shadow-indigo-950/20 flex flex-col">
              {/* Hardware buttons on right edge */}
              <div className="absolute -right-1 top-28 w-1 h-12 bg-zinc-700 rounded-r-md"></div>
              <div className="absolute -right-1 top-44 w-1 h-20 bg-zinc-700 rounded-r-md"></div>
              {/* Speaker earpiece slit on top */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-zinc-800 rounded-full z-40"></div>

              {/* Inner Screen Bezel */}
              <div className="w-full h-full rounded-[40px] overflow-hidden bg-white dark:bg-zinc-900 flex flex-col relative border border-zinc-700/50">
                {children}
              </div>
            </div>
          </div>
        ) : (
          // Full Screen / Tablet / Desktop Layout
          <div className="w-full max-w-5xl h-[calc(100vh-80px)] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
