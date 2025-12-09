const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hrm'
  });

  console.log('\n=== CHECKING STEPHANY\'S ACCOUNT ===\n');

  // Check user account
  const [users] = await pool.execute(`
    SELECT u.id, u.username, u.employee_id, u.full_name, u.role
    FROM users u
    WHERE u.employee_id = '25-GPC-00002'
  `);

  console.log('User Account:');
  console.table(users);

  // Check employee record
  const [employees] = await pool.execute(`
    SELECT employee_id, full_name, position, department
    FROM employees
    WHERE employee_id = '25-GPC-00002'
  `);

  console.log('Employee Record:');
  console.table(employees);

  // Check pending leaves in College Department
  const [leaves] = await pool.execute(`
    SELECT lr.id, lr.employee_id, lr.employee_name, lr.employee_department, 
           lr.status, lr.start_date, lr.end_date
    FROM leave_requests lr
    WHERE lr.employee_department = 'College Department' AND lr.status = 'pending'
  `);

  console.log('\nPending Leaves in College Department:');
  console.table(leaves);

  if (employees.length > 0) {
    console.log('\n✅ WHAT STEPHANY SHOULD SEE:');
    console.log('Position:', employees[0].position);
    console.log('Department:', employees[0].department);
    console.log('Should see department head section: YES (position contains "Dean")');
    console.log('Pending leaves to review:', leaves.length);
  }

  await pool.end();
})();
