-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2025 at 04:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hrms`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(120) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `resource_type` varchar(50) NOT NULL,
  `resource_id` varchar(50) DEFAULT NULL,
  `resource_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `status` enum('success','failed','warning') NOT NULL DEFAULT 'success',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `user_name`, `action_type`, `resource_type`, `resource_id`, `resource_name`, `description`, `ip_address`, `status`, `metadata`, `created_at`) VALUES
(1, NULL, 'System', 'CREATE', 'Attendance', NULL, 'Auto-absent for 2025-12-05', 'Automatically marked 3 employee(s) as absent for 2025-12-05 (no attendance by 4:00 PM).', NULL, 'success', '{\"date\":\"2025-12-05\",\"autoAbsentCount\":3}', '2025-12-05 09:31:23'),
(2, NULL, 'Admin', 'CREATE', 'GuardAccount', '5', 'Security Guard', 'Created guard account for Security Guard (guard001)', '::1', 'success', '{\"username\":\"guard001\",\"email\":\"guard@school.edu\"}', '2025-12-05 10:38:39'),
(3, NULL, 'Admin', 'CREATE', 'GuardAccount', '25-GPC-GRD01', 'Security Guard', 'Created guard account for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"email\":\"guard01@school.edu\",\"department\":\"Security\"}', '2025-12-05 10:58:03'),
(4, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'QR code generated for employee Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:12'),
(5, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'QR code generated for employee Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:12'),
(6, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'QR code generated for employee Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:12'),
(7, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'QR code generated for employee Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:12'),
(8, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'QR code generated for employee Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:12'),
(9, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'QR code generated for employee Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:12'),
(10, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'QR code generated for employee John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:12'),
(11, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'QR code generated for employee Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:12'),
(12, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'QR code generated for employee Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:12'),
(13, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'QR code regenerated for employee Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:15'),
(14, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'QR code regenerated for employee Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:15'),
(15, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'QR code regenerated for employee Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:21'),
(16, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'QR code regenerated for employee Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:21'),
(17, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'QR code regenerated for employee Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:21'),
(18, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'QR code regenerated for employee Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:21'),
(19, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'QR code regenerated for employee Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:21'),
(20, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'QR code regenerated for employee Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:21'),
(21, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'QR code regenerated for employee John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:21'),
(22, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'QR code regenerated for employee Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:21'),
(23, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'QR code regenerated for employee Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_code_generation\"}', '2025-12-05 11:59:21'),
(24, NULL, 'System', 'CREATE', 'Employee', '13', 'System Administrator', 'Employee System Administrator (25-GPC-ADM01) was created and employee account was automatically created', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"department\":\"Administration\",\"position\":\"System Administrator\",\"userAccountCreated\":true}', '2025-12-05 12:16:17'),
(25, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'QR code regenerated for employee System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_code_generation\"}', '2025-12-05 12:16:36'),
(26, NULL, 'System', 'UPDATE', 'Employee', '13', 'System Administrator', 'QR code regenerated for employee System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(27, NULL, 'System', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'QR code regenerated for employee Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(28, NULL, 'System', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'QR code regenerated for employee Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(29, NULL, 'System', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'QR code regenerated for employee Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(30, NULL, 'System', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'QR code regenerated for employee Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(31, NULL, 'System', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'QR code regenerated for employee Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(32, NULL, 'System', 'UPDATE', 'Employee', '7', 'Security Guard', 'QR code regenerated for employee Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(33, NULL, 'System', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'QR code regenerated for employee John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(34, NULL, 'System', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'QR code regenerated for employee Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(35, NULL, 'System', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'QR code regenerated for employee Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_code_generation\"}', '2025-12-05 13:23:22'),
(36, NULL, 'Test Guard', 'CREATE', 'QRVerification', '25-GPC-00001', 'QR scan for Juan Santos Dela Cruz', 'QR code verified successfully for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"scannedBy\":\"Test Guard\"}', '2025-12-05 13:28:37'),
(37, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00005', 'QR scan for Carlos Mendoza Torres', 'QR code verified successfully for Carlos Mendoza Torres (25-GPC-00005)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00005\",\"scannedBy\":\"Guard\"}', '2025-12-05 13:31:06'),
(38, NULL, 'System', 'CREATE', 'Attendance', '4', 'Carlos Mendoza Torres - 2025-12-05', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 13:31:07'),
(39, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00001', 'QR scan for Juan Santos Dela Cruz', 'QR code verified successfully for Juan Santos Dela Cruz (25-GPC-00001)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00001\",\"scannedBy\":\"Guard\"}', '2025-12-05 13:32:11'),
(40, NULL, 'System', 'CREATE', 'Attendance', '5', 'Juan Santos Dela Cruz - 2025-12-05', 'Attendance record created for Juan Santos Dela Cruz (25-GPC-00001) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00001\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 13:32:11'),
(41, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00002', 'QR scan for Maria Garcia Santos', 'QR code verified successfully for Maria Garcia Santos (25-GPC-00002)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:16:36'),
(42, NULL, 'System', 'CREATE', 'Attendance', '6', 'Maria Garcia Santos - 2025-12-05', 'Attendance record created for Maria Garcia Santos (25-GPC-00002) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:16:36'),
(43, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00002', 'QR scan for Maria Garcia Santos', 'QR code verified successfully for Maria Garcia Santos (25-GPC-00002)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:16:44'),
(44, NULL, 'System', 'CREATE', 'Attendance', '6', 'Maria Garcia Santos - 2025-12-05', 'Attendance record created for Maria Garcia Santos (25-GPC-00002) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:16:44'),
(45, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00002', 'QR scan for Maria Garcia Santos', 'QR code verified successfully for Maria Garcia Santos (25-GPC-00002)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:16:47'),
(46, NULL, 'System', 'CREATE', 'Attendance', '6', 'Maria Garcia Santos - 2025-12-05', 'Attendance record created for Maria Garcia Santos (25-GPC-00002) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:16:47'),
(47, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00002', 'QR scan for Maria Garcia Santos', 'QR code verified successfully for Maria Garcia Santos (25-GPC-00002)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:18:45'),
(48, NULL, 'System', 'CREATE', 'Attendance', '6', 'Maria Garcia Santos - 2025-12-05', 'Attendance record created for Maria Garcia Santos (25-GPC-00002) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:18:46'),
(49, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00002', 'QR scan for Maria Garcia Santos', 'QR code verified successfully for Maria Garcia Santos (25-GPC-00002)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:18:52'),
(50, NULL, 'System', 'CREATE', 'Attendance', '6', 'Maria Garcia Santos - 2025-12-05', 'Attendance record created for Maria Garcia Santos (25-GPC-00002) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:18:52'),
(51, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00002', 'QR scan for Maria Garcia Santos', 'QR code verified successfully for Maria Garcia Santos (25-GPC-00002)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:22:24'),
(52, NULL, 'System', 'CREATE', 'Attendance', '6', 'Maria Garcia Santos - 2025-12-05', 'Attendance record created for Maria Garcia Santos (25-GPC-00002) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:22:24'),
(53, NULL, 'System', 'CREATE', 'Attendance', 'N/A', 'Maria Garcia Santos - 2025-12-05', 'Failed to create attendance record for Maria Garcia Santos', '49.150.46.70', 'failed', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"error\":\"Unknown column \'check_in_image\' in \'field list\'\"}', '2025-12-05 14:22:24'),
(54, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00002', 'QR scan for Maria Garcia Santos', 'QR code verified successfully for Maria Garcia Santos (25-GPC-00002)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:22:29'),
(55, NULL, 'System', 'CREATE', 'Attendance', '6', 'Maria Garcia Santos - 2025-12-05', 'Attendance record created for Maria Garcia Santos (25-GPC-00002) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:22:29'),
(56, NULL, 'System', 'CREATE', 'Attendance', 'N/A', 'Maria Garcia Santos - 2025-12-05', 'Failed to create attendance record for Maria Garcia Santos', '49.150.46.70', 'failed', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"error\":\"Unknown column \'check_in_image\' in \'field list\'\"}', '2025-12-05 14:22:29'),
(57, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00005', 'QR scan for Carlos Mendoza Torres', 'QR code verified successfully for Carlos Mendoza Torres (25-GPC-00005)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00005\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:24:40'),
(58, NULL, 'System', 'CREATE', 'Attendance', '4', 'Carlos Mendoza Torres - 2025-12-05', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:24:40'),
(59, NULL, 'System', 'CREATE', 'Attendance', 'N/A', 'Carlos Mendoza Torres - 2025-12-05', 'Failed to create attendance record for Carlos Mendoza Torres', '49.150.46.70', 'failed', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-05\",\"error\":\"Unknown column \'check_in_image\' in \'field list\'\"}', '2025-12-05 14:24:40'),
(60, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00002', 'QR scan for Maria Garcia Santos', 'QR code verified successfully for Maria Garcia Santos (25-GPC-00002)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:32:39'),
(61, NULL, 'System', 'CREATE', 'Attendance', '6', 'Maria Garcia Santos - 2025-12-05', 'Attendance record created for Maria Garcia Santos (25-GPC-00002) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:32:40'),
(62, NULL, 'System', 'CREATE', 'Attendance', 'N/A', 'Maria Garcia Santos - 2025-12-05', 'Failed to create attendance record for Maria Garcia Santos', '49.150.46.70', 'failed', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"error\":\"Unknown column \'check_in_image\' in \'field list\'\"}', '2025-12-05 14:32:40'),
(63, NULL, 'System', 'CREATE', 'Attendance', NULL, 'Auto-absent for 2025-12-05', 'Automatically marked 4 employee(s) as absent for 2025-12-05 (no attendance by 4:00 PM).', NULL, 'success', '{\"date\":\"2025-12-05\",\"autoAbsentCount\":4}', '2025-12-05 14:33:35'),
(64, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00002', 'QR scan for Maria Garcia Santos', 'QR code verified successfully for Maria Garcia Santos (25-GPC-00002)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:38:50'),
(65, NULL, 'System', 'CREATE', 'Attendance', '6', 'Maria Garcia Santos - 2025-12-05', 'Attendance record created for Maria Garcia Santos (25-GPC-00002) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00002\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:38:50'),
(66, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00005', 'QR scan for Carlos Mendoza Torres', 'QR code verified successfully for Carlos Mendoza Torres (25-GPC-00005)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00005\",\"scannedBy\":\"Guard\"}', '2025-12-05 14:40:03'),
(67, NULL, 'System', 'CREATE', 'Attendance', '4', 'Carlos Mendoza Torres - 2025-12-05', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-05', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-05\",\"status\":\"present\"}', '2025-12-05 14:40:03'),
(68, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00005', 'QR scan for Carlos Mendoza Torres', 'QR code verified successfully for Carlos Mendoza Torres (25-GPC-00005)', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00005\",\"scannedBy\":\"Guard\"}', '2025-12-06 02:13:36'),
(69, NULL, 'System', 'CREATE', 'Attendance', '21', 'Carlos Mendoza Torres - 2025-12-06', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-06', '49.150.46.70', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-06\",\"status\":\"present\"}', '2025-12-06 02:13:37'),
(70, NULL, 'Guard', 'CREATE', 'QRVerification', '25-GPC-00001', 'QR scan for Juan Santos Dela Cruz', 'QR code verified successfully for Juan Santos Dela Cruz (25-GPC-00001)', '120.29.68.91', 'success', '{\"employeeId\":\"25-GPC-00001\",\"scannedBy\":\"Guard\"}', '2025-12-06 02:29:09'),
(71, NULL, 'System', 'CREATE', 'Attendance', '22', 'Juan Santos Dela Cruz - 2025-12-06', 'Attendance record created for Juan Santos Dela Cruz (25-GPC-00001) on 2025-12-06', '120.29.68.91', 'success', '{\"employeeId\":\"25-GPC-00001\",\"date\":\"2025-12-06\",\"status\":\"present\"}', '2025-12-06 02:29:09'),
(72, NULL, 'System Administrator', 'CREATE', 'Document', '1', 'pds_25-GPC-ADM01', 'Document \"pds_25-GPC-ADM01\" was uploaded for employee 25-GPC-ADM01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-06 06:47:35'),
(73, NULL, 'System', 'CREATE', 'Attendance', NULL, 'Auto-absent for 2025-12-06', 'Automatically marked 8 employee(s) as absent for 2025-12-06 (no attendance by 4:00 PM).', NULL, 'success', '{\"date\":\"2025-12-06\",\"autoAbsentCount\":8}', '2025-12-06 10:53:28'),
(74, NULL, 'System', 'UPDATE', 'Designation', '25', 'Accounting Clerks', 'Designation \"Accounting Clerks\" was updated to \"Accounting Clerks\"', '::1', 'success', NULL, '2025-12-06 10:54:18'),
(75, NULL, 'System Administrator', 'UPDATE', 'Attendance', '22', 'Juan Santos Dela Cruz - Sat Dec 06 2025 00:00:00 GMT+0800 (Philippine Standard Time)', 'Attendance record updated for Juan Santos Dela Cruz (25-GPC-00001) on Sat Dec 06 2025 00:00:00 GMT+0800 (Philippine Standard Time)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"date\":\"2025-12-05T16:00:00.000Z\"}', '2025-12-06 11:21:28'),
(76, NULL, 'System Administrator', 'UPDATE', 'Attendance', '22', 'Juan Santos Dela Cruz - Sat Dec 06 2025 00:00:00 GMT+0800 (Philippine Standard Time)', 'Attendance record updated for Juan Santos Dela Cruz (25-GPC-00001) on Sat Dec 06 2025 00:00:00 GMT+0800 (Philippine Standard Time)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"date\":\"2025-12-05T16:00:00.000Z\"}', '2025-12-06 11:21:41'),
(77, NULL, 'System', 'UPDATE', 'Attendance', NULL, 'Auto-checkout for 2025-12-06', 'Automatically checked out 1 employee(s) at 7:00 PM.', NULL, 'success', '{\"date\":\"2025-12-06\",\"autoCheckoutCount\":1}', '2025-12-06 11:25:35'),
(78, NULL, 'System Administrator', 'UPDATE', 'Attendance', '21', 'Carlos Mendoza Torres - Sat Dec 06 2025 00:00:00 GMT+0800 (Philippine Standard Time)', 'Attendance record updated for Carlos Mendoza Torres (25-GPC-00005) on Sat Dec 06 2025 00:00:00 GMT+0800 (Philippine Standard Time)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-05T16:00:00.000Z\"}', '2025-12-06 11:27:57'),
(79, NULL, 'System Administrator', 'CREATE', 'CalendarEvent', '1', 'december 11 test', 'Reminder \"december 11 test\" was created for 2025-12-11 at 21:13', '::1', 'success', '{\"type\":\"reminder\",\"eventDate\":\"2025-12-11\",\"eventTime\":\"21:13\"}', '2025-12-06 12:14:01'),
(80, NULL, 'System', 'CREATE', 'Department', '18', 'test', 'Department \"test\" was created', '::1', 'success', NULL, '2025-12-06 13:15:36'),
(81, NULL, 'System', 'CREATE', 'Designation', '113', 'test', 'Designation \"test\" was created', '::1', 'success', NULL, '2025-12-06 13:15:39'),
(82, NULL, 'System', 'DELETE', 'Designation', '113', 'test', 'Designation \"test\" was deleted', '::1', 'success', NULL, '2025-12-06 13:15:47'),
(83, NULL, 'System', 'DELETE', 'Department', '18', 'test', 'Department \"test\" was deleted', '::1', 'success', NULL, '2025-12-06 13:15:54'),
(84, NULL, 'System Administrator', 'CREATE', 'Document', '2', 'pds_25-GPC-00001', 'Document \"pds_25-GPC-00001\" was uploaded for employee 25-GPC-00001', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-06 13:16:54'),
(85, NULL, 'System Administrator', 'CREATE', 'Document', '3', 'pds_25-GPC-00002', 'Document \"pds_25-GPC-00002\" was uploaded for employee 25-GPC-00002', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":534820}', '2025-12-06 13:20:32'),
(86, NULL, 'System Administrator', 'CREATE', 'Document', '4', 'pds_25-GPC-00003', 'Document \"pds_25-GPC-00003\" was uploaded for employee 25-GPC-00003', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-06 13:35:29'),
(87, NULL, 'System Administrator', 'CREATE', 'Document', '5', 'pds_25-GPC-00004', 'Document \"pds_25-GPC-00004\" was uploaded for employee 25-GPC-00004', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-06 13:38:05'),
(88, NULL, 'System Administrator', 'CREATE', 'Document', '6', 'pds_25-GPC-00005', 'Document \"pds_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-06 13:43:45'),
(89, NULL, 'System Administrator', 'CREATE', 'Document', '7', 'pds_25-GPC-GRD01', 'Document \"pds_25-GPC-GRD01\" was uploaded for employee 25-GPC-GRD01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-06 13:47:38'),
(90, NULL, 'System Administrator', 'CREATE', 'Document', '8', 'pds_EMP001', 'Document \"pds_EMP001\" was uploaded for employee EMP001', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-06 14:03:09'),
(91, NULL, 'System Administrator', 'CREATE', 'Document', '9', 'pds_EMP002', 'Document \"pds_EMP002\" was uploaded for employee EMP002', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":26037329}', '2025-12-06 14:30:36'),
(92, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 06:18:04'),
(93, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 06:18:06'),
(94, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 06:18:29'),
(95, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 06:18:30'),
(96, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 06:18:30'),
(97, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 06:45:37'),
(98, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 06:58:01'),
(99, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 07:06:51'),
(100, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 07:07:24'),
(101, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 07:07:39'),
(102, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST01 TEST01 TEST01', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-07 07:08:43'),
(103, NULL, 'System', 'CREATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Employee TEST01 TEST01 TEST01 (25-GPC-12039) was created and employee account was automatically created', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"department\":\"Board of Directors\",\"position\":\"Admin officer\",\"userAccountCreated\":true}', '2025-12-07 07:09:35'),
(104, NULL, 'Admin', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Generated QR code for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(105, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(106, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(107, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(108, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(109, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(110, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(111, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(112, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(113, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(114, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-07 07:57:55'),
(115, NULL, 'Admin', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Generated QR code for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"qr_generation\"}', '2025-12-07 08:03:48'),
(116, NULL, 'Admin', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Generated QR code for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"qr_generation\"}', '2025-12-07 08:03:49'),
(117, NULL, 'Admin', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Generated QR code for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"qr_generation\"}', '2025-12-07 08:03:49'),
(118, NULL, 'Admin', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Generated QR code for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"qr_generation\"}', '2025-12-07 08:03:50'),
(119, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-07 08:03:51'),
(120, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-07 08:03:52'),
(121, NULL, 'System', 'CREATE', 'Attendance', '31', 'Carlos Mendoza Torres - 2025-12-03', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-03', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-03\",\"status\":\"late\"}', '2025-12-07 08:10:19'),
(122, NULL, 'System Administrator', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Password reset for employee TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"password_reset\"}', '2025-12-07 08:32:59'),
(123, NULL, 'System', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Employee TEST01 TEST01 TEST01 (25-GPC-12039) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\"}', '2025-12-07 08:33:16'),
(124, NULL, 'System', 'CREATE', 'Attendance', '32', 'TEST01 TEST01 TEST01 - 2025-12-07', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-07', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-07\",\"status\":\"late\"}', '2025-12-07 09:36:00'),
(125, NULL, 'System Administrator', 'CREATE', 'Document', '10', 'pds_EMP003', 'Document \"pds_EMP003\" was uploaded for employee EMP003', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":26037329}', '2025-12-07 09:47:04'),
(126, NULL, 'System Administrator', 'DELETE', 'Employee Document', 'EMP003', 'Mike C. Johnson - PDS', 'Deleted PDS document for Mike C. Johnson (EMP003)', '::1', 'success', NULL, '2025-12-07 10:20:57'),
(127, NULL, 'System Administrator', 'DELETE', 'Employee Document', 'EMP002', 'Jane B. Smith - PDS', 'Deleted PDS document for Jane B. Smith (EMP002)', '::1', 'success', NULL, '2025-12-07 10:21:01'),
(128, NULL, 'System Administrator', 'DELETE', 'Employee Document', 'EMP001', 'John A. Doe Jr. - PDS', 'Deleted PDS document for John A. Doe Jr. (EMP001)', '::1', 'success', NULL, '2025-12-07 10:21:03'),
(129, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-GRD01', 'Security Guard - PDS', 'Deleted PDS document for Security Guard (25-GPC-GRD01)', '::1', 'success', NULL, '2025-12-07 10:21:05'),
(130, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00005', 'Carlos Mendoza Torres - PDS', 'Deleted PDS document for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', NULL, '2025-12-07 10:21:08'),
(131, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00004', 'Ana Lopez Ramos - PDS', 'Deleted PDS document for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', NULL, '2025-12-07 10:21:10'),
(132, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00003', 'Pedro Reyes Gonzales Jr. - PDS', 'Deleted PDS document for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', NULL, '2025-12-07 10:21:12'),
(133, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00002', 'Maria Garcia Santos - PDS', 'Deleted PDS document for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', NULL, '2025-12-07 10:21:16'),
(134, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00001', 'Juan Santos Dela Cruz - PDS', 'Deleted PDS document for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', NULL, '2025-12-07 10:21:18'),
(135, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-ADM01', 'System Administrator - PDS', 'Deleted PDS document for System Administrator (25-GPC-ADM01)', '::1', 'success', NULL, '2025-12-07 10:21:21'),
(136, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Leave', '1', 'Carlos Mendoza Torres 2025-12-03 - 2026-01-01', 'Leave request submitted (emergency)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"leaveType\":\"emergency\",\"startDate\":\"2025-12-03\",\"endDate\":\"2026-01-01\"}', '2025-12-07 10:48:52'),
(137, NULL, 'System Administrator', 'UPDATE', 'Leave', '1', 'Carlos Mendoza Torres Wed Dec 03 2025 00:00:00 GMT+0800 (Philippine Standard Time) - Thu Jan 01 2026 00:00:00 GMT+0800 (Philippine Standard Time)', 'Leave request rejected', '::1', 'success', '{\"status\":\"rejected\"}', '2025-12-07 10:51:12'),
(138, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Leave', '2', 'Carlos Mendoza Torres 2025-12-02 - 2025-12-04', 'Leave request submitted (vacation)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"leaveType\":\"vacation\",\"startDate\":\"2025-12-02\",\"endDate\":\"2025-12-04\"}', '2025-12-07 10:54:50'),
(139, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '11', 'pds_25-GPC-00005', 'Document \"pds_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":26037329}', '2025-12-07 11:09:18'),
(140, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '12', 'serviceRecord_25-GPC-00005', 'Document \"serviceRecord_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":26037329}', '2025-12-07 11:09:26'),
(141, NULL, 'System', 'CREATE', 'Attendance', NULL, 'Auto-absent for 2025-12-07', 'Automatically marked 10 employee(s) as absent for 2025-12-07 (no attendance by 4:00 PM).', NULL, 'success', '{\"date\":\"2025-12-07\",\"autoAbsentCount\":10}', '2025-12-07 11:24:50'),
(142, NULL, 'System Administrator', 'CREATE', 'Document', '13', 'pds_25-GPC-GRD01', 'Document \"pds_25-GPC-GRD01\" was uploaded for employee 25-GPC-GRD01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 11:35:58'),
(143, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-GRD01', 'Security Guard - PDS', 'Deleted PDS document for Security Guard (25-GPC-GRD01)', '::1', 'success', NULL, '2025-12-07 11:36:02'),
(144, NULL, 'System Administrator', 'CREATE', 'Document', '14', 'sr_25-GPC-GRD01', 'Document \"sr_25-GPC-GRD01\" was uploaded for employee 25-GPC-GRD01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 11:36:06'),
(145, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-GRD01', 'Security Guard - SR', 'Deleted SR document for Security Guard (25-GPC-GRD01)', '::1', 'success', NULL, '2025-12-07 11:36:09'),
(146, NULL, 'System Administrator', 'CREATE', 'Document', '15', 'sr_25-GPC-00005', 'Document \"sr_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 11:36:21'),
(147, NULL, 'System Administrator', 'CREATE', 'Document', '16', 'sr_25-GPC-GRD01', 'Document \"sr_25-GPC-GRD01\" was uploaded for employee 25-GPC-GRD01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 11:36:30'),
(148, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00005', 'Carlos Mendoza Torres - SR', 'Deleted SR document for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', NULL, '2025-12-07 11:36:48'),
(149, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-GRD01', 'Security Guard - SR', 'Deleted SR document for Security Guard (25-GPC-GRD01)', '::1', 'success', NULL, '2025-12-07 11:36:55'),
(150, NULL, 'System Administrator', 'CREATE', 'Document', '17', 'pds_25-GPC-12039', 'Document \"pds_25-GPC-12039\" was uploaded for employee 25-GPC-12039', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 11:37:59'),
(151, NULL, 'System Administrator', 'CREATE', 'Document', '18', 'sr_25-GPC-12039', 'Document \"sr_25-GPC-12039\" was uploaded for employee 25-GPC-12039', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 11:38:03'),
(152, NULL, 'System Administrator', 'CREATE', 'Document', '19', 'coe_25-GPC-12039', 'Document \"coe_25-GPC-12039\" was uploaded for employee 25-GPC-12039', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 11:38:06'),
(153, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '20', 'pds_25-GPC-00005', 'Document \"pds_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":26037329}', '2025-12-07 11:39:34'),
(154, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '21', 'serviceRecord_25-GPC-00005', 'Document \"serviceRecord_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":26037329}', '2025-12-07 11:40:03'),
(155, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '22', '201_25-GPC-00005', 'Document \"201_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":26037329}', '2025-12-07 11:40:05'),
(156, NULL, 'System Administrator', 'CREATE', 'Document', '23', 'coe_25-GPC-ADM01', 'Document \"coe_25-GPC-ADM01\" was uploaded for employee 25-GPC-ADM01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 11:44:26'),
(157, NULL, 'System Administrator', 'CREATE', 'Document', '24', 'sr_25-GPC-ADM01', 'Document \"sr_25-GPC-ADM01\" was uploaded for employee 25-GPC-ADM01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 11:44:31'),
(158, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-ADM01', 'System Administrator - SR', 'Deleted SR document for System Administrator (25-GPC-ADM01)', '::1', 'success', NULL, '2025-12-07 11:44:38'),
(159, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-ADM01', 'System Administrator - COE', 'Deleted COE document for System Administrator (25-GPC-ADM01)', '::1', 'success', NULL, '2025-12-07 11:44:43'),
(160, NULL, 'System Administrator', 'CREATE', 'Document', '25', 'sr_25-GPC-ADM01', 'Document \"sr_25-GPC-ADM01\" was uploaded for employee 25-GPC-ADM01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 12:03:30'),
(161, NULL, 'System Administrator', 'CREATE', 'Document', '26', 'pds_25-GPC-ADM01', 'Document \"pds_25-GPC-ADM01\" was uploaded for employee 25-GPC-ADM01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 12:03:37'),
(162, NULL, 'System Administrator', 'CREATE', 'Document', '27', 'coe_25-GPC-ADM01', 'Document \"coe_25-GPC-ADM01\" was uploaded for employee 25-GPC-ADM01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 12:03:46'),
(163, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-12039', 'TEST01 TEST01 TEST01 - COE', 'Deleted COE document for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', NULL, '2025-12-07 12:42:44'),
(164, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-ADM01', 'System Administrator - COE', 'Deleted COE document for System Administrator (25-GPC-ADM01)', '::1', 'success', NULL, '2025-12-07 12:42:46'),
(165, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-12039', 'TEST01 TEST01 TEST01 - SR', 'Deleted SR document for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', NULL, '2025-12-07 12:42:48'),
(166, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-ADM01', 'System Administrator - SR', 'Deleted SR document for System Administrator (25-GPC-ADM01)', '::1', 'success', NULL, '2025-12-07 12:42:51'),
(167, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00005', 'Carlos Mendoza Torres - PDS', 'Deleted PDS document for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', NULL, '2025-12-07 12:43:14'),
(168, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-ADM01', 'System Administrator - PDS', 'Deleted PDS document for System Administrator (25-GPC-ADM01)', '::1', 'success', NULL, '2025-12-07 12:43:17'),
(169, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-12039', 'TEST01 TEST01 TEST01 - PDS', 'Deleted PDS document for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', NULL, '2025-12-07 12:43:19'),
(170, NULL, 'System Administrator', 'CREATE', 'Document', '28', 'sr_25-GPC-00005', 'Document \"sr_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 12:43:45'),
(171, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00005', 'Carlos Mendoza Torres - SR', 'Deleted SR document for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', NULL, '2025-12-07 12:43:55'),
(172, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '29', 'sr_25-GPC-00005', 'Document \"sr_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 12:44:18'),
(173, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '30', 'pds_25-GPC-00005', 'Document \"pds_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":26037329}', '2025-12-07 12:44:31'),
(174, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00005', 'Carlos Mendoza Torres - SR', 'Deleted SR document for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', NULL, '2025-12-07 12:44:53'),
(175, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00005', 'Carlos Mendoza Torres - PDS', 'Deleted PDS document for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', NULL, '2025-12-07 12:44:56'),
(176, NULL, 'System Administrator', 'CREATE', 'Document', '31', 'sr_25-GPC-12039', 'Document \"sr_25-GPC-12039\" was uploaded for employee 25-GPC-12039', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 12:45:01'),
(177, NULL, 'System Administrator', 'CREATE', 'Document', '32', 'pds_25-GPC-12039', 'Document \"pds_25-GPC-12039\" was uploaded for employee 25-GPC-12039', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 12:45:10'),
(178, NULL, 'System Administrator', 'CREATE', 'Document', '33', 'pds_25-GPC-ADM01', 'Document \"pds_25-GPC-ADM01\" was uploaded for employee 25-GPC-ADM01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 12:45:30'),
(179, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-ADM01', 'System Administrator - PDS', 'Deleted PDS document for System Administrator (25-GPC-ADM01)', '::1', 'success', NULL, '2025-12-07 12:45:42'),
(180, NULL, 'System Administrator', 'CREATE', 'Document', '34', 'coe_25-GPC-12039', 'Document \"coe_25-GPC-12039\" was uploaded for employee 25-GPC-12039', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-07 12:51:43'),
(181, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-12039', 'TEST01 TEST01 TEST01 - COE', 'Deleted COE document for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', NULL, '2025-12-07 12:54:36'),
(182, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-12039', 'TEST01 TEST01 TEST01 - SR', 'Deleted SR document for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', NULL, '2025-12-07 12:54:47'),
(183, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-12039', 'TEST01 TEST01 TEST01 - PDS', 'Deleted PDS document for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', NULL, '2025-12-07 12:55:00'),
(184, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '35', 'pds_25-GPC-00005', 'Document \"pds_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":26037329}', '2025-12-07 12:55:45'),
(185, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '36', 'sr_25-GPC-00005', 'Document \"sr_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":18455433}', '2025-12-07 12:55:49'),
(186, NULL, 'System Administrator', 'UPDATE', 'Leave', '2', 'Carlos Mendoza Torres Tue Dec 02 2025 00:00:00 GMT+0800 (Philippine Standard Time) - Thu Dec 04 2025 00:00:00 GMT+0800 (Philippine Standard Time)', 'Leave request approved', '::1', 'success', '{\"status\":\"approved\"}', '2025-12-07 12:57:54'),
(187, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00005', 'Carlos Mendoza Torres - SR', 'Deleted SR document for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', NULL, '2025-12-07 12:58:03'),
(188, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00005', 'Carlos Mendoza Torres - PDS', 'Deleted PDS document for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', NULL, '2025-12-07 12:58:07'),
(189, NULL, 'System', 'CREATE', 'Attendance', '41', 'Carlos Mendoza Torres - 2025-12-07', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-07', '112.198.127.253', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-07\",\"status\":\"present\"}', '2025-12-07 13:44:31'),
(190, NULL, 'System', 'UPDATE', 'Attendance', NULL, 'Auto-checkout for 2025-12-07', 'Automatically checked out 1 employee(s) at 7:00 PM.', NULL, 'success', '{\"date\":\"2025-12-07\",\"autoCheckoutCount\":1}', '2025-12-07 13:44:37'),
(191, NULL, 'System', 'CREATE', 'Attendance', '41', 'Carlos Mendoza Torres - 2025-12-07', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-07', '112.198.127.253', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-07\",\"status\":\"present\"}', '2025-12-07 13:54:12'),
(192, NULL, 'System', 'CREATE', 'Attendance', '45', 'TEST01 TEST01 TEST01 - 2025-12-08', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-08', '112.198.127.253', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-08\",\"status\":\"present\"}', '2025-12-07 16:12:32'),
(193, NULL, 'System', 'CREATE', 'Attendance', '45', 'TEST01 TEST01 TEST01 - 2025-12-08', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-08', '112.198.127.253', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-08\",\"status\":\"present\"}', '2025-12-07 16:13:19'),
(194, NULL, 'System', 'CREATE', 'Attendance', '45', 'TEST01 TEST01 TEST01 - 2025-12-08', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-08', '112.198.127.253', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-08\",\"status\":\"present\"}', '2025-12-07 16:40:36'),
(195, NULL, 'System', 'CREATE', 'Attendance', '45', 'TEST01 TEST01 TEST01 - 2025-12-08', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-08', '112.198.127.253', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-08\",\"status\":\"present\"}', '2025-12-07 16:40:50');
INSERT INTO `activity_logs` (`id`, `user_id`, `user_name`, `action_type`, `resource_type`, `resource_id`, `resource_name`, `description`, `ip_address`, `status`, `metadata`, `created_at`) VALUES
(196, NULL, 'System', 'CREATE', 'Attendance', '45', 'TEST01 TEST01 TEST01 - 2025-12-08', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-08', '111.90.230.205', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-08\",\"status\":\"present\"}', '2025-12-07 17:08:24'),
(197, NULL, 'System', 'CREATE', 'Attendance', '45', 'TEST01 TEST01 TEST01 - 2025-12-08', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-08', '111.90.230.205', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-08\",\"status\":\"present\"}', '2025-12-07 17:08:46'),
(198, NULL, 'System', 'CREATE', 'Attendance', '45', 'TEST01 TEST01 TEST01 - 2025-12-08', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-08', '111.90.230.205', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-08\",\"status\":\"present\"}', '2025-12-07 17:14:00'),
(199, NULL, 'System', 'CREATE', 'Attendance', '45', 'TEST01 TEST01 TEST01 - 2025-12-08', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-08', '111.90.230.205', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-08\",\"status\":\"present\"}', '2025-12-07 17:14:30'),
(200, NULL, 'System', 'CREATE', 'Attendance', '45', 'TEST01 TEST01 TEST01 - 2025-12-08', 'Attendance record created for TEST01 TEST01 TEST01 (25-GPC-12039) on 2025-12-08', '111.90.230.205', 'success', '{\"employeeId\":\"25-GPC-12039\",\"date\":\"2025-12-08\",\"status\":\"present\"}', '2025-12-07 17:14:47'),
(201, NULL, 'System', 'CREATE', 'Attendance', NULL, 'Auto-absent for 2025-12-09', 'Automatically marked 11 employee(s) as absent for 2025-12-09 (no attendance by 4:00 PM).', NULL, 'success', '{\"date\":\"2025-12-09\",\"autoAbsentCount\":11}', '2025-12-09 15:26:29'),
(202, NULL, 'Admin', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Generated QR code for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:38'),
(203, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:38'),
(204, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:38'),
(205, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:38'),
(206, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:38'),
(207, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:38'),
(208, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:38'),
(209, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:39'),
(210, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:39'),
(211, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:39'),
(212, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-09 16:25:39'),
(213, NULL, 'Admin', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Generated QR code for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"qr_generation\"}', '2025-12-09 16:26:04'),
(214, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-09 16:26:05'),
(215, NULL, 'Admin', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Generated QR code for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(216, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(217, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(218, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(219, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(220, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(221, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(222, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(223, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(224, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(225, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 02:26:14'),
(226, NULL, 'Admin', 'UPDATE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Generated QR code for TEST01 TEST01 TEST01 (25-GPC-12039)', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:06'),
(227, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:06'),
(228, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:06'),
(229, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:06'),
(230, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:06'),
(231, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:07'),
(232, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:07'),
(233, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:07'),
(234, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:07'),
(235, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:07'),
(236, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 02:28:07'),
(237, NULL, 'System', 'CREATE', 'Department', '19', 'test dep', 'Department \"test dep\" was created', '::1', 'success', NULL, '2025-12-10 02:28:18'),
(238, NULL, 'System', 'DELETE', 'Employee', '14', 'TEST01 TEST01 TEST01', 'Employee TEST01 TEST01 TEST01 (25-GPC-12039) was deleted', '::1', 'success', '{\"employeeId\":\"25-GPC-12039\"}', '2025-12-10 02:30:13'),
(239, NULL, 'System', 'CREATE', 'Attendance', '65', 'Carlos Mendoza Torres - 2025-12-10', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-10', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-10\",\"status\":\"present\"}', '2025-12-10 02:36:58'),
(240, NULL, 'System', 'CREATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Employee TEST02 TEST02 TEST02 (25-GPC-10002) was created and employee account was automatically created', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"department\":\"Administration Department\",\"position\":\"Clerk\",\"userAccountCreated\":true}', '2025-12-10 02:59:03'),
(241, NULL, 'System', 'CREATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Employee TEST03 TEST01 TEST01 (25-GPC-20003) was created and employee account was automatically created', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"department\":\"Finance\",\"position\":\"Accounting Clerks (2)\",\"userAccountCreated\":true}', '2025-12-10 03:00:46'),
(242, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:38'),
(243, NULL, 'Admin', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Generated QR code for Maria Santos Lopez (15-GPC-00001)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:38'),
(244, NULL, 'Admin', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Generated QR code for Juan Dela Cruz (12-GPC-00002)', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:38'),
(245, NULL, 'Admin', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Generated QR code for Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:38'),
(246, NULL, 'Admin', 'UPDATE', 'Employee', '23', 'Antonio Reyes Santos', 'Generated QR code for Antonio Reyes Santos (13-GPC-00004)', '::1', 'success', '{\"employeeId\":\"13-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:38'),
(247, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:38'),
(248, NULL, 'Admin', 'UPDATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Generated QR code for TEST02 TEST02 TEST02 (25-GPC-10002)', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:38'),
(249, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(250, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(251, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(252, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(253, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(254, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(255, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(256, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(257, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(258, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 03:28:39'),
(259, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:31'),
(260, NULL, 'Admin', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Generated QR code for Maria Santos Lopez (15-GPC-00001)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:31'),
(261, NULL, 'Admin', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Generated QR code for Juan Dela Cruz (12-GPC-00002)', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:31'),
(262, NULL, 'Admin', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Generated QR code for Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(263, NULL, 'Admin', 'UPDATE', 'Employee', '23', 'Antonio Reyes Santos', 'Generated QR code for Antonio Reyes Santos (13-GPC-00004)', '::1', 'success', '{\"employeeId\":\"13-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(264, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(265, NULL, 'Admin', 'UPDATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Generated QR code for TEST02 TEST02 TEST02 (25-GPC-10002)', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(266, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(267, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(268, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(269, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(270, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(271, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(272, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(273, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(274, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(275, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 03:36:32'),
(276, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(277, NULL, 'Admin', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Generated QR code for Maria Santos Lopez (15-GPC-00001)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(278, NULL, 'Admin', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Generated QR code for Juan Dela Cruz (12-GPC-00002)', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(279, NULL, 'Admin', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Generated QR code for Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(280, NULL, 'Admin', 'UPDATE', 'Employee', '23', 'Antonio Reyes Santos', 'Generated QR code for Antonio Reyes Santos (13-GPC-00004)', '::1', 'success', '{\"employeeId\":\"13-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(281, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(282, NULL, 'Admin', 'UPDATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Generated QR code for TEST02 TEST02 TEST02 (25-GPC-10002)', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(283, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(284, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(285, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(286, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(287, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(288, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(289, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(290, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(291, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(292, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:25'),
(293, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(294, NULL, 'Admin', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Generated QR code for Maria Santos Lopez (15-GPC-00001)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(295, NULL, 'Admin', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Generated QR code for Juan Dela Cruz (12-GPC-00002)', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(296, NULL, 'Admin', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Generated QR code for Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(297, NULL, 'Admin', 'UPDATE', 'Employee', '23', 'Antonio Reyes Santos', 'Generated QR code for Antonio Reyes Santos (13-GPC-00004)', '::1', 'success', '{\"employeeId\":\"13-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(298, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(299, NULL, 'Admin', 'UPDATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Generated QR code for TEST02 TEST02 TEST02 (25-GPC-10002)', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(300, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(301, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(302, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(303, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(304, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(305, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(306, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(307, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(308, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(309, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:44'),
(310, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(311, NULL, 'Admin', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Generated QR code for Maria Santos Lopez (15-GPC-00001)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(312, NULL, 'Admin', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Generated QR code for Juan Dela Cruz (12-GPC-00002)', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(313, NULL, 'Admin', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Generated QR code for Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(314, NULL, 'Admin', 'UPDATE', 'Employee', '23', 'Antonio Reyes Santos', 'Generated QR code for Antonio Reyes Santos (13-GPC-00004)', '::1', 'success', '{\"employeeId\":\"13-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(315, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(316, NULL, 'Admin', 'UPDATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Generated QR code for TEST02 TEST02 TEST02 (25-GPC-10002)', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(317, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(318, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(319, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(320, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:54'),
(321, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:55'),
(322, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:55'),
(323, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:55'),
(324, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:55'),
(325, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:55'),
(326, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 03:37:55'),
(327, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(328, NULL, 'Admin', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Generated QR code for Maria Santos Lopez (15-GPC-00001)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(329, NULL, 'Admin', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Generated QR code for Juan Dela Cruz (12-GPC-00002)', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(330, NULL, 'Admin', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Generated QR code for Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(331, NULL, 'Admin', 'UPDATE', 'Employee', '23', 'Antonio Reyes Santos', 'Generated QR code for Antonio Reyes Santos (13-GPC-00004)', '::1', 'success', '{\"employeeId\":\"13-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(332, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(333, NULL, 'Admin', 'UPDATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Generated QR code for TEST02 TEST02 TEST02 (25-GPC-10002)', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(334, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(335, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(336, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(337, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(338, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(339, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(340, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(341, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(342, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(343, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 03:38:33'),
(344, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:19'),
(345, NULL, 'Admin', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Generated QR code for Maria Santos Lopez (15-GPC-00001)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:19'),
(346, NULL, 'Admin', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Generated QR code for Juan Dela Cruz (12-GPC-00002)', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:19'),
(347, NULL, 'Admin', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Generated QR code for Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:19'),
(348, NULL, 'Admin', 'UPDATE', 'Employee', '23', 'Antonio Reyes Santos', 'Generated QR code for Antonio Reyes Santos (13-GPC-00004)', '::1', 'success', '{\"employeeId\":\"13-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:19'),
(349, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:19'),
(350, NULL, 'Admin', 'UPDATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Generated QR code for TEST02 TEST02 TEST02 (25-GPC-10002)', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(351, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(352, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(353, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(354, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(355, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(356, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(357, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(358, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(359, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(360, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 05:55:20'),
(361, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(362, NULL, 'Admin', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Generated QR code for Maria Santos Lopez (15-GPC-00001)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(363, NULL, 'Admin', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Generated QR code for Juan Dela Cruz (12-GPC-00002)', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(364, NULL, 'Admin', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Generated QR code for Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(365, NULL, 'Admin', 'UPDATE', 'Employee', '23', 'Antonio Reyes Santos', 'Generated QR code for Antonio Reyes Santos (13-GPC-00004)', '::1', 'success', '{\"employeeId\":\"13-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(366, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(367, NULL, 'Admin', 'UPDATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Generated QR code for TEST02 TEST02 TEST02 (25-GPC-10002)', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(368, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(369, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(370, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:30'),
(371, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:31'),
(372, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:31'),
(373, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:31'),
(374, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:31'),
(375, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:31'),
(376, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:31'),
(377, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 06:01:31'),
(378, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(379, NULL, 'Admin', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Generated QR code for Maria Santos Lopez (15-GPC-00001)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(380, NULL, 'Admin', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Generated QR code for Juan Dela Cruz (12-GPC-00002)', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(381, NULL, 'Admin', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Generated QR code for Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(382, NULL, 'Admin', 'UPDATE', 'Employee', '23', 'Antonio Reyes Santos', 'Generated QR code for Antonio Reyes Santos (13-GPC-00004)', '::1', 'success', '{\"employeeId\":\"13-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(383, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(384, NULL, 'Admin', 'UPDATE', 'Employee', '18', 'TEST02 TEST02 TEST02', 'Generated QR code for TEST02 TEST02 TEST02 (25-GPC-10002)', '::1', 'success', '{\"employeeId\":\"25-GPC-10002\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(385, NULL, 'Admin', 'UPDATE', 'Employee', '13', 'System Administrator', 'Generated QR code for System Administrator (25-GPC-ADM01)', '::1', 'success', '{\"employeeId\":\"25-GPC-ADM01\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(386, NULL, 'Admin', 'UPDATE', 'Employee', '8', 'Juan Santos Dela Cruz', 'Generated QR code for Juan Santos Dela Cruz (25-GPC-00001)', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(387, NULL, 'Admin', 'UPDATE', 'Employee', '9', 'Maria Garcia Santos', 'Generated QR code for Maria Garcia Santos (25-GPC-00002)', '::1', 'success', '{\"employeeId\":\"25-GPC-00002\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(388, NULL, 'Admin', 'UPDATE', 'Employee', '10', 'Pedro Reyes Gonzales Jr.', 'Generated QR code for Pedro Reyes Gonzales Jr. (25-GPC-00003)', '::1', 'success', '{\"employeeId\":\"25-GPC-00003\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(389, NULL, 'Admin', 'UPDATE', 'Employee', '11', 'Ana Lopez Ramos', 'Generated QR code for Ana Lopez Ramos (25-GPC-00004)', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(390, NULL, 'Admin', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Generated QR code for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(391, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(392, NULL, 'Admin', 'UPDATE', 'Employee', '1', 'John A. Doe Jr.', 'Generated QR code for John A. Doe Jr. (EMP001)', '::1', 'success', '{\"employeeId\":\"EMP001\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(393, NULL, 'Admin', 'UPDATE', 'Employee', '2', 'Jane B. Smith', 'Generated QR code for Jane B. Smith (EMP002)', '::1', 'success', '{\"employeeId\":\"EMP002\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(394, NULL, 'Admin', 'UPDATE', 'Employee', '3', 'Mike C. Johnson', 'Generated QR code for Mike C. Johnson (EMP003)', '::1', 'success', '{\"employeeId\":\"EMP003\",\"action\":\"qr_generation\"}', '2025-12-10 07:54:57'),
(395, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Document', '37', 'sr_25-GPC-00005', 'Document \"sr_25-GPC-00005\" was uploaded for employee 25-GPC-00005', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":1591008}', '2025-12-10 09:55:37'),
(396, NULL, 'System', 'UPDATE', 'Attendance', NULL, 'Auto-checkout for 2025-12-10', 'Automatically checked out 1 employee(s) at 7:00 PM.', NULL, 'success', '{\"date\":\"2025-12-10\",\"autoCheckoutCount\":1}', '2025-12-10 12:40:40'),
(397, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00005', 'Carlos Mendoza Torres - SR', 'Deleted SR document for Carlos Mendoza Torres (25-GPC-00005)', '::1', 'success', NULL, '2025-12-10 13:42:07'),
(398, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST QR AUTO GENERATION', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-10 14:08:44'),
(399, NULL, 'System', 'CREATE', 'Employee', NULL, 'TEST QR AUTO GENERATION', 'Failed to create employee: Column count doesn\'t match value count at row 1', '::1', 'failed', NULL, '2025-12-10 14:10:07'),
(400, NULL, 'System', 'CREATE', 'Employee', '25', 'TEST QR AUTO GENERATION', 'Employee TEST QR AUTO GENERATION (25-GPC-20005) was created and employee account was automatically created. QR code was auto-generated.', '::1', 'success', '{\"employeeId\":\"25-GPC-20005\",\"department\":\"Administration Department\",\"position\":\"Clerk\",\"userAccountCreated\":true,\"qrCodeGenerated\":true}', '2025-12-10 14:10:30'),
(401, NULL, 'System', 'CREATE', 'Attendance', NULL, 'Auto-absent for 2025-12-10', 'Automatically marked 17 employee(s) as absent for 2025-12-10 (no attendance by 4:00 PM).', NULL, 'success', '{\"date\":\"2025-12-10\",\"autoAbsentCount\":17}', '2025-12-10 14:19:11'),
(402, NULL, 'System', 'CREATE', 'Attendance', '82', 'TEST QR AUTO GENERATION - 2025-12-10', 'Attendance record created for TEST QR AUTO GENERATION (25-GPC-20005) on 2025-12-10', '::1', 'success', '{\"employeeId\":\"25-GPC-20005\",\"date\":\"2025-12-10\",\"status\":\"present\"}', '2025-12-10 15:12:35'),
(403, NULL, 'System', 'CREATE', 'Attendance', '65', 'Carlos Mendoza Torres - 2025-12-10', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-10', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-10\",\"status\":\"present\"}', '2025-12-10 15:12:58'),
(404, NULL, 'System Administrator', 'CREATE', 'CalendarEvent', '2', 'december 11', 'Event \"december 11\" was created for 2025-12-11 at 15:29', '::1', 'success', '{\"type\":\"event\",\"eventDate\":\"2025-12-11\",\"eventTime\":\"15:29\"}', '2025-12-10 15:27:12');
INSERT INTO `activity_logs` (`id`, `user_id`, `user_name`, `action_type`, `resource_type`, `resource_id`, `resource_name`, `description`, `ip_address`, `status`, `metadata`, `created_at`) VALUES
(405, NULL, 'System', 'UPDATE', 'Attendance', NULL, 'Auto-checkout for 2025-12-10', 'Automatically checked out 1 employee(s) at 7:00 PM.', NULL, 'success', '{\"date\":\"2025-12-10\",\"autoCheckoutCount\":1}', '2025-12-10 15:31:33'),
(406, NULL, 'System Administrator', 'CREATE', 'CalendarEvent', '3', 'december 11', 'Reminder \"december 11\" was created for 2025-12-11 at 12:33', '::1', 'success', '{\"type\":\"reminder\",\"eventDate\":\"2025-12-11\",\"eventTime\":\"12:33\"}', '2025-12-10 15:33:19'),
(407, NULL, 'System Administrator', 'CREATE', 'CalendarEvent', '5', 'ddec12', 'Event \"ddec12\" was created for 2025-12-12', '::1', 'success', '{\"type\":\"event\",\"eventDate\":\"2025-12-12\",\"eventTime\":null}', '2025-12-10 15:38:12'),
(408, NULL, 'Admin', 'DELETE', 'CalendarEvent', '4', 'Test Dec 11 Fix', 'Event \"Test Dec 11 Fix\" was deleted', '::1', 'success', NULL, '2025-12-10 15:40:50'),
(409, NULL, 'System Administrator', 'DELETE', 'CalendarEvent', '3', 'december 11', 'Reminder \"december 11\" was deleted', '::1', 'success', NULL, '2025-12-10 15:40:50'),
(410, NULL, 'System Administrator', 'DELETE', 'CalendarEvent', '2', 'december 11', 'Event \"december 11\" was deleted', '::1', 'success', NULL, '2025-12-10 15:40:51'),
(411, NULL, 'System Administrator', 'DELETE', 'CalendarEvent', '1', 'december 11 test', 'Reminder \"december 11 test\" was deleted', '::1', 'success', NULL, '2025-12-10 15:40:51'),
(412, NULL, 'System Administrator', 'DELETE', 'CalendarEvent', '5', 'ddec12', 'Event \"ddec12\" was deleted', '::1', 'success', NULL, '2025-12-10 15:40:54'),
(413, NULL, 'System Administrator', 'CREATE', 'CalendarEvent', '6', 'TEST 12', 'Reminder \"TEST 12\" was created for 2025-12-12', '::1', 'success', '{\"type\":\"reminder\",\"eventDate\":\"2025-12-12\",\"eventTime\":null}', '2025-12-10 15:57:41'),
(414, NULL, 'Carlos Mendoza Torres', 'CREATE', 'Leave', '6', 'Carlos Mendoza Torres 2025-12-17 - 2025-12-19', 'Leave request submitted (vacation)', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"leaveType\":\"vacation\",\"startDate\":\"2025-12-17\",\"endDate\":\"2025-12-19\"}', '2025-12-10 15:59:01'),
(415, NULL, 'System', 'ARCHIVE', 'Employee', '25', 'TEST QR AUTO GENERATION', 'Employee TEST QR AUTO GENERATION (25-GPC-20005) was archived. Reason: TEST', '::1', 'success', '{\"reason\":\"TEST\",\"employeeId\":\"25-GPC-20005\"}', '2025-12-11 00:13:54'),
(416, NULL, 'Admin', 'UPDATE', 'Employee', '7', 'Security Guard', 'Generated QR code for Security Guard (25-GPC-GRD01)', '::1', 'success', '{\"employeeId\":\"25-GPC-GRD01\",\"action\":\"qr_generation\"}', '2025-12-11 00:14:00'),
(417, NULL, 'Admin', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Generated QR code for TEST EMPLOYEE COLLEGE (25-GPC-00010)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"action\":\"qr_generation\"}', '2025-12-11 00:14:06'),
(418, NULL, 'Admin', 'UPDATE', 'Employee', '19', 'TEST03 TEST01 TEST01', 'Generated QR code for TEST03 TEST01 TEST01 (25-GPC-20003)', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"action\":\"qr_generation\"}', '2025-12-11 00:14:15'),
(419, NULL, 'System Administrator', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Password reset for employee Rosa Garcia Fernandez (14-GPC-00003)', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\",\"action\":\"password_reset\"}', '2025-12-11 00:33:39'),
(420, NULL, 'System', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Employee Rosa Garcia Fernandez (14-GPC-00003) was updated', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\"}', '2025-12-11 00:33:55'),
(421, NULL, 'System', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Employee Rosa Garcia Fernandez (14-GPC-00003) was updated', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\"}', '2025-12-11 00:35:35'),
(422, NULL, 'Rosa Garcia Fernandez', 'CREATE', 'Document', '38', 'pds_25-GPC-00010', 'Document \"pds_25-GPC-00010\" was uploaded for employee 25-GPC-00010', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":1591008}', '2025-12-11 01:10:01'),
(423, NULL, 'System', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Employee TEST EMPLOYEE COLLEGE (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 01:16:49'),
(424, NULL, 'System', 'UPDATE', 'Employee', '24', 'TEST EMPLOYEE COLLEGE', 'Employee TEST EMPLOYEE COLLEGE (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 01:17:44'),
(425, NULL, 'TEST EMPLOYEE COLLEGE', 'CREATE', 'Leave', '7', 'TEST EMPLOYEE COLLEGE 2025-12-10 - 2025-12-26', 'Leave request submitted (vacation)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"leaveType\":\"vacation\",\"startDate\":\"2025-12-10\",\"endDate\":\"2025-12-26\"}', '2025-12-11 01:18:12'),
(426, NULL, 'Rosa Garcia Fernandez', 'RECOMMEND', 'Leave', '7', 'TEST EMPLOYEE COLLEGE Wed Dec 10 2025 08:00:00 GMT+0800 (Philippine Standard Time) - Fri Dec 26 2025 08:00:00 GMT+0800 (Philippine Standard Time)', 'Leave request recommend by department head', '::1', 'success', '{\"status\":\"department_approved\"}', '2025-12-11 01:18:39'),
(427, NULL, 'System Administrator', 'UPDATE', 'Leave', '7', 'TEST EMPLOYEE COLLEGE Wed Dec 10 2025 08:00:00 GMT+0800 (Philippine Standard Time) - Fri Dec 26 2025 08:00:00 GMT+0800 (Philippine Standard Time)', 'Leave request rejected', '::1', 'success', '{\"status\":\"rejected\"}', '2025-12-11 01:19:39'),
(428, NULL, 'TEST EMPLOYEE COLLEGE', 'CREATE', 'Leave', '8', 'TEST EMPLOYEE COLLEGE 2025-12-11 - 2025-12-13', 'Leave request submitted (other)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"leaveType\":\"other\",\"startDate\":\"2025-12-11\",\"endDate\":\"2025-12-13\"}', '2025-12-11 01:20:38'),
(429, NULL, 'Rosa Garcia Fernandez', 'RECOMMEND', 'Leave', '8', 'TEST EMPLOYEE COLLEGE Thu Dec 11 2025 08:00:00 GMT+0800 (Philippine Standard Time) - Sat Dec 13 2025 08:00:00 GMT+0800 (Philippine Standard Time)', 'Leave request recommend by department head', '::1', 'success', '{\"status\":\"department_approved\"}', '2025-12-11 01:21:11'),
(430, NULL, 'System Administrator', 'UPDATE', 'Leave', '8', 'TEST EMPLOYEE COLLEGE Thu Dec 11 2025 08:00:00 GMT+0800 (Philippine Standard Time) - Sat Dec 13 2025 08:00:00 GMT+0800 (Philippine Standard Time)', 'Leave request approved', '::1', 'success', '{\"status\":\"approved\"}', '2025-12-11 01:21:43'),
(431, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH SAGUN CORPUZ', 'Employee MIAH SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 01:25:39'),
(432, NULL, 'MIAH SAGUN CORPUZ', 'CREATE', 'Leave', '9', 'MIAH SAGUN CORPUZ 2025-12-18 - 2025-12-20', 'Leave request submitted (vacation)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"leaveType\":\"vacation\",\"startDate\":\"2025-12-18\",\"endDate\":\"2025-12-20\"}', '2025-12-11 01:28:41'),
(433, NULL, 'Rosa Garcia Fernandez', 'RECOMMEND', 'Leave', '9', 'MIAH SAGUN CORPUZ Thu Dec 18 2025 08:00:00 GMT+0800 (Philippine Standard Time) - Sat Dec 20 2025 08:00:00 GMT+0800 (Philippine Standard Time)', 'Leave request recommend by department head', '::1', 'success', '{\"status\":\"department_approved\"}', '2025-12-11 01:30:34'),
(434, NULL, 'System Administrator', 'DELETE', 'Employee Document', '25-GPC-00010', 'MIAH SAGUN CORPUZ - PDS', 'Deleted PDS document for MIAH SAGUN CORPUZ (25-GPC-00010)', '::1', 'success', NULL, '2025-12-11 01:41:54'),
(435, NULL, 'MIAH SAGUN CORPUZ', 'CREATE', 'Leave', '10', 'MIAH SAGUN CORPUZ 2025-12-13 - 2025-12-15', 'Leave request submitted (vacation)', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"leaveType\":\"vacation\",\"startDate\":\"2025-12-13\",\"endDate\":\"2025-12-15\"}', '2025-12-11 01:46:15'),
(436, NULL, 'Rosa Garcia Fernandez', 'RECOMMEND', 'Leave', '10', 'MIAH SAGUN CORPUZ Sat Dec 13 2025 08:00:00 GMT+0800 (Philippine Standard Time) - Mon Dec 15 2025 08:00:00 GMT+0800 (Philippine Standard Time)', 'Leave request recommend by department head', '::1', 'success', '{\"status\":\"department_approved\"}', '2025-12-11 01:47:13'),
(437, NULL, 'System Administrator', 'UPDATE', 'Leave', '10', 'MIAH SAGUN CORPUZ Sat Dec 13 2025 08:00:00 GMT+0800 (Philippine Standard Time) - Mon Dec 15 2025 08:00:00 GMT+0800 (Philippine Standard Time)', 'Leave request approved', '::1', 'success', '{\"status\":\"approved\"}', '2025-12-11 01:47:37'),
(438, NULL, 'System', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Employee Juan Dela Cruz (12-GPC-00002) was updated', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\"}', '2025-12-11 01:53:56'),
(439, NULL, 'System', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Employee Rosa Garcia Fernandez (14-GPC-00003) was updated', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\"}', '2025-12-11 01:57:44'),
(440, NULL, 'System', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Employee Juan Dela Cruz (12-GPC-00002) was updated', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\"}', '2025-12-11 01:59:12'),
(441, NULL, 'System', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Employee Juan Dela Cruz (12-GPC-00002) was updated', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\"}', '2025-12-11 01:59:35'),
(442, NULL, 'System', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Employee Maria Santos Lopez (15-GPC-00001) was updated', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\"}', '2025-12-11 02:01:21'),
(443, NULL, 'System', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Employee Juan Dela Cruz (12-GPC-00002) was updated', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\"}', '2025-12-11 02:04:37'),
(444, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:15:00'),
(445, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:15:15'),
(446, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:15:26'),
(447, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:17:15'),
(448, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:17:39'),
(449, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:17:51'),
(450, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:18:01'),
(451, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:19:02'),
(452, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:19:19'),
(453, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:21:11'),
(454, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:23:41'),
(455, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH 1 SAGUN CORPUZ', 'Employee MIAH 1 SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 02:23:52'),
(456, NULL, 'System', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Employee Juan Dela Cruz (12-GPC-00002) was updated', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\"}', '2025-12-11 02:49:37'),
(457, NULL, 'Maria Santos Lopez', 'CREATE', 'Leave', '11', 'Maria Santos Lopez 2025-12-10 - 2025-12-16', 'Leave request submitted (sick)', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\",\"leaveType\":\"sick\",\"startDate\":\"2025-12-10\",\"endDate\":\"2025-12-16\"}', '2025-12-11 02:51:10'),
(458, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH SAGUN CORPUZ', 'Employee MIAH SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 03:00:44'),
(459, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH SAGUN CORPUZ', 'Employee MIAH SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 03:01:01'),
(460, NULL, 'System', 'UPDATE', 'Employee', '24', 'MIAH SAGUN CORPUZ', 'Employee MIAH SAGUN CORPUZ (25-GPC-00010) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\"}', '2025-12-11 03:12:45'),
(461, NULL, 'System', 'UPDATE', 'Employee', '20', 'Maria Santos Lopez', 'Employee Maria Santos Lopez (15-GPC-00001) was updated', '::1', 'success', '{\"employeeId\":\"15-GPC-00001\"}', '2025-12-11 03:13:02'),
(462, NULL, 'System', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Employee Juan Dela Cruz (12-GPC-00002) was updated', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\"}', '2025-12-11 03:13:20'),
(463, NULL, 'System', 'UPDATE', 'Employee', '21', 'Juan Dela Cruz', 'Employee Juan Dela Cruz (12-GPC-00002) was updated', '::1', 'success', '{\"employeeId\":\"12-GPC-00002\"}', '2025-12-11 03:13:25'),
(464, NULL, 'System', 'UPDATE', 'Employee', '22', 'Rosa Garcia Fernandez', 'Employee Rosa Garcia Fernandez (14-GPC-00003) was updated', '::1', 'success', '{\"employeeId\":\"14-GPC-00003\"}', '2025-12-11 03:13:49'),
(465, NULL, 'System', 'UPDATE', 'Employee', '12', 'Carlos Mendoza Torres', 'Employee Carlos Mendoza Torres (25-GPC-00005) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\"}', '2025-12-11 03:16:34'),
(466, NULL, 'System', 'UPDATE', 'Employee', '11', 'ANA TEST Lopez Ramos', 'Employee ANA TEST Lopez Ramos (25-GPC-00004) was updated', '::1', 'success', '{\"employeeId\":\"25-GPC-00004\"}', '2025-12-11 03:36:48'),
(467, NULL, 'System', 'CREATE', 'Attendance', '85', 'Juan Santos Dela Cruz - 2025-12-11', 'Attendance record created for Juan Santos Dela Cruz (25-GPC-00001) on 2025-12-11', '::1', 'success', '{\"employeeId\":\"25-GPC-00001\",\"date\":\"2025-12-11\",\"status\":\"late\"}', '2025-12-11 03:38:06'),
(468, NULL, 'System', 'CREATE', 'Attendance', '86', 'Carlos Mendoza Torres - 2025-12-11', 'Attendance record created for Carlos Mendoza Torres (25-GPC-00005) on 2025-12-11', '::1', 'success', '{\"employeeId\":\"25-GPC-00005\",\"date\":\"2025-12-11\",\"status\":\"present\"}', '2025-12-11 03:41:05'),
(469, NULL, 'System', 'CREATE', 'Attendance', '87', 'TEST03 TEST01 TEST01 - 2025-12-11', 'Attendance record created for TEST03 TEST01 TEST01 (25-GPC-20003) on 2025-12-11', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"date\":\"2025-12-11\",\"status\":\"present\"}', '2025-12-11 03:41:12'),
(470, NULL, 'System', 'CREATE', 'Attendance', '87', 'TEST03 TEST01 TEST01 - 2025-12-11', 'Attendance record created for TEST03 TEST01 TEST01 (25-GPC-20003) on 2025-12-11', '::1', 'success', '{\"employeeId\":\"25-GPC-20003\",\"date\":\"2025-12-11\",\"status\":\"present\"}', '2025-12-11 03:41:17'),
(471, NULL, 'System', 'CREATE', 'Attendance', '89', 'MIAH SAGUN CORPUZ - 2025-12-11', 'Attendance record created for MIAH SAGUN CORPUZ (25-GPC-00010) on 2025-12-11', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"date\":\"2025-12-11\",\"status\":\"present\"}', '2025-12-11 03:42:05'),
(472, NULL, 'System', 'CREATE', 'Attendance', '89', 'MIAH SAGUN CORPUZ - 2025-12-11', 'Attendance record created for MIAH SAGUN CORPUZ (25-GPC-00010) on 2025-12-11', '::1', 'success', '{\"employeeId\":\"25-GPC-00010\",\"date\":\"2025-12-11\",\"status\":\"present\"}', '2025-12-11 03:42:13');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `employee_name` varchar(180) NOT NULL,
  `date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `status` enum('present','absent','late','half-day','leave') NOT NULL DEFAULT 'present',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `qr_verified` tinyint(1) DEFAULT 0 COMMENT 'Whether attendance was verified via QR',
  `verification_method` enum('qr','manual','guard_qr') DEFAULT 'manual' COMMENT 'Method used for attendance verification',
  `late_minutes` int(11) DEFAULT 0 COMMENT 'Minutes late for check-in',
  `undertime_minutes` int(11) DEFAULT 0 COMMENT 'Minutes left early',
  `overtime_minutes` int(11) DEFAULT 0 COMMENT 'Minutes overtime worked'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `employee_id`, `employee_name`, `date`, `check_in`, `check_out`, `status`, `notes`, `created_at`, `updated_at`, `qr_verified`, `verification_method`, `late_minutes`, `undertime_minutes`, `overtime_minutes`) VALUES
(1, 'EMP001', 'John A. Doe Jr.', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-05 09:31:23', '2025-12-05 09:31:23', 0, 'manual', 0, 0, 0),
(2, 'EMP002', 'Jane B. Smith', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-05 09:31:23', '2025-12-05 09:31:23', 0, 'manual', 0, 0, 0),
(3, 'EMP003', 'Mike C. Johnson', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-05 09:31:23', '2025-12-05 09:31:23', 0, 'manual', 0, 0, 0),
(4, '25-GPC-00005', 'Carlos Mendoza Torres', '2025-12-05', '22:40:00', NULL, 'present', 'Scanned by guard', '2025-12-05 13:31:07', '2025-12-05 14:40:03', 1, 'guard_qr', NULL, NULL, NULL),
(5, '25-GPC-00001', 'Juan Santos Dela Cruz', '2025-12-05', '21:32:00', NULL, 'present', 'Scanned by guard', '2025-12-05 13:32:11', '2025-12-05 13:32:11', 1, 'guard_qr', NULL, NULL, NULL),
(6, '25-GPC-00002', 'Maria Garcia Santos', '2025-12-05', '22:38:00', NULL, 'present', 'Scanned by guard', '2025-12-05 14:16:36', '2025-12-05 14:38:50', 1, 'guard_qr', NULL, NULL, NULL),
(15, '25-GPC-GRD01', 'Security Guard', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-05 14:33:35', '2025-12-05 14:33:35', 0, 'manual', 0, 0, 0),
(16, '25-GPC-00003', 'Pedro Reyes Gonzales Jr.', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-05 14:33:35', '2025-12-05 14:33:35', 0, 'manual', 0, 0, 0),
(17, '25-GPC-00004', 'Ana Lopez Ramos', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-05 14:33:35', '2025-12-05 14:33:35', 0, 'manual', 0, 0, 0),
(18, '25-GPC-ADM01', 'System Administrator', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-05 14:33:35', '2025-12-05 14:33:35', 0, 'manual', 0, 0, 0),
(21, '25-GPC-00005', 'Carlos Mendoza Torres', '2025-12-06', '10:13:00', '19:00:00', 'present', 'Scanned by guard | Auto-checkout at 7 PM - no manual checkout recorded', '2025-12-06 02:13:37', '2025-12-06 11:27:57', 1, 'guard_qr', NULL, NULL, NULL),
(22, '25-GPC-00001', 'Juan Santos Dela Cruz', '2025-12-06', '10:29:00', '21:24:00', 'present', 'Scanned by guard', '2025-12-06 02:29:09', '2025-12-06 11:21:41', 1, 'guard_qr', NULL, NULL, NULL),
(23, 'EMP001', 'John A. Doe Jr.', '2025-12-06', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-06 10:53:28', '2025-12-06 10:53:28', 0, 'manual', 0, 0, 0),
(24, 'EMP002', 'Jane B. Smith', '2025-12-06', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-06 10:53:28', '2025-12-06 10:53:28', 0, 'manual', 0, 0, 0),
(25, 'EMP003', 'Mike C. Johnson', '2025-12-06', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-06 10:53:28', '2025-12-06 10:53:28', 0, 'manual', 0, 0, 0),
(26, '25-GPC-GRD01', 'Security Guard', '2025-12-06', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-06 10:53:28', '2025-12-06 10:53:28', 0, 'manual', 0, 0, 0),
(27, '25-GPC-00002', 'Maria Garcia Santos', '2025-12-06', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-06 10:53:28', '2025-12-06 10:53:28', 0, 'manual', 0, 0, 0),
(28, '25-GPC-00003', 'Pedro Reyes Gonzales Jr.', '2025-12-06', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-06 10:53:28', '2025-12-06 10:53:28', 0, 'manual', 0, 0, 0),
(29, '25-GPC-00004', 'Ana Lopez Ramos', '2025-12-06', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-06 10:53:28', '2025-12-06 10:53:28', 0, 'manual', 0, 0, 0),
(30, '25-GPC-ADM01', 'System Administrator', '2025-12-06', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', '2025-12-06 10:53:28', '2025-12-06 10:53:28', 0, 'manual', 0, 0, 0),
(31, '25-GPC-00005', 'Carlos Mendoza Torres', '2025-12-03', '16:12:00', '16:19:00', 'late', 'asd', '2025-12-07 08:10:19', '2025-12-07 09:04:09', 0, 'manual', 0, 0, 0),
(32, '25-GPC-12039', 'TEST01 TEST01 TEST01', '2025-12-07', '17:37:00', '17:37:00', 'late', NULL, '2025-12-07 09:36:00', '2025-12-07 09:36:00', 0, 'manual', 0, 0, 0),
(33, 'EMP001', 'John A. Doe Jr.', '2025-12-07', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-07 11:24:50', '2025-12-07 11:24:50', 0, 'manual', 0, 0, 0),
(34, 'EMP002', 'Jane B. Smith', '2025-12-07', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-07 11:24:50', '2025-12-07 11:24:50', 0, 'manual', 0, 0, 0),
(35, 'EMP003', 'Mike C. Johnson', '2025-12-07', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-07 11:24:50', '2025-12-07 11:24:50', 0, 'manual', 0, 0, 0),
(36, '25-GPC-GRD01', 'Security Guard', '2025-12-07', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-07 11:24:50', '2025-12-07 11:24:50', 0, 'manual', 0, 0, 0),
(37, '25-GPC-00001', 'Juan Santos Dela Cruz', '2025-12-07', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-07 11:24:50', '2025-12-07 11:24:50', 0, 'manual', 0, 0, 0),
(38, '25-GPC-00002', 'Maria Garcia Santos', '2025-12-07', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-07 11:24:50', '2025-12-07 11:24:50', 0, 'manual', 0, 0, 0),
(39, '25-GPC-00003', 'Pedro Reyes Gonzales Jr.', '2025-12-07', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-07 11:24:50', '2025-12-07 11:24:50', 0, 'manual', 0, 0, 0),
(40, '25-GPC-00004', 'Ana Lopez Ramos', '2025-12-07', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-07 11:24:50', '2025-12-07 11:24:50', 0, 'manual', 0, 0, 0),
(41, '25-GPC-00005', 'Carlos Mendoza Torres', '2025-12-07', '21:54:00', '19:00:00', 'present', 'Scanned by guard', '2025-12-07 11:24:50', '2025-12-07 13:54:12', 0, 'manual', 0, 0, 0),
(42, '25-GPC-ADM01', 'System Administrator', '2025-12-07', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-07 11:24:50', '2025-12-07 11:24:50', 0, 'manual', 0, 0, 0),
(45, '25-GPC-12039', 'TEST01 TEST01 TEST01', '2025-12-08', '01:14:00', '01:14:00', 'present', 'Scanned by guard', '2025-12-07 16:12:32', '2025-12-07 17:14:47', 0, 'manual', 0, 0, 0),
(54, 'EMP001', 'John A. Doe Jr.', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(55, 'EMP002', 'Jane B. Smith', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(56, 'EMP003', 'Mike C. Johnson', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(57, '25-GPC-GRD01', 'Security Guard', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(58, '25-GPC-00001', 'Juan Santos Dela Cruz', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(59, '25-GPC-00002', 'Maria Garcia Santos', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(60, '25-GPC-00003', 'Pedro Reyes Gonzales Jr.', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(61, '25-GPC-00004', 'Ana Lopez Ramos', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(62, '25-GPC-00005', 'Carlos Mendoza Torres', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(63, '25-GPC-ADM01', 'System Administrator', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(64, '25-GPC-12039', 'TEST01 TEST01 TEST01', '2025-12-09', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-09 15:26:29', '2025-12-09 15:26:29', 0, 'manual', 0, 0, 0),
(65, '25-GPC-00005', 'Carlos Mendoza Torres', '2025-12-10', '23:12:00', '19:00:00', 'present', 'Scanned by guard', '2025-12-10 02:36:58', '2025-12-10 15:12:58', 0, 'manual', 0, 0, 0),
(66, 'EMP001', 'John A. Doe Jr.', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(67, 'EMP002', 'Jane B. Smith', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(68, 'EMP003', 'Mike C. Johnson', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(69, '25-GPC-GRD01', 'Security Guard', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(70, '25-GPC-00001', 'Juan Santos Dela Cruz', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(71, '25-GPC-00002', 'Maria Garcia Santos', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(72, '25-GPC-00003', 'Pedro Reyes Gonzales Jr.', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(73, '25-GPC-00004', 'Ana Lopez Ramos', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(74, '25-GPC-ADM01', 'System Administrator', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(75, '25-GPC-10002', 'TEST02 TEST02 TEST02', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(76, '25-GPC-20003', 'TEST03 TEST01 TEST01', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(77, '15-GPC-00001', 'Maria Santos Lopez', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(78, '12-GPC-00002', 'Juan Dela Cruz', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(79, '14-GPC-00003', 'Rosa Garcia Fernandez', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(80, '13-GPC-00004', 'Antonio Reyes Santos', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(81, '25-GPC-00010', 'TEST EMPLOYEE COLLEGE', '2025-12-10', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 7:00 PM)', '2025-12-10 14:19:11', '2025-12-10 14:19:11', 0, 'manual', 0, 0, 0),
(82, '25-GPC-20005', 'TEST QR AUTO GENERATION', '2025-12-10', '23:12:00', '19:00:00', 'present', 'Scanned by guard | Auto-checkout at 7 PM - no manual check-out recorded', '2025-12-10 14:19:11', '2025-12-10 15:31:33', 0, 'manual', 0, 0, 0),
(85, '25-GPC-00001', 'Juan Santos Dela Cruz', '2025-12-11', '11:38:00', '11:39:00', 'late', NULL, '2025-12-11 03:38:06', '2025-12-11 03:38:06', 0, 'manual', 0, 0, 0),
(86, '25-GPC-00005', 'Carlos Mendoza Torres', '2025-12-11', '11:41:00', NULL, 'present', 'Scanned by guard', '2025-12-11 03:41:05', '2025-12-11 03:41:05', 0, 'manual', 0, 0, 0),
(87, '25-GPC-20003', 'TEST03 TEST01 TEST01', '2025-12-11', '11:41:00', NULL, 'present', 'Scanned by guard', '2025-12-11 03:41:12', '2025-12-11 03:41:17', 0, 'manual', 0, 0, 0),
(89, '25-GPC-00010', 'MIAH SAGUN CORPUZ', '2025-12-11', '11:42:00', '11:42:00', 'present', 'Scanned by guard', '2025-12-11 03:42:05', '2025-12-11 03:42:13', 0, 'manual', 0, 0, 0);

-- --------------------------------------------------------

--
-- Stand-in structure for view `attendance_summary`
-- (See below for the actual view)
--
CREATE TABLE `attendance_summary` (
`employee_id` varchar(50)
,`full_name` varchar(180)
,`department` varchar(120)
,`total_present` bigint(21)
,`total_absent` bigint(21)
,`total_late` bigint(21)
,`total_halfday` bigint(21)
,`total_leave` bigint(21)
,`total_late_minutes` decimal(32,0)
,`total_undertime_minutes` decimal(32,0)
,`total_overtime_minutes` decimal(32,0)
,`year` int(4)
,`month` int(2)
);

-- --------------------------------------------------------

--
-- Table structure for table `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('reminder','event') NOT NULL DEFAULT 'reminder',
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` time DEFAULT NULL,
  `created_by` varchar(120) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calendar_events`
--

INSERT INTO `calendar_events` (`id`, `title`, `type`, `description`, `event_date`, `event_time`, `created_by`, `created_at`, `updated_at`) VALUES
(6, 'TEST 12', 'reminder', 'TEST 12', '2025-12-12', NULL, 'System Administrator', '2025-12-10 15:57:41', '2025-12-10 15:57:41');

-- --------------------------------------------------------

--
-- Table structure for table `certificate_templates`
--

CREATE TABLE `certificate_templates` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('active_employment','inactive_employment','service_record','clearance') NOT NULL,
  `template_content` text NOT NULL COMMENT 'HTML template with placeholders',
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Available placeholders: {name}, {position}, etc.' CHECK (json_valid(`variables`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Certificate templates for different employee statuses';

--
-- Dumping data for table `certificate_templates`
--

INSERT INTO `certificate_templates` (`id`, `name`, `type`, `template_content`, `variables`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Active Employment Certificate', 'active_employment', '<div class=\"certificate\">\n  <h2>CERTIFICATE OF EMPLOYMENT</h2>\n  <p>This is to certify that <strong>{employee_name}</strong>, holder of Employee ID <strong>{employee_id}</strong>, \n  is currently employed with this institution as <strong>{position}</strong> under the <strong>{department}</strong> department.</p>\n  <p>Employment commenced on <strong>{date_hired}</strong> and remains <strong>ACTIVE</strong> as of <strong>{issue_date}</strong>.</p>\n  <p>This certification is issued upon the request of the concerned employee for whatever legal purpose it may serve.</p>\n  <p><strong>Issued on:</strong> {issue_date}</p>\n  <p><strong>Verification Code:</strong> {verification_code}</p>\n</div>', '{\"employee_name\": \"Full name\", \"employee_id\": \"YY-GPC-XXXXX\", \"position\": \"Job title\", \"department\": \"Department name\", \"date_hired\": \"Hire date\", \"issue_date\": \"Certificate issue date\", \"verification_code\": \"Unique verification code\"}', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(2, 'Inactive Employment Certificate', 'inactive_employment', '<div class=\"certificate\">\n  <h2>CERTIFICATE OF PREVIOUS EMPLOYMENT</h2>\n  <p>This is to certify that <strong>{employee_name}</strong>, holder of Employee ID <strong>{employee_id}</strong>, \n  was previously employed with this institution as <strong>{position}</strong> under the <strong>{department}</strong> department.</p>\n  <p>Employment period: <strong>{date_hired}</strong> to <strong>{separation_date}</strong></p>\n  <p>Employment status: <strong>INACTIVE</strong> as of <strong>{issue_date}</strong></p>\n  <p>This certification is issued upon the request of the concerned individual for whatever legal purpose it may serve.</p>\n  <p><strong>Issued on:</strong> {issue_date}</p>\n  <p><strong>Verification Code:</strong> {verification_code}</p>\n</div>', '{\"employee_name\": \"Full name\", \"employee_id\": \"YY-GPC-XXXXX\", \"position\": \"Job title\", \"department\": \"Department name\", \"date_hired\": \"Hire date\", \"separation_date\": \"Last working date\", \"issue_date\": \"Certificate issue date\", \"verification_code\": \"Unique verification code\"}', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Board of Directors', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(2, 'Administration Department', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(3, 'Finance Department', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(4, 'High School Department', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(5, 'College Department', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(6, 'Elementary Department', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(13, 'Information Technology', '2025-12-05 11:49:38', '2025-12-05 11:49:38'),
(14, 'Human Resources', '2025-12-05 11:49:38', '2025-12-05 11:49:38'),
(15, 'Finance', '2025-12-05 11:49:38', '2025-12-05 11:49:38'),
(16, 'Engineering', '2025-12-05 11:49:38', '2025-12-05 11:49:38'),
(17, 'Marketing', '2025-12-05 11:49:38', '2025-12-05 11:49:38'),
(19, 'test dep', '2025-12-10 02:28:18', '2025-12-10 02:28:18');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `name`, `created_at`, `updated_at`, `department_id`) VALUES
(426, 'Vice President for Administration', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(427, 'Human Resource Head', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(428, 'Admin officer', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(429, 'Records Officer', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(430, 'Clerk', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(431, 'Nurse', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(432, 'IT Coordinator', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(433, 'Property Custodian', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(434, 'Supply Officer', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(435, 'Maintenance (3 securities, 5 utilities)', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 2),
(436, 'Vice President for Academic Affairs', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 6),
(437, 'Elementary Principal', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 6),
(438, 'Elementary Registrar', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 6),
(439, 'Guidance Counselor', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 6),
(440, 'Librarian in charge', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 6),
(441, 'Elementary Faculty Member', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 6),
(442, 'High School Principal', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(443, 'High School Registrar', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(444, 'Guidance Counselor', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(445, 'Records Officer', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(446, 'Encoder', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(447, 'Librarian in charge', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(448, 'Senior High School Coordinator', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(449, 'Junior High School Coordinator', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(450, 'TechVoc Coordinator', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(451, 'Program Coordinator', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(452, 'Housekeeping Trainer', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(453, 'Cookery Trainer', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(454, 'FBS Trainer', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(455, 'EIM Trainer', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(456, 'High School Faculty Member', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 4),
(457, 'Dean of College of Teacher Education', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(458, 'Dean of College of Business Education', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(459, 'School Librarian', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(460, 'Assistant Librarian', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(461, 'Research and Development Coordinator', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(462, 'Alumni Affairs Coordinator', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(463, 'NSTP Coordinator', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(464, 'MIS Coordinator', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(465, 'College Guidance Counselor', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(466, 'Student Affairs Head', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5),
(467, 'Faculty Member', '2025-12-10 03:26:13', '2025-12-10 03:26:13', 5);

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('policy','template','employee-doc','other') NOT NULL DEFAULT 'other',
  `category` varchar(120) DEFAULT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `document_type` varchar(50) DEFAULT NULL,
  `uploaded_by` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `name`, `type`, `category`, `file_path`, `file_url`, `file_size`, `mime_type`, `employee_id`, `document_type`, `uploaded_by`, `description`, `created_at`, `updated_at`) VALUES
(22, '201_25-GPC-00005', 'employee-doc', NULL, 'C:\\Users\\lapla\\OneDrive\\Desktop\\HRMSYSTEM\\gpchrms\\server\\src\\uploads\\file-1765107605363-230831597.pdf', '/uploads/file-1765107605363-230831597.pdf', 26037329, 'application/pdf', '25-GPC-00005', '201', 'Carlos Mendoza Torres', NULL, '2025-12-07 11:40:05', '2025-12-07 11:40:05');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `middle_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `suffix_name` varchar(30) NOT NULL,
  `full_name` varchar(180) NOT NULL,
  `department` varchar(120) NOT NULL,
  `position` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `civil_status` varchar(20) DEFAULT NULL,
  `date_hired` date NOT NULL,
  `date_of_leaving` date DEFAULT NULL,
  `employment_type` varchar(50) NOT NULL DEFAULT 'Regular',
  `role` enum('admin','employee','guard') NOT NULL DEFAULT 'employee',
  `sss_number` varchar(20) DEFAULT NULL,
  `pagibig_number` varchar(20) DEFAULT NULL,
  `tin_number` varchar(20) DEFAULT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `educational_background` text DEFAULT NULL,
  `signature_file` longtext DEFAULT NULL,
  `pds_file` longtext DEFAULT NULL,
  `service_record_file` longtext DEFAULT NULL,
  `file_201` longtext DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `archived_reason` varchar(255) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `qr_code_data` varchar(500) DEFAULT NULL COMMENT 'JWT token for QR code authentication',
  `qr_code_secret` varchar(255) DEFAULT NULL COMMENT 'Secret key for QR JWT signing',
  `qr_code_generated_at` timestamp NULL DEFAULT NULL COMMENT 'When QR code was last generated',
  `employment_count` int(11) DEFAULT 1,
  `current_employment_period` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_id`, `first_name`, `middle_name`, `last_name`, `suffix_name`, `full_name`, `department`, `position`, `email`, `phone`, `date_of_birth`, `address`, `gender`, `civil_status`, `date_hired`, `date_of_leaving`, `employment_type`, `role`, `sss_number`, `pagibig_number`, `tin_number`, `emergency_contact`, `educational_background`, `signature_file`, `pds_file`, `service_record_file`, `file_201`, `password_hash`, `status`, `archived_reason`, `archived_at`, `created_at`, `updated_at`, `qr_code_data`, `qr_code_secret`, `qr_code_generated_at`, `employment_count`, `current_employment_period`) VALUES
(1, 'EMP001', 'John', 'A.', 'Doe', 'Jr.', 'John A. Doe Jr.', 'IT Department', 'Software Developer', 'john.doe@company.com', '+1234567890', '1990-05-15', '123 Main St, City, State 12345', NULL, NULL, '2020-01-15', NULL, 'Regular', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 09:24:57', '2025-12-10 07:54:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiRU1QMDAxIiwiZW1wbG95ZWVOYW1lIjoiSm9obiBBLiBEb2UgSnIuIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjUzNTMyOTcsImV4cCI6MTc5Njg4OTI5N30.PdagszN-duAt7W3xvibFxTpMTxj4s5aPdru2_DrfGhA', '2c53ed5f3d7a19b3e0060dcc31d0610ff78972e86c237469a4a26ebbca389c42', '2026-12-10 07:54:57', 1, 1),
(2, 'EMP002', 'Jane', 'B.', 'Smith', '', 'Jane B. Smith', 'HR Department', 'HR Manager', 'jane.smith@company.com', '+1234567891', '1988-08-22', '456 Oak Ave, City, State 12345', NULL, NULL, '2019-03-10', NULL, 'Regular', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 09:24:57', '2025-12-10 07:54:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiRU1QMDAyIiwiZW1wbG95ZWVOYW1lIjoiSmFuZSBCLiBTbWl0aCIsInR5cGUiOiJhdHRlbmRhbmNlIiwiaWF0IjoxNzY1MzUzMjk3LCJleHAiOjE3OTY4ODkyOTd9.kWAtQgogSFTzVwFwV-sQ3WQdDPi_1ZwEMORJzY9_N08', '40ba13d39121b4e8f2be82f8a9501e5b69f1f7fcec5c07bb96a9ec74f425521a', '2026-12-10 07:54:57', 1, 1),
(3, 'EMP003', 'Mike', 'C.', 'Johnson', '', 'Mike C. Johnson', 'Finance', 'Accountant', 'mike.johnson@company.com', '+1234567892', '1992-12-05', '789 Pine Rd, City, State 12345', NULL, NULL, '2021-06-20', NULL, 'Regular', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 09:24:57', '2025-12-10 07:54:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiRU1QMDAzIiwiZW1wbG95ZWVOYW1lIjoiTWlrZSBDLiBKb2huc29uIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjUzNTMyOTcsImV4cCI6MTc5Njg4OTI5N30.jWm2pz1SeaxX8Gu6H-ZKP5HoJWAMwQdjrHfFOO_3i3g', '0685cf3478f4964505a226b3c80c46f049fbb625ccb918b9fe6e34f5d534d5cc', '2026-12-10 07:54:57', 1, 1),
(7, '25-GPC-GRD01', 'Security Guard', '', '', '', 'Security Guard', 'Security', 'Security Guard', 'guard01@school.edu', '09123456789', NULL, NULL, NULL, NULL, '2025-12-05', NULL, 'Regular', 'guard', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 10:58:03', '2025-12-11 00:14:00', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLUdSRDAxIiwiZW1wbG95ZWVOYW1lIjoiU2VjdXJpdHkgR3VhcmQiLCJ0eXBlIjoiYXR0ZW5kYW5jZSIsImlhdCI6MTc2NTQxMjA0MCwiZXhwIjoxNzk2OTQ4MDQwfQ.TmjRJrodLzhQWodZpSPGVpWQUtlahmLZLS647TzRoE0', '81f05b446eaf947fd674ae3e0f57dc7c46282e4e6e38c0f19980b24417d0540a', '2026-12-10 16:14:00', 1, 1),
(8, '25-GPC-00001', 'Juan', 'Santos', 'Dela Cruz', '', 'Juan Santos Dela Cruz', 'Information Technology', 'Software Developer', 'juan.delacruz@gpc.edu', '09171234567', '1995-05-15', '123 Main St, Manila', 'Male', 'Single', '2023-01-15', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-10 07:54:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDAxIiwiZW1wbG95ZWVOYW1lIjoiSnVhbiBTYW50b3MgRGVsYSBDcnV6IiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjUzNTMyOTcsImV4cCI6MTc5Njg4OTI5N30.7t0dd_BNZIVRRddWQTk-mJc5FEaWX5t2RMId79Uhu6Q', '0b8115927daf5ddd7060d7cb8666a6fc2e395bcb1294ca11b14fc50af2886e30', '2026-12-10 07:54:57', 1, 1),
(9, '25-GPC-00002', 'Maria', 'Garcia', 'Santos', '', 'Maria Garcia Santos', 'Human Resources', 'HR Manager', 'maria.santos@gpc.edu', '09181234567', '1990-08-20', '456 Secondary Ave, Quezon City', 'Female', 'Married', '2022-06-01', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-10 07:54:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDAyIiwiZW1wbG95ZWVOYW1lIjoiTWFyaWEgR2FyY2lhIFNhbnRvcyIsInR5cGUiOiJhdHRlbmRhbmNlIiwiaWF0IjoxNzY1MzUzMjk3LCJleHAiOjE3OTY4ODkyOTd9.k6wdfKsa5yqhawewob9awkzRuEi3AB8u0cBjgRvlJdU', '8392f0e76519befd76251a4e6da6468c0acef1caa335ab012f1f27cbd0202250', '2026-12-10 07:54:57', 1, 1),
(10, '25-GPC-00003', 'Pedro', 'Reyes', 'Gonzales', 'Jr.', 'Pedro Reyes Gonzales Jr.', 'Finance', 'Accountant', 'pedro.gonzales@gpc.edu', '09191234567', '1988-12-10', '789 Tertiary Rd, Makati', 'Male', 'Married', '2021-03-10', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-10 07:54:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDAzIiwiZW1wbG95ZWVOYW1lIjoiUGVkcm8gUmV5ZXMgR29uemFsZXMgSnIuIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjUzNTMyOTcsImV4cCI6MTc5Njg4OTI5N30.Zbg8nnOWDsOsfZYITO2la0qq_rmtWxbC2AegyO3B7As', 'c59ec7cf12acec812d760af2ff4b782f0502000b522d7b8d48e49e0cc5e5cb9f', '2026-12-10 07:54:57', 1, 1),
(11, '25-GPC-00004', 'ANA TEST', 'Lopez', 'Ramos', '', 'ANA TEST Lopez Ramos', 'College Department', 'Assistant Librarian', 'anatestramos@tgpc.edu', '09201234567', '1992-03-25', '321 Engineering St, Taguig', 'Female', 'Single', '2020-09-15', NULL, 'Regular', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$s0Z8oZoTdJTa4OUR85aa0u808rX.fGWIpUtsS4vy38huLBk6Husyq', 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-11 03:36:48', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDA0IiwiZW1wbG95ZWVOYW1lIjoiQW5hIExvcGV6IFJhbW9zIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjUzNTMyOTcsImV4cCI6MTc5Njg4OTI5N30.VJYQuz12yV8Fd_u1JcyOFNM9mIEpYNOU_B8iEcZ2mww', '1ef98d0be1badb92c648cb3dac0f320bd40b9ce9e392c71cb365990296e007cb', '2026-12-10 07:54:57', 1, 1),
(12, '25-GPC-00005', 'Carlos', 'Mendoza', 'Torres', '', 'Carlos Mendoza Torres', 'Marketing', 'Marketing Specialist', '25-GPC-00005@gpc.edu', '09211234567', '1998-07-08', '654 Marketing Blvd, Pasig', 'Male', 'Single', '2024-01-20', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$Epj9M3uINUM9eFG0vPAyneUh37OIV7XloeIuSiIffq.kGbM8tOykm', 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-11 03:16:34', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDA1IiwiZW1wbG95ZWVOYW1lIjoiQ2FybG9zIE1lbmRvemEgVG9ycmVzIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjUzNTMyOTcsImV4cCI6MTc5Njg4OTI5N30.JQ-_yBW_CxjO4LeAWedEIOLqfxeHU4g9G38uL1U4SB0', 'ae74dc6768c7583695704b31d05423f54c2e3a0cdc28b6a8138fe4641d4afc62', '2026-12-10 07:54:57', 1, 1),
(13, '25-GPC-ADM01', 'System', 'N/A', 'Administrator', '', 'System Administrator', 'Administration', 'System Administrator', 'admin@greatplebeian.edu', '09123456789', NULL, NULL, NULL, NULL, '2025-01-01', NULL, 'Regular', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$vjsWvYVkc.yUpXXWKw6UWOzPv1HTu4bwRbeCDs3T5VD578uMhHF0a', 'active', NULL, NULL, '2025-12-05 12:16:17', '2025-12-10 07:54:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLUFETTAxIiwiZW1wbG95ZWVOYW1lIjoiU3lzdGVtIEFkbWluaXN0cmF0b3IiLCJ0eXBlIjoiYXR0ZW5kYW5jZSIsImlhdCI6MTc2NTM1MzI5NywiZXhwIjoxNzk2ODg5Mjk3fQ.RgtQv1ZAc2B1he5FpNlmVn8On9aHpY4a-3CdYQoT8fc', 'fad6ade8755f18663e5e4b356bf17d7d5549f586d0c4c24729547ef2b0026b65', '2026-12-10 07:54:57', 1, 1),
(18, '25-GPC-10002', 'TEST02', 'TEST02', 'TEST02', '', 'TEST02 TEST02 TEST02', 'Administration Department', 'Clerk', 'test02test02@tgpc.edu.ph', '+639123456789', '2025-12-08', 'TEST02', NULL, NULL, '1996-03-06', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$xl84jJBRWUySmP5c6n9CBu2GM5JOaEl15OSwsnzfkrtU4JZgBxXXq', 'active', NULL, NULL, '2025-12-10 02:59:03', '2025-12-10 07:54:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTEwMDAyIiwiZW1wbG95ZWVOYW1lIjoiVEVTVDAyIFRFU1QwMiBURVNUMDIiLCJ0eXBlIjoiYXR0ZW5kYW5jZSIsImlhdCI6MTc2NTM1MzI5NywiZXhwIjoxNzk2ODg5Mjk3fQ.G6EtMs_KzkU7oiAe6c2c5d0_nAS20zurN8FF75I8xkY', '637612c78291d7714f2c7eb20b0489c7241cf8240a3a831f8dc550332380b33a', '2026-12-10 07:54:57', 1, 1),
(19, '25-GPC-20003', 'TEST03', 'TEST01', 'TEST01', '', 'TEST03 TEST01 TEST01', 'Finance', 'Accounting Clerks (2)', 'test03test01@tgpc.edu.ph', '+639123456789', '2025-11-30', 'TEST01', NULL, NULL, '2025-12-09', '2025-12-13', 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$fw3PaJQArOoHEftTDzt.iudqPDCjxWrX6rAlVGNCnEKX8dmi3XYoS', 'active', NULL, NULL, '2025-12-10 03:00:46', '2025-12-11 00:34:18', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTIwMDAzIiwiZW1wbG95ZWVOYW1lIjoiVEVTVDAzIFRFU1QwMSBURVNUMDEiLCJ0eXBlIjoiYXR0ZW5kYW5jZSIsImlhdCI6MTc2NTQxMjA1NSwiZXhwIjoxNzk2OTQ4MDU1fQ.8ehKaqmYTn0hIibHYY5xVjKmO0CEUWH58mhlv-pj1c4', '2fec009b18ed8edad5e134ecf2924b0561ce842164d44e2a2c131a6f737b6a96', '2026-12-10 16:14:15', 2, 2),
(20, '15-GPC-00001', 'Maria', 'Santos', 'Lopez', '', 'Maria Santos Lopez', 'Elementary Department', 'Elementary Faculty Member', '15-gpc-00001@gpc.edu', '09123456789', NULL, NULL, NULL, NULL, '2015-03-11', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$ARrSCdp.eKy4aVUgd8QYO.r6sXDp9Y/4CSzkuCgLbX6HPQ5GinXMK', 'active', NULL, NULL, '2025-12-10 03:10:28', '2025-12-11 03:13:02', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMTUtR1BDLTAwMDAxIiwiZW1wbG95ZWVOYW1lIjoiTWFyaWEgU2FudG9zIExvcGV6IiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjUzNTMyOTcsImV4cCI6MTc5Njg4OTI5N30.QPKJOHqvXz0Hi3vuutFHBeIWhJBHJTfZh_wKZVJ1P28', 'd1f5d1e701d56f21dbb2ab518aa626cd5c2fe3566ec7374b7297571422697a98', '2026-12-10 07:54:57', 1, 1),
(21, '12-GPC-00002', 'Juan', 'Dela', 'Cruz', '', 'Juan Dela Cruz', 'Elementary Department', 'Elementary Principal', '12-GPC-00002@gpc.edu', '09187654321', NULL, NULL, NULL, NULL, '2008-06-01', NULL, 'Regular', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$ABTGr/lTVW0n/E94/Xv1SOpwdUL4FrJi.XqxCmf9B052p5ALEmbRi', 'active', NULL, NULL, '2025-12-10 03:10:28', '2025-12-11 03:13:25', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMTItR1BDLTAwMDAyIiwiZW1wbG95ZWVOYW1lIjoiSnVhbiBEZWxhIENydXoiLCJ0eXBlIjoiYXR0ZW5kYW5jZSIsImlhdCI6MTc2NTM1MzI5NywiZXhwIjoxNzk2ODg5Mjk3fQ.H9-MFdhB7jInNqH_SLnmxbBzRs6KS99Rur4cwp9Kvac', 'bea7314f2094753b2d9daaa071b05a240502824891173a7373b6e3fd5afc0b86', '2026-12-10 07:54:57', 1, 1),
(22, '14-GPC-00003', 'Rosa', 'Garcia', 'Fernandez', '', 'Rosa Garcia Fernandez', 'College Department', 'dean', '14-gpc-00003@gpc.edu', '09111111111', NULL, NULL, NULL, NULL, '2005-01-10', NULL, 'Regular', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$jromiZTQul.6DzYpEcZyA.Hw.TfzQ.GDc/r1BXJFuWwBDR8MJpcfG', 'active', NULL, NULL, '2025-12-10 03:10:28', '2025-12-11 03:13:49', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMTQtR1BDLTAwMDAzIiwiZW1wbG95ZWVOYW1lIjoiUm9zYSBHYXJjaWEgRmVybmFuZGV6IiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjUzNTMyOTcsImV4cCI6MTc5Njg4OTI5N30.0JOFT2F__F6zy8TQEigiSj5B2XXOCVADcM9J9SohV9U', '10cdf2cbfaf6ef6a2cec3adda292067996cec4f0ec343a2d54514818f0feebd6', '2026-12-10 07:54:57', 1, 1),
(23, '13-GPC-00004', 'Antonio', 'Reyes', 'Santos', '', 'Antonio Reyes Santos', 'Administration Department', 'Administrative Officer', 'antonio.reyes@gpc.edu', '09222222222', NULL, NULL, NULL, NULL, '2012-09-20', NULL, 'Regular', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'hashed_password_4', 'active', NULL, NULL, '2025-12-10 03:10:28', '2025-12-11 03:11:40', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMTMtR1BDLTAwMDA0IiwiZW1wbG95ZWVOYW1lIjoiQW50b25pbyBSZXllcyBTYW50b3MiLCJ0eXBlIjoiYXR0ZW5kYW5jZSIsImlhdCI6MTc2NTM1MzI5NywiZXhwIjoxNzk2ODg5Mjk3fQ.WUdsQ8ZlRFN95mFHv4Bp0a14z2LUNPHz1j2f1JOIg3E', 'adf5d3823cf726da0fbf8edd51809f9574ad8af2f4630d3cfbde680a2e44353f', '2026-12-10 07:54:57', 1, 1),
(24, '25-GPC-00010', 'MIAH', 'SAGUN', 'CORPUZ', '', 'MIAH SAGUN CORPUZ', 'College Department', 'Assistant Librarian', '25-gpc-00010@gpc.edu', '09123456789', '2025-12-02', 'Agno', 'Female', 'Married', '2025-01-01', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$anrl4fEG3YRKrTmUw2stD.SuxG13F8bDsnDgMStvvWNp5zt6Q37/y', 'active', NULL, NULL, '2025-12-10 03:11:04', '2025-12-11 03:12:45', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDEwIiwiZW1wbG95ZWVOYW1lIjoiVEVTVCBFTVBMT1lFRSBDT0xMRUdFIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjU0MTIwNDYsImV4cCI6MTc5Njk0ODA0Nn0.0Ds1CYql2lEWw1MRvUuGw_TGP8wtEoQ_xP3v5SMzswY', '7cad1677d9cd276c9597a15ac17bfe35f6ad05f47b38577cd3918dadc8e40381', '2026-12-10 16:14:06', 1, 1),
(25, '25-GPC-20005', 'TEST QR', 'AUTO', 'GENERATION', '', 'TEST QR AUTO GENERATION', 'Administration Department', 'Clerk', 'testqrgeneration@tgpc.edu.ph', '+639123456789', '2025-12-02', 'TEST01', NULL, NULL, '2025-11-25', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$ba7GQckX42mGFv32bTZJ2.srTr60esgrgtNo4ZAT9v29u6spFFv9m', 'inactive', 'TEST', '2025-12-11 00:13:54', '2025-12-10 14:10:30', '2025-12-11 00:13:54', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTIwMDA1IiwiZW1wbG95ZWVOYW1lIjoiVEVTVCBRUiBBVVRPIEdFTkVSQVRJT04iLCJ0eXBlIjoiYXR0ZW5kYW5jZSIsImlhdCI6MTc2NTM3NTgzMCwiZXhwIjoxNzk2OTExODMwfQ.kgKGl8jAjQiJfbtioFY3SHbLaFf92PK2sms-PPajuvw', 'f93147a2e1dfcb70990e781b526e359451b1bc0a45369b7c9e1ea808998420ac', '2026-12-10 14:10:30', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `employment_history`
--

CREATE TABLE `employment_history` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(20) NOT NULL,
  `employment_period` int(11) NOT NULL DEFAULT 1,
  `date_hired` date NOT NULL,
  `date_ended` date DEFAULT NULL,
  `employment_type` varchar(50) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employment_history`
--

INSERT INTO `employment_history` (`id`, `employee_id`, `employment_period`, `date_hired`, `date_ended`, `employment_type`, `department`, `position`, `notes`, `created_at`, `updated_at`) VALUES
(1, '25-GPC-10002', 1, '1996-03-06', NULL, 'Regular', 'Administration Department', 'Clerk', NULL, '2025-12-10 02:59:03', '2025-12-10 02:59:03'),
(2, '25-GPC-20003', 1, '2001-06-12', NULL, 'Regular', 'Finance', 'Accounting Clerks (2)', NULL, '2025-12-10 03:00:46', '2025-12-10 03:00:46'),
(3, '25-GPC-20005', 1, '2025-11-25', NULL, 'Regular', 'Administration Department', 'Clerk', NULL, '2025-12-10 14:10:30', '2025-12-10 14:10:30'),
(4, '25-GPC-20003', 2, '2025-12-09', '2025-12-13', 'Regular', NULL, NULL, NULL, '2025-12-11 00:34:18', '2025-12-11 00:34:18');

-- --------------------------------------------------------

--
-- Table structure for table `generated_certificates`
--

CREATE TABLE `generated_certificates` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `employee_name` varchar(180) NOT NULL,
  `template_id` int(11) NOT NULL,
  `certificate_type` enum('active_employment','inactive_employment','service_record','clearance') NOT NULL,
  `generated_by` varchar(50) NOT NULL COMMENT 'Admin employee ID who generated it',
  `issue_date` date NOT NULL,
  `certificate_data` text NOT NULL COMMENT 'Final rendered HTML/PDF content',
  `verification_code` varchar(50) NOT NULL COMMENT 'Unique code for certificate verification',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Log of all generated certificates';

-- --------------------------------------------------------

--
-- Table structure for table `leave_balances`
--

CREATE TABLE `leave_balances` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `school_year` varchar(9) NOT NULL COMMENT 'Format: 2024-2025',
  `total_days` decimal(5,2) NOT NULL COMMENT 'Total entitlement for this year',
  `used_days` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Days already used',
  `pending_days` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Days in pending requests',
  `remaining_days` decimal(5,2) GENERATED ALWAYS AS (`total_days` - `used_days` - `pending_days`) STORED,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Leave balances per employee per year';

-- --------------------------------------------------------

--
-- Stand-in structure for view `leave_balance_summary`
-- (See below for the actual view)
--
CREATE TABLE `leave_balance_summary` (
);

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `employee_name` varchar(180) NOT NULL,
  `leave_type` enum('vacation','sick','emergency','unpaid','other') NOT NULL DEFAULT 'vacation',
  `leave_type_id` int(11) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` decimal(5,2) NOT NULL COMMENT 'Working days requested',
  `reason` text NOT NULL,
  `status` enum('pending','department_approved','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_comment` text DEFAULT NULL,
  `decided_by` varchar(255) DEFAULT NULL,
  `reviewed_by` varchar(50) DEFAULT NULL COMMENT 'Employee ID of approver',
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_notes` text DEFAULT NULL COMMENT 'Admin notes on approval/rejection',
  `appeal_reason` text DEFAULT NULL COMMENT 'Employee appeal if balance was zero',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `employee_department` varchar(255) DEFAULT NULL,
  `department_head_comment` text DEFAULT NULL,
  `department_head_approved_by` varchar(255) DEFAULT NULL,
  `department_head_approved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Leave requests submitted by employees';

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `employee_id`, `employee_name`, `leave_type`, `leave_type_id`, `start_date`, `end_date`, `total_days`, `reason`, `status`, `admin_comment`, `decided_by`, `reviewed_by`, `reviewed_at`, `review_notes`, `appeal_reason`, `created_at`, `updated_at`, `employee_department`, `department_head_comment`, `department_head_approved_by`, `department_head_approved_at`) VALUES
(6, '25-GPC-00005', 'Carlos Mendoza Torres', 'vacation', NULL, '2025-12-17', '2025-12-19', 2.00, 'TESTEE', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-10 15:59:01', '2025-12-10 15:59:01', 'Marketing', NULL, NULL, NULL),
(7, '25-GPC-00010', 'TEST EMPLOYEE COLLEGE', 'vacation', NULL, '2025-12-10', '2025-12-26', 16.00, 'test leave collage department', 'rejected', 'test reject days over 10 dayas', 'System Administrator', NULL, NULL, NULL, NULL, '2025-12-11 01:18:12', '2025-12-11 01:19:39', 'College Department', NULL, 'Rosa Garcia Fernandez', '2025-12-11 09:18:39'),
(10, '25-GPC-00010', 'MIAH SAGUN CORPUZ', 'vacation', NULL, '2025-12-13', '2025-12-15', 2.00, 'test file leave request from calendar 3 days', 'approved', 'test approve', 'System Administrator', NULL, NULL, NULL, NULL, '2025-12-11 01:46:15', '2025-12-11 01:47:37', 'College Department', 'test calendar file request from employee', 'Rosa Garcia Fernandez', '2025-12-11 09:47:13'),
(11, '15-GPC-00001', 'Maria Santos Lopez', 'sick', NULL, '2025-12-10', '2025-12-16', 6.00, 'test pending leave request in ccalendar', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 02:51:10', '2025-12-11 02:51:10', 'Elementary Department', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` int(11) NOT NULL,
  `type_name` varchar(100) NOT NULL COMMENT 'e.g., Sick Leave, Vacation Leave',
  `type_code` varchar(20) NOT NULL COMMENT 'Short code: SL, VL, etc.',
  `days_per_year` decimal(5,2) NOT NULL DEFAULT 15.00 COMMENT 'Default annual entitlement',
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Types of leave available in the system';

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `type_name`, `type_code`, `days_per_year`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Sick Leave', 'SL', 15.00, 'Leave for medical reasons or illness', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(2, 'Vacation Leave', 'VL', 15.00, 'Personal time off for vacation or rest', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(3, 'Emergency Leave', 'EL', 5.00, 'Leave for urgent family or personal emergencies', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(4, 'Maternity Leave', 'ML', 105.00, 'Leave for childbirth and maternity care (RA 11210)', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(5, 'Paternity Leave', 'PL', 7.00, 'Leave for fathers for childbirth support', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(6, 'Special Privilege Leave', 'SPL', 3.00, 'Leave for women undergoing surgery (RA 9710)', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(7, 'Solo Parent Leave', 'SOLO', 7.00, 'Additional leave for solo parents (RA 8972)', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(8, 'Study Leave', 'STL', 0.00, 'Leave for pursuing further education (case-by-case)', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(9, 'Calamity Leave', 'CL', 0.00, 'Leave during natural disasters or calamities', 1, '2025-12-05 10:14:05', '2025-12-05 10:14:05'),
(10, 'Bereavement Leave', 'BL', 3.00, 'Leave due to death of immediate family member', 1, '2025-12-05 10:43:03', '2025-12-05 10:43:03'),
(11, 'VAWC Leave', 'VAWC', 10.00, 'Leave for victims of violence', 1, '2025-12-05 10:43:03', '2025-12-05 10:43:03');

-- --------------------------------------------------------

--
-- Table structure for table `loyalty_awards`
--

CREATE TABLE `loyalty_awards` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(20) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `years_of_service` int(11) NOT NULL,
  `award_year` int(11) NOT NULL,
  `award_date` varchar(10) DEFAULT NULL,
  `certificate_number` varchar(50) NOT NULL,
  `status` enum('pending','approved','printed') DEFAULT 'pending',
  `generated_by` varchar(255) NOT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `approved_by` varchar(255) DEFAULT NULL,
  `approved_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loyalty_awards`
--

INSERT INTO `loyalty_awards` (`id`, `employee_id`, `employee_name`, `department`, `position`, `years_of_service`, `award_year`, `award_date`, `certificate_number`, `status`, `generated_by`, `generated_at`, `approved_by`, `approved_at`, `created_at`, `updated_at`) VALUES
(1, '12-GPC-00002', 'Juan Dela Cruz', 'Elementary Department', 'Principal', 17, 2025, '2025-12-10', 'CERT-2025-12-GPC-00002-1765374142657', 'printed', 'System Administrator', '2025-12-10 13:42:22', NULL, '2025-12-10 13:42:22', '2025-12-10 13:42:22', '2025-12-10 13:44:31'),
(2, '14-GPC-00003', 'Rosa Garcia Fernandez', 'College Department', 'Dean', 20, 2025, '2025-12-10', 'CERT-2025-14-GPC-00003-1765374319910', 'pending', 'System Administrator', '2025-12-10 13:45:19', NULL, '2025-12-10 13:45:19', '2025-12-10 13:45:19', '2025-12-10 13:45:19'),
(3, '15-GPC-00001', 'Maria Santos Lopez', 'Elementary Department', 'Elementary Faculty Member', 10, 2025, '2025-12-11', 'CERT-2025-15-GPC-00001-1765424317920', 'pending', 'System Administrator', '2025-12-11 03:38:37', NULL, '2025-12-11 03:38:37', '2025-12-11 03:38:37', '2025-12-11 03:38:37');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'event',
  `related_id` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `description`, `type`, `related_id`, `is_read`, `created_at`) VALUES
(1, 'december 11', 'december 11', 'event', '2', 0, '2025-12-10 15:27:12'),
(2, 'ddec12', 'Event scheduled for 12/12/2025', 'event', '5', 0, '2025-12-10 15:38:12');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profile_update_history`
--

CREATE TABLE `profile_update_history` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `field_name` varchar(100) NOT NULL COMMENT 'Field that was updated',
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `updated_by` varchar(50) NOT NULL COMMENT 'Who made the update (employee_id or admin)',
  `update_source` enum('employee_self','admin','system') NOT NULL DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Track all profile updates for audit purposes';

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'siteTitle', 'HRMS – The Great Plebeian College', '2025-12-05 09:24:57', '2025-12-10 02:46:46'),
(2, 'description', 'A web-based Human Resource Management System of The Great Plebeian College.', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(3, 'copyright', '', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(4, 'contactNumber', '+63 9837562539', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(5, 'systemEmail', 'system@gmail.com', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(6, 'address', 'Gen. Montemayor St. Alaminos City Pangasinan', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(7, 'logoUrl', NULL, '2025-12-05 09:24:57', '2025-12-05 09:24:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(120) NOT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `full_name` varchar(120) NOT NULL,
  `role` enum('admin','employee','guard') NOT NULL DEFAULT 'employee',
  `password_hash` varchar(255) NOT NULL,
  `password_reset_required` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `employee_id`, `full_name`, `role`, `password_hash`, `password_reset_required`, `created_at`) VALUES
(1, 'admin', 'admin@greatplebeian.edu', '25-GPC-ADM01', 'System Administrator', 'admin', '$2a$10$vjsWvYVkc.yUpXXWKw6UWOzPv1HTu4bwRbeCDs3T5VD578uMhHF0a', 0, '2025-12-05 09:24:57'),
(6, '25-GPC-GRD01', 'guard01@school.edu', '25-GPC-GRD01', 'Security Guard', 'guard', '$2a$10$yx4HlXvx7tB.XMSZa9HyJOxMyu29QVWoLgpdAqYE7WsNxCKDnqj.m', 0, '2025-12-05 10:58:03'),
(7, 'juan.delacruz', 'juan.delacruz@gpc.edu', '25-GPC-00001', 'Juan Santos Dela Cruz', 'employee', '$2a$10$GKEI9G.81PgKlqDunekROu5BB602B5/RSGb4moGyeSv7edIykz5Na', 0, '2025-12-05 11:51:11'),
(8, 'maria.santos', 'maria.santos@gpc.edu', '25-GPC-00002', 'Maria Garcia Santos', 'employee', '$2a$10$GKEI9G.81PgKlqDunekROu5BB602B5/RSGb4moGyeSv7edIykz5Na', 0, '2025-12-05 11:51:11'),
(9, 'pedro.gonzales', 'pedro.gonzales@gpc.edu', '25-GPC-00003', 'Pedro Reyes Gonzales Jr.', 'employee', '$2a$10$GKEI9G.81PgKlqDunekROu5BB602B5/RSGb4moGyeSv7edIykz5Na', 0, '2025-12-05 11:51:11'),
(10, 'ana.ramos', 'anatestramos@tgpc.edu', '25-GPC-00004', 'ANA TEST Lopez Ramos', 'admin', '$2a$10$s0Z8oZoTdJTa4OUR85aa0u808rX.fGWIpUtsS4vy38huLBk6Husyq', 0, '2025-12-05 11:51:11'),
(11, 'carlos.torres', '25-GPC-00005@gpc.edu', '25-GPC-00005', 'Carlos Mendoza Torres', 'employee', '$2a$10$Epj9M3uINUM9eFG0vPAyneUh37OIV7XloeIuSiIffq.kGbM8tOykm', 0, '2025-12-05 11:51:11'),
(12, '25-GPC-12039', 'test01@gmail.com', '25-GPC-12039', 'TEST01 TEST01 TEST01', 'employee', '$2a$10$Vra3/2y2XuWNqoYOUuRmxOAVWyUM1jHrsNqoMY14LvMpz78RR6.re', 0, '2025-12-07 07:09:35'),
(15, 'employee', 'employee@greatplebeian.edu', 'EMP001', 'John Doe', 'employee', 'emp123', 0, '2025-12-10 02:46:46'),
(16, '25-GPC-10002', 'test02test02@tgpc.edu.ph', '25-GPC-10002', 'TEST02 TEST02 TEST02', 'employee', '$2a$10$xl84jJBRWUySmP5c6n9CBu2GM5JOaEl15OSwsnzfkrtU4JZgBxXXq', 0, '2025-12-10 02:59:03'),
(17, '25-GPC-20003', 'test03test01@tgpc.edu.ph', '25-GPC-20003', 'TEST03 TEST01 TEST01', 'employee', '$2a$10$fw3PaJQArOoHEftTDzt.iudqPDCjxWrX6rAlVGNCnEKX8dmi3XYoS', 0, '2025-12-10 03:00:46'),
(18, '25-GPC-20005', 'testqrgeneration@tgpc.edu.ph', '25-GPC-20005', 'TEST QR AUTO GENERATION', 'employee', '$2a$10$YHFytLdaSbZUlBOrTQGDPeStybK6UM.J8WTuPHU9obRXFfeEyoEO.', 0, '2025-12-10 14:10:30'),
(19, '12-gpc-00002', '12-GPC-00002@gpc.edu', '12-GPC-00002', 'Juan Dela Cruz', 'admin', '$2a$10$ABTGr/lTVW0n/E94/Xv1SOpwdUL4FrJi.XqxCmf9B052p5ALEmbRi', 0, '2025-12-11 00:29:28'),
(20, '14-gpc-00003', '14-gpc-00003@gpc.edu', '14-GPC-00003', 'Rosa Garcia Fernandez', 'admin', '$2a$10$jromiZTQul.6DzYpEcZyA.Hw.TfzQ.GDc/r1BXJFuWwBDR8MJpcfG', 0, '2025-12-11 00:29:29'),
(23, '25-GPC-00010', '25-gpc-00010@gpc.edu', '25-GPC-00010', 'MIAH SAGUN CORPUZ', 'employee', '$2a$10$anrl4fEG3YRKrTmUw2stD.SuxG13F8bDsnDgMStvvWNp5zt6Q37/y', 0, '2025-12-11 01:16:49'),
(30, '15-GPC-00001', '15-gpc-00001@gpc.edu', '15-GPC-00001', 'Maria Santos Lopez', 'employee', '$2a$10$ARrSCdp.eKy4aVUgd8QYO.r6sXDp9Y/4CSzkuCgLbX6HPQ5GinXMK', 0, '2025-12-11 02:01:21');

-- --------------------------------------------------------

--
-- Structure for view `attendance_summary`
--
DROP TABLE IF EXISTS `attendance_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `attendance_summary`  AS SELECT `e`.`employee_id` AS `employee_id`, `e`.`full_name` AS `full_name`, `e`.`department` AS `department`, count(case when `a`.`status` = 'present' then 1 end) AS `total_present`, count(case when `a`.`status` = 'absent' then 1 end) AS `total_absent`, count(case when `a`.`status` = 'late' then 1 end) AS `total_late`, count(case when `a`.`status` = 'half-day' then 1 end) AS `total_halfday`, count(case when `a`.`status` = 'leave' then 1 end) AS `total_leave`, sum(coalesce(`a`.`late_minutes`,0)) AS `total_late_minutes`, sum(coalesce(`a`.`undertime_minutes`,0)) AS `total_undertime_minutes`, sum(coalesce(`a`.`overtime_minutes`,0)) AS `total_overtime_minutes`, year(`a`.`date`) AS `year`, month(`a`.`date`) AS `month` FROM (`employees` `e` left join `attendance` `a` on(`e`.`employee_id` = `a`.`employee_id`)) GROUP BY `e`.`employee_id`, `e`.`full_name`, `e`.`department`, year(`a`.`date`), month(`a`.`date`) ;

-- --------------------------------------------------------

--
-- Structure for view `leave_balance_summary`
--
DROP TABLE IF EXISTS `leave_balance_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `leave_balance_summary`  AS SELECT `e`.`employee_id` AS `employee_id`, `e`.`full_name` AS `full_name`, `e`.`department` AS `department`, `lt`.`name` AS `leave_type`, `lt`.`code` AS `leave_code`, `lb`.`school_year` AS `school_year`, `lb`.`total_days` AS `total_days`, `lb`.`used_days` AS `used_days`, `lb`.`pending_days` AS `pending_days`, `lb`.`remaining_days` AS `remaining_days` FROM ((`employees` `e` left join `leave_balances` `lb` on(`e`.`employee_id` = `lb`.`employee_id`)) left join `leave_types` `lt` on(`lb`.`leave_type_id` = `lt`.`id`)) WHERE `e`.`status` = 'active' ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_action_type` (`action_type`),
  ADD KEY `idx_resource_type` (`resource_type`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_date` (`employee_id`,`date`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_employee_date` (`employee_id`,`date`);

--
-- Indexes for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_date` (`event_date`);

--
-- Indexes for table `certificate_templates`
--
ALTER TABLE `certificate_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_type_active` (`type`,`is_active`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_designation_per_dept` (`name`,`department_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`);

--
-- Indexes for table `employment_history`
--
ALTER TABLE `employment_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employment_period` (`employee_id`,`employment_period`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `idx_dates` (`date_hired`,`date_ended`);

--
-- Indexes for table `generated_certificates`
--
ALTER TABLE `generated_certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `verification_code` (`verification_code`),
  ADD KEY `template_id` (`template_id`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_verification` (`verification_code`);

--
-- Indexes for table `leave_balances`
--
ALTER TABLE `leave_balances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_leave_year` (`employee_id`,`leave_type_id`,`school_year`),
  ADD KEY `leave_type_id` (`leave_type_id`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leave_type_id` (`leave_type_id`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_dates` (`start_date`,`end_date`),
  ADD KEY `idx_employee_department` (`employee_department`),
  ADD KEY `idx_status_new` (`status`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`type_name`),
  ADD UNIQUE KEY `code` (`type_code`);

--
-- Indexes for table `loyalty_awards`
--
ALTER TABLE `loyalty_awards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificate_number` (`certificate_number`),
  ADD UNIQUE KEY `unique_award` (`employee_id`,`award_year`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_read` (`is_read`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `idx_token_hash` (`token_hash`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indexes for table `profile_update_history`
--
ALTER TABLE `profile_update_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_field` (`field_name`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=473;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `certificate_templates`
--
ALTER TABLE `certificate_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=468;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `employment_history`
--
ALTER TABLE `employment_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `generated_certificates`
--
ALTER TABLE `generated_certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_balances`
--
ALTER TABLE `leave_balances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `loyalty_awards`
--
ALTER TABLE `loyalty_awards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile_update_history`
--
ALTER TABLE `profile_update_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `designations`
--
ALTER TABLE `designations`
  ADD CONSTRAINT `designations_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `designations_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `designations_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employment_history`
--
ALTER TABLE `employment_history`
  ADD CONSTRAINT `employment_history_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `generated_certificates`
--
ALTER TABLE `generated_certificates`
  ADD CONSTRAINT `generated_certificates_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `generated_certificates_ibfk_2` FOREIGN KEY (`template_id`) REFERENCES `certificate_templates` (`id`);

--
-- Constraints for table `leave_balances`
--
ALTER TABLE `leave_balances`
  ADD CONSTRAINT `leave_balances_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leave_balances_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`);

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`);

--
-- Constraints for table `loyalty_awards`
--
ALTER TABLE `loyalty_awards`
  ADD CONSTRAINT `loyalty_awards_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profile_update_history`
--
ALTER TABLE `profile_update_history`
  ADD CONSTRAINT `profile_update_history_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
