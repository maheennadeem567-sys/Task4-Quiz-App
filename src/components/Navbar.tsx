import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, History, Volume2, VolumeX, Menu, X, Play, Sun, Moon } from 'lucide-react';
import { ScreenState } from '../types/quiz';
import { Theme } from '../utils/storage';

interface NavbarProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenHistory,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on Escape key or click outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleNav = (screen: ScreenState) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  const scrollToHome = () => {
    setMobileMenuOpen(false);
    if (currentScreen !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToCategories = () => {
    setMobileMenuOpen(false);
    if (currentScreen !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el =
          document.getElementById('categories-section') ||
          document.getElementById('categories-preview');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el =
        document.getElementById('categories-section') ||
        document.getElementById('categories-preview');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToHowItWorks = () => {
    setMobileMenuOpen(false);
    if (currentScreen !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPastScores = () => {
    setMobileMenuOpen(false);
    onOpenHistory();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={scrollToHome}
            className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 min-h-[44px] cursor-pointer"
            aria-label="Quizify Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Quizify
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop: >= 768px) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={scrollToHome}
              className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 py-1 min-h-[44px] flex items-center cursor-pointer ${
                currentScreen === 'home'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={scrollToCategories}
              className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 py-1 min-h-[44px] flex items-center cursor-pointer ${
                currentScreen === 'categories' || currentScreen === 'instructions'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : ''
              }`}
            >
              Categories
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 py-1 min-h-[44px] flex items-center cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={handleOpenPastScores}
              className="flex items-center gap-1.5 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 py-1 min-h-[44px] cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Past Scores</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Dark Mode active · Switch to Light Mode' : 'Light Mode active · Switch to Dark Mode'}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 relative group cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Moon className="w-4.5 h-4.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-amber-500 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Sound Toggle Button */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Sound on' : 'Sound off'}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
              aria-label={soundEnabled ? 'Sound on' : 'Sound off'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              )}
            </button>

            {/* Start Quiz Primary Button (Visible on sm & larger) */}
            <button
              type="button"
              onClick={scrollToCategories}
              className="hidden sm:inline-flex items-center gap-2 px-4 min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-sm shadow-indigo-300 dark:shadow-none hover:shadow transition-all duration-200 active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Quiz</span>
            </button>

            {/* Mobile hamburger menu toggle (Visible on mobile: < 768px) */}
            <button
              ref={toggleButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown Panel (Covers all nav links, smooth animation) */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            id="mobile-navigation-menu"
            className="md:hidden relative z-40 border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md px-4 py-4 space-y-2 shadow-2xl overflow-x-hidden animate-fadeIn"
          >
            {/* Prominent CTA on Mobile */}
            <button
              type="button"
              onClick={scrollToCategories}
              className="w-full flex items-center justify-center gap-2 min-h-[46px] px-4 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md transition-all active:scale-[0.98] mb-3 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Quiz</span>
            </button>

            {/* Home link */}
            <button
              type="button"
              onClick={scrollToHome}
              className={`w-full text-left px-3.5 min-h-[44px] flex items-center text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                currentScreen === 'home'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            {/* Categories link */}
            <button
              type="button"
              onClick={scrollToCategories}
              className={`w-full text-left px-3.5 min-h-[44px] flex items-center text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                currentScreen === 'categories' || currentScreen === 'instructions'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Categories
            </button>

            {/* How It Works link */}
            <button
              type="button"
              onClick={scrollToHowItWorks}
              className="w-full text-left px-3.5 min-h-[44px] flex items-center text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              How It Works
            </button>

            {/* Past Scores link */}
            <button
              type="button"
              onClick={handleOpenPastScores}
              className="w-full text-left px-3.5 min-h-[44px] flex items-center text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors gap-2.5 cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Past Scores</span>
            </button>

            {/* Audio and Theme Controls */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Audio Effects</span>
                <button
                  type="button"
                  onClick={onToggleSound}
                  className="inline-flex items-center gap-2 px-3 min-h-[44px] text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title={soundEnabled ? 'Sound on' : 'Sound off'}
                  aria-label={soundEnabled ? 'Sound on' : 'Sound off'}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Sound on</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>Sound off</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Theme</span>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="inline-flex items-center gap-2 px-3 min-h-[44px] text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Light Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile backdrop for outside click & dimming */}
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 top-16 bg-slate-900/35 dark:bg-black/55 backdrop-blur-xs z-30 transition-opacity animate-fadeIn cursor-pointer"
        />
      )}
    </>
  );
};
