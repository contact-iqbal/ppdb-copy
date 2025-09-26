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

$newPassword = $input['newPassword'] ?? '';
$email = $_SESSION['reset_email'] ?? null;
$user_id = $_SESSION['reset_user_id'] ?? null;

if (empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Password baru harus diisi']);
    exit();
}

if (!$email || !$user_id || empty($_SESSION['otp_verified'])) {
    echo json_encode(['success' => false, 'message' => 'Session tidak valid']);
    exit();
}

try {
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    
    if ($stmt->execute([$hashedPassword, $user_id])) {
        // Clean up session
        unset($_SESSION['reset_email'], $_SESSION['reset_user_id'], $_SESSION['otp_verified']);
        
        // Delete used reset tokens
        $stmt = $pdo->prepare("DELETE FROM password_resets WHERE user_id = ?");
        $stmt->execute([$user_id]);
        
        echo json_encode(['success' => true, 'message' => 'Password berhasil direset']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal mereset password']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>