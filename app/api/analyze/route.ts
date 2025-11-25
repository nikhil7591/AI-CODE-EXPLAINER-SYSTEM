import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CodeHistory } from "@/lib/models"
import { analyzeCode, explainError } from "@/lib/agent"
import { executeCode } from "@/lib/sandbox"

const FREE_LIMIT = 3 // 3 free analyses per day

export async function POST(request: NextRequest) {
  try {
    const { code, language, userEmail } = await request.json()

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 })
    }

    // Check usage limit if user email is provided
    if (userEmail) {
      try {
        const usageResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/usage/check?email=${encodeURIComponent(userEmail)}`)
        const usageData = await usageResponse.json()
        
        if (usageData.remaining <= 0) {
          return NextResponse.json({ 
            error: `You've reached your daily limit of ${FREE_LIMIT} free AI analyses. Try again tomorrow.`,
            limitReached: true,
            resetTime: usageData.resetTime
          }, { status: 429 })
        }
      } catch (usageError) {
        console.warn("Could not check usage limit:", usageError)
      }
    }

    // Connect to DB (optional - continue if fails)
    try {
      await connectDB()
    } catch (dbError: any) {
      console.warn("Database connection warning:", dbError.message)
    }

    // Step 1: Analyze code with AI with retry logic
    let analysis
    try {
      analysis = await analyzeCode(code, language)
    } catch (aiError: any) {
      console.error("AI analysis failed:", aiError)
      
      // Check if it's a rate limit error
      if (aiError.message?.includes('Resource exhausted') || aiError.message?.includes('429')) {
        return NextResponse.json({ 
          error: "AI service is currently experiencing high demand. Please try again in a few moments.",
          retryAfter: 30 // Suggest retry after 30 seconds
        }, { status: 429 })
      }
      
      // For other AI errors, provide a fallback response
      analysis = {
        explanation: "AI analysis is currently unavailable. Please try again later.",
        bugsDetected: [],
        suggestedFixes: "Unable to generate suggestions at this time.",
        optimizedCode: code
      }
    }

    // Step 2: Execute code
    let execution
    try {
      execution = await executeCode(code, language)
    } catch (execError: any) {
      console.error("Code execution failed:", execError)
      execution = {
        output: "",
        error: "Code execution failed",
        executionTime: 0
      }
    }

    // Step 3: If error, get explanation (with fallback)
    let errorExplanation = ""
    if (execution.error) {
      try {
        errorExplanation = await explainError(execution.error, code, language)
      } catch (explainError: any) {
        console.error("Error explanation failed:", explainError)
        errorExplanation = "Unable to explain the error at this time."
      }
    }

    // Step 4: Save to database (if connected)
    let recordId = ""
    try {
      const record = await CodeHistory.create({
        originalCode: code,
        language,
        explanation: analysis.explanation,
        bugsDetected: analysis.bugsDetected,
        suggestedFixes: analysis.suggestedFixes,
        optimizedCode: analysis.optimizedCode,
        output: execution.output,
        errorTrace: execution.error,
        executionTime: execution.executionTime,
      })
      recordId = record._id
    } catch (dbSaveError: any) {
      console.warn("Could not save to database:", dbSaveError.message)
    }

    // Step 5: Record usage if successful and user email provided
    if (userEmail && analysis && !analysis.explanation.includes("currently unavailable")) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/usage/record`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail })
        })
      } catch (recordError) {
        console.warn("Could not record usage:", recordError)
      }
    }

    return NextResponse.json({
      id: recordId,
      explanation: analysis.explanation,
      bugsDetected: analysis.bugsDetected,
      suggestedFixes: analysis.suggestedFixes,
      optimizedCode: analysis.optimizedCode,
      output: execution.output,
      error: execution.error,
      errorExplanation,
      executionTime: execution.executionTime,
    })
  } catch (error: any) {
    console.error("Analysis error:", error)
    
    // Handle rate limit errors specifically
    if (error.message?.includes('Resource exhausted') || error.message?.includes('429')) {
      return NextResponse.json({ 
        error: "AI service is currently experiencing high demand. Please try again in a few moments.",
        retryAfter: 30
      }, { status: 429 })
    }
    
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 })
  }
}
