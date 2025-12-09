const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'hrm',
} = process.env;

const departmentHeads = [
  { empId: '25-GPC-00001', name: 'POLINNE MARI MONTEMAYR RABINA', department: 'Administration Department' },
  { empId: '25-GPC-00002', name: 'STEPHANY MONTES OCHAVE', department: 'College Department' },
  { empId: '25-GPC-00004', name: 'MIAH CLAIRE SAGUN CORPUZ', department: 'Elementary Department' },
  { empId: '25-GPC-00007', name: 'FELIPE DON MARTES', department: 'Executive & Directors' },
  { empId: '25-GPC-00006', name: 'GOMEZ BASTA BAHAGHARI', department: 'Finance Departmet' },
  { empId: '25-GPC-00003', name: 'MIA MYCA NAUNGAYAN TRESENIO', department: 'High School Department' },
];

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log('📋 DEPARTMENT HEADS - DESIGNATIONS AND EMPLOYEE ACCESS\n');
    console.log('='.repeat(90) + '\n');

    for (const head of departmentHeads) {
      console.log(`👤 ${head.name}`);
      console.log(`   Employee ID: ${head.empId}`);
      console.log(`   Department: ${head.department}\n`);

      // Get all designations for this department
      const [designations] = await connection.execute(
        `SELECT d.id, d.name, COUNT(e.id) as employee_count
         FROM designations d
         LEFT JOIN employees e ON d.name = e.position AND e.department = d.department_id
         WHERE d.department_id = (SELECT id FROM departments WHERE name = ?)
         GROUP BY d.id, d.name
         ORDER BY d.name`,
        [head.department]
      );

      console.log(`   📍 Available Designations (${designations.length}):\n`);

      designations.forEach((desig, idx) => {
        console.log(`      ${idx + 1}. ${desig.name}`);
        if (desig.employee_count > 0) {
          console.log(`         └─ ${desig.employee_count} employee(s) assigned`);
        } else {
          console.log(`         └─ No employees assigned (Vacant)`);
        }
      });

      console.log('\n' + '-'.repeat(90) + '\n');
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
