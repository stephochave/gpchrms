/**
 * QR Code Generation Utility
 * Generates secure JWT-based QR codes for employee authentication
 */

import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const QR_TOKEN_EXPIRY = '365d'; // QR codes valid for 1 year

export interface QRCodePayload {
  employeeId: string;
  employeeName: string;
  type: 'attendance' | 'identification';
  iat: number;
  exp: number;
}

/**
 * Generate a secure random secret for QR code signing
 */
export function generateQRSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate JWT token for QR code
 * @param employeeId - Unique employee identifier
 * @param employeeName - Employee full name
 * @param secret - Employee-specific secret key
 * @returns JWT token string
 */
export function generateQRToken(
  employeeId: string,
  employeeName: string,
  secret: string
): string {
  const payload: Omit<QRCodePayload, 'iat' | 'exp'> = {
    employeeId,
    employeeName,
    type: 'attendance',
  };

  return jwt.sign(payload, `${JWT_SECRET}-${secret}`, {
    expiresIn: QR_TOKEN_EXPIRY,
  });
}

/**
 * Generate QR code data URL from token
 * @param token - JWT token to encode
 * @returns Promise<string> - Base64 data URL for QR code image
 */
export async function generateQRCodeDataURL(token: string): Promise<string> {
  try {
    const dataURL = await QRCode.toDataURL(token, {
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
  } catch (error) {
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
export function verifyQRToken(
  token: string,
  secret: string
): QRCodePayload | null {
  try {
    const decoded = jwt.verify(
      token,
      `${JWT_SECRET}-${secret}`
    ) as QRCodePayload;
    return decoded;
  } catch (error) {
    console.error('QR token verification failed:', error);
    return null;
  }
}

/**
 * Generate complete QR code package for employee
 * @param employeeId - Unique employee identifier
 * @param employeeName - Employee full name
 * @param existingSecret - Optional existing secret (for regeneration)
 * @returns Object with token, secret, expiration, dataURL, and employeeName
 */
export async function generateEmployeeQRCode(
  employeeId: string,
  employeeName: string,
  existingSecret?: string
): Promise<{
  token: string;
  secret: string;
  expiresAt: Date;
  dataURL: string;
  employeeName: string;
}> {
  // Use existing secret or generate new one
  const secret = existingSecret || generateQRSecret();

  // Generate JWT token
  const token = generateQRToken(employeeId, employeeName, secret);

  // Generate QR code image
  const dataURL = await generateQRCodeDataURL(token);

  // Calculate expiration date
  const decoded = jwt.decode(token) as QRCodePayload;
  const expiresAt = new Date(decoded.exp * 1000);

  return {
    token,
    secret,
    expiresAt,
    dataURL,
    employeeName,
  };
}

/**
 * Validate QR code scan for attendance
 * @param scannedToken - Token from scanned QR code
 * @param employeeSecret - Secret from database
 * @param expectedEmployeeId - Expected employee ID (optional for verification)
 * @returns Validation result with employee info
 */
export function validateAttendanceQR(
  scannedToken: string,
  employeeSecret: string,
  expectedEmployeeId?: string
): {
  valid: boolean;
  employeeId?: string;
  employeeName?: string;
  error?: string;
} {
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
