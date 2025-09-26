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
            SELECT p.*, j.nama as jalur_nama, j.biaya as jalur_biaya 
            FROM pembayaran p 
            JOIN jalur j ON p.jalur_id = j.id 
            WHERE p.user_id = ? 
            ORDER BY p.created_at DESC
        ");
        $stmt->execute([$user_id]);
        $pembayaran = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $pembayaran]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    if ($action === 'create_payment') {
        $jalur_id = $input['jalur_id'] ?? null;
        
        if (!$jalur_id) {
            echo json_encode(['success' => false, 'message' => 'Jalur ID harus diisi']);
            exit();
        }
        
        try {
            // Get jalur info
            $stmt = $pdo->prepare("SELECT * FROM jalur WHERE id = ? AND status = 'aktif'");
            $stmt->execute([$jalur_id]);
            $jalur = $stmt->fetch();
            
            if (!$jalur) {
                echo json_encode(['success' => false, 'message' => 'Jalur tidak ditemukan']);
                exit();
            }
            
            // Check if payment already exists
            $stmt = $pdo->prepare("SELECT id FROM pembayaran WHERE user_id = ? AND jalur_id = ? AND status != 'failed'");
            $stmt->execute([$user_id, $jalur_id]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'Pembayaran sudah ada']);
                exit();
            }
            
            $invoice_id = 'INV-' . $user_id . '-' . $jalur_id . '-' . time();
            $amount = $jalur['biaya'];
            $expired_at = date('Y-m-d H:i:s', strtotime('+24 hours'));
            
            // Insert payment record
            $stmt = $pdo->prepare("INSERT INTO pembayaran (user_id, jalur_id, invoice_id, amount, expired_at) 
                VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$user_id, $jalur_id, $invoice_id, $amount, $expired_at]);
            
            // Here you would integrate with Duitku API
            $payment_url = "https://sandbox.duitku.com/payment/" . $invoice_id; // Dummy URL
            
            // Update payment with URL
            $stmt = $pdo->prepare("UPDATE pembayaran SET payment_url = ? WHERE invoice_id = ?");
            $stmt->execute([$payment_url, $invoice_id]);
            
            echo json_encode([
                'success' => true, 
                'message' => 'Invoice berhasil dibuat',
                'data' => [
                    'invoice_id' => $invoice_id,
                    'amount' => $amount,
                    'payment_url' => $payment_url,
                    'expired_at' => $expired_at
                ]
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } elseif ($action === 'check_status') {
        $invoice_id = $input['invoice_id'] ?? '';
        
        try {
            $stmt = $pdo->prepare("SELECT * FROM pembayaran WHERE invoice_id = ? AND user_id = ?");
            $stmt->execute([$invoice_id, $user_id]);
            $payment = $stmt->fetch();
            
            if ($payment) {
                echo json_encode(['success' => true, 'data' => $payment]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Pembayaran tidak ditemukan']);
            }
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