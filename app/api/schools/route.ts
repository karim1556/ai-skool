import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Ensure table exists
async function ensureTable() {
  const db = getDb();
  // Try to enable pgcrypto for gen_random_uuid (ignore failures on providers that disallow it)
  try {
    await db.run(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
  } catch {}
  await db.run(`CREATE TABLE IF NOT EXISTS schools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    tagline text,
    description text,
    logo_url text,
    banner_url text,
    website text,
    email text,
    phone text,
    address_line1 text,
    address_line2 text,
    city text,
    state text,
    country text,
    postal_code text,
    principal text,
    established_year int,
    student_count int,
    accreditation text,
    social_links jsonb,
    created_at timestamptz DEFAULT now()
  )`);
}

export async function GET() {
  await ensureTable();
  const db = getDb();
  const rows = await db.all("SELECT * FROM schools ORDER BY created_at DESC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  await ensureTable();
  const db = getDb();

  try {
    const formData = await req.formData();

    const name = (formData.get("name") as string || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Basic validations
    const errors: string[] = [];
    const email = (formData.get("email") as string | null)?.toString().trim() || null;
    const website = (formData.get("website") as string | null)?.toString().trim() || null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Invalid email format");
    if (website && !/^https?:\/\//i.test(website)) errors.push("Website must start with http(s)://");

    // Optional files
    let logoUrl: string | null = null;
    let bannerUrl: string | null = null;

    const logoFile = formData.get("logo") as File | null;
    if (logoFile && logoFile.size > 0) {
      const fileName = `logos/${Date.now()}-${logoFile.name}`;
      const { error } = await supabase.storage.from("course-thumbnails").upload(fileName, logoFile);
      if (error) throw new Error(`Logo upload failed: ${error.message}`);
      const { data } = supabase.storage.from("course-thumbnails").getPublicUrl(fileName);
      logoUrl = data.publicUrl;
    }

    const bannerFile = formData.get("banner") as File | null;
    if (bannerFile && bannerFile.size > 0) {
      const fileName = `banners/${Date.now()}-${bannerFile.name}`;
      const { error } = await supabase.storage.from("course-thumbnails").upload(fileName, bannerFile);
      if (error) throw new Error(`Banner upload failed: ${error.message}`);
      const { data } = supabase.storage.from("course-thumbnails").getPublicUrl(fileName);
      bannerUrl = data.publicUrl;
    }

    // Scalars
    const fields = [
      "tagline","description","website","email","phone","address_line1","address_line2","city","state","country","postal_code","principal","accreditation"
    ] as const;
    const values: Record<string, any> = { name };
    for (const f of fields) values[f] = formData.get(f) || null;

    // Numbers
    const established_year_raw = formData.get("established_year");
    const student_count_raw = formData.get("student_count");
    const established_year = established_year_raw != null && `${established_year_raw}` !== "" ? Number(established_year_raw) : null;
    const student_count = student_count_raw != null && `${student_count_raw}` !== "" ? Number(student_count_raw) : null;
    const currentYear = new Date().getFullYear();
    if (established_year != null) {
      if (!Number.isInteger(established_year) || established_year < 1800 || established_year > currentYear) {
        errors.push(`established_year must be between 1800 and ${currentYear}`);
      }
    }
    if (student_count != null) {
      if (!Number.isFinite(student_count) || student_count < 0) errors.push("student_count must be a non-negative number");
    }

    // JSON
    let social_links: any = null;
    const rawLinks = formData.get("social_links");
    if (rawLinks) {
      try { social_links = JSON.parse(rawLinks as string); } catch { errors.push("social_links must be valid JSON"); }
      if (social_links && typeof social_links !== "object") errors.push("social_links must be an object");
      if (social_links) {
        const allowed = new Set(["facebook","instagram","twitter","linkedin","youtube"]); 
        for (const key of Object.keys(social_links)) {
          if (!allowed.has(key)) errors.push(`social_links.${key} is not allowed`);
          const val = social_links[key];
          if (val && !/^https?:\/\//i.test(String(val))) errors.push(`social_links.${key} must be a URL starting with http(s)://`);
        }
      }
    }

    if (errors.length) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const result = await db.get<{ id: string }>(
      `INSERT INTO schools (
        name, tagline, description, logo_url, banner_url, website, email, phone,
        address_line1, address_line2, city, state, country, postal_code,
        principal, established_year, student_count, accreditation, social_links
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
      ) RETURNING id`,
      [
        values.name,
        values.tagline,
        values.description,
        logoUrl,
        bannerUrl,
        website,
        email,
        values.phone,
        values.address_line1,
        values.address_line2,
        values.city,
        values.state,
        values.country,
        values.postal_code,
        values.principal,
        established_year,
        student_count,
        values.accreditation,
        social_links
      ]
    );

    return NextResponse.json({ id: result?.id, success: true });
  } catch (err) {
    console.error("Create school failed", err);
    return NextResponse.json({ error: "Failed to create school" }, { status: 500 });
  }
}
