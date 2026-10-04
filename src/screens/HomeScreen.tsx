import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  Globe2,
  Atom,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Zap,
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

interface HomeScreenProps {
  onNavigate: (screen: ScreenState) => void;
  onSelectCategory: (categoryId: CategoryKey) => void;
  bestScores: Record<CategoryKey, number>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectCategory,
  bestScores,
}) => {
  const [activeTab, setActiveTab] = useState<AudienceType>('general');
  const [cardTilt, setCardTilt] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const howItWorksRef = useRef<HTMLElement>(null);
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHowItWorksVisible(true);
          observer.disconnect(); // run it only once
        }
      },
      { threshold: 0.15 }
    );

    if (howItWorksRef.current) {
      observer.observe(howItWorksRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Maximum 8 degrees tilt on both axes
    const rotateX = -((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setCardTilt({
      x: Math.max(-8, Math.min(8, rotateX)),
      y: Math.max(-8, Math.min(8, rotateY)),
      active: true,
    });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0, active: false });
  };

  const displayedCategories = getCategoriesByAudience(activeTab);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Globe2':
        return <Globe2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'PawPrint':
        return <PawPrint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Shapes':
        return <Shapes className="w-5 h-5 text-pink-600 dark:text-pink-400" />;
      case 'Hash':
        return <Hash className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Apple':
        return <Apple className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'SpellCheck':
        return <SpellCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div className="w-full overflow-x-hidden transition-colors duration-200">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-20 bg-gradient-to-b from-indigo-50/70 via-slate-50 to-white dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200">
        {/* Soft background floating orbs (behind content, never block clicks) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
          {/* Purple Orb 1 */}
          <div className="absolute -top-16 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl animate-float-orb-1" />
          {/* Indigo Orb 2 */}
          <div className="absolute top-28 -right-12 sm:right-10 w-80 sm:w-[28rem] h-80 sm:h-[28rem] bg-indigo-400/20 dark:bg-indigo-600/15 rounded-full blur-3xl animate-float-orb-2" />
          {/* Blue Orb 3 */}
          <div className="absolute -bottom-10 left-6 sm:left-20 w-64 sm:w-80 h-64 sm:h-80 bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-3xl animate-float-orb-3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content (Centered on mobile & tablet, left-aligned on desktop) */}
            <div className="w-full lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left max-w-2xl mx-auto lg:max-w-none lg:mx-0">
              {/* Animated Hero Badge */}
              <div className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/85 dark:bg-indigo-950/75 border border-indigo-200/70 dark:border-indigo-800 text-xs font-semibold text-indigo-900 dark:text-indigo-200 tracking-wide max-w-full overflow-hidden text-left sm:text-center sm:hover:scale-[1.03] transition-transform duration-300 ease-out animate-badge-entrance select-none cursor-default">
                {/* Soft breathing purple border glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-indigo-400/50 dark:border-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.22)] dark:shadow-[0_0_15px_rgba(129,140,248,0.28)] animate-badge-glow group-hover:opacity-100 group-hover:shadow-[0_0_18px_rgba(99,102,241,0.4)] dark:group-hover:shadow-[0_0_22px_rgba(129,140,248,0.5)] transition-all duration-300 pointer-events-none"
                />

                {/* Shimmer sweep streak (Desktop only: hidden on mobile, every 5s loop, soft diagonal luminescence) */}
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden rounded-full"
                >
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500/25 dark:via-purple-300/30 to-transparent animate-badge-shimmer" />
                </div>

                {/* Sparkle icon: rotates ~8s per turn and gently pulses scale 1 -> 1.15 */}
                <div className="relative z-10 shrink-0 flex items-center justify-center animate-sparkle-spin-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                </div>

                {/* Fully readable text without truncation, gracefully wraps on small mobile screens */}
                <span className="relative z-10 leading-snug">
                  Quizify · Test Your Knowledge. Track Your Progress.
                </span>
              </div>

              {/* Staggered Heading Lines */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.18]"
                style={{ textWrap: 'balance' }}
              >
                <span className="block animate-fade-in-up-1">
                  Challenge Your Mind,
                </span>
                <span className="block mt-1 sm:mt-1.5 animate-fade-in-up-2 bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent animate-shimmer-gradient">
                  One Quiz at a Time.
                </span>
              </h1>

              {/* Delayed Fade Paragraph */}
              <p className="animate-fade-in-up-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Explore exciting quizzes for curious learners of all ages. From high-school & adult General Knowledge to playful, emoji-rich challenges for Children (ages 5-10). Test yourself and track your high scores!
              </p>

              {/* Action Buttons: Delayed Fade, Lift & Glow */}
              <div className="animate-fade-in-up-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('categories-section') || document.getElementById('categories-preview');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onNavigate('categories');
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[44px] text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-300 dark:shadow-none hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 active:scale-[0.98] cursor-pointer group"
                >
                  <span>Start Your Quiz</span>
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('categories-section') || document.getElementById('categories-preview');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onNavigate('categories');
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  <span>Explore Categories</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="animate-fade-in-up-4 pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% Free · No Sign Up Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span>12 Categories · 120 Questions</span>
                </div>
              </div>
            </div>

            {/* Right Visual Showcase (Interactive Quiz Preview Card with 3D Tilt & Gentle Float) - Visible only on laptop/desktop (>= 1024px) */}
            <div className="hidden lg:flex w-full lg:col-span-5 justify-center mt-0">
              <div className="animate-gentle-float relative w-full max-w-sm sm:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/25 to-purple-500/25 dark:from-indigo-500/15 dark:to-purple-500/15 rounded-3xl blur-2xl transform -rotate-1 pointer-events-none" />

                <div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  style={{
                    transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                    transition: cardTilt.active
                      ? 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)'
                      : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                  className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-xl p-4 sm:p-6 space-y-3.5 sm:space-y-4 transition-colors duration-200 cursor-default"
                >
                  {/* Top card bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                        Science Quiz · General
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800 shrink-0">
                      <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span>04:35</span>
                    </div>
                  </div>

                  {/* Progress bar mock */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1">
                      <span>Question 2 of 10</span>
                      <span>20% Completed</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full w-[20%] rounded-full" />
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="pt-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      Which cellular organelle is famously known as the "powerhouse of the cell"?
                    </p>
                  </div>

                  {/* Options Mock */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50">
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300 shrink-0">
                        A
                      </span>
                      <span>Ribosome</span>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50">
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300 shrink-0">
                        B
                      </span>
                      <span>Golgi apparatus</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 text-xs font-medium text-indigo-900 dark:text-indigo-200 shadow-sm">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          C
                        </span>
                        <span>Mitochondria</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50">
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300 shrink-0">
                        D
                      </span>
                      <span>Endoplasmic reticulum</span>
                    </div>
                  </div>

                  {/* Bottom mock trigger */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400 dark:text-slate-500 font-medium truncate">Selected: Option C</span>
                    <button
                      type="button"
                      onClick={() => onSelectCategory('science')}
                      className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline min-h-[36px]"
                    >
                      <span>Take this quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= AVAILABLE QUIZ CATEGORIES SECTION WITH TWO-TAB SWITCHER ================= */}
      <section
        id="categories-section"
        className="scroll-mt-20 sm:scroll-mt-24 py-10 sm:py-14 lg:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div id="categories-preview" className="scroll-mt-20 sm:scroll-mt-24" />
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2.5 sm:space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Broaden Your Mind
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Available Quiz Categories
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300">
            Select an audience below to switch between academic General subjects and child-friendly quizzes!
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
                <span>General (6 Quizzes)</span>
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

        {/* Tab Context Banner */}
        <div className="mb-6 text-center">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {activeTab === 'general' ? (
              <span>Showing 6 General categories · 10 Questions each · <strong>5-minute timer</strong></span>
            ) : (
              <span>Showing 6 Children categories · Friendly emojis · <strong>7-minute timer</strong> for relaxed fun</span>
            )}
          </span>
        </div>

        {/* Responsive Grid: 1 column on mobile (<768px), 2 on tablet (768-1023px), 3 on desktop (>=1024px) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayedCategories.map((cat) => {
            const best = bestScores[cat.id] || 0;
            const timeLabel = cat.audience === 'children' ? '7 Minutes' : '5 Minutes';

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.themeColor}`} />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl ${cat.accentBg} dark:bg-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    {best > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <Award className="w-3 h-3" />
                        <span>Best: {best}/10</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        10 Questions · {timeLabel}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {cat.audience === 'children' ? 'Children Quiz' : 'General Quiz'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {cat.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {timeLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all min-h-[44px] px-2"
                  >
                    <span>Start Quiz</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= HOW IT WORKS (1 col on mobile, 3 on tablet/desktop) ================= */}
      <section
        ref={howItWorksRef}
        id="how-it-works"
        className="scroll-mt-20 sm:scroll-mt-24 py-14 sm:py-20 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-200 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5 sm:space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple 3-Step Flow
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How Quizify Works
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300">
              Designed for effortless focus, deep learning, and continuous self-improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 relative">
            {/* Connecting Dashed Line (Desktop Only): Draws left-to-right on scroll reveal */}
            <div className="hidden md:block absolute top-[44px] left-[16%] right-[16%] h-0.5 pointer-events-none z-0">
              <svg className="w-full h-2 overflow-visible" viewBox="0 0 1000 2" fill="none" preserveAspectRatio="none">
                <line
                  x1="0"
                  y1="1"
                  x2="1000"
                  y2="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  pathLength="100"
                  style={{
                    strokeDashoffset: howItWorksVisible ? 0 : 100,
                    transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="text-indigo-300 dark:text-indigo-600/70"
                />
              </svg>
            </div>

            {/* Step 1 */}
            <div
              style={{ transitionDelay: '0ms' }}
              className={`group relative z-10 bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300 ease-out ${
                howItWorksVisible
                  ? 'opacity-100 translate-y-0 duration-[600ms]'
                  : 'opacity-0 translate-y-6 duration-0 pointer-events-none'
              }`}
            >
              <div className="relative w-10 h-10 mb-4 shrink-0">
                {/* Soft glowing ring behind badge that gently pulses in a loop */}
                <div className="absolute inset-0 -m-1 rounded-2xl bg-indigo-500/25 dark:bg-indigo-400/20 blur-sm animate-pulse-ring pointer-events-none" />
                <div className="relative w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-base flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out shadow-sm">
                  01
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                Choose Audience & Subject
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Toggle between General and Children categories. Select from Science, History, Animals, Space, Math, and more!
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{ transitionDelay: '150ms' }}
              className={`group relative z-10 bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/15 dark:hover:shadow-purple-500/20 hover:-translate-y-2 transition-all duration-300 ease-out ${
                howItWorksVisible
                  ? 'opacity-100 translate-y-0 duration-[600ms]'
                  : 'opacity-0 translate-y-6 duration-0 pointer-events-none'
              }`}
            >
              <div className="relative w-10 h-10 mb-4 shrink-0">
                <div className="absolute inset-0 -m-1 rounded-2xl bg-purple-500/25 dark:bg-purple-400/20 blur-sm animate-pulse-ring pointer-events-none" />
                <div className="relative w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-base flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out shadow-sm">
                  02
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                Answer 10 Questions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Tackle 10 randomized multiple-choice questions with a countdown timer (5 min for General, 7 min for Children). Jump back and forth anytime!
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{ transitionDelay: '300ms' }}
              className={`group relative z-10 bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/20 hover:-translate-y-2 transition-all duration-300 ease-out ${
                howItWorksVisible
                  ? 'opacity-100 translate-y-0 duration-[600ms]'
                  : 'opacity-0 translate-y-6 duration-0 pointer-events-none'
              }`}
            >
              <div className="relative w-10 h-10 mb-4 shrink-0">
                <div className="absolute inset-0 -m-1 rounded-2xl bg-emerald-500/25 dark:bg-emerald-400/20 blur-sm animate-pulse-ring pointer-events-none" />
                <div className="relative w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-base flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out shadow-sm">
                  03
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                View Your Results
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Receive an immediate score report with a circular visual indicator, review correct vs. incorrect choices, and read comprehensive explanations.
              </p>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-10 sm:mt-14 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl text-center max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2.5 sm:mb-3">
              Ready to test what you know?
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto mb-5 sm:mb-6">
              Start your first quiz in seconds. No login, no setup, just pure knowledge testing for everyone.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('categories')}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-7 py-3 text-xs sm:text-sm font-bold text-indigo-950 bg-white hover:bg-indigo-50 rounded-xl shadow-md transition-all active:scale-95"
            >
              <span>Explore All 12 Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
