<?php

class FlujoModel
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = new PDO('mysql:host=localhost;dbname=chatbot4', 'root', '');
    }

    public function saveState(string $userId, string $step, array $data = []): bool
    {
        $stmt = $this->pdo->prepare('
            INSERT INTO flujo (user_id, step, data)
            VALUES (:user_id, :step, :data)
            ON DUPLICATE KEY UPDATE step = :step, data = :data
        ');
        return $stmt->execute([
            ':user_id' => $userId,
            ':step' => $step,
            ':data' => json_encode($data)
        ]);
    }

    public function getState(string $userId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM flujo WHERE user_id = :user_id');
        $stmt->execute([':user_id' => $userId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $result['data'] = json_decode($result['data'], true);
        }

        return $result ?: null;
    }

    public function deleteState(string $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM flujo WHERE user_id = :user_id');
        return $stmt->execute([':user_id' => $userId]);
    }
}