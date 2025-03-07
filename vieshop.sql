-- MySQL dump 10.13  Distrib 9.0.1, for Win64 (x86_64)
--
-- Host: localhost    Database: vieshop
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `cartitems_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitems`
--

LOCK TABLES `cartitems` WRITE;
/*!40000 ALTER TABLE `cartitems` DISABLE KEYS */;
INSERT INTO `cartitems` VALUES (1,1,2,3,1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(2,2,1,1,2,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(3,3,3,NULL,1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15');
/*!40000 ALTER TABLE `cartitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_sample` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `categories_shops_id_fk` (`shop_id`),
  CONSTRAINT `categories_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,NULL,'Quß║ºn ├ío','C├íc loß║íi quß║ºn ├ío thß╗¥i trang',NULL,1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15',0),(2,NULL,'Gi├áy d├⌐p','Gi├áy d├⌐p nam nß╗» c├íc loß║íi',NULL,2,0,'2025-01-20 18:45:15','2025-01-20 18:45:15',0),(3,NULL,'Phß╗Ñ kiß╗çn','Phß╗Ñ kiß╗çn thß╗¥i trang',NULL,3,0,'2025-01-20 18:45:15','2025-01-20 18:45:15',0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `message_type` varchar(20) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES (1,1,'text','Ch├áo shop, c├▓n ├ío size L kh├┤ng ß║í?',1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(2,3,'text','Ch├áo bß║ín, size L c├▓n 5 c├íi ß║í',1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(3,2,'text','Shop ╞íi, gi├áy n├áy c├▓n size 42 kh├┤ng?',0,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(4,1,'TEXT','TEST',0,0,NULL,NULL),(5,1,'TEXT','TEST',0,0,NULL,NULL),(6,1,'TEXT','TEST',0,0,NULL,NULL),(7,1,'TEXT','TEST',0,0,NULL,NULL),(8,1,'TEXT','TEST',0,0,NULL,NULL),(9,1,'TEXT','TEST',0,0,NULL,NULL),(10,1,'TEXT','TEST',0,0,NULL,NULL),(11,1,'OK','TEST',0,0,NULL,NULL),(12,1,'OK','TEST',0,0,NULL,NULL),(13,1,'OK','TEST',0,0,NULL,NULL),(14,1,'OK','TEST',0,0,NULL,NULL),(15,1,'OK','TEST',0,0,NULL,NULL),(16,1,'OK','TEST',0,0,NULL,NULL);
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbot_messages`
--

DROP TABLE IF EXISTS `chatbot_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatbot_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message_type` varchar(20) NOT NULL,
  `content` text NOT NULL,
  `is_from_bot` tinyint(1) NOT NULL,
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chatbot_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbot_messages`
--

LOCK TABLES `chatbot_messages` WRITE;
/*!40000 ALTER TABLE `chatbot_messages` DISABLE KEYS */;
INSERT INTO `chatbot_messages` VALUES (1,1,'text','Xin ch├áo, t├┤i c├│ thß╗â gi├║p g├¼ cho bß║ín?',1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(2,1,'text','T├┤i muß╗æn t├¼m ├ío thun nam',0,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(3,2,'text','Ch├áo bß║ín, bß║ín cß║ºn hß╗ù trß╗ú g├¼ ß║í?',1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15');
/*!40000 ALTER TABLE `chatbot_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_images`
--

DROP TABLE IF EXISTS `comment_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `image_url` text NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `comment_images_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_images`
--

LOCK TABLES `comment_images` WRITE;
/*!40000 ALTER TABLE `comment_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `content` text NOT NULL,
  `parent_id` int DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,1,'Shop c├│ ship vß╗ü V┼⌐ng T├áu kh├┤ng ß║í?',NULL,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(2,2,1,'├üo n├áy c├│ m├áu trß║»ng kh├┤ng shop?',NULL,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(3,3,2,'Quß║ºn n├áy c├│ size 30 kh├┤ng ß║í?',NULL,0,'2025-01-20 18:45:15','2025-01-20 18:45:15');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invalidate_tokens`
--

DROP TABLE IF EXISTS `invalidate_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invalidate_tokens` (
  `id` varchar(36) NOT NULL,
  `expiration` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invalidate_tokens`
--

LOCK TABLES `invalidate_tokens` WRITE;
/*!40000 ALTER TABLE `invalidate_tokens` DISABLE KEYS */;
INSERT INTO `invalidate_tokens` VALUES ('195eed1c-bd1b-41db-87a3-79d025b9d0f4','2025-01-26 05:37:00'),('661779b6-7169-44de-b5e2-18c02cc948d1','2025-01-26 07:51:01'),('6b69a9b6-98a2-40db-bdf6-a261f5b4ff83','2025-02-01 23:02:29'),('895af825-16c9-4ed2-99c6-145e9e59a4b1','2025-02-01 23:07:40'),('a44ab4f8-9ae2-4513-a35f-945652d73c83','2025-02-01 22:48:37'),('cfa5e7e4-58cc-4df1-8e16-3ea28aa621fd','2025-01-26 08:58:41'),('fb0cd7a4-ab77-4be5-8de6-faad94e759ac','2025-02-01 19:51:16');
/*!40000 ALTER TABLE `invalidate_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,2,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(2,2,3,NULL,1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(3,3,1,2,1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(4,6,1,1,1,0,NULL,NULL),(5,7,1,1,1,0,NULL,NULL),(6,8,1,1,1,0,NULL,NULL),(7,9,1,1,1,0,NULL,NULL),(8,9,2,3,1,0,NULL,NULL),(9,10,1,1,1,0,NULL,NULL),(10,11,1,1,1,0,NULL,NULL),(11,12,1,1,1,0,NULL,NULL),(12,13,1,1,1,0,NULL,NULL),(13,14,1,1,1,0,NULL,NULL),(14,15,1,1,1,0,NULL,NULL),(15,16,1,1,1,0,NULL,NULL);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_id` int NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` varchar(50) NOT NULL,
  `shipping_method` varchar(50) NOT NULL,
  `shipping_fee` decimal(15,2) NOT NULL,
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`address_id`) REFERENCES `user_addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,500000.00,'Completed','Standard',30000.00,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(2,2,2,2530000.00,'Processing','Express',45000.00,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(3,3,3,180000.00,'Delivered','Standard',30000.00,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(4,1,1,70000.00,'PENDING','FREESHIP',0.00,1,NULL,'2025-02-03 15:02:30'),(5,1,1,70000.00,'PENDING','FREESHIP',0.00,1,NULL,'2025-02-03 15:02:30'),(6,1,1,70000.00,'PENDING','FREESHIP',0.00,1,NULL,'2025-02-03 15:02:30'),(7,1,1,70000.00,'PENDING','FREESHIP',0.00,1,NULL,'2025-02-03 15:02:30'),(8,1,1,70000.00,'PENDING','FREESHIP',0.00,1,NULL,'2025-02-03 15:02:30'),(9,1,1,120000.00,'PENDING','FREESHIP',0.00,0,'2025-02-02 13:07:32','2025-02-02 13:07:32'),(10,1,1,70000.00,'PENDING','FREESHIP',0.00,0,'2025-02-03 14:47:28','2025-02-03 14:47:28'),(11,1,1,70000.00,'PENDING','FREESHIP',0.00,0,'2025-02-03 14:52:16','2025-02-03 14:52:16'),(12,1,1,70000.00,'PENDING','FREESHIP',0.00,0,'2025-02-03 14:54:41','2025-02-03 14:54:41'),(13,1,1,70000.00,'PENDING','FREESHIP',0.00,0,'2025-02-03 15:17:20','2025-02-03 15:17:20'),(14,1,1,70000.00,'PENDING','FREESHIP',0.00,0,'2025-02-03 15:21:09','2025-02-03 15:21:09'),(15,1,1,70000.00,'PENDING','FREESHIP',0.00,0,'2025-02-22 10:35:19','2025-02-22 10:35:19'),(16,1,1,70000.00,'PENDING','FREESHIP',0.00,0,'2025-02-22 10:35:21','2025-02-22 10:35:21');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` varchar(50) NOT NULL,
  `description` text,
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `checkout_url` text,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `paymenttransactions_users_id_fk` (`user_id`),
  CONSTRAINT `payment_transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `paymenttransactions_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
INSERT INTO `payment_transactions` VALUES (1,1,'TRX001',500000.00,'Success',NULL,0,'2025-01-20 18:45:15','2025-01-20 18:45:15',NULL,NULL),(2,2,'TRX002',2530000.00,'Pending',NULL,0,'2025-01-20 18:45:15','2025-01-20 18:45:15',NULL,NULL),(3,3,'TRX003',180000.00,'Success',NULL,0,'2025-01-20 18:45:15','2025-01-20 18:45:15',NULL,NULL),(12,12,'481421',70000.00,'PAID','Qabhpp7588  CASSO3313 4 83bc0JwQ9PUvqPyb0LNfmmsf Thanh toan don hang 12 Trace 887472',0,NULL,NULL,1,NULL),(13,13,'839951',70000.00,'PAID','Qabhpr1860  CASSO3313 4 6K5JP7mstXnxN1JZVi36ONpp Thanh toan don hang 13 Trace 953163',0,NULL,NULL,1,NULL),(14,14,'68652',70000.00,'PAID','Qabhpr3016  CASSO3313 4 YTbGAHlfnipmPaFQpyPTaLV6 Thanh toan don hang 14 Trace 964552',0,NULL,NULL,1,NULL);
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `display_order` int DEFAULT '0',
  `is_thumbnail` tinyint(1) DEFAULT '0',
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'https://gcdzatdsbirirrtxktlj.supabase.co/storage/v1/object/public/vieshop/user_1/466980787_1123076103154847_8465513501076266870_n.jpg',0,1,0,'2025-01-20 18:45:15','2025-02-03 15:08:35'),(2,1,'https://gcdzatdsbirirrtxktlj.supabase.co/storage/v1/object/public/vieshop/user_1/466980787_1123076103154847_8465513501076266870_n.jpg',0,0,0,'2025-01-20 18:45:15','2025-02-03 15:08:35'),(3,2,'/images/quan-jean-1.jpg',0,1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(4,3,'https://gcdzatdsbirirrtxktlj.supabase.co/storage/v1/object/public/vieshop/user_1/466980787_1123076103154847_8465513501076266870_n.jpg',0,1,0,'2025-02-01 03:24:55','2025-02-01 03:24:55');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(15,2) DEFAULT '0.00',
  `quantity` int NOT NULL DEFAULT '0',
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'Size L',70000.00,30,0,'2025-01-20 18:45:15','2025-02-01 16:44:56'),(2,1,'Size M',100000.00,40,0,'2025-01-20 18:45:15','2025-02-01 16:44:56'),(3,2,'M├áu',50000.00,25,0,'2025-01-20 18:45:15','2025-02-01 18:31:10');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `base_price` decimal(15,2) NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `rating` float DEFAULT '0',
  `total_reviews` int DEFAULT '0',
  `total_sales` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `shop_id` (`shop_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,1,'├üo thun nam basic','├üo thun nam cotton 100%',150000.00,100,4.5,0,0,1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(2,1,1,'Quß║ºn jean nß╗» ß╗æng rß╗Öng','Quß║ºn jean nß╗» form rß╗Öng thß╗¥i trang',350000.00,50,4.3,0,0,1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(3,2,2,'Gi├áy thß╗â thao Nike Air','Gi├áy thß╗â thao Nike ch├¡nh h├úng',2500000.00,30,4.7,0,0,1,0,'2025-01-20 18:45:15','2025-02-01 03:30:29');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rating` int NOT NULL,
  `content` text,
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,5,'├üo ─æß║╣p, vß║úi tß╗æt, form chuß║⌐n',0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(2,2,2,4,'Quß║ºn ß╗æng h╞íi rß╗Öng mß╗Öt ch├║t nh╞░ng vß║½n ß╗òn',0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(3,3,3,5,'Gi├áy ch├¡nh h├úng, ─æi rß║Ñt ├¬m ch├ón',0,'2025-01-20 18:45:15','2025-01-20 18:45:15');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shops` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `avatar_url` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_verified` int DEFAULT '0',
  `rating` float DEFAULT '0',
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `shops_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

LOCK TABLES `shops` WRITE;
/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES (1,3,'Thß╗¥i Trang Phß║ím V─ân','Shop quß║ºn ├ío thß╗¥i trang nam nß╗»',NULL,NULL,'123 L├¬ Lß╗úi, P.Bß║┐n Ngh├⌐, Q.1, TP.HCM','0923456789',1,4.5,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(2,1,'Gi├áy Xinh Nguyß╗àn V─ân','Chuy├¬n c├íc loß║íi gi├áy d├⌐p','https://gcdzatdsbirirrtxktlj.supabase.co/storage/v1/object/public/vieshop/user_1/466980787_1123076103154847_8465513501076266870_n.jpg','https://gcdzatdsbirirrtxktlj.supabase.co/storage/v1/object/public/vieshop/user_1/464069905_1101420038653787_8953916812585695519_n.jpg','45 Nguyß╗àn Huß╗ç, P.Bß║┐n Ngh├⌐, Q.1, TP.HCM','0901234567',1,0,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(3,2,'Phß╗Ñ Kiß╗çn Trß║ºn Thß╗ï','Phß╗Ñ kiß╗çn thß╗¥i trang cao cß║Ñp',NULL,NULL,'67 ─Éß╗ông Khß╗ƒi, P.Bß║┐n Ngh├⌐, Q.1, TP.HCM','0912345678',0,4.2,0,'2025-01-20 18:45:15','2025-01-20 18:45:15'),(4,1,'','','','','','',NULL,0,NULL,NULL,NULL),(5,1,'','','','','','',NULL,0,NULL,NULL,NULL),(6,1,'','','','','','',NULL,0,NULL,NULL,NULL),(7,1,'','','','','','',NULL,0,NULL,NULL,NULL),(8,1,'alo','Test','test','test','H├á Nß╗Öi','0000',NULL,0,1,NULL,NULL),(9,1,'alo','Test','test','11111','H├á Nß╗Öi','0000',NULL,0,NULL,NULL,NULL),(10,1,'t','t','t','t','t','t',NULL,0,NULL,NULL,NULL),(11,1,'a','d','e','f','b','c',NULL,0,NULL,NULL,NULL),(12,1,'Test shop','H├á Nß╗Öi','xxx','xxx','H├á Nß╗Öi','0843',NULL,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_addresses`
--

DROP TABLE IF EXISTS `user_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `province` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `ward` varchar(100) NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `address_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_addresses`
--

LOCK TABLES `user_addresses` WRITE;
/*!40000 ALTER TABLE `user_addresses` DISABLE KEYS */;
INSERT INTO `user_addresses` VALUES (1,1,'Nguyß╗àn V─ân A','0901234567','TP.HCM','Quß║¡n 1','Ph╞░ß╗¥ng Bß║┐n Ngh├⌐','123 L├¬ Lß╗úi',1,0,'2025-01-20 18:45:15','2025-02-01 12:46:33','Nha rieng'),(2,2,'Trß║ºn Thß╗ï B','0912345678','H├á Nß╗Öi','Quß║¡n Ho├án Kiß║┐m','Ph╞░ß╗¥ng H├áng B├ái','45 Tr├áng Tiß╗ün',1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15',NULL),(3,3,'Phß║ím V─ân C','0923456789','─É├á Nß║╡ng','Quß║¡n Hß║úi Ch├óu','Ph╞░ß╗¥ng H├▓a Thuß║¡n T├óy','67 L├¬ Duß║⌐n',1,0,'2025-01-20 18:45:15','2025-01-20 18:45:15',NULL);
/*!40000 ALTER TABLE `user_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1',
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nguyenvana','nguyenvana12345@gmail.com','$2a$10$sj9qTxN1WQQkGusZ7ZHimO5Gug/3dVT5Yi.NuJiWcW.sdnf8UR9iS','0901234567','Nguyß╗àn V─ân A','ADMIN',1,0,'2025-01-20 18:45:15','2025-01-22 05:01:47'),(2,'tranthib','tranthib@gmail.com','hash456','0912345678','Trß║ºn Thß╗ï B','USER',1,0,'2025-01-20 18:45:15','2025-01-21 13:04:35'),(3,'phamvanc','phamvanc@gmail.com','hash789','0923456789','Phß║ím V─ân C','ADMIN',1,0,'2025-01-20 18:45:15','2025-01-21 13:04:35'),(4,'btvn','a@gmail.com','12345678','0000','nguyen','USER',NULL,NULL,NULL,NULL),(5,'ralathe','btvn256@gmail.com','12345678','0843016178','B├╣i Thß║┐ V─⌐nh Nguy├¬n','USER',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-25  6:28:26
