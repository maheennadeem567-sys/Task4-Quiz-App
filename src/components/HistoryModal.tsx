import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  RotateCcw,
  Users,
  Baby,
  AlertTriangle,
} from 'lucide-react';
import {
  getQuizHistory,
  getBestScores,
  clearQuizHistoryByAudience,
  resetCategoryAttemptAndScore,
  CHILDREN_CATEGORIES,
} from '../utils/storage';
import { getCategoriesByAudience } from '../data/questions';
import { CategoryKey, AudienceType, QuizAttempt } from '../types/quiz';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: CategoryKey) => void;
  onUpdateBestScores?: (scores: Record<CategoryKey, number>) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory: _onSelectCategory,
  onUpdateBestScores,
}) => {
  const [modalAudience, setModalAudience] = useState<AudienceType>('general');
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [bestScoresState, setBestScoresState] = useState<Record<CategoryKey, number>>(() =>
    getBestScores()
  );
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);

  // Sync state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setHistory(getQuizHistory());
      setBestScoresState(getBestScores());
      setShowResetAllConfirm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = getCategoriesByAudience(modalAudience);

  // Filter attempts strictly by audience
  const filteredHistory = history.filter((item) => {
    const itemAudience =
      item.audience || (CHILDREN_CATEGORIES.includes(item.categoryId) ? 'children' : 'general');
    return itemAudience === modalAudience;
  });

  const hasAudienceData =
    filteredHistory.length > 0 ||
    categories.some((c) => (bestScoresState[c.id] || 0) > 0);

  // Reset All confirmed for current tab
  const handleConfirmResetAll = () => {
    const result = clearQuizHistoryByAudience(modalAudience);
    setHistory(result.history);
    setBestScoresState(result.bestScores);
    if (onUpdateBestScores) {
      onUpdateBestScores(result.bestScores);
    }
    setShowResetAllConfirm(false);
  };

  // Per-attempt reset: remove only that category's saved attempt and best score for that audience
  const handleResetSingleCategory = (categoryId: CategoryKey, audience: AudienceType) => {
    const result = resetCategoryAttemptAndScore(categoryId, audience);
    setHistory(result.history);
    setBestScoresState(result.bestScores);
    if (onUpdateBestScores) {
      onUpdateBestScores(result.bestScores);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                Your Quiz Progress
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                Scores tracked separately by audience
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audience Tab Switcher inside Modal */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/50 flex justify-center">
          <div className="w-full sm:w-auto p-1 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center gap-1 border border-slate-300/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setModalAudience('general');
                setShowResetAllConfirm(false);
              }}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[38px] text-xs font-bold rounded-lg transition-all cursor-pointer ${
                modalAudience === 'general'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>General Quizzes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setModalAudience('children');
                setShowResetAllConfirm(false);
              }}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[38px] text-xs font-bold rounded-lg transition-all cursor-pointer ${
                modalAudience === 'children'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Baby className="w-3.5 h-3.5" />
              <span>Children Quizzes</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          {/* Best Scores Grid: 6 categories for active audience */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              {modalAudience === 'general'
                ? 'General Best Scores (out of 10)'
                : 'Children Best Scores (out of 10)'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {categories.map((cat) => {
                const score = bestScoresState[cat.id] || 0;
                return (
                  <div
                    key={cat.id}
                    className="p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors text-center"
                  >
                    <div
                      className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate mb-1"
                      title={cat.name}
                    >
                      {cat.name}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
                      {score}
                      <span className="text-[10px] sm:text-xs font-normal text-slate-400 dark:text-slate-500">
                        /10
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* History List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {modalAudience === 'general' ? 'General Attempts' : 'Children Attempts'} (
                {filteredHistory.length})
              </h4>
              {hasAudienceData && (
                <button
                  type="button"
                  onClick={() => setShowResetAllConfirm(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold hover:underline min-h-[36px] px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title={`Delete all ${modalAudience === 'general' ? 'General' : 'Children'} attempts`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 sm:py-10 px-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  No attempts yet
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pick any category and start your 10-question challenge!
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-2.5 max-h-60 sm:max-h-64 overflow-y-auto pr-1">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {item.categoryName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                          {item.audience === 'children' ? '👶 Children' : '🎓 General'}
                        </span>
                        <span
                          className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            item.percentage >= 80
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : item.percentage >= 50
                              ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>{item.date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>
                            {Math.floor(item.timeSpentSeconds / 60)}m {item.timeSpentSeconds % 60}s
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                          {item.score} / {item.totalQuestions}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                          correct
                        </div>
                      </div>
                      {/* Per-attempt reset icon button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetSingleCategory(item.categoryId, item.audience);
                        }}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer z-10"
                        title={`Reset ${item.categoryName} attempt and score`}
                        aria-label={`Reset ${item.categoryName} attempt and score`}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer: min-h-[44px] close button */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* In-Modal Confirmation Dialog for Reset All */}
        {showResetAllConfirm && (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4
                  id="confirm-delete-title"
                  className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug"
                >
                  Delete all {modalAudience === 'general' ? 'General' : 'Children'} attempts?
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                  This cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetAllConfirm(false)}
                  className="flex-1 py-2.5 px-4 min-h-[44px] text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetAll}
                  className="flex-1 py-2.5 px-4 min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
