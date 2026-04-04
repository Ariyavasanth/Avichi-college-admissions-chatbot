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
app.use(helmet()); // Secure HTTP headers

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
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : [
    "https://ai-avichi-based-admission-chatbot.netlify.app", // admin-ui (Vite)
    "https://your-chatbot-ui.vercel.app", // chatbot-ui (Vite)
    "http://localhost:5175",
  ];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ── Body Parsers ───────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ───────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime(), env: process.env.NODE_ENV });
});

// ── Routes ─────────────────────────────────────────────────────────────
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/courses", courseRoutes);
app.use("/api/institution", institutionRoutes);
app.use("/api", chatRoutes); // POST /api/chat

// ── Global Error Handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);

  // Hide stack traces in production!
  const isProduction = process.env.NODE_ENV === "production";

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: isProduction ? undefined : err.stack
  });
});

// ── Start Server ───────────────────────────────────────────────────────
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});
