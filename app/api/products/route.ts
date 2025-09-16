import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { ensureProductsSchema } from "@/lib/products-schema"

// Simple in-memory cache for product list (10s)
let productsCache: { data: any[]; ts: number } | null = null
const CACHE_TTL_MS = 10_000

export async function GET() {
  const db = getDb()
  // Serve from cache if fresh
  if (productsCache && Date.now() - productsCache.ts < CACHE_TTL_MS) {
    return NextResponse.json(productsCache.data)
  }
  // Do not run schema in GET to avoid locks during traffic
  const rows = await db.all<any>(`SELECT * FROM products ORDER BY created_at DESC`)
  const parsed = rows.map((row: any) => {
    const r = { ...row }
    ;["theme","highlights","technologies","kits","addons","tech_specs"].forEach((k) => {
      const v = (r as any)[k]
      if (typeof v === 'string') {
        try { (r as any)[k] = JSON.parse(v) } catch {}
      }
    })
    return r
  })
  productsCache = { data: parsed, ts: Date.now() }
  return NextResponse.json(parsed)
}

export async function POST(req: Request) {
  const db = getDb()
  await ensureProductsSchema()
  const body = await req.json()
  const {
    name,
    slug,
    tagline = null,
    description = null,
    hero_image = null,
    technologies_title = null,
    technologies_subtitle = null,
    highlights_title = null,
    highlights_subtitle = null,
    tech_overview = null,
    theme = null,
    highlights = null,
    technologies = null,
    kits = null,
    addons = null,
    tech_specs = null,
  } = body || {}

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 })
  }

  await db.run(
    `INSERT INTO products (name, slug, tagline, description, hero_image, technologies_title, technologies_subtitle, highlights_title, highlights_subtitle, tech_overview, theme, highlights, technologies, kits, addons, tech_specs)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb)
     ON CONFLICT (slug) DO UPDATE SET
       name = EXCLUDED.name,
       tagline = EXCLUDED.tagline,
       description = EXCLUDED.description,
       hero_image = EXCLUDED.hero_image,
       technologies_title = EXCLUDED.technologies_title,
       technologies_subtitle = EXCLUDED.technologies_subtitle,
       highlights_title = EXCLUDED.highlights_title,
       highlights_subtitle = EXCLUDED.highlights_subtitle,
       tech_overview = EXCLUDED.tech_overview,
       theme = EXCLUDED.theme,
       highlights = EXCLUDED.highlights,
       technologies = EXCLUDED.technologies,
       kits = EXCLUDED.kits,
       addons = EXCLUDED.addons,
       tech_specs = EXCLUDED.tech_specs,
       updated_at = NOW()
    `,
    [
      name,
      slug,
      tagline,
      description,
      hero_image,
      technologies_title,
      technologies_subtitle,
      highlights_title,
      highlights_subtitle,
      tech_overview,
      theme ? JSON.stringify(theme) : null,
      highlights ? JSON.stringify(highlights) : null,
      technologies ? JSON.stringify(technologies) : null,
      kits ? JSON.stringify(kits) : null,
      addons ? JSON.stringify(addons) : null,
      tech_specs ? JSON.stringify(tech_specs) : null,
    ]
  )

  const saved = await db.get<any>(`SELECT * FROM products WHERE slug = $1`, [slug])
  // Invalidate cache after write
  productsCache = null
  return NextResponse.json(saved, { status: 201 })
}
