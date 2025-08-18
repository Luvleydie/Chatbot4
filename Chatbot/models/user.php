<?php
// models/User.php
require_once __DIR__ . '/../config/database.php';

class User {
    private $db;
    private $table = 'users';

    public function __construct() {
        $this->db = (new Database())->connect();
    }

    public function save($data) {
        $sql = "INSERT INTO {$this->table}
            (name, age, owns_home, knows_manual, can_deposit, has_garage, interview_time)
            VALUES (:name, :age, :home, :manual, :deposit, :garage, :interview)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name'      => $data['name'],
            ':age'       => $data['age'],
            ':home'      => $data['owns_home'],
            ':manual'    => $data['knows_manual'],
            ':deposit'   => $data['can_deposit'],
            ':garage'    => $data['has_garage'],
            ':interview' => $data['interview_time'] ?? null
        ]);
        return $this->db->lastInsertId();
    }
}