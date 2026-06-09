# Task Checklist — MVP UGC App (Instagram + Facebook Page)

## Stack
- **Frontend:** React + Vite + TypeScript (existing)
- **Backend:** Node.js + Express (planned)
- **Database:** PostgreSQL + Prisma
- **Storage:** Cloudflare R2 / S3
- **Queue:** Redis + BullMQ
- **Hosting:** Vercel (FE) + Railway (BE)

---

## Phase 0: Persiapan & Akun
- [ ] Buat Facebook App di [developers.facebook.com](https://developers.facebook.com)
- [ ] Ubah IG pribadi ke **Business / Creator Account**
- [ ] Hubungkan IG ke Facebook Page (Accounts Center)
- [ ] Tambah role **Tester** untuk akun Anda (untuk testing app)
- [ ] Setup project repository (Git)
- [ ] Setup hosting: Vercel + Railway + Cloudflare R2
- [ ] Siapkan domain (opsional)

## Phase 1: Setup Project
- [ ] Setup backend project (Node.js + Express + TypeScript)
- [ ] Setup **PostgreSQL** + Prisma ORM
- [ ] Setup **Redis** (untuk queue)
- [ ] Setup **Cloudflare R2 / S3** untuk storage
- [ ] Setup environment variables (.env)
- [ ] Setup logging & error tracking (Sentry, opsional)

## Phase 2: Auth Lokal
- [ ] Schema database: `users`
- [ ] Register user (email + password)
- [ ] Login user (email + password)
- [ ] Logout user
- [ ] Session management (JWT atau cookie session)
- [ ] Middleware protect route

## Phase 3: OAuth Facebook (Konek IG + FB Page)
- [ ] Schema database: `connected_pages`
- [ ] Setup Facebook OAuth flow (Login + pilih Page)
- [ ] Ambil **long-lived Page Access Token**
- [ ] Ambil **IG Business Account ID** yang terhubung
- [ ] Simpan token terenkripsi (AES-256) di database
- [ ] Refresh token otomatis sebelum expired
- [ ] Disconnect / hapus koneksi

## Phase 4: Upload & Publish Foto
- [ ] Schema database: `media_uploads`
- [ ] Upload foto ke R2/S3 dari frontend
- [ ] API: publish foto ke IG (image_url + caption)
- [ ] API: publish foto ke FB Page (image_url + caption)
- [ ] Simpan `ig_post_id` & `fb_post_id` ke database
- [ ] Handle status: pending, success, failed
- [ ] Handle error & retry logic

## Phase 5: Upload & Publish Video (Reels)
- [ ] Validasi format video (mp4, max size, durasi)
- [ ] Upload video ke R2/S3
- [ ] API: publish video ke IG Reels (container → publish)
- [ ] API: publish video ke FB Page
- [ ] Handle async processing IG (status: IN_PROGRESS → FINISHED)
- [ ] Polling status container sampai selesai
- [ ] Tampilkan error detail kalau gagal

## Phase 6: List & Status Konten
- [ ] Halaman daftar semua upload
- [ ] Filter by status (success / failed / processing)
- [ ] Tampilkan IG & FB post link
- [ ] Hapus / delete post dari IG & FB (opsional)

## Phase 7: Analytics
- [ ] Schema database: `media_analytics`
- [ ] API: ambil likes, comments, reach dari IG
- [ ] API: ambil likes, comments, reach dari FB
- [ ] Scheduled job: refresh analytics tiap 6-24 jam
- [ ] Tampilkan statistik di dashboard

## Phase 8: UI / Frontend
- [ ] Halaman login & register
- [ ] Dashboard utama
- [ ] Halaman "Connect Account" (OAuth)
- [ ] Halaman "Upload" (form + preview)
- [ ] Halaman "Daftar Konten" (list + status)
- [ ] Halaman "Analytics" (statistik)
- [ ] Halaman "Settings" (disconnect, ganti password)
- [ ] Responsive (mobile + desktop)

## Phase 9: Testing & Quality
- [ ] Test OAuth flow happy path
- [ ] Test upload foto ke IG + FB
- [ ] Test upload video ke IG + FB
- [ ] Test error handling (token expired, file gagal, rate limit)
- [ ] Test concurrent uploads
- [ ] Test di mobile
- [ ] Test edge case: caption kosong, file terlalu besar, dll

## Phase 10: Deployment
- [ ] Deploy backend ke Railway / Render
- [ ] Deploy frontend ke Vercel
- [ ] Setup database production
- [ ] Setup R2 production bucket
- [ ] Setup cron job (analytics refresh)
- [ ] Custom domain + SSL
- [ ] Monitoring (Sentry, uptime)
- [ ] Backup database

## Phase 11: App Review Facebook (Post-MVP)
- [ ] Lengkapi App Review form di Facebook
- [ ] Submit untuk permission: `pages_manage_posts`, `instagram_content_publish`, dll
- [ ] Sediakan demo video / testing account
- [ ] Tunggu approval (~3-7 hari kerja)

---

## Catatan
- Mulai dari **Phase 0 → 1 → 2 → 3 → 4 → 5 → 6 → 8 (UI bareng)** sambil testing di setiap phase
- Estimasi total: **~1.5-2 minggu** untuk MVP berjalan
