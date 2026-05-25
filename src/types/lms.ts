export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type CareerGoal =
  | 'student'
  | 'career-switcher'
  | 'professional'
  | 'entrepreneur';

export type UserProfile = {
  id?: string;
  email?: string;
  username?: string;
  careerGoal?: CareerGoal;
  experienceLevel?: ExperienceLevel;
  subscriptionPlan?: string;
  xp?: number;
  streak?: number;
};

export type QuizTopic = {
  id: string;
  title: string;
  description?: string;
  questionCount?: number;
  difficulty?: ExperienceLevel;
  trackSlug?: string;
};

export type Lesson = {
  id: string;
  title: string;
  durationMinutes?: number;
  type?: 'video' | 'text' | 'flashcard' | 'quiz';
};

export type FlashcardDeck = {
  id: string;
  title: string;
  cardCount?: number;
  trackSlug?: string;
};
