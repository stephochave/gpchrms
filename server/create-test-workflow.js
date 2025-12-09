const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hrm'
  });

  console.log('Creating test employee in College Department...\n');

  // Check if test employee exists
  const [existing] = await pool.execute(
    'SELECT * FROM employees WHERE employee_id = ?',
    ['25-GPC-00010']
  );

  if (existing.length > 0) {
    console.log('Test employee already exists: 25-GPC-00010\n');
  } else {
    // Create test employee
    await pool.execute(`
      INSERT INTO employees (
        employee_id, full_name, first_name, middle_name, last_name, suffix_name,
        email, phone, date_of_birth, gender, address,
        position, department, employment_type, date_hired, status
      ) VALUES (
        '25-GPC-00010',
        'TEST EMPLOYEE COLLEGE',
        'TEST',
        'EMPLOYEE',
        'COLLEGE',
        '',
        'test.college@gpc.edu',
        '09123456789',
        '1990-01-01',
        'other',
        'Test Address',
        'College Instructor',
        'College Department',
        'regular',
        '2025-01-01',
        'active'
      )
    `);

    console.log('✅ Created test employee: 25-GPC-00010');
    console.log('   Username: 25-gpc-00010');
    console.log('   Password: 12345678');
    console.log('   Department: College Department');
    console.log('   Position: College Instructor\n');
  }

  // Create a test leave request
  console.log('Creating test leave request...\n');
  
  const [leaveResult] = await pool.execute(`
    INSERT INTO leave_requests (
      employee_id, employee_name, employee_department,
      leave_type, start_date, end_date, reason, status
    ) VALUES (
      '25-GPC-00010',
      'TEST EMPLOYEE COLLEGE',
      'College Department',
      'vacation',
      '2025-12-15',
      '2025-12-17',
      'Family vacation during Christmas break',
      'pending'
    )
  `);

  console.log('✅ Created test leave request');
  console.log('   Leave ID:', leaveResult.insertId);
  console.log('   Employee: TEST EMPLOYEE COLLEGE');
  console.log('   Department: College Department');
  console.log('   Status: pending');
  console.log('   Dates: Dec 15-17, 2025\n');

  console.log('=== TESTING WORKFLOW ===\n');
  console.log('1. Login as STEPHANY MONTES OCHAVE (25-gpc-00002)');
  console.log('   - She should see "Pending Leaves for Review (Department Head)"');
  console.log('   - She can RECOMMEND APPROVAL or REJECT this leave\n');
  
  console.log('2. If she recommends approval:');
  console.log('   - Status changes to "department_approved"');
  console.log('   - Leave appears in Admin\'s queue for final approval\n');
  
  console.log('3. Login as Admin to give final approval');
  console.log('   - Admin can see the department head\'s recommendation');
  console.log('   - Admin gives FINAL APPROVAL or REJECTION\n');

  await pool.end();
})();
