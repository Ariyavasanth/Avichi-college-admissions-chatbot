import { createContext, useContext, useState, useEffect } from "react";
import { getToken } from "../services/authService";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocalAdmin = () => {
      try {
        const storedAdmin = localStorage.getItem("admin");
        if (storedAdmin && getToken()) {
          const parsed = JSON.parse(storedAdmin);
          setAdminData(parsed);
        }
      } catch (e) {
        console.error("Failed to parse admin data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLocalAdmin();
  }, []);

  const updateAdmin = (newData) => {
    const updated = { ...adminData, ...newData };
    setAdminData(updated);
    localStorage.setItem("admin", JSON.stringify(updated));
  };

  const logout = () => {
    setAdminData(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminContext.Provider value={{ adminData, updateAdmin, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
