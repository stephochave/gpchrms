import { pool } from "../db";
import { logActivity } from "./activityLogger";

/**
 * Automatically mark employees as absent if they have no attendance record by 4:00 PM.
 *
 * Logic:
 * - For today's date, find all active employees.
 * - For each active employee that does NOT have an attendance row for today,
 *   insert an `absent` attendance record.
 */
export const autoMarkAbsentForToday = async () => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Server-local time, use 24h clock
  const now = new Date();
  const hour = now.getHours();

  // Safety: only run logic if it's already 16:00 (4 PM) or later
  if (hour < 16) {
    return;
  }

  try {
    // Get all active employees with their basic info
    const [employees] = await pool.execute<any[]>(
      `SELECT employee_id, full_name 
       FROM employees 
       WHERE status = 'active'`
    );

    if (!employees || employees.length === 0) {
      return;
    }

    // Get all attendance records for today
    const [attendanceRows] = await pool.execute<any[]>(
      `SELECT employee_id 
       FROM attendance 
       WHERE date = ?`,
      [today]
    );

    const attendedSet = new Set(
      attendanceRows.map((row) => String(row.employee_id))
    );

    const employeesToMarkAbsent = employees.filter(
      (emp) => !attendedSet.has(String(emp.employee_id))
    );

    if (employeesToMarkAbsent.length === 0) {
      return;
    }

    // Insert absent records in a single bulk INSERT
    const valuesPlaceholders = employeesToMarkAbsent
      .map(() => "(?, ?, ?, NULL, NULL, 'absent', ?, NULL, NULL)")
      .join(", ");

    const params: any[] = [];
    for (const emp of employeesToMarkAbsent) {
      params.push(
        emp.employee_id,
        emp.full_name || "",
        today,
        "Auto-marked absent (no attendance recorded by 4:00 PM)"
      );
    }

    await pool.execute(
      `INSERT INTO attendance
        (employee_id, employee_name, date, check_in, check_out, status, notes, check_in_image, check_out_image)
       VALUES ${valuesPlaceholders}`,
      params
    );

    // Log one aggregate activity entry
    await logActivity({
      userName: "System",
      actionType: "CREATE",
      resourceType: "Attendance",
      resourceId: null,
      resourceName: `Auto-absent for ${today}`,
      description: `Automatically marked ${employeesToMarkAbsent.length} employee(s) as absent for ${today} (no attendance by 4:00 PM).`,
      status: "success",
      metadata: {
        date: today,
        autoAbsentCount: employeesToMarkAbsent.length,
      },
    });
  } catch (error) {
    console.error(
      "[autoMarkAbsentForToday] Error while auto-marking absences:",
      error
    );
  }
};


