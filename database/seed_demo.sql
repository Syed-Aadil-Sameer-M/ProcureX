-- ProcureX Demo Seed Data
-- Run this file to populate the database with realistic demo data

-- =====================
-- USERS (10 total)
-- =====================
INSERT INTO users (username, password, full_name, role, department, phone_number, email) VALUES
('receiver1', '$2a$10$demoHashedPassword1', 'Arjun Mehta', 'RECEIVER', 'Engineering', '+919876543210', 'arjun.mehta@procurex.com'),
('receiver2', '$2a$10$demoHashedPassword2', 'Priya Sharma', 'RECEIVER', 'Operations', '+919876543211', 'priya.sharma@procurex.com'),
('receiver3', '$2a$10$demoHashedPassword3', 'Vikram Singh', 'RECEIVER', 'Logistics', '+919876543212', 'vikram.singh@procurex.com'),
('procurement1', '$2a$10$demoHashedPassword4', 'Neha Patel', 'PROCUREMENT', 'Finance', '+919876543213', 'neha.patel@procurex.com'),
('procurement2', '$2a$10$demoHashedPassword5', 'Rohit Verma', 'PROCUREMENT', 'Finance', '+919876543214', 'rohit.verma@procurex.com'),
('admin', '$2a$10$demoHashedPassword6', 'Suresh Kumar', 'ADMIN', 'Admin', '+919876543215', 'admin@procurex.com'),
('admin2', '$2a$10$demoHashedPassword7', 'Anita Desai', 'ADMIN', 'Admin', '+919876543216', 'admin2@procurex.com'),
('receiver4', '$2a$10$demoHashedPassword8', 'Kiran Rao', 'RECEIVER', 'Engineering', '+919876543217', 'kiran.rao@procurex.com'),
('procurement3', '$2a$10$demoHashedPassword9', 'Deepak Joshi', 'PROCUREMENT', 'Operations', '+919876543218', 'deepak.joshi@procurex.com'),
('receiver5', '$2a$10$demoHashedPassword10', 'Meera Nair', 'RECEIVER', 'Logistics', '+919876543219', 'meera.nair@procurex.com');

-- =====================
-- VENDORS (6 total)
-- =====================
INSERT INTO vendors (name, contact_person, email, phone, address) VALUES
('ABC Suppliers Pvt Ltd', 'Amit Bose', 'amit@abcsuppliers.com', '+912233445566', '12 Industrial Area, Mumbai, Maharashtra'),
('TechPro Industries', 'Sunita Rao', 'sunita@techpro.com', '+912233445567', '45 Tech Park, Bangalore, Karnataka'),
('Global Traders', 'Ramesh Gupta', 'ramesh@globaltraders.com', '+912233445568', '78 Trade Center, Delhi, NCR'),
('Metro Hardware', 'Kavita Shah', 'kavita@metrohardware.com', '+912233445569', '23 Hardware Street, Pune, Maharashtra'),
('SafetyFirst Co', 'Ajay Nair', 'ajay@safetyfirst.com', '+912233445570', '56 Safety Nagar, Chennai, Tamil Nadu'),
('Office Essentials', 'Pooja Iyer', 'pooja@officeessentials.com', '+912233445571', '90 Office Complex, Hyderabad, Telangana');

-- =====================
-- INVENTORY (20 items)
-- =====================

-- CRITICAL stock (quantity < 10)
INSERT INTO inventory (name, description, quantity, min_stock, unit, category, stock_level) VALUES
('Welding Rods', 'Heavy duty welding rods for industrial use', 5, 20, 'pieces', 'Tools', 'CRITICAL'),
('Safety Goggles', 'UV protected safety goggles for site workers', 3, 15, 'pieces', 'Safety', 'CRITICAL'),
('Industrial Gloves', 'Heat resistant industrial safety gloves', 8, 25, 'pairs', 'Safety', 'CRITICAL'),
('Fire Extinguisher', 'CO2 fire extinguisher 5kg', 2, 10, 'pieces', 'Safety', 'CRITICAL'),
('Circuit Breakers', '32A circuit breakers for electrical panels', 7, 20, 'pieces', 'Electrical', 'CRITICAL'),

-- LOW stock (quantity 10-50)
('Screws M6', 'Stainless steel screws M6x25mm', 45, 100, 'pieces', 'Hardware', 'LOW'),
('Cable Ties', 'Heavy duty nylon cable ties 300mm', 30, 200, 'pieces', 'Electrical', 'LOW'),
('Adhesive Tape', 'Industrial strength adhesive tape 50mm', 20, 50, 'rolls', 'Consumables', 'LOW'),
('Paint Brushes', 'Industrial paint brushes set of 5', 15, 30, 'sets', 'Tools', 'LOW'),
('Safety Helmets', 'Hard hat safety helmets yellow', 12, 20, 'pieces', 'Safety', 'LOW'),
('Drill Bits Set', 'HSS drill bits set 1-13mm', 10, 15, 'sets', 'Tools', 'LOW'),
('Extension Cords', '10 meter heavy duty extension cords', 18, 25, 'pieces', 'Electrical', 'LOW'),

-- OK stock (quantity > 50)
('Laptop Chargers', '65W universal laptop chargers', 75, 20, 'pieces', 'Electronics', 'OK'),
('Paper A4', 'A4 printing paper 500 sheets per ream', 200, 50, 'reams', 'Stationery', 'OK'),
('Cleaning Supplies', 'General purpose cleaning liquid 5L', 80, 20, 'bottles', 'Consumables', 'OK'),
('Ballpoint Pens', 'Blue ballpoint pens box of 50', 150, 30, 'boxes', 'Stationery', 'OK'),
('Printer Cartridges', 'Black ink cartridges for HP printers', 60, 15, 'pieces', 'Electronics', 'OK'),
('Measuring Tape', '5 meter steel measuring tape', 55, 10, 'pieces', 'Tools', 'OK'),
('Work Boots', 'Steel toe safety work boots', 90, 20, 'pairs', 'Safety', 'OK'),
('Lubricant Oil', 'Multi-purpose machine lubricant 1L', 120, 30, 'bottles', 'Consumables', 'OK');

-- =====================
-- REQUESTS (15 total)
-- =====================

-- PENDING (3)
INSERT INTO requests (title, description, material, quantity, status, created_by, department, created_at) VALUES
('Urgent Welding Rods Required', 'Urgent requirement for site construction welding work', 'Welding Rods', 50, 'PENDING', 'receiver1', 'Engineering', NOW() - INTERVAL '2 days'),
('Safety Equipment Request', 'Monthly safety equipment replenishment for site workers', 'Safety Goggles', 20, 'PENDING', 'receiver2', 'Operations', NOW() - INTERVAL '1 day'),
('Office Supplies Request', 'Monthly office supplies for admin department', 'Paper A4', 30, 'PENDING', 'receiver3', 'Logistics', NOW() - INTERVAL '3 hours');

-- APPROVED (5)
INSERT INTO requests (title, description, material, quantity, status, created_by, department, created_at, approved_by, approved_at) VALUES
('Industrial Gloves Restock', 'Critical restock of industrial gloves for factory floor', 'Industrial Gloves', 40, 'APPROVED', 'receiver1', 'Engineering', NOW() - INTERVAL '5 days', 'procurement1', NOW() - INTERVAL '4 days'),
('Electrical Supplies', 'Quarterly electrical supplies procurement', 'Cable Ties', 500, 'APPROVED', 'receiver2', 'Operations', NOW() - INTERVAL '7 days', 'procurement1', NOW() - INTERVAL '6 days'),
('Tools Replenishment', 'Drill bits and measuring tools for maintenance team', 'Drill Bits Set', 10, 'APPROVED', 'receiver3', 'Logistics', NOW() - INTERVAL '10 days', 'procurement2', NOW() - INTERVAL '9 days'),
('Safety Helmets Order', 'New safety helmets for new site workers', 'Safety Helmets', 15, 'APPROVED', 'receiver1', 'Engineering', NOW() - INTERVAL '12 days', 'procurement2', NOW() - INTERVAL '11 days'),
('Printer Cartridges', 'Monthly printer cartridge replenishment', 'Printer Cartridges', 20, 'APPROVED', 'receiver2', 'Operations', NOW() - INTERVAL '8 days', 'procurement1', NOW() - INTERVAL '7 days');

-- REJECTED (4)
INSERT INTO requests (title, description, material, quantity, status, created_by, department, created_at, approved_by, approved_at, rejection_reason) VALUES
('Luxury Office Chairs', 'Request for ergonomic office chairs upgrade', 'Office Chairs', 10, 'REJECTED', 'receiver3', 'Logistics', NOW() - INTERVAL '15 days', 'procurement1', NOW() - INTERVAL '14 days', 'Budget constraints for current quarter'),
('Extra Laptops', 'Additional laptops for backup purposes', 'Laptops', 5, 'REJECTED', 'receiver1', 'Engineering', NOW() - INTERVAL '20 days', 'procurement2', NOW() - INTERVAL '19 days', 'Not in approved procurement list'),
('Air Purifiers', 'Air purifiers for office spaces', 'Air Purifiers', 8, 'REJECTED', 'receiver2', 'Operations', NOW() - INTERVAL '18 days', 'procurement1', NOW() - INTERVAL '17 days', 'Requires management approval first'),
('Standing Desks', 'Height adjustable standing desks for developers', 'Standing Desks', 6, 'REJECTED', 'receiver3', 'Logistics', NOW() - INTERVAL '25 days', 'procurement2', NOW() - INTERVAL '24 days', 'Outside budget allocation');

-- COMPLETED (3)
INSERT INTO requests (title, description, material, quantity, status, created_by, department, created_at, approved_by, approved_at) VALUES
('Fire Extinguisher Restock', 'Annual fire safety equipment restock', 'Fire Extinguisher', 10, 'COMPLETED', 'receiver1', 'Engineering', NOW() - INTERVAL '30 days', 'procurement1', NOW() - INTERVAL '29 days'),
('Cleaning Supplies Monthly', 'Monthly cleaning supplies for all departments', 'Cleaning Supplies', 20, 'COMPLETED', 'receiver2', 'Operations', NOW() - INTERVAL '28 days', 'procurement2', NOW() - INTERVAL '27 days'),
('Stationery Restock', 'Quarterly stationery restock for all departments', 'Ballpoint Pens', 100, 'COMPLETED', 'receiver3', 'Logistics', NOW() - INTERVAL '22 days', 'procurement1', NOW() - INTERVAL '21 days');

-- =====================
-- PURCHASE ORDERS (6)
-- =====================
INSERT INTO purchase_orders (po_number, inventory_id, vendor_id, quantity, status, created_by, created_at) VALUES
('PO-2026-001', 1, 1, 50, 'CREATED', 'procurement1', NOW() - INTERVAL '3 days'),
('PO-2026-002', 2, 5, 30, 'CREATED', 'procurement2', NOW() - INTERVAL '2 days'),
('PO-2026-003', 3, 4, 40, 'ORDERED', 'procurement1', NOW() - INTERVAL '10 days'),
('PO-2026-004', 6, 3, 200, 'ORDERED', 'procurement2', NOW() - INTERVAL '8 days'),
('PO-2026-005', 15, 6, 50, 'RECEIVED', 'procurement1', NOW() - INTERVAL '20 days'),
('PO-2026-006', 14, 6, 100, 'COMPLETED', 'procurement2', NOW() - INTERVAL '25 days');

-- =====================
-- AUDIT LOGS (10)
-- =====================
INSERT INTO audit_logs (action, entity_type, entity_id, performed_by, details, created_at) VALUES
('REQUEST_CREATED', 'REQUEST', 1, 'receiver1', 'New request created for Welding Rods', NOW() - INTERVAL '2 days'),
('REQUEST_CREATED', 'REQUEST', 2, 'receiver2', 'New request created for Safety Goggles', NOW() - INTERVAL '1 day'),
('REQUEST_APPROVED', 'REQUEST', 4, 'procurement1', 'Request approved for Industrial Gloves', NOW() - INTERVAL '4 days'),
('REQUEST_APPROVED', 'REQUEST', 5, 'procurement1', 'Request approved for Cable Ties', NOW() - INTERVAL '6 days'),
('REQUEST_REJECTED', 'REQUEST', 9, 'procurement1', 'Request rejected - Budget constraints', NOW() - INTERVAL '14 days'),
('PO_CREATED', 'PURCHASE_ORDER', 1, 'procurement1', 'Purchase order created PO-2026-001', NOW() - INTERVAL '3 days'),
('PO_CREATED', 'PURCHASE_ORDER', 2, 'procurement2', 'Purchase order created PO-2026-002', NOW() - INTERVAL '2 days'),
('PO_RECEIVED', 'PURCHASE_ORDER', 5, 'procurement1', 'Purchase order received PO-2026-005', NOW() - INTERVAL '20 days'),
('REQUEST_REJECTED', 'REQUEST', 10, 'procurement2', 'Request rejected - Not in approved list', NOW() - INTERVAL '19 days'),
('PO_RECEIVED', 'PURCHASE_ORDER', 6, 'procurement2', 'Purchase order completed PO-2026-006', NOW() - INTERVAL '25 days');

-- =====================
-- NOTIFICATIONS (8)
-- =====================
INSERT INTO notifications (user_id, message, is_read, created_at) VALUES
('receiver1', 'Your request for Industrial Gloves has been APPROVED', true, NOW() - INTERVAL '4 days'),
('receiver2', 'Your request for Cable Ties has been APPROVED', true, NOW() - INTERVAL '6 days'),
('receiver3', 'Your request for Luxury Office Chairs has been REJECTED. Reason: Budget constraints', true, NOW() - INTERVAL '14 days'),
('receiver1', 'Your request for Extra Laptops has been REJECTED. Reason: Not in approved procurement list', true, NOW() - INTERVAL '19 days'),
('procurement1', 'Low stock alert: Welding Rods - Current stock: 5 units', false, NOW() - INTERVAL '1 day'),
('procurement1', 'Low stock alert: Safety Goggles - Current stock: 3 units', false, NOW() - INTERVAL '1 day'),
('procurement2', 'Purchase Order PO-2026-003 has been marked as ORDERED', false, NOW() - INTERVAL '8 days'),
('admin', 'New user registration pending approval', false, NOW() - INTERVAL '12 hours');