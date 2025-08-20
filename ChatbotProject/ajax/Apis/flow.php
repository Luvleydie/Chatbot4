<?php
declare(strict_types=1);
require_once '../../models/flujo.php';
// CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Función unificada de respuesta
function sendResponse(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendResponse([], 204);
}

// Iniciar sesión para almacenar datos temporales
session_start();

try {
    $raw = file_get_contents('php://input');
    $json = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    $step = $json['step'] ?? '';
    $answer = trim((string)($json['answer'] ?? ''));

    // Lista blanca de pasos
    $validSteps = [
        'welcome', 'ask_age', 'check_age',
        'check_home', 'check_garage', 'check_dependents',
        'check_receipt', 'check_rented', 'final'
    ];
    if (!in_array($step, $validSteps, true)) {
        sendResponse(['ok' => false, 'message' => 'Paso inválido.'], 400);
    }

    // Helper para hacer preguntas
    function question(string $text, string $nextStep): void
    {
        sendResponse(['ok' => true, 'question' => $text, 'nextStep' => $nextStep]);
    }

    switch ($step) {
        case 'welcome':
            question('¡Hola! ¿Cuál es tu rango de edad?', 'ask_age');

        case 'ask_age':
            if (!in_array($answer, ['18-23', '24-30', '31 o más'], true)) {
                sendResponse(['ok' => false, 'message' => 'Rango de edad no válido.']);
            }
            $_SESSION['age_range'] = $answer;
            if ($answer === '18-23') {
                sendResponse(['ok' => false, 'message' => 'Lo siento, no cumples con los requisitos.']);
            }
            question('¿Tienes vivienda propia o prestada?', 'check_home');

        case 'check_home':
            if (!in_array(strtolower($answer), ['vivienda propia', 'vivienda prestada'], true)) {
                sendResponse(['ok' => false, 'message' => 'Respuesta no válida.']);
            }
            $_SESSION['home'] = strtolower($answer);
            question('¿Cuenta con cochera cerrada?', 'check_garage');

        case 'check_garage':
            if (!in_array(strtolower($answer), ['tengo cochera', 'no tengo cochera'], true)) {
                sendResponse(['ok' => false, 'message' => 'Respuesta no válida.']);
            }
            if (strtolower($answer) === 'no tengo cochera') {
                sendResponse(['ok' => false, 'message' => 'Lo siento, no cumples con los requisitos.']);
            }
            question('¿Cuántos dependientes tiene?', 'check_dependents');

        case 'check_dependents':
            if (!in_array($answer, ['Ninguno', '1-2', '3 o más'], true)) {
                sendResponse(['ok' => false, 'message' => 'Respuesta no válida.']);
            }
            if ($answer === '3 o más') {
                sendResponse(['ok' => false, 'message' => 'Lo siento, no cumples con los requisitos.']);
            }
            question('¿Cuenta con recibo predial a su nombre?', 'check_receipt');

        case 'check_receipt':
            if (!in_array(strtolower($answer), ['sí, tengo recibo', 'no, no tengo recibo'], true)) {
                sendResponse(['ok' => false, 'message' => 'Respuesta no válida.']);
            }
            if (strtolower($answer) === 'no, no tengo recibo') {
                sendResponse(['ok' => false, 'message' => 'Lo siento, no cumples con los requisitos.']);
            }
            question('¿Ha rentado auto antes?', 'check_rented');

        case 'check_rented':
            if (!in_array(strtolower($answer), ['he rentado antes', 'nunca he rentado'], true)) {
                sendResponse(['ok' => false, 'message' => 'Respuesta no válida.']);
            }
            sendResponse([
                'ok' => true,
                'message' => '¡Felicidades! Eres apto para una reunión presencial mañana a las 7:00 PM en Venecia 607, cerca del CBTis 110.',
                'location' => 'https://maps.app.goo.gl/TEHcTAbzW2U9ucpQ6'
            ]);

        default:
            sendResponse(['ok' => false, 'message' => 'Operación no reconocida.'], 400);
    }
} catch (JsonException $e) {
    sendResponse(['ok' => false, 'message' => 'JSON inválido.'], 400);
} catch (Throwable $e) {
    error_log($e->getMessage());
    sendResponse(['ok' => false, 'message' => 'Error interno.'], 500);
}