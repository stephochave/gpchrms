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

async function addEmployeesWithOldHireDates() {
  try {
    const connection = await pool.getConnection();

    // Get existing employees
    const [existing] = await connection.execute(
      'SELECT COUNT(*) as count FROM employees WHERE date_hired < "2015-12-09"'
    );

    console.log(`Found ${existing[0].count} employees hired before 2015`);

    if (existing[0].count === 0) {
      // Add some test employees with old hire dates
      const testEmployees = [
        {
          employeeId: '15-GPC-00001',
          firstName: 'JOHN',
          middleName: 'PAUL',
          lastName: 'SMITH',
          fullName: 'JOHN PAUL SMITH',
          department: 'High School Department',
          position: 'Teacher',
          email: 'john.smith@gpc.edu',
          phone: '09123456789',
          dateHired: '2014-12-09',
          employmentType: 'Regular',
          registeredFaceFile: 'face_john.jpg',
          password: 'password123',
          status: 'active',
        },
        {
          employeeId: '15-GPC-00002',
          firstName: 'MARIA',
          middleName: 'ANGELES',
          lastName: 'CRUZ',
          fullName: 'MARIA ANGELES CRUZ',
          department: 'Elementary Department',
          position: 'Teacher',
          email: 'maria.cruz@gpc.edu',
          phone: '09123456790',
          dateHired: '2014-06-15',
          employmentType: 'Regular',
          registeredFaceFile: 'face_maria.jpg',
          password: 'password123',
          status: 'active',
        },
        {
          employeeId: '15-GPC-00003',
          firstName: 'CARLOS',
          middleName: 'MANUEL',
          lastName: 'REYES',
          fullName: 'CARLOS MANUEL REYES',
          department: 'College Department',
          position: 'Professor',
          email: 'carlos.reyes@gpc.edu',
          phone: '09123456791',
          dateHired: '2004-08-20',
          employmentType: 'Regular',
          registeredFaceFile: 'face_carlos.jpg',
          password: 'password123',
          status: 'active',
        },
        {
          employeeId: '15-GPC-00004',
          firstName: 'ANNA',
          middleName: 'LUCIA',
          lastName: 'SANTOS',
          fullName: 'ANNA LUCIA SANTOS',
          department: 'Administration Department',
          position: 'Admin Officer',
          email: 'anna.santos@gpc.edu',
          phone: '09123456792',
          dateHired: '2005-03-10',
          employmentType: 'Regular',
          registeredFaceFile: 'face_anna.jpg',
          password: 'password123',
          status: 'active',
        },
      ];

      for (const emp of testEmployees) {
        try {
          const [result] = await connection.execute(
            `INSERT INTO employees (
              employee_id, first_name, middle_name, last_name, full_name, department, position,
              email, phone, date_hired, employment_type, registered_face_file, password, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              emp.employeeId,
              emp.firstName,
              emp.middleName,
              emp.lastName,
              emp.fullName,
              emp.department,
              emp.position,
              emp.email,
              emp.phone,
              emp.dateHired,
              emp.employmentType,
              emp.registeredFaceFile,
              emp.password,
              emp.status,
            ]
          );

          console.log(`✅ Added employee: ${emp.fullName} (hired: ${emp.dateHired})`);
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`⚠️  Employee already exists: ${emp.fullName}`);
          } else {
            console.error(`❌ Error adding ${emp.fullName}:`, error.message);
          }
        }
      }
    }

    // Now show all employees eligible for loyalty awards (10+ years of service)
    const [eligibleRows] = await connection.execute(
      `SELECT 
        employee_id, 
        full_name, 
        department, 
        position, 
        date_hired, 
        YEAR(CURDATE()) - YEAR(date_hired) - 
        (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(date_hired, '%m%d')) as years_of_service,
        status
      FROM employees 
      WHERE date_hired IS NOT NULL 
      AND (status = 'active' OR date_of_leaving IS NULL OR date_of_leaving = '')
      ORDER BY years_of_service DESC`
    );

    console.log('\n=== All Employees with Years of Service ===');
    eligibleRows.forEach((emp) => {
      const eligible = emp.years_of_service >= 10 && emp.years_of_service % 10 === 0 ? '✅ ELIGIBLE' : '';
      console.log(
        `${emp.employee_id.padEnd(15)} | ${emp.full_name.padEnd(25)} | ${emp.department.padEnd(25)} | Years: ${emp.years_of_service} ${eligible}`
      );
    });

    const eligibleCount = eligibleRows.filter(
      (emp) => emp.years_of_service >= 10 && emp.years_of_service % 10 === 0
    ).length;
    console.log(`\n✅ Total eligible for loyalty awards: ${eligibleCount}`);

    connection.release();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

addEmployeesWithOldHireDates();
