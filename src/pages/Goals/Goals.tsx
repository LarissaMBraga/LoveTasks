import React, { useState } from "react";
import GoalGroup from "../../components/Goals/GoalGroup";
import BottomNavigation from "../../components/BottomNavigation";

interface Goal {
  id: number;
  title: string;
  done: boolean;
}

interface Group {
  id: number;
  title: string;
  color: string;
  goals: Goal[];
}

const Goals: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState("#3498db");

  const addGroup = () => {
    if (newGroupName.trim() !== "") {
      const newGroup: Group = {
        id: Date.now(),
        title: newGroupName,
        color: newGroupColor,
        goals: [],
      };
      setGroups((prev) => [...prev, newGroup]);
      setNewGroupName("");
    }
  };

  const toggleGoal = (groupId: number, goalId: number) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              goals: group.goals.map((g) =>
                g.id === goalId ? { ...g, done: !g.done } : g
              ),
            }
          : group
      )
    );
  };

  const addGoal = (groupId: number, goalTitle: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              goals: [
                ...group.goals,
                { id: Date.now(), title: goalTitle, done: false },
              ],
            }
          : group
      )
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f14, #1a1a2e)",
        padding: "25px",
        color: "#fff",
        paddingBottom: "70px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>🎯 A fazer</h1>

      <div
        style={{
          display: "flex",
          marginBottom: "25px",
          gap: "10px",
        }}
      >
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Novo grupo..."
          style={{
            flex: 1,
            padding: "10px 15px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />
        <input
          type="color"
          value={newGroupColor}
          onChange={(e) => setNewGroupColor(e.target.value)}
          style={{
            width: "50px",
            height: "40px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        />
        <button
          onClick={addGroup}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#27ae60",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Criar
        </button>
      </div>

      {groups.length === 0 && (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          Nenhum grupo criado ainda. Adicione um acima 👆
        </p>
      )}

      {groups.map((group) => (
        <GoalGroup
          key={group.id}
          title={group.title}
          color={group.color}
          goals={group.goals}
          onToggle={(goalId) => toggleGoal(group.id, goalId)}
          onAddGoal={(goalTitle) => addGoal(group.id, goalTitle)}
        />
      ))}

      <BottomNavigation />
    </div>
  );
};

export default Goals;
