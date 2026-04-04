const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ⚠️ Load env FIRST before any module that needs process.env
dotenv.config();

const connectDB = require("./config/Db");

const authRoutes = require("./routes/authRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const courseRoutes = require("./routes/courseRoutes");
const chatRoutes = require("./routes/chatRoutes");
const institutionRoutes = require("./routes/institutionRoutes");

const app = express();

// ── Security Middleware (Production Ready) ─────────────────────────
// Configure helmet to allow CORS preflight requests
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false, // Required for some frontend features
    crossOriginOpenerPolicy: false,   // Required for some frontend features
  })
);

// Apply Rate Limiting to prevent brute force / DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use(limiter);

// ── CORS (Dynamic for Production) ────────────────────────────────────
// Allow process.env.CLIENT_URL or default to localhosts if not set
// ✅ FIX: Added .trim() to handle spaces after commas in env vars
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map(url => url.trim())
  : [
    "https://ai-avichi-based-admission-chatbot.netlify.app", // admin-ui (Vite)
    "https://your-chatbot-ui.vercel.app", // chatbot-ui (Vite)
    "http://localhost:5175",
    "http://localhost:5173", // Vite default dev port
  ];

app.use(
  cors({
    origin: function (origin, callback) {
      // ✅ Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ✅ FIX: Explicitly handle preflight OPTIONS requests
app.options("*", cors());

// ── Body Parsers ───────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── 🔍 Debug Middleware (Optional - Remove in Production) ─────────────
// Uncomment below to log CORS-related requests during testing
/*
app.use((req, res, next) => {
  if (req.method === "OPTIONS" || req.path.includes("/auth")) {
    console.log(`🌐 [CORS Debug] Origin: ${req.headers.origin} | Method: ${req.method} | Path: ${req.path}`);
  }
  next();
});
*/

// ── Health Check ───────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ── Routes ─────────────────────────────────────────────────────────────
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/courses", courseRoutes);
app.use("/api/institution", institutionRoutes);
app.use("/api", chatRoutes); // POST /api/chat

// ── 404 Handler (Catch undefined routes) ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Global Error Handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.message);

  // Hide stack traces in production!
  const isProduction = process.env.NODE_ENV === "production";

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: isProduction ? undefined : err.name,
    stack: isProduction ? undefined : err.stack,
  });
});

// ── Start Server ───────────────────────────────────────────────────────
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
      console.log(`🌍 Listening on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });