"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Award, RefreshCw, Share2 } from "lucide-react"
import type { Trivia } from "@/types"

type QuizResultsProps = {
    score: number
    totalQuestions: number
    onPlayAgain: () => void
    triviaData: Trivia[]
    triviaId: string | null
}

export function QuizResults({ score, totalQuestions, onPlayAgain, triviaId }: QuizResultsProps) {
    const percentage = Math.round((score / totalQuestions) * 100)

    const getFeedback = () => {
        if (percentage === 100) return "Perfect Score! You're a true expert!"
        if (percentage >= 80) return "Excellent work! You know your stuff."
        if (percentage >= 50) return "Good job! A solid performance."
        if (percentage >= 20) return "Not bad! Every quiz is a learning opportunity."
        return "That was tough! Keep trying and you'll improve."
    }

    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle")

    const handleCopyTrivia = async () => {
        // Construct the shareable text string
        let shareText = `Check out this trivia quiz!\\n\\n`
        shareText = triviaId
            ? `http://localhost:9002/?id=${triviaId}`
            : `http://localhost:9002/?id=null`
        /* triviaData.forEach((question, index) => {
            shareText += `${index + 1}. ${question.question}\\n`
            question.options.forEach((option, optionIndex) => {
                shareText += `   ${String.fromCharCode(65 + optionIndex)}. ${option}\\n`
            })
            // Optional: Include answer in shareable text. Consider user experience.
            // shareText += `   Answer: ${question.correctAnswer}\\n\\n`;
        }) */

        try {
            await navigator.clipboard.writeText(shareText)
            setCopyStatus("copied")
            setTimeout(() => setCopyStatus("idle"), 3000) // Reset status after 3 seconds
        } catch (err) {
            console.error("Failed to copy:", err)
            setCopyStatus("error")
        }
    }

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
                <p className="text-2xl font-semibold text-muted-foreground">
                    {percentage}% Correct
                </p>
                <Button onClick={onPlayAgain} size="lg" className="w-full h-14 text-lg">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Play Again
                </Button>
                <Button
                    onClick={handleCopyTrivia}
                    size="lg"
                    className="w-full h-14 text-lg"
                    variant="outline"
                    disabled={copyStatus === "copied"}
                >
                    <Share2 className="mr-2 h-5 w-5" />
                    {copyStatus === "copied" ? "Copied!" : "Share Trivia"}
                </Button>
            </CardContent>
            {copyStatus === "copied" && (
                <CardFooter className="justify-center mt-4 text-sm text-green-600">
                    Trivia copied to clipboard!
                </CardFooter>
            )}
        </Card>
    )
}
