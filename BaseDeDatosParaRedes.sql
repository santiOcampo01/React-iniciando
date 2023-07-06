ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Manchas01';


CREATE DATABASE compartir;

USE compartir;

CREATE TABLE archivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo ENUM('imagen', 'mp3') NOT NULL,
  archivo LONGBLOB NOT NULL
);

SELECT * FROM archivos;
