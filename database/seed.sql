-- Seed data for ProcureX

INSERT INTO users (username, password, email, role) VALUES
('admin', '$2a$10$hashedpassword', 'admin@procurex.com', 'ADMIN'),
('user1', '$2a$10$hashedpassword', 'user1@procurex.com', 'USER');

INSERT INTO inventory (name, quantity, price) VALUES
('Item 1', 100, 10.00),
('Item 2', 50, 20.00);
