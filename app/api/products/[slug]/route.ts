import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { ensureProductsSchema } from "@/lib/products-schema"

// Tiny per-slug cache for 10s to reduce DB churn
const bySlugCache = new Map<string, { data: any; ts: number }>()
const TTL = 10_000

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const db = getDb()
  const { slug } = params
  const hit = bySlugCache.get(slug)
  if (hit && Date.now() - hit.ts < TTL) {
    return NextResponse.json(hit.data)
  }
  const row = await db.get<any>(`SELECT * FROM products WHERE slug = $1`, [slug])
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const parsed = { ...row }
  ;["theme","highlights","technologies","kits","addons","tech_specs"].forEach((k) => {
    const v = (parsed as any)[k]
    if (typeof v === 'string') {
      try { (parsed as any)[k] = JSON.parse(v) } catch {}
    }
  })
  bySlugCache.set(slug, { data: parsed, ts: Date.now() })
  return NextResponse.json(parsed)
}

export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const db = getDb()
  await ensureProductsSchema()
  const { slug } = params
  await db.run(`DELETE FROM products WHERE slug = $1`, [slug])
  return NextResponse.json({ ok: true })
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const db = getDb()
    await ensureProductsSchema()
    const body = await req.json()
    const slug = params.slug || body.slug

    const {
      name,
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
      price = null,
      original_price = null,
      rating = null,
      reviews = null,
      image = null,
      category = null,
      is_best_seller = null,
      is_new = null,
      in_stock = null,
      features = null,
      delivery = null,
      level = null,
      instructor = null,
      duration = null,
      students = null,
      tags = null,
      discount = null,
      video_preview = null,
    } = body || {}

    if (!name && !slug) {
      return NextResponse.json({ error: "name or slug are required" }, { status: 400 })
    }

    await db.run(
      `INSERT INTO products (
         name, slug, tagline, description, hero_image, technologies_title, technologies_subtitle,
         highlights_title, highlights_subtitle, tech_overview,
         price, original_price, rating, reviews, image, category, is_best_seller, is_new, in_stock,
         features, delivery, level, instructor, duration, students, tags, discount, video_preview,
         theme, highlights, technologies, kits, addons, tech_specs
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
         $11,$12,$13,$14,$15,$16,$17,$18,$19,
         $20,$21,$22,$23,$24,$25,$26,$27,$28,
         $29::jsonb,$30::jsonb,$31::jsonb,$32::jsonb,$33::jsonb,$34::jsonb
       )
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
         price = EXCLUDED.price,
         original_price = EXCLUDED.original_price,
         rating = EXCLUDED.rating,
         reviews = EXCLUDED.reviews,
         image = EXCLUDED.image,
         category = EXCLUDED.category,
         is_best_seller = EXCLUDED.is_best_seller,
         is_new = EXCLUDED.is_new,
         in_stock = EXCLUDED.in_stock,
         features = EXCLUDED.features,
         delivery = EXCLUDED.delivery,
         level = EXCLUDED.level,
         instructor = EXCLUDED.instructor,
         duration = EXCLUDED.duration,
         students = EXCLUDED.students,
         tags = EXCLUDED.tags,
         discount = EXCLUDED.discount,
         video_preview = EXCLUDED.video_preview,
         theme = EXCLUDED.theme,
         highlights = EXCLUDED.highlights,
         technologies = EXCLUDED.technologies,
         kits = EXCLUDED.kits,
         addons = EXCLUDED.addons,
         tech_specs = EXCLUDED.tech_specs,
         updated_at = NOW()
      `,
      [
        name || body.name || body.title || slug,
        slug,
        tagline,
        description,
        hero_image,
        technologies_title,
        technologies_subtitle,
        highlights_title,
        highlights_subtitle,
        tech_overview,
        price,
        original_price,
        rating,
        reviews,
        image,
        category,
        is_best_seller,
        is_new,
        in_stock,
        features ? JSON.stringify(features) : null,
        delivery,
        level,
        instructor,
        duration,
        students,
        tags ? JSON.stringify(tags) : null,
        discount,
        video_preview,
        theme ? JSON.stringify(theme) : null,
        highlights ? JSON.stringify(highlights) : null,
        technologies ? JSON.stringify(technologies) : null,
        kits ? JSON.stringify(kits) : null,
        addons ? JSON.stringify(addons) : null,
        tech_specs ? JSON.stringify(tech_specs) : null,
      ]
    )

    const saved = await db.get<any>(`SELECT * FROM products WHERE slug = $1`, [slug])
    // Invalidate caches
    try { (global as any).productsCache = null } catch {}
    // Also clear per-slug cache if present
    try { (global as any).bySlugCache?.delete(slug) } catch {}

    console.log('[API] PUT saved product', saved?.slug || slug)
    return NextResponse.json(saved)
  } catch (err: any) {
    console.error('[API] PUT /api/products/:slug error', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
