"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const { DB_HOST = 'localhost', DB_PORT = '3306', DB_USER = 'root', DB_PASSWORD = '', DB_NAME = 'hrm', } = process.env;
exports.pool = promise_1.default.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// Test database connection on startup
exports.pool.getConnection()
    .then((connection) => {
    console.log('✅ Database connected successfully');
    connection.release();
})
    .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your database configuration in server/.env');
    console.error('Make sure MySQL is running and the database exists.');
});
