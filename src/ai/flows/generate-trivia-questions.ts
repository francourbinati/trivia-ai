// This file is machine-generated - edit at your own risk.

"use server"

/**
 * @fileOverview Generates trivia questions based on a given subject.
 *
 * - generateTriviaQuestions - A function that generates trivia questions.
 * - GenerateTriviaQuestionsInput - The input type for the generateTriviaQuestions function.
 * - GenerateTriviaQuestionsOutput - The return type for the generateTriviaQuestions function.
 */

import { ai } from "@/ai/genkit"
import {
    GenerateTriviaQuestionsInput,
    GenerateTriviaQuestionsOutput,
    Schema_GenerateTriviaQuestionsInput,
    Schema_GenerateTriviaQuestionsOutput,
} from "@/types"
import { z } from "genkit"

export async function generateTriviaQuestions(
    input: GenerateTriviaQuestionsInput
): Promise<GenerateTriviaQuestionsOutput> {
    const { subject, difficulty } = input

    const prompt = `
    Generate 5 trivia questions about ${subject} with varying difficulty levels.
    
    Difficulty level: ${difficulty}
    
    For each question, provide:
    1. The question itself
    2. 4 multiple choice options (A, B, C, D)
    3. The correct answer
    
    Make sure the questions are:
    - Clear and concise
    - Based on factual information
    - Have only one correct answer
    - The options should be plausible but distinct
    - Include a mix of straightforward and challenging questions
  `
    return generateTriviaQuestionsFlow(input)
}

const prompt = ai.definePrompt({
    name: "generateTriviaQuestionsPrompt",
    input: { schema: Schema_GenerateTriviaQuestionsInput },
    output: { schema: Schema_GenerateTriviaQuestionsOutput },
    prompt: `You are a trivia expert. For the subject "{{{subject}}}", generate an engaging trivia quiz with 5 questions.

For each question, provide:
1.  A clear and concise question.
2.  An array of 4 distinct multiple-choice options.
3.  The exact string of the correct answer from the options.

Ensure one of the options is the correct answer. The options should be plausible to make the quiz challenging.

Return the entire quiz as a single JSON object that strictly follows the provided output schema.`,
})

const generateTriviaQuestionsFlow = ai.defineFlow(
    {
        name: "generateTriviaQuestionsFlow",
        inputSchema: Schema_GenerateTriviaQuestionsInput,
        outputSchema: Schema_GenerateTriviaQuestionsOutput,
    },
    async (input) => {
        const { output } = await prompt(input)
        return output!
    }
)
