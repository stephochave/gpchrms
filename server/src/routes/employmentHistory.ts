import { Router, Request, Response } from "express";
import { z } from "zod";
import { pool } from "../db";

const router = Router();

interface EmploymentHistoryRecord {
  id: number;
  employee_id: string;
  employment_period: number;
  date_hired: string;
  date_ended: string | null;
  employment_type: string | null;
  department: string | null;
  position: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface EmploymentHistoryResponse {
  id: string;
  employeeId: string;
  employmentPeriod: number;
  dateHired: string;
  dateEnded: string | null;
  employmentType: string | null;
  department: string | null;
  position: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const employmentHistorySchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  dateHired: z.string().min(1, "Date hired is required"),
  dateEnded: z.string().optional().nullable(),
  employmentType: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const mapEmploymentRecord = (
  row: EmploymentHistoryRecord
): EmploymentHistoryResponse => ({
  id: String(row.id),
  employeeId: row.employee_id,
  employmentPeriod: row.employment_period,
  dateHired: row.date_hired,
  dateEnded: row.date_ended,
  employmentType: row.employment_type,
  department: row.department,
  position: row.position,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Initialize employment history table
export const initializeEmploymentHistoryTable = async () => {
  try {
    await pool.execute(`
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

    // Add columns to employees table if they don't exist
    await pool.execute(`
      ALTER TABLE employees 
      ADD COLUMN IF NOT EXISTS employment_count INT DEFAULT 1,
      ADD COLUMN IF NOT EXISTS current_employment_period INT DEFAULT 1
    `);

    console.log("✅ Employment history table initialized");
  } catch (error) {
    console.error("Error initializing employment history table:", error);
  }
};

// Get employment history for an employee
router.get("/employee/:employeeId", async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;

    const [records] = await pool.execute<any[]>(
      `SELECT * FROM employment_history 
       WHERE employee_id = ? 
       ORDER BY employment_period ASC`,
      [employeeId]
    );

    res.json({
      data: (records as EmploymentHistoryRecord[]).map(mapEmploymentRecord),
      total: records.length,
    });
  } catch (error) {
    console.error("Error fetching employment history:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch employment history" });
  }
});

// Get a specific employment period
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [records] = await pool.execute<any[]>(
      `SELECT * FROM employment_history WHERE id = ? LIMIT 1`,
      [id]
    );

    if (records.length === 0) {
      return res
        .status(404)
        .json({ message: "Employment history record not found" });
    }

    res.json({ data: mapEmploymentRecord((records as EmploymentHistoryRecord[])[0]) });
  } catch (error) {
    console.error("Error fetching employment history record:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch employment history record" });
  }
});

// Create a new employment period (rejoin)
router.post("/", async (req: Request, res: Response) => {
  const parseResult = employmentHistorySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const {
    employeeId,
    dateHired,
    dateEnded,
    employmentType,
    department,
    position,
    notes,
  } = parseResult.data;

  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get the current employment count
      const [employeeRecords] = await connection.execute<any[]>(
        `SELECT employment_count, current_employment_period FROM employees WHERE employee_id = ?`,
        [employeeId]
      );

      if (employeeRecords.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Employee not found" });
      }

      const currentCount = (employeeRecords[0] as any).employment_count || 1;
      const newPeriod = currentCount + 1;

      // Insert new employment history record
      await connection.execute(
        `INSERT INTO employment_history 
         (employee_id, employment_period, date_hired, date_ended, employment_type, department, position, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          employeeId,
          newPeriod,
          dateHired,
          dateEnded || null,
          employmentType || null,
          department || null,
          position || null,
          notes || null,
        ]
      );

      // Update employee's employment count and current period
      await connection.execute(
        `UPDATE employees 
         SET employment_count = ?, current_employment_period = ?,
             date_hired = ?, date_of_leaving = ?, employment_type = ?
         WHERE employee_id = ?`,
        [
          newPeriod,
          newPeriod,
          dateHired,
          dateEnded || null,
          employmentType || null,
          employeeId,
        ]
      );

      await connection.commit();

      res.json({
        message: "Employment history record created successfully",
        employmentPeriod: newPeriod,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error creating employment history record:", error);
    res
      .status(500)
      .json({ message: "Failed to create employment history record" });
  }
});

// Update employment period (e.g., end date)
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateSchema = z.object({
    dateEnded: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  });

  const parseResult = updateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const { dateEnded, notes } = parseResult.data;

  try {
    await pool.execute(
      `UPDATE employment_history 
       SET date_ended = ?, notes = ?
       WHERE id = ?`,
      [dateEnded || null, notes || null, id]
    );

    res.json({ message: "Employment history record updated successfully" });
  } catch (error) {
    console.error("Error updating employment history record:", error);
    res
      .status(500)
      .json({ message: "Failed to update employment history record" });
  }
});

// Delete employment period
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get the record to find employee ID
      const [records] = await connection.execute<any[]>(
        `SELECT * FROM employment_history WHERE id = ?`,
        [id]
      );

      if (records.length === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ message: "Employment history record not found" });
      }

      const employeeId = (records[0] as any).employee_id;

      // Delete the record
      await connection.execute(
        `DELETE FROM employment_history WHERE id = ?`,
        [id]
      );

      // Recalculate employment count
      const [remainingRecords] = await connection.execute<any[]>(
        `SELECT COUNT(*) as count FROM employment_history WHERE employee_id = ?`,
        [employeeId]
      );

      const newCount = (remainingRecords[0] as any).count || 1;

      // Update employee's employment count
      await connection.execute(
        `UPDATE employees SET employment_count = ? WHERE employee_id = ?`,
        [newCount, employeeId]
      );

      await connection.commit();

      res.json({ message: "Employment history record deleted successfully" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error deleting employment history record:", error);
    res
      .status(500)
      .json({ message: "Failed to delete employment history record" });
  }
});

export default router;
