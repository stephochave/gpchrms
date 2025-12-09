const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'hrm',
});

async function checkAndCreateAccounts() {
  const conn = await pool.getConnection();
  try {
    console.log('Checking department heads and creating missing accounts...\n');
    
    // Get all department heads
    const [depts] = await conn.execute(`
      SELECT id, full_name, employee_id, department, position, email
      FROM employees
      WHERE (position LIKE '%Dean%' 
        OR position LIKE '%Principal%' 
        OR position LIKE '%Head%')
      AND status = 'active'
    `);
    
    console.log('Department Heads Found:');
    console.log('======================\n');
    
    for (const dept of depts) {
      // Check if user account exists
      const [existing] = await conn.execute(
        'SELECT id FROM users WHERE employee_id = ?',
        [dept.employee_id]
      );
      
      if (existing.length === 0) {
        // Create user account with default credentials
        const username = dept.employee_id.toLowerCase();
        const email = dept.email || `${dept.employee_id}@school.edu`;
        const hashedPassword = require('bcryptjs').hashSync('12345678', 10);
        
        await conn.execute(
          `INSERT INTO users (username, email, employee_id, full_name, role, password_hash)
           VALUES (?, ?, ?, ?, 'employee', ?)`,
          [username, email, dept.employee_id, dept.full_name, hashedPassword]
        );
        
        console.log(`✓ Created account for: ${dept.full_name}`);
        console.log(`  Username: ${username}`);
        console.log(`  Password: 12345678`);
        console.log(`  Position: ${dept.position}`);
        console.log(`  Department: ${dept.department}\n`);
      } else {
        console.log(`✓ Account exists for: ${dept.full_name}`);
        console.log(`  Position: ${dept.position}`);
        console.log(`  Department: ${dept.department}\n`);
      }
    }
    
    console.log('✅ All department heads have user accounts!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    conn.release();
    await pool.end();
  }
}

checkAndCreateAccounts();
