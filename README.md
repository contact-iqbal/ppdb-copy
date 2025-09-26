# PPDB SMK Antartika 2 Sidoarjo - Next.js Version

Portal Penerimaan Peserta Didik Baru (PPDB) SMK Antartika 2 Sidoarjo yang dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS.

## Fitur

- ✅ Halaman utama dengan informasi PPDB
- ✅ Pemilihan jenjang pendidikan (SMP, SMA, SMK)
- ✅ Pemilihan sekolah berdasarkan jenjang
- ✅ Sistem registrasi dan login
- ✅ Reset password dengan OTP via email
- ✅ Dashboard pengguna
- ✅ Responsive design dengan Tailwind CSS
- ✅ Backend API PHP dengan MySQL

## Teknologi yang Digunakan

### Frontend
- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (via CDN)
- **Font Awesome** - Icons
- **SweetAlert2** - Alert notifications
- **Alpine.js** - Lightweight JavaScript framework

### Backend
- **PHP 8+** - Server-side logic
- **MySQL** - Database (via Laragon)
- **PHPMailer** - Email functionality

## Instalasi dan Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd ppdb-nextjs
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
1. Pastikan Laragon sudah running
2. Import database dari file `db.sql` ke MySQL
3. Database akan dibuat dengan nama `antartika`

### 4. Setup PHP Backend
1. Pastikan PHP 8+ sudah terinstall
2. Install Composer dependencies untuk PHPMailer:
```bash
cd api
composer install
```

### 5. Konfigurasi Email (Opsional)
Edit file `mailer.php` untuk konfigurasi SMTP:
```php
$mail->Username   = 'your-email@gmail.com';
$mail->Password   = 'your-app-password';
```

### 6. Jalankan Aplikasi

#### Development Mode
```bash
# Terminal 1: Jalankan Next.js
npm run dev

# Terminal 2: Jalankan PHP Server
npm run php-server
# atau manual: php -S localhost:8080 -t api/
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Struktur Proyek

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Halaman utama
│   │   ├── welcome/           # Halaman selamat datang
│   │   ├── jenjang/           # Pemilihan jenjang
│   │   ├── sekolah/           # Pemilihan sekolah
│   │   ├── signin/            # Login
│   │   ├── signup/            # Registrasi
│   │   ├── forgot-password/   # Reset password
│   │   └── dashboard/         # Dashboard user
│   └── components/            # Reusable components
├── api/                       # PHP Backend
│   ├── config.php            # Database configuration
│   ├── signin.php            # Login API
│   ├── signup.php            # Registration API
│   ├── sekolah.php           # School data API
│   └── forgot-password-*.php # Password reset APIs
├── public/                   # Static assets
└── db.sql                   # Database schema
```

## API Endpoints

### Authentication
- `POST /api/signin.php` - User login
- `POST /api/signup.php` - User registration
- `GET /api/check-auth.php` - Check authentication status
- `POST /api/logout.php` - User logout

### School Data
- `GET /api/sekolah.php?jenjang={jenjang}` - Get schools by level
- `GET /api/sekolah-detail.php?lemdik={code}` - Get school details

### Password Reset
- `POST /api/forgot-password-send.php` - Send OTP
- `POST /api/forgot-password-verify.php` - Verify OTP
- `POST /api/forgot-password-reset.php` - Reset password

## Database Schema

### Tabel `sekolah`
- `id` - Primary key
- `nama` - Nama sekolah
- `alamat` - Alamat sekolah
- `telp` - Nomor telepon
- `deskripsi` - Deskripsi sekolah
- `gambar` - URL gambar sekolah
- `jenjang` - Jenjang (SMP/SMA/SMK)
- `kode_lemdik` - Kode unik sekolah

### Tabel `users`
- `id` - Primary key
- `email` - Email pengguna
- `password` - Password (hashed)
- `nama` - Nama lengkap
- `tanggal_lahir` - Tanggal lahir
- `wa` - Nomor WhatsApp
- `nik` - NIK
- `sekolah_id` - Foreign key ke tabel sekolah
- `created_at` - Timestamp

## Fitur Keamanan

- ✅ Password hashing dengan PHP `password_hash()`
- ✅ SQL injection protection dengan prepared statements
- ✅ CORS configuration untuk API
- ✅ Session management
- ✅ Input validation dan sanitization
- ✅ OTP-based password reset

## Responsive Design

Aplikasi ini fully responsive dengan breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.