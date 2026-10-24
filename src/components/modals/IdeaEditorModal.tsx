import React, { useState } from 'react';
import { X, Check, Trash2, Calendar, Clock, Plus, Flame, Lightbulb } from 'lucide-react';
import { ContentIdea, Platform, ContentFormat, IdeaStage, ChecklistItem } from '../../types';
import { PLATFORM_CONFIG, STAGE_CONFIG, FORMAT_LABELS } from '../../utils/platformInfo';
import { analyzeHookStrength, HOOK_TEMPLATES } from '../../data/hookFormulas';

interface IdeaEditorModalProps {
  idea?: ContentIdea | null;
  onSave: (ideaData: Omit<ContentIdea, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  isDarkMode: boolean;
  defaultDate?: string;
}

export const IdeaEditorModal: React.FC<IdeaEditorModalProps> = ({
  idea,
  onSave,
  onDelete,
  onClose,
  defaultDate,
}) => {
  const [title, setTitle] = useState(idea?.title || '');
  const [platform, setPlatform] = useState<Platform>(idea?.platform || 'youtube');
  const [format, setFormat] = useState<ContentFormat>(idea?.format || 'short_video');
  const [stage, setStage] = useState<IdeaStage>(idea?.stage || 'idea');
  const [hook, setHook] = useState(idea?.hook || '');
  const [scriptNotes, setScriptNotes] = useState(idea?.scriptNotes || '');
  const [scheduledDate, setScheduledDate] = useState(idea?.scheduledDate || defaultDate || '');
  const [scheduledTime, setScheduledTime] = useState(idea?.scheduledTime || '12:00');
  const [targetAudience, setTargetAudience] = useState(idea?.targetAudience || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(idea?.estimatedMinutes);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(idea?.tags || ['CreatorTips']);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    idea?.checklist || [
      { id: '1', text: 'Hook delivery recorded', done: false },
      { id: '2', text: 'Visual thumbnail designed', done: false },
      { id: '3', text: 'Captions & audio leveled', done: false },
    ]
  );
  const [newChecklistText, setNewChecklistText] = useState('');
  const [showHookTemplates, setShowHookTemplates] = useState(false);

  const hookAnalysis = analyzeHookStrength(hook);

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      { id: Date.now().toString(), text: newChecklistText.trim(), done: false }
    ]);
    setNewChecklistText('');
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: idea?.id,
      title: title.trim(),
      platform,
      format,
      stage,
      hook: hook.trim(),
      scriptNotes: scriptNotes.trim(),
      tags,
      scheduledDate: scheduledDate || undefined,
      scheduledTime: scheduledDate ? scheduledTime : undefined,
      targetAudience: targetAudience.trim() || undefined,
      estimatedMinutes: estimatedMinutes || undefined,
      checklist,
      isFavorite: idea?.isFavorite || false,
      viewsOrEngagementGoal: idea?.viewsOrEngagementGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] bg-white dark:bg-zinc-900 rounded-t-[32px] sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-900 dark:text-zinc-100"
      >
        {/* Mobile Drag Pill */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {idea ? 'Edit Content Idea' : 'Capture New Idea'}
              </h2>
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                Creator Desk Studio
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Content Title / Topic *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 5 Camera Settings That Ruin 4K Video..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Platform & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Target Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_CONFIG[p].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ContentFormat)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {(Object.keys(FORMAT_LABELS) as ContentFormat[]).map((f) => (
                  <option key={f} value={f}>
                    {FORMAT_LABELS[f]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stage Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Current Production Stage
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {(Object.keys(STAGE_CONFIG) as IdeaStage[]).map((s) => {
                const isSelected = stage === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStage(s)}
                    className={`py-2 px-1 text-xs font-medium rounded-lg text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {STAGE_CONFIG[s].label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Hook & Hook Workshop Generator */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                <Flame className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                First 3-5s Hook (The Swipe Stopper)
              </label>
              <button
                type="button"
                onClick={() => setShowHookTemplates(!showHookTemplates)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {showHookTemplates ? 'Hide Formulas' : 'Use Hook Formula'}
              </button>
            </div>

            {/* Hook Templates Dropdown Drawer */}
            {showHookTemplates && (
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-800/60 space-y-2 max-h-48 overflow-y-auto text-xs no-scrollbar">
                <p className="text-zinc-500 font-medium">Click any formula to insert into your hook:</p>
                {HOOK_TEMPLATES.slice(0, 6).map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      setHook(template.template);
                      setShowHookTemplates(false);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-indigo-600 dark:text-indigo-300">
                      {template.categoryLabel}
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-200">{template.template}</div>
                  </button>
                ))}
              </div>
            )}

            <textarea
              rows={2}
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              placeholder="e.g. Stop doing X. Here is the exact blueprint top creators use..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            {/* Hook Strength Score meter */}
            {hook.trim() && (
              <div className="pt-1 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                    Hook Score:
                  </span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                      hookAnalysis.score >= 80
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : hookAnalysis.score >= 60
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {hookAnalysis.score}/100
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400 font-mono">
                    ~{hookAnalysis.estimatedDeliverySeconds}s delivery
                  </span>
                </div>
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  {hookAnalysis.wordCount} words
                </span>
              </div>
            )}
          </div>

          {/* Script Notes & Outline */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Script / Talking Points / Outline
            </label>
            <textarea
              rows={3}
              value={scriptNotes}
              onChange={(e) => setScriptNotes(e.target.value)}
              placeholder="1. Agitate problem&#10;2. Show contrast example&#10;3. Key step-by-step framework&#10;4. Strong Call to Action"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Schedule Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Scheduled Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Posting Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Checklist items */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
              Production Checklist
            </label>
            <div className="space-y-1.5 mb-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800"
                >
                  <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleChecklistItem(item.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className={item.done ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}>
                      {item.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-zinc-400 hover:text-rose-500 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                placeholder="Add checklist task..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Type tag & press enter..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-xs font-semibold cursor-pointer"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Extra Meta: Target Audience & Estimated Minutes */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Solo creators"
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Estimated Minutes
              </label>
              <input
                type="number"
                value={estimatedMinutes || ''}
                onChange={(e) => setEstimatedMinutes(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g. 5"
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
          {idea && onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this idea?')) {
                  onDelete(idea.id);
                  onClose();
                }
              }}
              className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Delete Idea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{idea ? 'Update Idea' : 'Save Idea'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
