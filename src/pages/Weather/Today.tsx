import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import Card from "./../../components/Weather/card";
import ChartCard from "./../../components/Weather/ChartCard";
import { WiStrongWind, WiRaindrop, WiBarometer } from "react-icons/wi";
import { FaTemperatureHigh } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/BottomNavigation";

interface ForecastItem {
  city: string;
  date: string;
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  wind: number;
  humidity: number;
  pressure: number;
  rainChance?: number;
}

const Today: React.FC = () => {
  const [cityInput, setCityInput] = useState("");
  const [forecast, setForecast] = useState<ForecastItem | null>(null);
  const [hourly, setHourly] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [background, setBackground] = useState<string>(
    "/backgrounds/clear.jpg"
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const API_KEY = "900634b12ae3d496865a8a6c2fcb754e";

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

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`
      );
      if (!response.ok) throw new Error("Cidade não encontrada");
      const data = await response.json();

      const forecastData: ForecastItem = {
        city: data.name,
        date: new Date().toLocaleString("pt-BR"),
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        wind: data.wind.speed,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        rainChance: data.rain ? data.rain["1h"] || 0 : 0,
      };

      setForecast(forecastData);
      setCityInput("");
      setShowInput(false);
      setBackground(getBackground(forecastData.icon));
      fetchHourly(city);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar clima");
    } finally {
      setLoading(false);
    }
  };

  const fetchHourly = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`
      );
      const data = await response.json();

      const hourlyData = data.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt_txt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
        }),
        temp: Math.round(item.main.temp),
        rain: item.rain ? item.rain["3h"] || 0 : 0,
      }));

      setHourly(hourlyData);
    } catch (err) {
      console.error("Erro ao buscar previsão horária:", err);
    }
  };

  useEffect(() => {
    fetchWeather("São Paulo");
  }, []);

  useEffect(() => {
    if (showInput && inputRef.current) inputRef.current.focus();
  }, [showInput]);

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
          transition: "background-image 0.5s ease-in-out",
          minHeight: "280px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {forecast && (
              <>
                <h2 style={{ margin: 0, textShadow: "2px 2px 4px black" }}>
                  {forecast.city}
                </h2>
                <small style={{ textShadow: "2px 2px 4px black" }}>
                  {forecast.date}
                </small>
              </>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <FiSearch size={28} onClick={() => setShowInput(!showInput)} />
            {showInput && (
              <input
                ref={inputRef}
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchWeather(cityInput)}
                placeholder="Digite uma cidade"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "35px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "14px",
                  outline: "none",
                  width: "180px",
                }}
              />
            )}
          </div>
        </div>

        {forecast && (
          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "80px",
                  margin: 0,
                  textShadow: "2px 2px 4px black",
                }}
              >
                {forecast.temp}°
              </h1>
              <p style={{ margin: "5px 0", textShadow: "2px 2px 4px black" }}>
                Sensação: {forecast.feelsLike}°
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <img
                src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                alt={forecast.description}
                style={{ width: "100px", height: "100px" }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  textShadow: "2px 2px 4px black",
                }}
              >
                {forecast.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {forecast && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "15px",
            padding: "0 20px",
          }}
        >
          <button
            onClick={() => navigate("/today")}
            style={{
              padding: "10px 20px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: getCardColor(forecast.icon),
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Hoje
          </button>
          <button
            onClick={() => navigate("/fivedays")}
            style={{
              padding: "10px 20px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: getCardColor(forecast.icon),
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            5 Dias
          </button>
        </div>
      )}

      {forecast && (
        <div
          style={{
            marginTop: "16px",
            padding: "0 2px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "11px",
          }}
        >
          <Card
            title="Vento"
            value={`${forecast.wind} m/s`}
            icon={<WiStrongWind size={24} />}
            bgColor={getCardColor(forecast.icon)}
          />
          <Card
            title="Umidade"
            value={`${forecast.humidity}%`}
            icon={<WiRaindrop size={24} />}
            bgColor={getCardColor(forecast.icon)}
          />
          <Card
            title="Pressão"
            value={`${forecast.pressure} hPa`}
            icon={<WiBarometer size={24} />}
            bgColor={getCardColor(forecast.icon)}
          />
          <Card
            title="Sensação"
            value={`${forecast.feelsLike}°C`}
            icon={<FaTemperatureHigh size={24} />}
            bgColor={getCardColor(forecast.icon)}
          />
        </div>
      )}

      {hourly.length > 0 && (
        <div style={{ padding: "20px", display: "grid", gap: "20px" }}>
          <ChartCard title="Temperatura" data={hourly} type="temp" />
          <ChartCard title="Chuva" data={hourly} type="rain" />
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Today;
