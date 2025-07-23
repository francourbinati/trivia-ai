'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, RefreshCw } from 'lucide-react';

type QuizResultsProps = {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
};

export function QuizResults({ score, totalQuestions, onPlayAgain }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getFeedback = () => {
    if (percentage === 100) return "Perfect Score! You're a true expert!";
    if (percentage >= 80) return "Excellent work! You know your stuff.";
    if (percentage >= 50) return "Good job! A solid performance.";
    if (percentage >= 20) return "Not bad! Every quiz is a learning opportunity.";
    return "That was tough! Keep trying and you'll improve.";
  };

  return (
    <Card className="w-full max-w-md mx-auto text-center animation-fade-in shadow-lg">
      <CardHeader>
        <div className="flex justify-center items-center mb-4">
          <Award className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="font-headline text-4xl">Quiz Complete!</CardTitle>
        <CardDescription className="text-lg">{getFeedback()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-5xl font-bold text-primary">
          {score} / {totalQuestions}
        </div>
        <p className="text-2xl font-semibold text-muted-foreground">{percentage}% Correct</p>
        <Button onClick={onPlayAgain} size="lg" className="w-full h-14 text-lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          Play Again
        </Button>
      </CardContent>
    </Card>
  );
}
