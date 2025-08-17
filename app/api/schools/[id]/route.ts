import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const row = await db.get("SELECT * FROM schools WHERE id = $1", [params.id]);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  await db.run("DELETE FROM schools WHERE id = $1", [params.id]);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const body = await req.json().catch(() => ({}));

  const allowed = [
    "name","tagline","description","logo_url","banner_url","website","email","phone",
    "address_line1","address_line2","city","state","country","postal_code",
    "principal","established_year","student_count","accreditation","social_links"
  ];

  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const key of allowed) {
    if (key in body) {
      sets.push(`${key} = $${idx++}`);
      values.push(body[key]);
    }
  }
  if (sets.length === 0) {
    return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
  }
  values.push(params.id);
  await db.run(`UPDATE schools SET ${sets.join(", ")} WHERE id = $${idx}`, values);
  const updated = await db.get("SELECT * FROM schools WHERE id = $1", [params.id]);
  return NextResponse.json(updated);
}
