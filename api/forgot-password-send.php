<?php
include 'config.php';
require_once '../mailer.php';

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

$email = trim($input['email'] ?? '');

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email harus diisi']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        $user_id = $user['id'];
        $otp = rand(100000, 999999);
        $expires_at = date("Y-m-d H:i:s", strtotime("+10 minutes"));

        // Create password_resets table if not exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            otp VARCHAR(6) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )");

        $stmt = $pdo->prepare("INSERT INTO password_resets (user_id, otp, expires_at, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$user_id, $otp, $expires_at]);

        if (sendOtpMail($email, $otp)) {
            $_SESSION['reset_email'] = $email;
            $_SESSION['reset_user_id'] = $user_id;
            echo json_encode(['success' => true, 'message' => 'OTP sudah dikirim ke email!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal mengirim OTP!']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Email tidak ditemukan!']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>