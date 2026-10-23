# JAJANANKU — Jajanan Trending

Website toko jajanan trending (Seblak, Basreng, Croffle, Boba, dll.) dengan harga asli, dibangun sebagai single-page app (HTML/CSS/JS).

## Preview lokal

```bash
python -m http.server 8765
# buka http://127.0.0.1:8765/
```

## Hosting (GitHub Pages)

1. Buat repository baru di GitHub (mis. `jajananku`).
2. Hubungkan & push:
   ```bash
   git remote add origin https://github.com/USERNAME/jajananku.git
   git branch -M main
   git push -u origin main
   ```
3. Di GitHub → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / folder `/ (root)` → Save.
4. Site akan tersedia di `https://USERNAME.github.io/jajananku/`.

## Struktur

- `index.html` — semua view (Beranda, Semua Produk, Detail, Checkout, Akun, Cek Pesanan, Kontak, Informasi)
- `style.css` — design system
- `app.js` — logika & data produk
- `.nojekyll` — nonaktifkan Jekyll di GitHub Pages
