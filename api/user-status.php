<?php
include 'config.php';

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$user_id = $_SESSION['user']['id'];

try {
    // Get user with sekolah info
    $stmt = $pdo->prepare("
        SELECT u.*, s.nama as sekolah_nama 
        FROM users u 
        LEFT JOIN sekolah s ON u.sekolah_id = s.id 
        WHERE u.id = ?
    ");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    
    // Check jalur selection
    $stmt = $pdo->prepare("
        SELECT uj.*, j.nama as jalur_nama 
        FROM user_jalur uj 
        JOIN jalur j ON uj.jalur_id = j.id 
        WHERE uj.user_id = ?
    ");
    $stmt->execute([$user_id]);
    $jalur = $stmt->fetch();
    
    // Check data diri completion
    $stmt = $pdo->prepare("SELECT id FROM data_diri WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $data_diri_complete = $stmt->rowCount() > 0;
    
    // Check berkas upload
    $stmt = $pdo->prepare("SELECT COUNT(*) as uploaded_count FROM berkas WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $berkas_count = $stmt->fetch()['uploaded_count'];
    
    // Check payment status
    $stmt = $pdo->prepare("SELECT status FROM pembayaran WHERE user_id = ? ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$user_id]);
    $payment = $stmt->fetch();
    $payment_status = $payment ? $payment['status'] : 'none';
    
    // Check kartu generation
    $stmt = $pdo->prepare("SELECT id FROM kartu WHERE user_id = ? AND status = 'active'");
    $stmt->execute([$user_id]);
    $kartu_generated = $stmt->rowCount() > 0;
    
    echo json_encode([
        'success' => true,
        'data' => [
            'user' => $user,
            'jalur' => $jalur,
            'data_diri_complete' => $data_diri_complete,
            'berkas_count' => $berkas_count,
            'payment_status' => $payment_status,
            'kartu_generated' => $kartu_generated
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>