import { Router } from "express";
import { pool } from "../db";

const router = Router();

interface LoyaltyAward {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  yearsOfService: number;
  awardYear: number;
  awardDate: string;
  certificateNumber: string;
  status: "pending" | "approved" | "printed";
  generatedBy: string;
  generatedAt: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
}

interface LoyaltyAwardRow {
  id: number;
  employee_id: string;
  employee_name: string;
  department: string;
  position: string;
  years_of_service: number;
  award_year: number;
  award_date: string;
  certificate_number: string;
  status: "pending" | "approved" | "printed";
  generated_by: string;
  generated_at: string;
  approved_by?: string | null;
  approved_at?: string | null;
}

// Create loyalty awards table if it doesn't exist
export const initializeLoyaltyTable = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS loyalty_awards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(20) NOT NULL,
        employee_name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        position VARCHAR(255),
        years_of_service INT NOT NULL,
        award_year INT NOT NULL,
        award_date VARCHAR(10),
        certificate_number VARCHAR(50) UNIQUE NOT NULL,
        status ENUM('pending', 'approved', 'printed') DEFAULT 'pending',
        generated_by VARCHAR(255) NOT NULL,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_by VARCHAR(255),
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
        UNIQUE KEY unique_award (employee_id, award_year)
      )
    `);
    console.log("✅ Loyalty awards table initialized");
  } catch (error) {
    console.error("Error initializing loyalty awards table:", error);
  }
};

const mapLoyaltyRow = (row: LoyaltyAwardRow): LoyaltyAward => ({
  id: String(row.id),
  employeeId: row.employee_id,
  employeeName: row.employee_name,
  department: row.department,
  position: row.position,
  yearsOfService: row.years_of_service,
  awardYear: row.award_year,
  awardDate: row.award_date,
  certificateNumber: row.certificate_number,
  status: row.status,
  generatedBy: row.generated_by,
  generatedAt: row.generated_at,
  approvedBy: row.approved_by,
  approvedAt: row.approved_at,
});

// Calculate years of service
const calculateYearsOfService = (dateHired: string): number => {
  const hired = new Date(dateHired);
  const today = new Date();
  let years = today.getFullYear() - hired.getFullYear();
  const monthDiff = today.getMonth() - hired.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hired.getDate())) {
    years--;
  }
  return years;
};

// Generate certificate number
const generateCertificateNumber = (employeeId: string, year: number): string => {
  return `CERT-${year}-${employeeId}-${Date.now()}`;
};

// Get eligible employees for loyalty awards
router.get("/eligible", async (req, res) => {
  try {
    // Include employees with hire dates, still working (active or no end date)
    const [employees] = await pool.execute<any[]>(
      `SELECT id, employee_id, full_name, department, position, date_hired, date_of_leaving, status
       FROM employees 
       WHERE date_hired IS NOT NULL 
       AND (status = 'active' OR date_of_leaving IS NULL OR date_of_leaving = '')
       ORDER BY full_name`
    );

    console.log("Total employees found:", employees.length);

    const eligible = employees
      .map((emp: any) => {
        const yearsOfService = calculateYearsOfService(emp.date_hired);
        // Check if they're still working (no end date or active status)
        const isStillWorking = emp.status === 'active' || !emp.date_of_leaving;
        // Eligible if they have at least 10 years of service (10, 11, 12, ... 19, 20, 21, etc.)
        // They qualify for loyalty awards every 10 years starting from their 10th anniversary
        const isEligible = isStillWorking && yearsOfService >= 10;
        
        if (isEligible) {
          console.log(
            `Eligible: ${emp.employee_id} - ${emp.full_name} (${yearsOfService} years, hired: ${emp.date_hired})`
          );
        }
        
        return {
          id: emp.id,
          employeeId: emp.employee_id,
          fullName: emp.full_name,
          department: emp.department,
          position: emp.position,
          dateHired: emp.date_hired,
          yearsOfService,
          isEligible,
          isStillWorking,
        };
      })
      .filter((emp: any) => emp.isEligible);

    console.log("Eligible employees count:", eligible.length);
    res.json({ data: eligible });
  } catch (error) {
    console.error("Error fetching eligible employees:", error);
    res.status(500).json({ message: "Failed to fetch eligible employees" });
  }
});

// Get loyalty awards for current user or all (if admin)
router.get("/", async (req, res) => {
  const { employeeId } = req.query;

  try {
    let query = `SELECT * FROM loyalty_awards`;
    const params: any[] = [];

    if (employeeId) {
      query += ` WHERE employee_id = ?`;
      params.push(employeeId);
    }

    query += ` ORDER BY award_year DESC, created_at DESC`;

    const [rows] = await pool.execute<any[]>(query, params);

    res.json({
      data: rows.map(mapLoyaltyRow),
    });
  } catch (error) {
    console.error("Error fetching loyalty awards:", error);
    res.status(500).json({ message: "Failed to fetch loyalty awards" });
  }
});

// Generate a loyalty award
router.post("/", async (req, res) => {
  const {
    employeeId,
    employeeName,
    department,
    position,
    yearsOfService,
    generatedBy,
  } = req.body;

  try {
    // Validate required fields
    if (!employeeId || !employeeName || !yearsOfService || !generatedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify yearsOfService is valid (at least 10 years)
    if (yearsOfService < 10) {
      return res.status(400).json({
        message: "Employee must have at least 10 years of service",
      });
    }

    const awardYear = new Date().getFullYear();
    const awardDate = new Date().toISOString().split("T")[0];
    const certificateNumber = generateCertificateNumber(employeeId, awardYear);

    // Check if award already exists for this year
    const [existing] = await pool.execute<any[]>(
      `SELECT id FROM loyalty_awards WHERE employee_id = ? AND award_year = ?`,
      [employeeId, awardYear]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: `Loyalty award already generated for ${employeeId} in ${awardYear}`,
      });
    }

    // Insert loyalty award
    const [result] = await pool.execute<any>(
      `INSERT INTO loyalty_awards 
       (employee_id, employee_name, department, position, years_of_service, award_year, award_date, certificate_number, status, generated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        employeeId,
        employeeName,
        department,
        position,
        yearsOfService,
        awardYear,
        awardDate,
        certificateNumber,
        generatedBy,
      ]
    );

    res.json({
      message: "Loyalty award generated successfully",
      id: result.insertId,
      certificateNumber,
    });
  } catch (error) {
    console.error("Error generating loyalty award:", error);
    res.status(500).json({ message: "Failed to generate loyalty award" });
  }
});

// Approve loyalty award (admin only)
router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;
  const { approvedBy } = req.body;

  try {
    if (!approvedBy) {
      return res.status(400).json({ message: "Approver name is required" });
    }

    const approvedAt = new Date().toISOString();

    await pool.execute(
      `UPDATE loyalty_awards 
       SET status = 'approved', approved_by = ?, approved_at = ?
       WHERE id = ?`,
      [approvedBy, approvedAt, id]
    );

    res.json({ message: "Loyalty award approved successfully" });
  } catch (error) {
    console.error("Error approving loyalty award:", error);
    res.status(500).json({ message: "Failed to approve loyalty award" });
  }
});

// Mark as printed (admin only)
router.put("/:id/print", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute(
      `UPDATE loyalty_awards SET status = 'printed' WHERE id = ?`,
      [id]
    );

    res.json({ message: "Loyalty award marked as printed" });
  } catch (error) {
    console.error("Error marking loyalty award as printed:", error);
    res.status(500).json({ message: "Failed to mark loyalty award as printed" });
  }
});

// Delete loyalty award
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute(`DELETE FROM loyalty_awards WHERE id = ?`, [id]);
    res.json({ message: "Loyalty award deleted successfully" });
  } catch (error) {
    console.error("Error deleting loyalty award:", error);
    res.status(500).json({ message: "Failed to delete loyalty award" });
  }
});

export default router;
