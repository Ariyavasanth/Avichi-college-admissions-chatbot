const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// ⚠️ Load env FIRST before any module that needs process.env
dotenv.config();

const connectDB = require("./config/Db");

const authRoutes = require("./routes/authRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const courseRoutes = require("./routes/courseRoutes");
const chatRoutes = require("./routes/chatRoutes");
const institutionRoutes = require("./routes/institutionRoutes");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173", // admin-ui (Vite)
      "http://localhost:5174", // chatbot-ui (Vite)
      "http://localhost:5175", // ← add this
    ],
    credentials: true,
  })
);

// ── Body Parsers ───────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ───────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// ── Routes ─────────────────────────────────────────────────────────────
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/courses", courseRoutes);
app.use("/api/institution", institutionRoutes);
app.use("/api", chatRoutes); // POST /api/chat

// ── Global Error Handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ── Start Server ───────────────────────────────────────────────────────
connectDB().then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
