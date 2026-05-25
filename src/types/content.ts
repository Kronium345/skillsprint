export type CourseSummary = {
  _id: string;
  trackSlug: string;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: string;
  durationMinutes: number;
  isPremium?: boolean;
};

export type LessonListItem = {
  id: string;
  courseId: string;
  trackSlug: string;
  title: string;
  summary: string;
  videoUrl?: string;
  order: number;
  durationMinutes: number;
  completed?: boolean;
};

export type LessonDetail = {
  id: string;
  courseId: string;
  trackSlug: string;
  title: string;
  summary: string;
  content: string;
  videoUrl?: string;
  keyTerms: string[];
  durationMinutes: number;
  quiz: {
    id: string;
    question: string;
    explanation?: string;
    options: { text: string; isCorrect: boolean }[];
  }[];
  flashcards: { id: string; front: string; back: string }[];
  progress?: { completed: boolean; score?: number; xpEarned?: number } | null;
};
