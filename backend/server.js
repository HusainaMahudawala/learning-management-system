const express = require("express");
const mongoose = require("mongoose");
const dashboardRoutes = require("./routes/dashboardRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));

app.use("/api/dashboard", dashboardRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));

app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/certificates", certificateRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
  console.log("Certificate routes registered at /api/certificates");
});
