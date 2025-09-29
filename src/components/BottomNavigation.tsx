import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

//TA ESQUISITO E PROVAVELMENTE NÃO RESPONSIVO
//Notion e calendar tracker

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/today", label: "Clima" },
    { path: "/goals", label: "A fazer" },
    { path: "/habits", label: "Habitos" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#1a1a1a",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0",
        borderTop: "1px solid #333",
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            flex: 1,
            margin: "0 5px",
            padding: "12px 0",
            borderRadius: "20px",
            border: "none",
            backgroundColor:
              location.pathname === item.path ? "#ff7300" : "#333",
            color: "#fff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;
