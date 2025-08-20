<?php
// filepath: ChatbotProject/ajax/Apis/candidate.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../config/database.php';

// Unificar entrada: POST form, JSON o GET (para pruebas)
$data = $_POST;
if (empty($data)) {
    $raw = file_get_contents('php://input');
    if ($raw) {
        $json = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $data = $json;
        }
    }
}
if (empty($data) && !empty($_GET)) {
    $data = $_GET;
}

$action  = $data['action']  ?? null;
$keyword = isset($data['keyword']) ? trim(strtolower($data['keyword'])) : null;

if (!$action) {
    echo json_encode(['error' => 'No se especificó ninguna acción.']);
    exit;
}

try {
    $pdo = getDatabaseConnection();

    switch ($action) {
        case 'getFlow':
            if (!$keyword) {
                echo json_encode(['error' => 'Falta el parámetro keyword.']);
                exit;
            }

            // 1) Coincidencia exacta
            $stmt = $pdo->prepare("
                SELECT tipo_respuesta, respuesta, botones
                FROM flows
                WHERE LOWER(keyword) = ?
                LIMIT 1
            ");
            $stmt->execute([$keyword]);
            $row = $stmt->fetch();

            // 2) Fallback LIKE (si no hubo exacta)
            if (!$row) {
                $stmt2 = $pdo->prepare("
                    SELECT tipo_respuesta, respuesta, botones
                    FROM flows
                    WHERE ? LIKE CONCAT('%', LOWER(keyword), '%')
                    ORDER BY CHAR_LENGTH(keyword) DESC
                    LIMIT 1
                ");
                $stmt2->execute([$keyword]);
                $row = $stmt2->fetch();
            }

            if (!$row) {
                echo json_encode(['respuesta' => '', 'tipo_respuesta' => 'texto', 'botones' => '[]']);
                exit;
            }

            // Asegurar campos
            $row['tipo_respuesta'] = $row['tipo_respuesta'] ?? 'texto';
            $row['respuesta']      = $row['respuesta'] ?? '';
            $row['botones']        = $row['botones'] ?? '[]';

            echo json_encode($row);
            break;

        default:
            echo json_encode(['error' => 'Acción no reconocida: ' . $action]);
            break;
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Excepción en servidor', 'detail' => $e->getMessage()]);
}
