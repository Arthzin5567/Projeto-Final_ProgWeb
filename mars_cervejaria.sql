CREATE DATABASE mars_cervejaria;
CREATE USER 'usuario'@'localhost' IDENTIFIED BY '12345678';
GRANT ALL PRIVILEGES ON mars_cervejaria.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;

USE mars_cervejaria;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role ENUM('cliente','admin') NOT NULL DEFAULT 'cliente'
);

CREATE TABLE cervejas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  teor_alcoolico DECIMAL(4,2) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  quantidade INT NOT NULL
);

CREATE TABLE compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  cerveja_id INT NOT NULL,
  quantidade INT NOT NULL,
  data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (cerveja_id) REFERENCES cervejas(id)
);