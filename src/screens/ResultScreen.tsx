import React, { useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Home,
  Award,
} from 'lucide-react';
import { QuizAttempt, ScreenState } from '../types/quiz';
import { playQuizCompleteSound } from '../utils/sound';

interface ResultScreenProps {
  attempt: QuizAttempt;
  isNewBest: boolean;
  onNavigate: (screen: ScreenState) => void;
  onRetake: () => void;
  onReview: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  attempt,
  isNewBest,
  onNavigate,
  onRetake,
  onReview,
}) => {
  const {
    categoryName,
    score,
    totalQuestions,
    percentage,
    correctCount,
    incorrectCount,
    unansweredCount,
    timeSpentSeconds,
  } = attempt;

  useEffect(() => {
    playQuizCompleteSound(score, totalQuestions, attempt.audience === 'children');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [score, totalQuestions, attempt.audience]);

  // Performance message
  const getPerformanceDetails = () => {
    if (percentage >= 90) {
      return {
        badge: 'Outstanding!',
        title: 'Outstanding! Master of this subject!',
        desc: 'Exceptional mastery and recall. You aced almost every question with precision.',
        accentColor: 'text-emerald-600 dark:text-emerald-400',
        strokeColor: '#059669', // emerald-600
        bgGlow: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/20',
      };
    } else if (percentage >= 70) {
      return {
        badge: 'Great Job!',
        title: 'Great job! Strong knowledge and precision.',
        desc: 'Solid understanding across concepts. A quick review of the missed questions will get you to 100%.',
        accentColor: 'text-indigo-600 dark:text-indigo-400',
        strokeColor: '#4f46e5', // indigo-600
        bgGlow: 'from-indigo-500/10 to-purple-500/10 dark:from-indigo-950/40 dark:to-purple-950/20',
      };
    } else if (percentage >= 50) {
      return {
        badge: 'Good Effort!',
        title: 'Good effort! Keep practicing to master it.',
        desc: 'You have a healthy grasp of the fundamentals. Delve deeper into the explanations to level up.',
        accentColor: 'text-amber-600 dark:text-amber-400',
        strokeColor: '#d97706', // amber-600
        bgGlow: 'from-amber-500/10 to-yellow-500/10 dark:from-amber-950/40 dark:to-yellow-950/20',
      };
    } else {
      return {
        badge: 'Keep Going!',
        title: 'Keep going! Review the concepts and try again.',
        desc: 'Every attempt builds stronger intuition. Walk through the detailed review explanations below.',
        accentColor: 'text-rose-600 dark:text-rose-400',
        strokeColor: '#e11d48', // rose-600
        bgGlow: 'from-rose-500/10 to-orange-500/10 dark:from-rose-950/40 dark:to-orange-950/20',
      };
    }
  };

  const perf = getPerformanceDetails();

  // SVG Circular progress math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="py-6 sm:py-10 md:py-16 max-w-3xl mx-auto px-3.5 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors duration-200">
        {/* Banner with Performance Message */}
        <div className={`p-5 sm:p-8 md:p-10 text-center bg-gradient-to-b ${perf.bgGlow} border-b border-slate-100 dark:border-slate-700 relative`}>
          {isNewBest && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-xs font-bold text-amber-900 dark:text-amber-200 mb-3 sm:mb-4 animate-bounce">
              <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>New Personal Best Score!</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {categoryName}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {attempt.audience === 'children' ? '👶 Children Quiz' : '🎓 General Quiz'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Quiz Completed!
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-bold text-slate-800 dark:text-slate-200 mt-2 max-w-xl mx-auto leading-snug">
            {perf.title}
          </p>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
            {perf.desc}
          </p>

          {/* Visually Attractive Circular Score Indicator: Responsive SVG */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="text-slate-100 dark:text-slate-700"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Active Animated Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={perf.strokeColor}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                <span className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {percentage}%
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                  {score} / {totalQuestions} Correct
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Breakdown: 2 cols on mobile, 4 on tablet/desktop */}
        <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center sm:text-left">
              Score Breakdown
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
              {/* Correct */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/70 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-200 tabular-nums">
                  {correctCount}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Correct
                </div>
              </div>

              {/* Incorrect */}
              <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/70 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                  <XCircle className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-rose-900 dark:text-rose-200 tabular-nums">
                  {incorrectCount}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-rose-700 dark:text-rose-400 mt-0.5">
                  Incorrect
                </div>
              </div>

              {/* Unanswered */}
              <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/70 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-200 tabular-nums">
                  {unansweredCount}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                  Unanswered
                </div>
              </div>

              {/* Time */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                  Time Taken
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs: Review Answers, Retake Quiz, Back to Home (min-h-[44px] buttons) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              type="button"
              onClick={onReview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Review Answers</span>
            </button>

            <button
              type="button"
              onClick={onRetake}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Retake Quiz</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
