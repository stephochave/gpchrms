import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { DbLeaveRequest } from '../types';
import { logActivity, getClientIp } from '../utils/activityLogger';

const router = Router();
let leaveTableReady = false;

// Ensure the leave_requests table exists (helps if migration wasn't run)
const ensureLeaveTable = async () => {
  if (leaveTableReady) return;
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS leave_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id VARCHAR(50) NOT NULL,
      employee_name VARCHAR(180) NOT NULL,
      leave_type ENUM('vacation', 'sick', 'emergency', 'unpaid', 'other') NOT NULL DEFAULT 'vacation',
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      reason TEXT NULL,
      status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
      admin_comment TEXT NULL,
      decided_by VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_employee_id (employee_id),
      INDEX idx_status (status),
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

const mapLeaveRow = (row: DbLeaveRequest) => ({
  id: String(row.id),
  employeeId: row.employee_id,
  employeeName: row.employee_name,
  leaveType: row.leave_type,
  startDate: row.start_date,
  endDate: row.end_date,
  reason: row.reason || null,
  status: row.status,
  adminComment: row.admin_comment || null,
  decidedBy: row.decided_by || null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// GET /leaves - list leave requests with optional filters
router.get('/', async (req, res) => {
  const { status, employeeId } = req.query;

  try {
    await ensureLeaveTable();
    const conditions: string[] = [];
    const params: any[] = [];

    if (status && typeof status === 'string' && ['pending', 'approved', 'rejected'].includes(status)) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (employeeId && typeof employeeId === 'string') {
      conditions.push('employee_id = ?');
      params.push(employeeId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT id, employee_id, employee_name, leave_type, start_date, end_date, reason,
              status, admin_comment, decided_by, created_at, updated_at
       FROM leave_requests
       ${whereClause}
       ORDER BY status = 'pending' DESC, created_at DESC`,
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
      `SELECT id, employee_id, employee_name, leave_type, start_date, end_date, reason,
              status, admin_comment, decided_by, created_at, updated_at
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

  try {
    await ensureLeaveTable();
    const [result] = await pool.execute(
      `INSERT INTO leave_requests 
         (employee_id, employee_name, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [employeeId, employeeName, leaveType, startDate, endDate, reason || null],
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
      `SELECT id, employee_id, employee_name, leave_type, start_date, end_date, reason,
              status, admin_comment, decided_by, created_at, updated_at
       FROM leave_requests
       WHERE id = ?`,
      [req.params.id],
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    await pool.execute(
      `UPDATE leave_requests
       SET status = ?, admin_comment = ?, decided_by = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, adminComment || null, decidedBy || req.body.updatedBy || null, req.params.id],
    );

    const [updatedRows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT id, employee_id, employee_name, leave_type, start_date, end_date, reason,
              status, admin_comment, decided_by, created_at, updated_at
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

export default router;
