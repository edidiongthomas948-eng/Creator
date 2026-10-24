import React, { useState } from 'react';
import {
  TrendingUp,
  Flame,
  Target,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Sparkles,
  BarChart3,
  Edit2,
  Check,
} from 'lucide-react';
import { ContentIdea, CreatorStats, Platform } from '../../types';
import { PLATFORM_CONFIG, STAGE_CONFIG } from '../../utils/platformInfo';

interface AnalyticsViewProps {
  ideas: ContentIdea[];
  stats: CreatorStats;
  onUpdateMonthlyGoal: (newGoal: number) => void;
  isDarkMode: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  ideas,
  stats,
  onUpdateMonthlyGoal,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(stats.monthlyGoal));

  // Platform distribution calculation
  const platformCounts: Record<Platform, number> = {
    youtube: 0,
    tiktok: 0,
    instagram: 0,
    twitter: 0,
    linkedin: 0,
    podcast: 0,
    newsletter: 0,
  };

  ideas.forEach((i) => {
    if (platformCounts[i.platform] !== undefined) {
      platformCounts[i.platform]++;
    }
  });

  const totalContent = ideas.length || 1;

  // Stages count
  const stageCounts = {
    idea: ideas.filter((i) => i.stage === 'idea').length,
    scripting: ideas.filter((i) => i.stage === 'scripting').length,
    recording: ideas.filter((i) => i.stage === 'recording').length,
    editing: ideas.filter((i) => i.stage === 'editing').length,
    scheduled: ideas.filter((i) => i.stage === 'scheduled').length,
    published: ideas.filter((i) => i.stage === 'published').length,
  };

  // 28-day activity grid
  const activityDays = Array.from({ length: 28 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - index));
    const dateStr = d.toISOString().slice(0, 10);

    const count = ideas.filter(
      (i) => i.scheduledDate === dateStr || i.updatedAt.slice(0, 10) === dateStr
    ).length;

    return {
      dateStr,
      dayNum: d.getDate(),
      count,
      intensity: count > 2 ? 3 : count > 0 ? (count === 2 ? 2 : 1) : 0,
    };
  });

  const handleSaveGoal = () => {
    const val = parseInt(goalInput);
    if (!isNaN(val) && val > 0) {
      onUpdateMonthlyGoal(val);
      setIsEditingGoal(false);
    }
  };

  const completionPercent = Math.min(
    100,
    Math.round((stats.publishedThisMonth / (stats.monthlyGoal || 1)) * 100)
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 no-scrollbar bg-white dark:bg-zinc-900">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="w-4 h-4" />
          <span>Publishing & Velocity Metrics</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
          Progress & Analytics
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Monitor your creative consistency, output goals, and distribution balance.
        </p>
      </div>

      {/* Goal Progress Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-zinc-900 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider">
                Monthly Creator Target
              </span>
              <h3 className="text-sm sm:text-base font-bold">
                {stats.publishedThisMonth} of {stats.monthlyGoal} Content Pieces
              </h3>
            </div>
          </div>

          {!isEditingGoal ? (
            <button
              onClick={() => setIsEditingGoal(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Goal</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl">
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-14 px-2 py-1 text-xs rounded bg-white text-zinc-900 font-bold focus:outline-none"
              />
              <button
                onClick={handleSaveGoal}
                className="p-1.5 rounded bg-emerald-500 text-white cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-white/15 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-indigo-200">
            <span>{completionPercent}% of monthly target reached</span>
            <span>{Math.max(0, stats.monthlyGoal - stats.publishedThisMonth)} remaining</span>
          </div>
        </div>
      </div>

      {/* 28-Day Consistency Activity Heatmap */}
      <section className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Creative Consistency (Last 28 Days)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            {stats.streakDays} Day Active Streak 🔥
          </span>
        </div>

        {/* 4 rows x 7 days */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {activityDays.map((d, i) => (
            <div
              key={i}
              title={`${d.dateStr}: ${d.count} creative updates`}
              className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-mono transition-transform hover:scale-105 cursor-default ${
                d.intensity === 3
                  ? 'bg-emerald-600 text-white font-bold'
                  : d.intensity === 2
                  ? 'bg-emerald-400 dark:bg-emerald-500 text-white font-semibold'
                  : d.intensity === 1
                  ? 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : 'bg-zinc-200 dark:bg-zinc-700/60 text-zinc-400'
              }`}
            >
              {d.dayNum}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 pt-1">
          <span>Less active</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-200 dark:bg-emerald-900/60" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-400 dark:bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-600" />
          </div>
          <span>High output</span>
        </div>
      </section>

      {/* Production Pipeline Funnel */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Production Pipeline Funnel
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(Object.keys(STAGE_CONFIG) as (keyof typeof stageCounts)[]).map((stage) => {
            const count = stageCounts[stage];
            const meta = STAGE_CONFIG[stage];

            return (
              <div
                key={stage}
                className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    {meta.label}
                  </span>
                  <span className={`text-base font-extrabold font-mono ${meta.colorClass}`}>
                    {count}
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{
                      width: `${Math.round((count / (totalContent || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Distribution */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Platform Distribution
        </h2>
        <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          {(Object.keys(platformCounts) as Platform[]).map((p) => {
            const count = platformCounts[p];
            const pct = Math.round((count / totalContent) * 100);
            const meta = PLATFORM_CONFIG[p];

            return (
              <div key={p} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {meta.name}
                    </span>
                  </div>
                  <span className="text-zinc-600 dark:text-zinc-400 font-mono">
                    {count} ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
