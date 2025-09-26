<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT * FROM jalur ORDER BY periode_mulai ASC");
        $stmt->execute();
        $jalur = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $jalur]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit();
    }
    
    $user_id = $_SESSION['user']['id'];
    $jalur_id = $input['jalur_id'] ?? null;
    
    if (!$jalur_id) {
        echo json_encode(['success' => false, 'message' => 'Jalur ID harus diisi']);
        exit();
    }
    
    try {
        // Check if jalur exists and active
        $stmt = $pdo->prepare("SELECT * FROM jalur WHERE id = ? AND status = 'aktif'");
        $stmt->execute([$jalur_id]);
        $jalur = $stmt->fetch();
        
        if (!$jalur) {
            echo json_encode(['success' => false, 'message' => 'Jalur tidak ditemukan atau tidak aktif']);
            exit();
        }
        
        // Check if user already has jalur
        $stmt = $pdo->prepare("SELECT id FROM user_jalur WHERE user_id = ?");
        $stmt->execute([$user_id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Anda sudah memilih jalur pendaftaran']);
            exit();
        }
        
        // Insert user jalur
        $stmt = $pdo->prepare("INSERT INTO user_jalur (user_id, jalur_id, status) VALUES (?, ?, 'aktif')");
        $stmt->execute([$user_id, $jalur_id]);
        
        echo json_encode(['success' => true, 'message' => 'Jalur berhasil dipilih']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>