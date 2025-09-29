import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const diasSemana = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

interface HabitWizardProps {
  open: boolean;
  onClose: () => void;
  onSave?: (habit: any) => void;
}

const HabitWizard: React.FC<HabitWizardProps> = ({ open, onClose, onSave }) => {
  const [step, setStep] = useState<number>(1);
  const [titulo, setTitulo] = useState<string>("");
  const [observacao, setObservacao] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("");
  const [frequencia, setFrequencia] = useState<
    "uma_vez" | "todos_dias" | "dias_personalizados" | ""
  >("");
  const [dataUnica, setDataUnica] = useState<string>("");
  const [hora, setHora] = useState<string>("08:00");
  const [local, setLocal] = useState<string>("");
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);
  const [subOpen, setSubOpen] = useState<boolean>(false);

  const toggleDia = (index: number) => {
    setDiasSelecionados((prev) => {
      if (prev.includes(index)) return prev.filter((d) => d !== index);
      return [...prev, index].sort((a, b) => a - b);
    });
  };

  const handleOpenSub = (
    freq: "uma_vez" | "todos_dias" | "dias_personalizados"
  ) => {
    setFrequencia(freq);
    setSubOpen(true);
  };

  const handleSaveSub = () => {
    setSubOpen(false);
    setStep(3);
  };

  const handleSaveAll = () => {
    const habit = {
      titulo,
      observacao,
      categoria,
      frequencia,
      dataUnica,
      hora,
      local,
      diasSelecionados,
    };
    if (onSave) onSave(habit);
    setTitulo("");
    setObservacao("");
    setCategoria("");
    setFrequencia("");
    setDataUnica("");
    setHora("08:00");
    setLocal("");
    setDiasSelecionados([]);
    setStep(1);
    onClose();
  };

  const hiddenScrollbarStyles = `
    .habit-dialog-content::-webkit-scrollbar { display: none; }
    .habit-dialog-content { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  const canAdvanceFromStep1 = () => titulo.trim().length > 0;

  return (
    <>
      <style>{hiddenScrollbarStyles}</style>
      <Dialog
        open={open}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: "#121212",
            color: "white",
            overflowX: "hidden",
          },
        }}
        onClose={onClose}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <DialogTitle style={{ color: "#ff2d6f", fontWeight: 700 }}>
            {step === 1 && "Novo Hábito"}
            {step === 2 && "Defina a frequência"}
            {step === 3 && "Resumo do hábito"}
          </DialogTitle>
          <IconButton onClick={onClose} aria-label="fechar">
            <CloseIcon style={{ color: "white" }} />
          </IconButton>
        </div>

        <DialogContent
          className="habit-dialog-content"
          dividers
          style={{
            padding: 24,
            maxHeight: "calc(100vh - 160px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <TextField
                label="Título"
                placeholder="Ex: Academia"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                fullWidth
                InputLabelProps={{ style: { color: "#bbb", fontSize: 16 } }}
                InputProps={{
                  style: { color: "white", borderColor: "#444", fontSize: 16 },
                }}
              />
              <TextField
                label="Observação"
                placeholder="Ex: Treino de peito e tríceps"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                InputLabelProps={{ style: { color: "#bbb", fontSize: 16 } }}
                InputProps={{
                  style: { color: "white", borderColor: "#444", fontSize: 15 },
                }}
              />
              <div>
                <p
                  style={{
                    color: "#ff2d6f",
                    marginBottom: 10,
                    fontWeight: 600,
                  }}
                >
                  Categoria
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                  }}
                >
                  {[
                    { nome: "Esporte", cor: "#0ea5b7", icon: "🚴" },
                    { nome: "Estudo", cor: "#6b21a8", icon: "📚" },
                    { nome: "Meditação", cor: "#ec4899", icon: "🧘" },
                    { nome: "Trabalho", cor: "#a855f7", icon: "💼" },
                    { nome: "Saúde", cor: "#10b981", icon: "➕" },
                    { nome: "Social", cor: "#f97316", icon: "💬" },
                  ].map((cat) => {
                    const active = categoria === cat.nome;
                    return (
                      <button
                        key={cat.nome}
                        onClick={() => setCategoria(cat.nome)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: 12,
                          borderRadius: 12,
                          background: active
                            ? cat.cor
                            : "rgba(255,255,255,0.03)",
                          color: active ? "#fff" : "#fff",
                          border: active
                            ? "none"
                            : "1px solid rgba(255,255,255,0.04)",
                          cursor: "pointer",
                          fontSize: 15,
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{cat.icon}</span>
                        <span>{cat.nome}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <p
                style={{
                  color: "#ff2d6f",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Com que frequência deseja realizar?
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div
                  role="button"
                  onClick={() => handleOpenSub("uma_vez")}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
                    Somente 1 vez
                  </div>
                  <div style={{ color: "#bbb", fontSize: 13 }}>
                    Escolher data e horário
                  </div>
                </div>
                <div
                  role="button"
                  onClick={() => handleOpenSub("todos_dias")}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
                    Todos os dias
                  </div>
                  <div style={{ color: "#bbb", fontSize: 13 }}>
                    Repetir diariamente
                  </div>
                </div>
                <div
                  role="button"
                  onClick={() => handleOpenSub("dias_personalizados")}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
                    Dias personalizados
                  </div>
                  <div style={{ color: "#bbb", fontSize: 13 }}>
                    Escolher dias da semana
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ color: "#ff2d6f", fontWeight: 600 }}>
                Resumo do hábito
              </p>
              <div style={{ color: "#fff" }}>
                <p>
                  <strong>Título:</strong> {titulo || "-"}
                </p>
                <p>
                  <strong>Observação:</strong> {observacao || "-"}
                </p>
                <p>
                  <strong>Categoria:</strong> {categoria || "-"}
                </p>
                <p>
                  <strong>Frequência:</strong>{" "}
                  {frequencia === "uma_vez"
                    ? "Somente 1 vez"
                    : frequencia === "todos_dias"
                    ? "Todos os dias"
                    : frequencia === "dias_personalizados"
                    ? "Dias personalizados"
                    : "-"}
                </p>
                {frequencia === "uma_vez" && (
                  <p>
                    Data: {dataUnica || "-"} às {hora || "-"} — Local:{" "}
                    {local || "-"}
                  </p>
                )}
                {frequencia === "todos_dias" && (
                  <p>
                    Todos os dias às {hora || "-"} — Local: {local || "-"}
                  </p>
                )}
                {frequencia === "dias_personalizados" && (
                  <p>
                    Dias:{" "}
                    {diasSelecionados.length
                      ? diasSelecionados.map((d) => diasSemana[d]).join(", ")
                      : "-"}{" "}
                    — {hora || "-"} — {local || "-"}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            padding: 16,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            {step > 1 && (
              <Button
                variant="text"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                style={{ color: "#ff2d6f" }}
              >
                Anterior
              </Button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <Button
                variant="contained"
                onClick={() => {
                  if (step === 1) {
                    if (!canAdvanceFromStep1()) return;
                    setStep(2);
                    return;
                  }
                  if (step === 2) {
                    return;
                  }
                }}
                style={{
                  backgroundColor: "#ff2d6f",
                  color: "#fff",
                  borderRadius: 10,
                }}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSaveAll}
                style={{
                  backgroundColor: "#10b981",
                  color: "#fff",
                  borderRadius: 10,
                }}
              >
                Concluir
              </Button>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        open={subOpen}
        onClose={() => setSubOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            background: "#161616",
            color: "#fff",
            borderRadius: 12,
            margin: 16,
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <DialogTitle style={{ color: "#ff2d6f", fontWeight: 700 }}>
            {frequencia === "uma_vez" && "Somente 1 vez"}
            {frequencia === "todos_dias" && "Todos os dias"}
            {frequencia === "dias_personalizados" && "Dias personalizados"}
          </DialogTitle>
          <IconButton onClick={() => setSubOpen(false)}>
            <CloseIcon style={{ color: "white" }} />
          </IconButton>
        </div>

        <DialogContent style={{ padding: 20 }}>
          {frequencia === "uma_vez" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <TextField
                type="date"
                label="Escolha a data"
                value={dataUnica}
                onChange={(e) => setDataUnica(e.target.value)}
                InputLabelProps={{ style: { color: "#bbb" } }}
                InputProps={{ style: { color: "white" } }}
                fullWidth
              />
              <TextField
                type="time"
                label="Horário"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                InputLabelProps={{ style: { color: "#bbb" } }}
                InputProps={{ style: { color: "white" } }}
                fullWidth
              />
              <TextField
                label="Local (opcional)"
                placeholder="Ex: Academia do condomínio"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                InputLabelProps={{ style: { color: "#bbb" } }}
                InputProps={{ style: { color: "white" } }}
                fullWidth
              />
            </div>
          )}
          {frequencia === "todos_dias" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <TextField
                type="time"
                label="Horário"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                InputLabelProps={{ style: { color: "#bbb" } }}
                InputProps={{ style: { color: "white" } }}
                fullWidth
              />
              <TextField
                label="Local (opcional)"
                placeholder="Ex: Escritório"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                InputLabelProps={{ style: { color: "#bbb" } }}
                InputProps={{ style: { color: "white" } }}
                fullWidth
              />
            </div>
          )}
          {frequencia === "dias_personalizados" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {diasSemana.map((dia, idx) => {
                  const active = diasSelecionados.includes(idx);
                  return (
                    <button
                      key={dia}
                      onClick={() => toggleDia(idx)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "none",
                        background: active
                          ? "#ff2d6f"
                          : "rgba(255,255,255,0.03)",
                        color: "#fff",
                        cursor: "pointer",
                        minWidth: 72,
                      }}
                    >
                      {dia.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
              <TextField
                type="time"
                label="Horário"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                InputLabelProps={{ style: { color: "#bbb" } }}
                InputProps={{ style: { color: "white" } }}
                fullWidth
              />
              <TextField
                label="Local (opcional)"
                placeholder="Ex: Em casa"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                InputLabelProps={{ style: { color: "#bbb" } }}
                InputProps={{ style: { color: "white" } }}
                fullWidth
              />
            </div>
          )}
        </DialogContent>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            padding: 12,
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <Button
            onClick={() => setSubOpen(false)}
            style={{ color: "#ff2d6f" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveSub}
            variant="contained"
            style={{ backgroundColor: "#ff2d6f", color: "#fff" }}
          >
            Salvar
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default HabitWizard;
