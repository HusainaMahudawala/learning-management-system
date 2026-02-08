import Sidebar from "./dashboard/Sidebar";
import "./CourseList.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledMap, setEnrolledMap] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        console.log("COURSES FROM API:", res.data);
        setCourses(res.data);
      } catch (err) {
        console.error("COURSE FETCH ERROR:", err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await API.get('/enrollments');
        const map = {};
        res.data.forEach(e => {
          if (e.courseId && e.courseId._id) map[e.courseId._id] = true;
        });
        setEnrolledMap(map);
      } catch (err) {
        console.error('Failed to fetch enrollments:', err);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="course-page">
        <h2 className="page-title">Courses</h2>

        <div className="course-grid">
          {courses
            .filter(course => course._id) // ✅ IMPORTANT SAFETY
            .map(course => (
              <div key={course._id} className="course-card">
                <Link to={`/course/${course._id}`} className="card-link">
                  <img
                    src={
                      course.thumbnail ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                    }
                    alt={course.title}
                  />

                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                  </div>
                </Link>

                <div className="card-footer">
                  <div className="meta">{course.modules?.length || 0} modules</div>
                  {enrolledMap[course._id] ? (
                    <Link to={`/course/${course._id}`} className="btn-continue">
                      View Course
                    </Link>
                  ) : (
                    <button
                      className="btn-enroll"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          await API.post(`/enrollments/${course._id}`);
                          setEnrolledMap(p => ({ ...p, [course._id]: true }));
                          alert('✅ Enrolled successfully');
                        } catch (err) {
                          console.error('Enroll failed:', err);
                          alert('Enrollment failed');
                        }
                      }}
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
