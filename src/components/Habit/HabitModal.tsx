import React, { useState, useEffect } from "react";
import CategoryPicker from "./CategoryPicker";
import { FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/habits.css";

export type HabitData = {
  title: string;
  notes?: string;
  categoryId?: string;
  recurrence?: "once" | "everyday" | "custom";
  days?: number[];
  date?: string;
  time?: string;
  location?: string;
  color?: string;
  emoji?: string;
  skipDays?: number[];
};

const defaultHabit: HabitData = {
  title: "",
  notes: "",
  categoryId: "",
  recurrence: undefined,
  days: [],
  date: "",
  time: "",
  location: "",
  color: "#ff2d6f",
  emoji: "🔥",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (h: HabitData) => void;
}

const WEEKDAYS = [
  { id: 1, label: "Seg" },
  { id: 2, label: "Ter" },
  { id: 3, label: "Qua" },
  { id: 4, label: "Qui" },
  { id: 5, label: "Sex" },
  { id: 6, label: "Sáb" },
  { id: 0, label: "Dom" },
];

const HabitModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [habit, setHabit] = useState<HabitData>({ ...defaultHabit });

  useEffect(() => {
    if (!open) return;
    setStep(1);
  }, [open]);

  const handleSave = () => {
    if (!habit.title?.trim() || !habit.categoryId) return;
    onSave(habit);
    setHabit({ ...defaultHabit });
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setHabit({ ...defaultHabit });
    setStep(1);
  };

  const canProceed = () => {
    return habit.title?.trim() !== "" && habit.categoryId?.trim() !== "";
  };

  const toggleDay = (d: number) => {
    setHabit((s) => {
      const days = new Set(s.days || []);
      days.has(d) ? days.delete(d) : days.add(d);
      return { ...s, days: Array.from(days) };
    });
  };

  if (!open) return null;

  return (
    <div className="habit-modal-backdrop">
      <div className="habit-modal">
        <div className="habit-modal-header">
          <h2>Novo Hábito</h2>
          <button onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="habit-modal-body">
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label>Título:</label>
              <input
                placeholder="Ex: Academia"
                value={habit.title}
                onChange={(e) => setHabit({ ...habit, title: e.target.value })}
              />
              <label>Observação:</label>
              <input
                placeholder="Ex: Treino de peito e tríceps"
                value={habit.notes}
                onChange={(e) => setHabit({ ...habit, notes: e.target.value })}
              />
              <CategoryPicker
                selected={habit.categoryId || ""}
                onSelect={(id) => setHabit({ ...habit, categoryId: id })}
              />
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <h3>Frequência</h3>
              <div style={{ height: 1 }} />
              <div className="freq-grid">
                {[
                  { label: "Somente 1 dia", value: "once" },
                  { label: "Todos os dias", value: "everyday" },
                  { label: "Dias personalizados", value: "custom" },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className="habit-frequency-option"
                    onClick={() => {
                      const days =
                        opt.value === "everyday"
                          ? [0, 1, 2, 3, 4, 5, 6]
                          : habit.days;
                      setHabit({
                        ...habit,
                        recurrence: opt.value as any,
                        days,
                      });
                      setStep(3);
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && habit.recurrence && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {habit.recurrence === "once" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <label>Data:</label>
                    <DatePicker
                      selected={habit.date ? new Date(habit.date) : null}
                      onChange={(date: Date) =>
                        setHabit({
                          ...habit,
                          date: date.toISOString().split("T")[0],
                        })
                      }
                      dateFormat="dd-MM-yyyy"
                      className="input"
                      placeholderText="Escolha a data"
                      calendarClassName="datepicker-dark"
                    />
                  </div>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <label>Horário:</label>
                    <input
                      type="time"
                      value={habit.time || "12:00"}
                      onChange={(e) =>
                        setHabit({ ...habit, time: e.target.value })
                      }
                      style={{ width: "80px", height: "14px" }}
                    />
                  </div>
                </div>
              )}

              {habit.recurrence === "everyday" && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label>Horário:</label>
                  <input
                    type="time"
                    value={habit.time || "00:00"}
                    onChange={(e) =>
                      setHabit({ ...habit, time: e.target.value })
                    }
                    style={{ width: "80px", height: "14px" }}
                  />
                </div>
              )}

              {habit.recurrence === "custom" && (
                <>
                  <label>Dias da semana:</label>
                  <div className="weekdays">
                    {WEEKDAYS.map((w) => {
                      const active = (habit.days || []).includes(w.id);
                      return (
                        <button
                          key={w.id}
                          className={active ? "day-btn active" : "day-btn"}
                          onClick={() => toggleDay(w.id)}
                        >
                          {w.label}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <label>Horário:</label>
                    <input
                      type="time"
                      value={habit.time || "00:00"}
                      onChange={(e) =>
                        setHabit({ ...habit, time: e.target.value })
                      }
                      style={{ width: "80px", height: "14px" }}
                    />
                  </div>
                </>
              )}

              <label>Observações:</label>
              <textarea
                rows={3}
                placeholder="Ex: detalhes adicionais"
                value={habit.notes}
                onChange={(e) => setHabit({ ...habit, notes: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="habit-modal-buttons">
          {step > 1 && (
            <button
              className="habit-btn-prev"
              onClick={() => setStep(step - 1)}
            >
              Anterior
            </button>
          )}
          {step < 3 && (
            <button
              className={`habit-btn-next ${!canProceed() ? "disabled" : ""}`}
              onClick={() => {
                if (canProceed()) setStep(step + 1);
              }}
              disabled={!canProceed()}
            >
              Próximo
            </button>
          )}
          {step === 3 && (
            <button className="habit-btn-save" onClick={handleSave}>
              Salvar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitModal;
