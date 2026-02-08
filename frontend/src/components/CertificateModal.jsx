import "./CertificateModal.css";

export default function CertificateModal({ certificateData, courseId, onClose, onDownload, isOpen }) {
  if (!isOpen || !certificateData) return null;

  return (
    <div className="certificate-modal-overlay" onClick={onClose}>
      <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="certificate-preview">
          {/* Border */}
          <div className="cert-border outer-border"></div>
          <div className="cert-border inner-border"></div>

          {/* Content */}
          <div className="cert-content">
            <h1 className="cert-title">CERTIFICATE</h1>
            <p className="cert-subtitle">OF COMPLETION</p>

            <div className="cert-divider"></div>

            <p className="cert-text">This is to certify that</p>

            <h2 className="cert-name">{certificateData.userName}</h2>

            <p className="cert-text">has successfully completed the course</p>

            <h3 className="cert-course">{certificateData.courseTitle}</h3>

            <p className="cert-details">
              Learning Time: <strong>{Number(certificateData.learningTime).toFixed(2)} hours</strong>
            </p>

            <p className="cert-date">Issued on: {certificateData.completionDate}</p>

            <p className="cert-id">Certificate ID: {certificateData.certificateId}</p>

            <div className="cert-signature">
              <p>Authorized by LMS Platform</p>
              <div className="signature-line"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
          <button className="btn-download" onClick={() => onDownload(courseId)}>
            📥 Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
