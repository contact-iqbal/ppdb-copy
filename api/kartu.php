<?php
include 'config.php';

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$user_id = $_SESSION['user']['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("
            SELECT k.*, u.nama, u.email, u.wa, s.nama as sekolah_nama 
            FROM kartu k
            JOIN users u ON k.user_id = u.id
            LEFT JOIN sekolah s ON u.sekolah_id = s.id
            WHERE k.user_id = ?
        ");
        $stmt->execute([$user_id]);
        $kartu = $stmt->fetch();
        
        echo json_encode(['success' => true, 'data' => $kartu]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    if ($action === 'generate') {
        try {
            // Check if user has paid
            $stmt = $pdo->prepare("SELECT COUNT(*) as paid_count FROM pembayaran WHERE user_id = ? AND status = 'paid'");
            $stmt->execute([$user_id]);
            $payment_check = $stmt->fetch();
            
            if ($payment_check['paid_count'] == 0) {
                echo json_encode(['success' => false, 'message' => 'Selesaikan pembayaran terlebih dahulu']);
                exit();
            }
            
            // Generate nomor peserta
            $nomor_peserta = '2025-' . str_pad($user_id, 5, '0', STR_PAD_LEFT);
            
            // Insert or update kartu
            $stmt = $pdo->prepare("INSERT INTO kartu (user_id, nomor_peserta, status) 
                VALUES (?, ?, 'active') 
                ON DUPLICATE KEY UPDATE 
                nomor_peserta = VALUES(nomor_peserta), 
                status = VALUES(status),
                generated_at = NOW()");
            $stmt->execute([$user_id, $nomor_peserta]);
            
            echo json_encode(['success' => true, 'message' => 'Kartu peserta berhasil dibuat']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>