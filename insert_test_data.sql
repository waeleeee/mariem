-- Insert test user (password is 'password123' pre-hashed)
INSERT INTO "Users" ("id", "firstName", "lastName", "email", "password", "phoneNumber", "address", "role", "createdAt", "updatedAt")
VALUES 
('11111111-1111-1111-1111-111111111111', 'John', 'Doe', 'john@example.com', 'mariem', '1234567890', '123 Main St', 'admin', NOW(), NOW());

-- Insert test products
INSERT INTO "Products" ("id", "name", "description", "price", "stock", "category", "brand", "model", "specifications", "isActive", "createdAt", "updatedAt")
VALUES
('22222222-2222-2222-2222-222222222222', 'Professional Microphone', 'High-quality studio microphone for professional recording', 299.99, 25, 'microphones', 'AudioPro', 'AP-200', '{"frequency": "20Hz-20kHz", "pattern": "Cardioid", "connectivity": "XLR"}', true, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Wireless Microphone', 'Reliable wireless microphone for stage performances', 199.50, 15, 'microphones', 'SoundMax', 'SM-100W', '{"frequency": "50Hz-15kHz", "range": "100m", "batteryLife": "8 hours"}', true, NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Studio Headphones', 'Closed-back studio headphones for monitoring', 149.99, 30, 'accessories', 'AudioPro', 'AP-H300', '{"frequency": "10Hz-25kHz", "impedance": "64 ohms", "cableLength": "3m"}', true, NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Portable Recorder', 'Professional portable audio recorder for field recording', 249.99, 20, 'accessories', 'SoundMax', 'SM-R200', '{"storage": "32GB", "batteryLife": "10 hours", "inputs": "2 XLR/TRS combo"}', true, NOW(), NOW());

-- Insert a test order
INSERT INTO "Orders" ("id", "userId", "status", "totalAmount", "shippingAddress", "paymentStatus", "paymentMethod", "createdAt", "updatedAt")
VALUES
('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'processing', 499.49, '123 Main St, Anytown, USA', 'completed', 'credit_card', NOW(), NOW());

-- Insert order items
INSERT INTO "OrderItems" ("id", "orderId", "productId", "quantity", "priceAtTime", "subtotal", "createdAt", "updatedAt")
VALUES
('77777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 1, 299.99, 299.99, NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 1, 199.50, 199.50, NOW(), NOW()); 