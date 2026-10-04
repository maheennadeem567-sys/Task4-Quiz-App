import { CategoryKey, QuizAttempt, AudienceType } from '../types/quiz';

const HISTORY_KEY = 'quizify_attempts_history_v1';
const BEST_SCORES_KEY = 'quizify_best_scores_v1';
const SOUND_KEY = 'quizify_sound_enabled';
const THEME_KEY = 'quizify_theme_preference_v1';

export const GENERAL_CATEGORIES: CategoryKey[] = [
  'science',
  'history',
  'geography',
  'mathematics',
  'literature',
  'art_culture',
];

export const CHILDREN_CATEGORIES: CategoryKey[] = [
  'animals',
  'colors_shapes',
  'numbers_counting',
  'fruits_vegetables',
  'alphabet_words',
  'space_planets',
];

export type Theme = 'light' | 'dark';

export function getThemePreference(): Theme {
  try {
    const val = localStorage.getItem(THEME_KEY);
    if (val === 'dark' || val === 'light') return val;
    // Default to light or check system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function setThemePreference(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  } catch (e) {
    console.error('Failed to save theme preference', e);
  }
}

export function getQuizHistory(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read quiz history from localStorage', e);
    return [];
  }
}

export function saveQuizAttempt(attempt: QuizAttempt): void {
  try {
    const history = getQuizHistory();
    const updatedHistory = [attempt, ...history].slice(0, 50); // keep last 50 attempts
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    // Update best score for category
    const bestScores = getBestScores();
    const currentBest = bestScores[attempt.categoryId] || 0;
    if (attempt.score > currentBest) {
      bestScores[attempt.categoryId] = attempt.score;
      localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(bestScores));
    }
  } catch (e) {
    console.error('Failed to save quiz attempt to localStorage', e);
  }
}

export function getBestScores(): Record<CategoryKey, number> {
  const defaultScores: Record<CategoryKey, number> = {
    science: 0,
    history: 0,
    geography: 0,
    mathematics: 0,
    literature: 0,
    art_culture: 0,
    animals: 0,
    colors_shapes: 0,
    numbers_counting: 0,
    fruits_vegetables: 0,
    alphabet_words: 0,
    space_planets: 0,
  };

  try {
    const raw = localStorage.getItem(BEST_SCORES_KEY);
    if (!raw) return defaultScores;
    const parsed = JSON.parse(raw);
    return { ...defaultScores, ...parsed };
  } catch (e) {
    console.error('Failed to read best scores from localStorage', e);
    return defaultScores;
  }
}

export function clearQuizHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(BEST_SCORES_KEY);
  } catch (e) {
    console.error('Failed to clear quiz history', e);
  }
}

/**
 * Deletes all saved attempts and resets best scores for the specified audience only ('general' or 'children').
 * Keeps attempts and best scores for the other audience intact.
 */
export function clearQuizHistoryByAudience(audience: AudienceType): {
  history: QuizAttempt[];
  bestScores: Record<CategoryKey, number>;
} {
  try {
    const currentHistory = getQuizHistory();
    const updatedHistory = currentHistory.filter((item) => {
      const itemAudience =
        item.audience || (CHILDREN_CATEGORIES.includes(item.categoryId) ? 'children' : 'general');
      return itemAudience !== audience;
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    const currentBestScores = getBestScores();
    const categoriesToReset = audience === 'general' ? GENERAL_CATEGORIES : CHILDREN_CATEGORIES;
    categoriesToReset.forEach((catKey) => {
      currentBestScores[catKey] = 0;
    });
    localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(currentBestScores));

    return { history: updatedHistory, bestScores: currentBestScores };
  } catch (e) {
    console.error('Failed to clear quiz history by audience', e);
    return { history: getQuizHistory(), bestScores: getBestScores() };
  }
}

/**
 * Removes only that category's saved attempt(s) and resets its best score to 0 for that audience.
 */
export function resetCategoryAttemptAndScore(
  categoryId: CategoryKey,
  audience?: AudienceType
): {
  history: QuizAttempt[];
  bestScores: Record<CategoryKey, number>;
} {
  try {
    const currentHistory = getQuizHistory();
    const updatedHistory = currentHistory.filter((item) => {
      if (item.categoryId !== categoryId) return true;
      if (audience && item.audience && item.audience !== audience) return true;
      return false;
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    const currentBestScores = getBestScores();
    currentBestScores[categoryId] = 0;
    localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(currentBestScores));

    return { history: updatedHistory, bestScores: currentBestScores };
  } catch (e) {
    console.error('Failed to reset category attempt and score', e);
    return { history: getQuizHistory(), bestScores: getBestScores() };
  }
}

export function getSoundPreference(): boolean {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val === null ? false : val === 'true';
  } catch {
    return false;
  }
}

export function setSoundPreference(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch (e) {
    console.error('Failed to save sound preference', e);
  }
}
