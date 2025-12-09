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

    console.log('🔍 Searching for Gomez Bahaghari...');
    const [employees] = await connection.execute(
      `SELECT employee_id, full_name, position, department, role 
       FROM employees 
       WHERE LOWER(full_name) LIKE '%gomez%' OR LOWER(full_name) LIKE '%bahaghari%'`
    );

    if (employees.length === 0) {
      console.log('❌ Gomez Bahaghari not found');
    } else {
      employees.forEach(emp => {
        console.log(`Found: ${emp.employee_id} | ${emp.full_name}`);
        console.log(`  Position: ${emp.position}`);
        console.log(`  Department: ${emp.department}`);
        console.log(`  Current Role: ${emp.role}`);
      });
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
