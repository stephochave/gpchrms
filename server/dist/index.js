"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
require("./db"); // Initialize database connection
const auth_1 = __importDefault(require("./routes/auth"));
const employees_1 = __importDefault(require("./routes/employees"));
const departments_1 = __importDefault(require("./routes/departments"));
const designations_1 = __importDefault(require("./routes/designations"));
const calendarEvents_1 = __importDefault(require("./routes/calendarEvents"));
const activityLogs_1 = __importDefault(require("./routes/activityLogs"));
const documents_1 = __importDefault(require("./routes/documents"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const settings_1 = __importDefault(require("./routes/settings"));
const leave_1 = __importDefault(require("./routes/leave"));
const attendanceAutoAbsent_1 = require("./utils/attendanceAutoAbsent");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Allow multiple origins for development
const allowedOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
    : [
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173",
    ];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 ||
            allowedOrigins.includes("*")) {
            callback(null, true);
        }
        else {
            callback(null, true); // Allow all in development for easier debugging
        }
    },
    credentials: true,
}));
// Configure helmet to allow iframes from frontend
// Disable CSP for document routes (we'll set it per-route)
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            frameAncestors: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4000"],
            frameSrc: ["'self'", "http://localhost:4000", "http://127.0.0.1:4000"],
        },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding documents
}));
// ⭐ FIXED PART — increase body limits for image uploads
app.use(express_1.default.json({ limit: "5mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "5mb" }));
// Static uploads folder - use same path as multer (server/src/uploads/)
// Files are saved to server/src/uploads/ by multer in documents.ts
const uploadsStaticPath = path_1.default.join(__dirname, "uploads");
if (!fs_1.default.existsSync(uploadsStaticPath)) {
    fs_1.default.mkdirSync(uploadsStaticPath, { recursive: true });
}
console.log('Static uploads path:', uploadsStaticPath);
// Add CSP headers to static files to allow framing
app.use("/uploads", (req, res, next) => {
    // Set CSP headers to allow framing from frontend
    const frontendOrigins = process.env.CLIENT_ORIGIN?.split(',').map(o => o.trim()) || ['http://localhost:5173', 'http://127.0.0.1:5173'];
    const cspValue = `frame-ancestors 'self' ${frontendOrigins.join(' ')}`;
    res.setHeader('Content-Security-Policy', cspValue);
    // Don't set X-Frame-Options as it conflicts with CSP
    next();
}, express_1.default.static(uploadsStaticPath));
// Health check route
app.get("/health", (_, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Routes
app.use("/auth", auth_1.default);
app.use("/employees", employees_1.default);
app.use("/departments", departments_1.default);
app.use("/designations", designations_1.default);
app.use("/calendar-events", calendarEvents_1.default);
app.use("/activity-logs", activityLogs_1.default);
app.use("/documents", documents_1.default);
app.use("/notifications", notifications_1.default);
app.use("/attendance", attendance_1.default);
app.use("/settings", settings_1.default);
app.use("/leave", leave_1.default);
// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});
// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.listen(PORT, () => {
    console.log(`HR Hub API listening on port ${PORT}`);
    // Simple scheduler: every 5 minutes check if it's past 4:00 PM
    // and auto-mark employees as absent for today if they have no attendance.
    // To avoid duplicate work, only run once per day.
    let lastAutoAbsentDate = null;
    const runAutoAbsentIfNeeded = async () => {
        const today = new Date().toISOString().split("T")[0];
        if (lastAutoAbsentDate === today) {
            return;
        }
        await (0, attendanceAutoAbsent_1.autoMarkAbsentForToday)();
        // If we successfully get here and it's already past 4 PM,
        // mark as done for today to avoid re-running.
        const now = new Date();
        if (now.getHours() >= 16) {
            lastAutoAbsentDate = today;
        }
    };
    // Run once on startup (in case server starts after 4 PM)
    runAutoAbsentIfNeeded().catch((err) => console.error("Initial auto-absent check failed:", err));
    // Then check every 5 minutes
    setInterval(() => {
        runAutoAbsentIfNeeded().catch((err) => console.error("Scheduled auto-absent check failed:", err));
    }, 5 * 60 * 1000);
});
