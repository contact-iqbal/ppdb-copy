<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$lemdik = $_GET['lemdik'] ?? null;

if (!$lemdik) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Lemdik parameter is required']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT nama, gambar FROM sekolah WHERE kode_lemdik = :lemdik");
    $stmt->execute(['lemdik' => $lemdik]);
    $sekolah = $stmt->fetch();
    
    if ($sekolah) {
        echo json_encode(['success' => true, 'sekolah' => $sekolah]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Sekolah tidak ditemukan']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>