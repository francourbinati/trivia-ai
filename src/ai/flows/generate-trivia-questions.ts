// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Generates trivia questions based on a given subject.
 *
 * - generateTriviaQuestions - A function that generates trivia questions.
 * - GenerateTriviaQuestionsInput - The input type for the generateTriviaQuestions function.
 * - GenerateTriviaQuestionsOutput - The return type for the generateTriviaQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTriviaQuestionsInputSchema = z.object({
  subject: z
    .string()
    .describe('The subject for which to generate trivia questions.'),
});
export type GenerateTriviaQuestionsInput = z.infer<
  typeof GenerateTriviaQuestionsInputSchema
>;

const GenerateTriviaQuestionsOutputSchema = z.object({
  trivia: z
    .array(
      z.object({
        question: z.string().describe('The trivia question.'),
        options: z
          .array(z.string())
          .length(4)
          .describe('An array of 4 multiple-choice options for the question.'),
        correctAnswer: z
          .string()
          .describe('The correct answer from the provided options.'),
      })
    )
    .length(5)
    .describe(
      'An array of 5 trivia questions, each with 4 options and a correct answer.'
    ),
});
export type GenerateTriviaQuestionsOutput = z.infer<
  typeof GenerateTriviaQuestionsOutputSchema
>;

export async function generateTriviaQuestions(
  input: GenerateTriviaQuestionsInput
): Promise<GenerateTriviaQuestionsOutput> {
  return generateTriviaQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTriviaQuestionsPrompt',
  input: {schema: GenerateTriviaQuestionsInputSchema},
  output: {schema: GenerateTriviaQuestionsOutputSchema},
  prompt: `You are a trivia expert. For the subject "{{{subject}}}", generate an engaging trivia quiz with 5 questions.

For each question, provide:
1.  A clear and concise question.
2.  An array of 4 distinct multiple-choice options.
3.  The exact string of the correct answer from the options.

Ensure one of the options is the correct answer. The options should be plausible to make the quiz challenging.

Return the entire quiz as a single JSON object that strictly follows the provided output schema.`,
});

const generateTriviaQuestionsFlow = ai.defineFlow(
  {
    name: 'generateTriviaQuestionsFlow',
    inputSchema: GenerateTriviaQuestionsInputSchema,
    outputSchema: GenerateTriviaQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
