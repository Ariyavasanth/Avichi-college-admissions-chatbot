import React from "react";

const MaintenanceScreen = ({ primaryColor }) => {
  return (
    <div style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      padding: "20px",
      textAlign: "center"
    }}>
      <div style={{
        width: "120px",
        height: "120px",
        marginBottom: "24px",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          border: `4px solid ${primaryColor}`,
          borderRadius: "16px",
          opacity: 0.1
        }}></div>
        <svg 
          viewBox="0 0 24 24" 
          width="64" 
          height="64" 
          fill="none" 
          stroke={primaryColor} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 17l1 2h-2zM17 12l2 1v-2zM12 7l1-2h-2zM7 12l-2 1v-2z" fill={primaryColor}/>
        </svg>
      </div>

      <h2 style={{
        fontSize: "22px",
        fontWeight: "700",
        color: "#0f172a",
        marginBottom: "12px"
      }}>
        Under Maintenance
      </h2>
      
      <p style={{
        fontSize: "14px",
        color: "#64748b",
        lineHeight: "1.6",
        maxWidth: "240px"
      }}>
        We are currently upgrading our systems to provide you with a better experience. We'll be back online shortly!
      </p>

      <div style={{
        marginTop: "32px",
        width: "40px",
        height: "4px",
        backgroundColor: primaryColor,
        borderRadius: "2px",
        opacity: 0.3
      }}></div>
    </div>
  );
};

export default MaintenanceScreen;
