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
DROP POLICY IF EXISTS "Allow public read access" ON products;
CREATE POLICY "Allow public read access"
  ON products FOR SELECT
  USING (true);

-- Allow public write access
-- WARNING: This allows anyone to edit your data. Secure this with auth policies in production.
DROP POLICY IF EXISTS "Allow public write access" ON products;
CREATE POLICY "Allow public write access"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Set up Storage Policies
-- Allow public read access to files
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );

-- Allow public upload access
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'product-images' );

DROP POLICY IF EXISTS "Public Update" ON storage.objects;
CREATE POLICY "Public Update"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'product-images' );

DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
CREATE POLICY "Public Delete"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'product-images' );

-- 5. Create Profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);
