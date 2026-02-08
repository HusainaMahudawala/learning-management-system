import API from "../api/api";
import { useState } from "react";

export default function CourseCreate() {
  const [course, setCourse] = useState({ title: "", description: "", videoUrl: "" });

  const create = async () => {
    await API.post("/courses/create", course);
    alert("Course Created");
  };

  return (
    <div>
      <h2>Create Course</h2>
      <input placeholder="Title" onChange={e => setCourse({ ...course, title: e.target.value })} />
      <input placeholder="Description" onChange={e => setCourse({ ...course, description: e.target.value })} />
      <input placeholder="Video URL" onChange={e => setCourse({ ...course, videoUrl: e.target.value })} />
      <button onClick={create}>Create</button>
    </div>
  );
}
