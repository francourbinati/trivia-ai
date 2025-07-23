'use client';

import { useState } from 'react';
import type { Trivia } from '@/types';
import { generateTriviaAction } from '@/app/actions';
import { SubjectForm } from '@/components/subject-form';
import { TriviaQuiz } from '@/components/trivia-quiz';
import { QuizResults } from '@/components/quiz-results';
import { BrainCircuitIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

type GameState = 'idle' | 'loading' | 'playing' | 'results' | 'error';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [triviaData, setTriviaData] = useState<Trivia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const handleStartTrivia = async (subject: string) => {
    setGameState('loading');
    setError(null);
    const result = await generateTriviaAction(subject);
    if (result.success) {
      setTriviaData(result.data.trivia);
      setScore(0);
      setGameState('playing');
    } else {
      setError(result.error);
      setGameState('error');
    }
  };

  const handleQuizFinish = (finalScore: number) => {
    setScore(finalScore);
    setGameState('results');
  };

  const handlePlayAgain = () => {
    setGameState('idle');
    setTriviaData([]);
    setScore(0);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'idle':
        return <SubjectForm onStartTrivia={handleStartTrivia} isLoading={false} />;
      case 'loading':
        return (
          <div className="w-full max-w-md text-center">
            <h2 className="font-headline text-2xl mb-4 text-primary">Generating your trivia...</h2>
            <Skeleton className="w-full h-10 mb-4" />
            <Skeleton className="w-full h-12" />
          </div>
        );
      case 'playing':
        return <TriviaQuiz triviaData={triviaData} onQuizFinish={handleQuizFinish} />;
      case 'results':
        return <QuizResults score={score} totalQuestions={triviaData.length} onPlayAgain={handlePlayAgain} />;
      case 'error':
        return (
          <div className="text-center animation-fade-in">
            <h2 className="font-headline text-2xl text-destructive mb-4">An Error Occurred</h2>
            <p className="mb-6">{error || 'Something went wrong. Please try again.'}</p>
            <SubjectForm onStartTrivia={handleStartTrivia} isLoading={false} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4 mb-2">
          <BrainCircuitIcon className="w-12 h-12 text-primary" />
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
            Trivia Turbine
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">Your personal AI-powered trivia generator.</p>
      </div>
      <div className="w-full max-w-2xl">
        {renderGameState()}
      </div>
    </main>
  );
}
