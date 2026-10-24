import { Platform, IdeaStage, ContentFormat } from '../types';

export interface PlatformMeta {
  id: Platform;
  name: string;
  shortName: string;
  color: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  borderColor: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformMeta> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    shortName: 'YT',
    color: '#FF0000',
    bgLight: 'bg-red-50 text-red-600 border-red-200',
    bgDark: 'dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
    textLight: 'text-red-600',
    textDark: 'dark:text-red-400',
    borderColor: 'border-red-500/30',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    shortName: 'TT',
    color: '#00F2FE',
    bgLight: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    bgDark: 'dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900/50',
    textLight: 'text-cyan-700',
    textDark: 'dark:text-cyan-300',
    borderColor: 'border-cyan-500/30',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    shortName: 'IG',
    color: '#E1306C',
    bgLight: 'bg-rose-50 text-rose-600 border-rose-200',
    bgDark: 'dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50',
    textLight: 'text-rose-600',
    textDark: 'dark:text-rose-400',
    borderColor: 'border-rose-500/30',
  },
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    shortName: 'X',
    color: '#1DA1F2',
    bgLight: 'bg-sky-50 text-sky-700 border-sky-200',
    bgDark: 'dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/50',
    textLight: 'text-sky-700',
    textDark: 'dark:text-sky-300',
    borderColor: 'border-sky-500/30',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    shortName: 'IN',
    color: '#0A66C2',
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200',
    bgDark: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50',
    textLight: 'text-blue-700',
    textDark: 'dark:text-blue-300',
    borderColor: 'border-blue-500/30',
  },
  podcast: {
    id: 'podcast',
    name: 'Podcast',
    shortName: 'POD',
    color: '#8B5CF6',
    bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
    bgDark: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50',
    textLight: 'text-purple-700',
    textDark: 'dark:text-purple-300',
    borderColor: 'border-purple-500/30',
  },
  newsletter: {
    id: 'newsletter',
    name: 'Newsletter',
    shortName: 'NL',
    color: '#10B981',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bgDark: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50',
    textLight: 'text-emerald-700',
    textDark: 'dark:text-emerald-300',
    borderColor: 'border-emerald-500/30',
  },
};

export const STAGE_CONFIG: Record<IdeaStage, { label: string; step: number; colorClass: string; badgeColor: string }> = {
  idea: {
    label: 'Idea Backlog',
    step: 1,
    colorClass: 'text-zinc-500 dark:text-zinc-400',
    badgeColor: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
  },
  scripting: {
    label: 'Scripting',
    step: 2,
    colorClass: 'text-amber-600 dark:text-amber-400',
    badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  },
  recording: {
    label: 'Recording',
    step: 3,
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50',
  },
  editing: {
    label: 'Editing',
    step: 4,
    colorClass: 'text-purple-600 dark:text-purple-400',
    badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/50',
  },
  scheduled: {
    label: 'Scheduled',
    step: 5,
    colorClass: 'text-blue-600 dark:text-blue-400',
    badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
  },
  published: {
    label: 'Published',
    step: 6,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  },
};

export const FORMAT_LABELS: Record<ContentFormat, string> = {
  short_video: 'Short / Reel (9:16)',
  long_video: 'Video (16:9)',
  carousel: 'Carousel / Slides',
  thread: 'Thread / Micro',
  post: 'Post / Graphic',
  audio: 'Podcast Episode',
};
