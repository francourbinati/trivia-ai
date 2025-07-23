"use server"

import { generateTriviaQuestions } from "@/ai/flows/generate-trivia-questions"
import { z } from "zod"
import {
    GenerateFailedTriviaResult,
    GenerateSuccessfulTriviaResult,
    Schema_GenerateTriviaQuestionsOutput,
    TriviaDifficulty,
} from "@/types"
import { randomUUID } from "crypto"
import { saveTrivia } from "@/firebase/trivia-service"

const subjectSchema = z
    .string()
    .min(2, "Subject must be at least 2 characters long.")
    .max(50, "Subject is too long.")

export async function generateTriviaAction({
    subject,
    difficulty,
}: {
    subject: string
    difficulty: TriviaDifficulty
}): Promise<GenerateSuccessfulTriviaResult> {
    const id = randomUUID()
    try {
        const validation = subjectSchema.safeParse(subject)
        if (!validation.success) {
            return { success: false, error: validation.error.errors.join("."), id, data: null }
        }

        const data = await generateTriviaQuestions({ subject: validation.data, difficulty })
        const {
            data: parsedData,
            success,
            error,
        } = Schema_GenerateTriviaQuestionsOutput.safeParse(data)
        
        if (!success) {
            return { success: false, error: error?.message, id, data: null }
        }

        // Save trivia to Firebase
        const triviaId = await saveTrivia({
          trivia: parsedData.trivia,
          subject,
          difficulty,
          createdAt: new Date()
        })

        return { success: true, id: triviaId, error: null, data: parsedData }
    } catch (error) {
        console.error("Error generating trivia:", error)
        return {
            success: false,
            error: "Failed to generate trivia. Please try a different subject.",
            id,
            data: null,
        }
    }
}
