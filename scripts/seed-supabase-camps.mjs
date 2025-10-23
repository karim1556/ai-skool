#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env if present
dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase URL or Key not set. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment or .env file.')
  process.exit(1)
}

import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const dataPath = path.join(process.cwd(), 'data', 'camps.json')
if (!fs.existsSync(dataPath)) {
  console.error('data/camps.json not found in project root')
  process.exit(1)
}

const raw = fs.readFileSync(dataPath, 'utf-8')
let camps
try {
  camps = JSON.parse(raw)
} catch (err) {
  console.error('Failed to parse data/camps.json', err)
  process.exit(1)
}

async function seed() {
  console.log(`Seeding ${camps.length} camps to Supabase table 'camps'`)
  // Normalize each camp to Supabase-friendly columns
  const toUpsert = camps.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description || null,
    long_description: c.longDescription || c.long_description || null,
    tagline: c.tagline || null,
    grade: c.grade || null,
    duration: c.duration || null,
    schedule: c.schedule || null,
    level: c.level || null,
    format: c.format || null,
    category: c.category || null,
    image: c.image || null,
    subjects: Array.isArray(c.subjects) ? c.subjects : (c.subjects ? JSON.parse(c.subjects) : []),
    skills: Array.isArray(c.skills) ? c.skills : (c.skills ? JSON.parse(c.skills) : []),
    weeks: Array.isArray(c.weeks) ? c.weeks : (c.weeks ? JSON.parse(c.weeks) : []),
    price: c.price ?? null,
    original_price: c.originalPrice ?? c.original_price ?? null,
    seats: c.seats ?? null,
    rating: c.rating ?? null,
    projects: c.projects ?? null,
    emoji: c.emoji ?? null,
    popular: Boolean(c.popular),
    featured: Boolean(c.featured),
    created_at: c.createdAt || c.created_at || new Date().toISOString(),
    video_preview: c.video || c.video_preview || null,
    highlights: Array.isArray(c.highlights) ? c.highlights : (c.highlights ? JSON.parse(c.highlights) : null)
  }))

  // Upsert into Supabase. Use on conflict on id so rerunning is safe.
  let payload = JSON.parse(JSON.stringify(toUpsert))
  while (true) {
    const { data, error } = await supabase.from('camps').upsert(payload, { onConflict: 'id' }).select()
    if (!error) {
      console.log(`Seed completed: ${data ? data.length : payload.length} rows upserted.`)
      break
    }
    console.error('Supabase upsert error:', error)
    // Detect missing-column error and strip that field from payload and retry
    const msg = String(error.message || '')
    const m = msg.match(/Could not find the '([^']+)' column/)
    if (m && m[1]) {
      const col = m[1]
      console.warn(`Removing missing column '${col}' from payload and retrying`)
      payload = payload.map((r) => {
        const copy = { ...r }
        delete copy[col]
        return copy
      })
      // continue loop and retry
      continue
    }
    // If we can't parse the column, abort with the original error
    process.exit(1)
  }
}

seed().catch((err) => { console.error(err); process.exit(1) })
