-- Fix admin user role
UPDATE users SET role = 'admin' WHERE employee_id = '25-GPC-ADM01';

-- Verify the update
SELECT id, username, email, employee_id, role, full_name 
FROM users 
WHERE employee_id = '25-GPC-ADM01';
