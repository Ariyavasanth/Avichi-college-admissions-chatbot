const RecentUpdates = ({ courses = [] }) => {
  return (
    <div className="recent-updates" style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginTop: "30px" }}>
      <h3 style={{ margin: "0 0 15px", color: "#1f3b73" }}>Recent Updates</h3>

      {courses.length === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>No courses added yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {courses.map((c) => (
            <li key={c._id} style={{ borderBottom: "1px solid #f0f0f0", padding: "12px 0" }}>
              <div style={{ fontWeight: "bold", fontSize: "15px", color: "#333" }}>{c.courseName}</div>
              <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                {c.department} — ₹{c.fees?.perYear?.toLocaleString("en-IN") || 0} per year
              </div>
              <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                Updated: {new Date(c.updatedAt).toLocaleDateString("en-IN")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentUpdates;
