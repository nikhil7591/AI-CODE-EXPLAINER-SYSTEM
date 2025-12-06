import { exec } from "child_process"
import { promisify } from "util"
import * as fs from "fs"
import * as path from "path"
import * as os from "os"

const execAsync = promisify(exec)

const TIMEOUT = 5000 // 5 seconds
const MAX_OUTPUT = 10000 // 10KB

interface ExecutionResult {
  output: string
  error: string
  exitCode: number
  executionTime: number
}

export async function executeCode(code: string, language: string): Promise<ExecutionResult> {
  const startTime = Date.now()
  const tempDir = path.join(os.tmpdir(), `code-${Date.now()}`)

  try {
    // Create temp directory
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const filename = language === "python" ? "code.py" : language === "java" ? "Code.java" : "code.js"
    const filepath = path.join(tempDir, filename)

    // Write code to file
    fs.writeFileSync(filepath, code)

    let command = ""
    const isWindows = process.platform === "win32"
    
    if (language === "python") {
      command = isWindows 
        ? `python ${filepath}`
        : `timeout ${TIMEOUT / 1000}s python3 ${filepath}`
    } else if (language === "javascript") {
      command = isWindows
        ? `node ${filepath}`
        : `timeout ${TIMEOUT / 1000}s node ${filepath}`
    } else if (language === "java") {
      if (isWindows) {
        command = `cd ${tempDir} & javac Code.java & java Code`
      } else {
        command = `cd ${tempDir} && javac Code.java && timeout ${TIMEOUT / 1000}s java Code`
      }
    }

    const { stdout, stderr } = await execAsync(command, { maxBuffer: MAX_OUTPUT })
    const executionTime = Date.now() - startTime

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true })

    return {
      output: stdout.slice(0, MAX_OUTPUT),
      error: stderr.slice(0, MAX_OUTPUT),
      exitCode: 0,
      executionTime,
    }
  } catch (error: any) {
    const executionTime = Date.now() - startTime

    // Cleanup
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch {}

    return {
      output: error.stdout?.slice(0, MAX_OUTPUT) || "",
      error: (error.stderr || error.message).slice(0, MAX_OUTPUT),
      exitCode: error.code || 1,
      executionTime,
    }
  }
}
