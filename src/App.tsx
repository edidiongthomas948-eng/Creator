import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ContentIdea, IdeaStage, CreatorStats } from './types';
import {
  loadStoredIdeas,
  saveStoredIdeas,
  resetToSeedIdeas,
  exportIdeasToJson,
  loadStoredTheme,
  saveStoredTheme,
  loadDeviceFramePreference,
  saveDeviceFramePreference,
  loadStoredGoals,
  saveStoredGoals,
  computeCreatorStats,
} from './services/storage';

import { DeviceFrameWrapper } from './components/android/DeviceFrameWrapper';
import { AndroidStatusBar } from './components/android/AndroidStatusBar';
import { AndroidNavigationBar, NavTab } from './components/android/AndroidNavigationBar';
import { MaterialFAB } from './components/common/MaterialFAB';

import { DashboardView } from './components/dashboard/DashboardView';
import { IdeasView } from './components/ideas/IdeasView';
import { HookWorkshopView } from './components/hooks/HookWorkshopView';
import { CalendarView } from './components/calendar/CalendarView';
import { AnalyticsView } from './components/analytics/AnalyticsView';

import { IdeaEditorModal } from './components/modals/IdeaEditorModal';
import { TeleprompterModal } from './components/modals/TeleprompterModal';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return loadStoredTheme() === 'dark';
  });

  // Device Frame preference (Phone Frame vs Wide Screen)
  const [showDeviceFrame, setShowDeviceFrame] = useState<boolean>(() => {
    return loadDeviceFramePreference();
  });

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Ideas state
  const [ideas, setIdeas] = useState<ContentIdea[]>(() => loadStoredIdeas());

  // Goals
  const [goals, setGoals] = useState(() => loadStoredGoals());

  // Modals state
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<ContentIdea | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(undefined);

  const [teleprompterData, setTeleprompterData] = useState<{
    title: string;
    hook: string;
    script?: string;
  } | null>(null);

  // Sync dark mode class on HTML document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      saveStoredTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      saveStoredTheme('light');
    }
  }, [isDarkMode]);

  // Sync ideas to storage on change
  const updateIdeas = useCallback((newIdeas: ContentIdea[]) => {
    setIdeas(newIdeas);
    saveStoredIdeas(newIdeas);
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    return computeCreatorStats(ideas, goals.monthlyPostTarget);
  }, [ideas, goals.monthlyPostTarget]);

  // Confetti trigger
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // safe fallback
    }
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Toggle Device Frame
  const handleToggleDeviceFrame = () => {
    setShowDeviceFrame((prev) => {
      const next = !prev;
      saveDeviceFramePreference(next);
      return next;
    });
  };

  // Export JSON
  const handleExportData = () => {
    exportIdeasToJson(ideas);
  };

  // Reset to initial seed
  const handleResetData = () => {
    const seed = resetToSeedIdeas();
    setIdeas(seed);
  };

  // Save Idea (create or edit)
  const handleSaveIdea = (
    ideaData: Omit<ContentIdea, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const nowStr = new Date().toISOString();
    if (ideaData.id) {
      // Update
      const updated = ideas.map((item) => {
        if (item.id === ideaData.id) {
          const wasPublished = item.stage === 'published';
          const willBePublished = ideaData.stage === 'published';
          if (!wasPublished && willBePublished) {
            triggerCelebration();
          }
          return {
            ...item,
            ...ideaData,
            updatedAt: nowStr,
          } as ContentIdea;
        }
        return item;
      });
      updateIdeas(updated);
    } else {
      // Create new
      const newIdea: ContentIdea = {
        ...ideaData,
        id: `idea-${Date.now()}`,
        createdAt: nowStr,
        updatedAt: nowStr,
      };
      if (newIdea.stage === 'published') {
        triggerCelebration();
      }
      updateIdeas([newIdea, ...ideas]);
    }
  };

  // Delete Idea
  const handleDeleteIdea = (id: string) => {
    const updated = ideas.filter((i) => i.id !== id);
    updateIdeas(updated);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    const updated = ideas.map((i) =>
      i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
    );
    updateIdeas(updated);
  };

  // Duplicate Idea
  const handleDuplicateIdea = (sourceIdea: ContentIdea) => {
    const nowStr = new Date().toISOString();
    const duplicated: ContentIdea = {
      ...sourceIdea,
      id: `idea-${Date.now()}`,
      title: `${sourceIdea.title} (Copy)`,
      stage: 'idea',
      createdAt: nowStr,
      updatedAt: nowStr,
    };
    updateIdeas([duplicated, ...ideas]);
  };

  // Advance Stage
  const handleAdvanceStage = (id: string, nextStage: IdeaStage) => {
    const updated = ideas.map((i) => {
      if (i.id === id) {
        if (nextStage === 'published') {
          triggerCelebration();
        }
        return {
          ...i,
          stage: nextStage,
          updatedAt: new Date().toISOString(),
        };
      }
      return i;
    });
    updateIdeas(updated);
  };

  // Quick Add from Dashboard
  const handleQuickAdd = (title: string) => {
    const nowStr = new Date().toISOString();
    const newIdea: ContentIdea = {
      id: `idea-${Date.now()}`,
      title,
      platform: 'youtube',
      format: 'short_video',
      stage: 'idea',
      hook: '',
      scriptNotes: '',
      tags: ['QuickCapture'],
      createdAt: nowStr,
      updatedAt: nowStr,
      checklist: [
        { id: '1', text: 'Draft hook & outline', done: false },
        { id: '2', text: 'Record A-roll', done: false },
      ],
    };
    updateIdeas([newIdea, ...ideas]);
  };

  // Open modal on specific date
  const handleNewIdeaOnDate = (dateStr: string) => {
    setEditingIdea(null);
    setModalDefaultDate(dateStr);
    setIsIdeaModalOpen(true);
  };

  // Rehearse Hook in Teleprompter
  const handleRehearseHook = (idea: ContentIdea) => {
    setTeleprompterData({
      title: idea.title,
      hook: idea.hook || idea.title,
      script: idea.scriptNotes,
    });
  };

  // Save hook from Workshop as new idea
  const handleSaveHookAsIdea = (hookText: string) => {
    const nowStr = new Date().toISOString();
    const newIdea: ContentIdea = {
      id: `idea-${Date.now()}`,
      title: hookText.length > 50 ? `${hookText.slice(0, 47)}...` : hookText,
      platform: 'tiktok',
      format: 'short_video',
      stage: 'idea',
      hook: hookText,
      scriptNotes: 'Created in Hook Workshop. Ready for script outline.',
      tags: ['HookTested'],
      createdAt: nowStr,
      updatedAt: nowStr,
      checklist: [
        { id: '1', text: 'Rehearse hook delivery', done: false },
        { id: '2', text: 'Film visual demo', done: false },
      ],
    };
    updateIdeas([newIdea, ...ideas]);
    // Switch to ideas tab to see it
    setCurrentTab('ideas');
  };

  // Update Monthly Goal
  const handleUpdateMonthlyGoal = (newGoal: number) => {
    const updated = { ...goals, monthlyPostTarget: newGoal };
    setGoals(updated);
    saveStoredGoals(updated);
  };

  return (
    <DeviceFrameWrapper
      isDarkMode={isDarkMode}
      onToggleTheme={handleToggleTheme}
      showDeviceFrame={showDeviceFrame}
      onToggleDeviceFrame={handleToggleDeviceFrame}
      onExportData={handleExportData}
      onResetData={handleResetData}
    >
      {/* Android Screen Container */}
      <div className="w-full h-full flex flex-col overflow-hidden bg-white dark:bg-zinc-900 select-none relative">
        {/* Android Native Status Bar */}
        <AndroidStatusBar isDarkMode={isDarkMode} />

        {/* View Switcher based on currentTab */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {currentTab === 'dashboard' && (
            <DashboardView
              ideas={ideas}
              stats={stats}
              onSelectIdea={(idea) => {
                setEditingIdea(idea);
                setIsIdeaModalOpen(true);
              }}
              onQuickAddIdea={handleQuickAdd}
              onOpenNewIdeaModal={() => {
                setEditingIdea(null);
                setModalDefaultDate(undefined);
                setIsIdeaModalOpen(true);
              }}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onRehearseHook={handleRehearseHook}
              onAdvanceStage={handleAdvanceStage}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'ideas' && (
            <IdeasView
              ideas={ideas}
              onSelectIdea={(idea) => {
                setEditingIdea(idea);
                setIsIdeaModalOpen(true);
              }}
              onNewIdea={() => {
                setEditingIdea(null);
                setModalDefaultDate(undefined);
                setIsIdeaModalOpen(true);
              }}
              onToggleFavorite={handleToggleFavorite}
              onDuplicateIdea={handleDuplicateIdea}
              onDeleteIdea={handleDeleteIdea}
              onAdvanceStage={handleAdvanceStage}
              onRehearseHook={handleRehearseHook}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'hooks' && (
            <HookWorkshopView
              onSaveHookAsIdea={handleSaveHookAsIdea}
              onLaunchTeleprompter={(hookText) => {
                setTeleprompterData({
                  title: 'Hook Rehearsal',
                  hook: hookText,
                });
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              ideas={ideas}
              onSelectIdea={(idea) => {
                setEditingIdea(idea);
                setIsIdeaModalOpen(true);
              }}
              onNewIdeaOnDate={handleNewIdeaOnDate}
              onRehearseHook={handleRehearseHook}
              onAdvanceStage={handleAdvanceStage}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              ideas={ideas}
              stats={stats}
              onUpdateMonthlyGoal={handleUpdateMonthlyGoal}
              isDarkMode={isDarkMode}
            />
          )}
        </div>

        {/* Material 3 Floating Action Button (FAB) */}
        <MaterialFAB
          onNewIdea={() => {
            setEditingIdea(null);
            setModalDefaultDate(undefined);
            setIsIdeaModalOpen(true);
          }}
          onOpenHookStudio={() => setCurrentTab('hooks')}
          onOpenSchedule={() => setCurrentTab('calendar')}
          isDarkMode={isDarkMode}
        />

        {/* Android Material 3 Bottom Navigation Bar */}
        <AndroidNavigationBar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isDarkMode={isDarkMode}
          upcomingCount={stats.scheduledUpcoming}
          ideasCount={stats.totalIdeas}
        />

        {/* Modal: Idea Capture & Editor */}
        {isIdeaModalOpen && (
          <IdeaEditorModal
            idea={editingIdea}
            defaultDate={modalDefaultDate}
            onSave={handleSaveIdea}
            onDelete={editingIdea ? handleDeleteIdea : undefined}
            onClose={() => {
              setIsIdeaModalOpen(false);
              setEditingIdea(null);
              setModalDefaultDate(undefined);
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Modal: Teleprompter & Hook Rehearsal Studio */}
        {teleprompterData && (
          <TeleprompterModal
            title={teleprompterData.title}
            hookText={teleprompterData.hook}
            fullScript={teleprompterData.script}
            onClose={() => setTeleprompterData(null)}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </DeviceFrameWrapper>
  );
}
