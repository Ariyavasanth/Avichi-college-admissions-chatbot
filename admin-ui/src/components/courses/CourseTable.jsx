const CourseTable = ({ courses, loading }) => {
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
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : courses.length === 0 ? (
            <tr>
              <td colSpan="6">No Courses Found</td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course._id}>
                <td>
                  <strong>{course.courseName}</strong>
                </td>
                <td>{course.department}</td>
                <td>₹{course.fees?.perYear?.toLocaleString()}</td>
                <td>{course.duration?.years} Years</td>
                <td>
                  {course.eligibility?.qualification}
                  <br />
                  Min: {course.eligibility?.minimumPercentage}%
                </td>
                <td>
                  {new Date(course.admissionDeadline).toLocaleDateString(
                    "en-IN",
                  )}
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
