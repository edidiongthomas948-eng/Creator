export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'linkedin' | 'podcast' | 'newsletter';

export type ContentFormat = 'short_video' | 'long_video' | 'carousel' | 'thread' | 'post' | 'audio';

export type IdeaStage = 'idea' | 'scripting' | 'recording' | 'editing' | 'scheduled' | 'published';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ContentIdea {
  id: string;
  title: string;
  platform: Platform;
  format: ContentFormat;
  stage: IdeaStage;
  hook: string;
  hookFormulaId?: string;
  scriptNotes: string;
  tags: string[];
  scheduledDate?: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:MM
  createdAt: string;
  updatedAt: string;
  targetAudience?: string;
  estimatedMinutes?: number;
  checklist: ChecklistItem[];
  isFavorite?: boolean;
  viewsOrEngagementGoal?: string;
}

export interface HookTemplate {
  id: string;
  category: 'contrarian' | 'curiosity' | 'story' | 'problem_solution' | 'secret' | 'stats' | 'challenge';
  categoryLabel: string;
  template: string;
  example: string;
  bestFor: string;
  retentionRating: number; // e.g. 95%
}

export interface CreatorStats {
  streakDays: number;
  publishedThisMonth: number;
  monthlyGoal: number;
  scheduledUpcoming: number;
  totalIdeas: number;
  ideasInProduction: number;
}
