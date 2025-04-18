-- Create storage policies for avatars bucket
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Allow public access to view avatars
create policy "Avatar images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatar
create policy "Users can upload avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar
create policy "Users can update own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
create policy "Users can delete own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
); 