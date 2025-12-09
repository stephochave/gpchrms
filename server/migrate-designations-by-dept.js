require("dotenv").config();
const mysql = require("mysql2/promise");

const designationsByDepartment = {
  "Executive & Directors": [
    "Chairman of the Board of Director",
    "Board of Directors Vice Chairman",
    "Members of the Board of Directors",
    "Legal Counsel Corporate Secretary",
    "External Auditor",
    "School President",
    "Legal Consultant"
  ],
  "Administration Department": [
    "Human Resource Head",
    "Admin Service Head",
    "Records Officer",
    "Benefit Assistant",
    "Clerk",
    "Nurse",
    "IT Coordinator",
    "Property Custodian",
    "Supply Officer",
    "Maintenance"
  ],
  "Finance Departmet": [
    "Treasurer",
    "Accountant",
    "Internal Auditor",
    "Cashier",
    "Assistant Cashier",
    "Bookkeeper",
    "Accounting Clerks"
  ],
  "Elementary Department": [
    "Elementary Principal",
    "Elementary Registrar",
    "Elementary Coordinator",
    "Guidance Counselor",
    "Librarian in Charge",
    "Elementary Faculty Members"
  ],
  "High School Department": [
    "High School Principal",
    "High School Registrar",
    "Guidance Counselor",
    "Records Officer",
    "Encoder",
    "Librarian in Charge",
    "Senior High School Coordinator",
    "Junior High School Coordinator",
    "TechVoc Coordinator",
    "Program Coordinator",
    "Housekeeping Trainer",
    "Cookery Trainer",
    "FBS Trainer (Food and Beverage Services)",
    "EIM Trainer (Electrical Installation and Maintenance)",
    "High School Faculty Members"
  ],
  "College Department": [
    "Dean of College of Teacher Education",
    "Dean of College of Business Education",
    "School Librarian",
    "Assistant Librarian",
    "Research and Development Coordinator",
    "Alumni Affairs Coordinator",
    "NSTP Coordinator (National Service Training Program)",
    "MIS Coordinator (Management Information Systems)",
    "College Guidance Counselor",
    "Student Affairs Head",
    "College Faculty Members"
  ]
};

async function migrateAndSeedDesignations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hrm",
  });

  try {
    console.log("🔄 Running migration to add department_id to designations...");
    
    // Check if department_id column exists
    const [columns] = await connection.execute(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'designations' AND COLUMN_NAME = 'department_id'"
    );
    
    if (columns.length === 0) {
      await connection.execute("ALTER TABLE designations ADD COLUMN department_id INT AFTER id");
      console.log("✅ Added department_id column");
    }
    
    // Add foreign key constraint
    try {
      await connection.execute(
        "ALTER TABLE designations ADD FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE"
      );
      console.log("✅ Added foreign key constraint");
    } catch (e) {
      if (e.code !== "ER_DUP_KEYNAME") throw e;
      console.log("✅ Foreign key constraint already exists");
    }
    
    // Try to drop the old name unique constraint
    try {
      await connection.execute("ALTER TABLE designations DROP INDEX `name`");
      console.log("✅ Dropped old name unique constraint");
    } catch (e) {
      if (e.code !== "ER_CANT_DROP_FIELD_OR_KEY") throw e;
      console.log("✅ Old name constraint already dropped");
    }
    
    // Add new composite unique constraint
    try {
      await connection.execute(
        "ALTER TABLE designations ADD UNIQUE KEY unique_designation_per_dept (name, department_id)"
      );
      console.log("✅ Added composite unique constraint");
    } catch (e) {
      if (e.code !== "ER_DUP_KEYNAME") throw e;
      console.log("✅ Composite unique constraint already exists");
    }

    // Clear existing designations
    console.log("\n🗑️  Clearing existing designations...");
    await connection.execute("DELETE FROM designations");
    console.log("✅ Cleared existing designations");

    // Seed designations by department
    console.log("\n🌱 Seeding designations by department...");
    let totalCount = 0;

    for (const [deptName, designations] of Object.entries(designationsByDepartment)) {
      // Get department ID
      const [deptRows] = await connection.execute(
        "SELECT id FROM departments WHERE name = ?",
        [deptName]
      );

      if (deptRows.length === 0) {
        console.log(`⚠️  Department "${deptName}" not found, skipping...`);
        continue;
      }

      const deptId = deptRows[0].id;
      
      for (const designation of designations) {
        await connection.execute(
          "INSERT INTO designations (name, department_id) VALUES (?, ?)",
          [designation, deptId]
        );
        totalCount++;
      }

      console.log(`✅ Added ${designations.length} designations to ${deptName}`);
    }

    console.log(`\n✅ Successfully migrated and seeded ${totalCount} designations!`);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

migrateAndSeedDesignations();
