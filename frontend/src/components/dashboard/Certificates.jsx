import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import API from "../../api/api";
import CertificateModal from "../CertificateModal";
import "./Certificates.css";

export default function Certificates() {
  const [completedEnrollments, setCompletedEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [activeCourseId, setActiveCourseId] = useState(null);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        setLoading(true);
        const res = await API.get("/enrollments");
        const completed = res.data.filter((e) => e.completed === true);
        setCompletedEnrollments(completed);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  const openPreview = async (courseId) => {
    try {
      const res = await API.get(`/certificates/data/${courseId}`);
      setCertificateData(res.data);
      setActiveCourseId(courseId);
      setModalOpen(true);
    } catch (err) {
      console.error("Failed to load certificate data:", err);
      alert("Failed to load certificate preview");
    }
  };

  const downloadPDF = async (courseId) => {
    try {
      const res = await API.get(`/certificates/${courseId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download certificate:", err);
      alert("Failed to download certificate");
    }
  };

  if (loading) return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="certificates-page"><p>Loading certificates...</p></div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="certificates-page">
        <h1>Your Certificates</h1>

        {completedEnrollments.length === 0 ? (
          <p className="empty">You have no completed courses yet.</p>
        ) : (
          <div className="cert-grid">
            {completedEnrollments.map((enrollment) => (
              <div className="cert-card" key={enrollment._id}>
                <div className="cert-info">
                  <h3>{enrollment.courseId?.title || "Course"}</h3>
                  <p className="muted">Completed on: {new Date(enrollment.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="cert-actions">
                  <button className="btn-view" onClick={() => openPreview(enrollment.courseId._id)}>
                    View
                  </button>
                  <button className="btn-download" onClick={() => downloadPDF(enrollment.courseId._id)}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <CertificateModal
        certificateData={certificateData}
        courseId={activeCourseId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDownload={downloadPDF}
      />
    </div>
  );
}
