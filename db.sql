create database vieshop;
use vieshop;
-- Create Users table
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES Categories(id)
);

-- Create Shops table
CREATE TABLE Shops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(255),
    banner_url VARCHAR(255),
    address VARCHAR(255),
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    rating FLOAT DEFAULT 0,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create Products table
CREATE TABLE Products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(15,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    rating FLOAT DEFAULT 0,
    total_reviews INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES Shops(id),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Create ProductImages table
CREATE TABLE ProductImages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    is_thumbnail BOOLEAN DEFAULT FALSE,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Create ProductVariants table
CREATE TABLE ProductVariants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    price_adjustment DECIMAL(15,2) DEFAULT 0,
    stock_quantity INT NOT NULL DEFAULT 0,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Create UserAddresses table
CREATE TABLE UserAddresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create Orders table
CREATE TABLE Orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    shop_id INT NOT NULL,
    address_id INT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    order_date TIMESTAMP NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    shipping_method VARCHAR(50) NOT NULL,
    shipping_fee DECIMAL(15,2) NOT NULL,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (shop_id) REFERENCES Shops(id),
    FOREIGN KEY (address_id) REFERENCES UserAddresses(id)
);

-- Create OrderItems table
CREATE TABLE OrderItems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (product_id) REFERENCES Products(id),
    FOREIGN KEY (variant_id) REFERENCES ProductVariants(id)
);

-- Create PaymentTransactions table
CREATE TABLE PaymentTransactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    vnpay_transaction_id VARCHAR(100),
    payment_date TIMESTAMP NOT NULL,
    response_code VARCHAR(20),
    response_message TEXT,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id)
);

-- Create Reviews table
CREATE TABLE Reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL,
    content TEXT,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Create Comments table
CREATE TABLE Comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_id INT,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (product_id) REFERENCES Products(id),
    FOREIGN KEY (parent_id) REFERENCES Comments(id)
);

-- Create CartItems table
CREATE TABLE CartItems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    quantity INT NOT NULL,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (product_id) REFERENCES Products(id),
    FOREIGN KEY (variant_id) REFERENCES ProductVariants(id)
);

-- Create ChatRooms table
CREATE TABLE ChatRooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    shop_id INT NOT NULL,
    last_message_at TIMESTAMP,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (shop_id) REFERENCES Shops(id)
);

-- Create ChatMessages table
CREATE TABLE ChatMessages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chat_room_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_room_id) REFERENCES ChatRooms(id),
    FOREIGN KEY (sender_id) REFERENCES Users(id)
);

-- Create ChatbotMessages table
CREATE TABLE ChatbotMessages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message_type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    is_from_bot BOOLEAN NOT NULL,
    is_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);