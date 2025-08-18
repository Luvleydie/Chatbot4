-- Tabla de usuarios existente
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  owns_home TINYINT(1) NOT NULL,
  knows_manual TINYINT(1) NOT NULL,
  can_deposit TINYINT(1) NOT NULL,
  has_garage TINYINT(1) NOT NULL,
  interview_time DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nueva tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);