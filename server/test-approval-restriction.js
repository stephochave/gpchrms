const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hrm'
  });

  console.log('\n=== TESTING ADMIN APPROVAL RESTRICTION ===\n');

  // Check current pending leave
  const [leaves] = await pool.execute(`
    SELECT lr.id, lr.employee_id, e.full_name, lr.status, 
           lr.department_head_approved_by, e.department
    FROM leave_requests lr 
    JOIN employees e ON lr.employee_id = e.employee_id 
    WHERE lr.status = 'pending'
    ORDER BY lr.created_at DESC 
    LIMIT 1
  `);

  if (leaves.length === 0) {
    console.log('❌ No pending leave requests found for testing.');
    await pool.end();
    return;
  }

  const pendingLeave = leaves[0];
  console.log('Found pending leave:');
  console.log('  ID:', pendingLeave.id);
  console.log('  Employee:', pendingLeave.full_name);
  console.log('  Department:', pendingLeave.department);
  console.log('  Status:', pendingLeave.status);
  console.log('  Department Head Approval:', pendingLeave.department_head_approved_by || 'NOT YET REVIEWED');
  console.log();

  console.log('✅ EXPECTED BEHAVIOR:');
  console.log('1. Admin CANNOT approve this leave because status is "pending"');
  console.log('2. Department head MUST review first (status becomes "department_approved")');
  console.log('3. Then admin CAN give final approval');
  console.log();

  console.log('📋 WORKFLOW:');
  console.log('Step 1: Login as department head for', pendingLeave.department);
  console.log('        - Navigate to Leaves page');
  console.log('        - See "Pending Leaves for Review (Department Head)" section');
  console.log('        - Click "Recommend Approval"');
  console.log();
  console.log('Step 2: Login as Admin');
  console.log('        - The "Approve" button will now be ENABLED');
  console.log('        - Department Head column shows "✓ Recommended"');
  console.log('        - Admin can give final approval');

  await pool.end();
})();
