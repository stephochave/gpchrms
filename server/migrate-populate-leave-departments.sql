-- Populate employee_department for existing leave requests
UPDATE leave_requests lr
INNER JOIN employees e ON e.employee_id = lr.employee_id
SET lr.employee_department = e.department
WHERE lr.employee_department IS NULL;
