"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientIp = exports.logActivity = void 0;
const db_1 = require("../db");
const logActivity = async (data) => {
    try {
        await db_1.pool.execute(`INSERT INTO activity_logs 
        (user_id, user_name, action_type, resource_type, resource_id, resource_name,
         description, ip_address, status, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            data.userId || null,
            data.userName,
            data.actionType,
            data.resourceType,
            data.resourceId || null,
            data.resourceName || null,
            data.description || null,
            data.ipAddress || null,
            data.status || 'success',
            data.metadata ? JSON.stringify(data.metadata) : null,
        ]);
    }
    catch (error) {
        // Don't throw error - logging should not break the main operation
        console.error('Error logging activity:', error);
    }
};
exports.logActivity = logActivity;
const getClientIp = (req) => {
    return (req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.socket?.remoteAddress ||
        null);
};
exports.getClientIp = getClientIp;
