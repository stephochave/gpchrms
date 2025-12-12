"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const activityLogger_1 = require("../utils/activityLogger");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '../uploads/');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
console.log('Multer uploads directory:', uploadsDir);
// Configure multer for file uploads with filename preservation
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Preserve original filename with timestamp to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        const name = path_1.default.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow common document file types
        const allowedTypes = /\.(pdf|doc|docx|xls|xlsx|txt|jpg|jpeg|png)$/i;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname));
        const mimetype = allowedTypes.test(file.mimetype) ||
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'text/plain' ||
            file.mimetype.startsWith('image/');
        if (extname && mimetype) {
            return cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, TXT, and image files are allowed.'));
        }
    },
});
const documentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Document name is required'),
    type: zod_1.z.enum(['policy', 'template', 'employee-doc', 'other']).default('other'),
    category: zod_1.z.string().optional().nullable(),
    employeeId: zod_1.z.string().optional().nullable(),
    documentType: zod_1.z.string().optional().nullable(),
    uploadedBy: zod_1.z.string().min(1, 'Uploaded by is required'),
    description: zod_1.z.string().optional().nullable(),
});
const mapDocumentRow = (row) => ({
    id: String(row.id),
    name: row.name,
    type: row.type,
    category: row.category || '',
    fileUrl: row.file_url || row.file_path,
    filePath: row.file_path,
    fileSize: row.file_size ? `${(row.file_size / 1024 / 1024).toFixed(2)} MB` : '0 MB',
    employeeId: row.employee_id || null,
    documentType: row.document_type || null,
    uploadedBy: row.uploaded_by,
    uploadedAt: row.created_at,
    description: row.description || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});
// GET all documents (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { type, category, employeeId, documentType } = req.query;
        let query = `
      SELECT id, name, type, category, file_path, file_url, file_size, employee_id, 
             document_type, uploaded_by, description, created_at, updated_at
      FROM documents
      WHERE 1=1
    `;
        const params = [];
        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        if (employeeId) {
            query += ' AND employee_id = ?';
            params.push(employeeId);
        }
        if (documentType) {
            query += ' AND document_type = ?';
            params.push(documentType);
        }
        query += ' ORDER BY created_at DESC';
        const [rows] = await db_1.pool.execute(query, params);
        return res.json({
            data: rows.map(mapDocumentRow),
        });
    }
    catch (error) {
        console.error('Error fetching documents', error);
        return res.status(500).json({ message: 'Unexpected error while fetching documents' });
    }
});
// GET document by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db_1.pool.execute(`SELECT id, name, type, category, file_path, file_url, file_size, employee_id, 
              document_type, uploaded_by, description, created_at, updated_at
       FROM documents WHERE id = ?`, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }
        return res.json({
            data: mapDocumentRow(rows[0]),
        });
    }
    catch (error) {
        console.error('Error fetching document by ID', error);
        return res.status(500).json({ message: 'Unexpected error while fetching document' });
    }
});
// POST create document (with file upload)
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }
        const parseResult = documentSchema.safeParse({
            name: req.body.name || req.file.originalname,
            type: req.body.type || 'other',
            category: req.body.category || null,
            employeeId: req.body.employeeId || null,
            documentType: req.body.documentType || null,
            uploadedBy: req.body.uploadedBy || 'System',
            description: req.body.description || null,
        });
        if (!parseResult.success) {
            // Delete uploaded file if validation fails
            if (req.file.path) {
                fs_1.default.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                message: 'Invalid request body',
                errors: parseResult.error.flatten().fieldErrors,
            });
        }
        const { name, type, category, employeeId, documentType, uploadedBy, description, } = parseResult.data;
        // Generate file URL (in production, this would be a proper URL)
        // Use the filename from multer which now preserves extension
        const fileUrl = `/uploads/${req.file.filename}`;
        // Log for debugging
        console.log('Document uploaded:', {
            originalName: req.file.originalname,
            savedAs: req.file.filename,
            path: req.file.path,
            url: fileUrl,
            size: req.file.size,
        });
        const [result] = await db_1.pool.execute(`INSERT INTO documents 
        (name, type, category, file_path, file_url, file_size, employee_id, document_type, uploaded_by, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            name,
            type,
            category || null,
            req.file.path,
            fileUrl,
            req.file.size,
            employeeId || null,
            documentType || null,
            uploadedBy,
            description || null,
        ]);
        const insertId = result.insertId;
        const [rows] = await db_1.pool.execute(`SELECT id, name, type, category, file_path, file_url, file_size, employee_id, 
              document_type, uploaded_by, description, created_at, updated_at
       FROM documents WHERE id = ?`, [insertId]);
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: uploadedBy,
            actionType: 'CREATE',
            resourceType: 'Document',
            resourceId: String(insertId),
            resourceName: name,
            description: `Document "${name}" was uploaded${employeeId ? ` for employee ${employeeId}` : ''}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'success',
            metadata: { type, category, fileSize: req.file.size },
        });
        return res.status(201).json({
            message: 'Document uploaded successfully',
            data: mapDocumentRow(rows[0]),
        });
    }
    catch (error) {
        console.error('Error creating document', error);
        // Delete uploaded file if database insert fails
        if (req.file?.path) {
            try {
                fs_1.default.unlinkSync(req.file.path);
            }
            catch (unlinkError) {
                console.error('Error deleting uploaded file', unlinkError);
            }
        }
        // Log failed activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.uploadedBy || 'System',
            actionType: 'CREATE',
            resourceType: 'Document',
            resourceName: req.body.name || req.file?.originalname || 'Unknown',
            description: `Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'failed',
        });
        return res.status(500).json({ message: 'Unexpected error while uploading document' });
    }
});
// PUT update document
router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, description } = req.body;
        // Get existing document
        const [existingRows] = await db_1.pool.execute('SELECT * FROM documents WHERE id = ?', [id]);
        if (existingRows.length === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }
        const existingDoc = existingRows[0];
        let fileUrl = existingDoc.file_url;
        let filePath = existingDoc.file_path;
        let fileSize = existingDoc.file_size;
        // If new file is uploaded, replace the old one
        if (req.file) {
            // Delete old file
            if (existingDoc.file_path && fs_1.default.existsSync(existingDoc.file_path)) {
                try {
                    fs_1.default.unlinkSync(existingDoc.file_path);
                }
                catch (unlinkError) {
                    console.error('Error deleting old file', unlinkError);
                }
            }
            fileUrl = `/uploads/${req.file.filename}`;
            filePath = req.file.path;
            fileSize = req.file.size;
        }
        // Update document
        await db_1.pool.execute(`UPDATE documents 
       SET name = ?, category = ?, description = ?, file_url = ?, file_path = ?, file_size = ?, updated_at = NOW()
       WHERE id = ?`, [
            name || existingDoc.name,
            category !== undefined ? category : existingDoc.category,
            description !== undefined ? description : existingDoc.description,
            fileUrl,
            filePath,
            fileSize,
            id,
        ]);
        // Get updated document
        const [updatedRows] = await db_1.pool.execute(`SELECT id, name, type, category, file_path, file_url, file_size, employee_id, 
              document_type, uploaded_by, description, created_at, updated_at
       FROM documents WHERE id = ?`, [id]);
        return res.json({
            message: 'Document updated successfully',
            data: mapDocumentRow(updatedRows[0]),
        });
    }
    catch (error) {
        console.error('Error updating document', error);
        return res.status(500).json({ message: 'Unexpected error while updating document' });
    }
});
// GET /documents/serve/:id - Serve document file by document ID
router.get('/serve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db_1.pool.execute('SELECT file_path, file_url, name FROM documents WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }
        const doc = rows[0];
        let filePath = null;
        // Try file_path first (absolute path)
        if (doc.file_path && fs_1.default.existsSync(doc.file_path)) {
            filePath = doc.file_path;
        }
        // Try file_url (relative path like /uploads/filename)
        else if (doc.file_url) {
            const filename = doc.file_url.replace('/uploads/', '');
            const relativePath = path_1.default.join(__dirname, '../uploads/', filename);
            if (fs_1.default.existsSync(relativePath)) {
                filePath = relativePath;
            }
        }
        if (!filePath) {
            return res.status(404).json({ message: 'File not found on server' });
        }
        // Determine content type from file extension
        const ext = path_1.default.extname(filePath).toLowerCase();
        const contentTypeMap = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.txt': 'text/plain',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
        };
        const contentType = contentTypeMap[ext] || 'application/octet-stream';
        // Set headers to allow embedding
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${doc.name}"`);
        // Remove X-Frame-Options when using CSP frame-ancestors (they can conflict)
        // Allow framing from frontend origin
        const frontendOrigins = process.env.CLIENT_ORIGIN?.split(',').map(o => o.trim()) || ['http://localhost:5173', 'http://127.0.0.1:5173'];
        const cspValue = `frame-ancestors 'self' ${frontendOrigins.join(' ')}`;
        res.setHeader('Content-Security-Policy', cspValue);
        return res.sendFile(path_1.default.resolve(filePath));
    }
    catch (error) {
        console.error('Error serving document', error);
        return res.status(500).json({ message: 'Error serving file' });
    }
});
// GET /documents/file/:employeeId/:type - Serve employee document file (handles base64 or file path)
router.get('/file/:employeeId/:type', async (req, res) => {
    try {
        const { employeeId, type } = req.params;
        let fileData = null;
        let contentType = 'application/pdf';
        // For COE, check documents table first
        if (type === 'coe') {
            const [docRows] = await db_1.pool.execute('SELECT file_url, file_path FROM documents WHERE employee_id = ? AND document_type = ? ORDER BY created_at DESC LIMIT 1', [employeeId, 'coe']);
            if (docRows.length > 0) {
                const doc = docRows[0];
                fileData = doc.file_url || doc.file_path;
            }
        }
        else {
            // For PDS and SR, check employees table
            const [empRows] = await db_1.pool.execute('SELECT pds_file, service_record_file, registered_face_file FROM employees WHERE employee_id = ?', [employeeId]);
            if (empRows.length === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            const employee = empRows[0];
            // Get the appropriate file based on type
            if (type === 'pds') {
                fileData = employee.pds_file;
            }
            else if (type === 'sr') {
                fileData = employee.service_record_file;
            }
            else if (type === 'face') {
                fileData = employee.registered_face_file;
                contentType = 'image/png';
            }
            else {
                return res.status(400).json({ message: 'Invalid document type' });
            }
        }
        if (!fileData) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // If it's a base64 string, decode and serve it
        if (fileData.startsWith('data:')) {
            const base64Match = fileData.match(/^data:([^;]+);base64,(.+)$/);
            if (base64Match) {
                const mimeType = base64Match[1];
                const base64Data = base64Match[2];
                const buffer = Buffer.from(base64Data, 'base64');
                // Set headers to allow embedding and prevent CSP issues
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Content-Disposition', `inline; filename="${type}_${employeeId}"`);
                // Remove X-Frame-Options when using CSP frame-ancestors
                const frontendOrigins = process.env.CLIENT_ORIGIN?.split(',').map(o => o.trim()) || ['http://localhost:5173', 'http://127.0.0.1:5173'];
                const cspValue = `frame-ancestors 'self' ${frontendOrigins.join(' ')}`;
                res.setHeader('Content-Security-Policy', cspValue);
                return res.send(buffer);
            }
        }
        // If it's a file path, try to serve it
        if (fileData.startsWith('/uploads/') || !fileData.includes('/')) {
            const filename = fileData.replace('/uploads/', '');
            const filePath = path_1.default.join(__dirname, '../uploads/', filename);
            if (fs_1.default.existsSync(filePath)) {
                // Set headers to allow embedding
                // Remove X-Frame-Options when using CSP frame-ancestors
                const frontendOrigins = process.env.CLIENT_ORIGIN?.split(',').map(o => o.trim()) || ['http://localhost:5173', 'http://127.0.0.1:5173'];
                const cspValue = `frame-ancestors 'self' ${frontendOrigins.join(' ')}`;
                res.setHeader('Content-Security-Policy', cspValue);
                return res.sendFile(filePath);
            }
        }
        // If file_path is an absolute path, try to serve it directly
        if (fileData && fs_1.default.existsSync(fileData)) {
            // Remove X-Frame-Options when using CSP frame-ancestors
            const frontendOrigins = process.env.CLIENT_ORIGIN?.split(',').map(o => o.trim()) || ['http://localhost:5173', 'http://127.0.0.1:5173'];
            const cspValue = `frame-ancestors 'self' ${frontendOrigins.join(' ')}`;
            res.setHeader('Content-Security-Policy', cspValue);
            return res.sendFile(path_1.default.resolve(fileData));
        }
        return res.status(404).json({ message: 'File not found' });
    }
    catch (error) {
        console.error('Error serving document file', error);
        return res.status(500).json({ message: 'Error serving file' });
    }
});
// DELETE document
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Get document info before deletion
        const [docRows] = await db_1.pool.execute('SELECT name, file_path, uploaded_by FROM documents WHERE id = ?', [id]);
        const doc = docRows[0];
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // Delete file from filesystem
        if (doc.file_path && fs_1.default.existsSync(doc.file_path)) {
            try {
                fs_1.default.unlinkSync(doc.file_path);
            }
            catch (unlinkError) {
                console.error('Error deleting file from filesystem', unlinkError);
                // Continue with database deletion even if file deletion fails
            }
        }
        const [result] = await db_1.pool.execute('DELETE FROM documents WHERE id = ?', [id]);
        const affectedRows = result.affectedRows;
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // Log activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.deletedBy || doc.uploaded_by || 'System',
            actionType: 'DELETE',
            resourceType: 'Document',
            resourceId: id,
            resourceName: doc.name,
            description: `Document "${doc.name}" was deleted`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'success',
        });
        return res.json({ message: 'Document deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting document', error);
        // Log failed activity
        await (0, activityLogger_1.logActivity)({
            userName: req.body.deletedBy || 'System',
            actionType: 'DELETE',
            resourceType: 'Document',
            resourceId: req.params.id,
            description: `Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`,
            ipAddress: (0, activityLogger_1.getClientIp)(req),
            status: 'failed',
        });
        return res.status(500).json({ message: 'Unexpected error while deleting document' });
    }
});
exports.default = router;
