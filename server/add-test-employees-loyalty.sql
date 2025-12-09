-- Add test employees with 10+ years of service for loyalty testing
-- These are old employees who should be eligible for loyalty awards

INSERT INTO employees (
  employee_id, first_name, middle_name, last_name, full_name, 
  department, position, email, phone, date_hired, employment_type, 
  status, registered_face_file, password, role, created_at
) VALUES 
(
  '15-GPC-00001', 'Maria', 'Santos', 'Lopez', 'Maria Santos Lopez',
  'High School Department', 'Senior Teacher', 'maria.lopez@school.edu', '09123456789',
  '2010-03-15', 'Regular', 'active', 'dummy_face_1', 'hashed_password_1', 'employee', NOW()
),
(
  '12-GPC-00002', 'Juan', 'Dela', 'Cruz', 'Juan Dela Cruz',
  'Elementary Department', 'Principal', 'juan.cruz@school.edu', '09187654321',
  '2008-06-01', 'Regular', 'active', 'dummy_face_2', 'hashed_password_2', 'employee', NOW()
),
(
  '14-GPC-00003', 'Rosa', 'Garcia', 'Fernandez', 'Rosa Garcia Fernandez',
  'College Department', 'Dean', 'rosa.garcia@school.edu', '09111111111',
  '2005-01-10', 'Regular', 'active', 'dummy_face_3', 'hashed_password_3', 'employee', NOW()
),
(
  '13-GPC-00004', 'Antonio', 'Reyes', 'Santos', 'Antonio Reyes Santos',
  'Administration Department', 'Administrative Officer', 'antonio.reyes@school.edu', '09222222222',
  '2012-09-20', 'Regular', 'active', 'dummy_face_4', 'hashed_password_4', 'employee', NOW()
);
