-- Seed data - run AFTER backend starts once (tables created by Hibernate)
-- All passwords are BCrypt of "aadil@123"

INSERT INTO users (username, password, email, role, plaintext_password) VALUES
('admin', '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'admin@procurex.com', 'ADMIN', 'aadil@123'),
('receiver1', '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'receiver1@procurex.com', 'RECEIVER', 'aadil@123'),
('procurement1', '$2a$10$MGv02pR4Ddod5xAbTiIOI.VvPFTEOORoPVy39Iw0qjrwNwb5xvPIi', 'procurement1@procurex.com', 'PROCUREMENT', 'aadil@123');

INSERT INTO inventory (material, quantity, price) VALUES
('CCTV Camera', 50, 1500.00),
('Network Cable', 200, 25.00),
('Power Supply', 30, 450.00),
('DVR Unit', 15, 3200.00);
