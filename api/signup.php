<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$nama = $input['nama'] ?? '';
$tanggal_lahir = $input['tanggal_lahir'] ?? '';
$wa = $input['wa'] ?? '';
$nik = $input['nik'] ?? '';
$lemdik = $input['lemdik'] ?? '';

// Validasi input
if (empty($email) || empty($password) || empty($nama) || empty($tanggal_lahir) || empty($wa) || empty($nik) || empty($lemdik)) {
    echo json_encode(['success' => false, 'message' => 'Semua field harus diisi']);
    exit();
}

try {
    // Cek apakah lemdik valid
    $stmt = $pdo->prepare("SELECT id FROM sekolah WHERE kode_lemdik = :lemdik");
    $stmt->execute(['lemdik' => $lemdik]);
    $sekolah = $stmt->fetch();

    if (!$sekolah) {
        echo json_encode(['success' => false, 'message' => 'Sekolah tidak ditemukan']);
        exit();
    }

    $sekolah_id = $sekolah['id'];

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Cek email sudah ada
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email sudah terdaftar']);
        exit();
    }

    // Cek NIK sudah ada
    $stmt = $pdo->prepare("SELECT id FROM users WHERE nik = ?");
    $stmt->execute([$nik]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'NIK sudah digunakan untuk pendaftaran']);
        exit();
    }

    // Insert data user
    $stmt = $pdo->prepare("INSERT INTO users (email, password, nama, tanggal_lahir, wa, nik, sekolah_id) 
                           VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    if ($stmt->execute([$email, $hashedPassword, $nama, $tanggal_lahir, $wa, $nik, $sekolah_id])) {
        $_SESSION['user'] = [
            'id' => $pdo->lastInsertId(),
            'email' => $email,
            'nama' => $nama,
            'sekolah_id' => $sekolah_id
        ];
        
        echo json_encode([
            'success' => true, 
            'message' => 'Pendaftaran berhasil',
            'user' => [
                'id' => $pdo->lastInsertId(),
                'email' => $email,
                'nama' => $nama
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan saat menyimpan data']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>