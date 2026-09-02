# Birthday Gift Web 💗

Website kado ulang tahun sederhana menggunakan **HTML + CSS + JavaScript vanilla**.

## Struktur

```text
birthday-gift-web/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   └── app.js
└── assets/
    ├── images/
    │   ├── photo01.jpg ... photo20.jpg
    ├── music/
    │   ├── challenge.mp3
    │   ├── romance.mp3
    │   └── birthday.mp3
    └── video/
        └── birthday.mp4
```

## Cara menjalankan

Karena semuanya static, tidak perlu PHP/backend.

Pilihan paling gampang:
1. Extract ZIP.
2. Masukkan asset foto, musik, dan video ke folder masing-masing.
3. Buka `index.html`.

Atau gunakan Live Server / server static sederhana.

## Mengubah nama & tanggal login

Edit:

```js
// js/config.js
allowedName: "Faisa Nabila",
allowedBirthDate: "03-09-2002",
```

Format tanggal harus **DD-MM-YYYY**.

Validasi berada di `js/app.js`.

## Mengubah foto

Baris atas memakai 10 foto:

```js
topPhotos: [
  "photo01.jpg", ... "photo10.jpg"
]
```

Baris bawah memakai foto berbeda:

```js
bottomPhotos: [
  "photo11.jpg", ... "photo20.jpg"
]
```

Pastikan file tersebut ada di:

```text
assets/images/
```

## Mengubah musik

HTML sudah memanggil:

```text
assets/music/birthday.mp3
assets/music/challenge.mp3
```

Ada juga `romance.mp3` sebagai slot asset jika nanti ingin dipakai untuk bagian pesan romance.

## Video

Taruh video terakhir di:

```text
assets/video/birthday.mp4
```

## Catatan

- Login ini hanya validasi client-side, jadi **bukan sistem keamanan**.
- Cocok untuk website kado/personal surprise.
- Untuk hosting static, bisa langsung dipasang ke GitHub Pages, Netlify, Vercel static hosting, atau hosting biasa.
- Musik browser biasanya membutuhkan interaksi user terlebih dahulu sebelum autoplay. Di sini musik challenge dimulai setelah login dan birthday music setelah tombol Next.
