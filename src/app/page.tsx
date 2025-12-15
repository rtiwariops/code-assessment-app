'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false })

const VALID_ACCESS_CODES = ['HIRE2024', 'MAXHIRE', 'CODETEST', 'ASSESS123']

export default function CodeAssessmentPage() {
  const [accessCode, setAccessCode] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedCode = localStorage.getItem('code-assessment-auth')
    if (savedCode && VALID_ACCESS_CODES.includes(savedCode.toUpperCase())) {
      setAccessCode(savedCode)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const normalizedCode = accessCode.trim().toUpperCase()
    if (!normalizedCode) {
      setError('Please enter an access code')
      return
    }
    if (VALID_ACCESS_CODES.includes(normalizedCode)) {
      localStorage.setItem('code-assessment-auth', normalizedCode)
      setIsAuthenticated(true)
    } else {
      setError('Invalid access code')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('code-assessment-auth')
    setIsAuthenticated(false)
    setAccessCode('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Modern Header */}
        <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-6 py-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">MaximizeHire</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-700"></div>
              <span className="hidden sm:block text-gray-400 text-sm">Code Assessment</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm font-mono">{accessCode}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 hover:bg-gray-800/50 px-3 py-1.5 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Exit
              </button>
            </div>
          </div>
        </header>
        <CodeEditor accessCode={accessCode} />
      </div>
    )
  }

  // Modern Access Code Entry Screen
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-6 shadow-2xl shadow-purple-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Code Assessment</h1>
          <p className="text-gray-500">Enter your access code to begin</p>
        </div>

        {/* Access Code Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <div className="mb-6">
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-400 mb-3">
              Access Code
            </label>
            <div className="relative">
              <input
                type="text"
                id="accessCode"
                value={accessCode}
                onChange={(e) => { setAccessCode(e.target.value.toUpperCase()); setError('') }}
                placeholder="XXXX-XXXX"
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-center text-xl font-mono tracking-[0.3em] uppercase transition-all"
                autoComplete="off"
                autoFocus
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 pointer-events-none"></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
          >
            <span>Start Assessment</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </form>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gray-900/30 backdrop-blur rounded-xl p-4 border border-gray-800/50">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-white font-medium text-sm mb-1">8 Languages</h3>
            <p className="text-gray-500 text-xs">Python, JS, Java, C++, C, Go, Rust, Scala</p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur rounded-xl p-4 border border-gray-800/50">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-medium text-sm mb-1">No Time Limit</h3>
            <p className="text-gray-500 text-xs">Work at your own pace</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
          Powered by <span className="text-gray-500">MaximizeHire</span>
        </p>
      </div>
    </div>
  )
}
