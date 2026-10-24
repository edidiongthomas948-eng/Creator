import React, { useState } from 'react';
import {
  Flame,
  Copy,
  Check,
  Play,
  Sparkles,
  Wand2,
  BookmarkPlus,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { HOOK_TEMPLATES, HOOK_POWER_WORDS, analyzeHookStrength } from '../../data/hookFormulas';
import { HookTemplate } from '../../types';

interface HookWorkshopViewProps {
  onSaveHookAsIdea: (hookText: string) => void;
  onLaunchTeleprompter: (hookText: string) => void;
  isDarkMode: boolean;
}

export const HookWorkshopView: React.FC<HookWorkshopViewProps> = ({
  onSaveHookAsIdea,
  onLaunchTeleprompter,
}) => {
  const [activeHookText, setActiveHookText] = useState(
    'Stop doing 60-second intro hooks. Here is what top YouTube creators actually do instead in 2026.'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom formula builder states
  const [builderCategory, setBuilderCategory] = useState<string>('contrarian');
  const [topicBlank, setTopicBlank] = useState('video editing');
  const [commonHabit, setCommonHabit] = useState('adding random zooms every 2 seconds');
  const [resultBlank, setResultBlank] = useState('higher audience retention past 30 seconds');

  const analysis = analyzeHookStrength(activeHookText);

  const categories = [
    { id: 'all', label: 'All Hooks' },
    { id: 'contrarian', label: 'Contrarian' },
    { id: 'curiosity', label: 'Curiosity Gap' },
    { id: 'story', label: 'Story & Vlog' },
    { id: 'problem_solution', label: 'Problem & Agitator' },
    { id: 'secret', label: 'Secret & Insider' },
    { id: 'stats', label: 'Data & Stats' },
    { id: 'challenge', label: 'Challenge' },
  ];

  const filteredTemplates = HOOK_TEMPLATES.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateFromBuilder = () => {
    let generated = '';
    if (builderCategory === 'contrarian') {
      generated = `Stop ${commonHabit || 'doing this'}. Here is what top creators in ${topicBlank || 'the space'} actually do for ${resultBlank || 'better results'}.`;
    } else if (builderCategory === 'curiosity') {
      generated = `This 1 small change to my ${topicBlank || 'workflow'} gave me ${resultBlank || 'incredible results'}. Here is the exact breakdown.`;
    } else {
      generated = `If you struggle with ${topicBlank || 'getting views'}, you are making this 1 critical mistake right now.`;
    }
    setActiveHookText(generated);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 no-scrollbar bg-white dark:bg-zinc-900">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <Flame className="w-4 h-4 fill-current" />
          <span>High-Retention Studio</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
          Video Hook Workshop
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Craft, score, and rehearse the critical first 3-5 seconds that prevent swipe aways.
        </p>
      </div>

      {/* Main Hook Tester & Strength Analyzer Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Live Hook Drafter
          </label>
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            {analysis.wordCount} words · ~{analysis.estimatedDeliverySeconds}s delivery
          </span>
        </div>

        {/* Textarea */}
        <textarea
          rows={3}
          value={activeHookText}
          onChange={(e) => setActiveHookText(e.target.value)}
          placeholder="Type or paste your video hook to inspect retention score..."
          className="w-full p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
        />

        {/* Live Score & Metrics */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Retention Score */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
            <div className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
              Retention Score
            </div>
            <div
              className={`text-2xl font-extrabold font-mono mt-0.5 ${
                analysis.score >= 80
                  ? 'text-emerald-500'
                  : analysis.score >= 60
                  ? 'text-amber-500'
                  : 'text-rose-500'
              }`}
            >
              {analysis.score}
              <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400">/100</span>
            </div>
          </div>

          {/* Delivery Pace */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
            <div className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
              First Words
            </div>
            <div className="text-2xl font-extrabold font-mono text-indigo-500 mt-0.5">
              ~{analysis.estimatedDeliverySeconds}s
            </div>
          </div>

          {/* Power Triggers */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
            <div className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
              Triggers
            </div>
            <div className="text-2xl font-extrabold font-mono text-purple-500 mt-0.5">
              {analysis.matchedPowerWords.length}
            </div>
          </div>
        </div>

        {/* Feedback Tips */}
        <div className="space-y-1.5 pt-1">
          {analysis.feedback.map((item, idx) => (
            <div
              key={idx}
              className={`text-xs p-2 rounded-lg flex items-start gap-2 ${
                item.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40'
                  : item.type === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              <span className="shrink-0">•</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeHookText, 'main')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 text-xs font-semibold border border-zinc-200 dark:border-zinc-600 transition-colors cursor-pointer"
            >
              {copiedId === 'main' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Hook</span>
                </>
              )}
            </button>

            <button
              onClick={() => onSaveHookAsIdea(activeHookText)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save as Idea</span>
            </button>
          </div>

          <button
            onClick={() => onLaunchTeleprompter(activeHookText)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Rehearse in Teleprompter</span>
          </button>
        </div>
      </div>

      {/* Interactive Hook Builder Framework */}
      <section className="p-4 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-300">
              Hook Formula Builder
            </h2>
          </div>
          <button
            onClick={handleGenerateFromBuilder}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Generate Hook</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Niche / Topic
            </label>
            <input
              type="text"
              value={topicBlank}
              onChange={(e) => setTopicBlank(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Common Mistake / Habit
            </label>
            <input
              type="text"
              value={commonHabit}
              onChange={(e) => setCommonHabit(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Desired Transformation
            </label>
            <input
              type="text"
              value={resultBlank}
              onChange={(e) => setResultBlank(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Categorized Viral Hook Library */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Battle-Tested Hook Library
          </h2>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {filteredTemplates.length} formulas
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === c.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* List of Hook Templates */}
        <div className="space-y-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-indigo-400/50 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {template.categoryLabel}
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {template.bestFor}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                  {template.retentionRating}% retention
                </span>
              </div>

              {/* Template Text */}
              <div
                onClick={() => setActiveHookText(template.template)}
                className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 font-medium text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer hover:border-indigo-300 transition-colors"
                title="Click to test in analyzer"
              >
                {template.template}
              </div>

              {/* Real Example */}
              <div className="text-[11px] text-zinc-500 italic pl-1">
                <span className="font-semibold text-zinc-600 dark:text-zinc-400 not-italic">Example: </span>
                "{template.example}"
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-700/50">
                <button
                  onClick={() => handleCopy(template.template, template.id)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === template.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveHookText(template.example);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 cursor-pointer"
                >
                  Test in Drafter →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
