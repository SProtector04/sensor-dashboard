// src/components/SensorChart.jsx
import { useRef, useEffect } from "react";
import { createChart } from "lightweight-charts";

const SensorChart = ({ data, title }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "#fff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const lineSeries = chart.addLineSeries();
    lineSeries.setData(data);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div>
      <h3>{title}</h3>
      <div ref={chartContainerRef} style={{ width: "100%" }} />
    </div>
  );
};

export default SensorChart;
