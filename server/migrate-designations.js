const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'hrm',
} = process.env;

// Map using department names as they actually appear in the database
const designationsByDepartment = {
  'Administration Department': [
    'Vice President for Administration',
    'Human Resource Head',
    'Admin officer',
    'Records Officer',
    'Clerk',
    'Nurse',
    'IT Coordinator',
    'Property Custodian',
    'Supply Officer',
    'Maintenance (3 securities, 5 utilities)',
  ],
  'Finance Departmet': [ // Note: misspelled as it is in database
    'Vice President for Finance',
    'Treasurer',
    'Accountant',
    'Internal Auditor',
    'Cashier',
    'Assistant Cashier',
    'Bookkeeper',
    'Accounting Clerks (2)',
  ],
  'Elementary Department': [
    'Vice President for Academic Affairs',
    'Elementary Principal',
    'Elementary Registrar',
    'Guidance Counselor',
    'Librarian in charge',
    'Elementary Faculty Member',
  ],
  'High School Department': [
    'High School Principal',
    'High School Registrar',
    'Guidance Counselor',
    'Records Officer',
    'Encoder',
    'Librarian in charge',
    'Senior High School Coordinator',
    'Junior High School Coordinator',
    'TechVoc Coordinator',
    'Program Coordinator',
    'Housekeeping Trainer',
    'Cookery Trainer',
    'FBS Trainer',
    'EIM Trainer',
    'High School Faculty Member',
  ],
  'College Department': [
    'Dean of College of Teacher Education',
    'Dean of College of Business Education',
    'School Librarian',
    'Assistant Librarian',
    'Research and Development Coordinator',
    'Alumni Affairs Coordinator',
    'NSTP Coordinator',
    'MIS Coordinator',
    'College Guidance Counselor',
    'Student Affairs Head',
    'Faculty Member',
  ],
  'Executive & Directors': [
    'Executive Director',
    'President',
    'Vice President',
  ],
};

async function migrateDesignations() {
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

    // First, clear existing designations
    await connection.execute('DELETE FROM designations');
    console.log('🗑️  Cleared existing designations');

    // Get all departments
    const [departments] = await connection.execute('SELECT id, name FROM departments');
    console.log(`📋 Found ${departments.length} departments\n`);

    let totalDesignationsAdded = 0;

    // For each department in the mapping
    for (const [deptName, designations] of Object.entries(designationsByDepartment)) {
      // Find the department ID
      const dept = departments.find(d => d.name === deptName);

      if (!dept) {
        console.log(`⚠️  Department "${deptName}" not found in database`);
        continue;
      }

      console.log(`📌 Processing: ${deptName} (ID: ${dept.id})`);

      // Add each designation for this department
      for (const designation of designations) {
        try {
          await connection.execute(
            'INSERT INTO designations (name, department_id) VALUES (?, ?)',
            [designation, dept.id]
          );
          console.log(`  ✅ Added: ${designation}`);
          totalDesignationsAdded++;
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`  ⏭️  Already exists: ${designation}`);
          } else {
            console.error(`  ❌ Error adding "${designation}":`, error.message);
          }
        }
      }
      console.log('');
    }

    console.log(`✨ Migration complete! Total designations added: ${totalDesignationsAdded}\n`);

    // Display summary
    console.log('📊 Summary by Department:');
    for (const [deptName, designations] of Object.entries(designationsByDepartment)) {
      const dept = departments.find(d => d.name === deptName);
      if (dept) {
        console.log(`  • ${deptName}: ${designations.length} designations`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrateDesignations();
