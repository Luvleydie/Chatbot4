# Car Rental Chatbot

## Requisitos
- PHP 7.4+ y XAMPP (Apache + MySQL)
- Node.js 14+

## Instalación PHP
1. Coloca el proyecto en `C:/xampp/htdocs/Chatbot`
2. Importa `database.sql` en phpMyAdmin para crear la base de datos y tabla.
3. Asegúrate que `includes/header.php`, `includes/footer.php`, `config/database.php` existan.
4. Accede en el navegador a `http://localhost/Chatbot/vistas/chat.php`

## Instalación Node API
```bash
cd Chatbot/js_apis
npm install
npm run start
## Ejemplos de Postman

### 1. Chatbot
- **URL**: `POST http://localhost/Chatbot/apis/chat.php` (PHP) o `POST http://localhost:3000/api/chat` (Node)
- **Header**: `Content-Type: application/json`
- **Body**:
  ```json
  { "step": "ask_name" }