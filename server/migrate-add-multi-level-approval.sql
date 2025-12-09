-- Add multi-level approval workflow to leave_requests table
-- This allows Department Heads/Deans/Principals to recommend approval before admin final approval

ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS employee_department VARCHAR(100) NULL AFTER employee_name;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS department_head_comment TEXT NULL AFTER reason;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS department_head_approved_by VARCHAR(255) NULL AFTER department_head_comment;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS department_head_approved_at TIMESTAMP NULL AFTER department_head_approved_by;

-- Update status ENUM to include 'department_approved'
ALTER TABLE leave_requests MODIFY status ENUM('pending', 'department_approved', 'approved', 'rejected') NOT NULL DEFAULT 'pending';

-- Create index for department head filtering
ALTER TABLE leave_requests ADD INDEX IF NOT EXISTS idx_employee_department (employee_department);
ALTER TABLE leave_requests ADD INDEX IF NOT EXISTS idx_status_new (status);
