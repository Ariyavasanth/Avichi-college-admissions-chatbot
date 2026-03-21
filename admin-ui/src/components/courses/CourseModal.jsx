import { useState } from "react";
import { createCourse } from "../../services/courseService";
import "../../styles/courseManagement.css";

const CourseModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    courseName: "",
    department: "",
    perYear: "",
    years: "",
    qualification: "",
    minimumPercentage: "",
    admissionDeadline: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createCourse({
      ...formData,
      perYear: Number(formData.perYear),
      years: Number(formData.years),
      minimumPercentage: Number(formData.minimumPercentage),
    });

    onSuccess(); // refresh table
    onClose(); // close modal
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Course</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Course Name</label>
            <input name="courseName" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input name="department" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Fees (Per Year)</label>
            <input
              type="number"
              name="perYear"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration (Years)</label>
              <input
                type="number"
                name="years"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Minimum %</label>
              <input
                type="number"
                name="minimumPercentage"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Qualification</label>
            <input name="qualification" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Admission Deadline</label>
            <input
              type="date"
              name="admissionDeadline"
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
