import { getDb } from "./db"

let productsSchemaReady: Promise<void> | null = null

export async function ensureProductsSchema() {
  if (productsSchemaReady) return productsSchemaReady
  productsSchemaReady = (async () => {
  const db = getDb()
  // Create table if not exists
  await db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      -- e-commerce / listing fields
      price NUMERIC,
      original_price NUMERIC,
      rating NUMERIC,
      reviews INTEGER,
      image TEXT,
      category TEXT,
      is_best_seller BOOLEAN DEFAULT FALSE,
      is_new BOOLEAN DEFAULT FALSE,
      in_stock BOOLEAN DEFAULT TRUE,
      features JSONB,
      delivery TEXT,
      level TEXT,
      instructor TEXT,
      duration TEXT,
      students INTEGER,
      tags JSONB,
      discount NUMERIC,
      video_preview TEXT,
      tagline TEXT,
      description TEXT,
      hero_image TEXT,
      technologies_title TEXT,
      technologies_subtitle TEXT,
      highlights_title TEXT,
      highlights_subtitle TEXT,
      tech_overview TEXT,
      theme JSONB,
      highlights JSONB,
      technologies JSONB,
      kits JSONB,
      addons JSONB,
      tech_specs JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)

  // Ensure all columns exist on older tables
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT ''`)
  await db.run(`ALTER TABLE products ALTER COLUMN name DROP DEFAULT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT NOT NULL DEFAULT ''`)
  await db.run(`ALTER TABLE products ALTER COLUMN slug DROP DEFAULT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS tagline TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS hero_image TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS technologies_title TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS technologies_subtitle TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS highlights_title TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS highlights_subtitle TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS tech_overview TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS theme JSONB`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS highlights JSONB`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS technologies JSONB`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS kits JSONB`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS addons JSONB`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS tech_specs JSONB`)
  // Listing / ecommerce fields
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews INTEGER`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT FALSE`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS level TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS instructor TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS duration TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS students INTEGER`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS tags JSONB`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS discount NUMERIC`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS video_preview TEXT`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`)
  await db.run(`ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`)

  // Ensure unique index on slug (if table was created without it)
  await db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`)
  await db.run(`CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at)`)
  await db.run(`CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at)`)
  })()
  return productsSchemaReady
}

export type Product = {
  id: number
  name: string
  slug: string
  tagline?: string
  description?: string
  hero_image?: string
  theme?: any
  highlights?: any
  technologies?: any
  kits?: any
  addons?: any
  tech_specs?: any
}

export const PRODUCT_CATEGORIES = [
  'Development Boards',
  'Competition Kit',
  'Project Kit',
  'Robot Parts & Accessories',
  'Mechanical/Model'
];
