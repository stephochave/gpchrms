const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'hrm',
});

async function updateDepartmentHeadsToAdmin() {
  const conn = await pool.getConnection();
  try {
    console.log('Updating department heads to admin role...\n');
    
    // Get all department heads (Rabina, Ochave, Tresenio, Corpuz)
    const [deptHeads] = await conn.execute(`
      SELECT e.id, e.full_name, e.employee_id, e.department, e.position, u.id as user_id, u.role
      FROM employees e
      LEFT JOIN users u ON u.employee_id = e.employee_id
      WHERE (e.position LIKE '%Dean%' 
        OR e.position LIKE '%Principal%' 
        OR e.position LIKE '%Head%')
      AND e.status = 'active'
      ORDER BY e.full_name
    `);
    
    console.log('Department Heads Found:');
    console.log('======================\n');
    
    for (const dept of deptHeads) {
      if (!dept.user_id) {
        console.log(`⚠ No user account found for: ${dept.full_name} (${dept.employee_id})`);
        console.log(`  Creating admin account...\n`);
        
        // Create admin account
        const username = dept.employee_id.toLowerCase();
        const hashedPassword = require('bcryptjs').hashSync('12345678', 10);
        
        await conn.execute(
          `INSERT INTO users (username, email, employee_id, full_name, role, password_hash)
           VALUES (?, ?, ?, ?, 'admin', ?)`,
          [username, `${dept.employee_id}@school.edu`, dept.employee_id, dept.full_name, hashedPassword]
        );
        
        console.log(`✓ Created admin account for: ${dept.full_name}`);
        console.log(`  Username: ${username}`);
        console.log(`  Password: 12345678`);
        console.log(`  Role: admin`);
        console.log(`  Department: ${dept.department}`);
        console.log(`  Position: ${dept.position}\n`);
      } else if (dept.role !== 'admin') {
        // Update existing account to admin
        await conn.execute(
          'UPDATE users SET role = ? WHERE id = ?',
          ['admin', dept.user_id]
        );
        
        console.log(`✓ Updated to admin: ${dept.full_name}`);
        console.log(`  Employee ID: ${dept.employee_id}`);
        console.log(`  Previous Role: ${dept.role}`);
        console.log(`  New Role: admin`);
        console.log(`  Department: ${dept.department}`);
        console.log(`  Position: ${dept.position}\n`);
      } else {
        console.log(`✓ Already admin: ${dept.full_name}`);
        console.log(`  Employee ID: ${dept.employee_id}`);
        console.log(`  Department: ${dept.department}`);
        console.log(`  Position: ${dept.position}\n`);
      }
    }
    
    console.log('\n======================');
    console.log('Update completed successfully!');
    console.log('Department heads can now:');
    console.log('- View "My Attendance" and "Department Attendance"');
    console.log('- View "My Leave Requests" and "Department Leaves"');
    console.log('- Recommend leave requests for approval');
    console.log('======================\n');
    
  } catch (error) {
    console.error('Error updating department heads:', error);
  } finally {
    conn.release();
    await pool.end();
  }
}

updateDepartmentHeadsToAdmin();
