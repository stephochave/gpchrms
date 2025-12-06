-- SAFE MIGRATION SCRIPT - QR CODE SYSTEM & ENHANCEMENTS
-- This script checks for existing columns before adding them
-- Run this if the previous migration failed with duplicate column errors

USE hrm;

-- Start transaction
START TRANSACTION;

-- ============================================
-- 1. ADD QR CODE FIELDS TO EMPLOYEES TABLE (SAFE)
-- ============================================

-- Check and add qr_code_data
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'employees' 
  AND COLUMN_NAME = 'qr_code_data';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE employees ADD COLUMN qr_code_data TEXT NULL AFTER status',
  'SELECT "Column qr_code_data already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add qr_code_secret
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'employees' 
  AND COLUMN_NAME = 'qr_code_secret';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE employees ADD COLUMN qr_code_secret VARCHAR(255) NULL AFTER qr_code_data',
  'SELECT "Column qr_code_secret already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add qr_code_generated_at
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'employees' 
  AND COLUMN_NAME = 'qr_code_generated_at';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE employees ADD COLUMN qr_code_generated_at DATETIME NULL AFTER qr_code_secret',
  'SELECT "Column qr_code_generated_at already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 2. REMOVE FACE RECOGNITION COLUMNS (SAFE)
-- ============================================

-- Check and drop registered_face_file
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'employees' 
  AND COLUMN_NAME = 'registered_face_file';

SET @query = IF(@col_exists > 0, 
  'ALTER TABLE employees DROP COLUMN registered_face_file',
  'SELECT "Column registered_face_file does not exist" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 3. UPDATE ATTENDANCE TABLE (SAFE)
-- ============================================

-- Check and add qr_verified
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'attendance' 
  AND COLUMN_NAME = 'qr_verified';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE attendance ADD COLUMN qr_verified BOOLEAN DEFAULT FALSE AFTER status',
  'SELECT "Column qr_verified already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add verification_method
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'attendance' 
  AND COLUMN_NAME = 'verification_method';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE attendance ADD COLUMN verification_method ENUM(''qr'', ''manual'', ''guard_qr'') DEFAULT ''manual'' AFTER qr_verified',
  'SELECT "Column verification_method already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add late_minutes
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'attendance' 
  AND COLUMN_NAME = 'late_minutes';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE attendance ADD COLUMN late_minutes INT DEFAULT 0 AFTER verification_method',
  'SELECT "Column late_minutes already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add undertime_minutes
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'attendance' 
  AND COLUMN_NAME = 'undertime_minutes';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE attendance ADD COLUMN undertime_minutes INT DEFAULT 0 AFTER late_minutes',
  'SELECT "Column undertime_minutes already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add overtime_minutes
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'attendance' 
  AND COLUMN_NAME = 'overtime_minutes';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE attendance ADD COLUMN overtime_minutes INT DEFAULT 0 AFTER undertime_minutes',
  'SELECT "Column overtime_minutes already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and drop check_in_image
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'attendance' 
  AND COLUMN_NAME = 'check_in_image';

SET @query = IF(@col_exists > 0, 
  'ALTER TABLE attendance DROP COLUMN check_in_image',
  'SELECT "Column check_in_image does not exist" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and drop check_out_image
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'attendance' 
  AND COLUMN_NAME = 'check_out_image';

SET @query = IF(@col_exists > 0, 
  'ALTER TABLE attendance DROP COLUMN check_out_image',
  'SELECT "Column check_out_image does not exist" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 4. UPDATE USERS TABLE FOR GUARD ROLE (SAFE)
-- ============================================

-- Check if 'guard' role already exists in ENUM
SET @enum_values = '';
SELECT COLUMN_TYPE INTO @enum_values
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'role';

SET @has_guard = IF(LOCATE('guard', @enum_values) > 0, 1, 0);

SET @query = IF(@has_guard = 0,
  'ALTER TABLE users MODIFY COLUMN role ENUM(''admin'', ''employee'', ''guard'') NOT NULL DEFAULT ''employee''',
  'SELECT "Guard role already exists in users table" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 5. CREATE LEAVE MANAGEMENT TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS leave_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_code VARCHAR(10) NOT NULL UNIQUE,
  type_name VARCHAR(100) NOT NULL,
  description TEXT,
  days_allowed INT NOT NULL DEFAULT 0,
  requires_medical_cert BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_balances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  leave_type_id INT NOT NULL,
  school_year VARCHAR(20) NOT NULL,
  total_days DECIMAL(5,2) NOT NULL DEFAULT 0,
  used_days DECIMAL(5,2) NOT NULL DEFAULT 0,
  pending_days DECIMAL(5,2) NOT NULL DEFAULT 0,
  remaining_days DECIMAL(5,2) GENERATED ALWAYS AS (total_days - used_days - pending_days) STORED,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE,
  UNIQUE KEY unique_balance (employee_id, leave_type_id, school_year)
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  leave_type_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested DECIMAL(5,2) NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  is_appeal BOOLEAN DEFAULT FALSE,
  medical_certificate_file VARCHAR(255) NULL,
  reviewed_by VARCHAR(100) NULL,
  reviewed_at DATETIME NULL,
  review_notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE
);

-- ============================================
-- 6. CREATE CERTIFICATE SYSTEM TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS certificate_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  template_type ENUM('active_employment', 'inactive_employment', 'service_record', 'clearance') NOT NULL,
  template_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS generated_certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  template_id INT NOT NULL,
  certificate_type VARCHAR(50) NOT NULL,
  verification_code VARCHAR(100) NOT NULL UNIQUE,
  issue_date DATE NOT NULL,
  expiry_date DATE NULL,
  purpose TEXT NULL,
  generated_by VARCHAR(100) NOT NULL,
  file_path VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES certificate_templates(id) ON DELETE CASCADE
);

-- ============================================
-- 7. CREATE PROFILE UPDATE HISTORY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS profile_update_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  old_value TEXT NULL,
  new_value TEXT NULL,
  updated_by VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- ============================================
-- 8. SEED DEFAULT LEAVE TYPES
-- ============================================

INSERT IGNORE INTO leave_types (type_code, type_name, description, days_allowed, requires_medical_cert) VALUES
('SL', 'Sick Leave', 'Leave due to illness or medical condition', 15, TRUE),
('VL', 'Vacation Leave', 'Planned vacation or personal time off', 15, FALSE),
('EL', 'Emergency Leave', 'Urgent family or personal emergency', 5, FALSE),
('ML', 'Maternity Leave', 'Leave for childbirth and recovery', 105, TRUE),
('PL', 'Paternity Leave', 'Leave for fathers after childbirth', 7, FALSE),
('BL', 'Bereavement Leave', 'Leave due to death of immediate family member', 3, FALSE),
('SPL', 'Special Leave', 'Special privilege leave for government employees', 3, FALSE),
('SLBW', 'Solo Parent Leave', 'Leave for solo parents', 7, FALSE),
('VAWC', 'VAWC Leave', 'Leave for victims of violence against women and children', 10, FALSE);

-- ============================================
-- 9. SEED DEFAULT CERTIFICATE TEMPLATES
-- ============================================

INSERT IGNORE INTO certificate_templates (template_name, template_type, template_content) VALUES
('Active Employment Certificate', 'active_employment', 
'This is to certify that {{employee_name}} (Employee ID: {{employee_id}}) is currently employed at {{organization_name}} as {{position}} in the {{department}} department since {{hire_date}}. This certificate is issued upon the request of the above-named employee for {{purpose}}.'),

('Inactive Employment Certificate', 'inactive_employment',
'This is to certify that {{employee_name}} (Employee ID: {{employee_id}}) was employed at {{organization_name}} as {{position}} in the {{department}} department from {{hire_date}} to {{separation_date}}. During their tenure, they performed their duties satisfactorily. This certificate is issued upon their request for {{purpose}}.');

-- Commit transaction
COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT 'Migration completed successfully!' AS status;

SELECT 'Employees table columns:' AS info;
SELECT COLUMN_NAME, DATA_TYPE 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' AND TABLE_NAME = 'employees'
ORDER BY ORDINAL_POSITION;

SELECT 'Attendance table columns:' AS info;
SELECT COLUMN_NAME, DATA_TYPE 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'hrm' AND TABLE_NAME = 'attendance'
ORDER BY ORDINAL_POSITION;

SELECT 'Leave types seeded:' AS info;
SELECT COUNT(*) AS leave_type_count FROM leave_types;

SELECT 'Certificate templates seeded:' AS info;
SELECT COUNT(*) AS template_count FROM certificate_templates;
