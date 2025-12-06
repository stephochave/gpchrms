/**
 * Leave Management Routes
 * Handles leave types, leave balances, and leave requests
 */

import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { DbLeaveType, DbLeaveBalance, DbLeaveRequest } from '../types';
import { logActivity, getClientIp } from '../utils/activityLogger';

const router = Router();

// ============================================================================
// LEAVE TYPES MANAGEMENT
// ============================================================================

// GET /leave/types - Get all leave types
router.get('/types', async (req, res) => {
  try {
    const [rows] = await pool.execute<DbLeaveType[]>(
      `SELECT id, name, code, days_per_year, description, is_active, created_at, updated_at
       FROM leave_types
       WHERE is_active = TRUE
       ORDER BY name ASC`
    );

    return res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching leave types', error);
    return res.status(500).json({ message: 'Error fetching leave types' });
  }
});

// POST /leave/types - Create new leave type (Admin only)
router.post('/types', async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    code: z.string().min(1).max(20),
    daysPerYear: z.number().min(0),
    description: z.string().optional().nullable(),
  });

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid request', errors: parseResult.error.flatten().fieldErrors });
  }

  const { name, code, daysPerYear, description } = parseResult.data;

  try {
    const [result] = await pool.execute(
      `INSERT INTO leave_types (name, code, days_per_year, description, is_active)
       VALUES (?, ?, ?, ?, TRUE)`,
      [name, code, daysPerYear, description || null]
    );

    await logActivity({
      userName: req.body.createdBy || 'Admin',
      actionType: 'CREATE',
      resourceType: 'LeaveType',
      resourceId: String((result as any).insertId),
      resourceName: name,
      description: `Created leave type: ${name} (${code})`,
      ipAddress: getClientIp(req),
      status: 'success',
    });

    return res.status(201).json({ message: 'Leave type created successfully' });
  } catch (error: any) {
    console.error('Error creating leave type', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Leave type with this code already exists' });
    }
    return res.status(500).json({ message: 'Error creating leave type' });
  }
});

// ============================================================================
// LEAVE BALANCES
// ============================================================================

// GET /leave/balance/:employeeId - Get leave balances for an employee
router.get('/balance/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const { schoolYear } = req.query;

  try {
    const currentSchoolYear = schoolYear || getCurrentSchoolYear();

    const [rows] = await pool.execute<DbLeaveBalance[]>(
      `SELECT lb.id, lb.employee_id, lb.leave_type_id, lb.school_year,
              lb.total_days, lb.used_days, lb.pending_days, lb.remaining_days,
              lt.name as leave_type_name, lt.code as leave_type_code,
              lb.created_at, lb.updated_at
       FROM leave_balances lb
       JOIN leave_types lt ON lb.leave_type_id = lt.id
       WHERE lb.employee_id = ? AND lb.school_year = ?
       ORDER BY lt.name ASC`,
      [employeeId, currentSchoolYear]
    );

    return res.json({ data: rows, schoolYear: currentSchoolYear });
  } catch (error) {
    console.error('Error fetching leave balance', error);
    return res.status(500).json({ message: 'Error fetching leave balance' });
  }
});

// POST /leave/balance/initialize - Initialize leave balances for employee (Admin)
router.post('/balance/initialize', async (req, res) => {
  const schema = z.object({
    employeeId: z.string().min(1),
    schoolYear: z.string().optional(),
  });

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid request', errors: parseResult.error.flatten().fieldErrors });
  }

  const { employeeId, schoolYear } = parseResult.data;
  const currentSchoolYear = schoolYear || getCurrentSchoolYear();

  try {
    // Get all active leave types
    const [leaveTypes] = await pool.execute<DbLeaveType[]>(
      `SELECT id, days_per_year FROM leave_types WHERE is_active = TRUE`
    );

    // Initialize balance for each leave type
    for (const leaveType of leaveTypes) {
      await pool.execute(
        `INSERT INTO leave_balances (employee_id, leave_type_id, school_year, total_days, used_days, pending_days)
         VALUES (?, ?, ?, ?, 0, 0)
         ON DUPLICATE KEY UPDATE total_days = VALUES(total_days)`,
        [employeeId, leaveType.id, currentSchoolYear, leaveType.days_per_year]
      );
    }

    return res.json({ message: 'Leave balances initialized successfully' });
  } catch (error) {
    console.error('Error initializing leave balances', error);
    return res.status(500).json({ message: 'Error initializing leave balances' });
  }
});

// ============================================================================
// LEAVE REQUESTS
// ============================================================================

// GET /leave/requests - Get leave requests with filters
router.get('/requests', async (req, res) => {
  const { employeeId, status, startDate, endDate } = req.query;

  try {
    const conditions: string[] = [];
    const params: any[] = [];

    if (employeeId) {
      conditions.push('lr.employee_id = ?');
      params.push(employeeId);
    }

    if (status) {
      conditions.push('lr.status = ?');
      params.push(status);
    }

    if (startDate) {
      conditions.push('lr.start_date >= ?');
      params.push(startDate);
    }

    if (endDate) {
      conditions.push('lr.end_date <= ?');
      params.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT lr.*, lt.name as leave_type_name, lt.code as leave_type_code
       FROM leave_requests lr
       JOIN leave_types lt ON lr.leave_type_id = lt.id
       ${whereClause}
       ORDER BY lr.created_at DESC`,
      params
    );

    return res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching leave requests', error);
    return res.status(500).json({ message: 'Error fetching leave requests' });
  }
});

// POST /leave/requests - Submit new leave request
router.post('/requests', async (req, res) => {
  const schema = z.object({
    employeeId: z.string().min(1),
    employeeName: z.string().min(1),
    leaveTypeId: z.number().int().positive(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    totalDays: z.number().positive(),
    reason: z.string().min(1),
    appealReason: z.string().optional().nullable(),
  });

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid request', errors: parseResult.error.flatten().fieldErrors });
  }

  const { employeeId, employeeName, leaveTypeId, startDate, endDate, totalDays, reason, appealReason } = parseResult.data;

  try {
    // Check if employee has sufficient balance
    const schoolYear = getCurrentSchoolYear();
    const [balanceRows] = await pool.execute<DbLeaveBalance[]>(
      `SELECT remaining_days FROM leave_balances 
       WHERE employee_id = ? AND leave_type_id = ? AND school_year = ?`,
      [employeeId, leaveTypeId, schoolYear]
    );

    const hasSufficientBalance = balanceRows.length > 0 && balanceRows[0].remaining_days >= totalDays;

    const [result] = await pool.execute(
      `INSERT INTO leave_requests 
       (employee_id, employee_name, leave_type_id, start_date, end_date, total_days, reason, status, appeal_reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeId,
        employeeName,
        leaveTypeId,
        startDate,
        endDate,
        totalDays,
        reason,
        hasSufficientBalance ? 'pending' : 'pending',
        hasSufficientBalance ? null : (appealReason || 'Insufficient balance - requires approval'),
      ]
    );

    // Update pending days in balance
    if (hasSufficientBalance) {
      await pool.execute(
        `UPDATE leave_balances 
         SET pending_days = pending_days + ? 
         WHERE employee_id = ? AND leave_type_id = ? AND school_year = ?`,
        [totalDays, employeeId, leaveTypeId, schoolYear]
      );
    }

    await logActivity({
      userName: employeeName,
      actionType: 'CREATE',
      resourceType: 'LeaveRequest',
      resourceId: String((result as any).insertId),
      resourceName: `Leave request for ${employeeName}`,
      description: `Submitted leave request from ${startDate} to ${endDate} (${totalDays} days)`,
      ipAddress: getClientIp(req),
      status: 'success',
    });

    return res.status(201).json({ 
      message: 'Leave request submitted successfully',
      requiresAppeal: !hasSufficientBalance
    });
  } catch (error) {
    console.error('Error creating leave request', error);
    return res.status(500).json({ message: 'Error creating leave request' });
  }
});

// PUT /leave/requests/:id/review - Approve or reject leave request (Admin)
router.put('/requests/:id/review', async (req, res) => {
  const schema = z.object({
    status: z.enum(['approved', 'rejected']),
    reviewedBy: z.string().min(1),
    reviewNotes: z.string().optional().nullable(),
  });

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid request', errors: parseResult.error.flatten().fieldErrors });
  }

  const { status, reviewedBy, reviewNotes } = parseResult.data;
  const requestId = req.params.id;

  try {
    // Get the leave request details
    const [requestRows] = await pool.execute<DbLeaveRequest[]>(
      `SELECT * FROM leave_requests WHERE id = ?`,
      [requestId]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    const leaveRequest = requestRows[0];
    const schoolYear = getCurrentSchoolYear();

    // Update request status
    await pool.execute(
      `UPDATE leave_requests 
       SET status = ?, reviewed_by = ?, reviewed_at = NOW(), review_notes = ?
       WHERE id = ?`,
      [status, reviewedBy, reviewNotes || null, requestId]
    );

    // Update leave balance based on approval/rejection
    if (status === 'approved') {
      // Move from pending to used
      await pool.execute(
        `UPDATE leave_balances 
         SET pending_days = pending_days - ?, used_days = used_days + ?
         WHERE employee_id = ? AND leave_type_id = ? AND school_year = ?`,
        [leaveRequest.total_days, leaveRequest.total_days, leaveRequest.employee_id, leaveRequest.leave_type_id, schoolYear]
      );
    } else {
      // Remove from pending
      await pool.execute(
        `UPDATE leave_balances 
         SET pending_days = pending_days - ?
         WHERE employee_id = ? AND leave_type_id = ? AND school_year = ?`,
        [leaveRequest.total_days, leaveRequest.employee_id, leaveRequest.leave_type_id, schoolYear]
      );
    }

    await logActivity({
      userName: reviewedBy,
      actionType: 'UPDATE',
      resourceType: 'LeaveRequest',
      resourceId: requestId,
      resourceName: `Leave request for ${leaveRequest.employee_name}`,
      description: `${status === 'approved' ? 'Approved' : 'Rejected'} leave request`,
      ipAddress: getClientIp(req),
      status: 'success',
    });

    return res.json({ message: `Leave request ${status} successfully` });
  } catch (error) {
    console.error('Error reviewing leave request', error);
    return res.status(500).json({ message: 'Error reviewing leave request' });
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get current school year (e.g., "2024-2025")
 * School year starts in June
 */
function getCurrentSchoolYear(): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  if (currentMonth >= 6) {
    // June onwards: current year to next year
    return `${currentYear}-${currentYear + 1}`;
  } else {
    // January to May: previous year to current year
    return `${currentYear - 1}-${currentYear}`;
  }
}

export default router;
