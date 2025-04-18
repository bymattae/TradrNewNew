-- Create storage bucket for brand assets
insert into storage.buckets (id, name, public) values ('brand_assets', 'brand_assets', true);

-- Allow public access to view brand assets
create policy "Brand assets are publicly accessible"
on storage.objects for select
using ( bucket_id = 'brand_assets' );

-- Allow authenticated users to upload brand assets
create policy "Authenticated users can upload brand assets"
on storage.objects for insert
with check (
  bucket_id = 'brand_assets' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to update brand assets
create policy "Authenticated users can update brand assets"
on storage.objects for update
using (
  bucket_id = 'brand_assets'
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to delete brand assets
create policy "Authenticated users can delete brand assets"
on storage.objects for delete
using (
  bucket_id = 'brand_assets'
  and auth.role() = 'authenticated'
); 