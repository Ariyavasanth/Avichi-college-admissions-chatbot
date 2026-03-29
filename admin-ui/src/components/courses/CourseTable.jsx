import "../../styles/courseManagement.css";

const CourseTable = ({ courses, loading, onEdit, onDelete }) => {
  const handleDeleteClick = (id) => {
    if (window.confirm("Delete this course?")) {
      onDelete(id);
    }
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Department</th>
            <th>Fees</th>
            <th>Duration</th>
            <th>Eligibility</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>
                Loading Courses…
              </td>
            </tr>
          ) : courses.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>
                No Courses Found
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course._id}>
                <td>
                  <strong>{course.courseName}</strong>
                </td>
                <td>{course.department}</td>
                <td>₹{course.fees?.perYear?.toLocaleString() || course.perYearFee?.toLocaleString()}</td>
                <td>{course.duration?.years || course.durationYears} Yrs</td>
                <td>
                  {course.eligibility?.qualification || course.eligibilityQualification}
                  <br />
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    Min: {course.eligibility?.minimumPercentage || course.eligibilityPercentage}%
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(course._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
