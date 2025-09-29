import React, { useState, useRef, useEffect } from "react";
import "../../styles/habits.css";
import HabitCard, { HabitCardData } from "../../components/Habit/HabitCard";
import HabitModal, { HabitData } from "../../components/Habit/HabitModal";
import BottomNavigation from "../../components/BottomNavigation";
import { CATEGORIES } from "../../components/Habit/CategoryPicker";

/* Botão editar */
type DayItem = { label: string; day: string; date: string };

function formatDateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateLocal(isoLocal: string) {
  const [y, m, day] = isoLocal.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function generateDays(numDays: number, daysBefore: number = 0): DayItem[] {
  const today = new Date();
  const days: DayItem[] = [];

  for (let i = -daysBefore; i < numDays - daysBefore; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" });
    const dayNum = date.toLocaleDateString("pt-BR", { day: "2-digit" });
    const label = weekday.charAt(0).toUpperCase() + weekday.slice(1, 3);
    days.push({ label, day: dayNum, date: formatDateLocal(date) });
  }

  return days;
}

const HabitsPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [items, setItems] = useState<HabitCardData[]>([]);

  const days = generateDays(30, 3);
  const today = new Date();
  const todayIso = formatDateLocal(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowIso = formatDateLocal(tomorrow);

  const [selectedDay, setSelectedDay] = useState<string>(todayIso);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById(`day-${selectedDay}`);
    if (el && containerRef.current) {
      el.scrollIntoView({
        inline: "center",
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedDay, days]);

  const handleSave = (h: HabitData) => {
    const catColor = h.color ?? "#ff2d6f";
    const categoryLabel = h.categoryId ?? "Task";
    const cat = CATEGORIES.find((c) => c.id === h.categoryId);
    const id = Math.random().toString(36).slice(2, 9);
    const newCard: HabitCardData = {
      id,
      title: h.title,
      categoryLabel,
      categoryColor: catColor,
      notes: h.notes ?? "",
      scheduleText: h.time || "",
      categoryEmoji: cat?.Icon,
      recurrence: h.recurrence,
      days: h.days,
      date: h.date,
    };
    setItems((s) => [newCard, ...s]);
    setOpenModal(false);
  };

  const headerText = (() => {
    if (selectedDay === todayIso) return "Hoje";
    if (selectedDay === tomorrowIso) return "Amanhã";
    const d = parseDateLocal(selectedDay);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  })();

  const timeToMinutes = (time?: string) => {
    if (!time) return 24 * 60;
    const [h, m] = time.split(":").map(Number);
    return isNaN(h) || isNaN(m) ? 24 * 60 : h * 60 + m;
  };

  const getWeekday = (isoDate: string) => {
    const d = parseDateLocal(isoDate);
    return d.getDay();
  };

  const filteredItems = items.filter((h) => {
    const dayOfWeek = getWeekday(selectedDay);
    if (h.recurrence === "once" && h.date) return h.date === selectedDay;
    if (h.recurrence === "custom" && h.days?.length)
      return h.days.includes(dayOfWeek);
    if (h.recurrence === "everyday") {
      if (h.skipDays?.includes(dayOfWeek)) return false;
      return true;
    }
    return false;
  });

  const sortedItems = [...filteredItems].sort(
    (a, b) => timeToMinutes(a.scheduleText) - timeToMinutes(b.scheduleText)
  );

  const handleDelete = (id: string, option: "today" | "all") => {
    const habit = items.find((h) => h.id === id);
    if (!habit) return;

    const dayOfWeek = getWeekday(selectedDay);

    if (option === "today") {
      setItems((prev) =>
        prev.map((h) => {
          if (h.id === id) {
            if (h.recurrence === "once" && h.date === selectedDay) {
              return { ...h, date: "" };
            }
            if (h.recurrence === "custom" && h.days?.length) {
              return { ...h, days: h.days.filter((d) => d !== dayOfWeek) };
            }
            if (h.recurrence === "everyday") {
              const skipDays = h.skipDays
                ? [...h.skipDays, dayOfWeek]
                : [dayOfWeek];
              return { ...h, skipDays };
            }
          }
          return h;
        })
      );
    } else if (option === "all") {
      setItems((prev) =>
        prev.filter(
          (h) =>
            !(h.title === habit.title && h.scheduleText === habit.scheduleText)
        )
      );
    }
  };

  return (
    <div className="habits-page">
      <div className="habits-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div className="habits-title">{headerText}</div>
            <div className="habits-sub">Organize sua rotina</div>
          </div>
        </div>
      </div>

      <div className="days-container" ref={containerRef}>
        {days.map((d) => (
          <div
            key={d.date}
            id={`day-${d.date}`}
            className={`day-card ${
              d.date === selectedDay ? "day-selected" : ""
            }`}
            onClick={() => setSelectedDay(d.date)}
          >
            <div className="day-label">{d.label}</div>
            <div className="day-number">{d.day}</div>
          </div>
        ))}
      </div>

      <div className="habit-list" style={{ padding: "0 20px" }}>
        {sortedItems.map((it) => (
          <HabitCard key={it.id} data={it} onDelete={handleDelete} />
        ))}
        {sortedItems.length === 0 && (
          <div style={{ color: "var(--muted)", padding: "20px 0 12px" }}>
            Nenhum hábito encontrado
          </div>
        )}
      </div>

      <button
        className="fab"
        title="Novo hábito"
        onClick={() => setOpenModal(true)}
      >
        +
      </button>

      <BottomNavigation active="habits" />
      <HabitModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default HabitsPage;
