import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured on server' }, { status: 500 });
    const body = await req.json();
    const path = String(body?.path || '').trim();
    if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

    const { data, error } = await supabase.storage.from('course-files').createSignedUrl(path, 3600);
    if (error) {
      console.error('createSignedUrl error', error);
      return NextResponse.json({ error: error.message || 'Failed to create signed URL' }, { status: 500 });
    }
    return NextResponse.json({ signedUrl: data?.signedUrl || null });
  } catch (e:any) {
    console.error('signed-url route error', e);
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
