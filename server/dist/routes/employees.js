"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const activityLogger_1 = require("../utils/activityLogger");
const qrCodeGenerator_1 = require("../utils/qrCodeGenerator");
const router = (0, express_1.Router)();
const validateEmployeeId = (id) => {
    if (!id)
        return false;
    const parts = id.split("-");
    if (parts.length !== 3)
        return false;
    const [year, school, uniqueId] = parts;
    // Year: 2 digits
    if (!/^\d{2}$/.test(year))
        return false;
    // School: 2-4 uppercase letters
    if (!/^[A-Z]{2,4}$/.test(school))
        return false;
    // Unique ID: 1-10 alphanumeric characters (allows GRD01, 00001, etc.)
    if (!/^[A-Z0-9]{1,10}$/i.test(uniqueId))
        return false;
    return true;
};
const normalizeRole = (role) => {
    const normalized = role?.toLowerCase();
    if (normalized === "admin")
        return "admin";
    if (normalized === "guard")
        return "guard";
    return "employee";
};
const employeeSchema = zod_1.z.object({
    employeeId: zod_1.z
        .string()
        .min(1, "Employee ID is required")
        .refine((id) => validateEmployeeId(id), {
        message: "Employee ID must be in format: YY-SCHOOL-XXXXX (e.g., 25-GPC-12345). Year: 2 digits, School: 2-4 letters, Unique ID: 1-5 digits",
    }),
    firstName: zod_1.z.string().min(1, "First name is required"),
    middleName: zod_1.z.string().min(1, "Middle name is required"),
    lastName: zod_1.z.string().min(1, "Last name is required"),
    suffixName: zod_1.z.string().optional().nullable(),
    fullName: zod_1.z.string().min(1, "Full name is required"),
    department: zod_1.z.string().min(1, "Department is required"),
    position: zod_1.z.string().min(1, "Position is required"),
    email: zod_1.z.string().email("Invalid email"),
    phone: zod_1.z.string().min(1, "Phone is required"),
    dateOfBirth: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().optional().nullable(),
    gender: zod_1.z.string().optional().nullable(),
    civilStatus: zod_1.z.string().optional().nullable(),
    dateHired: zod_1.z.string().min(1, "Date hired is required"),
    dateOfLeaving: zod_1.z.string().optional().nullable(),
    employmentType: zod_1.z.string().min(1).default("Regular"),
    role: zod_1.z.string().optional().nullable(),
    sssNumber: zod_1.z.string().optional().nullable(),
    pagibigNumber: zod_1.z.string().optional().nullable(),
    tinNumber: zod_1.z.string().optional().nullable(),
    emergencyContact: zod_1.z.string().optional().nullable(),
    educationalBackground: zod_1.z.string().optional().nullable(),
    signatureFile: zod_1.z.string().optional().nullable(),
    pdsFile: zod_1.z.string().optional().nullable(),
    serviceRecordFile: zod_1.z.string().optional().nullable(),
    password: zod_1.z.string().trim().min(6, "Password must be at least 6 characters"),
    status: zod_1.z.enum(["active", "inactive"]).optional(),
    archivedReason: zod_1.z.string().optional().nullable(),
    archivedAt: zod_1.z.string().optional().nullable(),
});
const archiveSchema = zod_1.z.object({
    reason: zod_1.z.string().min(1, "Archive reason is required"),
});
const mapEmployeeRow = (row) => ({
    id: String(row.id),
    employeeId: row.employee_id,
    firstName: row.first_name,
    middleName: row.middle_name,
    lastName: row.last_name,
    suffixName: row.suffix_name,
    fullName: row.full_name,
    department: row.department,
    position: row.position,
    email: row.email,
    phone: row.phone,
    dateOfBirth: row.date_of_birth,
    address: row.address,
    gender: row.gender,
    civilStatus: row.civil_status,
    dateHired: row.date_hired,
    dateOfLeaving: row.date_of_leaving,
    employmentType: row.employment_type,
    role: row.role,
    sssNumber: row.sss_number,
    pagibigNumber: row.pagibig_number,
    tinNumber: row.tin_number,
    emergencyContact: row.emergency_contact,
    educationalBackground: row.educational_background,
    signatureFile: row.signature_file,
    pdsFile: row.pds_file,
    serviceRecordFile: row.service_record_file,
    qrCodeData: row.qr_code_data,
    qrCodeSecret: row.qr_code_secret,
    qrCodeGeneratedAt: row.qr_code_generated_at,
    status: row.status,
    archivedReason: row.archived_reason,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});
router.get("/", async (req, res) => {
    const { status, employeeId } = req.query;
    try {
        const conditions = [];
        const params = [];
        if (status === "active" || status === "inactive") {
            conditions.push("status = ?");
            params.push(status);
        }
        if (employeeId && typeof employeeId === "string") {
            conditions.push("employee_id = ?");
            params.push(employeeId);
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const [rows] = await db_1.pool.execute(`SELECT id, employee_id, first_name, middle_name, last_name, suffix_name, full_name, department, position, email, phone,
              date_of_birth, address, gender, civil_status, date_hired, date_of_leaving,
              employment_type, role, sss_number, pagibig_number, tin_number,
              emergency_contact, educational_background, signature_file, pds_file,
              service_record_file, qr_code_data, qr_code_secret, qr_code_generated_at, status,
              archived_reason, archived_at, created_at, updated_at
         FROM employees
         ${whereClause}
         ORDER BY created_at DESC`, params);
        return res.json({
            data: rows.map(mapEmployeeRow),
        });
    }
    catch (error) {
        console.error("Error fetching employees", error);
        return res
            .status(500)
            .json({ message: "Unexpected error while fetching employees" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db_1.pool.execute(`SELECT id, employee_id, first_name, middle_name, last_name, suffix_name, full_name, department, position, email, phone,
              date_of_birth, address, gender, civil_status, date_hired, date_of_leaving,
              employment_type, role, sss_number, pagibig_number, tin_number,
              emergency_contact, educational_background, signature_file, pds_file,
              service_record_file, qr_code_data, qr_code_secret, qr_code_generated_at, status,
              archived_reason, archived_at, created_at, updated_at, password_hash
         FROM employees
         WHERE id = ?
         LIMIT 1`, [req.params.id]);
        const employee = rows[0];
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.json({
            data: {
                ...mapEmployeeRow(employee),
                password_hash: employee.password_hash,
            },
        });
    }
    catch (error) {
        console.error("Error fetching employee by id", error);
        return res
            .status(500)
            .json({ message: "Unexpected error while fetching employee" });
    }
});
router.post("/", async (req, res) => {
    const parseResult = employeeSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: parseResult.error.flatten().fieldErrors,
        });
    }
    const { employeeId, firstName, middleName, lastName, suffixName, fullName, department, position, email, phone, dateOfBirth, address, gender, civilStatus, dateHired, dateOfLeaving, employmentType, role, sssNumber, pagibigNumber, tinNumber, emergencyContact, educationalBackground, signatureFile, pdsFile, serviceRecordFile, password, status, archivedReason, archivedAt, } = parseResult.data;
    const sanitizedMiddleName = middleName?.trim() || "N/A";
    const sanitizedSuffixName = suffixName?.trim() || "";
    const normalizedFullName = fullName?.trim() ||
        [firstName, sanitizedMiddleName, lastName, sanitizedSuffixName]
            .filter((part) => Boolean(part && part.trim().length))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
    try {
        const connection = await db_1.pool.getConnection();
        let insertId = null;
        try {
            await connection.beginTransaction();
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            // Generate QR code for the employee
            const qrCodeResult = await (0, qrCodeGenerator_1.generateEmployeeQRCode)(employeeId, normalizedFullName);
            const recordStatus = status ?? "active";
            const inactiveArchivedReason = recordStatus === "inactive"
                ? archivedReason || "Marked as inactive"
                : null;
            const inactiveArchivedAt = recordStatus === "inactive"
                ? archivedAt
                    ? new Date(archivedAt)
                    : new Date()
                : null;
            const [result] = await connection.execute(`INSERT INTO employees
          (employee_id, first_name, middle_name, last_name, suffix_name, full_name, department, position, email, phone,
           date_of_birth, address, gender, civil_status, date_hired, date_of_leaving,
           employment_type, role, sss_number, pagibig_number, tin_number,
           emergency_contact, educational_background, signature_file, pds_file,
           service_record_file, qr_code_data, qr_code_secret, qr_code_generated_at, password_hash, status, archived_reason, archived_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                employeeId,
                firstName,
                sanitizedMiddleName,
                lastName,
                sanitizedSuffixName,
                normalizedFullName,
                department,
                position,
                email,
                phone,
                dateOfBirth || null,
                address || null,
                gender || null,
                civilStatus || null,
                dateHired,
                dateOfLeaving || null,
                employmentType,
                role || null,
                sssNumber || null,
                pagibigNumber || null,
                tinNumber || null,
                emergencyContact || null,
                educationalBackground || null,
                signatureFile || null,
                pdsFile || null,
                serviceRecordFile || null,
                qrCodeResult.token,
                qrCodeResult.secret,
                new Date(),
                hashedPassword,
                recordStatus,
                inactiveArchivedReason,
                inactiveArchivedAt,
            ]);
            insertId = result.insertId;
            // Check if user already exists
            const [existingUsers] = await connection.execute("SELECT id, username, email, employee_id FROM users WHERE username = ? OR email = ? OR employee_id = ?", [employeeId, email, employeeId]);
            // Always create/update user account with 'employee' role when adding employee
            const userRole = "employee"; // Employees added through this form are always 'employee' role
            if (existingUsers.length > 0) {
                // Update existing user
                await connection.execute(`UPDATE users 
           SET email = ?, employee_id = ?, full_name = ?, role = ?, password_hash = ?
           WHERE id = ?`, [
                    email,
                    employeeId,
                    normalizedFullName,
                    userRole,
                    hashedPassword,
                    existingUsers[0].id,
                ]);
            }
            else {
                // Create new user account for the employee
                await connection.execute(`INSERT INTO users (username, email, employee_id, full_name, role, password_hash)
           VALUES (?, ?, ?, ?, ?, ?)`, [
                    employeeId,
                    email,
                    employeeId,
                    normalizedFullName,
                    userRole,
                    hashedPassword,
                ]);
            }
            await connection.commit();
        }
        catch (transactionError) {
            try {
                await connection.rollback();
            }
            catch (rollbackError) {
                console.error("Rollback failed while creating employee", rollbackError);
            }
            throw transactionError;
        }
        finally {
            connection.release();
        }
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.createdBy || "System",
            actionType: "CREATE",
            resourceType: "Employee",
            resourceId: insertId ? String(insertId) : undefined,
            resourceName: normalizedFullName,
            description: `Employee ${normalizedFullName} (${employeeId}) was created and employee account was automatically created`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "success",
            metadata: { employeeId, department, position, userAccountCreated: true },
        });
        return res.status(201).json({ message: "Employee added successfully" });
    }
    catch (error) {
        console.error("Error creating employee", error);
        // Log failed activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.createdBy || "System",
            actionType: "CREATE",
            resourceType: "Employee",
            resourceName: normalizedFullName,
            description: `Failed to create employee: ${error instanceof Error ? error.message : "Unknown error"}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "failed",
        });
        return res
            .status(500)
            .json({ message: "Unexpected error while creating employee" });
    }
});
router.put("/:id", async (req, res) => {
    // For updates, make all fields optional and only validate employeeId format if provided
    const updateSchema = zod_1.z.object({
        employeeId: zod_1.z
            .string()
            .optional()
            .refine((id) => {
            if (!id)
                return true; // Optional for updates
            return validateEmployeeId(id);
        }, {
            message: "Employee ID must be in format: YY-SCHOOL-XXXXX (e.g., 25-GPC-12345). Year: 2 digits, School: 2-4 letters, Unique ID: 1-5 digits",
        }),
        firstName: zod_1.z.string().optional(),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        suffixName: zod_1.z.string().optional(),
        fullName: zod_1.z.string().optional(),
        department: zod_1.z.string().optional(),
        position: zod_1.z.string().optional(),
        email: zod_1.z
            .union([
            zod_1.z.string().email("Invalid email"),
            zod_1.z.string().length(0),
            zod_1.z.undefined(),
        ])
            .optional(),
        phone: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z.string().optional().nullable(),
        address: zod_1.z.string().optional().nullable(),
        gender: zod_1.z.string().optional().nullable(),
        civilStatus: zod_1.z.string().optional().nullable(),
        dateHired: zod_1.z.string().optional(),
        dateOfLeaving: zod_1.z.string().optional().nullable(),
        employmentType: zod_1.z.string().optional(),
        role: zod_1.z.string().optional().nullable(),
        sssNumber: zod_1.z.string().optional().nullable(),
        pagibigNumber: zod_1.z.string().optional().nullable(),
        tinNumber: zod_1.z.string().optional().nullable(),
        emergencyContact: zod_1.z.string().optional().nullable(),
        educationalBackground: zod_1.z.string().optional().nullable(),
        signatureFile: zod_1.z.string().optional().nullable(),
        pdsFile: zod_1.z.string().optional().nullable(),
        serviceRecordFile: zod_1.z.string().optional().nullable(),
        registeredFaceFile: zod_1.z.string().optional().nullable(),
        password: zod_1.z.string().optional().nullable(),
        status: zod_1.z.enum(["active", "inactive"]).optional(),
    });
    const parseResult = updateSchema.safeParse(req.body);
    if (!parseResult.success) {
        console.error("Validation errors:", parseResult.error.flatten().fieldErrors);
        return res.status(400).json({
            message: "Invalid request body",
            errors: parseResult.error.flatten().fieldErrors,
        });
    }
    const { employeeId, firstName, middleName, lastName, suffixName, fullName, department, position, email, phone, dateOfBirth, address, gender, civilStatus, dateHired, dateOfLeaving, employmentType, role, sssNumber, pagibigNumber, tinNumber, emergencyContact, educationalBackground, signatureFile, pdsFile, serviceRecordFile, registeredFaceFile, password, status, } = parseResult.data;
    const derivedFullName = fullName?.trim() ||
        [firstName, middleName, lastName, suffixName]
            .filter((part) => typeof part === "string" && part.trim().length)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
    try {
        const connection = await db_1.pool.getConnection();
        let updatedEmployee = null;
        try {
            await connection.beginTransaction();
            const hashedPassword = password ? await bcryptjs_1.default.hash(password, 10) : null;
            await connection.execute(`UPDATE employees
           SET employee_id = COALESCE(?, employee_id),
               first_name = COALESCE(?, first_name),
               middle_name = COALESCE(?, middle_name),
               last_name = COALESCE(?, last_name),
               suffix_name = COALESCE(?, suffix_name),
               full_name = COALESCE(?, full_name),
               department = COALESCE(?, department),
               position = COALESCE(?, position),
               email = COALESCE(?, email),
               phone = COALESCE(?, phone),
               date_of_birth = COALESCE(?, date_of_birth),
               address = COALESCE(?, address),
               gender = COALESCE(?, gender),
               civil_status = COALESCE(?, civil_status),
               date_hired = COALESCE(?, date_hired),
               date_of_leaving = COALESCE(?, date_of_leaving),
               employment_type = COALESCE(?, employment_type),
               role = COALESCE(?, role),
               sss_number = COALESCE(?, sss_number),
               pagibig_number = COALESCE(?, pagibig_number),
               tin_number = COALESCE(?, tin_number),
               emergency_contact = COALESCE(?, emergency_contact),
               educational_background = COALESCE(?, educational_background),
               signature_file = COALESCE(?, signature_file),
               pds_file = COALESCE(?, pds_file),
               service_record_file = COALESCE(?, service_record_file),
               registered_face_file = COALESCE(?, registered_face_file),
               password_hash = COALESCE(?, password_hash),
               status = COALESCE(?, status)
         WHERE id = ?`, [
                employeeId ?? null,
                firstName ?? null,
                middleName ?? null,
                lastName ?? null,
                suffixName ?? null,
                derivedFullName || null,
                department ?? null,
                position ?? null,
                email ?? null,
                phone ?? null,
                dateOfBirth ?? null,
                address ?? null,
                gender ?? null,
                civilStatus ?? null,
                dateHired ?? null,
                dateOfLeaving ?? null,
                employmentType ?? null,
                role ?? null,
                sssNumber ?? null,
                pagibigNumber ?? null,
                tinNumber ?? null,
                emergencyContact ?? null,
                educationalBackground ?? null,
                signatureFile ?? null,
                pdsFile ?? null,
                serviceRecordFile ?? null,
                registeredFaceFile ?? null,
                hashedPassword ?? null,
                status ?? null,
                req.params.id,
            ]);
            const [employeeRows] = await connection.execute(`SELECT id, full_name, employee_id, email, role, password_hash 
         FROM employees 
         WHERE id = ?`, [req.params.id]);
            updatedEmployee = employeeRows[0] || null;
            if (!updatedEmployee) {
                await connection.rollback();
                return res.status(404).json({ message: "Employee not found" });
            }
            // Always update user account when updating employee
            const userRole = "employee"; // Employees are always 'employee' role
            const passwordToUse = hashedPassword || updatedEmployee.password_hash;
            if (passwordToUse) {
                await connection.execute(`INSERT INTO users (username, email, employee_id, full_name, role, password_hash)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             email = VALUES(email),
             employee_id = VALUES(employee_id),
             full_name = VALUES(full_name),
             role = VALUES(role),
             password_hash = COALESCE(VALUES(password_hash), password_hash)`, [
                    updatedEmployee.employee_id,
                    updatedEmployee.email,
                    updatedEmployee.employee_id,
                    updatedEmployee.full_name,
                    userRole,
                    passwordToUse,
                ]);
            }
            else {
                // Update user account even if password is not being changed
                await connection.execute(`INSERT INTO users (username, email, employee_id, full_name, role)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             email = VALUES(email),
             employee_id = VALUES(employee_id),
             full_name = VALUES(full_name),
             role = VALUES(role)`, [
                    updatedEmployee.employee_id,
                    updatedEmployee.email,
                    updatedEmployee.employee_id,
                    updatedEmployee.full_name,
                    userRole,
                ]);
            }
            await connection.commit();
        }
        catch (transactionError) {
            try {
                await connection.rollback();
            }
            catch (rollbackError) {
                console.error("Rollback failed while updating employee", rollbackError);
            }
            throw transactionError;
        }
        finally {
            connection.release();
        }
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.updatedBy || "System",
            actionType: "UPDATE",
            resourceType: "Employee",
            resourceId: req.params.id,
            resourceName: updatedEmployee?.full_name || derivedFullName || "Unknown",
            description: `Employee ${updatedEmployee?.full_name || derivedFullName || "Unknown"} (${updatedEmployee?.employee_id || employeeId || "N/A"}) was updated`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "success",
            metadata: { employeeId: updatedEmployee?.employee_id || employeeId },
        });
        return res.json({ message: "Employee updated successfully" });
    }
    catch (error) {
        console.error("Error updating employee", error);
        // Log failed activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.updatedBy || "System",
            actionType: "UPDATE",
            resourceType: "Employee",
            resourceId: req.params.id,
            description: `Failed to update employee: ${error instanceof Error ? error.message : "Unknown error"}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "failed",
        });
        return res
            .status(500)
            .json({ message: "Unexpected error while updating employee" });
    }
});
router.patch("/:id/archive", async (req, res) => {
    const parseResult = archiveSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: parseResult.error.flatten().fieldErrors,
        });
    }
    try {
        await db_1.pool.execute(`UPDATE employees
         SET status = 'inactive',
             archived_reason = ?,
             archived_at = NOW()
       WHERE id = ?`, [parseResult.data.reason, req.params.id]);
        // Get employee info for logging
        const [employeeRows] = await db_1.pool.execute("SELECT full_name, employee_id FROM employees WHERE id = ?", [req.params.id]);
        const employee = employeeRows[0];
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.archivedBy || "System",
            actionType: "ARCHIVE",
            resourceType: "Employee",
            resourceId: req.params.id,
            resourceName: employee?.full_name || "Unknown",
            description: `Employee ${employee?.full_name || "Unknown"} (${employee?.employee_id || "N/A"}) was archived. Reason: ${parseResult.data.reason}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "success",
            metadata: {
                reason: parseResult.data.reason,
                employeeId: employee?.employee_id,
            },
        });
        return res.json({ message: "Employee archived successfully" });
    }
    catch (error) {
        console.error("Error archiving employee", error);
        // Log failed activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.archivedBy || "System",
            actionType: "ARCHIVE",
            resourceType: "Employee",
            resourceId: req.params.id,
            description: `Failed to archive employee: ${error instanceof Error ? error.message : "Unknown error"}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "failed",
        });
        return res
            .status(500)
            .json({ message: "Unexpected error while archiving employee" });
    }
});
// DELETE employee
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Get employee info before deletion
        const [employeeRows] = await db_1.pool.execute("SELECT full_name, employee_id FROM employees WHERE id = ?", [id]);
        const employee = employeeRows[0];
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        const [result] = await db_1.pool.execute("DELETE FROM employees WHERE id = ?", [
            id,
        ]);
        const affectedRows = result.affectedRows;
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.deletedBy || "System",
            actionType: "DELETE",
            resourceType: "Employee",
            resourceId: id,
            resourceName: employee.full_name,
            description: `Employee ${employee.full_name} (${employee.employee_id}) was deleted`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "success",
            metadata: { employeeId: employee.employee_id },
        });
        return res.json({ message: "Employee deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting employee", error);
        // Log failed activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.deletedBy || "System",
            actionType: "DELETE",
            resourceType: "Employee",
            resourceId: id,
            description: `Failed to delete employee: ${error instanceof Error ? error.message : "Unknown error"}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "failed",
        });
        return res
            .status(500)
            .json({ message: "Unexpected error while deleting employee" });
    }
});
// Admin Password Reset - Reset employee password and require them to change it
router.patch("/:id/reset-password", async (req, res) => {
    try {
        const employeeId = req.params.id;
        // Get employee info
        const [employeeRows] = await db_1.pool.execute(`SELECT id, employee_id, email, full_name FROM employees WHERE id = ? LIMIT 1`, [employeeId]);
        const employee = employeeRows[0];
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        // Generate a temporary password (in production, use a secure random generator)
        const tempPassword = `Temp${employee.employee_id}${Date.now()
            .toString()
            .slice(-4)}`;
        const hashedPassword = await bcryptjs_1.default.hash(tempPassword, 10);
        // Update password in employees table
        await db_1.pool.execute(`UPDATE employees SET password_hash = ? WHERE id = ?`, [
            hashedPassword,
            employeeId,
        ]);
        // Update password in users table and set password_reset_required flag
        await db_1.pool.execute(`UPDATE users 
       SET password_hash = ?, password_reset_required = TRUE 
       WHERE employee_id = ? OR email = ?`, [hashedPassword, employee.employee_id, employee.email]);
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.resetBy || "Admin",
            actionType: "UPDATE",
            resourceType: "Employee",
            resourceId: employeeId,
            resourceName: employee.full_name,
            description: `Password reset for employee ${employee.full_name} (${employee.employee_id})`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "success",
            metadata: { employeeId: employee.employee_id, action: "password_reset" },
        });
        return res.json({
            message: "Password reset successfully. Employee must change password on next login.",
            temporaryPassword: tempPassword, // In production, send this via secure channel
        });
    }
    catch (error) {
        console.error("Error resetting password", error);
        return res
            .status(500)
            .json({ message: "Unexpected error while resetting password" });
    }
});
// Generate/Regenerate QR Code for Employee
router.post("/:id/generate-qr", async (req, res) => {
    try {
        const employeeId = req.params.id;
        // Get employee info
        const [employeeRows] = await db_1.pool.execute(`SELECT id, employee_id, full_name, qr_code_secret FROM employees WHERE id = ? LIMIT 1`, [employeeId]);
        const employee = employeeRows[0];
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        // Generate new QR code (reuse existing secret if available)
        const qrCodeResult = await (0, qrCodeGenerator_1.generateEmployeeQRCode)(employee.employee_id, employee.full_name, employee.qr_code_secret || undefined);
        // Update employee record with QR code data
        await db_1.pool.execute(`UPDATE employees 
       SET qr_code_data = ?, qr_code_secret = ?, qr_code_generated_at = NOW() 
       WHERE id = ?`, [qrCodeResult.token, qrCodeResult.secret, employeeId]);
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.generatedBy || "Admin",
            actionType: "UPDATE",
            resourceType: "Employee",
            resourceId: employeeId,
            resourceName: employee.full_name,
            description: `QR code ${employee.qr_code_secret ? 'regenerated' : 'generated'} for employee ${employee.full_name} (${employee.employee_id})`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: "success",
            metadata: { employeeId: employee.employee_id, action: "qr_code_generation" },
        });
        return res.json({
            message: "QR code generated successfully",
            qrCodeData: qrCodeResult.token,
            expiresAt: qrCodeResult.expiresAt,
        });
    }
    catch (error) {
        console.error("Error generating QR code", error);
        return res
            .status(500)
            .json({ message: "Unexpected error while generating QR code" });
    }
});
// Get QR Code for Employee
router.get("/:id/qr-code", async (req, res) => {
    try {
        const employeeId = req.params.id;
        // Get employee QR code data
        const [employeeRows] = await db_1.pool.execute(`SELECT id, employee_id, full_name, qr_code_data, qr_code_generated_at FROM employees WHERE id = ? LIMIT 1`, [employeeId]);
        const employee = employeeRows[0];
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        if (!employee.qr_code_data) {
            return res.status(404).json({
                message: "QR code not found for this employee. Please generate one first.",
                requiresGeneration: true
            });
        }
        return res.json({
            employeeId: employee.employee_id,
            fullName: employee.full_name,
            qrCodeData: employee.qr_code_data,
            generatedAt: employee.qr_code_generated_at,
        });
    }
    catch (error) {
        console.error("Error fetching QR code", error);
        return res
            .status(500)
            .json({ message: "Unexpected error while fetching QR code" });
    }
});
// POST /employees/create-guard - Create a guard account with employee record (Admin only)
router.post('/create-guard', async (req, res) => {
    const schema = zod_1.z.object({
        employeeId: zod_1.z.string().min(1, 'Employee ID is required')
            .refine((id) => validateEmployeeId(id), {
            message: 'Employee ID must be in format: YY-GPC-XXXXX (e.g., 25-GPC-00001)',
        }),
        fullName: zod_1.z.string().min(1, 'Full name is required'),
        email: zod_1.z.string().email('Invalid email'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        phone: zod_1.z.string().optional().default('N/A'),
        department: zod_1.z.string().optional().default('Security'),
    });
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: 'Invalid request body',
            errors: parseResult.error.flatten().fieldErrors,
        });
    }
    const { employeeId, fullName, email, password, phone, department } = parseResult.data;
    try {
        // Check if employee ID or email already exists
        const [existingEmployee] = await db_1.pool.execute('SELECT employee_id FROM employees WHERE employee_id = ? OR email = ?', [employeeId, email]);
        if (existingEmployee.length > 0) {
            return res.status(400).json({ message: 'Employee ID or email already exists' });
        }
        // Check if email exists in users table
        const [existingUser] = await db_1.pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create employee record first
        await db_1.pool.execute(`INSERT INTO employees (
        employee_id, first_name, middle_name, last_name, suffix_name, full_name, 
        department, position, email, phone, status, date_hired, role
      ) VALUES (?, ?, '', '', '', ?, ?, 'Security Guard', ?, ?, 'active', NOW(), 'guard')`, [employeeId, fullName, fullName, department, email, phone]);
        // Create guard user account linked to employee
        const [result] = await db_1.pool.execute(`INSERT INTO users (username, email, full_name, role, password_hash, employee_id)
       VALUES (?, ?, ?, 'guard', ?, ?)`, [employeeId, email, fullName, hashedPassword, employeeId]);
        const userId = result.insertId;
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.createdBy || 'Admin',
            actionType: 'CREATE',
            resourceType: 'GuardAccount',
            resourceId: employeeId,
            resourceName: fullName,
            description: `Created guard account for ${fullName} (${employeeId})`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'success',
            metadata: { employeeId, email, department },
        });
        return res.status(201).json({
            message: 'Guard account created successfully',
            guard: {
                id: userId,
                employeeId,
                fullName,
                email,
                role: 'guard',
                department,
            },
        });
    }
    catch (error) {
        console.error('Error creating guard account', error);
        return res.status(500).json({ message: 'Error creating guard account' });
    }
});
exports.default = router;
