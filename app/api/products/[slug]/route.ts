import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { ensureProductsSchema } from "@/lib/products-schema"

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const db = getDb()
  await ensureProductsSchema()
  const { slug } = params
  const row = await db.get<any>(`SELECT * FROM products WHERE slug = $1`, [slug])
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const parsed = { ...row }
  ;["theme","highlights","technologies","kits","addons","tech_specs"].forEach((k) => {
    const v = (parsed as any)[k]
    if (typeof v === 'string') {
      try { (parsed as any)[k] = JSON.parse(v) } catch {}
    }
  })
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
