-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 07, 2023 at 07:11 AM
-- Server version: 8.0.21
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bestada`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `id_detail_gedung` int DEFAULT NULL,
  `booking_entry_time` time DEFAULT NULL,
  `booking_checkout_time` time DEFAULT NULL,
  `booking_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `id_user`, `id_detail_gedung`, `booking_entry_time`, `booking_checkout_time`, `booking_date`) VALUES
(57, 1, 14, '12:00:00', '15:00:00', '2023-10-01'),
(56, 1, 14, '12:00:00', '15:00:00', '2023-10-01'),
(55, 1, 14, '12:00:00', '15:00:00', '2023-10-01'),
(54, 1, 14, '12:00:00', '15:00:00', '2023-10-01'),
(53, 1, 14, '12:00:00', '15:00:00', '2023-10-01'),
(52, 1, 12, '12:00:00', '15:00:00', '2023-10-01');

-- --------------------------------------------------------

--
-- Table structure for table `detail_gedung`
--

DROP TABLE IF EXISTS `detail_gedung`;
CREATE TABLE IF NOT EXISTS `detail_gedung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_gedung` int DEFAULT NULL,
  `floor` int DEFAULT NULL,
  `jumlah_slot` int DEFAULT NULL,
  `id_slot` int NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `detail_gedung`
--

INSERT INTO `detail_gedung` (`id`, `id_gedung`, `floor`, `jumlah_slot`, `id_slot`, `status`) VALUES
(16, 1, 1, 10, 5, '0'),
(15, 1, 1, 10, 4, '1'),
(14, 1, 1, 10, 3, '0'),
(13, 1, 1, 10, 2, '1'),
(12, 1, 1, 10, 1, '0');

-- --------------------------------------------------------

--
-- Table structure for table `detail_pembayaran`
--

DROP TABLE IF EXISTS `detail_pembayaran`;
CREATE TABLE IF NOT EXISTS `detail_pembayaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pembayaran` int DEFAULT NULL,
  `entry_time` time DEFAULT NULL,
  `checkout_time` time DEFAULT NULL,
  `total` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `detail_pembayaran`
--

INSERT INTO `detail_pembayaran` (`id`, `id_pembayaran`, `entry_time`, `checkout_time`, `total`) VALUES
(39, 35, '12:00:00', '15:00:00', 9000),
(38, 0, '12:00:00', '16:00:00', 3000),
(37, 34, '12:00:00', '15:00:00', 9000),
(36, 0, '12:00:00', '16:00:00', 0),
(35, 33, '12:00:00', '15:00:00', 9000),
(34, 32, '12:00:00', '15:00:00', 9000),
(40, 0, '12:00:00', '16:00:00', 6000),
(41, 0, '12:00:00', '16:00:00', 6000),
(42, 0, '12:00:00', '16:00:00', 6000),
(43, 0, '12:00:00', '16:00:00', 6000),
(44, 0, '12:00:00', '16:00:00', 6000),
(45, 0, '12:00:00', '16:00:00', 6000),
(46, 36, '12:00:00', '15:00:00', 9000),
(47, 0, '12:00:00', '16:00:00', 12000),
(48, 37, '12:00:00', '15:00:00', 9000),
(49, 0, '12:00:00', '16:00:00', 12000),
(50, 37, '12:00:00', '16:00:00', 12000);

-- --------------------------------------------------------

--
-- Table structure for table `gedung`
--

DROP TABLE IF EXISTS `gedung`;
CREATE TABLE IF NOT EXISTS `gedung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `building_name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `gedung`
--

INSERT INTO `gedung` (`id`, `building_name`) VALUES
(1, 'blok m plaza'),
(2, 'blok m square');

-- --------------------------------------------------------

--
-- Table structure for table `master_user`
--

DROP TABLE IF EXISTS `master_user`;
CREATE TABLE IF NOT EXISTS `master_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `handphone_no` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `lisence_plate` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_user`
--

INSERT INTO `master_user` (`id`, `name`, `handphone_no`, `email`, `lisence_plate`) VALUES
(1, 'trandy', '0811993903', 'admin@gmail.com', 'B2345SOH'),
(2, 'wahyu', '09876876543212', 'tes@gmail.com', 'B345BTU');

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

DROP TABLE IF EXISTS `pembayaran`;
CREATE TABLE IF NOT EXISTS `pembayaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_booking` int DEFAULT NULL,
  `time_to_enter_reality` time DEFAULT NULL,
  `reality_checkout_time` time DEFAULT NULL,
  `additional_cost` int DEFAULT NULL,
  `tgl_keluar_real` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pembayaran`
--

INSERT INTO `pembayaran` (`id`, `id_booking`, `time_to_enter_reality`, `reality_checkout_time`, `additional_cost`, `tgl_keluar_real`) VALUES
(37, 57, '12:00:00', '16:00:00', 3000, '2023-10-01'),
(36, 56, '12:00:00', '16:00:00', 3000, '2023-10-01'),
(35, 55, '12:00:00', '16:00:00', 3000, '2023-10-01'),
(34, 54, '12:00:00', '16:00:00', 3000, '2023-10-01'),
(33, 53, '12:00:00', '16:00:00', 0, '2023-10-01'),
(32, 52, '12:00:00', '16:00:00', 0, '2023-10-01');

-- --------------------------------------------------------

--
-- Table structure for table `slot_parkir`
--

DROP TABLE IF EXISTS `slot_parkir`;
CREATE TABLE IF NOT EXISTS `slot_parkir` (
  `id` int NOT NULL AUTO_INCREMENT,
  `block_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `slot_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `slot_parkir`
--

INSERT INTO `slot_parkir` (`id`, `block_name`, `slot_no`) VALUES
(1, 'blok a', '1'),
(2, 'bko a', '2'),
(3, 'blok a', '3'),
(4, 'blok a', '4'),
(5, 'blok a', '5'),
(6, 'blok b', '1'),
(7, 'blok b', '2'),
(8, 'blok b', '3'),
(9, 'blok b', '4'),
(10, 'blok b', '5');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
