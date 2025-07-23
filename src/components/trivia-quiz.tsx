'use client';

import { useState, useEffect } from 'react';
import type { Trivia } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type TriviaQuizProps = {
  triviaData: Trivia[];
  onQuizFinish: (score: number) => void;
};

export function TriviaQuiz({ triviaData, onQuizFinish }: TriviaQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = triviaData[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex + 1) / triviaData.length) * 100;

  useEffect(() => {
    // Reset state for the new question
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(null);
  }, [currentQuestionIndex]);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < triviaData.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      onQuizFinish(score);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!isAnswered) return '';
    if (option === currentQuestion.correctAnswer) return 'bg-green-100 border-green-400 text-green-800';
    if (option === selectedAnswer && !isCorrect) return 'bg-red-100 border-red-400 text-red-800';
    return 'opacity-60';
  };

  return (
    <div className="w-full animation-fade-in">
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {triviaData.length}</p>
        <Progress value={progressValue} className="w-full mt-2" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl md:text-3xl text-center leading-tight">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswer ?? ''}
            onValueChange={setSelectedAnswer}
            disabled={isAnswered}
            className="space-y-4 my-6"
          >
            {currentQuestion.options.map((option, index) => (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={cn(
                  "flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300",
                  isAnswered ? getOptionStyle(option) : 'hover:bg-accent/50',
                  selectedAnswer === option && !isAnswered ? 'border-primary' : ''
                )}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="mr-4 h-5 w-5" />
                <span className="text-lg">{option}</span>
              </Label>
            ))}
          </RadioGroup>

          {isAnswered && (
            <div className={cn("flex items-center justify-center p-3 rounded-md text-lg font-bold mt-4 animation-fade-in", isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
              {isCorrect ? <CheckCircle2 className="mr-2" /> : <XCircle className="mr-2" />}
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            {!isAnswered ? (
              <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} size="lg">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} size="lg" className="animation-fade-in">
                {currentQuestionIndex < triviaData.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
