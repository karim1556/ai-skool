import { NextResponse } from 'next/server'
import { hasSupabase, supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const bucket = url.searchParams.get('bucket')
    const path = url.searchParams.get('path')

    if (!bucket || !path) {
      return NextResponse.json({ error: 'bucket and path query params are required' }, { status: 400 })
    }

    if (!hasSupabase || !supabase) {
      return NextResponse.json({ error: 'Supabase not configured on server' }, { status: 500 })
    }

    // If service role key is available on the server, create a short-lived signed URL
    const useSigned = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

    if (useSigned) {
      const expires = 60 * 60 // 1 hour
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expires)
      if (error || !data) {
        console.error('Failed to create signed URL:', error)
        return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 })
      }
      return NextResponse.redirect(data.signedUrl)
    }

    // Otherwise return the public URL (works for public buckets)
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    const publicUrl = data?.publicUrl || data?.public_url || null
    if (!publicUrl) {
      return NextResponse.json({ error: 'Public URL not available for this object' }, { status: 404 })
    }
    return NextResponse.redirect(publicUrl)
  } catch (err) {
    console.error('Storage redirect error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
