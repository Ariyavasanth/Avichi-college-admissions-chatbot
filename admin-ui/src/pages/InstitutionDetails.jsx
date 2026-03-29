import { useState, useEffect } from "react";
import { getInstitution, saveInstitution } from "../services/institutionService";
import "../styles/institutionDetails.css";

const InstitutionDetails = () => {
  const [formData, setFormData] = useState({
    institutionName: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    morningShift: "",
    eveningShift: "",
    general: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getInstitution();
        if (data) {
          setFormData({
            institutionName: data.institutionName || "",
            phone: data.contactDetails?.phone || "",
            email: data.contactDetails?.email || "",
            website: data.contactDetails?.website || "",
            address: data.contactDetails?.address?.text || "",
            morningShift: data.timings?.morningShift || "",
            eveningShift: data.timings?.eveningShift || "",
            general: data.timings?.general || "",
          });
        }
      } catch (err) {
        setErrorMsg("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const payload = {
      institutionName: formData.institutionName,
      contactDetails: {
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        address: { text: formData.address },
      },
      timings: {
        morningShift: formData.morningShift,
        eveningShift: formData.eveningShift,
        general: formData.general,
      },
    };

    try {
      await saveInstitution(payload);
      setSuccessMsg("Institution details saved!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-container">
      <div className="course-header">
        <h2>Institution Details</h2>
      </div>

      <div className="card" style={{ padding: "30px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        {successMsg && <div className="success-banner" style={{ color: "green", background: "#dcfce7", padding: "10px", borderRadius: "8px", marginBottom: "15px", textAlign: "center", border: "1px solid green" }}>{successMsg}</div>}
        {errorMsg && <div className="error-banner" style={{ color: "red", background: "#fee2e2", padding: "10px", borderRadius: "8px", marginBottom: "15px", textAlign: "center", border: "1px solid red" }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Institution Name *</label>
            <input
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              disabled={loading}
              className="form-control"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Website URL</label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <h3 style={{ margin: "25px 0 15px", color: "#1f3b73" }}>Operation Timings</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Morning Shift</label>
              <input
                name="morningShift"
                value={formData.morningShift}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g. 9 AM - 1 PM"
              />
            </div>
            <div className="form-group">
              <label>Evening Shift</label>
              <input
                name="eveningShift"
                value={formData.eveningShift}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>General Timings</label>
            <input
              name="general"
              value={formData.general}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstitutionDetails;
