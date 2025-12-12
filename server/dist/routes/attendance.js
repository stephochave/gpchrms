"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const activityLogger_1 = require("../utils/activityLogger");
const qrCodeGenerator_1 = require("../utils/qrCodeGenerator");
const router = (0, express_1.Router)();
const attendanceSchema = zod_1.z.object({
    employeeId: zod_1.z.string().min(1, 'Employee ID is required'),
    employeeName: zod_1.z.string().min(1, 'Employee name is required'),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    checkIn: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Check-in time must be in HH:MM format').optional().nullable(),
    checkOut: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Check-out time must be in HH:MM format').optional().nullable(),
    status: zod_1.z.enum(['present', 'absent', 'late', 'half-day', 'leave']).default('present'),
    notes: zod_1.z.string().optional().nullable(),
    qrVerified: zod_1.z.boolean().optional(),
    verificationMethod: zod_1.z.enum(['qr', 'manual', 'guard_qr']).optional(),
    lateMinutes: zod_1.z.number().optional().nullable(),
    undertimeMinutes: zod_1.z.number().optional().nullable(),
    overtimeMinutes: zod_1.z.number().optional().nullable(),
});
const updateAttendanceSchema = attendanceSchema.partial().extend({
    employeeId: zod_1.z.string().min(1, 'Employee ID is required'),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
const mapAttendanceRow = (row) => ({
    id: String(row.id),
    employeeId: row.employee_id,
    employeeName: row.employee_name,
    date: row.date,
    checkIn: row.check_in || undefined,
    checkOut: row.check_out || undefined,
    status: row.status,
    notes: row.notes || undefined,
    qrVerified: row.qr_verified,
    verificationMethod: row.verification_method,
    lateMinutes: row.late_minutes || undefined,
    undertimeMinutes: row.undertime_minutes || undefined,
    overtimeMinutes: row.overtime_minutes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});
// GET /attendance - Get all attendance records with optional filters
router.get('/', async (req, res) => {
    const { employeeId, date, startDate, endDate, status } = req.query;
    try {
        const conditions = [];
        const params = [];
        if (employeeId && typeof employeeId === 'string') {
            conditions.push('employee_id = ?');
            params.push(employeeId);
        }
        if (date && typeof date === 'string') {
            conditions.push('date = ?');
            params.push(date);
        }
        if (startDate && typeof startDate === 'string') {
            conditions.push('date >= ?');
            params.push(startDate);
        }
        if (endDate && typeof endDate === 'string') {
            conditions.push('date <= ?');
            params.push(endDate);
        }
        if (status && typeof status === 'string' && ['present', 'absent', 'late', 'half-day', 'leave'].includes(status)) {
            conditions.push('status = ?');
            params.push(status);
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const [rows] = await db_1.pool.execute(`SELECT id, employee_id, employee_name, date, check_in, check_out, status, notes, 
              qr_verified, verification_method, late_minutes, undertime_minutes, overtime_minutes,
              created_at, updated_at
       FROM attendance
       ${whereClause}
       ORDER BY date DESC, check_in DESC`, params);
        return res.json({
            data: rows.map(mapAttendanceRow),
        });
    }
    catch (error) {
        console.error('Error fetching attendance', error);
        return res.status(500).json({ message: 'Unexpected error while fetching attendance' });
    }
});
// GET /attendance/:id - Get single attendance record
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db_1.pool.execute(`SELECT id, employee_id, employee_name, date, check_in, check_out, status, notes, 
              qr_verified, verification_method, late_minutes, undertime_minutes, overtime_minutes,
              created_at, updated_at
       FROM attendance
       WHERE id = ?`, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        return res.json({
            data: mapAttendanceRow(rows[0]),
        });
    }
    catch (error) {
        console.error('Error fetching attendance', error);
        return res.status(500).json({ message: 'Unexpected error while fetching attendance' });
    }
});
// POST /attendance - Create new attendance record
router.post('/', async (req, res) => {
    const parseResult = attendanceSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: 'Invalid request body',
            errors: parseResult.error.flatten().fieldErrors,
        });
    }
    const { employeeId, employeeName, date, checkIn, checkOut, status, notes, qrVerified, verificationMethod, lateMinutes, undertimeMinutes, overtimeMinutes, } = parseResult.data;
    try {
        const [result] = await db_1.pool.execute(`INSERT INTO attendance 
       (employee_id, employee_name, date, check_in, check_out, status, notes, 
        qr_verified, verification_method, late_minutes, undertime_minutes, overtime_minutes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         check_in = COALESCE(VALUES(check_in), check_in),
         check_out = COALESCE(VALUES(check_out), check_out),
         status = VALUES(status),
         notes = COALESCE(VALUES(notes), notes),
         qr_verified = COALESCE(VALUES(qr_verified), qr_verified),
         verification_method = COALESCE(VALUES(verification_method), verification_method),
         late_minutes = COALESCE(VALUES(late_minutes), late_minutes),
         undertime_minutes = COALESCE(VALUES(undertime_minutes), undertime_minutes),
         overtime_minutes = COALESCE(VALUES(overtime_minutes), overtime_minutes),
         updated_at = CURRENT_TIMESTAMP`, [
            employeeId,
            employeeName,
            date,
            checkIn || null,
            checkOut || null,
            status,
            notes || null,
            qrVerified || false,
            verificationMethod || 'manual',
            lateMinutes || null,
            undertimeMinutes || null,
            overtimeMinutes || null,
        ]);
        const insertId = result.insertId;
        const affectedRows = result.affectedRows;
        // If it was an update (insertId is 0), query by employee_id and date instead
        let recordId = insertId;
        if (insertId === 0 && affectedRows > 0) {
            const [existingRows] = await db_1.pool.execute(`SELECT id FROM attendance WHERE employee_id = ? AND date = ?`, [employeeId, date]);
            if (existingRows && existingRows.length > 0) {
                recordId = existingRows[0].id;
            }
        }
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.createdBy || 'System',
            actionType: recordId && insertId > 0 ? 'CREATE' : 'UPDATE',
            resourceType: 'Attendance',
            resourceId: String(recordId),
            resourceName: `${employeeName} - ${date}`,
            description: `Attendance record ${recordId && insertId > 0 ? 'created' : 'updated'} for ${employeeName} (${employeeId}) on ${date}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'success',
            metadata: { employeeId, date, status },
        });
        const [newRows] = await db_1.pool.execute(`SELECT id, employee_id, employee_name, date, check_in, check_out, status, notes, 
              qr_verified, verification_method, late_minutes, undertime_minutes, overtime_minutes,
              created_at, updated_at
       FROM attendance
       WHERE employee_id = ? AND date = ?`, [employeeId, date]);
        if (!newRows || newRows.length === 0) {
            return res.status(500).json({ message: 'Failed to retrieve attendance record after save' });
        }
        return res.status(201).json({
            message: 'Attendance record saved successfully',
            data: mapAttendanceRow(newRows[0]),
        });
    }
    catch (error) {
        console.error('Error creating attendance', error);
        await (0, activityLogger_1.logActivity)({
            userName: req.body.createdBy || 'System',
            actionType: 'CREATE',
            resourceType: 'Attendance',
            resourceId: 'N/A',
            resourceName: `${employeeName} - ${date}`,
            description: `Failed to create attendance record for ${employeeName}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'failed',
            metadata: { employeeId, date, error: error instanceof Error ? error.message : 'Unknown error' },
        });
        return res.status(500).json({
            message: 'Unexpected error while creating attendance record. Please try again.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// PUT /attendance/:id - Update attendance record
router.put('/:id', async (req, res) => {
    const parseResult = updateAttendanceSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: 'Invalid request body',
            errors: parseResult.error.flatten().fieldErrors,
        });
    }
    const { employeeId, employeeName, date, checkIn, checkOut, status, notes, qrVerified, verificationMethod, lateMinutes, undertimeMinutes, overtimeMinutes, } = parseResult.data;
    try {
        // Build update query dynamically
        const updates = [];
        const params = [];
        if (employeeName !== undefined) {
            updates.push('employee_name = ?');
            params.push(employeeName);
        }
        if (checkIn !== undefined) {
            updates.push('check_in = ?');
            params.push(checkIn || null);
        }
        if (checkOut !== undefined) {
            updates.push('check_out = ?');
            params.push(checkOut || null);
        }
        if (status !== undefined) {
            updates.push('status = ?');
            params.push(status);
        }
        if (notes !== undefined) {
            updates.push('notes = ?');
            params.push(notes || null);
        }
        if (qrVerified !== undefined) {
            updates.push('qr_verified = ?');
            params.push(qrVerified);
        }
        if (verificationMethod !== undefined) {
            updates.push('verification_method = ?');
            params.push(verificationMethod);
        }
        if (lateMinutes !== undefined) {
            updates.push('late_minutes = ?');
            params.push(lateMinutes || null);
        }
        if (undertimeMinutes !== undefined) {
            updates.push('undertime_minutes = ?');
            params.push(undertimeMinutes || null);
        }
        if (overtimeMinutes !== undefined) {
            updates.push('overtime_minutes = ?');
            params.push(overtimeMinutes || null);
        }
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        params.push(req.params.id);
        await db_1.pool.execute(`UPDATE attendance 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`, params);
        // Get updated record
        const [updatedRows] = await db_1.pool.execute(`SELECT id, employee_id, employee_name, date, check_in, check_out, status, notes, 
              qr_verified, verification_method, late_minutes, undertime_minutes, overtime_minutes,
              created_at, updated_at
       FROM attendance
       WHERE id = ?`, [req.params.id]);
        if (updatedRows.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.updatedBy || 'System',
            actionType: 'UPDATE',
            resourceType: 'Attendance',
            resourceId: req.params.id,
            resourceName: `${updatedRows[0].employee_name} - ${updatedRows[0].date}`,
            description: `Attendance record updated for ${updatedRows[0].employee_name} (${updatedRows[0].employee_id}) on ${updatedRows[0].date}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'success',
            metadata: { employeeId: updatedRows[0].employee_id, date: updatedRows[0].date },
        });
        return res.json({
            message: 'Attendance record updated successfully',
            data: mapAttendanceRow(updatedRows[0]),
        });
    }
    catch (error) {
        console.error('Error updating attendance', error);
        return res.status(500).json({ message: 'Unexpected error while updating attendance' });
    }
});
// DELETE /attendance/:id - Delete attendance record
router.delete('/:id', async (req, res) => {
    try {
        // Get attendance record before deleting
        const [rows] = await db_1.pool.execute(`SELECT employee_id, employee_name, date FROM attendance WHERE id = ?`, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        const attendance = rows[0];
        await db_1.pool.execute('DELETE FROM attendance WHERE id = ?', [req.params.id]);
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.deletedBy || 'System',
            actionType: 'DELETE',
            resourceType: 'Attendance',
            resourceId: req.params.id,
            resourceName: `${attendance.employee_name} - ${attendance.date}`,
            description: `Attendance record deleted for ${attendance.employee_name} (${attendance.employee_id}) on ${attendance.date}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'success',
            metadata: { employeeId: attendance.employee_id, date: attendance.date },
        });
        return res.json({ message: 'Attendance record deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting attendance', error);
        return res.status(500).json({ message: 'Unexpected error while deleting attendance' });
    }
});
// POST /attendance/verify-qr - Verify QR code and return employee info
router.post('/verify-qr', async (req, res) => {
    const schema = zod_1.z.object({
        qrToken: zod_1.z.string().min(1),
        scannedBy: zod_1.z.string().optional(),
    });
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid request', errors: parseResult.error.flatten().fieldErrors });
    }
    const { qrToken, scannedBy } = parseResult.data;
    try {
        // First, try to decode the token to get employee ID
        const decoded = jsonwebtoken_1.default.decode(qrToken);
        if (!decoded || !decoded.employeeId) {
            return res.status(400).json({ message: 'Invalid QR code format' });
        }
        // Get employee and their QR secret
        const [employeeRows] = await db_1.pool.execute(`SELECT employee_id, full_name, department, position, status, qr_code_secret 
       FROM employees WHERE employee_id = ? LIMIT 1`, [decoded.employeeId]);
        if (employeeRows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const employee = employeeRows[0];
        if (employee.status === 'inactive') {
            return res.status(403).json({ message: 'Employee is inactive and cannot mark attendance' });
        }
        if (!employee.qr_code_secret) {
            return res.status(400).json({ message: 'Employee QR code not configured. Please contact HR.' });
        }
        // Verify the QR token
        const validation = (0, qrCodeGenerator_1.validateAttendanceQR)(qrToken, employee.qr_code_secret, decoded.employeeId);
        if (!validation.valid) {
            return res.status(400).json({ message: validation.error || 'QR code validation failed' });
        }
        // Log QR verification
        await (0, activityLogger_1.logActivity)({
            userName: scannedBy || employee.full_name,
            actionType: 'CREATE',
            resourceType: 'QRVerification',
            resourceId: employee.employee_id,
            resourceName: `QR scan for ${employee.full_name}`,
            description: `QR code verified successfully for ${employee.full_name} (${employee.employee_id})`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'success',
            metadata: { employeeId: employee.employee_id, scannedBy },
        });
        return res.json({
            valid: true,
            employee: {
                employeeId: employee.employee_id,
                employeeName: employee.full_name,
                department: employee.department,
                position: employee.position,
            },
        });
    }
    catch (error) {
        console.error('Error verifying QR code', error);
        return res.status(500).json({ message: 'Error verifying QR code' });
    }
});
exports.default = router;
