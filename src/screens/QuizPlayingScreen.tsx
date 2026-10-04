import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Send,
  Flag,
} from 'lucide-react';
import { CategoryInfo, Question } from '../types/quiz';
import {
  playSelectSound,
  playTickSound,
  playCorrectSound,
  playWrongSound,
} from '../utils/sound';

interface QuizPlayingScreenProps {
  category: CategoryInfo;
  questions: Question[];
  onCompleteQuiz: (userAnswers: Record<number, number | null>, timeSpentSeconds: number) => void;
  onQuitQuiz: () => void;
}

export const QuizPlayingScreen: React.FC<QuizPlayingScreenProps> = ({
  category,
  questions,
  onCompleteQuiz,
  onQuitQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  const [timeLeft, setTimeLeft] = useState(category.timeLimitSeconds); // 300 seconds (5 min)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  // Number of answered questions
  const answeredCount = useMemo(() => {
    return Object.values(userAnswers).filter((val) => val !== null && val !== undefined).length;
  }, [userAnswers]);

  const unansweredCount = totalQuestions - answeredCount;

  // Handle final submission
  const handleSubmit = useCallback(() => {
    const timeSpent = category.timeLimitSeconds - timeLeft;
    onCompleteQuiz(userAnswers, Math.max(timeSpent, 1));
  }, [category.timeLimitSeconds, timeLeft, onCompleteQuiz, userAnswers]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        if (prev <= 10) {
          playTickSound(category.audience === 'children');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit, category.audience]);

  // Option selection: plays correct chime or wrong buzz
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    const isChildren = category.audience === 'children';
    if (optionIndex === currentQuestion.correctIndex) {
      playCorrectSound(isChildren);
    } else {
      playWrongSound(isChildren);
    }
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showConfirmModal || showQuitModal) return;

      if (e.key === 'ArrowRight' && currentIndex < totalQuestions - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      } else if (['1', 'a', 'A'].includes(e.key)) {
        handleSelectOption(0);
      } else if (['2', 'b', 'B'].includes(e.key)) {
        handleSelectOption(1);
      } else if (['3', 'c', 'C'].includes(e.key)) {
        handleSelectOption(2);
      } else if (['4', 'd', 'D'].includes(e.key)) {
        handleSelectOption(3);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalQuestions, showConfirmModal, showQuitModal, currentQuestion]);

  // Trigger submission check
  const handleRequestSubmit = () => {
    if (unansweredCount > 0) {
      setShowConfirmModal(true);
    } else {
      handleSubmit();
    }
  };

  // Jump to first unanswered question
  const jumpToFirstUnanswered = () => {
    const firstUnansweredIndex = questions.findIndex(
      (q) => userAnswers[q.id] === undefined || userAnswers[q.id] === null
    );
    if (firstUnansweredIndex !== -1) {
      setCurrentIndex(firstUnansweredIndex);
    }
    setShowConfirmModal(false);
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const selectedOption = currentQuestion ? userAnswers[currentQuestion.id] : null;
  const isTimeCritical = timeLeft < 60;

  if (!currentQuestion) return null;

  return (
    <div className="py-5 sm:py-8 md:py-12 max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top Header Bar: Category, Timer & Exit */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-3.5 sm:p-5 mb-4 sm:mb-6 flex items-center justify-between gap-2.5 sm:gap-4 transition-colors duration-200">
        {/* Category & Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-xl ${category.accentBg} dark:bg-slate-700 flex items-center justify-center font-bold text-xs ${category.accentText} dark:text-indigo-300 shrink-0`}>
            {category.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
              Active Quiz
            </div>
            <h2 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
              {category.name}
            </h2>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 min-h-[44px] rounded-xl font-mono text-xs sm:text-sm font-bold border transition-colors ${
              isTimeCritical
                ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
                : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800'
            }`}
          >
            <Clock className={`w-4 h-4 shrink-0 ${isTimeCritical ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
            <span className="tabular-nums tracking-wider">{formatTime(timeLeft)}</span>
          </div>

          {/* Early quit button: min-h-[44px] */}
          <button
            type="button"
            onClick={() => setShowQuitModal(true)}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-2.5 sm:px-3 min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Quit
          </button>
        </div>
      </div>

      {/* Main Question Board */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden transition-colors duration-200">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 sm:h-2.5">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300 rounded-r-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          {/* Question Metadata Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-700 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-800 shrink-0">
                Q{currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                · {answeredCount} answered
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
              1 Point
            </div>
          </div>

          {/* Question Text */}
          <div className="min-h-[50px] sm:min-h-[70px]">
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQuestion.question}
            </h1>
          </div>

          {/* Four Clickable Options: minimum 50px tall touch target */}
          <div className="space-y-2.5 sm:space-y-3 pt-1">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all flex items-center justify-between gap-3 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[50px] ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/70 shadow-sm shadow-indigo-100 dark:shadow-none'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50/80 dark:hover:bg-slate-700/60 bg-white dark:bg-slate-800/90'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                      }`}
                    >
                      {optionLabel}
                    </span>
                    <span
                      className={`text-xs sm:text-base font-medium leading-relaxed break-words min-w-0 ${
                        isSelected
                          ? 'text-indigo-950 dark:text-white font-semibold'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {option}
                    </span>
                  </div>

                  <div className="shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500'
                          : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Navigator Numbers (1 to 10): >=44px touch targets on mobile */}
          <div className="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Question Palette</span>
              <span className="hidden sm:inline">Click any number to jump</span>
            </div>
            {/* Grid on mobile (5 cols x 2 rows), flex on larger screens */}
            <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      playSelectSound(category.audience === 'children');
                      setCurrentIndex(idx);
                    }}
                    className={`min-h-[44px] min-w-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 ring-offset-2 dark:ring-offset-slate-800 bg-indigo-700 dark:bg-indigo-600 text-white shadow-sm'
                        : isAnswered
                        ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-200 dark:hover:bg-indigo-900'
                        : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                    aria-label={`Jump to Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls: Previous, Next, Submit - minimum 44px tall buttons */}
          <div className="pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                playSelectSound(category.audience === 'children');
                setCurrentIndex((i) => Math.max(0, i - 1));
              }}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                currentIndex === 0
                  ? 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50'
                  : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95'
              }`}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Previous</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2.5">
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound(category.audience === 'children');
                    setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-all shadow-sm active:scale-95"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestSubmit}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 min-h-[44px] text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-200 dark:shadow-none hover:shadow-lg transition-all active:scale-95"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>Submit Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal when unanswered questions remain */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-750 text-center space-y-4 sm:space-y-5 transition-colors duration-200">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Unanswered Questions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                You currently have{' '}
                <strong className="text-amber-700 dark:text-amber-400 font-bold">
                  {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}
                </strong>
                . Are you sure you want to finish and submit the quiz now?
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={jumpToFirstUnanswered}
                className="w-full py-3 min-h-[44px] px-4 text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-xl transition-colors flex items-center justify-center"
              >
                Review Unanswered Questions
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleSubmit();
                }}
                className="w-full py-3 min-h-[44px] px-4 text-xs sm:text-sm font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-xl transition-colors flex items-center justify-center"
              >
                Submit Quiz Anyway
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="min-h-[40px] text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center"
              >
                Cancel and return to question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Quitting early */}
      {showQuitModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-750 text-center space-y-4 sm:space-y-5 transition-colors duration-200">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
              <Flag className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Quit This Quiz?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your current session progress will be lost. Would you like to quit back to category selection or continue playing?
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setShowQuitModal(false)}
                className="w-full py-3 min-h-[44px] px-4 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm flex items-center justify-center"
              >
                Continue Playing
              </button>

              <button
                type="button"
                onClick={onQuitQuiz}
                className="w-full py-3 min-h-[44px] px-4 text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center justify-center"
              >
                Yes, Quit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
