<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../models/Contact.php';

try {
    $data = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        echo json_encode(['ok' => false, 'message' => 'Faltan campos obligatorios.']);
        exit;
    }
    $contact = new Contact();
    $id = $contact->save($data);
    echo json_encode(['ok' => true, 'message' => 'Mensaje recibido.', 'id' => $id], JSON_UNESCAPED_UNICODE);
} catch (JsonException $e) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'JSON inválido.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Error interno.']);
}