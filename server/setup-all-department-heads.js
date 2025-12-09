const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'hrm',
} = process.env;

// Updated list of department heads by employee ID
const departmentHeads = [
  '25-GPC-00001', // POLINNE MARI MONTEMAYR RABINA - Administration Department
  '25-GPC-00002', // STEPHANY MONTES OCHAVE - College Department
  '25-GPC-00004', // MIAH CLAIRE SAGUN CORPUZ - Elementary Department
  '25-GPC-00007', // FELIPE DON MARTES - Executive & Directors
  '25-GPC-00003', // MIA MYCA NAUNGAYAN TRESENIO - High School Department
  '25-GPC-00006', // GOMEZ BASTA BAHAGHARI - Finance Department
];

async function setupDepartmentHeads() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log('✅ Connected to database\n');

    // Update each department head to have admin role
    for (const empId of departmentHeads) {
      const [empRows] = await connection.execute(
        'SELECT id, employee_id, full_name, position, department, role FROM employees WHERE employee_id = ?',
        [empId]
      );

      if (empRows.length === 0) {
        console.log(`❌ Employee ${empId} not found`);
        continue;
      }

      const employee = empRows[0];

      // Update role to 'admin' if not already
      if (employee.role !== 'admin') {
        await connection.execute(
          'UPDATE employees SET role = ?, updated_at = NOW() WHERE employee_id = ?',
          ['admin', empId]
        );
        console.log(`✅ Updated ${employee.full_name} (${empId}) to admin role`);
      } else {
        console.log(`✅ ${employee.full_name} (${empId}) already has admin role`);
      }
    }

    console.log(`\n✨ Department heads setup complete!\n`);
    console.log(`📋 Complete List of Department Heads:\n`);
    
    const [summary] = await connection.execute(
      `SELECT employee_id, full_name, position, department, role 
       FROM employees 
       WHERE employee_id IN (${departmentHeads.map(() => '?').join(',')})
       ORDER BY department`,
      departmentHeads
    );

    let i = 1;
    summary.forEach(emp => {
      console.log(`${i}. ${emp.full_name} - ${emp.department}`);
      console.log(`   Position: ${emp.position}`);
      console.log(`   Can review/reject/recommend leave requests from ${emp.department}\n`);
      i++;
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDepartmentHeads();
