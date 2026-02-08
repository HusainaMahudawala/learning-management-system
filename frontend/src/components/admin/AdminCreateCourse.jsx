import { useState } from "react";
import API from "../../api/api";
import "./AdminCreateCourse.css";

export default function AdminCreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddModule = () => {
    setModules([...modules, { title: "", lessons: [] }]);
  };

  const handleUpdateModule = (idx, field, value) => {
    const updated = [...modules];
    updated[idx][field] = value;
    setModules(updated);
  };

  const handleRemoveModule = (idx) => {
    setModules(modules.filter((_, i) => i !== idx));
  };

  const handleAddLesson = (moduleIdx) => {
    const updated = [...modules];
    updated[moduleIdx].lessons.push({ title: "", videoUrl: "", duration: 0, thumbnail: "" });
    setModules(updated);
  };

  const handleUpdateLesson = (moduleIdx, lessonIdx, field, value) => {
    const updated = [...modules];
    updated[moduleIdx].lessons[lessonIdx][field] = value;
    setModules(updated);
  };

  const handleRemoveLesson = (moduleIdx, lessonIdx) => {
    const updated = [...modules];
    updated[moduleIdx].lessons.splice(lessonIdx, 1);
    setModules(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/admin/courses", {
        title,
        description,
        thumbnail,
        modules,
      });
      setMessage(`✅ Course "${res.data.course.title}" created successfully!`);
      setTitle("");
      setDescription("");
      setThumbnail("");
      setModules([]);
    } catch (err) {
      setMessage(
        `❌ Error: ${err.response?.data?.message || "Failed to create course"}`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-container">
      <h2>Create New Course</h2>
      {message && <p className={message.includes("✅") ? "msg-success" : "msg-error"}>{message}</p>}

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label>Course Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Advanced React"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course description"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Thumbnail URL</label>
          <input
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="modules-section">
          <h3>Modules (Optional)</h3>
          {modules.map((mod, idx) => (
            <div key={idx} className="module-card">
              <div className="module-header">
                <input
                  type="text"
                  placeholder="Module title"
                  value={mod.title}
                  onChange={(e) => handleUpdateModule(idx, "title", e.target.value)}
                />
                <div className="module-actions">
                  <button type="button" className="btn-add-module" onClick={() => handleAddLesson(idx)}>+ Add Lesson</button>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveModule(idx)}
                  >
                    ✕ Remove Module
                  </button>
                </div>
              </div>

              {mod.lessons && mod.lessons.length > 0 && (
                <div className="lessons-list">
                  {mod.lessons.map((lesson, lidx) => (
                    <div key={lidx} className="lesson-card">
                      <input
                        type="text"
                        placeholder="Lesson title"
                        value={lesson.title}
                        onChange={(e) => handleUpdateLesson(idx, lidx, "title", e.target.value)}
                      />
                      <input
                        type="url"
                        placeholder="Video URL"
                        value={lesson.videoUrl}
                        onChange={(e) => handleUpdateLesson(idx, lidx, "videoUrl", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Duration (seconds)"
                        value={lesson.duration}
                        onChange={(e) => handleUpdateLesson(idx, lidx, "duration", Number(e.target.value))}
                      />
                      <input
                        type="url"
                        placeholder="Thumbnail URL (optional)"
                        value={lesson.thumbnail}
                        onChange={(e) => handleUpdateLesson(idx, lidx, "thumbnail", e.target.value)}
                      />
                      <button type="button" className="btn-remove-lesson" onClick={() => handleRemoveLesson(idx, lidx)}>Remove Lesson</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn-add-module"
            onClick={handleAddModule}
          >
            + Add Module
          </button>
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={!title || loading}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}
