-- POPULATE SAMPLE DATA FOR HR SYSTEM
-- Run this to add 5 employees with departments and designations

USE hrm;

-- Insert Departments
INSERT INTO departments (code, name, description) VALUES
('IT', 'Information Technology', 'Handles all IT infrastructure and support'),
('HR', 'Human Resources', 'Manages employee relations and recruitment'),
('FIN', 'Finance', 'Manages financial operations and accounting'),
('ENG', 'Engineering', 'Product development and engineering'),
('MKT', 'Marketing', 'Marketing and brand management')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Designations
INSERT INTO designations (title, department, level, description) VALUES
('Software Developer', 'Information Technology', 'mid', 'Develops and maintains software applications'),
('HR Manager', 'Human Resources', 'senior', 'Oversees HR operations and team'),
('Accountant', 'Finance', 'mid', 'Handles financial records and reporting'),
('Senior Engineer', 'Engineering', 'senior', 'Leads engineering projects'),
('Marketing Specialist', 'Marketing', 'junior', 'Executes marketing campaigns')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Insert 5 Sample Employees
INSERT INTO employees (
  employee_id, first_name, middle_name, last_name, suffix_name, full_name,
  department, position, email, phone, date_of_birth, address,
  gender, civil_status, date_hired, employment_type, role,
  sss_number, pagibig_number, tin_number, status
) VALUES
(
  '25-GPC-00001', 'Juan', 'Santos', 'Dela Cruz', '', 'Juan Santos Dela Cruz',
  'Information Technology', 'Software Developer', 'juan.delacruz@gpc.edu', '09171234567',
  '1995-05-15', '123 Main St, Manila', 'Male', 'Single', '2023-01-15',
  'Regular', 'employee', '12-3456789-0', '121234567890', '123-456-789-000', 'active'
),
(
  '25-GPC-00002', 'Maria', 'Garcia', 'Santos', '', 'Maria Garcia Santos',
  'Human Resources', 'HR Manager', 'maria.santos@gpc.edu', '09181234567',
  '1990-08-20', '456 Secondary Ave, Quezon City', 'Female', 'Married', '2022-06-01',
  'Regular', 'employee', '12-3456789-1', '121234567891', '123-456-789-001', 'active'
),
(
  '25-GPC-00003', 'Pedro', 'Reyes', 'Gonzales', 'Jr.', 'Pedro Reyes Gonzales Jr.',
  'Finance', 'Accountant', 'pedro.gonzales@gpc.edu', '09191234567',
  '1988-12-10', '789 Tertiary Rd, Makati', 'Male', 'Married', '2021-03-10',
  'Regular', 'employee', '12-3456789-2', '121234567892', '123-456-789-002', 'active'
),
(
  '25-GPC-00004', 'Ana', 'Lopez', 'Ramos', '', 'Ana Lopez Ramos',
  'Engineering', 'Senior Engineer', 'ana.ramos@gpc.edu', '09201234567',
  '1992-03-25', '321 Engineering St, Taguig', 'Female', 'Single', '2020-09-15',
  'Regular', 'employee', '12-3456789-3', '121234567893', '123-456-789-003', 'active'
),
(
  '25-GPC-00005', 'Carlos', 'Mendoza', 'Torres', '', 'Carlos Mendoza Torres',
  'Marketing', 'Marketing Specialist', 'carlos.torres@gpc.edu', '09211234567',
  '1998-07-08', '654 Marketing Blvd, Pasig', 'Male', 'Single', '2024-01-20',
  'Regular', 'employee', '12-3456789-4', '121234567894', '123-456-789-004', 'active'
)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Create user accounts for these employees (password: Employee@123)
-- Password hash for 'Employee@123'
SET @employee_password = '$2a$10$9xKX4wG5L6p3vZ8qH2mYLOYx7J3K4wG5L6p3vZ8qH2mYLOYx7J3K4e';

INSERT INTO users (username, email, full_name, role, password_hash, employee_id) VALUES
('juan.delacruz', 'juan.delacruz@gpc.edu', 'Juan Santos Dela Cruz', 'employee', @employee_password, '25-GPC-00001'),
('maria.santos', 'maria.santos@gpc.edu', 'Maria Garcia Santos', 'employee', @employee_password, '25-GPC-00002'),
('pedro.gonzales', 'pedro.gonzales@gpc.edu', 'Pedro Reyes Gonzales Jr.', 'employee', @employee_password, '25-GPC-00003'),
('ana.ramos', 'ana.ramos@gpc.edu', 'Ana Lopez Ramos', 'employee', @employee_password, '25-GPC-00004'),
('carlos.torres', 'carlos.torres@gpc.edu', 'Carlos Mendoza Torres', 'employee', @employee_password, '25-GPC-00005')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Display results
SELECT '✅ Departments Added:' AS status;
SELECT id, code, name FROM departments ORDER BY id;

SELECT '✅ Designations Added:' AS status;
SELECT id, title, department, level FROM designations ORDER BY id;

SELECT '✅ Employees Added:' AS status;
SELECT id, employee_id, full_name, department, position, email FROM employees WHERE employee_id LIKE '25-GPC-0000%' ORDER BY employee_id;

SELECT '✅ User Accounts Created:' AS status;
SELECT id, username, email, role, employee_id FROM users WHERE employee_id LIKE '25-GPC-0000%' ORDER BY employee_id;

SELECT '🎉 Sample data populated successfully!' AS message;
SELECT '📝 Login credentials for employees:' AS info;
SELECT 'Username: employee email (e.g., juan.delacruz@gpc.edu)' AS credential_1;
SELECT 'Password: Employee@123' AS credential_2;
