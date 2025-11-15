import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getAuth } from '@clerk/nextjs/server'

const HMAC_SECRET = process.env.MEDIA_HMAC_SECRET || 'dev_media_secret'
const TTL_SECONDS = Number(process.env.MEDIA_TOKEN_TTL_SECONDS || '120')

function signToken(payload: { path: string; exp: number; userId?: string }) {
  const data = JSON.stringify(payload)
  const b64 = Buffer.from(data).toString('base64url')
  const sig = crypto.createHmac('sha256', HMAC_SECRET).update(data).digest('base64url')
  return `${b64}.${sig}`
}

export async function POST(req: Request) {
  // Ensure caller is authenticated via Clerk
  const auth = getAuth(req as any)
  if (!auth.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try {
    body = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { path } = body || {}
  if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 })

  // NOTE: In a production app, verify the authenticated user is authorized to
  // access this specific media (purchase/enrolment checks). For now we require
  // an authenticated session.

  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS
  const token = signToken({ path, exp, userId: auth.userId })
  return NextResponse.json({ token, expiresAt: exp })
}
