create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 6 and 100),
  property_type text not null check (property_type in ('Appartement', 'Villa', 'Studio', 'Terrain')),
  transaction_type text not null check (transaction_type in ('Louer', 'Acheter')),
  neighborhood text not null check (char_length(btrim(neighborhood)) between 2 and 80),
  address text not null check (char_length(btrim(address)) between 3 and 140),
  price bigint not null check (price between 1 and 10000000000),
  area numeric not null check (area between 1 and 100000),
  rooms integer check (rooms is null or rooms between 1 and 100),
  image_url text check (image_url is null or (char_length(image_url) <= 500 and image_url ~ '^https://')),
  seller_name text not null check (char_length(btrim(seller_name)) between 2 and 80),
  contact_phone text not null check (contact_phone ~ '^\+?[0-9][0-9 ()-]{7,23}$'),
  contact_phone_consent_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists listings_published_created_at_idx
  on public.listings (created_at desc)
  where status = 'published';

alter table public.listings enable row level security;

revoke all on table public.listings from anon, authenticated;
grant select on table public.listings to anon;
grant insert (title, property_type, transaction_type, neighborhood, address, price, area, rooms, image_url, seller_name, contact_phone, contact_phone_consent_at)
  on public.listings to anon;

drop policy if exists "Anyone can read published listings" on public.listings;
create policy "Anyone can read published listings"
  on public.listings for select
  to anon
  using (status = 'published');

drop policy if exists "Anyone can submit listings for review" on public.listings;
create policy "Anyone can submit listings for review"
  on public.listings for insert
  to anon
  with check (
    status = 'pending'
    and contact_phone_consent_at between now() - interval '1 day' and now() + interval '5 minutes'
  );

-- Si la table existait déjà avec l'ancienne version : le consentement doit désormais être envoyé explicitement.
alter table public.listings alter column contact_phone_consent_at drop default;
