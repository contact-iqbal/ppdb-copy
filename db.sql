CREATE DATABASE IF NOT EXISTS antartika;
USE antartika;
CREATE TABLE sekolah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    telp VARCHAR(50),
    deskripsi TEXT,
    gambar VARCHAR(500),
    jenjang ENUM('SMP', 'SMA', 'SMK') NOT NULL,
    kode_lemdik INT UNIQUE
);
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    wa VARCHAR(20) NOT NULL,
    nik VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO sekolah (nama, alamat, telp, deskripsi, gambar, jenjang, kode_lemdik) VALUES
('SMK Antartika 1 Sidoarjo', 'Jl. Raya Sidoarjo No.1, Sidoarjo, Jawa Timur', '031-1234567', 'SMK Antartika 1 Sidoarjo berlokasi di pusat kota Sidoarjo.', 'https://radarjatim.id/wp-content/uploads/2024/07/WhatsApp-Image-2024-07-15-at-10.48.34.jpeg', 'SMK', 1),
('SMK Antartika 2 Sidoarjo', 'Jl. Diponegoro No.10, Sidoarjo, Jawa Timur', '031-7654321', 'SMK Antartika 2 Sidoarjo fokus pada pengembangan teknologi dan bisnis.', 'https://smkantartika2-sda.sch.id/wp-content/uploads/2025/03/image-392x272.png', 'SMK', 2),
('SMA Antartika Sidoarjo', 'Jl. Pahlawan No.5, Sidoarjo', '031-9876543', 'SMA Antartika Sidoarjo unggul di bidang akademik dan non-akademik.', 'https://smaantarda.sch.id/wp-content/uploads/2024/08/2023-07-06.jpg', 'SMA', 3),
('SMA Antartika Surabaya', 'Jl. Ahmad Yani No.99, Surabaya', '031-111222', 'SMA Antartika Surabaya terkenal dengan program internasional.', 'https://lh5.googleusercontent.com/p/AF1QipO_bti3gDPnkOoUYW3HMx4vd-b0eUG3xsYziwlD=w408-h306-k-no', 'SMA', 4),
('SMP Antartika Surabaya', 'Jl. Mayjen Sungkono No.8, Surabaya', '031-333444', 'SMP Antartika Surabaya memberikan pendidikan berbasis karakter.', 'https://lh5.googleusercontent.com/p/AF1QipMG4mLzz5CvVLRjgxkdhv01ETYT1WRoQ0eCHUbh=w203-h360-k-no', 'SMP', 5);