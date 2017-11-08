-- MySQL dump 10.13  Distrib 5.6.37, for osx10.11 (x86_64)
--
-- Host: localhost    Database: CatalogsProductsDB222
-- ------------------------------------------------------
-- Server version	5.6.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Catalog`
--

DROP TABLE IF EXISTS `Catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Catalog` (
  `Catalog_ID` varchar(128) NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` blob,
  PRIMARY KEY (`Catalog_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Catalog`
--

LOCK TABLES `Catalog` WRITE;
/*!40000 ALTER TABLE `Catalog` DISABLE KEYS */;
INSERT INTO `Catalog` VALUES ('alfaRomeo','Alfa Romeo',NULL),('astonMartin','Aston Martin',NULL),('audi','Audi',NULL),('bentley','Bentley',NULL),('bmw','BMW',NULL),('bugatti','Bugatti',NULL),('ferrari','Ferrari',NULL),('mercedesBenz','Mercedes Benz',NULL),('porsche','Porsche',NULL),('volvo','Volvo',NULL);
/*!40000 ALTER TABLE `Catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Category` (
  `Category_ID` varchar(128) NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` blob,
  `Catalog_ID` varchar(128) NOT NULL,
  `Parent_Category_ID` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`Category_ID`),
  KEY `Catalog_ID` (`Catalog_ID`),
  KEY `Parent_Category_ID` (`Parent_Category_ID`),
  CONSTRAINT `category_ibfk_1` FOREIGN KEY (`Catalog_ID`) REFERENCES `Catalog` (`Catalog_ID`),
  CONSTRAINT `category_ibfk_2` FOREIGN KEY (`Parent_Category_ID`) REFERENCES `Category` (`Category_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category_MasterProduct`
--

DROP TABLE IF EXISTS `Category_MasterProduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Category_MasterProduct` (
  `Category_ID` varchar(128) NOT NULL,
  `MasterProduct_ID` varchar(128) NOT NULL,
  UNIQUE KEY `Category_MasterProduct_Const` (`Category_ID`,`MasterProduct_ID`),
  KEY `MasterProduct_ID` (`MasterProduct_ID`),
  CONSTRAINT `category_masterproduct_ibfk_1` FOREIGN KEY (`Category_ID`) REFERENCES `Category` (`Category_ID`),
  CONSTRAINT `category_masterproduct_ibfk_2` FOREIGN KEY (`MasterProduct_ID`) REFERENCES `MasterProduct` (`MasterProduct_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category_MasterProduct`
--

LOCK TABLES `Category_MasterProduct` WRITE;
/*!40000 ALTER TABLE `Category_MasterProduct` DISABLE KEYS */;
/*!40000 ALTER TABLE `Category_MasterProduct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category_Product`
--

DROP TABLE IF EXISTS `Category_Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Category_Product` (
  `Category_ID` varchar(128) NOT NULL,
  `Product_ID` varchar(128) NOT NULL,
  UNIQUE KEY `Category_Product_Const` (`Category_ID`,`Product_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `category_product_ibfk_1` FOREIGN KEY (`Category_ID`) REFERENCES `Category` (`Category_ID`),
  CONSTRAINT `category_product_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category_Product`
--

LOCK TABLES `Category_Product` WRITE;
/*!40000 ALTER TABLE `Category_Product` DISABLE KEYS */;
/*!40000 ALTER TABLE `Category_Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LOV_Property_blob`
--

DROP TABLE IF EXISTS `LOV_Property_blob`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LOV_Property_blob` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `value` blob NOT NULL,
  `Property_ID` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  CONSTRAINT `lov_property_blob_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_blob_name` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LOV_Property_blob`
--

LOCK TABLES `LOV_Property_blob` WRITE;
/*!40000 ALTER TABLE `LOV_Property_blob` DISABLE KEYS */;
/*!40000 ALTER TABLE `LOV_Property_blob` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LOV_Property_boolean`
--

DROP TABLE IF EXISTS `LOV_Property_boolean`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LOV_Property_boolean` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `value` tinyint(1) NOT NULL,
  `Property_ID` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  CONSTRAINT `lov_property_boolean_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_boolean_name` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LOV_Property_boolean`
--

LOCK TABLES `LOV_Property_boolean` WRITE;
/*!40000 ALTER TABLE `LOV_Property_boolean` DISABLE KEYS */;
/*!40000 ALTER TABLE `LOV_Property_boolean` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LOV_Property_double`
--

DROP TABLE IF EXISTS `LOV_Property_double`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LOV_Property_double` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `value` double NOT NULL,
  `Property_ID` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  CONSTRAINT `lov_property_double_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_double_name` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LOV_Property_double`
--

LOCK TABLES `LOV_Property_double` WRITE;
/*!40000 ALTER TABLE `LOV_Property_double` DISABLE KEYS */;
/*!40000 ALTER TABLE `LOV_Property_double` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LOV_Property_int`
--

DROP TABLE IF EXISTS `LOV_Property_int`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LOV_Property_int` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(11) NOT NULL,
  `Property_ID` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  CONSTRAINT `lov_property_int_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_int_name` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LOV_Property_int`
--

LOCK TABLES `LOV_Property_int` WRITE;
/*!40000 ALTER TABLE `LOV_Property_int` DISABLE KEYS */;
/*!40000 ALTER TABLE `LOV_Property_int` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LOV_Property_varchar256`
--

DROP TABLE IF EXISTS `LOV_Property_varchar256`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LOV_Property_varchar256` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(256) NOT NULL,
  `Property_ID` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  CONSTRAINT `lov_property_varchar256_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_varchar256_name` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LOV_Property_varchar256`
--

LOCK TABLES `LOV_Property_varchar256` WRITE;
/*!40000 ALTER TABLE `LOV_Property_varchar256` DISABLE KEYS */;
/*!40000 ALTER TABLE `LOV_Property_varchar256` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MasterProduct`
--

DROP TABLE IF EXISTS `MasterProduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MasterProduct` (
  `MasterProduct_ID` varchar(128) NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` blob,
  PRIMARY KEY (`MasterProduct_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MasterProduct`
--

LOCK TABLES `MasterProduct` WRITE;
/*!40000 ALTER TABLE `MasterProduct` DISABLE KEYS */;
/*!40000 ALTER TABLE `MasterProduct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product` (
  `Product_ID` varchar(128) NOT NULL,
  `name` varchar(128) NOT NULL,
  `MasterProduct_ID` varchar(128) DEFAULT NULL,
  `description` blob,
  PRIMARY KEY (`Product_ID`),
  KEY `MasterProduct_ID` (`MasterProduct_ID`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`MasterProduct_ID`) REFERENCES `MasterProduct` (`MasterProduct_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product_Property_blob_value`
--

DROP TABLE IF EXISTS `Product_Property_blob_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product_Property_blob_value` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Property_ID` int(11) NOT NULL,
  `Product_ID` varchar(128) NOT NULL,
  `value` blob,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `product_property_blob_value_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_blob_name` (`ID`),
  CONSTRAINT `product_property_blob_value_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product_Property_blob_value`
--

LOCK TABLES `Product_Property_blob_value` WRITE;
/*!40000 ALTER TABLE `Product_Property_blob_value` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product_Property_blob_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product_Property_boolean_value`
--

DROP TABLE IF EXISTS `Product_Property_boolean_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product_Property_boolean_value` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Property_ID` int(11) NOT NULL,
  `Product_ID` varchar(128) NOT NULL,
  `value` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `product_property_boolean_value_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_boolean_name` (`ID`),
  CONSTRAINT `product_property_boolean_value_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product_Property_boolean_value`
--

LOCK TABLES `Product_Property_boolean_value` WRITE;
/*!40000 ALTER TABLE `Product_Property_boolean_value` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product_Property_boolean_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product_Property_double_value`
--

DROP TABLE IF EXISTS `Product_Property_double_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product_Property_double_value` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Property_ID` int(11) NOT NULL,
  `Product_ID` varchar(128) NOT NULL,
  `value` double DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `product_property_double_value_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_double_name` (`ID`),
  CONSTRAINT `product_property_double_value_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product_Property_double_value`
--

LOCK TABLES `Product_Property_double_value` WRITE;
/*!40000 ALTER TABLE `Product_Property_double_value` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product_Property_double_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product_Property_int_value`
--

DROP TABLE IF EXISTS `Product_Property_int_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product_Property_int_value` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Property_ID` int(11) NOT NULL,
  `Product_ID` varchar(128) NOT NULL,
  `value` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `product_property_int_value_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_int_name` (`ID`),
  CONSTRAINT `product_property_int_value_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product_Property_int_value`
--

LOCK TABLES `Product_Property_int_value` WRITE;
/*!40000 ALTER TABLE `Product_Property_int_value` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product_Property_int_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product_Property_varchar256_value`
--

DROP TABLE IF EXISTS `Product_Property_varchar256_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product_Property_varchar256_value` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Property_ID` int(11) NOT NULL,
  `Product_ID` varchar(128) NOT NULL,
  `value` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `Property_ID` (`Property_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `product_property_varchar256_value_ibfk_1` FOREIGN KEY (`Property_ID`) REFERENCES `Property_varchar256_name` (`ID`),
  CONSTRAINT `product_property_varchar256_value_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product_Property_varchar256_value`
--

LOCK TABLES `Product_Property_varchar256_value` WRITE;
/*!40000 ALTER TABLE `Product_Property_varchar256_value` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product_Property_varchar256_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Property_blob_name`
--

DROP TABLE IF EXISTS `Property_blob_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Property_blob_name` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `default_value` blob,
  `default_value_lov` int(11) DEFAULT NULL,
  `multyval` tinyint(1) NOT NULL DEFAULT '0',
  `lov` tinyint(1) NOT NULL DEFAULT '0',
  `indexable` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `name` (`name`),
  KEY `default_value_lov` (`default_value_lov`),
  CONSTRAINT `property_blob_name_ibfk_1` FOREIGN KEY (`default_value_lov`) REFERENCES `LOV_Property_blob` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Property_blob_name`
--

LOCK TABLES `Property_blob_name` WRITE;
/*!40000 ALTER TABLE `Property_blob_name` DISABLE KEYS */;
/*!40000 ALTER TABLE `Property_blob_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Property_boolean_name`
--

DROP TABLE IF EXISTS `Property_boolean_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Property_boolean_name` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `default_value` tinyint(1) DEFAULT NULL,
  `default_value_lov` int(11) DEFAULT NULL,
  `multyval` tinyint(1) NOT NULL DEFAULT '0',
  `lov` tinyint(1) NOT NULL DEFAULT '0',
  `indexable` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `name` (`name`),
  KEY `default_value_lov` (`default_value_lov`),
  CONSTRAINT `property_boolean_name_ibfk_1` FOREIGN KEY (`default_value_lov`) REFERENCES `LOV_Property_boolean` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Property_boolean_name`
--

LOCK TABLES `Property_boolean_name` WRITE;
/*!40000 ALTER TABLE `Property_boolean_name` DISABLE KEYS */;
/*!40000 ALTER TABLE `Property_boolean_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Property_double_name`
--

DROP TABLE IF EXISTS `Property_double_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Property_double_name` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `default_value` double DEFAULT NULL,
  `default_value_lov` int(11) DEFAULT NULL,
  `multyval` tinyint(1) NOT NULL DEFAULT '0',
  `lov` tinyint(1) NOT NULL DEFAULT '0',
  `indexable` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `name` (`name`),
  KEY `default_value_lov` (`default_value_lov`),
  CONSTRAINT `property_double_name_ibfk_1` FOREIGN KEY (`default_value_lov`) REFERENCES `LOV_Property_double` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Property_double_name`
--

LOCK TABLES `Property_double_name` WRITE;
/*!40000 ALTER TABLE `Property_double_name` DISABLE KEYS */;
/*!40000 ALTER TABLE `Property_double_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Property_int_name`
--

DROP TABLE IF EXISTS `Property_int_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Property_int_name` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `default_value` int(11) DEFAULT NULL,
  `default_value_lov` int(11) DEFAULT NULL,
  `multyval` tinyint(1) NOT NULL DEFAULT '0',
  `lov` tinyint(1) NOT NULL DEFAULT '0',
  `indexable` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `name` (`name`),
  KEY `default_value_lov` (`default_value_lov`),
  CONSTRAINT `property_int_name_ibfk_1` FOREIGN KEY (`default_value_lov`) REFERENCES `LOV_Property_int` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Property_int_name`
--

LOCK TABLES `Property_int_name` WRITE;
/*!40000 ALTER TABLE `Property_int_name` DISABLE KEYS */;
/*!40000 ALTER TABLE `Property_int_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Property_varchar256_name`
--

DROP TABLE IF EXISTS `Property_varchar256_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Property_varchar256_name` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(128) DEFAULT NULL,
  `default_value` varchar(256) DEFAULT NULL,
  `default_value_lov` int(11) DEFAULT NULL,
  `multyval` tinyint(1) NOT NULL DEFAULT '0',
  `lov` tinyint(1) NOT NULL DEFAULT '0',
  `indexable` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `name` (`name`),
  KEY `default_value_lov` (`default_value_lov`),
  CONSTRAINT `property_varchar256_name_ibfk_1` FOREIGN KEY (`default_value_lov`) REFERENCES `LOV_Property_varchar256` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Property_varchar256_name`
--

LOCK TABLES `Property_varchar256_name` WRITE;
/*!40000 ALTER TABLE `Property_varchar256_name` DISABLE KEYS */;
/*!40000 ALTER TABLE `Property_varchar256_name` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-11-08 10:39:35
