require("dotenv").config();
const mysql = require("mysql2/promise");

async function checkDesignationsByDept() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hrm",
  });

  try {
    const [designations] = await connection.execute(`
      SELECT d.id, d.name, d.department_id, dept.name as department_name 
      FROM designations d
      LEFT JOIN departments dept ON d.department_id = dept.id
      ORDER BY dept.name, d.name
    `);
    
    console.log("All Designations by Department:");
    designations.forEach(d => {
      console.log(`  [${d.department_id}] ${d.department_name}: ${d.name}`);
    });
    
    console.log("\n\nCount by Department:");
    const [counts] = await connection.execute(`
      SELECT dept.name, COUNT(d.id) as count
      FROM departments dept
      LEFT JOIN designations d ON dept.id = d.department_id
      GROUP BY dept.id, dept.name
      ORDER BY dept.name
    `);
    
    counts.forEach(c => {
      console.log(`  ${c.name}: ${c.count} designations`);
    });
  } finally {
    await connection.end();
  }
}

checkDesignationsByDept();
