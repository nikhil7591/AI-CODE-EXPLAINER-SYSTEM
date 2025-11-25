import { generateText, generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

const AnalysisSchema = z.object({
  explanation: z.string().describe("Clear explanation of what the code does"),
  bugsDetected: z.array(z.object({
    line: z.number().describe("Line number or -1 if general"),
    issue: z.string().describe("Description of the bug"),
    severity: z.enum(["low", "medium", "high"]).describe("Severity level")
  })).describe("Array of bugs detected"),
  suggestedFixes: z.string().describe("Specific fixes for each bug found"),
  optimizedCode: z.string().describe("Improved version of the code with optimizations and bug fixes")
})

type AnalysisResult = z.infer<typeof AnalysisSchema>

export async function analyzeCode(code: string, language: string): Promise<AnalysisResult> {
  const prompt = `You are an expert code analyzer. Analyze the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide a detailed analysis with:
1. explanation: Clear explanation of what this code does
2. bugsDetected: Array of bugs with line number, issue description, and severity (low/medium/high)
3. suggestedFixes: Specific fixes for each bug found
4. optimizedCode: Improved version of the code with optimizations and bug fixes`

  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: AnalysisSchema,
      prompt,
      temperature: 0.3,
    })

    return object
  } catch (error) {
    console.error("Error analyzing code:", error)
    throw error
  }
}

export async function explainError(error: string, code: string, language: string): Promise<string> {
  const prompt = `A ${language} program encountered this error:

Error: ${error}

Source code:
\`\`\`${language}
${code}
\`\`\`

Provide a clear, beginner-friendly explanation of:
1. What caused this error
2. Why it happened
3. How to fix it

Be concise and specific.`

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
      temperature: 0.5,
    })

    return text
  } catch (error) {
    console.error("Error explaining error:", error)
    throw error
  }
}
