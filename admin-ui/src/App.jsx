import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AdminProvider } from "./context/AdminContext";
import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/Dashboard";
import CourseManagement from "./pages/CourseManagement";
import InstitutionDetails from "./pages/InstitutionDetails";
import SettingsLayout from "./pages/Settings/SettingsLayout";
import ChatbotControl from "./pages/ChatbotControl/ChatbotControl";
import Login from "./pages/Login";
import InitialSetup from "./pages/InitialSetup";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public / Auth */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/confirm-email-change" element={<ConfirmEmailChange />} />
          <Route 
            path="/admin/setup" 
            element={
              <ProtectedRoute checkFirstLogin={false}>
                <InitialSetup />
              </ProtectedRoute>
            } 
          />

          {/* Protected admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="institution" element={<InstitutionDetails />} />
            <Route path="chatbot-control" element={<ChatbotControl />} />
            <Route path="settings/*" element={<SettingsLayout />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;