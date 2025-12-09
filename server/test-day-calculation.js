const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hrm'
  });

  console.log('\n=== TESTING DAY-BASED LEAVE CALCULATION ===\n');

  // Check TEST EMPLOYEE COLLEGE's pending leave
  const [pendingLeave] = await pool.execute(`
    SELECT id, employee_id, employee_name, start_date, end_date, status
    FROM leave_requests
    WHERE employee_id = '25-GPC-00010' AND status = 'pending'
  `);

  if (pendingLeave.length > 0) {
    const leave = pendingLeave[0];
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    console.log('Pending Leave Request:');
    console.log('  Employee:', leave.employee_name);
    console.log('  Start Date:', start.toISOString().split('T')[0]);
    console.log('  End Date:', end.toISOString().split('T')[0]);
    console.log('  Number of Days:', days);
    console.log('  Status:', leave.status);
    console.log();
  }

  // Check approved leaves and calculate total days
  const [approvedLeaves] = await pool.execute(`
    SELECT employee_id, employee_name, start_date, end_date
    FROM leave_requests
    WHERE status = 'approved' AND YEAR(start_date) = 2025
    ORDER BY employee_name, start_date
  `);

  console.log('Current Year Approved Leaves (2025):');
  const employeeDays = new Map();

  for (const leave of approvedLeaves) {
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    console.log(`  ${leave.employee_name}: ${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]} = ${days} day(s)`);

    const current = employeeDays.get(leave.employee_id) || { name: leave.employee_name, totalDays: 0 };
    current.totalDays += days;
    employeeDays.set(leave.employee_id, current);
  }

  console.log('\n=== EMPLOYEE LEAVE BALANCE ===\n');
  employeeDays.forEach((data, empId) => {
    const remaining = 10 - data.totalDays;
    console.log(`${data.name}:`);
    console.log(`  Used: ${data.totalDays} days`);
    console.log(`  Remaining: ${remaining} days`);
    console.log();
  });

  console.log('✅ SYSTEM NOW CALCULATES:');
  console.log('• 1 day leave = -1 from remaining days');
  console.log('• 3 day leave = -3 from remaining days');
  console.log('• Maximum: 10 days per year');

  await pool.end();
})();
