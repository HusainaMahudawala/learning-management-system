const PDFDocument = require("pdfkit");
const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Get certificate data for preview
exports.getCertificateData = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Fetch enrollment
    const enrollment = await Enrollment.findOne({
      userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (!enrollment || !enrollment.completed) {
      return res
        .status(400)
        .json({ message: "Course not completed or enrollment not found" });
    }

    // Fetch user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or course not found" });
    }

    // Return certificate data
    const completionDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const learningHours = Number((enrollment.learningTime / 3600).toFixed(2));

    res.json({
      userName: user.name,
      courseTitle: course.title,
      learningTime: learningHours,
      completionDate,
      certificateId: enrollment._id,
    });
  } catch (error) {
    console.error("Certificate data fetch error:", error);
    res.status(500).json({ message: "Failed to fetch certificate data" });
  }
};

// Generate and download PDF
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Fetch enrollment
    const enrollment = await Enrollment.findOne({
      userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    })
      .populate("courseId", "title")
      .populate("userId", "name email");

    if (!enrollment || !enrollment.completed) {
      return res
        .status(400)
        .json({ message: "Course not completed or enrollment not found" });
    }

    // Fetch user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or course not found" });
    }

    // Create PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="certificate-${course.title}.pdf"`
    );

    // Pipe to response
    doc.pipe(res);

    // Add border
    doc
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .stroke();
    doc
      .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
      .stroke();

    // Title
    doc
      .fontSize(40)
      .font("Helvetica-Bold")
      .text("CERTIFICATE", 50, 100, { align: "center" })
      .fontSize(16)
      .font("Helvetica")
      .text("OF COMPLETION", 50, 150, { align: "center" });

    // Decorative line
    doc
      .moveTo(150, 200)
      .lineTo(doc.page.width - 150, 200)
      .stroke();

    // Body text
    doc
      .fontSize(14)
      .text(`This is to certify that`, 50, 250, { align: "center" });

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(user.name, 50, 290, { align: "center" });

    doc
      .fontSize(14)
      .font("Helvetica")
      .text(
        `has successfully completed the course`,
        50,
        340,
        { align: "center" }
      );

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(course.title, 50, 380, { align: "center" });

    const learningHoursPDF = Number((enrollment.learningTime / 3600).toFixed(2));

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Learning Time: ${learningHoursPDF} hours`, 50, 430, {
        align: "center",
      });

    // Date
    const completionDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc
      .fontSize(11)
      .text(`Issued on: ${completionDate}`, 50, 480, { align: "center" });

    // Certificate ID
    doc
      .fontSize(10)
      .text(
        `Certificate ID: ${enrollment._id}`,
        50,
        510,
        { align: "center" }
      );

    // Signature area
    doc
      .fontSize(12)
      .text("Authorized by LMS Platform", 100, 560);
    doc
      .moveTo(100, 555)
      .lineTo(280, 555)
      .stroke();

    doc.end();
  } catch (error) {
    console.error("Certificate generation error:", error);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};
