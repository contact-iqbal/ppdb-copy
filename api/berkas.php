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
        $stmt = $pdo->prepare("SELECT * FROM berkas WHERE user_id = ? ORDER BY jenis_berkas ASC");
        $stmt->execute([$user_id]);
        $berkas = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $berkas]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES) || empty($_FILES)) {
        echo json_encode(['success' => false, 'message' => 'Tidak ada file yang diupload']);
        exit();
    }
    
    $jenis_berkas = $_POST['jenis_berkas'] ?? '';
    if (empty($jenis_berkas)) {
        echo json_encode(['success' => false, 'message' => 'Jenis berkas harus diisi']);
        exit();
    }
    
    $allowed_types = ['kk', 'akta', 'ijazah', 'foto', 'rapor'];
    if (!in_array($jenis_berkas, $allowed_types)) {
        echo json_encode(['success' => false, 'message' => 'Jenis berkas tidak valid']);
        exit();
    }
    
    $file = $_FILES['file'];
    $max_size = 2 * 1024 * 1024; // 2MB
    
    if ($file['size'] > $max_size) {
        echo json_encode(['success' => false, 'message' => 'Ukuran file maksimal 2MB']);
        exit();
    }
    
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'pdf'];
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($file_extension, $allowed_extensions)) {
        echo json_encode(['success' => false, 'message' => 'Format file tidak didukung']);
        exit();
    }
    
    try {
        // Create upload directory if not exists
        $upload_dir = '../uploads/berkas/' . $user_id . '/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        $filename = $jenis_berkas . '_' . time() . '.' . $file_extension;
        $filepath = $upload_dir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            // Delete old file if exists
            $stmt = $pdo->prepare("SELECT path_file FROM berkas WHERE user_id = ? AND jenis_berkas = ?");
            $stmt->execute([$user_id, $jenis_berkas]);
            $old_file = $stmt->fetch();
            
            if ($old_file && file_exists($old_file['path_file'])) {
                unlink($old_file['path_file']);
            }
            
            // Insert or update berkas record
            $stmt = $pdo->prepare("INSERT INTO berkas (user_id, jenis_berkas, nama_file, path_file, ukuran_file) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                nama_file = VALUES(nama_file), 
                path_file = VALUES(path_file), 
                ukuran_file = VALUES(ukuran_file),
                uploaded_at = NOW()");
            $stmt->execute([$user_id, $jenis_berkas, $file['name'], $filepath, $file['size']]);
            
            echo json_encode(['success' => true, 'message' => 'Berkas berhasil diupload']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal mengupload file']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>