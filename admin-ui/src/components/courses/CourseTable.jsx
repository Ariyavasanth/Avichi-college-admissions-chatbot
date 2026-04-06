import "../../styles/courseManagement.css";

const CourseTable = ({ courses, loading, onEdit, onDelete }) => {
  const handleDeleteClick = (id) => {
    if (window.confirm("Delete this course?")) {
      onDelete(id);
    }
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Department</th>
              <th>Fees</th>
              <th>Duration</th>
              <th>Eligibility</th>
              <th>Seats</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>
                  Loading Courses…
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>
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
                    <strong>{course.availableSeats || 0}</strong>
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

      {/* Mobile Card View - Hidden on desktop */}
      <div className="mobile-cards">
        {loading ? (
          <div className="no-data">Loading Courses…</div>
        ) : courses.length === 0 ? (
          <div className="no-data">No Courses Found</div>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="card-header">
                <h3>{course.courseName}</h3>
                <span className="dept-tag">{course.department}</span>
              </div>
              
              <div className="card-body">
                <div className="card-info">
                  <span className="label">Duration:</span>
                  <span className="value">{course.duration?.years || course.durationYears} Yrs</span>
                </div>
                <div className="card-info">
                  <span className="label">Fees:</span>
                  <span className="value">₹{course.fees?.perYear?.toLocaleString() || course.perYearFee?.toLocaleString()}</span>
                </div>
                <div className="card-info full">
                  <span className="label">Eligibility:</span>
                  <span className="value">
                    {course.eligibility?.qualification || course.eligibilityQualification} ({course.eligibility?.minimumPercentage || course.eligibilityPercentage}% min)
                  </span>
                </div>
                <div className="card-info">
                  <span className="label">Available Seats:</span>
                  <span className="value">{course.availableSeats || 0}</span>
                </div>
              </div>

              <div className="card-actions">
                <button className="edit-btn" onClick={() => onEdit(course)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteClick(course._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseTable;
