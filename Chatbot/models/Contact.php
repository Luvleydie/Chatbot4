<?php
// models/Contact.php
require_once __DIR__ . '/../config/database.php';

class Contact {
    private $db;
    private $table = 'contacts';

    public function __construct() {
        $this->db = (new Database())->connect();
    }

    public function save($data) {
        $sql = "INSERT INTO {$this->table} (name, email, message) 
                VALUES (:name, :email, :message)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name'    => filter_var($data['name'], FILTER_SANITIZE_STRING),
            ':email'   => filter_var($data['email'], FILTER_VALIDATE_EMAIL),
            ':message' => filter_var($data['message'], FILTER_SANITIZE_STRING)
        ]);
        return $this->db->lastInsertId();
    }
}