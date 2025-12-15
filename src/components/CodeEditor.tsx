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
# Implement a class that calculates the running average
# of a stream of numbers.
#
# Example:
#   calc = RunningAverage()
#   calc.add(10)  → 10.0
#   calc.add(20)  → 15.0
#   calc.add(30)  → 20.0
#   calc.add(5)   → 16.25

class RunningAverage:
    def __init__(self):
        self.numbers = []

    def add(self, num):
        self.numbers.append(num)
        return sum(self.numbers) / len(self.numbers)


# Test your solution
if __name__ == "__main__":
    calc = RunningAverage()
    print(f"add(10) → {calc.add(10)}")   # Expected: 10.0
    print(f"add(20) → {calc.add(20)}")   # Expected: 15.0
    print(f"add(30) → {calc.add(30)}")   # Expected: 20.0
    print(f"add(5)  → {calc.add(5)}")    # Expected: 16.25
`,
  javascript: `// Running Average Calculator
//
// Implement a class that calculates the running average
// of a stream of numbers.
//
// Example:
//   const calc = new RunningAverage();
//   calc.add(10)  → 10
//   calc.add(20)  → 15
//   calc.add(30)  → 20
//   calc.add(5)   → 16.25

class RunningAverage {
  constructor() {
    this.numbers = [];
  }

  add(num) {
    this.numbers.push(num);
    const sum = this.numbers.reduce((a, b) => a + b, 0);
    return sum / this.numbers.length;
  }
}


// Test your solution
const calc = new RunningAverage();
console.log(\`add(10) → \${calc.add(10)}\`);  // Expected: 10
console.log(\`add(20) → \${calc.add(20)}\`);  // Expected: 15
console.log(\`add(30) → \${calc.add(30)}\`);  // Expected: 20
console.log(\`add(5)  → \${calc.add(5)}\`);   // Expected: 16.25
`,
  java: `// Running Average Calculator
//
// Implement a class that calculates the running average
// of a stream of numbers.

import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        RunningAverage calc = new RunningAverage();
        System.out.println("add(10) → " + calc.add(10));  // Expected: 10.0
        System.out.println("add(20) → " + calc.add(20));  // Expected: 15.0
        System.out.println("add(30) → " + calc.add(30));  // Expected: 20.0
        System.out.println("add(5)  → " + calc.add(5));   // Expected: 16.25
    }
}

class RunningAverage {
    private ArrayList<Double> numbers = new ArrayList<>();

    public double add(double num) {
        numbers.add(num);
        double sum = 0;
        for (double n : numbers) sum += n;
        return sum / numbers.size();
    }
}
`,
  cpp: `// Running Average Calculator
//
// Implement a class that calculates the running average
// of a stream of numbers.

#include <iostream>
#include <vector>
#include <iomanip>

class RunningAverage {
private:
    std::vector<double> numbers;
public:
    double add(double num) {
        numbers.push_back(num);
        double sum = 0;
        for (double n : numbers) sum += n;
        return sum / numbers.size();
    }
};

int main() {
    RunningAverage calc;
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "add(10) → " << calc.add(10) << std::endl;  // Expected: 10
    std::cout << "add(20) → " << calc.add(20) << std::endl;  // Expected: 15
    std::cout << "add(30) → " << calc.add(30) << std::endl;  // Expected: 20
    std::cout << "add(5)  → " << calc.add(5) << std::endl;   // Expected: 16.25
    return 0;
}
`,
  c: `// Running Average Calculator
//
// Implement functions that calculate the running average
// of a stream of numbers.

#include <stdio.h>

#define MAX_NUMBERS 1000

typedef struct {
    double numbers[MAX_NUMBERS];
    int count;
} RunningAverage;

void init(RunningAverage* ra) {
    ra->count = 0;
}

double add(RunningAverage* ra, double num) {
    ra->numbers[ra->count++] = num;
    double sum = 0;
    for (int i = 0; i < ra->count; i++) {
        sum += ra->numbers[i];
    }
    return sum / ra->count;
}

int main() {
    RunningAverage calc;
    init(&calc);
    printf("add(10) → %.2f\\n", add(&calc, 10));  // Expected: 10.00
    printf("add(20) → %.2f\\n", add(&calc, 20));  // Expected: 15.00
    printf("add(30) → %.2f\\n", add(&calc, 30));  // Expected: 20.00
    printf("add(5)  → %.2f\\n", add(&calc, 5));   // Expected: 16.25
    return 0;
}
`,
  go: `// Running Average Calculator
//
// Implement a struct that calculates the running average
// of a stream of numbers.

package main

import "fmt"

type RunningAverage struct {
    numbers []float64
}

func (ra *RunningAverage) Add(num float64) float64 {
    ra.numbers = append(ra.numbers, num)
    var sum float64
    for _, n := range ra.numbers {
        sum += n
    }
    return sum / float64(len(ra.numbers))
}

func main() {
    calc := &RunningAverage{}
    fmt.Printf("Add(10) → %.2f\\n", calc.Add(10))  // Expected: 10
    fmt.Printf("Add(20) → %.2f\\n", calc.Add(20))  // Expected: 15
    fmt.Printf("Add(30) → %.2f\\n", calc.Add(30))  // Expected: 20
    fmt.Printf("Add(5)  → %.2f\\n", calc.Add(5))   // Expected: 16.25
}
`,
  rust: `// Running Average Calculator
//
// Implement a struct that calculates the running average
// of a stream of numbers.

struct RunningAverage {
    numbers: Vec<f64>,
}

impl RunningAverage {
    fn new() -> Self {
        RunningAverage { numbers: Vec::new() }
    }

    fn add(&mut self, num: f64) -> f64 {
        self.numbers.push(num);
        let sum: f64 = self.numbers.iter().sum();
        sum / self.numbers.len() as f64
    }
}

fn main() {
    let mut calc = RunningAverage::new();
    println!("add(10) → {:.2}", calc.add(10.0));  // Expected: 10
    println!("add(20) → {:.2}", calc.add(20.0));  // Expected: 15
    println!("add(30) → {:.2}", calc.add(30.0));  // Expected: 20
    println!("add(5)  → {:.2}", calc.add(5.0));   // Expected: 16.25
}
`,
  scala: `// Running Average Calculator
//
// Implement a class that calculates the running average
// of a stream of numbers.

object Main extends App {
  val calc = new RunningAverage()
  println("add(10) → " + calc.add(10))  // Expected: 10.0
  println("add(20) → " + calc.add(20))  // Expected: 15.0
  println("add(30) → " + calc.add(30))  // Expected: 20.0
  println("add(5)  → " + calc.add(5))   // Expected: 16.25
}

class RunningAverage {
  private var numbers: List[Double] = List()

  def add(num: Double): Double = {
    numbers = numbers :+ num
    numbers.sum / numbers.length
  }
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
