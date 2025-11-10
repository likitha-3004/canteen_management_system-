-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: canteen_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_qty` int NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,'Masala Dosa','Breakfast',45.00,47),(2,'Idli Sambar','Breakfast',30.00,58),(3,'Veg Pulao','Lunch',70.00,37),(4,'Chicken Biryani','Lunch',120.00,26),(5,'Samosa','Snacks',15.00,98),(6,'Veg Sandwich','Snacks',40.00,47),(7,'Tea','Beverage',15.00,147),(8,'Coffee','Beverage',25.00,117),(9,'Lemon Juice','Beverage',20.00,78),(10,'Chappathi & Curry','Dinner',60.00,29);
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2025-10-09 09:15:00',75.00,'completed'),(2,2,'2025-10-09 13:05:00',135.00,'completed'),(3,3,'2025-10-09 18:45:00',40.00,'pending'),(4,1,'2025-10-10 09:30:00',60.00,'completed'),(5,2,'2025-10-10 12:55:00',155.00,'completed'),(6,1,'2025-11-02 16:39:42',165.00,'completed'),(7,2,'2025-11-02 17:45:52',45.00,'completed'),(8,2,'2025-11-02 18:07:36',130.00,'completed'),(9,1,'2025-11-02 18:31:31',65.00,'completed'),(10,3,'2025-11-02 19:45:51',35.00,'completed'),(11,3,'2025-11-02 19:50:01',55.00,'completed'),(12,3,'2025-11-02 20:02:35',40.00,'completed'),(13,3,'2025-11-02 22:29:15',100.00,'completed'),(14,2,'2025-11-02 22:41:35',120.00,'completed'),(15,6,'2025-11-02 22:45:19',70.00,'completed'),(16,7,'2025-11-03 17:12:33',255.00,'completed'),(17,7,'2025-11-04 13:48:55',175.00,'completed');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'UPI',75.00,'2025-10-09 09:17:00'),(2,2,'Cash',135.00,'2025-10-09 13:07:00'),(3,4,'Card',60.00,'2025-10-10 09:35:00'),(4,5,'UPI',155.00,'2025-10-10 12:58:00'),(5,6,'UPI',165.00,'2025-11-02 16:39:42'),(6,7,'UPI',45.00,'2025-11-02 17:45:52'),(7,8,'UPI',130.00,'2025-11-02 18:07:36'),(8,9,'UPI',65.00,'2025-11-02 18:31:31'),(9,10,'UPI',35.00,'2025-11-02 19:45:51'),(10,11,'Cash',55.00,'2025-11-02 19:50:01'),(11,12,'Card',40.00,'2025-11-02 20:02:35'),(12,13,'Card',100.00,'2025-11-02 22:29:15'),(13,14,'Cash',120.00,'2025-11-02 22:41:35'),(14,15,'UPI',70.00,'2025-11-02 22:45:19'),(15,16,'Card',255.00,'2025-11-03 17:12:33'),(16,17,'UPI',175.00,'2025-11-04 13:48:55');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ravi Kumar','ravi.kumar@college.com','ravi123','customer'),(2,'Priya Sharma','priya.sharma@college.com','priya123','customer'),(3,'Anil Verma','anil.verma@college.com','anil123','customer'),(6,'sanjay','sanjay.varma@college.com','sanju123','customer'),(7,'rishi','rishikesh@gmail.com','rishi123','customer');
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

-- Dump completed on 2025-11-06  1:03:34
