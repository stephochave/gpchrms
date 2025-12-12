"use strict";
/**
 * QR Code Generation Utility
 * Generates secure JWT-based QR codes for employee authentication
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRSecret = generateQRSecret;
exports.generateQRToken = generateQRToken;
exports.generateQRCodeDataURL = generateQRCodeDataURL;
exports.verifyQRToken = verifyQRToken;
exports.generateEmployeeQRCode = generateEmployeeQRCode;
exports.validateAttendanceQR = validateAttendanceQR;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const qrcode_1 = __importDefault(require("qrcode"));
const crypto_1 = __importDefault(require("crypto"));
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const QR_TOKEN_EXPIRY = '365d'; // QR codes valid for 1 year
/**
 * Generate a secure random secret for QR code signing
 */
function generateQRSecret() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
/**
 * Generate JWT token for QR code
 * @param employeeId - Unique employee identifier
 * @param employeeName - Employee full name
 * @param secret - Employee-specific secret key
 * @returns JWT token string
 */
function generateQRToken(employeeId, employeeName, secret) {
    const payload = {
        employeeId,
        employeeName,
        type: 'attendance',
    };
    return jsonwebtoken_1.default.sign(payload, `${JWT_SECRET}-${secret}`, {
        expiresIn: QR_TOKEN_EXPIRY,
    });
}
/**
 * Generate QR code data URL from token
 * @param token - JWT token to encode
 * @returns Promise<string> - Base64 data URL for QR code image
 */
async function generateQRCodeDataURL(token) {
    try {
        const dataURL = await qrcode_1.default.toDataURL(token, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
        return dataURL;
    }
    catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code image');
    }
}
/**
 * Verify and decode QR token
 * @param token - JWT token from scanned QR code
 * @param secret - Employee-specific secret key
 * @returns Decoded payload or null if invalid
 */
function verifyQRToken(token, secret) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, `${JWT_SECRET}-${secret}`);
        return decoded;
    }
    catch (error) {
        console.error('QR token verification failed:', error);
        return null;
    }
}
/**
 * Generate complete QR code package for employee
 * @param employeeId - Unique employee identifier
 * @param employeeName - Employee full name
 * @param existingSecret - Optional existing secret (for regeneration)
 * @returns Object with token, secret, and expiration
 */
async function generateEmployeeQRCode(employeeId, employeeName, existingSecret) {
    // Use existing secret or generate new one
    const secret = existingSecret || generateQRSecret();
    // Generate JWT token
    const token = generateQRToken(employeeId, employeeName, secret);
    // Calculate expiration date
    const decoded = jsonwebtoken_1.default.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);
    return {
        token,
        secret,
        expiresAt,
    };
}
/**
 * Validate QR code scan for attendance
 * @param scannedToken - Token from scanned QR code
 * @param employeeSecret - Secret from database
 * @param expectedEmployeeId - Expected employee ID (optional for verification)
 * @returns Validation result with employee info
 */
function validateAttendanceQR(scannedToken, employeeSecret, expectedEmployeeId) {
    const decoded = verifyQRToken(scannedToken, employeeSecret);
    if (!decoded) {
        return { valid: false, error: 'Invalid or expired QR code' };
    }
    // Verify employee ID matches if provided
    if (expectedEmployeeId && decoded.employeeId !== expectedEmployeeId) {
        return { valid: false, error: 'QR code does not match employee' };
    }
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
        return { valid: false, error: 'QR code has expired' };
    }
    return {
        valid: true,
        employeeId: decoded.employeeId,
        employeeName: decoded.employeeName,
    };
}
