import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { CategoryKey, ScreenState } from '../types/quiz';
import { CATEGORIES } from '../data/questions';

interface FooterProps {
  onNavigate: (screen: ScreenState) => void;
  onSelectCategory: (catId: CategoryKey) => void;
  onOpenHistory: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectCategory,
  onOpenHistory,
}) => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800 transition-colors duration-200 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Quizify
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              "Test Your Knowledge. Track Your Progress."
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A high-precision online quiz platform crafted for curious minds, students, and lifelong learners.
              Test concepts, learn through rich explanations, and improve across 12 comprehensive disciplines with 120 verified questions.
            </p>
          </div>

          {/* Categories Quick Jump: Grouped into General & Children */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <span>General Quizzes (6)</span>
              </h4>
              <ul className="space-y-1 text-xs">
                {CATEGORIES.filter((c) => c.audience === 'general').map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        onSelectCategory(cat.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors text-left py-0.5 inline-flex items-center"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <span>Children Quizzes (6)</span>
              </h4>
              <ul className="space-y-1 text-xs">
                {CATEGORIES.filter((c) => c.audience === 'children').map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        onSelectCategory(cat.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors text-left py-0.5 inline-flex items-center"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors py-1 inline-flex items-center"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('categories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors py-1 inline-flex items-center"
                >
                  Explore Categories
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenHistory}
                  className="hover:text-white transition-colors py-1 inline-flex items-center"
                >
                  View Attempt History
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Quizify. All rights reserved. Designed for active learning.</p>
          <div className="flex items-center gap-1">
            <span>Built with focus, clarity, and precision</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
          </div>
        </div>
      </div>
    </footer>
  );
};
