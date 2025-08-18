<?php
// index.php — punto único de entrada con switching por GET

// Mapea las vistas disponibles
$allowed = ['landing','features','chat','schedule','faq','contact','confirmation'];
$view    = $_GET['view'] ?? 'landing';
if (! in_array($view, $allowed)) {
    $view = 'landing';
}

// Incluye header y nav
require __DIR__ . '/vistas/header.php';
require __DIR__ . '/vistas/nav.php';
?>

<main class="container view-container">
  <?php
    // Incluye el fragmento correspondiente
    include __DIR__ . "/vistas/{$view}.php";
  ?>
</main>

<?php
// Incluye footer
require __DIR__ . '/vistas/footer.php';
?>

<!-- Carga scripts -->
<link rel="stylesheet" href="/Chatbot/assets/css/style.css">
<script src="/Chatbot/assets/js/chat.js" defer></script>
