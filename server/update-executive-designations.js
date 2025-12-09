const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'hrm',
} = process.env;

async function updateExecutiveDesignations() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log('✅ Connected to database');

    // Get Executive & Directors department
    const [depts] = await connection.execute(
      'SELECT id, name FROM departments WHERE name = ?',
      ['Executive & Directors']
    );

    if (depts.length === 0) {
      console.log('❌ Executive & Directors department not found');
      await connection.end();
      return;
    }

    const deptId = depts[0].id;
    console.log(`📌 Found Executive & Directors department (ID: ${deptId})`);

    // Delete existing designations for this department
    const [deleteResult] = await connection.execute(
      'DELETE FROM designations WHERE department_id = ?',
      [deptId]
    );
    console.log(`🗑️  Deleted ${deleteResult.affectedRows} existing designations`);

    // New designations for Executive & Directors
    const newDesignations = [
      'Chairman of the Board',
      'Vice Chairman',
      'Members of the Board of Directors',
      'Legal Counsel Corporate Secretary',
      'External Auditor',
      'School President',
      'Board Secretary',
    ];

    // Insert new designations
    for (const designation of newDesignations) {
      await connection.execute(
        'INSERT INTO designations (name, department_id) VALUES (?, ?)',
        [designation, deptId]
      );
      console.log(`  ✅ Added: ${designation}`);
    }

    console.log(`\n✨ Successfully updated Executive & Directors designations!`);
    console.log(`   Total designations: ${newDesignations.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateExecutiveDesignations();
