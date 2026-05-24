-- ProcureX Demo Seed Data (Corrected)
-- Matches schema.sql exactly
-- Run: psql -U postgres -d procurex -f database/seed_demo.sql

-- =====================
-- USERS (10 total)
-- columns: username, password, email, role, full_name, department
-- =====================
INSERT INTO users (username, password, email, role, full_name, department) VALUES
('receiver1',    '$2a$10$demoHashedPassword1',  'arjun.mehta@procurex.com',    'RECEIVER',    'Arjun Mehta',   'Engineering'),
('receiver2',    '$2a$10$demoHashedPassword2',  'priya.sharma@procurex.com',   'RECEIVER',    'Priya Sharma',  'Operations'),
('receiver3',    '$2a$10$demoHashedPassword3',  'vikram.singh@procurex.com',   'RECEIVER',    'Vikram Singh',  'Logistics'),
('procurement1', '$2a$10$demoHashedPassword4',  'neha.patel@procurex.com',     'PROCUREMENT', 'Neha Patel',    'Finance'),
('procurement2', '$2a$10$demoHashedPassword5',  'rohit.verma@procurex.com',    'PROCUREMENT', 'Rohit Verma',   'Finance'),
('admin',        '$2a$10$demoHashedPassword6',  'admin@procurex.com',          'ADMIN',       'Suresh Kumar',  'Admin'),
('admin2',       '$2a$10$demoHashedPassword7',  'admin2@procurex.com',         'ADMIN',       'Anita Desai',   'Admin'),
('receiver4',    '$2a$10$demoHashedPassword8',  'kiran.rao@procurex.com',      'RECEIVER',    'Kiran Rao',     'Engineering'),
('procurement3', '$2a$10$demoHashedPassword9',  'deepak.joshi@procurex.com',   'PROCUREMENT', 'Deepak Joshi',  'Operations'),
('receiver5',    '$2a$10$demoHashedPassword10', 'meera.nair@procurex.com',     'RECEIVER',    'Meera Nair',    'Logistics');

-- =====================
-- VENDORS (6 total)
-- columns: name, contact_name, email, phone
-- =====================
INSERT INTO vendors (name, contact_name, email, phone) VALUES
('ABC Suppliers Pvt Ltd', 'Amit Bose',    'amit@abcsuppliers.com',       '+912233445566'),
('TechPro Industries',    'Sunita Rao',   'sunita@techpro.com',          '+912233445567'),
('Global Traders',        'Ramesh Gupta', 'ramesh@globaltraders.com',    '+912233445568'),
('Metro Hardware',        'Kavita Shah',  'kavita@metrohardware.com',    '+912233445569'),
('SafetyFirst Co',        'Ajay Nair',    'ajay@safetyfirst.com',        '+912233445570'),
('Office Essentials',     'Pooja Iyer',   'pooja@officeessentials.com',  '+912233445571');

-- =====================
-- INVENTORY (20 items)
-- columns: material, quantity, price, unit, min_stock_level
-- =====================
INSERT INTO inventory (material, quantity, price, unit, min_stock_level) VALUES
('Welding Rods',       5,   120.00, 'pcs',     20),
('Safety Goggles',     3,    85.00, 'pcs',     15),
('Industrial Gloves',  8,    45.00, 'pairs',   25),
('Fire Extinguisher',  2,   800.00, 'pcs',     10),
('Circuit Breakers',   7,   350.00, 'pcs',     20),
('Screws M6',         45,     2.50, 'pcs',    100),
('Cable Ties',        30,     5.00, 'pcs',    200),
('Adhesive Tape',     20,    25.00, 'rolls',   50),
('Paint Brushes',     15,    60.00, 'sets',    30),
('Safety Helmets',    12,   150.00, 'pcs',     20),
('Drill Bits Set',    10,   280.00, 'sets',    15),
('Extension Cords',   18,   320.00, 'pcs',     25),
('Laptop Chargers',   75,   950.00, 'pcs',     20),
('Paper A4',         200,   250.00, 'reams',   50),
('Cleaning Supplies', 80,    90.00, 'bottles', 20),
('Ballpoint Pens',   150,   120.00, 'boxes',   30),
('Printer Cartridges',60,   450.00, 'pcs',     15),
('Measuring Tape',    55,    75.00, 'pcs',     10),
('Work Boots',        90,   850.00, 'pairs',   20),
('Lubricant Oil',    120,   110.00, 'bottles', 30);

-- =====================
-- REQUESTS (15 total)
-- columns: inventory_id, quantity, location, description, status, user_id, created_at
-- =====================

-- PENDING (3)
INSERT INTO requests (inventory_id, quantity, location, description, status, user_id, created_at) VALUES
(1,  50, 'Site A - Block 3',      'Urgent requirement for site construction welding work',   'PENDING', 1, NOW() - INTERVAL '2 days'),
(2,  20, 'Operations Floor B',    'Monthly safety equipment replenishment for site workers', 'PENDING', 2, NOW() - INTERVAL '1 day'),
(14, 30, 'Admin Block - Level 2', 'Monthly office supplies for admin department',            'PENDING', 3, NOW() - INTERVAL '3 hours');

-- APPROVED (5)
INSERT INTO requests (inventory_id, quantity, location, description, status, user_id, created_at) VALUES
(3,  40,  'Factory Floor A',   'Critical restock of industrial gloves for factory floor', 'APPROVED', 1, NOW() - INTERVAL '5 days'),
(7,  500, 'Electrical Store',  'Quarterly electrical supplies procurement',               'APPROVED', 2, NOW() - INTERVAL '7 days'),
(11, 10,  'Maintenance Shed',  'Drill bits and measuring tools for maintenance team',     'APPROVED', 3, NOW() - INTERVAL '10 days'),
(10, 15,  'Site B - Entry',    'New safety helmets for new site workers',                 'APPROVED', 1, NOW() - INTERVAL '12 days'),
(17, 20,  'Admin Block',       'Monthly printer cartridge replenishment',                 'APPROVED', 2, NOW() - INTERVAL '8 days');

-- REJECTED (4)
INSERT INTO requests (inventory_id, quantity, location, description, status, user_id, created_at) VALUES
(13, 5,  'IT Department',  'Additional laptops for backup purposes',  'REJECTED', 3, NOW() - INTERVAL '15 days'),
(15, 10, 'All Floors',     'Cleaning supplies for all departments',   'REJECTED', 1, NOW() - INTERVAL '20 days'),
(19, 8,  'Warehouse B',    'Work boots for new warehouse staff',      'REJECTED', 2, NOW() - INTERVAL '18 days'),
(18, 6,  'Engineering Dept','Measuring tapes for engineering team',   'REJECTED', 3, NOW() - INTERVAL '25 days');

-- COMPLETED (3)
INSERT INTO requests (inventory_id, quantity, location, description, status, user_id, created_at) VALUES
(4,  10,  'All Buildings',   'Annual fire safety equipment restock',          'COMPLETED', 1, NOW() - INTERVAL '30 days'),
(15, 20,  'All Departments', 'Monthly cleaning supplies for all departments', 'COMPLETED', 2, NOW() - INTERVAL '28 days'),
(16, 100, 'All Departments', 'Quarterly stationery restock',                  'COMPLETED', 3, NOW() - INTERVAL '22 days');

-- =====================
-- PURCHASE ORDERS (6 total)
-- columns: inventory_id, vendor_id, quantity, status, created_at
-- =====================
INSERT INTO purchase_orders (inventory_id, vendor_id, quantity, status, created_at) VALUES
(1,  1, 50,  'CREATED',   NOW() - INTERVAL '3 days'),
(2,  5, 30,  'CREATED',   NOW() - INTERVAL '2 days'),
(3,  4, 40,  'ORDERED',   NOW() - INTERVAL '10 days'),
(6,  3, 200, 'ORDERED',   NOW() - INTERVAL '8 days'),
(15, 6, 50,  'RECEIVED',  NOW() - INTERVAL '20 days'),
(14, 6, 100, 'COMPLETED', NOW() - INTERVAL '25 days');

-- =====================
-- NOTIFICATIONS (8 total)
-- columns: message, is_read, user_id, timestamp
-- =====================
INSERT INTO notifications (message, is_read, user_id, timestamp) VALUES
('Your request for Industrial Gloves has been APPROVED',                     true,  1, NOW() - INTERVAL '4 days'),
('Your request for Cable Ties has been APPROVED',                            true,  2, NOW() - INTERVAL '6 days'),
('Your request has been REJECTED. Reason: Budget constraints',               true,  3, NOW() - INTERVAL '14 days'),
('Your request for Laptops has been REJECTED. Reason: Not in approved list', true,  1, NOW() - INTERVAL '19 days'),
('Low stock alert: Welding Rods - Current stock: 5 units',                   false, 4, NOW() - INTERVAL '1 day'),
('Low stock alert: Safety Goggles - Current stock: 3 units',                 false, 4, NOW() - INTERVAL '1 day'),
('Purchase Order for Industrial Gloves has been marked as ORDERED',          false, 5, NOW() - INTERVAL '8 days'),
('New purchase order created for Fire Extinguisher - requires review',       false, 6, NOW() - INTERVAL '12 hours');

-- =====================
-- AUDIT LOGS (10 total)
-- columns: user_id, action, module, description, timestamp
-- =====================
INSERT INTO audit_logs (user_id, action, module, description, timestamp) VALUES
(1, 'CREATE',   'REQUEST',        'New request created for Welding Rods',                 NOW() - INTERVAL '2 days'),
(2, 'CREATE',   'REQUEST',        'New request created for Safety Goggles',               NOW() - INTERVAL '1 day'),
(4, 'APPROVE',  'REQUEST',        'Request approved for Industrial Gloves',               NOW() - INTERVAL '4 days'),
(4, 'APPROVE',  'REQUEST',        'Request approved for Cable Ties',                      NOW() - INTERVAL '6 days'),
(4, 'REJECT',   'REQUEST',        'Request rejected due to budget constraints',           NOW() - INTERVAL '14 days'),
(4, 'CREATE',   'PURCHASE_ORDER', 'Purchase order created for Welding Rods',             NOW() - INTERVAL '3 days'),
(5, 'CREATE',   'PURCHASE_ORDER', 'Purchase order created for Safety Goggles',           NOW() - INTERVAL '2 days'),
(4, 'RECEIVE',  'PURCHASE_ORDER', 'Purchase order received for Cleaning Supplies',       NOW() - INTERVAL '20 days'),
(5, 'REJECT',   'REQUEST',        'Request rejected - not in approved procurement list', NOW() - INTERVAL '19 days'),
(5, 'COMPLETE', 'PURCHASE_ORDER', 'Purchase order completed for Paper A4',               NOW() - INTERVAL '25 days');