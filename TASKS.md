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
- [x] Setup Pages Functions — see `functions/api/[[route]].ts`
- [x] Setup **Cloudflare R2 / S3** untuk storage
- [ ] Setup **PostgreSQL** + D1 (Cloudflare) atau Prisma (Railway)
- [ ] Setup **Redis** (Cloudflare KV / Upstash)
- [x] Upgrade **Node.js** ke v22+ (nvm use 22)

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
- [x] Setup Facebook OAuth flow (Login + pilih Page) — `functions/api/auth/facebook/`
- [x] Ambil **long-lived Page Access Token** — `callback.ts`
- [x] Ambil **IG Business Account ID** yang terhubung — `callback.ts`
- [ ] Schema database: `connected_pages` (D1 / PostgreSQL)
- [ ] Simpan token terenkripsi (AES-256) di database
- [ ] Refresh token otomatis sebelum expired
- [ ] Disconnect / hapus koneksi
- [ ] Test OAuth flow happy path (butuh Node v22+)


## Phase 4: Upload & Publish Foto
- [x] API: publish foto ke IG + FB — `functions/api/[[route]].ts` (endpoint `/api/publish/photo`)
- [x] Validation + error handling tested ✅
- [ ] Schema database: `media_uploads` (D1)
- [ ] Upload foto ke R2/S3 dari frontend
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
- [x] Halaman login & register
- [x] Dashboard utama
- [x] Halaman "Connect Account" (OAuth)
- [x] Halaman "Upload" (form + preview)
- [x] Halaman "Daftar Konten" (list + status)
- [x] Halaman "Analytics" (statistik)
- [x] Halaman "Settings" (disconnect, ganti password)
- [x] Responsive (mobile + desktop)

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
