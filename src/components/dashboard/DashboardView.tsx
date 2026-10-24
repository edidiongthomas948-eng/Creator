import React, { useState } from 'react';
import {
  Flame,
  Calendar,
  Layers,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Play,
  Clock,
  Plus,
  ChevronRight,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { ContentIdea, CreatorStats, IdeaStage } from '../../types';
import { PLATFORM_CONFIG, STAGE_CONFIG } from '../../utils/platformInfo';
import { HOOK_TEMPLATES } from '../../data/hookFormulas';

interface DashboardViewProps {
  ideas: ContentIdea[];
  stats: CreatorStats;
  onSelectIdea: (idea: ContentIdea) => void;
  onQuickAddIdea: (title: string) => void;
  onOpenNewIdeaModal: () => void;
  onNavigateToTab: (tab: 'dashboard' | 'ideas' | 'hooks' | 'calendar' | 'analytics') => void;
  onRehearseHook: (idea: ContentIdea) => void;
  onAdvanceStage: (ideaId: string, nextStage: IdeaStage) => void;
  isDarkMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  ideas,
  stats,
  onSelectIdea,
  onQuickAddIdea,
  onOpenNewIdeaModal,
  onNavigateToTab,
  onRehearseHook,
  onAdvanceStage,
}) => {
  const [quickTitle, setQuickTitle] = useState('');

  // Daily hook prompt
  const hookPrompt = HOOK_TEMPLATES[0];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTitle.trim()) {
      onQuickAddIdea(quickTitle.trim());
      setQuickTitle('');
    }
  };

  // Next scheduled or high priority items
  const upNextIdeas = ideas
    .filter((i) => i.stage !== 'published')
    .sort((a, b) => {
      // Prioritize scheduled dates
      if (a.scheduledDate && b.scheduledDate) {
        return a.scheduledDate.localeCompare(b.scheduledDate);
      }
      if (a.scheduledDate) return -1;
      if (b.scheduledDate) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 3);

  // Today's formatted date string
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 no-scrollbar">
      {/* Header Profile / Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              {todayStr}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">·</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{stats.streakDays} Day Streak</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Creator Dashboard
          </h1>
        </div>

        <button
          onClick={onOpenNewIdeaModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Quick Idea Capture Bar */}
      <form onSubmit={handleQuickSubmit} className="relative">
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Capture an idea instantly (e.g. 3 editing secrets)..."
          className="w-full pl-4 pr-24 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-xs sm:text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-zinc-400"
        />
        <button
          type="submit"
          disabled={!quickTitle.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold disabled:opacity-40 transition-opacity cursor-pointer active:scale-95"
        >
          Capture
        </button>
      </form>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Streak */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-xs font-semibold">
            <span>Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
              {stats.streakDays}
              <span className="text-xs font-sans font-medium text-zinc-600 dark:text-zinc-400 ml-1">
                days
              </span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              Active consistency
            </div>
          </div>
        </div>

        {/* Ideas in Pipeline */}
        <div
          onClick={() => onNavigateToTab('ideas')}
          className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between cursor-pointer hover:border-indigo-400/50 transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-xs font-semibold">
            <span>In Pipeline</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
              {stats.ideasInProduction}
              <span className="text-xs font-sans font-medium text-zinc-600 dark:text-zinc-400 ml-1">
                active
              </span>
            </div>
            <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
              {stats.totalIdeas} total ideas saved
            </div>
          </div>
        </div>

        {/* Scheduled Posts */}
        <div
          onClick={() => onNavigateToTab('calendar')}
          className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between cursor-pointer hover:border-indigo-400/50 transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-xs font-semibold">
            <span>Scheduled</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
              {stats.scheduledUpcoming}
              <span className="text-xs font-sans font-medium text-zinc-600 dark:text-zinc-400 ml-1">
                queued
              </span>
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
              Ready to deploy
            </div>
          </div>
        </div>

        {/* Monthly Target */}
        <div
          onClick={() => onNavigateToTab('analytics')}
          className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between cursor-pointer hover:border-indigo-400/50 transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-xs font-semibold">
            <span>Goal Target</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
              {stats.publishedThisMonth}
              <span className="text-xs font-sans font-medium text-zinc-600 dark:text-zinc-400 ml-1">
                / {stats.monthlyGoal}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((stats.publishedThisMonth / stats.monthlyGoal) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Up Next in Production List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Up Next in Production
          </h2>
          <button
            onClick={() => onNavigateToTab('ideas')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>All Ideas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upNextIdeas.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-2">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Your production pipeline is clear. Capture a new idea or schedule a post!
            </p>
            <button
              onClick={onOpenNewIdeaModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
            >
              + Create Post
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upNextIdeas.map((idea) => {
              const platformMeta = PLATFORM_CONFIG[idea.platform];
              const stageMeta = STAGE_CONFIG[idea.stage];

              return (
                <div
                  key={idea.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:border-indigo-400/50 transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Platform & Stage Badges */}
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md border text-[11px] ${platformMeta.bgLight} ${platformMeta.bgDark}`}
                      >
                        {platformMeta.name}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                        ·
                      </span>
                      <span className={`text-[11px] font-semibold ${stageMeta.colorClass}`}>
                        {stageMeta.label}
                      </span>
                    </div>

                    {idea.scheduledDate && (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <span>{idea.scheduledDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Clickable to edit */}
                  <div
                    onClick={() => onSelectIdea(idea)}
                    className="cursor-pointer group"
                  >
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {idea.title}
                    </h3>
                    {idea.hook && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 mt-0.5 italic">
                        "{idea.hook}"
                      </p>
                    )}
                  </div>

                  {/* Quick Action Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-700/60 text-xs">
                    <button
                      onClick={() => onRehearseHook(idea)}
                      className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Rehearse Hook</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {idea.stage !== 'scheduled' && (
                        <button
                          onClick={() => {
                            const stages: IdeaStage[] = [
                              'idea',
                              'scripting',
                              'recording',
                              'editing',
                              'scheduled',
                              'published',
                            ];
                            const currIdx = stages.indexOf(idea.stage);
                            if (currIdx < stages.length - 1) {
                              onAdvanceStage(idea.id, stages[currIdx + 1]);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors cursor-pointer text-[11px]"
                        >
                          Next Stage →
                        </button>
                      )}
                      {idea.stage === 'scheduled' && (
                        <button
                          onClick={() => onAdvanceStage(idea.id, 'published')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer text-[11px] flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Publish</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Hook Inspiration of the Day */}
      <section className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Hook Formula Spotlight</span>
          </div>
          <button
            onClick={() => onNavigateToTab('hooks')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Hook Workshop →
          </button>
        </div>

        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 leading-snug">
          "{hookPrompt.example}"
        </p>

        <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 pt-1">
          <span>{hookPrompt.categoryLabel} · {hookPrompt.bestFor}</span>
          <button
            onClick={() => {
              onQuickAddIdea(hookPrompt.example);
            }}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            + Use as Idea
          </button>
        </div>
      </section>
    </div>
  );
};
