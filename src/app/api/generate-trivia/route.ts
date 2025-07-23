import { NextRequest, NextResponse } from "next/server"
import { generateTriviaAction } from "@/app/lib/actions"
import { z } from "zod"

export async function POST(req: NextRequest) {
    try {
        const { subject, difficulty } = await req.json()
        // Optionally validate difficulty here if needed
        const result = await generateTriviaAction({ subject, difficulty })
        console.log(JSON.stringify(result))
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Invalid request or server error." },
            { status: 400 }
        )
    }
}
