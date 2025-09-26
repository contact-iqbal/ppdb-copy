<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Remove all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logout successful']);
?>