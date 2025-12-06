-- ============================================================================
-- HRMS SYSTEM COMPREHENSIVE MIGRATION
-- Replace Face Recognition with QR Code System
-- Add Leave Management, Certificate Generation, and Guard Role Support
-- Date: December 5, 2025
-- ============================================================================

USE hrm;

-- ============================================================================
-- PART 1: QR CODE SYSTEM - REPLACE FACE RECOGNITION
-- ============================================================================

-- Add QR code fields to employees table
ALTER TABLE employees 
ADD COLUMN qr_code_data VARCHAR(500) NULL COMMENT 'JWT token for QR code authentication',
ADD COLUMN qr_code_secret VARCHAR(255) NULL COMMENT 'Secret key for QR JWT signing',
ADD COLUMN qr_code_generated_at TIMESTAMP NULL COMMENT 'When QR code was last generated';

-- Remove face recognition columns from employees table
ALTER TABLE employees 
DROP COLUMN IF EXISTS registered_face_file;

-- Remove face recognition columns from attendance table
ALTER TABLE attendance 
DROP COLUMN IF EXISTS check_in_image,
DROP COLUMN IF EXISTS check_out_image;

-- Add QR verification tracking to attendance table
ALTER TABLE attendance 
ADD COLUMN qr_verified BOOLEAN DEFAULT FALSE COMMENT 'Whether attendance was verified via QR',
ADD COLUMN verification_method ENUM('qr', 'manual', 'guard_qr') DEFAULT 'manual' COMMENT 'Method used for attendance verification';

-- ============================================================================
-- PART 2: GUARD ROLE SUPPORT
-- ============================================================================

-- Update role enum to include 'guard'
ALTER TABLE employees 
MODIFY COLUMN role ENUM('admin', 'employee', 'guard') NOT NULL DEFAULT 'employee';

-- ============================================================================
-- PART 3: LEAVE MANAGEMENT SYSTEM
-- ============================================================================

-- Create leave types table
CREATE TABLE IF NOT EXISTS leave_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE COMMENT 'e.g., Sick Leave, Vacation Leave',
  code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Short code: SL, VL, etc.',
  days_per_year DECIMAL(5,2) NOT NULL DEFAULT 15.00 COMMENT 'Default annual entitlement',
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Types of leave available in the system';

-- Create leave balances table (per employee per school year)
CREATE TABLE IF NOT EXISTS leave_balances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  leave_type_id INT NOT NULL,
  school_year VARCHAR(9) NOT NULL COMMENT 'Format: 2024-2025',
  total_days DECIMAL(5,2) NOT NULL COMMENT 'Total entitlement for this year',
  used_days DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Days already used',
  pending_days DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Days in pending requests',
  remaining_days DECIMAL(5,2) GENERATED ALWAYS AS (total_days - used_days - pending_days) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_employee_leave_year (employee_id, leave_type_id, school_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Leave balances per employee per year';

-- Create leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  employee_name VARCHAR(180) NOT NULL,
  leave_type_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days DECIMAL(5,2) NOT NULL COMMENT 'Working days requested',
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
  reviewed_by VARCHAR(50) NULL COMMENT 'Employee ID of approver',
  reviewed_at TIMESTAMP NULL,
  review_notes TEXT NULL COMMENT 'Admin notes on approval/rejection',
  appeal_reason TEXT NULL COMMENT 'Employee appeal if balance was zero',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE RESTRICT,
  INDEX idx_employee (employee_id),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Leave requests submitted by employees';

-- ============================================================================
-- PART 4: CERTIFICATE GENERATION SYSTEM
-- ============================================================================

-- Create certificate templates table
CREATE TABLE IF NOT EXISTS certificate_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('active_employment', 'inactive_employment', 'service_record', 'clearance') NOT NULL,
  template_content TEXT NOT NULL COMMENT 'HTML template with placeholders',
  variables JSON NULL COMMENT 'Available placeholders: {name}, {position}, etc.',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_type_active (type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Certificate templates for different employee statuses';

-- Create generated certificates log table
CREATE TABLE IF NOT EXISTS generated_certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  employee_name VARCHAR(180) NOT NULL,
  template_id INT NOT NULL,
  certificate_type ENUM('active_employment', 'inactive_employment', 'service_record', 'clearance') NOT NULL,
  generated_by VARCHAR(50) NOT NULL COMMENT 'Admin employee ID who generated it',
  issue_date DATE NOT NULL,
  certificate_data TEXT NOT NULL COMMENT 'Final rendered HTML/PDF content',
  verification_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique code for certificate verification',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES certificate_templates(id) ON DELETE RESTRICT,
  INDEX idx_employee (employee_id),
  INDEX idx_verification (verification_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Log of all generated certificates';

-- ============================================================================
-- PART 5: ENHANCED ATTENDANCE TRACKING
-- ============================================================================

-- Add additional attendance tracking fields for comprehensive reporting
ALTER TABLE attendance 
ADD COLUMN late_minutes INT NULL DEFAULT 0 COMMENT 'Minutes late for check-in',
ADD COLUMN undertime_minutes INT NULL DEFAULT 0 COMMENT 'Minutes left early',
ADD COLUMN overtime_minutes INT NULL DEFAULT 0 COMMENT 'Minutes overtime worked';

-- ============================================================================
-- PART 6: EMPLOYEE PROFILE UPDATE TRACKING
-- ============================================================================

-- Create profile update history table
CREATE TABLE IF NOT EXISTS profile_update_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  field_name VARCHAR(100) NOT NULL COMMENT 'Field that was updated',
  old_value TEXT NULL,
  new_value TEXT NULL,
  updated_by VARCHAR(50) NOT NULL COMMENT 'Who made the update (employee_id or admin)',
  update_source ENUM('employee_self', 'admin', 'system') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  INDEX idx_employee (employee_id),
  INDEX idx_field (field_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Track all profile updates for audit purposes';

-- ============================================================================
-- PART 7: SEED DEFAULT DATA
-- ============================================================================

-- Insert default leave types
INSERT INTO leave_types (name, code, days_per_year, description, is_active) VALUES
('Sick Leave', 'SL', 15.00, 'Leave for medical reasons or illness', TRUE),
('Vacation Leave', 'VL', 15.00, 'Personal time off for vacation or rest', TRUE),
('Emergency Leave', 'EL', 5.00, 'Leave for urgent family or personal emergencies', TRUE),
('Maternity Leave', 'ML', 105.00, 'Leave for childbirth and maternity care (RA 11210)', TRUE),
('Paternity Leave', 'PL', 7.00, 'Leave for fathers for childbirth support', TRUE),
('Special Privilege Leave', 'SPL', 3.00, 'Leave for women undergoing surgery (RA 9710)', TRUE),
('Solo Parent Leave', 'SOLO', 7.00, 'Additional leave for solo parents (RA 8972)', TRUE),
('Study Leave', 'STL', 0.00, 'Leave for pursuing further education (case-by-case)', TRUE),
('Calamity Leave', 'CL', 0.00, 'Leave during natural disasters or calamities', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert default certificate templates
INSERT INTO certificate_templates (name, type, template_content, variables, is_active) VALUES
('Active Employment Certificate', 'active_employment', 
'<div class="certificate">
  <h2>CERTIFICATE OF EMPLOYMENT</h2>
  <p>This is to certify that <strong>{employee_name}</strong>, holder of Employee ID <strong>{employee_id}</strong>, 
  is currently employed with this institution as <strong>{position}</strong> under the <strong>{department}</strong> department.</p>
  <p>Employment commenced on <strong>{date_hired}</strong> and remains <strong>ACTIVE</strong> as of <strong>{issue_date}</strong>.</p>
  <p>This certification is issued upon the request of the concerned employee for whatever legal purpose it may serve.</p>
  <p><strong>Issued on:</strong> {issue_date}</p>
  <p><strong>Verification Code:</strong> {verification_code}</p>
</div>',
'{"employee_name": "Full name", "employee_id": "YY-GPC-XXXXX", "position": "Job title", "department": "Department name", "date_hired": "Hire date", "issue_date": "Certificate issue date", "verification_code": "Unique verification code"}',
TRUE),

('Inactive Employment Certificate', 'inactive_employment', 
'<div class="certificate">
  <h2>CERTIFICATE OF PREVIOUS EMPLOYMENT</h2>
  <p>This is to certify that <strong>{employee_name}</strong>, holder of Employee ID <strong>{employee_id}</strong>, 
  was previously employed with this institution as <strong>{position}</strong> under the <strong>{department}</strong> department.</p>
  <p>Employment period: <strong>{date_hired}</strong> to <strong>{separation_date}</strong></p>
  <p>Employment status: <strong>INACTIVE</strong> as of <strong>{issue_date}</strong></p>
  <p>This certification is issued upon the request of the concerned individual for whatever legal purpose it may serve.</p>
  <p><strong>Issued on:</strong> {issue_date}</p>
  <p><strong>Verification Code:</strong> {verification_code}</p>
</div>',
'{"employee_name": "Full name", "employee_id": "YY-GPC-XXXXX", "position": "Job title", "department": "Department name", "date_hired": "Hire date", "separation_date": "Last working date", "issue_date": "Certificate issue date", "verification_code": "Unique verification code"}',
TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- PART 8: CREATE VIEWS FOR REPORTING
-- ============================================================================

-- View for attendance summary per employee
CREATE OR REPLACE VIEW attendance_summary AS
SELECT 
  e.employee_id,
  e.full_name,
  e.department,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) as total_present,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as total_absent,
  COUNT(CASE WHEN a.status = 'late' THEN 1 END) as total_late,
  COUNT(CASE WHEN a.status = 'half-day' THEN 1 END) as total_halfday,
  COUNT(CASE WHEN a.status = 'leave' THEN 1 END) as total_leave,
  SUM(COALESCE(a.late_minutes, 0)) as total_late_minutes,
  SUM(COALESCE(a.undertime_minutes, 0)) as total_undertime_minutes,
  SUM(COALESCE(a.overtime_minutes, 0)) as total_overtime_minutes,
  YEAR(a.date) as year,
  MONTH(a.date) as month
FROM employees e
LEFT JOIN attendance a ON e.employee_id = a.employee_id
GROUP BY e.employee_id, e.full_name, e.department, YEAR(a.date), MONTH(a.date);

-- View for leave balance summary
CREATE OR REPLACE VIEW leave_balance_summary AS
SELECT 
  e.employee_id,
  e.full_name,
  e.department,
  lt.name as leave_type,
  lt.code as leave_code,
  lb.school_year,
  lb.total_days,
  lb.used_days,
  lb.pending_days,
  lb.remaining_days
FROM employees e
LEFT JOIN leave_balances lb ON e.employee_id = lb.employee_id
LEFT JOIN leave_types lt ON lb.leave_type_id = lt.id
WHERE e.status = 'active';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

SELECT 'Migration completed successfully!' as status;
SELECT 'QR code fields added to employees table' as step_1;
SELECT 'Face recognition columns removed' as step_2;
SELECT 'Leave management tables created' as step_3;
SELECT 'Certificate system tables created' as step_4;
SELECT 'Guard role support added' as step_5;
SELECT 'Enhanced attendance tracking enabled' as step_6;
SELECT 'Default leave types and certificate templates seeded' as step_7;
