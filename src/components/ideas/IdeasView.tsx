import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  ListFilter,
  Kanban,
  Star,
  Copy,
  Plus,
  Play,
  Calendar,
  CheckCircle2,
  Trash2,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ContentIdea, Platform, IdeaStage } from '../../types';
import { PLATFORM_CONFIG, STAGE_CONFIG, FORMAT_LABELS } from '../../utils/platformInfo';

interface IdeasViewProps {
  ideas: ContentIdea[];
  onSelectIdea: (idea: ContentIdea) => void;
  onNewIdea: () => void;
  onToggleFavorite: (id: string) => void;
  onDuplicateIdea: (idea: ContentIdea) => void;
  onDeleteIdea: (id: string) => void;
  onAdvanceStage: (id: string, nextStage: IdeaStage) => void;
  onRehearseHook: (idea: ContentIdea) => void;
  isDarkMode: boolean;
}

export const IdeasView: React.FC<IdeasViewProps> = ({
  ideas,
  onSelectIdea,
  onNewIdea,
  onToggleFavorite,
  onDuplicateIdea,
  onDeleteIdea,
  onAdvanceStage,
  onRehearseHook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedStage, setSelectedStage] = useState<IdeaStage | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'kanban' | 'list'>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    ideas.forEach((i) => i.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [ideas]);

  // Filter ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = idea.title.toLowerCase().includes(query);
        const matchesHook = idea.hook.toLowerCase().includes(query);
        const matchesScript = idea.scriptNotes.toLowerCase().includes(query);
        const matchesTags = idea.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesHook && !matchesScript && !matchesTags) {
          return false;
        }
      }

      // Platform
      if (selectedPlatform !== 'all' && idea.platform !== selectedPlatform) {
        return false;
      }

      // Stage
      if (selectedStage !== 'all' && idea.stage !== selectedStage) {
        return false;
      }

      // Favorite
      if (onlyFavorites && !idea.isFavorite) {
        return false;
      }

      // Tag
      if (selectedTag && !idea.tags.includes(selectedTag)) {
        return false;
      }

      return true;
    });
  }, [ideas, searchQuery, selectedPlatform, selectedStage, onlyFavorites, selectedTag]);

  const stagesList: IdeaStage[] = [
    'idea',
    'scripting',
    'recording',
    'editing',
    'scheduled',
    'published',
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-900">
      {/* Top Search & Filter Bar */}
      <div className="px-4 pt-4 pb-2 border-b border-zinc-100 dark:border-zinc-800 space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ideas, hooks, tags..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400 border border-transparent focus:border-indigo-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
              >
                ×
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              title="Card View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              title="Pipeline Kanban"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Platform Scroll Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              selectedPlatform === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            All ({ideas.length})
          </button>
          {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((p) => {
            const count = ideas.filter((i) => i.platform === p).length;
            if (count === 0 && selectedPlatform !== p) return null;
            const meta = PLATFORM_CONFIG[p];
            const isSelected = selectedPlatform === p;
            return (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                <span>{meta.shortName}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 mx-1 shrink-0" />

          {/* Favorites Filter button */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
              onlyFavorites
                ? 'bg-amber-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            <Star className={`w-3 h-3 ${onlyFavorites ? 'fill-white' : ''}`} />
            <span>Starred</span>
          </button>
        </div>

        {/* Stage Pills Filter */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer ${
              selectedStage === 'all'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Any Stage
          </button>
          {stagesList.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
                selectedStage === st
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {STAGE_CONFIG[st].label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {filteredIdeas.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                No matching content ideas
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Try adjusting your search query, clearing filters, or capture a new idea.
              </p>
            </div>
            <button
              onClick={onNewIdea}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              + Create Idea
            </button>
          </div>
        ) : viewMode === 'kanban' ? (
          /* Kanban Board View */
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar h-full items-start">
            {stagesList.map((stage) => {
              const stageIdeas = filteredIdeas.filter((i) => i.stage === stage);
              const meta = STAGE_CONFIG[stage];

              return (
                <div
                  key={stage}
                  className="w-64 shrink-0 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-3 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col max-h-[calc(100vh-250px)]"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-700/60">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {meta.label}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold">
                      {stageIdeas.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pr-0.5">
                    {stageIdeas.map((idea) => {
                      const pMeta = PLATFORM_CONFIG[idea.platform];
                      return (
                        <div
                          key={idea.id}
                          onClick={() => onSelectIdea(idea)}
                          className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs hover:border-indigo-500 cursor-pointer transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pMeta.bgLight} ${pMeta.bgDark}`}
                            >
                              {pMeta.shortName}
                            </span>
                            {idea.scheduledDate && (
                              <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                                {idea.scheduledDate}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                            {idea.title}
                          </h4>
                          {idea.hook && (
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic line-clamp-2">
                              "{idea.hook}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewMode === 'list' ? (
          /* List Row View */
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredIdeas.map((idea) => {
              const pMeta = PLATFORM_CONFIG[idea.platform];
              const stMeta = STAGE_CONFIG[idea.stage];

              return (
                <div
                  key={idea.id}
                  className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-xl transition-colors cursor-pointer group"
                  onClick={() => onSelectIdea(idea)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border shrink-0 ${pMeta.bgLight} ${pMeta.bgDark}`}
                    >
                      {pMeta.shortName}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {idea.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                        <span className={`font-semibold ${stMeta.colorClass}`}>
                          {stMeta.label}
                        </span>
                        {idea.scheduledDate && (
                          <>
                            <span>·</span>
                            <span>{idea.scheduledDate}</span>
                          </>
                        )}
                        {idea.tags.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="truncate">#{idea.tags[0]}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(idea.id);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-amber-500 cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${idea.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Standard Card Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredIdeas.map((idea) => {
              const pMeta = PLATFORM_CONFIG[idea.platform];
              const stMeta = STAGE_CONFIG[idea.stage];

              return (
                <div
                  key={idea.id}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-indigo-400/60 transition-all flex flex-col justify-between gap-3 group"
                >
                  {/* Top Bar: Platform, Format, Star */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${pMeta.bgLight} ${pMeta.bgDark}`}
                      >
                        {pMeta.name}
                      </span>
                      <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                        {FORMAT_LABELS[idea.format]}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(idea.id);
                      }}
                      className="p-1 text-zinc-400 hover:text-amber-500 cursor-pointer transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          idea.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Body: Title & Hook */}
                  <div
                    onClick={() => onSelectIdea(idea)}
                    className="cursor-pointer space-y-1.5"
                  >
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {idea.title}
                    </h3>
                    {idea.hook ? (
                      <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 text-xs italic text-zinc-700 dark:text-zinc-300 line-clamp-2">
                        "{idea.hook}"
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {idea.scriptNotes || 'No notes or outline added yet.'}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  {idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300"
                        >
                          #{t}
                        </span>
                      ))}
                      {idea.tags.length > 3 && (
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 self-center">
                          +{idea.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer metadata & quick actions */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold ${stMeta.colorClass}`}>
                        {stMeta.label}
                      </span>
                      {idea.scheduledDate && (
                        <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                          {idea.scheduledDate}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {idea.hook && (
                        <button
                          onClick={() => onRehearseHook(idea)}
                          title="Rehearse Hook"
                          className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      )}
                      <button
                        onClick={() => onDuplicateIdea(idea)}
                        title="Duplicate"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSelectIdea(idea)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
