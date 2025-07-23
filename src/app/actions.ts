'use server';

import { generateTriviaQuestions } from '@/ai/flows/generate-trivia-questions';
import { z } from 'zod';

const subjectSchema = z.string().min(2, 'Subject must be at least 2 characters long.').max(50, 'Subject is too long.');

export async function generateTriviaAction(subject: string) {
  try {
    const validation = subjectSchema.safeParse(subject);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const data = await generateTriviaQuestions({ subject: validation.data });
    return { success: true, data };
  } catch (error) {
    console.error('Error generating trivia:', error);
    return { success: false, error: 'Failed to generate trivia. Please try a different subject.' };
  }
}
