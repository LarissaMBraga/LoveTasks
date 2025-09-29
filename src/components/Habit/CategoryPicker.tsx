import React from "react";
import {
  FaRegClock,
  FaPaintBrush,
  FaRunning,
  FaBookOpen,
  FaMusic,
  FaAppleAlt,
  FaHome,
  FaBriefcase,
  FaHeartbeat,
  FaUtensils,
  FaMoneyBillWave,
  FaUsers,
  FaBolt,
  FaTree,
  FaBrain,
  FaQuestion,
} from "react-icons/fa";

export type Category = {
  id: string;
  label: string;
  color: string;
  Icon: React.ElementType;
};

export const CATEGORIES: Category[] = [
  { id: "tarefa", label: "Tarefa", color: "#ff2d6f", Icon: FaRegClock },
  {
    id: "quitar_habito",
    label: "Quitar um hábito",
    color: "#ff7b00",
    Icon: FaRegClock,
  },
  { id: "arte", label: "Arte", color: "#c21b5a", Icon: FaPaintBrush },
  { id: "meditacao", label: "Meditação", color: "#6b21a8", Icon: FaBrain },
  { id: "estudo", label: "Estudo", color: "#6b21a8", Icon: FaBookOpen },
  { id: "esporte", label: "Esporte", color: "#0ea5b7", Icon: FaRunning },
  { id: "social", label: "Social", color: "#14b8a6", Icon: FaUsers },
  { id: "musica", label: "Música", color: "#6d28d9", Icon: FaMusic },
  {
    id: "alimentacao",
    label: "Alimentação",
    color: "#f97316",
    Icon: FaAppleAlt,
  },
  { id: "casa", label: "Casa", color: "#0ea5b7", Icon: FaHome },
  { id: "trabalho", label: "Trabalho", color: "#a855f7", Icon: FaBriefcase },
  { id: "saude", label: "Saúde", color: "#ef4444", Icon: FaHeartbeat },
  { id: "nutricao", label: "Nutrição", color: "#f59e0b", Icon: FaUtensils },
  {
    id: "financas",
    label: "Finanças",
    color: "#22c55e",
    Icon: FaMoneyBillWave,
  },
  { id: "energia", label: "Energia", color: "#dc2626", Icon: FaBolt },
  { id: "outdoors", label: "Ao ar livre", color: "#16a34a", Icon: FaTree },
  { id: "outros", label: "Outros", color: "#a3a3a3", Icon: FaQuestion },
];

interface Props {
  selected?: string | null;
  onSelect: (id: string) => void;
}

const CategoryPicker: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div>
      <h4 style={{ color: "#fff", marginBottom: 10 }}>
        Selecione uma categoria
      </h4>
      <div className="category-grid">
        {CATEGORIES.map((c) => {
          const Icon = c.Icon;
          const active = selected === c.id;
          return (
            <div
              key={c.id}
              className="cat-item"
              onClick={() => onSelect(c.id)}
              style={{
                borderColor: active ? "rgba(230,0,126,0.18)" : undefined,
                transform: active ? "translateY(-2px)" : undefined,
              }}
            >
              <div>
                <div className="label">{c.label}</div>
              </div>
              <div className="cat-color-box" style={{ background: c.color }}>
                <Icon />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPicker;
