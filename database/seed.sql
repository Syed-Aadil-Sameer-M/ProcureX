-- Seed data for ProcureX
-- Run AFTER tables are created

INSERT INTO users (username, password, email, role, full_name, department) VALUES
('admin', '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'admin@procurex.com', 'ADMIN', 'Admin User', 'Administration'),
('receiver1', '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'receiver1@procurex.com', 'RECEIVER', 'Jane Smith', 'Sector Alpha'),
('procurement1', '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'procurement1@procurex.com', 'PROCUREMENT', 'Bob Builder', 'Procurement Office');

INSERT INTO vendors (name, contact_name, email, phone) VALUES
('SecureTech', 'Alice', 'alice@securetech.com', '555-0101'),
('CableCo', 'Bob', 'bob@cableco.com', '555-0102'),
('VisionSystems', 'Charlie', 'charlie@visionsystems.com', '555-0103');

INSERT INTO inventory (material, quantity, price, unit, min_stock_level) VALUES
('4K Dome Cameras', 50, 150.00, 'pcs', 10),
('Cat6 Ethernet Cable', 2, 120.00, 'rolls', 5),
('PTZ Security Camera', 0, 450.00, 'pcs', 5),
('NVR 32-Channel', 5, 800.00, 'pcs', 2),
('Motion Sensors', 15, 35.00, 'pcs', 20),
('Biometric Access Reader', 10, 250.00, 'pcs', 5),
('Thermal Imaging Camera', 1, 1200.00, 'pcs', 2),
('PoE Injectors', 40, 25.00, 'pcs', 10);

INSERT INTO requests (inventory_id, quantity, location, description, status, user_id, created_at) VALUES
(1, 12, 'Sector Alpha', 'Replacement for damaged units', 'COMPLETED', 2, '2023-10-01 10:00:00'),
(3, 4, 'Perimeter B', 'New installation', 'APPROVED', 2, '2023-10-05 11:00:00'),
(4, 1, 'Control Room', 'Storage upgrade', 'PENDING', 2, '2023-10-10 12:00:00'),
(2, 5, 'Warehouse', 'Wiring new sector', 'APPROVED', 2, '2023-10-12 13:00:00'),
(5, 20, 'Level 4', 'Upgrading legacy sensors', 'REJECTED', 2, '2023-10-15 14:00:00');

INSERT INTO purchase_orders (inventory_id, vendor_id, quantity, status, request_id, created_at) VALUES
(2, 2, 10, 'SENT', NULL, '2023-10-26 10:00:00'),
(3, 1, 5, 'CREATED', 2, '2023-10-28 11:00:00'),
(7, 3, 2, 'RECEIVED', NULL, '2023-10-20 12:00:00'),
(5, 1, 50, 'COMPLETED', NULL, '2023-10-15 13:00:00');

INSERT INTO notifications (message, is_read, user_id, timestamp) VALUES
('Request REQ-002 has been approved.', false, 2, '2023-10-28 09:00:00'),
('New inventory alert: Cat6 Ethernet Cable stock is LOW.', false, 3, '2023-10-28 08:30:00'),
('Purchase Order PO-101 has been sent to vendor.', true, 1, '2023-10-26 11:20:00');

INSERT INTO stock_transactions (inventory_id, quantity_change, type, reference, timestamp) VALUES
(1, 50, 'IN', 'Initial Stock', '2023-09-01 10:00:00'),
(2, 12, 'IN', 'PO-100', '2023-09-15 10:00:00'),
(2, -10, 'OUT', 'REQ-001', '2023-10-02 10:00:00');
