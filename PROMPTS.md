# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

*Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.**

**Hasil:Tulisan "Masih data contoh" hilang dan 6 kartu produk tetap tampil. Karena isinya mirip data contoh, buktikan datanya dari database:
Di Supabase Table Editor → produk, klik ganda nama satu produk, ubah (misalnya jadi "Kopi Spesial"), tekan Enter.
Muat ulang localhost:3000. Nama produk ikut berubah = berhasil.**

**Perbaikan:-**

## US-02 Detail produk

**Prompt:Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.**

**Hasil:Klik salah satu kartu produk: halaman detail terbuka dengan foto, harga, dan deskripsi.
Ubah deskripsi produk itu di Supabase, muat ulang: deskripsi ikut berubah.
Buka localhost:3000/produk/9999: tampil halaman Halaman tidak ditemukan.**

**Perbaikan:-**

## US-03 Pesan via WhatsApp

**Prompt:Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.**

**Hasil:Klik tombol di halaman detail: WhatsApp Web (atau aplikasi WhatsApp) terbuka ke nomor tokomu, dengan pesan sudah terisi, misalnya "Halo, saya mau pesan Kopi Bubuk Robusta 250 g (Rp 45.000)".**

**Perbaikan:-**

## US-04 Login admin

**Prompt:Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.**

**Hasil:Buka localhost:3000/admin/login, masuk dengan password salah: muncul pesan error.
Masuk dengan email dan password bawaan dari Langkah 4: masuk ke halaman daftar produk admin.
Klik Keluar: kembali ke halaman login.**

**Perbaikan:**

## US-05 Ganti password

**Prompt:Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.**

**Hasil:Login, buka menu Ganti password, isi password baru (minimal 8 karakter). Catat password barumu.
Muncul pesan berhasil.
Klik Keluar, coba login dengan password bawaan: gagal. Login dengan password baru: berhasil.**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.**

**Hasil:Buka jendela penyamaran (Ctrl+Shift+N / Cmd+Shift+N), ketik localhost:3000/admin: langsung dialihkan ke halaman login.
Coba juga localhost:3000/admin/password: dialihkan ke login.
Setelah login, halaman admin terbuka normal.**

**Perbaikan:-**

## US-07 List produk di halaman admin dari database

**Prompt:Baca docs/user-stories.md bagian US-07 dan AGENTS.md bagian aturan keamanan.

Ubah app/admin/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Karena halaman ini hanya untuk admin, ambil data lewat sesi login admin (SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY dengan @supabase/ssr dan cookie), bukan lewat SUPABASE_SECRET_KEY. Urutkan produk dari yang terbaru.

Tampilkan produk dengan komponen tabel/baris admin yang sudah ada, tanpa mengubah tampilannya. Kolom yang ditampilkan: nama, harga (format rupiah), dan stok/status sesuai yang tertulis di user story. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Jangan menambahkan fitur tambah, ubah, atau hapus produk di langkah ini.

Halaman ini tetap hanya bisa diakses admin yang sudah login lewat proxy.js dari US-06. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan elemen lain yang belum terkait US-07.

Setelah selesai, jelaskan singkat file apa saja yang diubah dan cara mengujinya.**

**Hasil:Buka jendela penyamaran (Ctrl+Shift+N / Cmd+Shift+N), ketik localhost:3000/admin: langsung dialihkan ke halaman login.
Setelah login, halaman /admin menampilkan daftar produk yang asli dari database, lengkap dengan nama, harga dalam rupiah, dan stoknya. Produk paling baru ada di paling atas.
Coba kosongkan tabel produk di Supabase: halaman menampilkan tulisan "Belum ada produk".
Coba salahkan nama tabel sebentar: halaman menampilkan pesan error, bukan layar putih.**

**Perbaikan:-**

---

## US-08 Tambah produk (harus terkunci login)

**Prompt:Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-08.

Buat fitur tambah produk di halaman admin. Sambungkan form di app/admin/produk/baru/page.jsx (sesuaikan kalau path-nya berbeda) ke Server Action tambahProduk di app/admin/actions.js, tanpa mengubah tampilan form.

Di dalam Server Action, periksa dulu di server bahwa admin sudah login dengan Supabase Auth (@supabase/ssr dan cookie). Kalau belum login, tolak dan jangan menyimpan apa pun. Jangan hanya mengandalkan proxy.js.

Validasi di server sebelum menyimpan: nama wajib diisi, harga harus angka lebih dari 0, dan field lain sesuai yang tertulis di user story. Kalau ada yang tidak valid, tampilkan pesan error yang jelas di halaman form dan pertahankan isian yang sudah diketik.

Kalau valid, simpan sebagai satu baris baru di tabel "produk". Kalau penyimpanan gagal, tampilkan pesan error yang jelas. Kalau berhasil, panggil revalidatePath untuk /admin dan halaman daftar produk publik, lalu arahkan ke /admin.

Jangan memakai SUPABASE_SECRET_KEY. Pakai sesi login admin (SUPABASE_PUBLISHABLE_KEY). Kalau insert ditolak karena RLS, jangan ganti ke secret key; beri tahu aku policy SQL yang perlu ditambahkan di Supabase untuk pengguna yang sudah login.

Pastikan tombol/tautan "Tambah Produk" di halaman /admin mengarah ke form ini. Jangan menambahkan fitur ubah atau hapus produk di langkah ini. Hapus CatatanBelumAktif yang menyebut US-08, tapi biarkan elemen lain yang belum terkait.

Setelah selesai, jelaskan singkat file apa saja yang diubah dan cara mengujinya.**

**Hasil:Buka jendela penyamaran, ketik localhost:3000/admin/produk/baru: langsung dialihkan ke halaman login.
Setelah login, klik "Tambah Produk", isi form dengan data yang benar, lalu simpan: kamu dibawa kembali ke /admin dan produk barunya sudah ada di daftar. Cek juga halaman publik, produknya harus ikut muncul.
Coba kosongkan nama atau isi harga 0: muncul pesan error yang jelas dan isian lain tidak hilang.**

**Perbaikan:-**

---

## US-09 Ubah produk (harus terkunci login)

**Prompt:Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-09.

Buat fitur ubah produk di halaman admin. Sambungkan form di app/admin/produk/[id]/ubah/page.jsx (sesuaikan kalau path-nya berbeda) ke Server Action ubahProduk di app/admin/actions.js, tanpa mengubah tampilan form.

Di halaman ubah, ambil satu produk dari tabel "produk" berdasarkan id di URL, di sisi server, memakai koneksi di lib/supabase. Isi form dengan data produk yang ada. Kalau produk tidak ditemukan, panggil notFound().

Di dalam Server Action ubahProduk, periksa dulu di server bahwa admin sudah login dengan Supabase Auth (@supabase/ssr dan cookie). Kalau belum login, tolak dan jangan mengubah apa pun. Jangan hanya mengandalkan proxy.js.

Validasi di server dengan aturan yang sama seperti tambahProduk: nama wajib diisi, harga harus angka lebih dari 0, dan field lain sesuai user story. Pakai ulang fungsi validasi dari tambahProduk, jangan menulis ulang. Kalau ada yang tidak valid, tampilkan pesan error yang jelas dan pertahankan isian yang sudah diketik.

Kalau valid, perbarui baris produk dengan id tersebut. Kalau penyimpanan gagal atau produk tidak ditemukan saat update, tampilkan pesan error yang jelas. Kalau berhasil, panggil revalidatePath untuk /admin, halaman daftar produk publik, dan halaman detail produk tersebut, lalu arahkan ke /admin.

Jangan memakai SUPABASE_SECRET_KEY. Pakai sesi login admin (SUPABASE_PUBLISHABLE_KEY). Kalau update ditolak karena RLS, jangan ganti ke secret key; beri tahu aku policy SQL update yang perlu ditambahkan di Supabase untuk pengguna yang sudah login.

Pastikan tombol "Ubah" di setiap baris produk di halaman /admin mengarah ke form ini sesuai id produknya. Jangan menambahkan fitur hapus produk di langkah ini. Hapus CatatanBelumAktif yang menyebut US-09, tapi biarkan elemen lain yang belum terkait.

Setelah selesai, jelaskan singkat file apa saja yang diubah dan cara mengujinya.**

**Hasil:Buka jendela penyamaran, ketik localhost:3000/admin/produk/1/ubah (ganti angka 1 dengan id produk yang ada): langsung dialihkan ke halaman login.
Setelah login, klik "Ubah" di salah satu produk: form terbuka dan sudah terisi data produk itu. Ganti nama atau harganya, simpan, lalu cek /admin, halaman publik, dan halaman detail produk: semuanya sudah berubah.
Buka id yang tidak ada: muncul halaman 404.
Isi data yang salah: muncul pesan error yang jelas dan isian tidak hilang.**

**Perbaikan:-**



## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
