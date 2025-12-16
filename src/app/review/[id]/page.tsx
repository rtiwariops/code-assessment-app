'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Editor from '@monaco-editor/react'

interface Submission {
  id: string
  code: string
  language: string
  output: string
  accessCode: string
  timestamp: string
  ip: string
  userAgent: string
}

export default function ReviewPage() {
  const params = useParams()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`/api/submission/${params.id}`)
        const data = await response.json()

        if (data.success) {
          setSubmission(data.submission)
        } else {
          setError(data.error || 'Submission not found')
        }
      } catch (err) {
        setError('Failed to load submission')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSubmission()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
          <p className="text-gray-400">{error || 'Submission not found'}</p>
        </div>
      </div>
    )
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-white">Submission Review</span>
            </div>
            <span className="text-gray-400 text-sm">ID: {submission.id.substring(0, 8)}...</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Language</p>
            <p className="text-white font-semibold capitalize">{submission.language}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Access Code</p>
            <p className="text-purple-400 font-mono">{submission.accessCode}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Submitted</p>
            <p className="text-white text-sm">{formatDate(submission.timestamp)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">IP Address</p>
            <p className="text-gray-300 font-mono text-sm">{submission.ip}</p>
          </div>
        </div>

        {/* Code */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Submitted Code
          </h2>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <Editor
              height="400px"
              language={submission.language === 'cpp' ? 'cpp' : submission.language}
              value={submission.code}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>
        </div>

        {/* Output */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Execution Output
          </h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
              {submission.output || '(No output)'}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
}
