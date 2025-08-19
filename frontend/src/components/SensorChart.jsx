import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SensorChart({
  data,
  title,
  color,
  width = "100%",
  height = 300,
  unit  
}) {
  // Formatear el eje X como hora legible si el dato es timestamp
  const formatTime = (unix) => {
    if (!unix) return "";
    const d = new Date(unix * 1000);
    return d.toLocaleTimeString();
  };

  return (
    <div
      style={{
        width: width === "100%" ? "100%" : `${width}px`,
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginBottom: "10px", textAlign: "center" }}>{title}</h3>
      <ResponsiveContainer width={width} height={height}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={formatTime} />
          <YAxis domain={["auto", "auto"]} unit={unit} />
          <Tooltip
            labelFormatter={formatTime}
            formatter={(value) => `${value}${unit}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color || "#2962FF"}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
