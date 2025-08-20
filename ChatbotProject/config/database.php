<?php
// filepath: ChatbotProject/config/database.php

// Config centralizada
const DB_HOST = 'localhost';
const DB_NAME = 'chatbot5';
const DB_USER = 'root';
const DB_PASS = '';
const DB_PORT = 3306;

function getDatabaseConnection() {
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Error al conectar con la base de datos', 'detail' => $e->getMessage()]);
        exit;
    }
}
