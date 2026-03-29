import { useEffect, useState } from "react";
import SummaryCard from "../components/dashboard/SummaryCard";
import RecentUpdates from "../components/dashboard/RecentUpdates";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:3000/api/admin/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminName = localStorage.getItem("adminName") || "Admin";

  return (
    <>
      <h2 className="welcome-text">Welcome, {adminName} 👋</h2>

      {/* Error Banner */}
      {error && (
        <div className="error-banner" style={{ color: "red", padding: "10px", textAlign: "center", border: "1px solid red", borderRadius: "8px", background: "#fee2e2", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading Dashboard...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="summary-section">
            <SummaryCard
              title="Total Courses"
              value={stats?.totalCourses ?? 0}
            />
            <SummaryCard
              title="Institution"
              value={stats?.institutionName ?? "Not Set"}
            />
          </div>

          {/* Recent Updates List */}
          <RecentUpdates courses={stats?.recentCourses ?? []} />
        </>
      )}
    </>
  );
};

export default Dashboard;
