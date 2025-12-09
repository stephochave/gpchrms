const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hrm'
  });

  console.log('\n=== CHECKING POLINNE\'S VIEW ===\n');

  const [user] = await pool.execute(`
    SELECT e.employee_id, e.full_name, e.position, e.department
    FROM employees e
    WHERE e.employee_id = '25-GPC-00001'
  `);

  console.log('Polinne\'s Info:');
  console.table(user);

  const [herDeptLeaves] = await pool.execute(`
    SELECT id, employee_name, employee_department, status
    FROM leave_requests
    WHERE employee_department = 'Administration Department' AND status = 'pending'
  `);

  console.log('\nPending Leaves in HER Department (Administration):');
  if (herDeptLeaves.length === 0) {
    console.log('  ❌ No pending leaves from Administration Department');
  } else {
    console.table(herDeptLeaves);
  }

  console.log('\n=== SOLUTION ===');
  console.log('To see the TEST EMPLOYEE COLLEGE leave request,');
  console.log('you need to login as STEPHANY MONTES OCHAVE');
  console.log('  Username: 25-gpc-00002');
  console.log('  Password: 12345678');
  console.log('  Department: College Department');
  console.log('\nSTEPHANY is the Dean of College Department,');
  console.log('so she can review leaves from College Department employees.');

  await pool.end();
})();
