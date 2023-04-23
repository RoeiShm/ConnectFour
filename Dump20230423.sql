-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: connectfour
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player1` varchar(20) NOT NULL,
  `player2` varchar(20) NOT NULL,
  `active` bit(1) NOT NULL DEFAULT b'1',
  `cell1` int NOT NULL DEFAULT '0',
  `cell2` int NOT NULL DEFAULT '0',
  `cell3` int NOT NULL DEFAULT '0',
  `cell4` int NOT NULL DEFAULT '0',
  `cell5` int NOT NULL DEFAULT '0',
  `cell6` int NOT NULL DEFAULT '0',
  `cell7` int NOT NULL DEFAULT '0',
  `cell8` int NOT NULL DEFAULT '0',
  `cell9` int NOT NULL DEFAULT '0',
  `cell10` int NOT NULL DEFAULT '0',
  `cell11` int NOT NULL DEFAULT '0',
  `cell12` int NOT NULL DEFAULT '0',
  `cell13` int NOT NULL DEFAULT '0',
  `cell14` int NOT NULL DEFAULT '0',
  `cell15` int NOT NULL DEFAULT '0',
  `cell16` int NOT NULL DEFAULT '0',
  `cell17` int NOT NULL DEFAULT '0',
  `cell18` int NOT NULL DEFAULT '0',
  `cell19` int NOT NULL DEFAULT '0',
  `cell20` int NOT NULL DEFAULT '0',
  `cell21` int NOT NULL DEFAULT '0',
  `cell22` int NOT NULL DEFAULT '0',
  `cell23` int NOT NULL DEFAULT '0',
  `cell24` int NOT NULL DEFAULT '0',
  `cell25` int NOT NULL DEFAULT '0',
  `cell26` int NOT NULL DEFAULT '0',
  `cell27` int NOT NULL DEFAULT '0',
  `cell28` int NOT NULL DEFAULT '0',
  `cell29` int NOT NULL DEFAULT '0',
  `cell30` int NOT NULL DEFAULT '0',
  `cell31` int NOT NULL DEFAULT '0',
  `cell32` int NOT NULL DEFAULT '0',
  `cell33` int NOT NULL DEFAULT '0',
  `cell34` int NOT NULL DEFAULT '0',
  `cell35` int NOT NULL DEFAULT '0',
  `cell36` int NOT NULL DEFAULT '0',
  `cell37` int NOT NULL DEFAULT '0',
  `cell38` int NOT NULL DEFAULT '0',
  `cell39` int NOT NULL DEFAULT '0',
  `cell40` int NOT NULL DEFAULT '0',
  `cell41` int NOT NULL DEFAULT '0',
  `cell42` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `lobby` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
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

-- Dump completed on 2023-04-23 13:36:27
