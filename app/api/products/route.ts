import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { ensureProductsSchema } from "@/lib/products-schema"

export async function GET() {
  const db = getDb()
  await ensureProductsSchema()
  const rows = await db.all<any>(`SELECT * FROM products ORDER BY created_at DESC`)
  return NextResponse.json(rows)
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
    `INSERT INTO products (name, slug, tagline, description, hero_image, theme, highlights, technologies, kits, addons, tech_specs)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb, $11::jsonb)
     ON CONFLICT (slug) DO UPDATE SET
       name = EXCLUDED.name,
       tagline = EXCLUDED.tagline,
       description = EXCLUDED.description,
       hero_image = EXCLUDED.hero_image,
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
      theme ? JSON.stringify(theme) : null,
      highlights ? JSON.stringify(highlights) : null,
      technologies ? JSON.stringify(technologies) : null,
      kits ? JSON.stringify(kits) : null,
      addons ? JSON.stringify(addons) : null,
      tech_specs ? JSON.stringify(tech_specs) : null,
    ]
  )

  const saved = await db.get<any>(`SELECT * FROM products WHERE slug = $1`, [slug])
  return NextResponse.json(saved, { status: 201 })
}
