-- Users data
INSERT INTO Users (username, email, password_hash, phone_number, full_name, role) VALUES
('nguyenvana', 'nguyenvana@gmail.com', 'hash123', '0901234567', 'Nguyễn Văn A', 'user'),
('tranthib', 'tranthib@gmail.com', 'hash456', '0912345678', 'Trần Thị B', 'user'),
('phamvanc', 'phamvanc@gmail.com', 'hash789', '0923456789', 'Phạm Văn C', 'shop_owner');

-- Categories data
INSERT INTO Categories (name, description, display_order) VALUES
('Quần áo', 'Các loại quần áo thời trang', 1),
('Giày dép', 'Giày dép nam nữ các loại', 2),
('Phụ kiện', 'Phụ kiện thời trang', 3);

-- Shops data
INSERT INTO Shops (user_id, name, description, address, phone, is_verified, rating) VALUES
(3, 'Thời Trang Phạm Văn', 'Shop quần áo thời trang nam nữ', '123 Lê Lợi, P.Bến Nghé, Q.1, TP.HCM', '0923456789', TRUE, 4.5),
(1, 'Giày Xinh Nguyễn Văn', 'Chuyên các loại giày dép', '45 Nguyễn Huệ, P.Bến Nghé, Q.1, TP.HCM', '0901234567', TRUE, 4.8),
(2, 'Phụ Kiện Trần Thị', 'Phụ kiện thời trang cao cấp', '67 Đồng Khởi, P.Bến Nghé, Q.1, TP.HCM', '0912345678', FALSE, 4.2);

-- Products data
INSERT INTO Products (shop_id, category_id, name, description, base_price, stock_quantity, rating) VALUES
(1, 1, 'Áo thun nam basic', 'Áo thun nam cotton 100%', 150000, 100, 4.5),
(1, 1, 'Quần jean nữ ống rộng', 'Quần jean nữ form rộng thời trang', 350000, 50, 4.3),
(2, 2, 'Giày thể thao Nike Air', 'Giày thể thao Nike chính hãng', 2500000, 30, 4.7);

-- ProductImages data
INSERT INTO ProductImages (product_id, image_url, is_thumbnail) VALUES
(1, '/images/ao-thun-1.jpg', TRUE),
(1, '/images/ao-thun-2.jpg', FALSE),
(2, '/images/quan-jean-1.jpg', TRUE);

-- ProductVariants data
INSERT INTO ProductVariants (product_id, name, value, price_adjustment, stock_quantity) VALUES
(1, 'Size', 'M', 0, 30),
(1, 'Size', 'L', 10000, 40),
(2, 'Màu', 'Xanh đậm', 0, 25);

-- UserAddresses data
INSERT INTO UserAddresses (user_id, recipient_name, phone, province, district, ward, street_address, is_default) VALUES
(1, 'Nguyễn Văn A', '0901234567', 'TP.HCM', 'Quận 1', 'Phường Bến Nghé', '123 Lê Lợi', TRUE),
(2, 'Trần Thị B', '0912345678', 'Hà Nội', 'Quận Hoàn Kiếm', 'Phường Hàng Bài', '45 Tràng Tiền', TRUE),
(3, 'Phạm Văn C', '0923456789', 'Đà Nẵng', 'Quận Hải Châu', 'Phường Hòa Thuận Tây', '67 Lê Duẩn', TRUE);

-- Orders data
INSERT INTO Orders (user_id, shop_id, address_id, total_amount, status, order_date, payment_method, shipping_method, shipping_fee) VALUES
(1, 1, 1, 500000, 'Completed', '2024-01-15 10:00:00', 'VNPay', 'Standard', 30000),
(2, 2, 2, 2530000, 'Processing', '2024-01-16 14:30:00', 'COD', 'Express', 45000),
(3, 3, 3, 180000, 'Delivered', '2024-01-17 09:15:00', 'VNPay', 'Standard', 30000);

-- OrderItems data
INSERT INTO OrderItems (order_id, product_id, variant_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 2, 150000, 300000),
(2, 3, NULL, 1, 2500000, 2500000),
(3, 1, 2, 1, 160000, 160000);

-- PaymentTransactions data
INSERT INTO PaymentTransactions (order_id, transaction_id, amount, payment_method, status, vnpay_transaction_id, payment_date) VALUES
(1, 'TRX001', 500000, 'VNPay', 'Success', 'VNP001', '2024-01-15 10:01:00'),
(2, 'TRX002', 2530000, 'COD', 'Pending', NULL, '2024-01-16 14:31:00'),
(3, 'TRX003', 180000, 'VNPay', 'Success', 'VNP002', '2024-01-17 09:16:00');

-- Reviews data
INSERT INTO Reviews (user_id, product_id, rating, content) VALUES
(1, 1, 5, 'Áo đẹp, vải tốt, form chuẩn'),
(2, 2, 4, 'Quần ống hơi rộng một chút nhưng vẫn ổn'),
(3, 3, 5, 'Giày chính hãng, đi rất êm chân');

-- Comments data
INSERT INTO Comments (user_id, product_id, content) VALUES
(1, 1, 'Shop có ship về Vũng Tàu không ạ?'),
(2, 1, 'Áo này có màu trắng không shop?'),
(3, 2, 'Quần này có size 30 không ạ?');

-- CartItems data
INSERT INTO CartItems (user_id, product_id, variant_id, quantity) VALUES
(1, 2, 3, 1),
(2, 1, 1, 2),
(3, 3, NULL, 1);

-- ChatRooms data
INSERT INTO ChatRooms (user_id, shop_id, last_message_at) VALUES
(1, 1, '2024-01-15 15:30:00'),
(2, 2, '2024-01-16 10:45:00'),
(3, 3, '2024-01-17 14:20:00');

-- ChatMessages data
INSERT INTO ChatMessages (chat_room_id, sender_id, message_type, content, is_read) VALUES
(1, 1, 'text', 'Chào shop, còn áo size L không ạ?', TRUE),
(1, 3, 'text', 'Chào bạn, size L còn 5 cái ạ', TRUE),
(2, 2, 'text', 'Shop ơi, giày này còn size 42 không?', FALSE);

-- ChatbotMessages data
INSERT INTO ChatbotMessages (user_id, message_type, content, is_from_bot) VALUES
(1, 'text', 'Xin chào, tôi có thể giúp gì cho bạn?', TRUE),
(1, 'text', 'Tôi muốn tìm áo thun nam', FALSE),
(2, 'text', 'Chào bạn, bạn cần hỗ trợ gì ạ?', TRUE);