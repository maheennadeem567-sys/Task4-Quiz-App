import React, { useState } from 'react';
import {
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { QuizAttempt, ScreenState } from '../types/quiz';
import { playSelectSound } from '../utils/sound';

interface ReviewScreenProps {
  attempt: QuizAttempt;
  onNavigate: (screen: ScreenState) => void;
  onRetake: () => void;
}

type FilterType = 'all' | 'correct' | 'incorrect' | 'unanswered';

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  attempt,
  onNavigate,
  onRetake,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const {
    categoryName,
    score,
    totalQuestions,
    percentage,
    correctCount,
    incorrectCount,
    unansweredCount,
    questions,
    userAnswers,
  } = attempt;

  // Filtered list
  const filteredQuestions = questions.filter((q) => {
    const userSelected = userAnswers[q.id];
    const isAnswered = userSelected !== undefined && userSelected !== null;
    const isCorrect = isAnswered && userSelected === q.correctIndex;

    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return isAnswered && !isCorrect;
    if (filter === 'unanswered') return !isAnswered;
    return true;
  });

  return (
    <div className="py-6 sm:py-10 md:py-16 max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 transition-colors duration-200">
      {/* Top Banner & Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 transition-colors duration-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-800">
              Answer Review
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">· {categoryName}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {attempt.audience === 'children' ? '👶 Children' : '🎓 General'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Detailed Solution & Explanations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review your choices against verified answers with comprehensive reasoning.
          </p>
        </div>

        {/* Score pill */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl p-3 sm:p-4 shrink-0 w-full sm:w-auto justify-around sm:justify-start">
          <div>
            <div className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">Your Score</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {score} / {totalQuestions}
            </div>
          </div>
          <div className="w-px h-9 sm:h-10 bg-slate-200 dark:border-slate-700" />
          <div>
            <div className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">Accuracy</div>
            <div className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
              {percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs: Horizontal scrollable on mobile to guarantee zero overflow */}
      <div className="w-full overflow-x-auto pb-1">
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 min-w-max">
          <button
            type="button"
            onClick={() => {
              playSelectSound(attempt.audience === 'children');
              setFilter('all');
            }}
            className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg transition-colors flex items-center cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Questions ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => {
              playSelectSound(attempt.audience === 'children');
              setFilter('correct');
            }}
            className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg transition-colors flex items-center cursor-pointer ${
              filter === 'correct'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Correct ({correctCount})
          </button>
          <button
            type="button"
            onClick={() => {
              playSelectSound(attempt.audience === 'children');
              setFilter('incorrect');
            }}
            className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg transition-colors flex items-center cursor-pointer ${
              filter === 'incorrect'
                ? 'bg-white dark:bg-slate-700 text-rose-800 dark:text-rose-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Incorrect ({incorrectCount})
          </button>
          <button
            type="button"
            onClick={() => {
              playSelectSound(attempt.audience === 'children');
              setFilter('unanswered');
            }}
            className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg transition-colors flex items-center cursor-pointer ${
              filter === 'unanswered'
                ? 'bg-white dark:bg-slate-700 text-amber-800 dark:text-amber-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Unanswered ({unansweredCount})
          </button>
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-5 sm:space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center text-slate-500 dark:text-slate-400">
            No questions match this filter criteria.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const userPick = userAnswers[q.id];
            const isAnswered = userPick !== undefined && userPick !== null;
            const isCorrect = isAnswered && userPick === q.correctIndex;
            const isIncorrect = isAnswered && userPick !== q.correctIndex;

            // Original question index in full test (1-based)
            const questionNumber = questions.findIndex((item) => item.id === q.id) + 1;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-200"
              >
                {/* Question Status Banner */}
                <div
                  className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 ${
                    isCorrect
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                      : isIncorrect
                      ? 'bg-rose-50/80 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200'
                      : 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wide">
                      Question {questionNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold shrink-0">
                    {isCorrect && (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Correct (+1 pt)</span>
                      </>
                    )}
                    {isIncorrect && (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>Incorrect (0 pts)</span>
                      </>
                    )}
                    {!isAnswered && (
                      <>
                        <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Not Answered (0 pts)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                  {/* Question Text */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </h3>

                  {/* All 4 Options with Visual State Indicators */}
                  <div className="space-y-2.5">
                    {q.options.map((option, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctIndex;
                      const isUserSelection = userPick === optIdx;
                      const letter = String.fromCharCode(65 + optIdx);

                      let containerStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300';
                      let letterBadge = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                      if (isOptionCorrect) {
                        containerStyle = 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                        letterBadge = 'bg-emerald-600 text-white';
                      } else if (isUserSelection && !isOptionCorrect) {
                        containerStyle = 'border-rose-400 dark:border-rose-500 bg-rose-50/90 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-semibold ring-1 ring-rose-400 dark:ring-rose-500';
                        letterBadge = 'bg-rose-600 text-white';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 ${containerStyle}`}
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <span
                              className={`w-7 h-7 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${letterBadge}`}
                            >
                              {letter}
                            </span>
                            <span className="text-xs sm:text-base leading-relaxed break-words min-w-0">
                              {option}
                            </span>
                          </div>

                          {/* Tag annotations */}
                          <div className="flex items-center gap-2 shrink-0">
                            {isOptionCorrect && (
                              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                                <span>Correct Answer</span>
                              </span>
                            )}
                            {isUserSelection && !isOptionCorrect && (
                              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-rose-800 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                                <XCircle className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />
                                <span>Your Answer</span>
                              </span>
                            )}
                            {isUserSelection && isOptionCorrect && (
                              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-200/90 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                                <span>Your Answer</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation of the correct answer */}
                  <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100/90 dark:border-indigo-900/60 space-y-1 sm:space-y-1.5">
                    <div className="flex items-center gap-1.5 text-indigo-950 dark:text-indigo-200 font-bold text-xs sm:text-sm">
                      <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Explanation:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal sm:pl-6">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Action Buttons: minimum 44px tall buttons */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors duration-200">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Return Home</span>
        </button>

        <button
          type="button"
          onClick={onRetake}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 min-h-[44px] text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span>Retake Quiz</span>
        </button>
      </div>
    </div>
  );
};
