import { useEffect, useState } from "react";
import { getCourses, deleteCourse } from "../services/courseService";
import CourseModal from "../components/courses/CourseModal";
import CourseTable from "../components/courses/CourseTable";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (err) {
      setError(err.message || "Failed to delete course.");
    }
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setShowModal(false);
  };

  return (
    <div className="course-container">
      {error && <div className="error-banner" style={{ color: "red", padding: "10px", textAlign: "center", border: "1px solid red", borderRadius: "8px", background: "#fee2e2", marginBottom: "15px" }}>{error}</div>}
      
      <div className="course-header">
        <h2>Courses Management</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add New Course
        </button>
      </div>

      <CourseTable
        courses={courses}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <CourseModal
          course={selectedCourse}
          onClose={handleCloseModal}
          onSuccess={fetchCourses}
        />
      )}

      <div className="pagination">Showing {courses.length} entries</div>
    </div>
  );
};

export default CourseManagement;