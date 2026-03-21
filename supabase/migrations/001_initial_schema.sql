-- ============================================================
-- MAGNET STICKERS — Initial Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES TABLE
-- Hierarchical: level 1 = main (Animals), level 2 = sub (Dogs), level 3 = breed (Shih Tzu)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  parent_id   UUID REFERENCES categories(id) ON DELETE CASCADE,
  level       INT NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 3),
  image_url   TEXT,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================================
-- PRODUCTS TABLE
-- Each individual magnet SKU
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id           UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name                  TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  description           TEXT,
  printful_product_id   INT,
  printful_variant_id   INT,
  price_cents           INT NOT NULL DEFAULT 1499,
  cost_cents            INT NOT NULL DEFAULT 700,
  images                TEXT[] NOT NULL DEFAULT '{}',
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  is_active             BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);

-- ============================================================
-- BATCHES TABLE
-- Track AI design generation runs
-- ============================================================
CREATE TABLE IF NOT EXISTS batches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  prompts     JSONB NOT NULL DEFAULT '[]',
  total       INT NOT NULL DEFAULT 0,
  generated   INT NOT NULL DEFAULT 0,
  failed      INT NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DESIGNS TABLE
-- Individual AI-generated design assets
-- ============================================================
CREATE TABLE IF NOT EXISTS designs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  batch_id    UUID REFERENCES batches(id) ON DELETE SET NULL,
  prompt_used TEXT NOT NULL,
  image_url   TEXT,
  kie_task_id TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','generating','generated','approved','rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_designs_category ON designs(category_id);
CREATE INDEX idx_designs_status ON designs(status);
CREATE INDEX idx_designs_batch ON designs(batch_id);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paypal_order_id   TEXT UNIQUE,
  customer_email    TEXT NOT NULL,
  customer_name     TEXT NOT NULL,
  shipping_address  JSONB NOT NULL DEFAULT '{}',
  items             JSONB NOT NULL DEFAULT '[]',
  subtotal_cents    INT NOT NULL DEFAULT 0,
  shipping_cents    INT NOT NULL DEFAULT 0,
  total_cents       INT NOT NULL DEFAULT 0,
  currency          TEXT NOT NULL DEFAULT 'USD',
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','fulfilling','shipped','delivered','cancelled','refunded')),
  printful_order_id INT,
  tracking_number   TEXT,
  tracking_url      TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_paypal ON orders(paypal_order_id);

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id            UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name          TEXT NOT NULL,
  product_image         TEXT,
  quantity              INT NOT NULL DEFAULT 1,
  price_cents           INT NOT NULL,
  printful_variant_id   INT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_batches_updated_at
  BEFORE UPDATE ON batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED: Main Categories
-- ============================================================
INSERT INTO categories (name, slug, parent_id, level, sort_order) VALUES
  ('Animals', 'animals', NULL, 1, 1),
  ('Fruits', 'fruits', NULL, 1, 2),
  ('Vegetables', 'vegetables', NULL, 1, 3),
  ('Wildlife', 'wildlife', NULL, 1, 4),
  ('Quotes', 'quotes', NULL, 1, 5),
  ('Food & Drinks', 'food-drinks', NULL, 1, 6),
  ('Nature', 'nature', NULL, 1, 7),
  ('Hobbies', 'hobbies', NULL, 1, 8),
  ('Spiritual', 'spiritual', NULL, 1, 9),
  ('Seasonal', 'seasonal', NULL, 1, 10)
ON CONFLICT (slug) DO NOTHING;

-- Seed Animals sub-categories
WITH animals AS (SELECT id FROM categories WHERE slug = 'animals')
INSERT INTO categories (name, slug, parent_id, level, sort_order)
SELECT sub.name, sub.slug, animals.id, 2, sub.sort_order
FROM animals, (VALUES
  ('Dogs', 'animals-dogs', 1),
  ('Cats', 'animals-cats', 2),
  ('Birds', 'animals-birds', 3),
  ('Fish', 'animals-fish', 4),
  ('Rabbits', 'animals-rabbits', 5),
  ('Hamsters', 'animals-hamsters', 6),
  ('Reptiles', 'animals-reptiles', 7)
) AS sub(name, slug, sort_order)
ON CONFLICT (slug) DO NOTHING;

-- Seed Dogs breeds sub-categories
WITH dogs AS (SELECT id FROM categories WHERE slug = 'animals-dogs')
INSERT INTO categories (name, slug, parent_id, level, sort_order)
SELECT breed.name, breed.slug, dogs.id, 3, breed.sort_order
FROM dogs, (VALUES
  ('Shih Tzu', 'dogs-shih-tzu', 1),
  ('Golden Retriever', 'dogs-golden-retriever', 2),
  ('Labrador Retriever', 'dogs-labrador-retriever', 3),
  ('French Bulldog', 'dogs-french-bulldog', 4),
  ('German Shepherd', 'dogs-german-shepherd', 5),
  ('Beagle', 'dogs-beagle', 6),
  ('Poodle', 'dogs-poodle', 7),
  ('Chihuahua', 'dogs-chihuahua', 8),
  ('Pomeranian', 'dogs-pomeranian', 9),
  ('Husky', 'dogs-husky', 10),
  ('Dachshund', 'dogs-dachshund', 11),
  ('Border Collie', 'dogs-border-collie', 12),
  ('Corgi', 'dogs-corgi', 13),
  ('Bulldog', 'dogs-bulldog', 14),
  ('Rottweiler', 'dogs-rottweiler', 15),
  ('Boxer', 'dogs-boxer', 16),
  ('Maltese', 'dogs-maltese', 17),
  ('Shiba Inu', 'dogs-shiba-inu', 18),
  ('Doberman', 'dogs-doberman', 19),
  ('Dalmatian', 'dogs-dalmatian', 20)
) AS breed(name, slug, sort_order)
ON CONFLICT (slug) DO NOTHING;

-- Seed Cat breeds
WITH cats AS (SELECT id FROM categories WHERE slug = 'animals-cats')
INSERT INTO categories (name, slug, parent_id, level, sort_order)
SELECT breed.name, breed.slug, cats.id, 3, breed.sort_order
FROM cats, (VALUES
  ('Persian Cat', 'cats-persian', 1),
  ('Siamese Cat', 'cats-siamese', 2),
  ('Maine Coon', 'cats-maine-coon', 3),
  ('British Shorthair', 'cats-british-shorthair', 4),
  ('Ragdoll', 'cats-ragdoll', 5),
  ('Bengal Cat', 'cats-bengal', 6),
  ('Scottish Fold', 'cats-scottish-fold', 7),
  ('Sphynx Cat', 'cats-sphynx', 8),
  ('Tabby Cat', 'cats-tabby', 9),
  ('Orange Cat', 'cats-orange', 10)
) AS breed(name, slug, sort_order)
ON CONFLICT (slug) DO NOTHING;

SELECT 'Schema created successfully' AS status;
