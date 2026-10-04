import React, { useState } from 'react';
import {
  Globe2,
  Atom,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  Landmark,
  Calculator,
  Palette,
  PawPrint,
  Shapes,
  Hash,
  Apple,
  SpellCheck,
  Rocket,
  Users,
  Baby,
} from 'lucide-react';
import { getCategoriesByAudience } from '../data/questions';
import { CategoryKey, ScreenState, AudienceType } from '../types/quiz';

interface CategoryScreenProps {
  onNavigate: (screen: ScreenState) => void;
  onSelectCategory: (catId: CategoryKey) => void;
  bestScores: Record<CategoryKey, number>;
  initialAudience?: AudienceType;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  onNavigate,
  onSelectCategory,
  bestScores,
  initialAudience = 'general',
}) => {
  const [activeTab, setActiveTab] = useState<AudienceType>(initialAudience);

  const displayedCategories = getCategoriesByAudience(activeTab);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'Landmark':
        return <Landmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'Globe2':
        return <Globe2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'PawPrint':
        return <PawPrint className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Shapes':
        return <Shapes className="w-6 h-6 text-pink-600 dark:text-pink-400" />;
      case 'Hash':
        return <Hash className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'Apple':
        return <Apple className="w-6 h-6 text-red-600 dark:text-red-400" />;
      case 'SpellCheck':
        return <SpellCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'Rocket':
        return <Rocket className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div className="py-8 sm:py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top Navigation / Breadcrumb */}
      <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-3.5 py-2 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Home</span>
        </button>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
          12 Categories Available · 10 Questions Each
        </div>
      </div>

      {/* Screen Heading */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Category Selection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Select Your Quiz Arena
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300">
          Switch tabs below between General academic subjects and playful Children’s challenges!
        </p>

        {/* TWO-TAB SWITCHER: "General" and "Children" */}
        <div className="pt-4 flex justify-center">
          <div className="w-full sm:w-auto p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl flex items-center gap-1.5 border border-slate-300/70 dark:border-slate-700 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'general'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-md shadow-indigo-300 dark:shadow-none'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>General (6 Categories)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('children')}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'children'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-md shadow-indigo-300 dark:shadow-none'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Baby className="w-4 h-4" />
              <span>Children (Ages 5-10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Grid: 1 column on mobile (<768px), 2 on tablet (768-1023px), 3 on desktop (>=1024px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {displayedCategories.map((cat, idx) => {
          const best = bestScores[cat.id] || 0;
          const timeLabel = cat.audience === 'children' ? '7 Minutes' : '5 Minutes';

          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.themeColor}`} />

              <div className="space-y-4">
                {/* Header inside card */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-xl ${cat.accentBg} dark:bg-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0`}>
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  {best > 0 ? (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                      <Award className="w-3.5 h-3.5" />
                      <span>Best: {best}/10</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      Not attempted yet
                    </div>
                  )}
                </div>

                {/* Title & Descriptions */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {cat.audience === 'children' ? 'Children Quiz' : 'General Quiz'} · {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {cat.shortDesc}
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{cat.questionCount} Questions</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{timeLabel}</span>
                  </span>
                </div>
              </div>

              {/* Action Button: min-h-[44px] */}
              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 min-h-[44px] px-4 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
                >
                  <span>Start Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
