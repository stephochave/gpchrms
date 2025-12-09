require("dotenv").config();
const mysql = require("mysql2/promise");

async function checkDepartments() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hrm",
  });

  try {
    const [departments] = await connection.execute("SELECT id, name FROM departments ORDER BY name");
    console.log("Current departments in database:");
    departments.forEach(dept => {
      console.log(`  - [${dept.id}] ${dept.name}`);
    });
  } finally {
    await connection.end();
  }
}

checkDepartments();
