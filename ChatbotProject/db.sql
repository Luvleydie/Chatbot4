    CREATE DATABASE IF NOT EXISTS chatbot_renta;
USE chatbot_renta;

-- Crear la tabla principal
CREATE TABLE IF NOT EXISTS respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(100) NOT NULL,
  tipo_respuesta ENUM('texto','botones') NOT NULL,
  respuesta TEXT NOT NULL,
  botones JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar los registros
INSERT INTO respuestas (id, keyword, tipo_respuesta, respuesta, botones, created_at) VALUES
(1, 'hola', 'botones', '¡Hola! Si estás interesado en rentar un auto para ...', '[{"id":"edad_18_23","title":"18-23"},{"id":"edad_24_30","title":"24-30"},{"id":"edad_31_mas","title":"31 o más"}]', '2025-08-19 11:53:26'),
(2, '18-23', 'texto', 'Lo siento, no cumples con los requisitos. ¡Que tengas un excelente día!', NULL, '2025-08-19 11:53:26'),
(3, '24-30', 'botones', '¿Vivienda propia o prestada?', '[{"body":"Vivienda propia"},{"body":"Vivienda prestada"}]', '2025-08-19 11:53:26'),
(4, '31 o más', 'botones', '¿Vivienda propia o prestada?', '[{"body":"Vivienda propia"},{"body":"Vivienda prestada"}]', '2025-08-19 11:53:26'),
(5, 'Vivienda propia', 'botones', '¿Cuenta con cochera cerrada?', '[{"body":"Tengo cochera"},{"body":"No tengo cochera"}]', '2025-08-19 11:53:26'),
(6, 'Vivienda prestada', 'botones', '¿Cuenta con cochera cerrada?', '[{"body":"Tengo cochera"},{"body":"No tengo cochera"}]', '2025-08-19 11:53:26'),
(7, 'Tengo cochera', 'botones', '¿Cuántos dependientes tiene?', '[{"body":"Ninguno"},{"body":"1-2"},{"body":"3 o más"}]', '2025-08-19 11:53:26'),
(8, 'No tengo cochera', 'texto', 'Lo siento, no cumples con los requisitos.', NULL, '2025-08-19 11:53:26'),
(9, 'Ninguno', 'botones', '¿Cuenta con recibo predial a su nombre?', '[{"body":"Sí, tengo recibo"},{"body":"No, no tengo recibo"}]', '2025-08-19 11:53:26'),
(10, '1-2', 'botones', '¿Cuenta con recibo predial a su nombre?', '[{"body":"Sí, tengo recibo"},{"body":"No, no tengo recibo"}]', '2025-08-19 11:53:26'),
(11, '3 o más', 'texto', 'Lo siento, no cumples con los requisitos.', NULL, '2025-08-19 11:53:26'),
(12, 'Sí, tengo recibo', 'botones', '¿Ha rentado auto antes?', '[{"body":"He rentado antes"},{"body":"Nunca he rentado"}]', '2025-08-19 11:53:26'),
(13, 'No, no tengo recibo', 'texto', 'Lo siento, no cumples con los requisitos.', NULL, '2025-08-19 11:53:26'),
(14, 'He rentado antes', 'botones', '¿Qué tipo de auto has rentado anteriormente?', '[{"body":"Sedán"},{"body":"SUV"},{"body":"Otro"}]', '2025-08-19 11:53:26'),
(15, 'Nunca he rentado', 'botones', 'Entendido. ¿Qué te motivó a considerar rentar un auto?', '[{"body":"Ingresos adicionales"},{"body":"Flexibilidad"},{"body":"Otro motivo"}]', '2025-08-19 11:53:26'),
(16, 'Sedán', 'botones', '¿Cuánto tiempo planeas rentar el auto?', '[{"body":"1-3 meses"},{"body":"4-6 meses"},{"body":"Más de 6 meses"}]', '2025-08-19 11:53:26'),
(17, 'SUV', 'botones', '¿Cuánto tiempo planeas rentar el auto?', '[{"body":"1-3 meses"},{"body":"4-6 meses"},{"body":"Más de 6 meses"}]', '2025-08-19 11:53:26'),
(18, 'Otro', 'botones', '¿Cuánto tiempo planeas rentar el auto?', '[{"body":"1-3 meses"},{"body":"4-6 meses"},{"body":"Más de 6 meses"}]', '2025-08-19 11:53:26'),
(19, '1-3 meses', 'botones', '¿Tienes experiencia manejando en plataformas como Uber o Didi?', '[{"body":"Tengo experiencia"},{"body":"Soy nuevo"}]', '2025-08-19 11:53:26'),
(20, '4-6 meses', 'botones', '¿Tienes experiencia manejando en plataformas como Uber o Didi?', '[{"body":"Tengo experiencia"},{"body":"Soy nuevo"}]', '2025-08-19 11:53:26'),
(21, 'Más de 6 meses', 'botones', '¿Tienes experiencia manejando en plataformas como Uber o Didi?', '[{"body":"Tengo experiencia"},{"body":"Soy nuevo"}]', '2025-08-19 11:53:26'),
(22, 'Tengo experiencia', 'botones', '¡Perfecto! Esto facilitará el proceso. ¿Tienes alguna duda?', '[{"body":"Tengo preguntas"},{"body":"Todo claro"}]', '2025-08-19 11:53:26'),
(23, 'Soy nuevo', 'texto', 'No te preocupes, te guiaremos en todo el proceso para comenzar a generar ingresos.', NULL, '2025-08-19 11:53:26'),
(24, 'Tengo preguntas', 'texto', 'Por favor, escribe tus preguntas y con gusto te las resolvemos.', NULL, '2025-08-19 11:53:26'),
(25, 'Todo claro', 'texto', '¡Felicidades! Eres apto para una reunión presencial para continuar el proceso.', NULL, '2025-08-19 11:53:26');
