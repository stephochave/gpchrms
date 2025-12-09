const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hrm'
  });

  console.log('\n=== DEPARTMENT HEADS ===');
  const [deptHeads] = await pool.execute(`
    SELECT employee_id, full_name, position, department 
    FROM employees 
    WHERE position LIKE '%Head%' OR position LIKE '%Dean%' OR position LIKE '%Principal%'
    ORDER BY department
  `);
  console.table(deptHeads);

  console.log('\n=== LEAVE REQUESTS ===');
  const [leaves] = await pool.execute(`
    SELECT lr.id, lr.employee_id, e.full_name, e.department, 
           lr.leave_type, lr.status, lr.start_date, lr.end_date,
           lr.department_head_approved_by, lr.decided_by
    FROM leave_requests lr 
    JOIN employees e ON lr.employee_id = e.employee_id 
    ORDER BY lr.created_at DESC 
    LIMIT 10
  `);
  console.table(leaves);

  await pool.end();
})();
