// index.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { influx, writeSensorData } = require("./influxClient");
const { initMqtt } = require("./mqttClient");
const pool = require("./db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// --- Endpoints REST definidos antes de await/init ---
app.get("/api/sensors", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sensors ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener sensores:", err);
    res.status(500).json({ error: "Error al obtener sensores" });
  }
});

app.get("/api/sensors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM sensors WHERE id = $1", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Sensor no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sensors", express.json(), async (req, res) => {
  const { name, topic, unit, threshold_min, threshold_max, color, icon } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO sensors (name, topic, unit, threshold_min, threshold_max, color, icon) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [name, topic, unit, threshold_min, threshold_max, color, icon]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/sensors/:id", express.json(), async (req, res) => {
  const { id } = req.params;
  const { name, topic, unit, threshold_min, threshold_max, color, icon } = req.body;
  try {
    const result = await pool.query(
      `UPDATE sensors 
       SET name=$1, topic=$2, unit=$3, threshold_min=$4, threshold_max=$5, color=$6, icon=$7
       WHERE id=$8 RETURNING *`,
      [name, topic, unit, threshold_min, threshold_max, color, icon, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Sensor no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/sensors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM sensors WHERE id=$1 RETURNING *", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Sensor no encontrado" });
    res.json({ message: "Sensor eliminado", sensor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sensors/:id/data", async (req, res) => {
  const { id } = req.params;
  const { range } = req.query;
  const queryApi = influx.getQueryApi(process.env.INFLUX_ORG);

  let start;
  switch (range) {
    case "day": start = "-24h"; break;
    case "week": start = "-7d"; break;
    case "month": start = "-30d"; break;
    default: start = "-24h";
  }
  
  const query = `from(bucket:"${process.env.INFLUX_BUCKET}")
    |> range(start: ${start})
    |> filter(fn: (r) => r._measurement == "${id}")
    |> keep(columns: ["_time","_value"])`;

  try {
    const data = [];
    await queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        data.push({
          time: new Date(o._time).getTime() / 1000,
          value: o._value
        });
      },
      error(error) {
        console.error("Error consultando Influx:", error);
        res.status(500).json({ error: "Error consultando InfluxDB" });
      },
      complete() {
        res.json(data);
      }
    });
  } catch (err) {
    console.error("Error consultando Influx:", err);
    res.status(500).json({ error: "Error consultando InfluxDB" });
  }
});

// --- Inicialización y WebSocket ---
async function loadSensors() {
  const res = await pool.query("SELECT * FROM sensors");
  return res.rows;
}

(async () => {
  const sensors = await loadSensors();
  const topics = sensors.map((s) => s.topic);

  initMqtt(topics, async (topic, message) => {
    const payload = message.toString();
    const rawValue = parseFloat(payload);
    const value = rawValue === 0 ? null : rawValue;

    if (value === null || isNaN(value)) return;

    try {
      const sensor = await pool.query(
        "SELECT * FROM sensors WHERE topic = $1 LIMIT 1",
        [topic]
      );

      if (sensor.rows.length === 0) return;

      const s = sensor.rows[0];

      const data = {
        time: new Date().toISOString(),
        value,
        ...s, // incluye name, color, unit, threshold_min, threshold_max
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
      writeSensorData(s.id, s.room || "default", value, { unit: s.unit });
    } catch (err) {
      console.error("Error al leer sensor:", err);
    }
  });

  wss.on("connection", (ws) => {
    console.log("Dashboard conectado por WebSocket");
    ws.on("close", () => console.log("Dashboard desconectado"));
  });

  server.listen(3001, () => {
    console.log("Backend escuchando en http://localhost:3001");
  });
})();
