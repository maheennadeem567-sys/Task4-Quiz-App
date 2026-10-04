export type AudienceType = 'general' | 'children';

export type CategoryKey =
  // General Categories (6)
  | 'science'
  | 'history'
  | 'geography'
  | 'mathematics'
  | 'literature'
  | 'art_culture'
  // Children Categories (6)
  | 'animals'
  | 'colors_shapes'
  | 'numbers_counting'
  | 'fruits_vegetables'
  | 'alphabet_words'
  | 'space_planets';

export type ScreenState = 'home' | 'categories' | 'instructions' | 'quiz' | 'result' | 'review';

export interface Question {
  id: number;
  category: CategoryKey;
  audience: AudienceType;
  categoryName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CategoryInfo {
  id: CategoryKey;
  audience: AudienceType;
  name: string;
  shortDesc: string;
  longDesc: string;
  questionCount: number;
  timeLimitSeconds: number; // 300 for general (5 min), 420 for children (7 min)
  iconName: string;
  themeColor: string;
  accentBg: string;
  accentText: string;
  borderColor: string;
}

export interface QuizAttempt {
  id: string;
  categoryId: CategoryKey;
  audience: AudienceType;
  categoryName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeSpentSeconds: number;
  date: string;
  questions: Question[];
  userAnswers: Record<number, number | null>; // questionId -> optionIndex (or null)
}
