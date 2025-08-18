<?php
// config/database.php
class Database {
    private $host = 'localhost';
    private $db   = 'database';
    private $user = 'root';
    private $pass = '';
    private $pdo;

    public function connect() {
        if ($this->pdo == null) {
            $dsn = "mysql:host={$this->host};dbname={$this->db};charset=utf8";
            $this->pdo = new PDO($dsn, $this->user, $this->pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
        }
        return $this->pdo;
    }
}