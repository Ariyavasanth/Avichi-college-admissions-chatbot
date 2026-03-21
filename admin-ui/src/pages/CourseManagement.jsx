import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
import CourseModal from "../components/courses/CourseModal";
import CourseTable from "../components/courses/CourseTable";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    const data = await getCourses();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="course-container">
      <div className="course-header">
        <h2>Courses Management</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add New Course
        </button>
      </div>

      <CourseTable courses={courses} loading={loading} />

      {showModal && (
        <CourseModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchCourses}
        />
      )}

      <div className="pagination">
        Showing {courses.length} entries
      </div>
    </div>
  );
};

export default CourseManagement;