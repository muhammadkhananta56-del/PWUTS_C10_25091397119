<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Metode request tidak diizinkan.'], 405);
}

try {
    $name = request_string('customer_name', 100);
    $phone = request_string('phone', 20);
    $email = request_string('email', 150);
    $shoeType = request_string('shoe_type', 100);
    $shoeNotes = request_string('shoe_notes', 500);
    $mode = request_string('service_mode', 20);
    $address = request_string('address', 500);
    $preferredDate = request_string('preferred_date', 10);
    $serviceId = filter_var($_POST['service_id'] ?? null, FILTER_VALIDATE_INT);
    $shoeCount = filter_var($_POST['shoe_count'] ?? null, FILTER_VALIDATE_INT);

    if ($name === '' || $phone === '' || $shoeType === '' || $preferredDate === '' || !$serviceId || !$shoeCount) {
        throw new InvalidArgumentException('Lengkapi semua kolom wajib.');
    }
    if (!preg_match('/^[0-9+().\-\s]{8,20}$/', $phone)) {
        throw new InvalidArgumentException('Format nomor telepon tidak valid.');
    }
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Format email tidak valid.');
    }
    if (!in_array($mode, ['dropoff', 'pickup'], true)) {
        throw new InvalidArgumentException('Metode serah terima tidak valid.');
    }
    if ($mode === 'pickup' && $address === '') {
        throw new InvalidArgumentException('Alamat wajib diisi untuk opsi jemput/antar.');
    }
    if ($shoeCount < 1 || $shoeCount > 5) {
        throw new InvalidArgumentException('Jumlah sepatu harus antara 1 dan 5 pasang.');
    }
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $preferredDate);
    $today = new DateTimeImmutable('today');
    if (!$date || $date->format('Y-m-d') !== $preferredDate || $date < $today) {
        throw new InvalidArgumentException('Tanggal rencana serah terima tidak valid.');
    }

    $pdo = db();
    $serviceQuery = $pdo->prepare('SELECT id, name, price, estimated_days FROM services WHERE id = ? AND is_active = 1');
    $serviceQuery->execute([$serviceId]);
    $service = $serviceQuery->fetch();
    if (!$service) throw new InvalidArgumentException('Layanan tidak tersedia.');

    $pdo->beginTransaction();
    $customerQuery = $pdo->prepare('SELECT id FROM customers WHERE phone = ? LIMIT 1');
    $customerQuery->execute([$phone]);
    $customer = $customerQuery->fetch();
    if ($customer) {
        $customerId = (int)$customer['id'];
        $updateCustomer = $pdo->prepare('UPDATE customers SET name = ?, email = ?, updated_at = NOW() WHERE id = ?');
        $updateCustomer->execute([$name, $email !== '' ? $email : null, $customerId]);
    } else {
        $insertCustomer = $pdo->prepare('INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)');
        $insertCustomer->execute([$name, $phone, $email !== '' ? $email : null]);
        $customerId = (int)$pdo->lastInsertId();
    }

    $orderNumber = 'SC-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
    $days = (int)$service['estimated_days'];
    $estimated = (new DateTimeImmutable('today'))->modify('+' . $days . ' days')->format('Y-m-d');
    $total = (float)$service['price'] * $shoeCount;

    $insertOrder = $pdo->prepare(
        'INSERT INTO orders (order_number, customer_id, status, total_amount, preferred_date, estimated_completion, service_mode, address, customer_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $insertOrder->execute([$orderNumber, $customerId, 'Menunggu Konfirmasi', $total, $preferredDate, $estimated, $mode, $mode === 'pickup' ? $address : null, $shoeNotes !== '' ? $shoeNotes : null]);
    $orderId = (int)$pdo->lastInsertId();

    $insertItem = $pdo->prepare('INSERT INTO order_items (order_id, service_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)');
    $insertItem->execute([$orderId, $serviceId, $shoeCount, (float)$service['price'], $total]);

    $insertShoe = $pdo->prepare('INSERT INTO shoes (order_id, shoe_type, notes) VALUES (?, ?, ?)');
    for ($i = 0; $i < $shoeCount; $i++) {
        $insertShoe->execute([$orderId, $shoeType, $shoeNotes !== '' ? $shoeNotes : null]);
    }

    $pickupStatus = $mode === 'pickup' ? 'Perlu Konfirmasi' : 'Antar ke Toko';
    $insertPickup = $pdo->prepare('INSERT INTO pickup_delivery (order_id, service_mode, address, status) VALUES (?, ?, ?, ?)');
    $insertPickup->execute([$orderId, $mode, $mode === 'pickup' ? $address : null, $pickupStatus]);

    $pdo->commit();
    json_response([
        'success' => true,
        'message' => 'Booking berhasil disimpan.',
        'order_number' => $orderNumber,
        'status' => 'Menunggu Konfirmasi',
        'estimated_completion' => $estimated,
        'total_amount' => $total
    ], 201);
} catch (InvalidArgumentException $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) $pdo->rollBack();
    json_response(['success' => false, 'message' => $e->getMessage()], 422);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) $pdo->rollBack();
    error_log('[Step Clean booking] ' . $e->getMessage());
    json_response(['success' => false, 'message' => 'Terjadi kesalahan saat menyimpan booking. Periksa konfigurasi database atau log server.'], 500);
}
