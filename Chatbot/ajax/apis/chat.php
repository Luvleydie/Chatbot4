<?php
declare(strict_types=1);

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

// Incluimos el modelo User (sin namespace)
require_once __DIR__ . '/../models/User.php';
session_start();

try {
    $raw    = file_get_contents('php://input');
    $json   = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    $step   = $json['step']   ?? '';
    $answer = trim((string)($json['answer'] ?? ''));

    // Lista blanca de pasos
    $validSteps = [
        'ask_name','ask_age','check_age',
        'check_home','check_manual',
        'check_deposit','check_garage','schedule'
    ];
    if (!in_array($step, $validSteps, true)) {
        sendResponse(['ok'=>false,'message'=>'Paso inválido.'], 400);
    }

    // Helper para hacer preguntas
    function question(string $text, string $nextStep): void
    {
        sendResponse(['ok'=>true,'question'=>$text,'nextStep'=>$nextStep]);
    }

    switch ($step) {
        case 'ask_name':
            question('¿Cuál es tu nombre?', 'ask_age');

        case 'ask_age':
            $_SESSION['name'] = filter_var($answer, FILTER_SANITIZE_STRING);
            question('¿Cuál es tu edad?', 'check_age');

        case 'check_age':
            $age = filter_var($answer, FILTER_VALIDATE_INT, ['options'=>['min_range'=>0]]);
            if ($age === false || $age < 22) {
                sendResponse(['ok'=>false,'message'=>'Debes tener al menos 22 años.']);
            }
            $_SESSION['age'] = $age;
            question('¿Tienes casa propia a tu nombre? (si/no)', 'check_home');

        case 'check_home':
            if (strtolower($answer) !== 'si') {
                sendResponse(['ok'=>false,'message'=>'Se requiere casa propia.']);
            }
            $_SESSION['owns_home'] = true;
            question('¿Sabes manejar auto estándar? (si/no)', 'check_manual');

        case 'check_manual':
            if (strtolower($answer) !== 'si') {
                sendResponse(['ok'=>false,'message'=>'Se requiere manejo estándar.']);
            }
            $_SESSION['knows_manual'] = true;
            question('¿Puedes cubrir un depósito de $3000 MXN? (si/no)', 'check_deposit');

        case 'check_deposit':
            if (strtolower($answer) !== 'si') {
                sendResponse(['ok'=>false,'message'=>'Depósito inicial no cubierto.']);
            }
            $_SESSION['can_deposit'] = true;
            question('¿Tienes cochera propia techada? (si/no)', 'check_garage');

        case 'check_garage':
            if (strtolower($answer) !== 'si') {
                sendResponse(['ok'=>false,'message'=>'Se requiere cochera techada.']);
            }
            $_SESSION['has_garage'] = true;
            sendResponse([
                'ok'             => true,
                'message'        => 'Muy bien, agenda tu entrevista: L-V 18:00-21:00.',
                'ready_schedule' => true
            ]);

        case 'schedule':
            $_SESSION['interview_time'] = filter_var($answer, FILTER_SANITIZE_STRING);
            // ¡Ahora sí funciona new User()!
            $user = new User();
            $id   = $user->save([
                'name'           => $_SESSION['name'],
                'age'            => $_SESSION['age'],
                'owns_home'      => $_SESSION['owns_home'],
                'knows_manual'   => $_SESSION['knows_manual'],
                'can_deposit'    => $_SESSION['can_deposit'],
                'has_garage'     => $_SESSION['has_garage'],
                'interview_time' => $_SESSION['interview_time']
            ]);
            session_destroy();
            sendResponse([
                'ok'      => true,
                'message' => "Entrevista agendada para {$_SESSION['interview_time']}. ID: {$id}"
            ]);

        default:
            sendResponse(['ok'=>false,'message'=>'Operación no reconocida.'], 400);
    }

} catch (JsonException $e) {
    sendResponse(['ok'=>false,'message'=>'JSON inválido.'], 400);
} catch (\PDOException $e) {
    error_log($e->getMessage());
    sendResponse(['ok'=>false,'message'=>'Error de base de datos.'], 500);
} catch (\Throwable $e) {
    error_log($e->getMessage());
    sendResponse(['ok'=>false,'message'=>'Error interno.'], 500);
}
