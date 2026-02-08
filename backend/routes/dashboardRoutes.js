const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Total learners
    const totalLearners = await User.countDocuments();

    // 2️⃣ User enrollments
    const enrollments = await Enrollment.find({ userId });

    const totalCourses = enrollments.length;

    // 3️⃣ Course breakdown
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    let learningTime = 0;

    enrollments.forEach((e) => {
      // Convert seconds to hours
      learningTime += e.learningTime / 3600;

      if (e.completed) completed++;
      else if (e.progress > 0) inProgress++;
      else notStarted++;
    });

    // 4️⃣ Learning insights (last 7 days)
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const insightsMap = {};

    days.forEach(day => insightsMap[day] = 0);

    enrollments.forEach((e) => {
      const day = days[new Date(e.updatedAt).getDay()];
      // Convert seconds to hours for insights chart
      insightsMap[day] += e.learningTime / 3600;
    });

    const learningInsights = Object.keys(insightsMap).map(day => ({
      day,
      hours: insightsMap[day],
    }));

    res.json({
      totalLearners,
      totalCourses,
      learningTime,
      courseBreakdown: [
        { name: "Completed", value: completed },
        { name: "In Progress", value: inProgress },
        { name: "Not Started", value: notStarted },
      ],
      learningInsights,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
});


module.exports = router;
