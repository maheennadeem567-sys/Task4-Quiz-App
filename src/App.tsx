/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenState, CategoryKey, Question, QuizAttempt, AudienceType } from './types/quiz';
import { getCategoryById, getQuestionsByCategory, shuffleQuestions } from './data/questions';
import {
  getBestScores,
  saveQuizAttempt,
  getSoundPreference,
  setSoundPreference,
  getThemePreference,
  setThemePreference,
  Theme,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HistoryModal } from './components/HistoryModal';
import { HomeScreen } from './screens/HomeScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { InstructionsScreen } from './screens/InstructionsScreen';
import { QuizPlayingScreen } from './screens/QuizPlayingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ReviewScreen } from './screens/ReviewScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryKey>('science');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [bestScores, setBestScores] = useState<Record<CategoryKey, number>>(getBestScores());
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => getSoundPreference());
  const [theme, setThemeState] = useState<Theme>('light');
  const [activeAudience, setActiveAudience] = useState<AudienceType>('general');

  // Load initial local storage data & theme configuration
  useEffect(() => {
    setBestScores(getBestScores());
    setSoundEnabledState(getSoundPreference());

    const savedTheme = getThemePreference();
    setThemeState(savedTheme);
    setThemePreference(savedTheme);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    setSoundPreference(next);
  };

  const handleToggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    setThemePreference(nextTheme);
  };

  // Select category and view instructions
  const handleSelectCategory = (categoryId: CategoryKey) => {
    const info = getCategoryById(categoryId);
    setSelectedCategoryId(categoryId);
    setActiveAudience(info.audience);
    setCurrentScreen('instructions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch a new randomized quiz session
  const handleStartQuiz = () => {
    const questions = getQuestionsByCategory(selectedCategoryId);
    const randomized = shuffleQuestions(questions);
    setActiveQuestions(randomized);
    setCurrentScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Complete and grade quiz
  const handleCompleteQuiz = (
    userAnswers: Record<number, number | null>,
    timeSpentSeconds: number
  ) => {
    const categoryInfo = getCategoryById(selectedCategoryId);
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    activeQuestions.forEach((q) => {
      const userPick = userAnswers[q.id];
      if (userPick === undefined || userPick === null) {
        unansweredCount++;
      } else if (userPick === q.correctIndex) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const totalQuestions = activeQuestions.length;
    // Calculate percentage accurately using: (correct answers / total questions) * 100
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    const previousBest = bestScores[selectedCategoryId] || 0;
    const isBest = correctCount > previousBest;

    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      categoryId: selectedCategoryId,
      audience: categoryInfo.audience,
      categoryName: categoryInfo.name,
      score: correctCount,
      totalQuestions,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeSpentSeconds,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      questions: activeQuestions,
      userAnswers,
    };

    // Save to LocalStorage
    saveQuizAttempt(attempt);

    // Update state
    setLatestAttempt(attempt);
    setIsNewBest(isBest);
    setBestScores(getBestScores());
    setCurrentScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake current category quiz
  const handleRetakeQuiz = () => {
    handleStartQuiz();
  };

  // Review answers
  const handleReview = () => {
    setCurrentScreen('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation router
  const handleNavigate = (screen: ScreenState) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentCategoryInfo = getCategoryById(selectedCategoryId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-950 selection:text-indigo-900 dark:selection:text-indigo-200 font-sans transition-colors duration-200 w-full overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenHistory={() => setIsHistoryOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Screen Router */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onSelectCategory={handleSelectCategory}
            bestScores={bestScores}
          />
        )}

        {currentScreen === 'categories' && (
          <CategoryScreen
            onNavigate={handleNavigate}
            onSelectCategory={handleSelectCategory}
            bestScores={bestScores}
            initialAudience={activeAudience}
          />
        )}

        {currentScreen === 'instructions' && (
          <InstructionsScreen
            category={currentCategoryInfo}
            bestScore={bestScores[selectedCategoryId] || 0}
            onNavigate={handleNavigate}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizPlayingScreen
            category={currentCategoryInfo}
            questions={activeQuestions}
            onCompleteQuiz={handleCompleteQuiz}
            onQuitQuiz={() => handleNavigate('categories')}
          />
        )}

        {currentScreen === 'result' && latestAttempt && (
          <ResultScreen
            attempt={latestAttempt}
            isNewBest={isNewBest}
            onNavigate={handleNavigate}
            onRetake={handleRetakeQuiz}
            onReview={handleReview}
          />
        )}

        {currentScreen === 'review' && latestAttempt && (
          <ReviewScreen
            attempt={latestAttempt}
            onNavigate={handleNavigate}
            onRetake={handleRetakeQuiz}
          />
        )}
      </main>

      {/* Modal for Past History & Best Scores */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setBestScores(getBestScores());
        }}
        onSelectCategory={handleSelectCategory}
        onUpdateBestScores={(updated) => setBestScores(updated)}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />
    </div>
  );
}
