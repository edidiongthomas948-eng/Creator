import { HookTemplate } from '../types';

export const HOOK_TEMPLATES: HookTemplate[] = [
  {
    id: 'contrarian-1',
    category: 'contrarian',
    categoryLabel: 'Contrarian Truth',
    template: 'Stop doing [Common Habit]. Here is what top [Niche] actually do instead in 2026.',
    example: 'Stop doing 60-second intro hooks. Here is what top YouTube creators actually do instead in 2026.',
    bestFor: 'Shorts & TikToks disrupting mainstream advice',
    retentionRating: 96,
  },
  {
    id: 'contrarian-2',
    category: 'contrarian',
    categoryLabel: 'The Uncomfortable Truth',
    template: 'Almost everything you’ve been told about [Topic] is completely wrong. Let me explain in 45 seconds.',
    example: 'Almost everything you’ve been told about building a personal brand is completely wrong. Let me explain in 45 seconds.',
    bestFor: 'Educational content & myth busting',
    retentionRating: 94,
  },
  {
    id: 'curiosity-1',
    category: 'curiosity',
    categoryLabel: 'Curiosity Gap',
    template: 'This one small tweak to [Action] increased my [Result] by [X]%. Here is the exact breakdown.',
    example: 'This one small tweak to my video editing increased retention past 30 seconds by 42%. Here is the exact breakdown.',
    bestFor: 'Case studies & tactical tutorials',
    retentionRating: 98,
  },
  {
    id: 'curiosity-2',
    category: 'curiosity',
    categoryLabel: 'The Hidden Mechanism',
    template: 'Why does [Authority/Entity] never talk about [Phenomenon]? Here is the secret they keep quiet.',
    example: 'Why do top tech reviewers never talk about this camera setting? Here is the secret they keep quiet.',
    bestFor: 'Deep dives & gear/tech videos',
    retentionRating: 92,
  },
  {
    id: 'story-1',
    category: 'story',
    categoryLabel: 'In Medias Res',
    template: 'I was 1 click away from deleting my [Project] when suddenly [Surprising Event] happened.',
    example: 'I was 1 click away from deleting my channel when suddenly a 10-second Short hit 1.2M views.',
    bestFor: 'Storytelling & founder journeys',
    retentionRating: 95,
  },
  {
    id: 'story-2',
    category: 'story',
    categoryLabel: 'The Transformation',
    template: '30 days ago I had zero [Resource]. Today I have [Milestone]. Here is my daily blueprint.',
    example: '30 days ago I had zero newsletter subscribers. Today I have 5,400. Here is my daily blueprint.',
    bestFor: 'Vlogs, fitness, and skill challenges',
    retentionRating: 93,
  },
  {
    id: 'problem_solution-1',
    category: 'problem_solution',
    categoryLabel: 'Pain Point Agitator',
    template: 'If you struggle with [Painful Problem], you are making this 1 critical mistake right now.',
    example: 'If you struggle with camera shyness, you are making this 1 critical mistake right now.',
    bestFor: 'How-to guides & coaching',
    retentionRating: 97,
  },
  {
    id: 'problem_solution-2',
    category: 'problem_solution',
    categoryLabel: 'The Shortcut',
    template: 'How to [Desired Goal] in half the time without [Annoying Sacrifice].',
    example: 'How to edit high-paced Shorts in half the time without spending $500 on plugins.',
    bestFor: 'Productivity & workflow optimization',
    retentionRating: 91,
  },
  {
    id: 'secret-1',
    category: 'secret',
    categoryLabel: 'Insider Knowledge',
    template: 'Only 1% of creators know about this hidden feature inside [Tool/App]. Save this before they patch it.',
    example: 'Only 1% of creators know about this hidden feature inside Premiere Pro. Save this before they patch it.',
    bestFor: 'Tips & tricks, viral saves',
    retentionRating: 97,
  },
  {
    id: 'stats-1',
    category: 'stats',
    categoryLabel: 'Data Shock',
    template: 'Over [Stat]% of people fail at [Activity] because of this single overlooked factor.',
    example: 'Over 89% of new YouTubers quit before video 20 because of this single overlooked factor.',
    bestFor: 'Informational analysis & motivation',
    retentionRating: 94,
  },
  {
    id: 'challenge-1',
    category: 'challenge',
    categoryLabel: 'Direct Challenge',
    template: 'I bet you cannot watch this whole video without realizing you have been doing [Task] backwards.',
    example: 'I bet you cannot watch this whole video without realizing you have been lighting your desk backwards.',
    bestFor: 'High engagement & comments',
    retentionRating: 89,
  },
  {
    id: 'challenge-2',
    category: 'challenge',
    categoryLabel: 'The Experiment',
    template: 'I tried [Trend/Extreme Rule] for 7 straight days so you don’t have to. Here are the brutal results.',
    example: 'I posted 3 TikToks every single day for 7 straight days so you don’t have to. Here are the brutal results.',
    bestFor: 'Experiment & review formats',
    retentionRating: 96,
  }
];

export const HOOK_POWER_WORDS = [
  'secret', 'stop', 'mistake', 'never', 'truth', 'exposed', 'blueprint',
  'hack', 'unusual', 'warning', 'instantly', 'proven', 'shocking', 'fastest',
  'deadly', 'insane', 'free', 'guaranteed', 'banned', 'hidden', 'brutal', 'game-changer'
];

export function analyzeHookStrength(hookText: string): {
  score: number;
  wordCount: number;
  characterCount: number;
  estimatedDeliverySeconds: number;
  matchedPowerWords: string[];
  feedback: { type: 'success' | 'warning' | 'info'; message: string }[];
} {
  const clean = hookText.trim();
  if (!clean) {
    return {
      score: 0,
      wordCount: 0,
      characterCount: 0,
      estimatedDeliverySeconds: 0,
      matchedPowerWords: [],
      feedback: [{ type: 'info', message: 'Type or generate a hook to analyze its retention score.' }]
    };
  }

  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = clean.length;
  // Average speaking pace: 2.5 to 3 words per second (150-180 wpm)
  const estimatedDeliverySeconds = Math.max(1, Math.round((wordCount / 2.7) * 10) / 10);

  const lowerText = clean.toLowerCase();
  const matchedPowerWords = HOOK_POWER_WORDS.filter(pw => lowerText.includes(pw));

  let score = 50;
  const feedback: { type: 'success' | 'warning' | 'info'; message: string }[] = [];

  // Word count evaluation (sweet spot for video hook is 10 to 22 words, roughly 3-6 seconds)
  if (wordCount >= 8 && wordCount <= 22) {
    score += 25;
    feedback.push({
      type: 'success',
      message: `Ideal length (${wordCount} words, ~${estimatedDeliverySeconds}s). Quick to deliver before viewers swipe away.`
    });
  } else if (wordCount < 8) {
    score += 10;
    feedback.push({
      type: 'warning',
      message: `A bit brief (${wordCount} words). Make sure to establish high curiosity or tension.`
    });
  } else {
    score -= 15;
    feedback.push({
      type: 'warning',
      message: `Too lengthy (${wordCount} words, ~${estimatedDeliverySeconds}s). Trim filler to punch under 20 words for the first 3 seconds.`
    });
  }

  // Power words evaluation
  if (matchedPowerWords.length >= 2) {
    score += 15;
    feedback.push({
      type: 'success',
      message: `Strong trigger words detected: "${matchedPowerWords.slice(0, 3).join(', ')}". High psychological pull.`
    });
  } else if (matchedPowerWords.length === 1) {
    score += 8;
    feedback.push({
      type: 'info',
      message: `Trigger word detected: "${matchedPowerWords[0]}". Add a contrast or consequence for stronger hook.`
    });
  } else {
    feedback.push({
      type: 'info',
      message: 'Consider adding dynamic contrast words (e.g. "Stop", "Secret", "Mistake", "Truth").'
    });
  }

  // Punctuation & Curiosity gap
  if (clean.endsWith('?') || clean.includes('?') || lowerText.includes('why') || lowerText.includes('how')) {
    score += 10;
    feedback.push({
      type: 'success',
      message: 'Open loop / Question gap opened. Viewers naturally wait for the closure.'
    });
  }

  // Numbers or statistics
  if (/\d+/.test(clean)) {
    score += 10;
    feedback.push({
      type: 'success',
      message: 'Specific figures or numbers included. Concrete data increases perceived credibility.'
    });
  }

  // Clamp score between 15 and 99
  const finalScore = Math.min(99, Math.max(15, score));

  return {
    score: finalScore,
    wordCount,
    characterCount,
    estimatedDeliverySeconds,
    matchedPowerWords,
    feedback
  };
}
