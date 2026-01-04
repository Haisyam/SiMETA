# SIMETA

SIMETA (Sistem Informasi Manajemen Tugas Akademik) adalah web app untuk membantu mahasiswa mengelola deadline tugas, reminder, status progress, dan statistik tugas dalam dashboard modern.

## Fitur Utama

- Auth (Register/Login) dengan Supabase
- CRUD tugas: tambah, edit, hapus
- Filter status, sorting, dan pencarian
- Countdown deadline (H-3, H-0, Terlambat)
- Highlight otomatis untuk deadline dekat/lewat
- Statistik ringkas tugas
- UI dark glassmorphism + animasi Framer Motion
- Notifikasi SweetAlert2 (toast + modal)
- Responsive (mobile-first)

## Tech Stack

- Vite + React (JSX)
- TailwindCSS
- Supabase (Auth + Database + RLS)
- SweetAlert2
- Framer Motion
- Lucide Icons

## Struktur Folder

```
src/
  App.jsx
  AppRouter.jsx
  index.css
  main.jsx
  styles/
    index.css
  lib/
    alerts.js
    supabase.js
  components/
    LoadingScreen.jsx
    Navbar.jsx
    ProtectedRoute.jsx
    Stats.jsx
    TaskCard.jsx
    TaskFormModal.jsx
    TaskSkeleton.jsx
  pages/
    App.jsx
    Login.jsx
    Register.jsx
public/
  logo.svg
  og-image.svg
  robots.txt
  sitemap.xml
```

## Prasyarat

- Node.js 18+
- Akun Supabase

## Quick Start (Local)

1) Install dependencies
```bash
npm install
```

2) Buat file `.env`
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3) Jalankan dev server
```bash
npm run dev
```

## Setup Supabase (Step by Step)

1) Buat project baru di Supabase
2) Jalankan SQL berikut di SQL Editor

```sql
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  course text not null,
  due_date timestamptz not null,
  status text not null check (status in ('todo', 'in_progress', 'done')) default 'todo',
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Users can select own tasks"
  on public.tasks
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on public.tasks
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on public.tasks
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on public.tasks
  for delete
  using (auth.uid() = user_id);
```

3) Set Auth URL Configuration
- Local:
  - Site URL: `http://localhost:5173`
  - Redirect URLs: `http://localhost:5173/login`
- Production:
  - Site URL: `https://simeta.vercel.app`
  - Redirect URLs: `https://simeta.vercel.app/login`

## Script NPM

- `npm run dev` - Jalankan development server
- `npm run build` - Build production
- `npm run preview` - Preview build
- `npm run lint` - Lint project

## Deployment (Vercel)

1) Push repo ke GitHub
2) Import project di Vercel
3) Set environment variables di Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4) Update SEO URL ke domain produksi
   - `index.html`
   - `public/robots.txt`
   - `public/sitemap.xml`

## SEO & Assets

- Favicon: `public/logo.svg`
- OG Image: `public/og-image.svg`
- Robots: `public/robots.txt`
- Sitemap: `public/sitemap.xml`

## Custom Email Template (Opsional)

Supabase mendukung custom template email di dashboard:
- Authentication → Email Templates → Confirm signup
- Gunakan placeholder `{{ .ConfirmationURL }}`

## Troubleshooting

- Data tidak muncul? Pastikan RLS policy sudah aktif dan `user_id` sesuai `auth.uid()`.
- Error auth redirect? Pastikan `Site URL` dan `Redirect URLs` benar.

## License

Pilih license sesuai kebutuhan proyek (mis. MIT) dan tambahkan file `LICENSE` jika akan dipublikasikan sebagai open-source.
