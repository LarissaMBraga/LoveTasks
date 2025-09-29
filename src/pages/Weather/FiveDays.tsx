import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNavigation";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_KEY = "900634b12ae3d496865a8a6c2fcb754e";

interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  hours: { time: string; temp: number; icon: string; rain: number }[];
}

const WeatherChart: React.FC<{
  data: { time: string; value: number }[];
  color: string;
  unit: string;
}> = ({ data, color, unit }) => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
      <XAxis dataKey="time" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip formatter={(v) => `${v}${unit}`} />
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

const FiveDays: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [city, setCity] = useState("São Paulo");
  const [input, setInput] = useState("");
  const [background, setBackground] = useState("/backgrounds/clear.jpg");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [currentWeather, setCurrentWeather] = useState<any>(null);

  const navigate = useNavigate();

  const getBackground = (icon: string) => {
    if (!icon) return "/backgrounds/clear.jpg";
    if (icon.startsWith("01")) return "/backgrounds/clear.jpg";
    if (["02", "03", "04"].some((p) => icon.startsWith(p)))
      return "/backgrounds/clouds.jpg";
    if (["09", "10"].some((p) => icon.startsWith(p)))
      return "/backgrounds/rain.jpg";
    if (icon.startsWith("11")) return "/backgrounds/storm.jpg";
    return "/backgrounds/clear.jpg";
  };

  const getCardColor = (icon: string) => {
    if (!icon) return "#1a1a1a";
    if (icon.startsWith("01")) return "#4d3b00";
    if (["02", "03", "04"].some((p) => icon.startsWith(p))) return "#1a1a1a";
    if (["09", "10"].some((p) => icon.startsWith(p))) return "#002b3d";
    if (icon.startsWith("11")) return "#330033";
    return "#1a1a1a";
  };

  const fetchForecast = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`
      );
      const data = await response.json();

      setCurrentWeather(data.list[0]);

      const grouped: { [key: string]: any[] } = {};
      data.list.forEach((item: any) => {
        const date = new Date(item.dt_txt).toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "short",
        });
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });

      const formatted: ForecastDay[] = Object.keys(grouped).map((date) => {
        const dayData = grouped[date];
        const temps = dayData.map((d) => d.main.temp);
        const min = Math.min(...temps);
        const max = Math.max(...temps);

        return {
          date,
          tempMin: Math.round(min),
          tempMax: Math.round(max),
          description: dayData[0].weather[0].description,
          icon: dayData[0].weather[0].icon,
          hours: dayData.map((d) => ({
            time: new Date(d.dt_txt).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temp: Math.round(d.main.temp),
            icon: d.weather[0].icon,
            rain: d.rain ? d.rain["3h"] || 0 : 0,
          })),
        };
      });

      setForecast(formatted);
      if (formatted.length > 0) {
        setBackground(getBackground(data.list[0].weather[0].icon));
      }
    } catch (err) {
      console.error("Erro ao buscar previsão de 5 dias:", err);
    }
  };

  useEffect(() => {
    fetchForecast(city);
  }, [city]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f14",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "70px",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0 0 20px 20px",
          padding: "20px",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "100%", textAlign: "center" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite uma cidade..."
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "none",
              outline: "none",
              width: "70%",
              marginRight: "10px",
            }}
          />
          <button
            onClick={() => input && setCity(input)}
            style={{
              padding: "10px 15px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: "#333",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Buscar
          </button>
        </div>

        {currentWeather && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2 style={{ margin: "5px 0", textShadow: "2px 2px 4px black" }}>
              {city}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt={currentWeather.weather[0].description}
              style={{ width: "100px", height: "100px" }}
            />
            <h1 style={{ margin: "5px 0", textShadow: "2px 2px 4px black" }}>
              {Math.round(currentWeather.main.temp)}°C
            </h1>
            <p style={{ margin: "5px 0", textShadow: "2px 2px 4px black" }}>
              {currentWeather.weather[0].description}
            </p>
            <p style={{ margin: 0, textShadow: "2px 2px 4px black" }}>
              Máx: {Math.round(currentWeather.main.temp_max)}° / Mín:{" "}
              {Math.round(currentWeather.main.temp_min)}°
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          margin: "20px 0",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#1a1a1a",
            color: "#fff",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.5)",
          }}
          onClick={() => navigate("/today")}
        >
          Hoje
        </button>

        <button
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#444",
            color: "#fff",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.5)",
          }}
          onClick={() => navigate("/five-days")}
        >
          5 Dias
        </button>
      </div>

      <div style={{ padding: "0 20px" }}>
        {forecast.map((day, idx) => (
          <div
            key={idx}
            style={{
              background: getCardColor(day.icon),
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "15px",
              boxShadow: "2px 2px 6px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px" }}>{day.date}</h4>
                <p style={{ margin: 0 }}>{day.description}</p>
                <p style={{ margin: "5px 0 0" }}>
                  {day.tempMax}° / {day.tempMin}°
                </p>
              </div>
              <div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  style={{ width: "50px", height: "50px" }}
                />
                <button
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    marginTop: "5px",
                  }}
                >
                  {expanded === idx ? (
                    <FiChevronUp size={24} />
                  ) : (
                    <FiChevronDown size={24} />
                  )}
                </button>
              </div>
            </div>

            {expanded === idx && (
              <div style={{ marginTop: "15px" }}>
                <div
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "12px",
                    padding: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <h4 style={{ marginBottom: "10px", textAlign: "center" }}>
                    Temperatura
                  </h4>
                  <WeatherChart
                    data={day.hours.map((h) => ({
                      time: h.time,
                      value: h.temp,
                    }))}
                    color="#ffcc00"
                    unit="°C"
                  />
                </div>

                <div
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "12px",
                    padding: "15px",
                  }}
                >
                  <h4 style={{ marginBottom: "10px", textAlign: "center" }}>
                    Chuva
                  </h4>
                  <WeatherChart
                    data={day.hours.map((h) => ({
                      time: h.time,
                      value: h.rain,
                    }))}
                    color="#00aaff"
                    unit="mm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default FiveDays;
