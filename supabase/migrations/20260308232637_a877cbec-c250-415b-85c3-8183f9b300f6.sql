INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'isabella-images',
  'isabella-images',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read isabella images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'isabella-images');

CREATE POLICY "Service role insert isabella images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'isabella-images');