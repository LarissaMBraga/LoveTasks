import React from "react";

interface GoalItemProps {
  title: string;
  done: boolean;
  onToggle: () => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ title, done, onToggle }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 15px",
        background: "#1e1e2e",
        borderRadius: "12px",
        marginBottom: "8px",
        cursor: "pointer",
      }}
      onClick={onToggle}
    >
      <input
        type="checkbox"
        checked={done}
        onChange={onToggle}
        style={{ marginRight: "10px", transform: "scale(1.2)" }}
      />
      <span
        style={{
          textDecoration: done ? "line-through" : "none",
          color: done ? "#aaa" : "#fff",
          fontSize: "16px",
        }}
      >
        {title}
      </span>
    </div>
  );
};

export default GoalItem;
