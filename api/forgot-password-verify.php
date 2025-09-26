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

$otp = trim($input['otp'] ?? '');
$user_id = $_SESSION['reset_user_id'] ?? null;

if (empty($otp)) {
    echo json_encode(['success' => false, 'message' => 'OTP harus diisi']);
    exit();
}

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Session tidak valid']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM password_resets WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$user_id]);
    $reset = $stmt->fetch();

    if ($reset && $reset['otp'] == $otp && strtotime($reset['expires_at']) > time()) {
        $_SESSION['otp_verified'] = true;
        echo json_encode(['success' => true, 'message' => 'OTP valid, silakan buat password baru.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'OTP salah atau sudah kadaluarsa!']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>