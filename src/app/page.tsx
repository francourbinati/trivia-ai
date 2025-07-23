"use client"

import { useState } from "react"
import {
    Schema_GenerateSuccessfulTriviaResult,
    Schema_GenerateFailedTriviaResult,
    Trivia,
} from "@/types"
import { SubjectForm } from "@/components/subject-form"
import { TriviaQuiz } from "@/components/trivia-quiz"
import { QuizResults } from "@/components/quiz-results"
import { BrainCircuitIcon } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { TriviaDifficulty } from "@/types"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

type GameState = "idle" | "loading" | "playing" | "results" | "error"

export default function Home() {
    const searchParams = useSearchParams()
    console.log(searchParams.get("queryParam"))
    const [gameState, setGameState] = useState<GameState>("idle")
    const [triviaData, setTriviaData] = useState<Trivia[]>([])
    const [error, setError] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [difficulty, setDifficulty] = useState<TriviaDifficulty>("normal")
    const [triviaId, setTriviaId] = useState<string | null>(null)

    const handleStartTrivia = async (subject: string) => {
        setGameState("loading")
        setError(null)
        try {
            const response = await fetch("/api/generate-trivia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, difficulty }),
            })
            const result = await response.json()
            const { data, error, success } = Schema_GenerateSuccessfulTriviaResult.safeParse(result)
            if (success) {
                setTriviaId(data.id)
                if (data.data) setTriviaData(data.data?.trivia)
                setScore(0)
                setGameState("playing")
                setTriviaId(result.id)
            } else {
                setError(result.error || "Failed to generate trivia")
                setGameState("error")
            }
        } catch (error) {
            console.error("Error generating trivia:", error)
            setError("An error occurred while generating trivia")
            setGameState("error")
        }
    }

    const handleQuizFinish = (finalScore: number) => {
        setScore(finalScore)
        setGameState("results")
    }

    const handlePlayAgain = () => {
        setGameState("idle")
        setTriviaData([])
        setScore(0)
        setDifficulty("normal")
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <BrainCircuitIcon className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2">AI Trivia Generator</h1>
                        <p className="text-muted-foreground">
                            Generate trivia questions about any topic
                        </p>
                    </div>
                    {gameState === "idle" && (
                        <SubjectForm
                            onStartTrivia={handleStartTrivia}
                            isLoading={false}
                            difficulty={difficulty}
                            onDifficultyChange={setDifficulty}
                        />
                    )}
                    {gameState === "loading" && (
                        <div className="w-full max-w-md text-center">
                            <Skeleton className="h-12 w-full mb-4" />
                            <Skeleton className="h-12 w-full mb-4" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    )}
                    {gameState === "playing" && (
                        <TriviaQuiz triviaData={triviaData} onQuizFinish={handleQuizFinish} />
                    )}
                    {gameState === "results" && (
                        <QuizResults
                            score={score}
                            totalQuestions={triviaData.length}
                            onPlayAgain={handlePlayAgain}
                            triviaData={triviaData}
                            triviaId={triviaId}
                        />
                    )}
                    {gameState === "error" && (
                        <div className="w-full max-w-md text-center">
                            <p className="text-destructive mb-4">{error}</p>
                            <Button onClick={handlePlayAgain}>Try Again</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
