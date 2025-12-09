const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'hrm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function runMigration() {
  const conn = await pool.getConnection();
  try {
    console.log('Running migration: Adding multi-level approval columns...');

    // Add employee_department column
    await conn.execute(`
      ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS employee_department VARCHAR(100) NULL AFTER employee_name
    `);
    console.log('✓ Added employee_department column');

    // Add department_head_comment column
    await conn.execute(`
      ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS department_head_comment TEXT NULL AFTER reason
    `);
    console.log('✓ Added department_head_comment column');

    // Add department_head_approved_by column
    await conn.execute(`
      ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS department_head_approved_by VARCHAR(255) NULL AFTER department_head_comment
    `);
    console.log('✓ Added department_head_approved_by column');

    // Add department_head_approved_at column
    await conn.execute(`
      ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS department_head_approved_at TIMESTAMP NULL AFTER department_head_approved_by
    `);
    console.log('✓ Added department_head_approved_at column');

    // Update status ENUM
    await conn.execute(`
      ALTER TABLE leave_requests MODIFY status ENUM('pending', 'department_approved', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
    `);
    console.log('✓ Updated status ENUM');

    // Add indexes
    await conn.execute(`
      ALTER TABLE leave_requests ADD INDEX IF NOT EXISTS idx_employee_department (employee_department)
    `);
    console.log('✓ Added employee_department index');

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

runMigration();
