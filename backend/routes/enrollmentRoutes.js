const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/authMiddleware");

/* ===========================
   GET ALL USER ENROLLMENTS
=========================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate("courseId", "title description thumbnail")
      .lean();

    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
});

/* ===========================
   GET ENROLLMENT PROGRESS
=========================== */
router.get("/progress/:courseId", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    res.json({
      progress: enrollment.progress,
      completed: enrollment.completed,
      learningTime: enrollment.learningTime,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Progress fetch error" });
  }
});

/* ===========================
   ENROLL IN COURSE
=========================== */
router.post("/:courseId", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const existing = await Enrollment.findOne({
      userId: req.user.id,
      courseId,
    });

    if (existing) {
      return res.json({ enrolled: true });
    }

    await Enrollment.create({
      userId: req.user.id,
      courseId,
      progress: 0,
      completed: false,
      learningTime: 0,
    });

    res.status(201).json({ enrolled: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Enrollment failed" });
  }
});

/* ===========================
   UPDATE LEARNING TIME
=========================== */
router.post("/complete-lesson", authMiddleware, async (req, res) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.body;

    if (!courseId && courseId !== 0) {
      return res.status(400).json({ message: "Course ID required" });
    }

    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lesson =
      course.modules[moduleIndex]?.lessons[lessonIndex];

    if (!lesson) {
      return res.status(400).json({ message: "Lesson not found" });
    }

    // Avoid double counting
    const alreadyCompleted = enrollment.completedLessons.some(
      l =>
        l.moduleIndex === moduleIndex &&
        l.lessonIndex === lessonIndex
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push({ moduleIndex, lessonIndex });

      // 🔥 ADD LESSON DURATION (minutes → hours)
      enrollment.learningTime += lesson.duration / 60;
    }

    enrollment.updatedAt = new Date();
    await enrollment.save();

    res.json({
      learningTime: enrollment.learningTime
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lesson completion failed" });
  }
});


/* ===========================
   MARK COURSE COMPLETED
=========================== */
router.post("/complete/:courseId", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    enrollment.completed = true;
    enrollment.progress = 100;
    enrollment.updatedAt = new Date();

    await enrollment.save();

    res.json({ completed: true, progress: 100 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark course completed" });
  }
});

module.exports = router;
