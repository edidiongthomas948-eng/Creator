import React, { useState } from 'react';
import { Plus, Lightbulb, Flame, Calendar, X } from 'lucide-react';

interface MaterialFABProps {
  onNewIdea: () => void;
  onOpenHookStudio: () => void;
  onOpenSchedule: () => void;
  isDarkMode: boolean;
}

export const MaterialFAB: React.FC<MaterialFABProps> = ({
  onNewIdea,
  onOpenHookStudio,
  onOpenSchedule,
  isDarkMode: _isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-20 right-4 z-40 flex flex-col items-end gap-2 pointer-events-none">
      {/* Expanded Speed-Dial Actions */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-2 duration-150">
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenSchedule();
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
          >
            <span>Schedule Post</span>
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenHookStudio();
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
          >
            <span>Write Hook</span>
            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onNewIdea();
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
          >
            <span>New Idea</span>
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Material 3 FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Add new content'}
        className={`pointer-events-auto w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center cursor-pointer active:scale-90 transition-all duration-200 ${
          isOpen ? 'rotate-90 bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : ''
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6 stroke-[2.5]" />}
      </button>
    </div>
  );
};
