import React from "react";

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  icon,
  bgColor = "#1a1a1a",
}) => {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        padding: "20px",
        borderRadius: "12px",
        color: "#fff",
        boxShadow: "2px 2px 6px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 40px",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>{icon}</div>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
          {title}
        </h3>
        <div />
      </div>
      <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
};

export default Card;
