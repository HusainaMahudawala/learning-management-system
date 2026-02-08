const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  duration: Number,
  thumbnail: String,
});

const moduleSchema = new mongoose.Schema({
  title: String,
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    thumbnail: String,

    modules: [moduleSchema],   // 👈 REAL CURRICULUM
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
