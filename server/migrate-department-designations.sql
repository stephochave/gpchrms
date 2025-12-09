-- Add department_id to designations table
ALTER TABLE designations ADD COLUMN department_id INT AFTER id;
ALTER TABLE designations ADD FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE;

-- Drop the UNIQUE constraint on name since names can be the same across different departments
ALTER TABLE designations DROP INDEX name;
-- Add a composite unique constraint (name + department_id)
ALTER TABLE designations ADD UNIQUE KEY unique_designation_per_dept (name, department_id);
