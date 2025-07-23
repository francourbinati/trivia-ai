"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Sparkles } from "lucide-react"
import { TriviaDifficulty, TriviaDifficultyEnum } from "@/types"

const formSchema = z.object({
    subject: z
        .string()
        .min(2, "Please enter a subject with at least 2 characters.")
        .max(50, "That's a bit long! Try a shorter subject."),
})

type SubjectFormProps = {
    onStartTrivia: (subject: string, difficulty: TriviaDifficulty) => void
    isLoading: boolean
    difficulty: TriviaDifficulty
    onDifficultyChange: (difficulty: TriviaDifficulty) => void
}

export function SubjectForm({
    onStartTrivia,
    isLoading,
    difficulty,
    onDifficultyChange,
}: SubjectFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        onStartTrivia(values.subject, difficulty)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-md mx-auto animation-fade-in"
            >
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Trivia Subject</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., The Renaissance, Quantum Physics, 90s Cartoons..."
                                    {...field}
                                    className="text-center h-12 text-lg"
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select value={difficulty} onValueChange={onDifficultyChange}>
                        <FormControl>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Object.values(TriviaDifficultyEnum).map((level) => (
                                <SelectItem key={level} value={level}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
                >
                    {isLoading ? (
                        "Generating..."
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate Trivia
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}
