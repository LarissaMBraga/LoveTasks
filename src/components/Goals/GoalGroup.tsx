import React, { useState } from "react";
import GoalItem from "./GoalItem";

interface Goal {
  id: number;
  title: string;
  done: boolean;
}

interface GoalGroupProps {
  title: string;
  color: string;
  goals: Goal[];
  onToggle: (goalId: number) => void;
  onAddGoal: (goal: string) => void;
}

const GoalGroup: React.FC<GoalGroupProps> = ({
  title,
  color,
  goals,
  onToggle,
  onAddGoal,
}) => {
  const [newGoal, setNewGoal] = useState("");
  const [expanded, setExpanded] = useState(true);

  const handleAdd = () => {
    if (newGoal.trim() !== "") {
      onAddGoal(newGoal);
      setNewGoal("");
    }
  };

  return (
    <div
      style={{
        background: "#12121b",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "25px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: expanded ? "15px" : "0",
          borderBottom: `2px solid ${color}`,
          paddingBottom: "5px",
        }}
      >
        <h2 style={{ color: color, fontSize: "22px", margin: 0 }}>{title}</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "18px",
            cursor: "pointer",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ➤
        </button>
      </div>

      {expanded && (
        <>
          {goals.map((goal) => (
            <GoalItem
              key={goal.id}
              title={goal.title}
              done={goal.done}
              onToggle={() => onToggle(goal.id)}
            />
          ))}

          <div style={{ display: "flex", marginTop: "10px", gap: "8px" }}>
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Nova meta..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                outline: "none",
              }}
            />
            <button
              onClick={handleAdd}
              style={{
                padding: "8px 15px",
                borderRadius: "8px",
                border: "none",
                background: color,
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              +
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GoalGroup;
