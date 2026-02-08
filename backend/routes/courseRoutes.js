const express = require("express");
const Course = require("../models/Course");
const { createCourse, enrollCourse } = require("../controllers/courseController");
const router = express.Router();

router.post("/create", createCourse);
router.post("/enroll/:id", enrollCourse);
router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});
router.get("/", async (req, res) => {
  const courses = await require("../models/Course").find();
  res.json(courses);
});
router.get("/:id", async (req, res) => {
  try {
    console.log("COURSE ID RECEIVED:", req.params.id);

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("COURSE FETCH ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
