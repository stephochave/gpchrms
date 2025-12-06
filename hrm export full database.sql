-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2025 at 08:01 AM
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
-- Database: `hrm`
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
(72, NULL, 'System Administrator', 'CREATE', 'Document', '1', 'pds_25-GPC-ADM01', 'Document \"pds_25-GPC-ADM01\" was uploaded for employee 25-GPC-ADM01', '::1', 'success', '{\"type\":\"employee-doc\",\"category\":null,\"fileSize\":27809}', '2025-12-06 06:47:35');

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
  `check_in_image` text DEFAULT NULL,
  `check_out_image` text DEFAULT NULL,
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

INSERT INTO `attendance` (`id`, `employee_id`, `employee_name`, `date`, `check_in`, `check_out`, `status`, `notes`, `check_in_image`, `check_out_image`, `created_at`, `updated_at`, `qr_verified`, `verification_method`, `late_minutes`, `undertime_minutes`, `overtime_minutes`) VALUES
(1, 'EMP001', 'John A. Doe Jr.', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', NULL, NULL, '2025-12-05 09:31:23', '2025-12-05 09:31:23', 0, 'manual', 0, 0, 0),
(2, 'EMP002', 'Jane B. Smith', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', NULL, NULL, '2025-12-05 09:31:23', '2025-12-05 09:31:23', 0, 'manual', 0, 0, 0),
(3, 'EMP003', 'Mike C. Johnson', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', NULL, NULL, '2025-12-05 09:31:23', '2025-12-05 09:31:23', 0, 'manual', 0, 0, 0),
(4, '25-GPC-00005', 'Carlos Mendoza Torres', '2025-12-05', '22:40:00', NULL, 'present', 'Scanned by guard', NULL, NULL, '2025-12-05 13:31:07', '2025-12-05 14:40:03', 1, 'guard_qr', NULL, NULL, NULL),
(5, '25-GPC-00001', 'Juan Santos Dela Cruz', '2025-12-05', '21:32:00', NULL, 'present', 'Scanned by guard', NULL, NULL, '2025-12-05 13:32:11', '2025-12-05 13:32:11', 1, 'guard_qr', NULL, NULL, NULL),
(6, '25-GPC-00002', 'Maria Garcia Santos', '2025-12-05', '22:38:00', NULL, 'present', 'Scanned by guard', NULL, NULL, '2025-12-05 14:16:36', '2025-12-05 14:38:50', 1, 'guard_qr', NULL, NULL, NULL),
(15, '25-GPC-GRD01', 'Security Guard', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', NULL, NULL, '2025-12-05 14:33:35', '2025-12-05 14:33:35', 0, 'manual', 0, 0, 0),
(16, '25-GPC-00003', 'Pedro Reyes Gonzales Jr.', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', NULL, NULL, '2025-12-05 14:33:35', '2025-12-05 14:33:35', 0, 'manual', 0, 0, 0),
(17, '25-GPC-00004', 'Ana Lopez Ramos', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', NULL, NULL, '2025-12-05 14:33:35', '2025-12-05 14:33:35', 0, 'manual', 0, 0, 0),
(18, '25-GPC-ADM01', 'System Administrator', '2025-12-05', NULL, NULL, 'absent', 'Auto-marked absent (no attendance recorded by 4:00 PM)', NULL, NULL, '2025-12-05 14:33:35', '2025-12-05 14:33:35', 0, 'manual', 0, 0, 0),
(21, '25-GPC-00005', 'Carlos Mendoza Torres', '2025-12-06', '10:13:00', NULL, 'present', 'Scanned by guard', NULL, NULL, '2025-12-06 02:13:37', '2025-12-06 02:13:37', 1, 'guard_qr', NULL, NULL, NULL),
(22, '25-GPC-00001', 'Juan Santos Dela Cruz', '2025-12-06', '10:29:00', NULL, 'present', 'Scanned by guard', NULL, NULL, '2025-12-06 02:29:09', '2025-12-06 02:29:09', 1, 'guard_qr', NULL, NULL, NULL);

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
(17, 'Marketing', '2025-12-05 11:49:38', '2025-12-05 11:49:38');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Chairman of the Board', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(2, 'Vice Chairman', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(3, 'Members of the Board of Directors', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(4, 'Legal Counsel Corporate Secretary', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(5, 'External Auditor', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(6, 'School President', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(7, 'Board Secretary', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(8, 'Vice President for Administration', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(9, 'Human Resource Head', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(10, 'Admin officer', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(11, 'Records Officer', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(12, 'Clerk', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(13, 'Nurse', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(14, 'IT Coordinator', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(15, 'Property Custodian', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(16, 'Supply Officer', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(17, 'Maintenance (3 securities, 5 utilities)', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(18, 'Vice President for Finance', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(19, 'Treasurer', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(20, 'Accountant', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(21, 'Internal Auditor', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(22, 'Cashier', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(23, 'Assistant Cashier', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(24, 'Bookkeeper', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(25, 'Accounting Clerks (2)', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(26, 'Vice President for Academic Affairs', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(27, 'Elementary Principal', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(28, 'Elementary Registrar', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(29, 'Guidance Counselor', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(30, 'Librarian in charge', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(31, 'Elementary Faculty Member', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(32, 'High School Principal', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(33, 'High School Registrar', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(34, 'Encoder', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(35, 'Senior High School Coordinator', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(36, 'Junior High School Coordinator', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(37, 'TechVoc Coordinator', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(38, 'Program Coordinator', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(39, 'Housekeeping Trainer', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(40, 'Cookery Trainer', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(41, 'FBS Trainer', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(42, 'EIM Trainer', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(43, 'High School Faculty Member', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(44, 'Dean of College of Teacher Education', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(45, 'Dean of College of Business Education', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(46, 'School Librarian', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(47, 'Assistant Librarian', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(48, 'Research and Development Coordinator', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(49, 'Alumni Affairs Coordinator', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(50, 'NSTP Coordinator', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(51, 'MIS Coordinator', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(52, 'College Guidance Counselor', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(53, 'Student Affairs Head', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(54, 'Faculty Member', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
(109, 'Software Developer', '2025-12-05 11:50:06', '2025-12-05 11:50:06'),
(110, 'HR Manager', '2025-12-05 11:50:06', '2025-12-05 11:50:06'),
(111, 'Senior Engineer', '2025-12-05 11:50:06', '2025-12-05 11:50:06'),
(112, 'Marketing Specialist', '2025-12-05 11:50:06', '2025-12-05 11:50:06');

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

INSERT INTO `documents` (`id`, `name`, `type`, `category`, `file_path`, `file_url`, `file_size`, `employee_id`, `document_type`, `uploaded_by`, `description`, `created_at`, `updated_at`) VALUES
(1, 'pds_25-GPC-ADM01', 'employee-doc', NULL, 'C:\\Users\\lapla\\OneDrive\\Desktop\\HRMSYSTEM\\gpchrms\\server\\src\\uploads\\88a07e599ea1c15e753a34b669b346cb', '/uploads/88a07e599ea1c15e753a34b669b346cb', 27809, '25-GPC-ADM01', 'pds', 'System Administrator', NULL, '2025-12-06 06:47:35', '2025-12-06 06:47:35');

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
  `qr_code_generated_at` timestamp NULL DEFAULT NULL COMMENT 'When QR code was last generated'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_id`, `first_name`, `middle_name`, `last_name`, `suffix_name`, `full_name`, `department`, `position`, `email`, `phone`, `date_of_birth`, `address`, `gender`, `civil_status`, `date_hired`, `date_of_leaving`, `employment_type`, `role`, `sss_number`, `pagibig_number`, `tin_number`, `emergency_contact`, `educational_background`, `signature_file`, `pds_file`, `service_record_file`, `file_201`, `password_hash`, `status`, `archived_reason`, `archived_at`, `created_at`, `updated_at`, `qr_code_data`, `qr_code_secret`, `qr_code_generated_at`) VALUES
(1, 'EMP001', 'John', 'A.', 'Doe', 'Jr.', 'John A. Doe Jr.', 'IT Department', 'Software Developer', 'john.doe@company.com', '+1234567890', '1990-05-15', '123 Main St, City, State 12345', NULL, NULL, '2020-01-15', NULL, 'Regular', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 09:24:57', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiRU1QMDAxIiwiZW1wbG95ZWVOYW1lIjoiSm9obiBBLiBEb2UgSnIuIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjQ5NDEwMDIsImV4cCI6MTc5NjQ3NzAwMn0.Adzhs4Mev_jHyNYIEPfFktlKqpogrZMO-AaTOhrDmYI', '2c53ed5f3d7a19b3e0060dcc31d0610ff78972e86c237469a4a26ebbca389c42', '2025-12-05 13:23:22'),
(2, 'EMP002', 'Jane', 'B.', 'Smith', '', 'Jane B. Smith', 'HR Department', 'HR Manager', 'jane.smith@company.com', '+1234567891', '1988-08-22', '456 Oak Ave, City, State 12345', NULL, NULL, '2019-03-10', NULL, 'Regular', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 09:24:57', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiRU1QMDAyIiwiZW1wbG95ZWVOYW1lIjoiSmFuZSBCLiBTbWl0aCIsInR5cGUiOiJhdHRlbmRhbmNlIiwiaWF0IjoxNzY0OTQxMDAyLCJleHAiOjE3OTY0NzcwMDJ9.Gh1SA5Y2BW5elhp3_TDtyhNrwqg7AStTg23nr4y4u3k', '40ba13d39121b4e8f2be82f8a9501e5b69f1f7fcec5c07bb96a9ec74f425521a', '2025-12-05 13:23:22'),
(3, 'EMP003', 'Mike', 'C.', 'Johnson', '', 'Mike C. Johnson', 'Finance', 'Accountant', 'mike.johnson@company.com', '+1234567892', '1992-12-05', '789 Pine Rd, City, State 12345', NULL, NULL, '2021-06-20', NULL, 'Regular', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 09:24:57', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiRU1QMDAzIiwiZW1wbG95ZWVOYW1lIjoiTWlrZSBDLiBKb2huc29uIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjQ5NDEwMDIsImV4cCI6MTc5NjQ3NzAwMn0.HXV-FkLUP-kvO2QTFZNgGFN4If08oFTZqugfZHwtkDk', '0685cf3478f4964505a226b3c80c46f049fbb625ccb918b9fe6e34f5d534d5cc', '2025-12-05 13:23:22'),
(7, '25-GPC-GRD01', 'Security Guard', '', '', '', 'Security Guard', 'Security', 'Security Guard', 'guard01@school.edu', '09123456789', NULL, NULL, NULL, NULL, '2025-12-05', NULL, 'Regular', 'guard', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 10:58:03', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLUdSRDAxIiwiZW1wbG95ZWVOYW1lIjoiU2VjdXJpdHkgR3VhcmQiLCJ0eXBlIjoiYXR0ZW5kYW5jZSIsImlhdCI6MTc2NDk0MTAwMiwiZXhwIjoxNzk2NDc3MDAyfQ.aZrqpV-gZRuD90LiyhkzXhviHJE8rEFM6ziBODxpAkw', '81f05b446eaf947fd674ae3e0f57dc7c46282e4e6e38c0f19980b24417d0540a', '2025-12-05 13:23:22'),
(8, '25-GPC-00001', 'Juan', 'Santos', 'Dela Cruz', '', 'Juan Santos Dela Cruz', 'Information Technology', 'Software Developer', 'juan.delacruz@gpc.edu', '09171234567', '1995-05-15', '123 Main St, Manila', 'Male', 'Single', '2023-01-15', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDAxIiwiZW1wbG95ZWVOYW1lIjoiSnVhbiBTYW50b3MgRGVsYSBDcnV6IiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjQ5NDEwMDIsImV4cCI6MTc5NjQ3NzAwMn0.b5MIvlRu0soh_5mfzIdTxELn_0PoifVgI1QIuYTyWw8', '0b8115927daf5ddd7060d7cb8666a6fc2e395bcb1294ca11b14fc50af2886e30', '2025-12-05 13:23:22'),
(9, '25-GPC-00002', 'Maria', 'Garcia', 'Santos', '', 'Maria Garcia Santos', 'Human Resources', 'HR Manager', 'maria.santos@gpc.edu', '09181234567', '1990-08-20', '456 Secondary Ave, Quezon City', 'Female', 'Married', '2022-06-01', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDAyIiwiZW1wbG95ZWVOYW1lIjoiTWFyaWEgR2FyY2lhIFNhbnRvcyIsInR5cGUiOiJhdHRlbmRhbmNlIiwiaWF0IjoxNzY0OTQxMDAyLCJleHAiOjE3OTY0NzcwMDJ9.wVDZ9rJ8IAv4KAaStJMCn2fomDtNFM_TyrDZdDairqM', '8392f0e76519befd76251a4e6da6468c0acef1caa335ab012f1f27cbd0202250', '2025-12-05 13:23:22'),
(10, '25-GPC-00003', 'Pedro', 'Reyes', 'Gonzales', 'Jr.', 'Pedro Reyes Gonzales Jr.', 'Finance', 'Accountant', 'pedro.gonzales@gpc.edu', '09191234567', '1988-12-10', '789 Tertiary Rd, Makati', 'Male', 'Married', '2021-03-10', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDAzIiwiZW1wbG95ZWVOYW1lIjoiUGVkcm8gUmV5ZXMgR29uemFsZXMgSnIuIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjQ5NDEwMDIsImV4cCI6MTc5NjQ3NzAwMn0.IF4ZgFJEUEfIRI8F17XJQsu44SIGk7OSH9Ews2UUd0A', 'c59ec7cf12acec812d760af2ff4b782f0502000b522d7b8d48e49e0cc5e5cb9f', '2025-12-05 13:23:22'),
(11, '25-GPC-00004', 'Ana', 'Lopez', 'Ramos', '', 'Ana Lopez Ramos', 'Engineering', 'Senior Engineer', 'ana.ramos@gpc.edu', '09201234567', '1992-03-25', '321 Engineering St, Taguig', 'Female', 'Single', '2020-09-15', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDA0IiwiZW1wbG95ZWVOYW1lIjoiQW5hIExvcGV6IFJhbW9zIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjQ5NDEwMDIsImV4cCI6MTc5NjQ3NzAwMn0.qc6pkgtmwAwLJU5TANJ8rUI5EkRPXoI7ycTLyjvEi74', '1ef98d0be1badb92c648cb3dac0f320bd40b9ce9e392c71cb365990296e007cb', '2025-12-05 13:23:22'),
(12, '25-GPC-00005', 'Carlos', 'Mendoza', 'Torres', '', 'Carlos Mendoza Torres', 'Marketing', 'Marketing Specialist', 'carlos.torres@gpc.edu', '09211234567', '1998-07-08', '654 Marketing Blvd, Pasig', 'Male', 'Single', '2024-01-20', NULL, 'Regular', 'employee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL, '2025-12-05 11:50:21', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLTAwMDA1IiwiZW1wbG95ZWVOYW1lIjoiQ2FybG9zIE1lbmRvemEgVG9ycmVzIiwidHlwZSI6ImF0dGVuZGFuY2UiLCJpYXQiOjE3NjQ5NDEwMDIsImV4cCI6MTc5NjQ3NzAwMn0.rpCGOZRtly6NXlIah3nPBs8fdPcFIaFneDxKpX1HBgM', 'ae74dc6768c7583695704b31d05423f54c2e3a0cdc28b6a8138fe4641d4afc62', '2025-12-05 13:23:22'),
(13, '25-GPC-ADM01', 'System', 'N/A', 'Administrator', '', 'System Administrator', 'Administration', 'System Administrator', 'admin@greatplebeian.edu', '09123456789', NULL, NULL, NULL, NULL, '2025-01-01', NULL, 'Regular', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2a$10$vjsWvYVkc.yUpXXWKw6UWOzPv1HTu4bwRbeCDs3T5VD578uMhHF0a', 'active', NULL, NULL, '2025-12-05 12:16:17', '2025-12-05 13:23:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiMjUtR1BDLUFETTAxIiwiZW1wbG95ZWVOYW1lIjoiU3lzdGVtIEFkbWluaXN0cmF0b3IiLCJ0eXBlIjoiYXR0ZW5kYW5jZSIsImlhdCI6MTc2NDk0MTAwMiwiZXhwIjoxNzk2NDc3MDAyfQ.3gXeqjAidnf_hsElVVvvA7rh37TSFp_SdLj5OWXqtz4', 'fad6ade8755f18663e5e4b356bf17d7d5549f586d0c4c24729547ef2b0026b65', '2025-12-05 13:23:22');

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
`employee_id` varchar(50)
,`full_name` varchar(180)
,`department` varchar(120)
,`leave_type` varchar(100)
,`leave_code` varchar(20)
,`school_year` varchar(9)
,`total_days` decimal(5,2)
,`used_days` decimal(5,2)
,`pending_days` decimal(5,2)
,`remaining_days` decimal(5,2)
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
  `leave_type_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` decimal(5,2) NOT NULL COMMENT 'Working days requested',
  `reason` text NOT NULL,
  `status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `admin_comment` text DEFAULT NULL,
  `decided_by` varchar(255) DEFAULT NULL,
  `reviewed_by` varchar(50) DEFAULT NULL COMMENT 'Employee ID of approver',
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_notes` text DEFAULT NULL COMMENT 'Admin notes on approval/rejection',
  `appeal_reason` text DEFAULT NULL COMMENT 'Employee appeal if balance was zero',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Leave requests submitted by employees';

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'e.g., Sick Leave, Vacation Leave',
  `code` varchar(20) NOT NULL COMMENT 'Short code: SL, VL, etc.',
  `days_per_year` decimal(5,2) NOT NULL DEFAULT 15.00 COMMENT 'Default annual entitlement',
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Types of leave available in the system';

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `name`, `code`, `days_per_year`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
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
(1, 'siteTitle', 'HRMS ÔÇô The Great Plebeian College', '2025-12-05 09:24:57', '2025-12-05 09:24:57'),
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
(10, 'ana.ramos', 'ana.ramos@gpc.edu', '25-GPC-00004', 'Ana Lopez Ramos', 'employee', '$2a$10$GKEI9G.81PgKlqDunekROu5BB602B5/RSGb4moGyeSv7edIykz5Na', 0, '2025-12-05 11:51:11'),
(11, 'carlos.torres', 'carlos.torres@gpc.edu', '25-GPC-00005', 'Carlos Mendoza Torres', 'employee', '$2a$10$GKEI9G.81PgKlqDunekROu5BB602B5/RSGb4moGyeSv7edIykz5Na', 0, '2025-12-05 11:51:11');

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
  ADD UNIQUE KEY `name` (`name`);

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
  ADD KEY `idx_dates` (`start_date`,`end_date`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certificate_templates`
--
ALTER TABLE `certificate_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

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
