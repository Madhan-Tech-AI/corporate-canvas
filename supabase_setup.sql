-- Enable the UUID extension (often needed for UUIDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT,
  description TEXT,
  tags TEXT[], -- Array of strings
  availability TEXT DEFAULT 'In Stock',
  medium TEXT,
  size TEXT DEFAULT 'Medium',
  orientation TEXT DEFAULT 'Landscape',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Storage Bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Row Level Security (RLS) for Products table
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access"
  ON products FOR SELECT
  USING (true);

-- Allow public write access
-- WARNING: This allows anyone to edit your data. Secure this with auth policies in production.
CREATE POLICY "Allow public write access"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Set up Storage Policies
-- Allow public read access to files
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );

-- Allow public upload access
CREATE POLICY "Public Upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'product-images' );

CREATE POLICY "Public Update"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'product-images' );

CREATE POLICY "Public Delete"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'product-images' );
