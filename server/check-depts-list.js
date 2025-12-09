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

    const [depts] = await connection.execute('SELECT id, name FROM departments ORDER BY name');
    console.log('Current departments:');
    depts.forEach(d => console.log(`  ID ${d.id}: ${d.name}`));

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
