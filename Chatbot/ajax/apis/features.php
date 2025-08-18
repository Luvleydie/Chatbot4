<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$features = [
    [ 'id' => 1, 'title' => 'Flota Variada', 'icon' => 'car-side', 'description' => 'Autos nuevos, seguros y cómodos.' ],
    [ 'id' => 2, 'title' => 'Soporte 24/7', 'icon' => 'headset', 'description' => 'Asistencia continua para cualquier imprevisto.' ],
    [ 'id' => 3, 'title' => 'Seguro Incluido', 'icon' => 'shield-alt', 'description' => 'Cobertura total en cada renta.' ],
    [ 'id' => 4, 'title' => 'Flexibilidad', 'icon' => 'hand-holding-usd', 'description' => 'Cancelación sin penalización 24h antes.' ]
];

echo json_encode(['ok' => true, 'features' => $features], JSON_UNESCAPED_UNICODE);