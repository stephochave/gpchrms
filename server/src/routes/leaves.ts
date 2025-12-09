import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { DbLeaveRequest } from '../types';
import { logActivity, getClientIp } from '../utils/activityLogger';

const router = Router();
let leaveTableReady = false;

// Ensure the leave_requests table exists with multi-level approval (helps if migration wasn't run)
const ensureLeaveTable = async () => {
  if (leaveTableReady) return;
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS leave_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id VARCHAR(50) NOT NULL,
      employee_name VARCHAR(180) NOT NULL,
      employee_department VARCHAR(100) NULL,
      leave_type ENUM('vacation', 'sick', 'emergency', 'unpaid', 'other') NOT NULL DEFAULT 'vacation',
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      reason TEXT NULL,
      status ENUM('pending', 'department_approved', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
      department_head_comment TEXT NULL,
      department_head_approved_by VARCHAR(255) NULL,
      department_head_approved_at TIMESTAMP NULL,
      admin_comment TEXT NULL,
      decided_by VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_employee_id (employee_id),
      INDEX idx_status (status),
      INDEX idx_employee_department (employee_department),
      INDEX idx_start_date (start_date),
      INDEX idx_end_date (end_date)
    );
  `);
  leaveTableReady = true;
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const createLeaveSchema = z
  .object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    employeeName: z.string().min(1, 'Employee name is required'),
    employeeDepartment: z.string().optional().nullable(),
    leaveType: z.enum(['vacation', 'sick', 'emergency', 'unpaid', 'other']),
    startDate: z.string().regex(dateRegex, 'Start date must be in YYYY-MM-DD format'),
    endDate: z.string().regex(dateRegex, 'End date must be in YYYY-MM-DD format'),
    reason: z.string().trim().max(2000).optional().nullable(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date cannot be before start date',
    path: ['endDate'],
  });

const updateStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  adminComment: z.string().trim().max(2000).optional().nullable(),
  decidedBy: z.string().trim().max(255).optional().nullable(),
});

const departmentHeadApprovalSchema = z.object({
  status: z.enum(['department_approved', 'rejected']),
  departmentHeadComment: z.string().trim().max(2000).optional().nullable(),
  approvedBy: z.string().trim().max(255).optional().nullable(),
});

const mapLeaveRow = (row: DbLeaveRequest) => ({
  id: String(row.id),
  employeeId: row.employee_id,
  employeeName: row.employee_name,
  employeeDepartment: row.employee_department || null,
  leaveType: row.leave_type,
  startDate: row.start_date,
  endDate: row.end_date,
  reason: row.reason || null,
  status: row.status,
  departmentHeadComment: row.department_head_comment || null,
  departmentHeadApprovedBy: row.department_head_approved_by || null,
  departmentHeadApprovedAt: row.department_head_approved_at || null,
  adminComment: row.admin_comment || null,
  decidedBy: row.decided_by || null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// GET /leaves - list leave requests with optional filters
router.get('/', async (req, res) => {
  const { status, employeeId, department } = req.query;

  try {
    await ensureLeaveTable();
    const conditions: string[] = [];
    const params: any[] = [];

    if (status && typeof status === 'string' && ['pending', 'department_approved', 'approved', 'rejected'].includes(status)) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (employeeId && typeof employeeId === 'string') {
      conditions.push('employee_id = ?');
      params.push(employeeId);
    }

    if (department && typeof department === 'string') {
      conditions.push('employee_department = ?');
      params.push(department);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT id, employee_id, employee_name, employee_department, leave_type, start_date, end_date, reason,
              status, department_head_comment, department_head_approved_by, department_head_approved_at,
              admin_comment, decided_by, created_at, updated_at
       FROM leave_requests
       ${whereClause}
       ORDER BY status = 'pending' DESC, status = 'department_approved' DESC, created_at DESC`,
      params,
    );

    return res.json({ data: rows.map(mapLeaveRow) });
  } catch (error) {
    console.error('Error fetching leave requests', error);
    return res.status(500).json({ message: 'Unexpected error while fetching leave requests' });
  }
});

// GET /leaves/:id - single leave request
router.get('/:id', async (req, res) => {
  try {
    await ensureLeaveTable();
    const [rows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT id, employee_id, employee_name, employee_department, leave_type, start_date, end_date, reason,
              status, department_head_comment, department_head_approved_by, department_head_approved_at,
              admin_comment, decided_by, created_at, updated_at
       FROM leave_requests
       WHERE id = ?`,
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    return res.json({ data: mapLeaveRow(rows[0]) });
  } catch (error) {
    console.error('Error fetching leave request', error);
    return res.status(500).json({ message: 'Unexpected error while fetching leave request' });
  }
});

// POST /leaves - create new leave request
router.post('/', async (req, res) => {
  const parsed = createLeaveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid request body',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { employeeId, employeeName, leaveType, startDate, endDate, reason } = parsed.data;
  const employeeDepartment = req.body.employeeDepartment || null;

  try {
    await ensureLeaveTable();
    const [result] = await pool.execute(
      `INSERT INTO leave_requests 
         (employee_id, employee_name, employee_department, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [employeeId, employeeName, employeeDepartment, leaveType, startDate, endDate, reason || null],
    );

    const insertId = (result as any).insertId;

    await logActivity({
      userName: req.body.createdBy || employeeName,
      actionType: 'CREATE',
      resourceType: 'Leave',
      resourceId: String(insertId),
      resourceName: `${employeeName} ${startDate} - ${endDate}`,
      description: `Leave request submitted (${leaveType})`,
      ipAddress: getClientIp(req),
      status: 'success',
      metadata: { employeeId, leaveType, startDate, endDate },
    });

    const [rows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT id, employee_id, employee_name, leave_type, start_date, end_date, reason,
              status, admin_comment, decided_by, created_at, updated_at
       FROM leave_requests
       WHERE id = ?`,
      [insertId],
    );

    return res.status(201).json({
      message: 'Leave request submitted',
      data: mapLeaveRow(rows[0]),
    });
  } catch (error) {
    console.error('Error creating leave request', error);
    return res.status(500).json({ message: 'Unexpected error while creating leave request' });
  }
});

// PATCH /leaves/:id/status - approve or reject
router.patch('/:id/status', async (req, res) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid request body',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { status, adminComment, decidedBy } = parsed.data;

  try {
    await ensureLeaveTable();
    const [existingRows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT id, employee_id, employee_name, employee_department, leave_type, start_date, end_date, reason,
              status, department_head_comment, department_head_approved_by, department_head_approved_at,
              admin_comment, decided_by, created_at, updated_at
       FROM leave_requests
       WHERE id = ?`,
      [req.params.id],
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Admin can only approve if department head has already approved
    if (status === 'approved' && existingRows[0].status !== 'department_approved') {
      return res.status(400).json({ 
        message: 'Cannot approve. Leave request must be reviewed and approved by the department head first.' 
      });
    }

    // Admin can only approve 'pending' or 'department_approved' requests
    if (status === 'approved' && !['pending', 'department_approved'].includes(existingRows[0].status)) {
      return res.status(400).json({ 
        message: `Cannot approve. Leave request status is ${existingRows[0].status}.` 
      });
    }

    // Check if approving and if employee has reached limit
    if (status === 'approved') {
      const currentYear = new Date().getFullYear();
      const employeeId = existingRows[0].employee_id;
      
      // Calculate total approved days for current year
      const [leaveRows] = await pool.execute<any[]>(
        `SELECT start_date, end_date
         FROM leave_requests
         WHERE employee_id = ? 
           AND status = 'approved'
           AND YEAR(start_date) = ?`,
        [employeeId, currentYear]
      );
      
      // Calculate total days used
      let totalDaysUsed = 0;
      for (const leave of leaveRows) {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
        totalDaysUsed += days;
      }
      
      // Calculate days for current request
      const requestStart = new Date(existingRows[0].start_date);
      const requestEnd = new Date(existingRows[0].end_date);
      const requestDays = Math.ceil((requestEnd.getTime() - requestStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const maxLeaves = 10;
      const remainingDays = maxLeaves - totalDaysUsed;
      
      if (totalDaysUsed >= maxLeaves) {
        return res.status(400).json({ 
          message: `Cannot approve. ${existingRows[0].employee_name} has already used all ${maxLeaves} leave days for ${currentYear}.`,
          remainingLeaves: 0
        });
      }
      
      if (totalDaysUsed + requestDays > maxLeaves) {
        return res.status(400).json({ 
          message: `Cannot approve. This request requires ${requestDays} days but ${existingRows[0].employee_name} only has ${remainingDays} days remaining for ${currentYear}.`,
          remainingLeaves: remainingDays
        });
      }
    }

    await pool.execute(
      `UPDATE leave_requests
       SET status = ?, admin_comment = ?, decided_by = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, adminComment || null, decidedBy || req.body.updatedBy || null, req.params.id],
    );

    const [updatedRows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT id, employee_id, employee_name, employee_department, leave_type, start_date, end_date, reason,
              status, department_head_comment, department_head_approved_by, department_head_approved_at,
              admin_comment, decided_by, created_at, updated_at
       FROM leave_requests
       WHERE id = ?`,
      [req.params.id],
    );

    await logActivity({
      userName: decidedBy || req.body.updatedBy || 'Admin',
      actionType: 'UPDATE',
      resourceType: 'Leave',
      resourceId: req.params.id,
      resourceName: `${updatedRows[0].employee_name} ${updatedRows[0].start_date} - ${updatedRows[0].end_date}`,
      description: `Leave request ${status}`,
      ipAddress: getClientIp(req),
      status: 'success',
      metadata: { status },
    });

    return res.json({
      message: `Leave request ${status}`,
      data: mapLeaveRow(updatedRows[0]),
    });
  } catch (error) {
    console.error('Error updating leave status', error);
    return res.status(500).json({ message: 'Unexpected error while updating leave status' });
  }
});

// PATCH /leaves/:id/department-approval - department head/dean/principal approval
router.patch('/:id/department-approval', async (req, res) => {
  const parsed = departmentHeadApprovalSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid request body',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { status, departmentHeadComment, approvedBy } = parsed.data;

  try {
    await ensureLeaveTable();
    const [existingRows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT id, employee_id, employee_name, employee_department, leave_type, start_date, end_date, reason,
              status, department_head_comment, department_head_approved_by, department_head_approved_at,
              admin_comment, decided_by, created_at, updated_at
       FROM leave_requests
       WHERE id = ?`,
      [req.params.id],
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Only allow updating if status is 'pending'
    if (existingRows[0].status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot update. Leave request status is already ${existingRows[0].status}.` 
      });
    }

    await pool.execute(
      `UPDATE leave_requests
       SET status = ?, department_head_comment = ?, department_head_approved_by = ?, department_head_approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, departmentHeadComment || null, approvedBy || null, req.params.id],
    );

    const [updatedRows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT id, employee_id, employee_name, employee_department, leave_type, start_date, end_date, reason,
              status, department_head_comment, department_head_approved_by, department_head_approved_at,
              admin_comment, decided_by, created_at, updated_at
       FROM leave_requests
       WHERE id = ?`,
      [req.params.id],
    );

    const actionType = status === 'department_approved' ? 'RECOMMEND' : 'REJECT';
    await logActivity({
      userName: approvedBy || 'Department Head',
      actionType,
      resourceType: 'Leave',
      resourceId: req.params.id,
      resourceName: `${updatedRows[0].employee_name} ${updatedRows[0].start_date} - ${updatedRows[0].end_date}`,
      description: `Leave request ${actionType.toLowerCase()} by department head`,
      ipAddress: getClientIp(req),
      status: 'success',
      metadata: { status },
    });

    return res.json({
      message: `Leave request ${status === 'department_approved' ? 'recommended for approval' : 'rejected'} by department head`,
      data: mapLeaveRow(updatedRows[0]),
    });
  } catch (error) {
    console.error('Error updating department head approval', error);
    return res.status(500).json({ message: 'Unexpected error while updating department head approval' });
  }
});

// GET /leaves/check-department-head - check if current user is a department head
router.get('/check-department-head', async (req, res) => {
  try {
    const { employeeId, department } = req.query;
    
    if (!employeeId || !department) {
      return res.json({ isDepartmentHead: false });
    }

    // Check if the user is a department head, dean, or principal in the same department
    const [rows] = await pool.execute<any[]>(
      `SELECT id, position FROM employees 
       WHERE employee_id = ? AND department = ?
       AND (LOWER(position) LIKE '%head%' OR LOWER(position) LIKE '%dean%' OR LOWER(position) LIKE '%principal%')
       LIMIT 1`,
      [employeeId, department]
    );

    const isDepartmentHead = rows.length > 0;
    return res.json({ isDepartmentHead });
  } catch (error) {
    console.error('Error checking department head status', error);
    return res.json({ isDepartmentHead: false });
  }
});

// GET /leaves/stats/:employeeId - get leave statistics for an employee
router.get('/stats/:employeeId', async (req, res) => {
  try {
    await ensureLeaveTable();
    const { employeeId } = req.params;
    const currentYear = new Date().getFullYear();
    
    // Get all approved leaves for current year and calculate total days
    const [rows] = await pool.execute<any[]>(
      `SELECT start_date, end_date
       FROM leave_requests
       WHERE employee_id = ? 
         AND status = 'approved'`,
      [employeeId]
    );
    
    // Calculate total days used (filter by current year in JavaScript)
    let totalDaysUsed = 0;
    for (const leave of rows) {
      const start = new Date(leave.start_date);
      const startYear = start.getFullYear();
      
      // Only count leaves from the current year
      if (startYear !== currentYear) continue;
      
      const end = new Date(leave.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
      totalDaysUsed += days;
    }
    
    const maxLeaves = 10; // MAX_YEARLY_LEAVES constant
    const remaining = Math.max(0, maxLeaves - totalDaysUsed);
    
    return res.json({
      data: {
        employeeId,
        year: currentYear,
        maxLeaves,
        usedCount: totalDaysUsed,
        remaining
      }
    });
  } catch (error) {
    console.error('Error fetching leave statistics', error);
    return res.status(500).json({ message: 'Unexpected error while fetching leave statistics' });
  }
});

// GET /leaves/stats - get leave statistics for all employees
router.get('/stats', async (req, res) => {
  try {
    await ensureLeaveTable();
    const currentYear = new Date().getFullYear();
    
    // Get all approved leaves for current year
    const [rows] = await pool.execute<any[]>(
      `SELECT 
         employee_id,
         employee_name,
         start_date,
         end_date
       FROM leave_requests
       WHERE status = 'approved'
       ORDER BY employee_name`,
      []
    );
    
    // Group by employee and calculate total days (filter by current year in JavaScript)
    const employeeStats = new Map<string, { employeeId: string, employeeName: string, totalDays: number }>();
    
    for (const leave of rows) {
      const start = new Date(leave.start_date);
      const startYear = start.getFullYear();
      
      // Only count leaves from the current year
      if (startYear !== currentYear) continue;
      
      const end = new Date(leave.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
      
      const existing = employeeStats.get(leave.employee_id);
      if (existing) {
        existing.totalDays += days;
      } else {
        employeeStats.set(leave.employee_id, {
          employeeId: leave.employee_id,
          employeeName: leave.employee_name,
          totalDays: days
        });
      }
    }
    
    const maxLeaves = 10; // MAX_YEARLY_LEAVES constant
    const stats = Array.from(employeeStats.values()).map(emp => ({
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
      year: currentYear,
      maxLeaves,
      usedCount: emp.totalDays,
      remaining: Math.max(0, maxLeaves - emp.totalDays)
    }));
    
    return res.json({ data: stats });
  } catch (error) {
    console.error('Error fetching leave statistics', error);
    return res.status(500).json({ message: 'Unexpected error while fetching leave statistics' });
  }
});

export default router;
