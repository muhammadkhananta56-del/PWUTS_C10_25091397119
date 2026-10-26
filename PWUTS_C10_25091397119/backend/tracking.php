<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Metode request tidak diizinkan.'], 405);
}
try {
    $orderNumber = request_string('order_number', 40);
    if ($orderNumber === '') throw new InvalidArgumentException('Masukkan nomor pesanan.');
    $stmt = db()->prepare(
        'SELECT o.order_number, o.status, o.created_at, o.estimated_completion, s.name AS service_name, oi.quantity AS shoe_count
         FROM orders o
         JOIN order_items oi ON oi.order_id = o.id
         JOIN services s ON s.id = oi.service_id
         WHERE o.order_number = ?
         ORDER BY oi.id ASC LIMIT 1'
    );
    $stmt->execute([$orderNumber]);
    $order = $stmt->fetch();
    if (!$order) json_response(['success' => false, 'message' => 'Nomor pesanan tidak ditemukan. Periksa kembali nomor yang dimasukkan.'], 404);
    json_response([
        'success' => true,
        'order_number' => $order['order_number'],
        'status' => $order['status'],
        'created_at' => date('d-m-Y H:i', strtotime($order['created_at'])),
        'estimated_completion' => $order['estimated_completion'] ? date('d-m-Y', strtotime($order['estimated_completion'])) : null,
        'service_name' => $order['service_name'],
        'shoe_count' => (int)$order['shoe_count']
    ]);
} catch (InvalidArgumentException $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 422);
} catch (Throwable $e) {
    error_log('[Step Clean tracking] ' . $e->getMessage());
    json_response(['success' => false, 'message' => 'Tidak dapat memeriksa pesanan. Periksa konfigurasi server dan database.'], 500);
}
