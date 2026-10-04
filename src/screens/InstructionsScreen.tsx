import React from 'react';
import {
  ArrowLeft,
  Play,
  Clock,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';
import { CategoryInfo, ScreenState } from '../types/quiz';

interface InstructionsScreenProps {
  category: CategoryInfo;
  bestScore: number;
  onNavigate: (screen: ScreenState) => void;
  onStartQuiz: () => void;
}

export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({
  category,
  bestScore,
  onNavigate,
  onStartQuiz,
}) => {
  return (
    <div className="py-6 sm:py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top back navigation */}
      <div className="mb-4 sm:mb-6">
        <button
          type="button"
          onClick={() => onNavigate('categories')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-3.5 py-2 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Categories</span>
        </button>
      </div>

      {/* Main Instruction Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors duration-200">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-white p-5 sm:p-8 md:p-10 relative">
          <div className="max-w-2xl space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{category.audience === 'children' ? '👶 Children Quiz Briefing (Ages 5-10)' : '🎓 General Quiz Briefing'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
              {category.longDesc}
            </p>
          </div>

          {bestScore > 0 && (
            <div className="mt-4 sm:absolute sm:top-8 sm:right-8 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>Your Personal Best: {bestScore}/10</span>
            </div>
          )}
        </div>

        {/* Requirements & Rules Grid */}
        <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-3.5 sm:mb-4">
              Quiz Specifications & Rules
            </h2>

            {/* Responsive Grid: 1 column on mobile (<768px), 2 on tablet (768-1023px), 3 on desktop (>=1024px) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Item 1: Total questions */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/90 dark:border-slate-700 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Total Questions</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">10 multiple choice questions</div>
                </div>
              </div>

              {/* Item 2: Time limit */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/90 dark:border-slate-700 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Time Limit</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                    {category.timeLimitSeconds === 420 ? '7 minutes (420 seconds)' : '5 minutes (300 seconds)'}
                  </div>
                </div>
              </div>

              {/* Item 3: Options per question */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/90 dark:border-slate-700 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">4 Options per Question</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">A, B, C, and D choices</div>
                </div>
              </div>

              {/* Item 4: Only one correct answer */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/90 dark:border-slate-700 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Only One Correct Answer</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">Single best choice per item</div>
                </div>
              </div>

              {/* Item 5: Point allocation */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/90 dark:border-slate-700 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">1 Point per Correct Answer</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">Maximum score is 10 points</div>
                </div>
              </div>

              {/* Item 6: No negative marking */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/90 dark:border-slate-700 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">No Negative Marking</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">Incorrect choices deduct 0 pts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Advice & Navigation Features */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl p-4 sm:p-5 border border-indigo-100 dark:border-indigo-900/60 space-y-2.5 sm:space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Important Tips for This Session</span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 sm:space-y-2 list-disc list-inside">
              <li>
                <strong className="text-slate-800 dark:text-slate-100">Move freely:</strong> You can jump forward and backward between questions at any time. Your selected choices remain saved.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-100">Automatic submission:</strong> If your timer runs out, the quiz automatically submits your recorded answers.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-100">In-depth review:</strong> After submission, you will see your total score, percentage, and detailed answer explanations.
              </li>
            </ul>
          </div>

          {/* Action CTAs: buttons >= 44px tall */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => onNavigate('categories')}
              className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors order-2 sm:order-1 flex items-center justify-center"
            >
              Back to Categories
            </button>

            <button
              type="button"
              onClick={onStartQuiz}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3 min-h-[44px] text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-300 dark:shadow-none hover:shadow-lg transition-all active:scale-[0.98] order-1 sm:order-2"
            >
              <Play className="w-4 h-4 fill-white shrink-0" />
              <span>Start Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
