-- ProcureX Frontend-Aligned Seed Data
-- Matches database/schema.sql exactly
-- Run after schema creation:
--   psql -U postgres -d ProcureX_DB -f database/schema.sql
--   psql -U postgres -d ProcureX_DB -f database/seed.sql

BEGIN;

-- =====================
-- USERS
-- Includes the three frontend auth mocks plus request/activity owners
-- =====================
INSERT INTO users (id, username, password, email, role, full_name, department, phone_number) VALUES
(1,  'admin',        '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'admin@procurex.com',        'ADMIN',       'Admin User',       'Administration',  '+91-9000000001'),
(2,  'receiver',     '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'receiver@procurex.com',     'RECEIVER',    'Receiver User',    'Site Operations', '+91-9000000002'),
(3,  'procurement',  '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'procurement@procurex.com',  'PROCUREMENT', 'Procurement User', 'Procurement',     '+91-9000000003'),
(4,  'john.doe',     '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'john.doe@procurex.com',     'RECEIVER',    'John Doe',         'Sector Alpha',    '+91-9000000004'),
(5,  'jane.smith',   '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'jane.smith@procurex.com',    'ADMIN',       'Jane Smith',       'Operations',      '+91-9000000005'),
(6,  'bob.builder',  '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'bob.builder@procurex.com',   'PROCUREMENT', 'Bob Builder',      'Control Room',    '+91-9000000006'),
(7,  'alice.cooper',  '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'alice.cooper@procurex.com',  'RECEIVER',    'Alice Cooper',     'Warehouse',       '+91-9000000007'),
(8,  'charlie.brown', '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'charlie.brown@procurex.com', 'RECEIVER',    'Charlie Brown',    'Level 4',         '+91-9000000008'),
(9,  'david.clark',   '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'david.clark@procurex.com',   'RECEIVER',    'David Clark',      'Security Desk',   '+91-9000000009'),
(10, 'eve.adams',     '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'eve.adams@procurex.com',     'RECEIVER',    'Eve Adams',        'Server Room',     '+91-9000000010'),
(11, 'frank.white',   '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'frank.white@procurex.com',   'RECEIVER',    'Frank White',      'Main Entrances',  '+91-9000000011'),
(12, 'grace.lee',     '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'grace.lee@procurex.com',     'RECEIVER',    'Grace Lee',        'Exterior Gate',   '+91-9000000012'),
(13, 'hank.green',    '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'hank.green@procurex.com',    'RECEIVER',    'Hank Green',       'Sector Gamma',    '+91-9000000013');

-- =====================
-- VENDORS
-- =====================
INSERT INTO vendors (id, name, contact_name, email, phone) VALUES
(1, 'SecureTech',     'Alice',   'alice@securetech.com',      '555-0101'),
(2, 'CableCo',        'Bob',     'bob@cableco.com',           '555-0102'),
(3, 'VisionSystems',  'Charlie', 'charlie@visionsystems.com', '555-0103');

-- =====================
-- INVENTORY
-- Includes frontend mock inventory plus extra items needed for all request rows
-- =====================
INSERT INTO inventory (id, material, quantity, price, unit, min_stock_level, stock_level) VALUES
(1,  '4K Dome Cameras',            50,   150.00, 'pcs',    10, 'OK'),
(2,  'Cat6 Ethernet Cable',         2,   120.00, 'rolls',   5, 'LOW'),
(3,  'PTZ Security Camera',         0,   450.00, 'pcs',     5, 'CRITICAL'),
(4,  'NVR 32-Channel',              5,   800.00, 'pcs',     2, 'OK'),
(5,  'Motion Sensors',             15,    35.00, 'pcs',    20, 'LOW'),
(6,  'Biometric Access Reader',     10,   250.00, 'pcs',     5, 'OK'),
(7,  'Thermal Imaging Camera',       1,  1200.00, 'pcs',     2, 'CRITICAL'),
(8,  'PoE Injectors',               40,    25.00, 'pcs',    10, 'OK'),
(9,  'Cat6 Ethernet Cable (1000ft)', 12,   140.00, 'rolls',   5, 'OK'),
(10, '27-inch Surveillance Monitor',  4,   320.00, 'pcs',     5, 'LOW'),
(11, 'Server Rack Battery Backup',    2,   500.00, 'pcs',     2, 'LOW');

-- =====================
-- REQUESTS
-- Frontend mockRequests
-- =====================
INSERT INTO requests (id, inventory_id, quantity, location, description, status, user_id, created_at) VALUES
(1,  1, 12, 'Sector Alpha',     'Replacement for damaged units', 'COMPLETED', 4, '2023-10-01 10:00:00'),
(2,  3,  4, 'Perimeter B',      'New installation',              'APPROVED',   5, '2023-10-05 11:00:00'),
(3,  4,  1, 'Control Room',     'Storage upgrade',               'PENDING',    6, '2023-10-10 12:00:00'),
(4,  9,  5, 'Warehouse',        'Wiring new sector',             'APPROVED',   7, '2023-10-12 13:00:00'),
(5,  5, 20, 'Level 4',          'Upgrading legacy sensors',      'REJECTED',   8, '2023-10-15 14:00:00'),
(6, 10,  4, 'Security Desk',    'Additional screens',            'PENDING',    9, '2023-10-18 09:30:00'),
(7, 11,  2, 'Server Room',      'Redundancy',                    'APPROVED',   10, '2023-10-20 10:15:00'),
(8,  6,  8, 'Main Entrances',   '',                              'COMPLETED',  11, '2023-10-22 11:00:00'),
(9,  7,  2, 'Exterior Gate',    'Night time visibility',         'PENDING',    12, '2023-10-24 12:45:00'),
(10, 8, 15, 'Sector Gamma',     '',                              'APPROVED',   13, '2023-10-25 13:30:00');

-- =====================
-- PURCHASE ORDERS
-- Frontend mockPurchaseOrders
-- =====================
INSERT INTO purchase_orders (id, inventory_id, vendor_id, quantity, status, notes, request_id, created_at) VALUES
(1, 2, 2, 10, 'SENT',      'Order sent for cable replenishment', 4, '2023-10-26 10:00:00'),
(2, 3, 1,  5, 'CREATED',   'Awaiting procurement review',        2, '2023-10-28 11:00:00'),
(3, 7, 3,  2, 'RECEIVED',  'Thermal cameras received',           9, '2023-10-20 12:00:00'),
(4, 5, 1, 50, 'COMPLETED', 'Sensors fulfilled and closed',       5, '2023-10-15 13:00:00');

-- =====================
-- NOTIFICATIONS
-- Frontend mockNotifications
-- =====================
INSERT INTO notifications (id, message, is_read, user_id, timestamp) VALUES
(1, 'Request REQ-002 has been approved.', false, 5, '2023-10-28 09:00:00'),
(2, 'New inventory alert: Cat6 Ethernet Cable stock is LOW.', false, 3, '2023-10-28 08:30:00'),
(3, 'Request REQ-005 was rejected.', false, 8, '2023-10-27 15:45:00'),
(4, 'Purchase Order PO-101 has been sent to vendor.', true, 3, '2023-10-26 11:20:00'),
(5, 'System maintenance scheduled for weekend.', true, 1, '2023-10-25 14:00:00'),
(6, 'Request REQ-001 has been marked as COMPLETED.', true, 4, '2023-10-24 10:15:00');

-- =====================
-- AUDIT LOGS
-- Frontend mockAuditLogs
-- =====================
INSERT INTO audit_logs (id, user_id, action, module, description, timestamp) VALUES
(1, 7, 'Approved Request', 'Requests', 'Approved REQ-002', '2023-10-28 09:00:00'),
(2, 4, 'Created Request',   'Requests', 'Created REQ-012',  '2023-10-27 10:00:00');
(3, 8, 'Rejected Request', 'Requests', 'Rejected REQ-005', '2023-10-27 15:45:00'),
(4, 3, 'Sent Purchase Order', 'Purchase Orders', 'Sent PO-101 to vendor', '2023-10-26 11:20:00');
(5, 1, 'Scheduled Maintenance', 'System', 'Scheduled system maintenance for weekend', '2023-10-25 14:00:00');
(6, 4, 'Completed Request', 'Requests', 'Marked REQ-001 as COMPLETED', '2023-10-24 10:15:00');

-- =====================
-- STOCK TRANSACTIONS
-- Derived from completed / received records to keep audit trail realistic
-- =====================
INSERT INTO stock_transactions (id, inventory_id, quantity_change, type, reference, timestamp) VALUES
(1, 1, -12, 'OUT', 'REQ-001', '2023-10-01 10:05:00'),
(2, 6,  -8, 'OUT', 'REQ-008', '2023-10-22 11:05:00'),
(3, 7,   2, 'IN',  'PO-103', '2023-10-20 12:05:00'),
(4, 5,  50, 'IN',  'PO-104', '2023-10-15 13:05:00');

-- =====================
-- SEQUENCE RESET
-- =====================
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), true);
SELECT setval(pg_get_serial_sequence('vendors', 'id'), COALESCE((SELECT MAX(id) FROM vendors), 1), true);
SELECT setval(pg_get_serial_sequence('inventory', 'id'), COALESCE((SELECT MAX(id) FROM inventory), 1), true);
SELECT setval(pg_get_serial_sequence('requests', 'id'), COALESCE((SELECT MAX(id) FROM requests), 1), true);
SELECT setval(pg_get_serial_sequence('purchase_orders', 'id'), COALESCE((SELECT MAX(id) FROM purchase_orders), 1), true);
SELECT setval(pg_get_serial_sequence('notifications', 'id'), COALESCE((SELECT MAX(id) FROM notifications), 1), true);
SELECT setval(pg_get_serial_sequence('stock_transactions', 'id'), COALESCE((SELECT MAX(id) FROM stock_transactions), 1), true);
SELECT setval(pg_get_serial_sequence('audit_logs', 'id'), COALESCE((SELECT MAX(id) FROM audit_logs), 1), true);

COMMIT;
