import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ContentIdea, Platform, IdeaStage } from '../../types';
import { PLATFORM_CONFIG, STAGE_CONFIG } from '../../utils/platformInfo';

interface CalendarViewProps {
  ideas: ContentIdea[];
  onSelectIdea: (idea: ContentIdea) => void;
  onNewIdeaOnDate: (dateStr: string) => void;
  onRehearseHook: (idea: ContentIdea) => void;
  onAdvanceStage: (ideaId: string, nextStage: IdeaStage) => void;
  isDarkMode: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  ideas,
  onSelectIdea,
  onNewIdeaOnDate,
  onRehearseHook,
  onAdvanceStage,
}) => {
  // Current viewed month and year
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().slice(0, 10));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Filter ideas by platform if selected
  const activeIdeas = useMemo(() => {
    if (selectedPlatform === 'all') return ideas;
    return ideas.filter((i) => i.platform === selectedPlatform);
  }, [ideas, selectedPlatform]);

  // Map of date string (YYYY-MM-DD) to ideas
  const scheduledMap = useMemo(() => {
    const map = new Map<string, ContentIdea[]>();
    activeIdeas.forEach((idea) => {
      if (idea.scheduledDate) {
        const list = map.get(idea.scheduledDate) || [];
        list.push(idea);
        map.set(idea.scheduledDate, list);
      }
    });
    return map;
  }, [activeIdeas]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const dateStr = prevDate.toISOString().slice(0, 10);
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
      });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dateStr = nextDate.toISOString().slice(0, 10);
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  }, [year, month]);

  // Ideas scheduled for the selected day
  const selectedDayIdeas = scheduledMap.get(selectedDateStr) || [];

  // All upcoming scheduled items sorted
  const upcomingScheduled = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return activeIdeas
      .filter((i) => i.scheduledDate && i.scheduledDate >= today && i.stage !== 'published')
      .sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''))
      .slice(0, 5);
  }, [activeIdeas]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 no-scrollbar bg-white dark:bg-zinc-900">
      {/* Header & Month Navigator */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Content Planner
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {monthName} {year}
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={goToToday}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Platform Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            selectedPlatform === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
          }`}
        >
          All Platforms
        </button>
        {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((p) => {
          const meta = PLATFORM_CONFIG[p];
          const isSelected = selectedPlatform === p;
          return (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {meta.shortName}
            </button>
          );
        })}
      </div>

      {/* Calendar Grid Container */}
      <div className="p-3.5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-2">
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 text-center text-[11px] font-bold text-zinc-600 dark:text-zinc-400 py-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((cell, idx) => {
            const isSelected = cell.dateStr === selectedDateStr;
            const scheduledPosts = scheduledMap.get(cell.dateStr) || [];
            const hasPosts = scheduledPosts.length > 0;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`min-h-[52px] sm:min-h-[64px] p-1 rounded-xl flex flex-col items-center justify-between transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : cell.isCurrentMonth
                    ? 'hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 text-zinc-800 dark:text-zinc-200'
                    : 'text-zinc-400/60 dark:text-zinc-600'
                } ${cell.isToday && !isSelected ? 'ring-1.5 ring-indigo-500 font-bold' : ''}`}
              >
                <span
                  className={`text-xs font-mono tabular-nums ${
                    cell.isToday && !isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {/* Scheduled indicator dots */}
                <div className="flex items-center gap-0.5 justify-center mt-1 flex-wrap max-w-full">
                  {hasPosts &&
                    scheduledPosts.slice(0, 3).map((p, i) => {
                      const color = PLATFORM_CONFIG[p.platform].color;
                      return (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: isSelected ? '#ffffff' : color,
                          }}
                        />
                      );
                    })}
                  {scheduledPosts.length > 3 && (
                    <span className="text-[9px] font-mono leading-none opacity-80">+</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Drawer */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Agenda for {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {selectedDayIdeas.length} {selectedDayIdeas.length === 1 ? 'post' : 'posts'} scheduled
            </p>
          </div>

          <button
            onClick={() => onNewIdeaOnDate(selectedDateStr)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>

        {selectedDayIdeas.length === 0 ? (
          <div className="p-5 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-1">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              No content scheduled for this date.
            </p>
            <button
              onClick={() => onNewIdeaOnDate(selectedDateStr)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              + Add a post for {selectedDateStr}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayIdeas.map((idea) => {
              const pMeta = PLATFORM_CONFIG[idea.platform];
              const stMeta = STAGE_CONFIG[idea.stage];

              return (
                <div
                  key={idea.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pMeta.bgLight} ${pMeta.bgDark}`}
                      >
                        {pMeta.name}
                      </span>
                      <span className={`text-[11px] font-semibold ${stMeta.colorClass}`}>
                        {stMeta.label}
                      </span>
                    </div>

                    {idea.scheduledTime && (
                      <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <span>{idea.scheduledTime}</span>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => onSelectIdea(idea)}
                    className="cursor-pointer group"
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {idea.title}
                    </h4>
                    {idea.hook && (
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic line-clamp-1 mt-0.5">
                        "{idea.hook}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-700/60 text-xs">
                    {idea.hook ? (
                      <button
                        onClick={() => onRehearseHook(idea)}
                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Rehearse Hook</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-1.5">
                      {idea.stage !== 'published' ? (
                        <button
                          onClick={() => onAdvanceStage(idea.id, 'published')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer text-[11px] flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Publish Now</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming Week Queue */}
      {upcomingScheduled.length > 0 && (
        <section className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Upcoming Scheduled Queue (Next 7 Days)
          </h2>
          <div className="space-y-2">
            {upcomingScheduled.map((item) => {
              const pMeta = PLATFORM_CONFIG[item.platform];
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectIdea(item)}
                  className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${pMeta.bgLight} ${pMeta.bgDark}`}
                    >
                      {pMeta.shortName}
                    </span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                      {item.title}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 shrink-0">
                    {item.scheduledDate} {item.scheduledTime ? `· ${item.scheduledTime}` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
