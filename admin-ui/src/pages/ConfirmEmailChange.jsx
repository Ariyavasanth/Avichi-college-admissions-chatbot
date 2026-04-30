import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, LogIn, ArrowLeft } from "lucide-react";
import { confirmEmailChange, logout } from "../services/authService";
import "../styles/login.css";

const ConfirmEmailChange = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid verification link. Token is missing.");
                return;
            }

            try {
                const data = await confirmEmailChange(token);
                setStatus("success");
                setMessage(data.message);
                // Force logout after email change for security
                logout();
            } catch (err) {
                setStatus("error");
                setMessage(err.message || "Something went wrong. The link might be expired.");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="login-page">
            <div className="login-card" style={{ textAlign: "center", padding: "40px" }}>
                {status === "loading" && (
                    <>
                        <Loader2 size={48} className="spin" color="#1f3b73" style={{ margin: "0 auto 20px" }} />
                        <h2 className="login-title">Verifying Email Change</h2>
                        <p className="login-subtitle">Please wait while we secure your account...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div style={{ background: "#dcfce7", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", margin: "0 auto 20px", justifyContent: "center" }}>
                            <CheckCircle2 size={32} color="#166534" />
                        </div>
                        <h2 className="login-title">Success!</h2>
                        <p className="login-subtitle" style={{ color: "#166534", fontWeight: "500" }}>{message}</p>
                        <p style={{ fontSize: "14px", color: "#64748b", margin: "20px 0" }}>
                            Your login email has been updated. For security reasons, you have been logged out of all active sessions.
                        </p>
                        <Link to="/admin/login" className="login-btn" style={{ textDecoration: "none", display: "flex", justifyContent: "center" }}>
                            <LogIn size={18} style={{ marginRight: "8px" }} /> Sign In Again
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div style={{ background: "#fef2f2", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", margin: "0 auto 20px", justifyContent: "center" }}>
                            <XCircle size={32} color="#b91c1c" />
                        </div>
                        <h2 className="login-title">Verification Failed</h2>
                        <p className="login-subtitle" style={{ color: "#b91c1c", fontWeight: "500" }}>{message}</p>
                        <p style={{ fontSize: "14px", color: "#64748b", margin: "20px 0" }}>
                            The link may have expired (15 minutes) or has already been used. Please try requesting the change again from your dashboard settings.
                        </p>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                            <Link to="/admin/dashboard/settings/security" className="login-btn" style={{ textDecoration: "none", background: "#64748b" }}>
                                <ArrowLeft size={18} style={{ marginRight: "8px" }} /> Back to Dashboard
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConfirmEmailChange;
