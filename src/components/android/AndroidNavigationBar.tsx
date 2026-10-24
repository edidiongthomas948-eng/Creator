import React from 'react';
import { LayoutDashboard, Lightbulb, Flame, CalendarDays, TrendingUp } from 'lucide-react';

export type NavTab = 'dashboard' | 'ideas' | 'hooks' | 'calendar' | 'analytics';

interface AndroidNavigationBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  upcomingCount?: number;
  ideasCount?: number;
}

export const AndroidNavigationBar: React.FC<AndroidNavigationBarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  upcomingCount = 0,
  ideasCount = 0,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb, badge: ideasCount > 0 ? ideasCount : undefined },
    { id: 'hooks', label: 'Hooks', icon: Flame },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays, badge: upcomingCount > 0 ? upcomingCount : undefined },
    { id: 'analytics', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <nav
      aria-label="App Navigation"
      className={`w-full border-t select-none transition-colors duration-200 z-30 shrink-0 ${
        isDarkMode
          ? 'bg-zinc-900/95 border-zinc-800 text-zinc-400'
          : 'bg-zinc-50/95 border-zinc-200 text-zinc-600'
      } backdrop-blur-lg`}
    >
      <div className="grid grid-cols-5 items-center px-1 pt-1.5 pb-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center py-1 group focus-visible:outline-none cursor-pointer relative"
            >
              {/* Material 3 active pill indicator */}
              <div
                className={`relative flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? isDarkMode
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-indigo-100 text-indigo-700'
                    : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'}`} />
                {tab.badge && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center font-mono">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive
                    ? isDarkMode
                      ? 'text-indigo-400 font-semibold'
                      : 'text-indigo-700 font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android Native Gesture Navigation Bar Indicator */}
      <div className="w-full flex justify-center pb-2 pt-1">
        <div
          className={`w-32 h-1 rounded-full ${
            isDarkMode ? 'bg-zinc-600/70' : 'bg-zinc-400/80'
          }`}
        />
      </div>
    </nav>
  );
};
