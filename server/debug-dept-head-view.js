const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hrm'
  });

  console.log('\n=== DEBUGGING DEPARTMENT HEAD VIEW ===\n');

  // Simulate what the login returns
  const [userRows] = await pool.execute(`
    SELECT u.id, u.username, u.email, u.employee_id, u.full_name, u.role,
           e.position, e.department
    FROM users u
    LEFT JOIN employees e ON u.employee_id = e.employee_id
    WHERE u.username = '25-gpc-00002'
  `);

  console.log('What login should return for Stephany:');
  console.table(userRows);

  // Check the leave request
  const [leaveRows] = await pool.execute(`
    SELECT id, employee_id, employee_name, employee_department, status
    FROM leave_requests
    WHERE id = 3
  `);

  console.log('\nLeave Request Details:');
  console.table(leaveRows);

  if (userRows.length > 0 && leaveRows.length > 0) {
    const user = userRows[0];
    const leave = leaveRows[0];

    console.log('\n=== MATCHING LOGIC ===');
    console.log('User Department:', user.department);
    console.log('Leave Employee Department:', leave.employee_department);
    console.log('Match:', user.department === leave.employee_department);
    console.log('User Position:', user.position);
    console.log('Is Department Head:', 
      user.position?.toLowerCase().includes('head') || 
      user.position?.toLowerCase().includes('dean') || 
      user.position?.toLowerCase().includes('principal')
    );
    console.log('Leave Status:', leave.status);
    console.log('Should Show:', leave.status === 'pending' && user.department === leave.employee_department);
  }

  await pool.end();
})();
