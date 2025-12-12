"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Ensure uploads/logos directory exists
const logosDir = path_1.default.join(__dirname, '../uploads/logos/');
if (!fs_1.default.existsSync(logosDir)) {
    fs_1.default.mkdirSync(logosDir, { recursive: true });
}
// Configure multer for logo upload
const upload = (0, multer_1.default)({
    dest: logosDir,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /\.(jpg|jpeg|png|gif|svg)$/i;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname));
        const mimetype = file.mimetype.startsWith('image/');
        if (extname && mimetype) {
            return cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only image files are allowed.'));
        }
    },
});
const settingsSchema = zod_1.z.object({
    siteTitle: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    copyright: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    systemEmail: zod_1.z.string().email().optional(),
    address: zod_1.z.string().optional(),
});
// GET all settings
router.get('/', async (req, res) => {
    try {
        const [rows] = await db_1.pool.execute('SELECT `key`, `value` FROM settings');
        const settings = {};
        rows.forEach((row) => {
            settings[row.key] = row.value;
        });
        return res.json({ data: settings });
    }
    catch (error) {
        console.error('Error fetching settings', error);
        return res.status(500).json({ message: 'Unexpected error while fetching settings' });
    }
});
// PUT update settings
router.put('/', upload.single('logo'), async (req, res) => {
    try {
        const parseResult = settingsSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: 'Invalid request body',
                errors: parseResult.error.flatten().fieldErrors,
            });
        }
        const settings = parseResult.data;
        // Handle logo upload
        if (req.file) {
            const logoUrl = `/uploads/logos/${req.file.filename}`;
            await db_1.pool.execute(`INSERT INTO settings (\`key\`, \`value\`) 
         VALUES ('logoUrl', ?) 
         ON DUPLICATE KEY UPDATE \`value\` = ?`, [logoUrl, logoUrl]);
        }
        // Update other settings
        for (const [key, value] of Object.entries(settings)) {
            if (value !== undefined) {
                await db_1.pool.execute(`INSERT INTO settings (\`key\`, \`value\`) 
           VALUES (?, ?) 
           ON DUPLICATE KEY UPDATE \`value\` = ?`, [key, value, value]);
            }
        }
        return res.json({ message: 'Settings updated successfully' });
    }
    catch (error) {
        console.error('Error updating settings', error);
        return res.status(500).json({ message: 'Unexpected error while updating settings' });
    }
});
exports.default = router;
