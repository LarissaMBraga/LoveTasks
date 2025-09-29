import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export interface HabitCardData {
  id: string;
  title: string;
  categoryLabel: string;
  categoryColor: string;
  categoryEmoji?: React.ElementType;
  scheduleText?: string;
  notes?: string;
}

interface HabitCardProps {
  data: HabitCardData;
  onDelete?: (id: string, option: "today" | "all") => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ data, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleDelete = (option: "today" | "all") => {
    if (onDelete) onDelete(data.id, option);
    setShowDeletePopup(false);
  };

  return (
    <div className="habit-card" style={{ position: "relative" }}>
      <div
        className="habit-left"
        style={{ display: "flex", alignItems: "center" }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          style={{ marginRight: 8 }}
        />

        <div
          className="habit-dot"
          style={{
            background: data.categoryColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            width: 36,
            height: 36,
            marginRight: 8,
          }}
        >
          {data.categoryEmoji ? (
            <data.categoryEmoji style={{ color: "#fff", fontSize: 18 }} />
          ) : null}
        </div>

        <div className="habit-info">
          <div className="title">{data.title}</div>
          <div className="meta">
            {data.scheduleText ?? "Sem horário definido"}
          </div>
          {expanded && (
            <div className="notes">
              {data.notes && data.notes.trim() ? data.notes : "Sem observações"}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          <FaChevronDown
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </button>

        {expanded && (
          <button
            onClick={() => setShowDeletePopup(true)}
            style={{
              background: "#333",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Excluir
          </button>
        )}
      </div>

      {showDeletePopup && (
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 0,
            background: "#333",
            borderRadius: 10,
            zIndex: 10,
            padding: 12,
            minWidth: 180,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {["today", "all", "cancel"].map((option) => {
            let label = "";
            if (option === "today") label = "Excluir somente hoje";
            else if (option === "all") label = "Excluir todos";
            else label = "Cancelar";

            return (
              <button
                key={option}
                onClick={() => {
                  if (option === "cancel") setShowDeletePopup(false);
                  else handleDelete(option as "today" | "all");
                }}
                style={{
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  padding: 8,
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 14,
                  transition: "0.3s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLButtonElement).style.background = "#ff2d6f")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLButtonElement).style.background = "#333")
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HabitCard;
