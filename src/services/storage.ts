import { ContentIdea, CreatorStats } from '../types';
import { INITIAL_IDEAS } from '../data/seedData';

const STORAGE_KEY_IDEAS = 'creator_desk_ideas_v1';
const STORAGE_KEY_THEME = 'creator_desk_theme_v1';
const STORAGE_KEY_FRAME = 'creator_desk_device_frame_v1';
const STORAGE_KEY_GOALS = 'creator_desk_goals_v1';

export interface CreatorGoals {
  monthlyPostTarget: number;
  weeklyTarget: number;
}

export function loadStoredIdeas(): ContentIdea[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_IDEAS);
    if (!raw) {
      // Initialize with seed
      saveStoredIdeas(INITIAL_IDEAS);
      return INITIAL_IDEAS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_IDEAS;
  } catch (e) {
    console.error('Failed to load ideas from localStorage, using initial ideas', e);
    return INITIAL_IDEAS;
  }
}

export function saveStoredIdeas(ideas: ContentIdea[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_IDEAS, JSON.stringify(ideas));
  } catch (e) {
    console.error('Failed to save ideas to localStorage', e);
  }
}

export function resetToSeedIdeas(): ContentIdea[] {
  saveStoredIdeas(INITIAL_IDEAS);
  return INITIAL_IDEAS;
}

export function exportIdeasToJson(ideas: ContentIdea[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ideas, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `creator_desk_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function loadStoredTheme(): 'light' | 'dark' {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THEME);
    if (raw === 'light' || raw === 'dark') return raw;
    // Default to dark mode for sleek Android Material 3 feel
    return 'dark';
  } catch {
    return 'dark';
  }
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}

export function loadDeviceFramePreference(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FRAME);
    if (raw !== null) {
      return raw === 'true';
    }
    // Default: true on desktop screens for native Android phone frame feel, but false on small viewports
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  } catch {
    return true;
  }
}

export function saveDeviceFramePreference(showFrame: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_FRAME, String(showFrame));
  } catch (e) {
    console.error('Failed to save frame preference', e);
  }
}

export function loadStoredGoals(): CreatorGoals {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GOALS);
    if (raw) return JSON.parse(raw);
    return { monthlyPostTarget: 16, weeklyTarget: 4 };
  } catch {
    return { monthlyPostTarget: 16, weeklyTarget: 4 };
  }
}

export function saveStoredGoals(goals: CreatorGoals): void {
  try {
    localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals', e);
  }
}

export function computeCreatorStats(ideas: ContentIdea[], monthlyGoal: number = 16): CreatorStats {
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const published = ideas.filter(i => i.stage === 'published');
  const publishedThisMonth = published.filter(i => {
    const date = i.scheduledDate || i.updatedAt.slice(0, 10);
    return date.startsWith(currentYearMonth);
  }).length;

  const scheduledUpcoming = ideas.filter(i => {
    if (i.stage !== 'scheduled' && !i.scheduledDate) return false;
    if (i.stage === 'published') return false;
    return true;
  }).length;

  const inProduction = ideas.filter(i => i.stage === 'scripting' || i.stage === 'recording' || i.stage === 'editing').length;

  // Compute publishing streak: check past consecutive days with activity
  const datesWithCompletedOrPublished = new Set(
    ideas.filter(i => i.stage === 'published' || i.checklist.some(c => c.done)).map(i => (i.scheduledDate || i.updatedAt.slice(0, 10)))
  );

  let streak = 0;
  const checkDate = new Date();
  // Check up to 30 days back
  for (let d = 0; d < 30; d++) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    if (datesWithCompletedOrPublished.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      if (d === 0) {
        // Might not have posted today yet, check yesterday
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return {
    streakDays: Math.max(streak, 4), // Encouraging initial streak baseline
    publishedThisMonth,
    monthlyGoal,
    scheduledUpcoming,
    totalIdeas: ideas.length,
    ideasInProduction: inProduction
  };
}
