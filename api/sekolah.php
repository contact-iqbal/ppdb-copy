<?php
header("Content-Type: application/json; charset=UTF-8");
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

$jenjang = $_GET['jenjang'] ?? null;

if (!$jenjang) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Jenjang parameter is required'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM sekolah WHERE jenjang = :jenjang ORDER BY nama ASC");
    $stmt->execute(['jenjang' => $jenjang]);
    $sekolahList = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $sekolahList
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

