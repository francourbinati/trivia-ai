import { z } from "zod"
import { generateTriviaQuestions } from "@/ai/flows/generate-trivia-questions"

type GenerateTriviaQuestionsOutputType = Awaited<ReturnType<typeof generateTriviaQuestions>>

export type Trivia = GenerateTriviaQuestionsOutputType["trivia"][number]
export type TriviaDifficulty = z.infer<typeof Schema_TriviaDifficulty>
export type GenerateSuccessfulTriviaResult = z.infer<typeof Schema_GenerateSuccessfulTriviaResult>
export type GenerateFailedTriviaResult = z.infer<typeof Schema_GenerateFailedTriviaResult>
export type GenerateTriviaQuestionsInput = z.infer<typeof Schema_GenerateTriviaQuestionsInput>
export type GenerateTriviaQuestionsOutput = z.infer<typeof Schema_GenerateTriviaQuestionsOutput>

export const Schema_TriviaDifficulty = z.enum(["easy", "normal", "hard"])
export const TriviaDifficultyEnum = Schema_TriviaDifficulty.Values

export const Schema_GenerateTriviaQuestionsInput = z.object({
    subject: z.string().describe("The subject for which to generate trivia questions."),
    difficulty: z
        .enum(["easy", "normal", "hard"])
        .describe("The difficulty level of the trivia questions"),
})

export const Schema_GenerateTriviaQuestionsOutput = z.object({
    trivia: z
        .array(
            z.object({
                question: z.string().describe("The trivia question."),
                options: z
                    .array(z.string())
                    .length(4)
                    .describe("An array of 4 multiple-choice options for the question."),
                correctAnswer: z.string().describe("The correct answer from the provided options."),
            })
        )
        .length(5)
        .describe("An array of 5 trivia questions, each with 4 options and a correct answer."),
})

export const Schema_GenerateSuccessfulTriviaResult = z.object({
    success: z.boolean(),
    data: Schema_GenerateTriviaQuestionsOutput.nullable(),
    id: z.string(),
    error: z.string().nullable(),
})

export const Schema_GenerateFailedTriviaResult = z.object({
    success: z.boolean(),
    data: z.null(),
    id: z.string(),
    error: z.string(),
})

/* export enum Difficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard'
} */
