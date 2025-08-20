<?php


class CandidatoModel
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = new PDO('mysql:host=localhost;dbname=chatbot', 'root', '');
    }

    public function findByPhone(string $telefono): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM candidates WHERE telefono = :telefono');
        $stmt->execute([':telefono' => $telefono]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ?: null;
    }

    public function updateState(int $id_usuario, string $estado): bool
    {
        $stmt = $this->pdo->prepare('UPDATE candidates SET estado = :estado WHERE id = :id_usuario');
        return $stmt->execute([':estado' => $estado, ':id_usuario' => $id_usuario]);
    }

    public function save(array $data): int
    {
        $stmt = $this->pdo->prepare('
            INSERT INTO candidates (name, age, home, garage, dependents, receipt, rented)
            VALUES (:name, :age, :home, :garage, :dependents, :receipt, :rented)
        ');
        $stmt->execute([
            ':name' => $data['name'],
            ':age' => $data['age'],
            ':home' => $data['home'],
            ':garage' => $data['garage'],
            ':dependents' => $data['dependents'],
            ':receipt' => $data['receipt'],
            ':rented' => $data['rented']
        ]);

        return $this->pdo->lastInsertId();
    }
}
declare(strict_types=1);

require_once '../../models/candidato.php'; // Asegúrate de que la ruta es correcta

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

try {
    $data = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
    $action = $data['action'] ?? '';

    $candidatoModel = new CandidatoModel();
    switch ($action) {
        case 'getUser':
            $telefono = $data['telefono'] ?? '';
            $user = $candidatoModel->findByPhone($telefono);
            echo json_encode(['ok' => true, 'user' => $user]);
            break;

        case 'updateState':
            $id_usuario = $data['id_usuario'] ?? '';
            $estado = $data['estado'] ?? '';
            $success = $candidatoModel->updateState($id_usuario, $estado);
            echo json_encode(['ok' => $success]);
            break;

        default:
            echo json_encode(['ok' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Error interno.']);
}