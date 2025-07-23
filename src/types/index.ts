import { z } from 'zod';
import { generateTriviaQuestions } from '@/ai/flows/generate-trivia-questions';

type GenerateTriviaQuestionsOutputType = Awaited<ReturnType<typeof generateTriviaQuestions>>;

export type Trivia = GenerateTriviaQuestionsOutputType['trivia'][number];
