import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { RowDataPacket } from 'mysql2';
import { logActivity, getClientIp } from '../utils/activityLogger';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for file uploads with proper filename preservation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename while preserving extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (increased from 100MB)
  },
  fileFilter: (req, file, cb) => {
    // Allow common document file types
    const allowedTypes = /\.(pdf|doc|docx|xls|xlsx|txt|jpg|jpeg|png)$/i;
    const extname = allowedTypes.test(path.extname(file.originalname));
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
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, TXT, and image files are allowed.'));
    }
  },
});

interface DbDocument extends RowDataPacket {
  id: number;
  name: string;
  type: 'policy' | 'template' | 'employee-doc' | 'other';
  category: string | null;
  file_path: string;
  file_url: string | null;
  file_size: number | null;
  employee_id: string | null;
  document_type: string | null;
  uploaded_by: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.enum(['policy', 'template', 'employee-doc', 'other']).default('other'),
  category: z.string().optional().nullable(),
  employeeId: z.string().optional().nullable(),
  documentType: z.string().optional().nullable(),
  uploadedBy: z.string().min(1, 'Uploaded by is required'),
  description: z.string().optional().nullable(),
});

const mapDocumentRow = (row: DbDocument) => ({
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
    const params: any[] = [];

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

    const [rows] = await pool.execute<DbDocument[]>(query, params);

    return res.json({
      data: rows.map(mapDocumentRow),
    });
  } catch (error) {
    console.error('Error fetching documents', error);
    return res.status(500).json({ message: 'Unexpected error while fetching documents' });
  }
});

// GET document by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute<DbDocument[]>(
      `SELECT id, name, type, category, file_path, file_url, file_size, employee_id, 
              document_type, uploaded_by, description, created_at, updated_at
       FROM documents WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    return res.json({
      data: mapDocumentRow(rows[0]),
    });
  } catch (error) {
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
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: 'Invalid request body',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const {
      name,
      type,
      category,
      employeeId,
      documentType,
      uploadedBy,
      description,
    } = parseResult.data;

    // Generate file URL (in production, this would be a proper URL)
    const fileUrl = `/uploads/${req.file.filename}`;

    console.log('Uploading document:', {
      originalName: req.file.originalname,
      savedFilename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      extension: path.extname(req.file.originalname)
    });

    // Try to insert with mime_type, fall back if column doesn't exist
    let result;
    try {
      [result] = await pool.execute(
        `INSERT INTO documents 
          (name, type, category, file_path, file_url, file_size, employee_id, document_type, uploaded_by, description, mime_type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
          req.file.mimetype, // Store original MIME type
        ]
      );
    } catch (error: any) {
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        // mime_type column doesn't exist, insert without it
        console.log('mime_type column not found, inserting without it');
        [result] = await pool.execute(
          `INSERT INTO documents 
            (name, type, category, file_path, file_url, file_size, employee_id, document_type, uploaded_by, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
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
          ]
        );
      } else {
        throw error;
      }
    }

    const insertId = (result as any).insertId;
    const [rows] = await pool.execute<DbDocument[]>(
      `SELECT id, name, type, category, file_path, file_url, file_size, employee_id, 
              document_type, uploaded_by, description, created_at, updated_at
       FROM documents WHERE id = ?`,
      [insertId]
    );

    // Log activity
    await logActivity({
      userName: uploadedBy,
      actionType: 'CREATE',
      resourceType: 'Document',
      resourceId: String(insertId),
      resourceName: name,
      description: `Document "${name}" was uploaded${employeeId ? ` for employee ${employeeId}` : ''}`,
      ipAddress: getClientIp(req),
      status: 'success',
      metadata: { type, category, fileSize: req.file.size },
    });

    return res.status(201).json({
      message: 'Document uploaded successfully',
      data: mapDocumentRow(rows[0]),
    });
  } catch (error) {
    console.error('Error creating document', error);
    
    // Delete uploaded file if database insert fails
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file', unlinkError);
      }
    }

    // Log failed activity
    await logActivity({
      userName: req.body.uploadedBy || 'System',
      actionType: 'CREATE',
      resourceType: 'Document',
      resourceName: req.body.name || req.file?.originalname || 'Unknown',
      description: `Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ipAddress: getClientIp(req),
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
    const [existingRows] = await pool.execute<DbDocument[]>(
      'SELECT * FROM documents WHERE id = ?',
      [id]
    );

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
      if (existingDoc.file_path && fs.existsSync(existingDoc.file_path)) {
        try {
          fs.unlinkSync(existingDoc.file_path);
        } catch (unlinkError) {
          console.error('Error deleting old file', unlinkError);
        }
      }

      fileUrl = `/uploads/${req.file.filename}`;
      filePath = req.file.path;
      fileSize = req.file.size;
    }

    // Update document
    await pool.execute(
      `UPDATE documents 
       SET name = ?, category = ?, description = ?, file_url = ?, file_path = ?, file_size = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name || existingDoc.name,
        category !== undefined ? category : existingDoc.category,
        description !== undefined ? description : existingDoc.description,
        fileUrl,
        filePath,
        fileSize,
        id,
      ]
    );

    // Get updated document
    const [updatedRows] = await pool.execute<DbDocument[]>(
      `SELECT id, name, type, category, file_path, file_url, file_size, employee_id, 
              document_type, uploaded_by, description, created_at, updated_at
       FROM documents WHERE id = ?`,
      [id]
    );

    return res.json({
      message: 'Document updated successfully',
      data: mapDocumentRow(updatedRows[0]),
    });
  } catch (error) {
    console.error('Error updating document', error);
    return res.status(500).json({ message: 'Unexpected error while updating document' });
  }
});

// GET /documents/file/:employeeId/:type - Serve employee document file (handles base64 or file path)
router.get('/file/:employeeId/:type', async (req, res) => {
  try {
    const { employeeId, type } = req.params;
    
    let fileData: string | null = null;
    let contentType = 'application/pdf';
    
    console.log(`Serving file for employee ${employeeId}, type: ${type}`);
    
    let storedMimeType: string | null = null;
    
    // Check documents table first for all types
    // Try with mime_type column, if it doesn't exist, fall back to without it
    try {
      const [docRows] = await pool.execute<any[]>(
        'SELECT file_url, file_path, mime_type FROM documents WHERE employee_id = ? AND document_type = ? ORDER BY created_at DESC LIMIT 1',
        [employeeId, type]
      );
      
      if (docRows.length > 0) {
        const doc = docRows[0];
        fileData = doc.file_url || doc.file_path;
        storedMimeType = doc.mime_type;
        // Use stored MIME type if available
        if (storedMimeType) {
          contentType = storedMimeType;
          console.log(`Using stored MIME type: ${contentType}`);
        }
        console.log(`Found document in documents table:`, {
          employee_id: employeeId,
          type: type,
          has_file_url: !!doc.file_url,
          has_file_path: !!doc.file_path,
          mime_type: storedMimeType,
          file_data_preview: fileData ? fileData.substring(0, 100) : 'NULL'
        });
      }
    } catch (error: any) {
      // If mime_type column doesn't exist, try without it
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        console.log('mime_type column not found, querying without it');
        const [docRows] = await pool.execute<any[]>(
          'SELECT file_url, file_path FROM documents WHERE employee_id = ? AND document_type = ? ORDER BY created_at DESC LIMIT 1',
          [employeeId, type]
        );
        
        if (docRows.length > 0) {
          const doc = docRows[0];
          fileData = doc.file_url || doc.file_path;
          console.log(`Found document in documents table (no mime_type):`, {
            employee_id: employeeId,
            type: type,
            has_file_url: !!doc.file_url,
            has_file_path: !!doc.file_path,
            file_data_preview: fileData ? fileData.substring(0, 100) : 'NULL'
          });
        }
      } else {
        throw error;
      }
    }
    
    // If not found in documents table, check employees table for legacy data
    if (!fileData && (type === 'pds' || type === 'sr' || type === 'file_201')) {
      const [empRows] = await pool.execute<any[]>(
        'SELECT pds_file, pdsFile, service_record_file, serviceRecordFile, file_201 FROM employees WHERE employee_id = ?',
        [employeeId]
      );
      
      if (empRows.length > 0) {
        const employee = empRows[0];
        console.log(`Checking employees table for legacy data:`, {
          employee_id: employeeId,
          has_pds_file: !!employee.pds_file,
          has_service_record_file: !!employee.service_record_file,
          has_file_201: !!employee.file_201
        });
        
        // Get the appropriate file based on type
        if (type === 'pds') {
          fileData = employee.pds_file || employee.pdsFile;
        } else if (type === 'sr') {
          fileData = employee.service_record_file || employee.serviceRecordFile;
        } else if (type === 'file_201') {
          fileData = employee.file_201;
        }
      }
    }
    
    // For COE, only check documents table (already done above)
    if (type === 'coe' && !fileData) {
      console.log(`COE not found in documents table for employee ${employeeId}`);
    }
    
    if (!fileData) {
      console.log(`No file data found for employee ${employeeId}, type ${type}`);
      return res.status(404).json({ message: 'Document not found for this employee' });
    }
    
    console.log(`File data found: ${fileData.substring(0, 50)}...`);
    
    // Determine content type from file extension if not already set
    if (contentType === 'application/pdf') {
      const ext = path.extname(fileData).toLowerCase();
      if (ext === '.doc') {
        contentType = 'application/msword';
      } else if (ext === '.docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (ext === '.pdf') {
        contentType = 'application/pdf';
      }
    }
    
    console.log(`Final MIME type: ${contentType}`);
    
    // If it's a base64 string, decode and serve it
    if (fileData.startsWith('data:')) {
      const base64Match = fileData.match(/^data:([^;]+);base64,(.+)$/);
      if (base64Match) {
        const detectedMimeType = base64Match[1];
        const base64Data = base64Match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        console.log(`Serving base64 file, MIME: ${detectedMimeType}, size: ${buffer.length} bytes`);
        
        // Determine file extension from MIME type
        let fileExt = 'pdf';
        if (detectedMimeType.includes('word') || detectedMimeType.includes('msword')) {
          fileExt = detectedMimeType.includes('openxml') ? 'docx' : 'doc';
        }
        
        // Set headers to allow embedding and prevent CSP issues
        res.setHeader('Content-Type', detectedMimeType);
        res.setHeader('Content-Disposition', `inline; filename="${type}_${employeeId}.${fileExt}"`);
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.send(buffer);
      }
    }
    
    // If it's a file path, try to serve it
    if (fileData.startsWith('/uploads/') || !fileData.includes('/')) {
      const filename = fileData.replace('/uploads/', '');
      const filePath = path.join(__dirname, '../uploads/', filename);
      
      console.log(`Attempting to serve file from: ${filePath}`);
      
      if (fs.existsSync(filePath)) {
        console.log(`File exists, serving: ${filePath}`);
        
        // Use stored contentType, or detect from file extension
        let finalMimeType = contentType;
        if (finalMimeType === 'application/pdf') {
          const ext = path.extname(filePath).toLowerCase();
          if (ext === '.doc') {
            finalMimeType = 'application/msword';
          } else if (ext === '.docx') {
            finalMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          }
        }
        
        console.log(`File extension: ${path.extname(filePath)}, Final MIME type: ${finalMimeType}`);
        
        // Set Content-Disposition based on file type
        // Only PDFs can be previewed inline, others should be attachment
        const ext = path.extname(filePath).toLowerCase();
        const disposition = ext === '.pdf' ? 'inline' : 'attachment';
        
        // Set headers to allow embedding and downloading
        res.setHeader('Content-Type', finalMimeType);
        res.setHeader('Content-Disposition', `${disposition}; filename="${path.basename(filePath)}"`);
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.sendFile(filePath);
      } else {
        console.log(`File not found at: ${filePath}`);
      }
    }
    
    // If file_path is an absolute path, try to serve it directly
    if (fileData && fs.existsSync(fileData)) {
      console.log(`Serving absolute path: ${fileData}`);
      
      // Detect MIME type from file extension
      let detectedMimeType = 'application/pdf';
      const ext = path.extname(fileData).toLowerCase();
      if (ext === '.doc') {
        detectedMimeType = 'application/msword';
      } else if (ext === '.docx') {
        detectedMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (ext === '.pdf') {
        detectedMimeType = 'application/pdf';
      }
      
      console.log(`File extension: ${ext}, MIME type: ${detectedMimeType}`);
      
      res.setHeader('Content-Type', detectedMimeType);
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(fileData)}"`);
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.sendFile(path.resolve(fileData));
    }
    
    console.log(`File not found anywhere for: ${fileData}`);
    return res.status(404).json({ message: 'File not found on server' });
  } catch (error) {
    console.error('Error serving document file:', error);
    return res.status(500).json({ message: 'Error serving file', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// DELETE document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get document info before deletion
    const [docRows] = await pool.execute<DbDocument[]>(
      'SELECT name, file_path, uploaded_by FROM documents WHERE id = ?',
      [id]
    );
    const doc = docRows[0];

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from filesystem
    if (doc.file_path && fs.existsSync(doc.file_path)) {
      try {
        fs.unlinkSync(doc.file_path);
      } catch (unlinkError) {
        console.error('Error deleting file from filesystem', unlinkError);
        // Continue with database deletion even if file deletion fails
      }
    }

    const [result] = await pool.execute('DELETE FROM documents WHERE id = ?', [id]);

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Log activity
    await logActivity({
      userName: req.body.deletedBy || doc.uploaded_by || 'System',
      actionType: 'DELETE',
      resourceType: 'Document',
      resourceId: id,
      resourceName: doc.name,
      description: `Document "${doc.name}" was deleted`,
      ipAddress: getClientIp(req),
      status: 'success',
    });

    return res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document', error);
    
    // Log failed activity
    await logActivity({
      userName: req.body.deletedBy || 'System',
      actionType: 'DELETE',
      resourceType: 'Document',
      resourceId: req.params.id,
      description: `Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ipAddress: getClientIp(req),
      status: 'failed',
    });

    return res.status(500).json({ message: 'Unexpected error while deleting document' });
  }
});

export default router;

