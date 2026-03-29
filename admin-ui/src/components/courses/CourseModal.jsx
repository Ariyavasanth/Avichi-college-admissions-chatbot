import { useState, useEffect } from "react";
import { createCourse, updateCourse } from "../../services/courseService";
import "../../styles/courseManagement.css";

const CourseModal = ({ onClose, onSuccess, course }) => {
  const isEdit = Boolean(course);

  const [formData, setFormData] = useState({
    courseName: "",
    department: "",
    perYearFee: "",
    durationYears: "",
    eligibilityQualification: "",
    eligibilityPercentage: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-fill form when editing
  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName || "",
        department: course.department || "",
        perYearFee: course.fees?.perYear || "",
        durationYears: course.duration?.years || "",
        eligibilityQualification: course.eligibility?.qualification || "",
        eligibilityPercentage: course.eligibility?.minimumPercentage || "",
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const payload = {
      ...formData,
      perYearFee: Number(formData.perYearFee),
      durationYears: Number(formData.durationYears),
      eligibilityPercentage: Number(formData.eligibilityPercentage),
    };

    try {
      if (isEdit) {
        await updateCourse(course._id, payload);
      } else {
        await createCourse(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg("Failed to save. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{isEdit ? "Edit Course" : "Add Course"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {errorMsg && <div className="error-banner" style={{ color: "red", marginBottom: "10px" }}>{errorMsg}</div>}

          <div className="form-group">
            <label>Course Name *</label>
            <input
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              required
              placeholder="e.g. BBA"
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="e.g. Management"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fees (Per Year ₹) *</label>
              <input
                type="number"
                name="perYearFee"
                value={formData.perYearFee}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (Years) *</label>
              <input
                type="number"
                name="durationYears"
                value={formData.durationYears}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Min Eligibility % *</label>
              <input
                type="number"
                name="eligibilityPercentage"
                value={formData.eligibilityPercentage}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Qualification *</label>
              <input
                name="eligibilityQualification"
                value={formData.eligibilityQualification}
                onChange={handleChange}
                required
                placeholder="e.g. 12th Std"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Course" : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
