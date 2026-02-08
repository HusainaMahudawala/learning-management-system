import { useParams } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";
import CertificateModal from "./CertificateModal";
import "./CourseDetail.css";
import { useEffect, useState } from "react";
import API from "../api/api";

const CourseDetail = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [openModule, setOpenModule] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);

  const [enrolled, setEnrolled] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [watchSeconds, setWatchSeconds] = useState(0);
  
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [loadingCertificate, setLoadingCertificate] = useState(false);

  /* ---------------- FETCH COURSE ---------------- */
  useEffect(() => {
    const fetchCourse = async () => {
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data);
    };
    fetchCourse();
  }, [id]);

  /* ---------------- FETCH ENROLLMENT ---------------- */
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get(`/enrollments/progress/${id}`);
        setEnrolled(true);
        setCourseProgress(res.data.progress || 0);
        setCompleted(res.data.completed === true);
      } catch {
        setEnrolled(false);
      }
    };
    fetchProgress();
  }, [id]);

  /* ---------------- ENROLL ---------------- */
  const handleEnroll = async () => {
    try {
      await API.post(`/enrollments/${course._id}`);
      alert("✅ Successfully enrolled!");
      setEnrolled(true);
    } catch {
      alert("Enrollment failed");
    }
  };

  const updateLearningTime = async (seconds) => {
    if (!enrolled) {
      console.warn("User not enrolled in this course");
      return;
    }
    if (!course?._id) {
      console.warn("Course ID not available yet");
      return;
    }
    try {
      console.log(`Updating learning time: ${seconds}s for course ${course._id}`);
      const res = await API.post(`/enrollments/learning-time/${course._id}`, {
        seconds,
      });
      console.log("Learning time updated:", res.data);
    } catch (err) {
      console.error("Learning time update failed:", err.response?.data || err.message);
    }
  };


  /* ---------------- AUTO PROGRESS ON VIDEO PLAY ---------------- */
  const handleVideoPlay = () => {
    setCourseProgress((prev) => {
      if (prev >= 100) return 100;
      return Math.min(prev + 10, 100);
    });
  };

  /* ---------------- MARK COURSE COMPLETED ---------------- */
  const markCourseCompleted = async () => {
    try {
      await API.post(`/enrollments/complete/${course._id}`);
      setCompleted(true);
      setCourseProgress(100);
      alert("🎉 Course marked as completed!");
    } catch {
      alert("Failed to mark course completed");
    }
  };

  const openCertificateModal = async () => {
    try {
      setLoadingCertificate(true);
      const response = await API.get(`/certificates/data/${course._id}`);
      setCertificateData(response.data);
      setShowCertificateModal(true);
    } catch (error) {
      console.error("Failed to load certificate:", error);
      alert("Failed to load certificate");
    } finally {
      setLoadingCertificate(false);
    }
  };

  const downloadCertificatePDF = async (courseId) => {
    try {
      const response = await API.get(`/certificates/${courseId}`, {
        responseType: "blob",
      });

      // Create a blob URL and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${course.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setShowCertificateModal(false);
      alert("✅ Certificate downloaded successfully!");
    } catch (error) {
      console.error("Failed to download certificate:", error);
      alert("Failed to download certificate");
    }
  };

  const toggleModule = (index) =>
    setOpenModule(openModule === index ? null : index);

  if (!course) return null;

  // derived stats
  const totalModules = course.modules?.length || 0;
  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const totalDuration = course.modules?.reduce((acc, m) => {
    return (
      acc +
      (m.lessons || []).reduce((s, l) => s + (Number(l.duration) || 0), 0)
    );
  }, 0) || 0;

  const demoLesson = course.modules?.[0]?.lessons?.[0] || null;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="course-detail-page">
        {/* ---------------- HERO ---------------- */}
        <div className="course-hero">
          <div className="course-info">
            <span className="course-rating">⭐ 4.8 (2,340 reviews)</span>
            <h1>{course.title}</h1>
            <p className="course-subtitle">{course.description}</p>

            {/* Progress removed from course detail - handled on Progress page */}

            <div className="course-actions">
              {!enrolled && (
                <button className="primary-btn" onClick={handleEnroll}>
                  Enroll Now
                </button>
              )}

              {enrolled && !completed && (
                <button
                  className="primary-btn"
                  onClick={markCourseCompleted}
                >
                  ✅ Mark as Completed
                </button>
              )}

              {completed && (
                <button
                  className="certificate-btn"
                  onClick={openCertificateModal}
                  disabled={loadingCertificate}
                >
                  {loadingCertificate ? "Loading..." : "📜 View Certificate"}
                </button>
              )}

              {completed && (
                <button className="completed-btn" disabled>
                  🎉 Completed
                </button>
              )}
            </div>
          </div>

          <div className="course-video">
            {demoLesson?.videoUrl ? (
              <div
                className="hero-preview"
                onClick={() => {
                  // open first lesson preview
                  setActiveLesson(demoLesson);
                }}
                role="button"
                tabIndex={0}
              >
                <img src={course.thumbnail} alt={course.title} />
                <div className="play-overlay">▶</div>
              </div>
            ) : (
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"}
                alt={course.title}
              />
            )}
          </div>
        </div>

        {/* ---------------- VIDEO PLAYER ---------------- */}
        {activeLesson && (
          <div className="video-player">
            <video
              src={activeLesson.videoUrl}
              controls
              autoPlay
              onPlay={handleVideoPlay}
              onTimeUpdate={(e) => {
                const current = Math.floor(e.target.currentTime);
                // Every 10 seconds, add 10 seconds to learning time
                if (current > 0 && current % 10 === 0 && current !== watchSeconds) {
                  setWatchSeconds(current);
                  updateLearningTime(10);
                }
              }}
              style={{ width: "100%", maxHeight: "500px", borderRadius: "12px" }}
            />
          </div>
        )}

        {/* ---------------- TABS ---------------- */}
        <div className="course-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          <button
            className={activeTab === "curriculum" ? "active" : ""}
            onClick={() => setActiveTab("curriculum")}
          >
            Curriculum
          </button>
        </div>

        {/* ---------------- CONTENT ---------------- */}
        <div className="course-content">
          {activeTab === "overview" && (
            <div className="course-left">
              <h2>About this course</h2>
              <p>{course.description}</p>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="course-left">
              {course.modules?.map((module, index) => (
                <div className="module" key={index}>
                  <div
                    className="module-header"
                    onClick={() => toggleModule(index)}
                  >
                    <h3>{module.title}</h3>
                    <span>{openModule === index ? "−" : "+"}</span>
                  </div>

                  {openModule === index && (
                    <ul className="lesson-list">
                      {module.lessons.map((lesson, i) => (
                        <li
                          key={i}
                          className={!enrolled ? "lesson locked" : "lesson"}
                          onClick={() => {
                            if (!enrolled) {
                              alert("Please enroll to start learning");
                              return;
                            }
                            setActiveLesson(lesson);
                            setWatchSeconds(0);
                          }}
                        >
                          <div className="lesson-thumb" style={{ backgroundImage: `url(${lesson.thumbnail || course.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"})` }} />
                          <div className="lesson-meta">
                            <div className="lesson-title">{lesson.title}</div>
                            <div className="lesson-sub">{lesson.duration || 0} min</div>
                          </div>
                          <div className="lesson-action">▶</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="course-stats">
            <h3>Course Info</h3>
            <div className="stat">
              📚 Modules <span>{totalModules}</span>
            </div>
            <div className="stat">
              🎓 Lessons <span>{totalLessons}</span>
            </div>
            <div className="stat">
              ⏱️ Duration <span>{totalDuration} min</span>
            </div>
            <div className="stat">
              📜 Certificate <span>{completed ? "Earned" : "Available"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificateData={certificateData}
        courseId={course?._id}
        onClose={() => setShowCertificateModal(false)}
        onDownload={downloadCertificatePDF}
        isOpen={showCertificateModal}
      />
    </div>
  );
};

export default CourseDetail;
