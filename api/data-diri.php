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
        $stmt = $pdo->prepare("SELECT * FROM data_diri WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $data = $stmt->fetch();
        
        echo json_encode(['success' => true, 'data' => $data]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $required_fields = ['nisn', 'tempat_lahir', 'jenis_kelamin', 'agama', 'alamat', 'no_hp', 'asal_sekolah'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            echo json_encode(['success' => false, 'message' => "Field $field harus diisi"]);
            exit();
        }
    }
    
    try {
        // Check if data already exists
        $stmt = $pdo->prepare("SELECT id FROM data_diri WHERE user_id = ?");
        $stmt->execute([$user_id]);
        
        if ($stmt->rowCount() > 0) {
            // Update existing data
            $stmt = $pdo->prepare("UPDATE data_diri SET 
                nisn = ?, tempat_lahir = ?, jenis_kelamin = ?, agama = ?, alamat = ?, 
                no_hp = ?, asal_sekolah = ?, nama_ayah = ?, nama_ibu = ?, 
                pekerjaan_ayah = ?, pekerjaan_ibu = ?, penghasilan_ortu = ?, updated_at = NOW()
                WHERE user_id = ?");
            $stmt->execute([
                $input['nisn'], $input['tempat_lahir'], $input['jenis_kelamin'], 
                $input['agama'], $input['alamat'], $input['no_hp'], $input['asal_sekolah'],
                $input['nama_ayah'] ?? '', $input['nama_ibu'] ?? '', 
                $input['pekerjaan_ayah'] ?? '', $input['pekerjaan_ibu'] ?? '', 
                $input['penghasilan_ortu'] ?? '', $user_id
            ]);
        } else {
            // Insert new data
            $stmt = $pdo->prepare("INSERT INTO data_diri 
                (user_id, nisn, tempat_lahir, jenis_kelamin, agama, alamat, no_hp, asal_sekolah, 
                nama_ayah, nama_ibu, pekerjaan_ayah, pekerjaan_ibu, penghasilan_ortu) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $user_id, $input['nisn'], $input['tempat_lahir'], $input['jenis_kelamin'], 
                $input['agama'], $input['alamat'], $input['no_hp'], $input['asal_sekolah'],
                $input['nama_ayah'] ?? '', $input['nama_ibu'] ?? '', 
                $input['pekerjaan_ayah'] ?? '', $input['pekerjaan_ibu'] ?? '', 
                $input['penghasilan_ortu'] ?? ''
            ]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Data diri berhasil disimpan']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>