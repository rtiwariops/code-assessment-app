import { NextResponse } from 'next/server'
import { countAssessments } from '@/lib/s3'

// Public, CORS-open stats for the marketing landing (maximizehire.ai).
// Edge-cached ~10 min so S3 is listed at most once per window.
export const revalidate = 600

export async function GET() {
  try {
    const { total, sinceLabel } = await countAssessments()
    return NextResponse.json(
      { total, sinceLabel, languages: 7 },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
        }
      }
    )
  } catch (error) {
    console.error('Stats error:', error)
    // Fail-soft: landing falls back to a rounded number on null
    return NextResponse.json(
      { total: null, sinceLabel: '', languages: 7 },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }
}
