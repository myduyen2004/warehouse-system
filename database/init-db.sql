-- ===================================================================
-- KHỞI TẠO DATABASE
-- ===================================================================

-- Bật extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- TẠO USER ADMIN MẶC ĐỊNH
-- ===================================================================

-- Password: admin123 (đã mã hóa bằng BCrypt)
INSERT INTO users (
    username, 
    password, 
    email, 
    full_name, 
    phone_number, 
    role, 
    enabled, 
    account_non_locked, 
    created_at, 
    updated_at
)
VALUES (
    'admin',
    '$2a$10$xQGz4VJwN5hQVKvZB7Y5EuZXjQ5hYrFZxUFZIV1g5jPzB8VZXqY2G',
    'admin@warehouse.com',
    'Administrator',
    '0123456789',
    'ADMIN',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- ===================================================================
-- TẠO KHO MẪU
-- ===================================================================

INSERT INTO warehouses (
    name, 
    address, 
    city, 
    district, 
    latitude, 
    longitude, 
    capacity, 
    current_usage, 
    status, 
    phone_number, 
    manager_name, 
    created_at, 
    updated_at
)
VALUES 
(
    'Kho Hà Nội',
    '123 Đường Láng, Đống Đa',
    'Hà Nội',
    'Đống Đa',
    21.0285,
    105.8542,
    10000,
    0,
    'ACTIVE',
    '0241234567',
    'Nguyễn Văn A',
    NOW(),
    NOW()
),
(
    'Kho TP.HCM',
    '456 Nguyễn Huệ, Quận 1',
    'Hồ Chí Minh',
    'Quận 1',
    10.7769,
    106.7009,
    15000,
    0,
    'ACTIVE',
    '0281234567',
    'Trần Thị B',
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- ===================================================================
-- TẠO NHÀ CUNG CẤP MẪU
-- ===================================================================

INSERT INTO suppliers (
    name, 
    code, 
    contact_person, 
    email, 
    phone_number, 
    address, 
    tax_code, 
    status, 
    rating, 
    created_at, 
    updated_at
)
VALUES 
(
    'Công ty ABC',
    'SUP001',
    'Nguyễn Văn X',
    'contact@abc.com',
    '0912345678',
    '100 Nguyễn Trãi, Hà Nội',
    '0123456789',
    'ACTIVE',
    4.5,
    NOW(),
    NOW()
)
ON CONFLICT (code) DO NOTHING;

-- ===================================================================
-- TẠO SẢN PHẨM MẪU
-- ===================================================================

INSERT INTO products (
    name, 
    sku, 
    category, 
    brand, 
    price, 
    cost_price, 
    unit, 
    weight, 
    description, 
    status, 
    supplier_id, 
    created_at, 
    updated_at
)
SELECT 
    'Sản phẩm ' || gs.n,
    'SKU' || LPAD(gs.n::text, 5, '0'),
    CASE 
        WHEN gs.n % 3 = 0 THEN 'Electronics'
        WHEN gs.n % 3 = 1 THEN 'Clothing'
        ELSE 'Food'
    END,
    'Brand ' || (gs.n % 3 + 1),
    (gs.n * 50000)::decimal,
    (gs.n * 35000)::decimal,
    'PIECE',
    (gs.n * 0.5)::decimal,
    'Mô tả sản phẩm ' || gs.n,
    'ACTIVE',
    (SELECT id FROM suppliers LIMIT 1),
    NOW(),
    NOW()
FROM generate_series(1, 30) gs(n)
ON CONFLICT (sku) DO NOTHING;

-- ===================================================================
-- TẠO TỒN KHO MẪU
-- ===================================================================

INSERT INTO inventory (
    product_id,
    warehouse_id,
    quantity,
    reserved_quantity,
    min_threshold,
    max_threshold,
    location,
    last_updated,
    created_at
)
SELECT 
    p.id,
    w.id,
    (100 + (RANDOM() * 400))::int,
    0,
    10,
    1000,
    'A' || ((ROW_NUMBER() OVER ()) % 10 + 1),
    NOW(),
    NOW()
FROM products p
CROSS JOIN warehouses w
WHERE NOT EXISTS (
    SELECT 1 FROM inventory i 
    WHERE i.product_id = p.id AND i.warehouse_id = w.id
);

-- ===================================================================
-- HOÀN TẤT
-- ===================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Database initialized successfully!';
    RAISE NOTICE 'Default user: admin / admin123';
    RAISE NOTICE '========================================';
END $$;