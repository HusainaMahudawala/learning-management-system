const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { generateCertificate, getCertificateData } = require("../controllers/certificateController");

// Get certificate data for preview
router.get("/data/:courseId", authMiddleware, getCertificateData);

// Generate and download certificate PDF
router.get("/:courseId", authMiddleware, generateCertificate);

module.exports = router;
