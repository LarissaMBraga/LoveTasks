import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";

interface ChartCardProps {
  title: string;
  data: { time: string; temp: number; rain: number }[];
  type: "temp" | "rain";
  bgColor?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  type,
  bgColor = "#1a1a1a",
}) => {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        padding: "20px",
        borderRadius: "12px",
        color: "#fff",
        boxShadow: "2px 2px 6px rgba(0,0,0,0.6)",
        gridColumn: "span 2",
        height: "280px",
      }}
    >
      <h3 style={{ margin: "0 0 10px", textAlign: "center" }}>{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        {type === "temp" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="time" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#ff7300"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="time" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="rain" barSize={20} fill="#00bfff" opacity={0.7} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartCard;
