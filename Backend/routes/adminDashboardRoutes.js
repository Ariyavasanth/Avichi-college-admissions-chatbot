const express = require("express");
const router = express.Router();
const {authMiddleware}  = require("../middleware/authMiddleware");
const {adminDashbord, addVectorData} = require("../controllers/adminDashboardController");

router.get("/stats", authMiddleware, adminDashbord);
router.post("/add-vector-data", authMiddleware, addVectorData);

module.exports = router;
