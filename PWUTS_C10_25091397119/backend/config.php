<?php
declare(strict_types=1);

/*
 * Konfigurasi koneksi MySQL.
 * Ganti placeholder di bawah sesuai pengaturan server lokal.
 */
const DB_HOST = '127.0.0.1';
const DB_NAME = 'step_clean';
const DB_USER = 'root';
const DB_PASS = ''; // [ISI PASSWORD MYSQL JIKA ADA]

function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function json_response(array $payload, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function request_string(string $key, int $maxLength = 500): string {
    $value = trim((string)($_POST[$key] ?? ''));
    if (mb_strlen($value) > $maxLength) {
        throw new InvalidArgumentException("Kolom {$key} terlalu panjang.");
    }
    return $value;
}
