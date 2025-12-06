"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileCode, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

const templates = [
  {
    name: "Hello World - Python",
    language: "python",
    code: `def hello_world():
    print("Hello, World!")

if __name__ == "__main__":
    hello_world()`,
  },
  {
    name: "Fibonacci - JavaScript",
    language: "javascript",
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  },
  {
    name: "Bubble Sort - Python",
    language: "python",
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
  },
]

export function TemplatesPanel() {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-1">
        {templates.map((template, idx) => (
          <Card key={idx} className="p-4 border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{template.name}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => copyToClipboard(template.code)}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="font-mono text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto text-muted-foreground max-h-32">
              {template.code}
            </pre>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
