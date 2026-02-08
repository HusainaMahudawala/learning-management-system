const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// Create a course (admin only)
router.post('/courses', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, thumbnail, modules } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    const course = await Course.create({ title, description, thumbnail, modules: modules || [] });
    res.status(201).json({ course });
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ message: 'Failed to create course' });
  }
});

// Update course (admin only)
router.put('/courses/:courseId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) return res.status(400).json({ message: 'Invalid course ID' });

    const updates = req.body;
    const course = await Course.findByIdAndUpdate(courseId, updates, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ course });
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ message: 'Failed to update course' });
  }
});

// Delete course (admin only)
router.delete('/courses/:courseId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) return res.status(400).json({ message: 'Invalid course ID' });

    const course = await Course.findByIdAndDelete(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ deleted: true });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ message: 'Failed to delete course' });
  }
});

// List users with basic stats (admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().lean();

    const usersWithStats = await Promise.all(users.map(async (u) => {
      const enrollments = await Enrollment.find({ userId: u._id }).lean();
      const coursesEnrolled = enrollments.length;
      const totalLearningSeconds = enrollments.reduce((s, e) => s + (e.learningTime || 0), 0);
      const totalLearningHours = Number((totalLearningSeconds / 3600).toFixed(2));
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        coursesEnrolled,
        totalLearningHours,
      };
    }));

    res.json({ users: usersWithStats });
  } catch (err) {
    console.error('Admin users list error:', err);
    res.status(500).json({ message: 'Failed to list users' });
  }
});

// Get single user with enrollments and progress (admin only)
router.get('/users/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid user ID' });

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const enrollments = await Enrollment.find({ userId }).populate('courseId', 'title thumbnail').lean();

    const enriched = enrollments.map(e => ({
      id: e._id,
      course: e.courseId,
      progress: e.progress,
      completed: e.completed,
      learningHours: Number(((e.learningTime || 0) / 3600).toFixed(2)),
      updatedAt: e.updatedAt,
    }));

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, enrollments: enriched });
  } catch (err) {
    console.error('Admin get user error:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

module.exports = router;
