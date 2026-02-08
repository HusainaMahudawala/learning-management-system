const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json(course);
};

exports.enrollCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  course.students.push(req.body.userId);
  await course.save();
  res.json({ message: "Enrolled successfully" });
};
