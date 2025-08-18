<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$faq = [
    [ 'id' => 1, 'question' => '¿Cómo reservo?', 'answer' => 'Inicia el chat y sigue las indicaciones.' ],
    [ 'id' => 2, 'question' => '¿Qué documentos necesito?', 'answer' => 'Licencia vigente y comprobante de domicilio.' ],
    [ 'id' => 3, 'question' => '¿Dónde recojo el auto?', 'answer' => 'En nuestra sucursal más cercana a ti.' ],
];

echo json_encode(['ok' => true, 'faq' => $faq], JSON_UNESCAPED_UNICODE);