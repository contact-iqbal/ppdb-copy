/*
  # PPDB Dashboard Database Schema

  1. New Tables
    - `jalur` - Daftar jalur pendaftaran dengan periode dan biaya
    - `user_jalur` - Relasi user dengan jalur yang dipilih
    - `data_diri` - Data lengkap peserta didik
    - `berkas` - Dokumen yang diupload peserta
    - `pembayaran` - Status pembayaran dengan integrasi Duitku
    - `kartu` - Data untuk generate kartu peserta

  2. Security
    - Foreign key constraints untuk data integrity
    - Proper indexing untuk performance
    - Default values untuk consistency

  3. Features
    - Support untuk multiple jalur pendaftaran
    - File upload tracking
    - Payment status tracking
    - Card generation data
*/

-- Tabel jalur pendaftaran
CREATE TABLE IF NOT EXISTS jalur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    periode_mulai DATE NOT NULL,
    periode_selesai DATE NOT NULL,
    biaya DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel relasi user dengan jalur
CREATE TABLE IF NOT EXISTS user_jalur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    jalur_id INT NOT NULL,
    status ENUM('pending', 'aktif', 'selesai') DEFAULT 'pending',
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (jalur_id) REFERENCES jalur(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_jalur (user_id, jalur_id)
);

-- Tabel data diri peserta
CREATE TABLE IF NOT EXISTS data_diri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nisn VARCHAR(20),
    tempat_lahir VARCHAR(100),
    jenis_kelamin ENUM('Laki-laki', 'Perempuan'),
    agama VARCHAR(50),
    alamat TEXT,
    no_hp VARCHAR(20),
    asal_sekolah VARCHAR(200),
    nama_ayah VARCHAR(100),
    nama_ibu VARCHAR(100),
    pekerjaan_ayah VARCHAR(100),
    pekerjaan_ibu VARCHAR(100),
    penghasilan_ortu ENUM('< 1 juta', '1-3 juta', '3-5 juta', '> 5 juta'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_data (user_id)
);

-- Tabel berkas upload
CREATE TABLE IF NOT EXISTS berkas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    jenis_berkas ENUM('kk', 'akta', 'ijazah', 'foto', 'rapor') NOT NULL,
    nama_file VARCHAR(255) NOT NULL,
    path_file VARCHAR(500) NOT NULL,
    ukuran_file INT DEFAULT 0,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    keterangan TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_berkas (user_id, jenis_berkas)
);

-- Tabel pembayaran
CREATE TABLE IF NOT EXISTS pembayaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    jalur_id INT NOT NULL,
    invoice_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'failed', 'expired') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_url TEXT,
    duitku_reference VARCHAR(100),
    paid_at TIMESTAMP NULL,
    expired_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (jalur_id) REFERENCES jalur(id) ON DELETE CASCADE,
    INDEX idx_user_payment (user_id),
    INDEX idx_invoice (invoice_id)
);

-- Tabel kartu peserta
CREATE TABLE IF NOT EXISTS kartu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nomor_peserta VARCHAR(20) UNIQUE NOT NULL,
    qr_code TEXT,
    status ENUM('draft', 'active', 'expired') DEFAULT 'draft',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_kartu (user_id)
);

-- Insert sample jalur data
INSERT INTO jalur (nama, deskripsi, periode_mulai, periode_selesai, biaya, status) VALUES
('BATCH INDEN', 'Jalur pendaftaran batch inden dengan kuota terbatas', '2025-05-05', '2025-09-20', 150000.00, 'nonaktif'),
('BATCH 1', 'Jalur pendaftaran batch pertama', '2025-09-20', '2025-10-24', 150000.00, 'nonaktif'),
('BATCH 2', 'Jalur pendaftaran batch kedua', '2025-10-25', '2025-12-15', 175000.00, 'aktif'),
('BATCH 3', 'Jalur pendaftaran batch ketiga', '2025-12-16', '2026-02-28', 200000.00, 'aktif');

-- Add sekolah_id to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS sekolah_id INT,
ADD FOREIGN KEY (sekolah_id) REFERENCES sekolah(id) ON DELETE SET NULL;