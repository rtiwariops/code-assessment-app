'use client'

import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'

const LANGUAGES = [
  { id: 'python', name: 'Python', icon: '🐍', ext: 'py' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡', ext: 'js' },
  { id: 'java', name: 'Java', icon: '☕', ext: 'java' },
  { id: 'go', name: 'Go', icon: '🔵', ext: 'go' },
  { id: 'scala', name: 'Scala', icon: '🔴', ext: 'scala' },
]

const CODE_TEMPLATES: Record<string, string> = {
  python: `# Running Average Calculator
#
# Implement a RunningAverage class to calculate the running average
# of integer values added. The class should support thread-safe additions
# and allow retrieval of the current running average.
#
# Example 1:
#   ra = RunningAverage()
#   ra.add(1)
#   ra.add(2)
#   ra.add(3)
#   print(ra.get_average())  # Output: 2.0
#
# Explanation: (1+2+3)/3 = 2.0
#
# Example 2:
#   ra = RunningAverage()
#   ra.add(5)
#   ra.add(10)
#   print(ra.get_average())  # Output: 7.5
#   ra.add(15)
#   print(ra.get_average())  # Output: 10.0
#
# Explanation: (5+10)/2=7.5, then (5+10+15)/3=10.0
#
# Example 3:
#   ra = RunningAverage()
#   print(ra.get_average())  # Output: 0.0
#
# Explanation: Initial average is 0.0 before any values added.
#
# Constraints:
# - The add method should be thread-safe
# - get_average should return a float
# - Handle large number of additions efficiently
#
# Instructions:
# 1. Implement the RunningAverage class
# 2. Use Python's threading primitives for thread-safety
# 3. Design for efficient computation

import threading

# TODO: Implement RunningAverage class
class RunningAverage:
    def __init__(self):
        # Your code here
        pass

    # TODO: Implement add method (thread-safe)
    def add(self, value: int) -> None:
        # Your code here
        pass

    # TODO: Implement get_average method
    def get_average(self) -> float:
        # Your code here
        return 0.0


# Test your solution
if __name__ == "__main__":
    ra = RunningAverage()
    ra.add(1)
    ra.add(2)
    ra.add(3)
    print(f"Average: {ra.get_average()}")  # Expected: 2.0
`,
  javascript: `// Running Average Calculator
//
// Implement a RunningAverage class to calculate the running average
// of integer values added. The class should maintain state across
// multiple additions and return the current average on demand.
//
// Example 1:
//   const ra = new RunningAverage();
//   ra.add(1);
//   ra.add(2);
//   ra.add(3);
//   console.log(ra.getAverage());  // Output: 2.0
//
// Explanation: (1+2+3)/3 = 2.0
//
// Example 2:
//   const ra = new RunningAverage();
//   ra.add(5);
//   ra.add(10);
//   console.log(ra.getAverage());  // Output: 7.5
//   ra.add(15);
//   console.log(ra.getAverage());  // Output: 10.0
//
// Explanation: (5+10)/2=7.5, then (5+10+15)/3=10.0
//
// Example 3:
//   const ra = new RunningAverage();
//   console.log(ra.getAverage());  // Output: 0
//
// Explanation: Initial average is 0 before any values added.
//
// Constraints:
// - The add method should accept integers
// - getAverage should return a number
// - Handle large number of additions efficiently
//
// Instructions:
// 1. Implement the RunningAverage class
// 2. Consider edge cases (empty state, single value)
// 3. Design for efficient O(1) average calculation

// TODO: Implement RunningAverage class
class RunningAverage {
  constructor() {
    // Your code here
  }

  // TODO: Implement add method
  add(value) {
    // Your code here
  }

  // TODO: Implement getAverage method
  getAverage() {
    // Your code here
    return 0;
  }
}


// Test your solution
const ra = new RunningAverage();
ra.add(1);
ra.add(2);
ra.add(3);
console.log(\`Average: \${ra.getAverage()}\`);  // Expected: 2.0
`,
  java: `// Running Average Calculator
//
// Implement a RunningAverage class to calculate the running average
// of integer values added. The class should support thread-safe additions
// and allow retrieval of the current running average.
//
// Example 1:
//   RunningAverage ra = new RunningAverage();
//   ra.add(1);
//   ra.add(2);
//   ra.add(3);
//   System.out.println(ra.getAverage());  // Output: 2.0
//
// Explanation: (1+2+3)/3 = 2.0
//
// Example 2:
//   RunningAverage ra = new RunningAverage();
//   ra.add(5);
//   ra.add(10);
//   System.out.println(ra.getAverage());  // Output: 7.5
//   ra.add(15);
//   System.out.println(ra.getAverage());  // Output: 10.0
//
// Explanation: (5+10)/2=7.5, then (5+10+15)/3=10.0
//
// Example 3:
//   RunningAverage ra = new RunningAverage();
//   System.out.println(ra.getAverage());  // Output: 0.0
//
// Explanation: Initial average is 0.0 before any values added.
//
// Constraints:
// - The add method should be thread-safe (use synchronized)
// - getAverage should return double
// - Handle large number of additions efficiently
//
// Instructions:
// 1. Implement the RunningAverage class
// 2. Use Java's synchronization for thread-safety
// 3. Design for high concurrency scenarios

public class Main {
    public static void main(String[] args) {
        RunningAverage ra = new RunningAverage();
        ra.add(1);
        ra.add(2);
        ra.add(3);
        System.out.println("Average: " + ra.getAverage());  // Expected: 2.0
    }
}

// TODO: Implement RunningAverage class
class RunningAverage {
    // TODO: Add your fields here

    public RunningAverage() {
        // Your code here
    }

    // TODO: Implement add method (thread-safe)
    public synchronized void add(int value) {
        // Your code here
    }

    // TODO: Implement getAverage method
    public synchronized double getAverage() {
        // Your code here
        return 0.0;
    }
}
`,
  go: `// Running Average Calculator
//
// Implement a RunningAverage struct to calculate the running average
// of integer values added. The struct should support concurrent additions
// and allow retrieval of the current running average.
//
// Example 1:
//   ra := NewRunningAverage()
//   ra.Add(1)
//   ra.Add(2)
//   ra.Add(3)
//   fmt.Println(ra.GetAverage()) // Output: 2.0
//
// Explanation: (1+2+3)/3 = 2.0
//
// Example 2:
//   ra := NewRunningAverage()
//   ra.Add(5)
//   ra.Add(10)
//   fmt.Println(ra.GetAverage()) // Output: 7.5
//   ra.Add(15)
//   fmt.Println(ra.GetAverage()) // Output: 10.0
//
// Explanation: (5+10)/2=7.5, then (5+10+15)/3=10.0
//
// Example 3:
//   ra := NewRunningAverage()
//   fmt.Println(ra.GetAverage()) // Output: 0.0
//
// Explanation: Initial average is 0.0 before any values added.
//
// Constraints:
// - The Add method should be thread-safe
// - GetAverage should return float64
// - Handle large number of additions efficiently
//
// Instructions:
// 1. Implement the RunningAverage struct
// 2. Use sync.Mutex or sync.RWMutex for thread-safety
// 3. Design for high concurrency scenarios

package main

import (
    "fmt"
    "sync"
)

// TODO: Implement RunningAverage struct
type RunningAverage struct {
    // Your fields here
    mu sync.Mutex
}

// TODO: Implement NewRunningAverage constructor
func NewRunningAverage() *RunningAverage {
    // Your code here
    return nil
}

// TODO: Implement Add method (thread-safe)
func (ra *RunningAverage) Add(value int) {
    // Your code here
}

// TODO: Implement GetAverage method
func (ra *RunningAverage) GetAverage() float64 {
    // Your code here
    return 0.0
}

func main() {
    ra := NewRunningAverage()
    ra.Add(1)
    ra.Add(2)
    ra.Add(3)
    fmt.Printf("Average: %.1f\\n", ra.GetAverage())  // Expected: 2.0
}
`,
  scala: `// Running Average Calculator
//
// Implement a RunningAverage class to calculate the running average
// of integer values added. The class should support thread-safe additions
// and allow retrieval of the current running average.
//
// Example 1:
//   val ra = new RunningAverage()
//   ra.add(1)
//   ra.add(2)
//   ra.add(3)
//   println(ra.getAverage)  // Output: 2.0
//
// Explanation: (1+2+3)/3 = 2.0
//
// Example 2:
//   val ra = new RunningAverage()
//   ra.add(5)
//   ra.add(10)
//   println(ra.getAverage)  // Output: 7.5
//   ra.add(15)
//   println(ra.getAverage)  // Output: 10.0
//
// Explanation: (5+10)/2=7.5, then (5+10+15)/3=10.0
//
// Example 3:
//   val ra = new RunningAverage()
//   println(ra.getAverage)  // Output: 0.0
//
// Explanation: Initial average is 0.0 before any values added.
//
// Constraints:
// - The add method should be thread-safe (use synchronized)
// - getAverage should return Double
// - Handle large number of additions efficiently
//
// Instructions:
// 1. Implement the RunningAverage class
// 2. Use Scala's synchronized blocks for thread-safety
// 3. Consider using immutable collections with atomic references

// TODO: Implement RunningAverage class
class RunningAverage {
  // TODO: Add your fields here

  // TODO: Implement add method (thread-safe)
  def add(value: Int): Unit = synchronized {
    // Your code here
  }

  // TODO: Implement getAverage method
  def getAverage: Double = synchronized {
    // Your code here
    0.0
  }
}

object Main extends App {
  val ra = new RunningAverage()
  ra.add(1)
  ra.add(2)
  ra.add(3)
  println(s"Average: ${"$"}{ra.getAverage}")  // Expected: 2.0
}
`,
}

interface CodeEditorProps {
  accessCode: string
}

export default function CodeEditor({ accessCode }: CodeEditorProps) {
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(CODE_TEMPLATES.python)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [execTime, setExecTime] = useState<number | null>(null)
  const editorRef = useRef<any>(null)

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    setCode(CODE_TEMPLATES[newLang] || '')
    setOutput('')
    setExecTime(null)
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('')
    setExecTime(null)

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      })

      const result = await response.json()

      if (result.success) {
        setOutput(result.output || result.stdout || 'Program executed successfully (no output)')
        setExecTime(result.executionTime || null)
      } else {
        setOutput(`Error: ${result.error || 'Execution failed'}${result.stderr ? `\n\n${result.stderr}` : ''}`)
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Failed to execute code'}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, output, accessCode }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        setOutput(`✅ Solution submitted successfully!\n\n📋 Submission ID: ${result.submissionId}\n⏰ Timestamp: ${new Date(result.timestamp).toLocaleString()}`)
      } else {
        setOutput(`❌ Submission failed: ${result.error}`)
      }
    } catch (error) {
      setOutput(`❌ Submission error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setCode(CODE_TEMPLATES[language] || '')
    setOutput('')
    setSubmitted(false)
    setExecTime(null)
  }

  const selectedLang = LANGUAGES.find(l => l.id === language)

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Modern Toolbar */}
      <div className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-gray-700/50 text-white pl-4 pr-10 py-2 rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 cursor-pointer transition-all hover:bg-gray-700"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Problem Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
              <span className="text-purple-400 text-sm font-medium">Running Average</span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Easy</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
              title="Reset code"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="group relative px-5 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:from-emerald-800 disabled:to-green-900 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 disabled:shadow-none flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  <span>Run</span>
                </>
              )}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || submitted}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 disabled:from-purple-800 disabled:to-violet-900 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:shadow-none flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : submitted ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Submitted</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Header */}
          <div className="bg-gray-800/50 px-4 py-2 flex items-center gap-3 border-b border-gray-700/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-gray-400 text-sm font-mono">
              solution.{selectedLang?.ext || 'py'}
            </span>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              onMount={(editor) => { editorRef.current = editor }}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-[420px] flex flex-col bg-gray-900/50 border-l border-gray-700/50">
          {/* Output Header */}
          <div className="bg-gray-800/50 px-4 py-2 flex items-center justify-between border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-300 text-sm font-medium">Output</span>
            </div>
            {execTime !== null && (
              <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                {execTime}ms
              </span>
            )}
          </div>

          {/* Output Content */}
          <div className="flex-1 p-4 overflow-auto">
            {output ? (
              <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Run your code to see output</p>
                <p className="text-xs mt-1 text-gray-600">Press the green Run button</p>
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="bg-gray-800/30 border-t border-gray-700/50 px-4 py-3">
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Implement a running average calculator that maintains state across multiple add() calls.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
