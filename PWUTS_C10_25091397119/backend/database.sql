-- Step Clean: skema awal untuk proyek UTS
-- Harga, durasi, area dan informasi bisnis adalah DATA CONTOH/PLACEHOLDER.
CREATE DATABASE IF NOT EXISTS step_clean CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE step_clean;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role ENUM('admin','staff') NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY uq_customers_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  estimated_days TINYINT UNSIGNED NOT NULL DEFAULT 2,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  customer_id BIGINT UNSIGNED NOT NULL,
  status ENUM('Menunggu Konfirmasi','Dijemput','Diterima Toko','Sedang Dicuci','Proses Finishing','Selesai','Siap Diambil/Diantar','Dibatalkan') NOT NULL DEFAULT 'Menunggu Konfirmasi',
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  preferred_date DATE NOT NULL,
  estimated_completion DATE NULL,
  service_mode ENUM('dropoff','pickup') NOT NULL DEFAULT 'dropoff',
  address VARCHAR(500) NULL,
  customer_notes VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  quantity TINYINT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_service FOREIGN KEY (service_id) REFERENCES services(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS shoes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  shoe_type VARCHAR(100) NOT NULL,
  notes VARCHAR(500) NULL,
  CONSTRAINT fk_shoes_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pickup_delivery (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  service_mode ENUM('dropoff','pickup') NOT NULL,
  address VARCHAR(500) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Perlu Konfirmasi',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pickup_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50) NULL,
  status ENUM('Belum Dibayar','Menunggu','Lunas','Dibatalkan') NOT NULL DEFAULT 'Belum Dibayar',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NULL,
  message VARCHAR(500) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO services (id, name, description, price, estimated_days, is_active) VALUES
(1, 'Fast Clean', 'Pembersihan dasar bagian luar sepatu.', 35000, 2, 1),
(2, 'Deep Clean', 'Pembersihan menyeluruh upper, midsole, dan outsole.', 55000, 3, 1),
(3, 'Premium Care', 'Perawatan detail untuk kebersihan dan tampilan sepatu.', 85000, 4, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), price=VALUES(price), estimated_days=VALUES(estimated_days), is_active=VALUES(is_active);

-- Tidak ada akun admin default karena modul admin/login tidak menjadi fokus implementasi UTS ini.
