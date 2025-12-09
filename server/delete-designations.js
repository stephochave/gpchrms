require("dotenv").config();
const mysql = require("mysql2/promise");

async function deleteAllDesignations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hrms_db",
  });

  try {
    const [result] = await connection.execute("DELETE FROM designations");
    console.log(`✅ Deleted ${result.affectedRows} designations from the database`);
  } catch (error) {
    console.error("❌ Error deleting designations:", error);
  } finally {
    await connection.end();
  }
}

deleteAllDesignations();
