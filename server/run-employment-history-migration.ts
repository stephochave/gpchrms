import "dotenv/config";
import mysql from "mysql2/promise";

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "hrm",
} = process.env;

async function runMigration() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log("✅ Connected to database");

    // Create employment_history table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS employment_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(20) NOT NULL,
        employment_period INT NOT NULL DEFAULT 1,
        date_hired DATE NOT NULL,
        date_ended DATE,
        employment_type VARCHAR(50),
        department VARCHAR(255),
        position VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
        UNIQUE KEY unique_employment_period (employee_id, employment_period),
        INDEX idx_employee_id (employee_id),
        INDEX idx_dates (date_hired, date_ended)
      )
    `);

    console.log("✅ Created employment_history table");

    // Add columns to employees table if they don't exist
    const [columns] = await connection.execute<any[]>(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'employees' AND COLUMN_NAME IN ('employment_count', 'current_employment_period')`
    );

    if (columns.length < 2) {
      await connection.execute(`
        ALTER TABLE employees 
        ADD COLUMN IF NOT EXISTS employment_count INT DEFAULT 1,
        ADD COLUMN IF NOT EXISTS current_employment_period INT DEFAULT 1
      `);
      console.log("✅ Added employment tracking columns to employees table");
    } else {
      console.log("ℹ️  Employment tracking columns already exist");
    }

    console.log("✅ Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
