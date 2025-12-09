const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'hrm',
} = process.env;

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log('Department Heads (based on position keywords):');
    const [employees] = await connection.execute(
      `SELECT employee_id, full_name, position, department 
       FROM employees 
       WHERE (LOWER(position) LIKE '%head%' 
              OR LOWER(position) LIKE '%dean%' 
              OR LOWER(position) LIKE '%principal%'
              OR LOWER(position) LIKE '%chairman%'
              OR LOWER(position) LIKE '%president%')
       ORDER BY department, position`
    );

    employees.forEach(e => {
      console.log(`  ${e.employee_id} | ${e.full_name} | ${e.position} | ${e.department}`);
    });

    console.log(`\nTotal department heads: ${employees.length}`);

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
