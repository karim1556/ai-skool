import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { supabase } from "@/lib/supabase";

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
  const ct = req.headers.get("content-type") || "";

  // Fields allowed to update
  const allowed = new Set([
    "name","tagline","description","logo_url","banner_url","website","email","phone",
    "address_line1","address_line2","city","state","country","postal_code",
    "principal","established_year","student_count","accreditation","social_links"
  ]);

  // Helper to persist
  const persist = async (data: Record<string, any>) => {
    const sets: string[] = [];
    const values: any[] = [];
    let idx = 1;
    for (const key of Object.keys(data)) {
      if (allowed.has(key)) {
        sets.push(`${key} = $${idx++}`);
        values.push(data[key]);
      }
    }
    if (sets.length === 0) {
      return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
    }
    values.push(params.id);
    await db.run(`UPDATE schools SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    const updated = await db.get("SELECT * FROM schools WHERE id = $1", [params.id]);
    return NextResponse.json(updated);
  };

  // Multipart/form-data path (supports file uploads like create)
  if (ct.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();

      const payload: Record<string, any> = {};
      for (const key of allowed) {
        const val = formData.get(key);
        if (val != null && typeof val !== "object") {
          payload[key] = `${val}`;
        }
      }

      // Parse social_links if provided
      const rawLinks = formData.get("social_links");
      if (rawLinks && typeof rawLinks !== "object") {
        try { payload["social_links"] = JSON.parse(String(rawLinks)); } catch {}
      }

      // Optional files: logo, banner
      const logoFile = formData.get("logo") as File | null;
      if (logoFile && logoFile.size > 0) {
        const fileName = `logos/${Date.now()}-${logoFile.name}`;
        const { error } = await supabase.storage.from("course-thumbnails").upload(fileName, logoFile);
        if (error) return NextResponse.json({ error: `Logo upload failed: ${error.message}` }, { status: 400 });
        const { data } = supabase.storage.from("course-thumbnails").getPublicUrl(fileName);
        payload["logo_url"] = data.publicUrl;
      }

      const bannerFile = formData.get("banner") as File | null;
      if (bannerFile && bannerFile.size > 0) {
        const fileName = `banners/${Date.now()}-${bannerFile.name}`;
        const { error } = await supabase.storage.from("course-thumbnails").upload(fileName, bannerFile);
        if (error) return NextResponse.json({ error: `Banner upload failed: ${error.message}` }, { status: 400 });
        const { data } = supabase.storage.from("course-thumbnails").getPublicUrl(fileName);
        payload["banner_url"] = data.publicUrl;
      }

      return await persist(payload);
    } catch (e) {
      console.error("PUT multipart failed", e);
      return NextResponse.json({ error: "Failed to update school (multipart)" }, { status: 500 });
    }
  }

  // JSON path (backward compatible)
  const body = await req.json().catch(() => ({}));
  // If social_links provided as string, try parsing to object; store as-is if object
  if (typeof body.social_links === "string") {
    try { body.social_links = JSON.parse(body.social_links); } catch {}
  }
  return await persist(body);
}
