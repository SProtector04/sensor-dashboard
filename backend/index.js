const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mqtt = require("mqtt");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// MQTT
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);

// InfluxDB
const influx = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});
const writeApi = influx.getWriteApi(
  process.env.INFLUX_ORG,
  process.env.INFLUX_BUCKET,
  "ns"
);

// MQTT Topics a suscribirse (pueden ser más)
const TOPICS = ["sala1/temperature", "sala2/temperature"];
mqttClient.on("connect", () => {
  console.log("Conectado al broker MQTT");
  mqttClient.subscribe(TOPICS, (err) => {
    if (err) {
      console.error("Error al suscribirse a topics:", err);
    } else {
      console.log("Suscrito a topics:", TOPICS);
    }
  });
});

// Manejo de mensajes MQTT
mqttClient.on("message", (topic, message) => {
  const payload = message.toString();
  const value = parseFloat(payload);
  if (isNaN(value)) return;

  const room = topic.split("/")[0];

  // Crear y guardar punto en Influx
  const point = new Point("temperature")
    .tag("room", room)
    .floatField("value", value)
    .timestamp(new Date());
  writeApi.writePoint(point);
  writeApi.flush();

  // Enviar a dashboards vía WebSocket
  const data = {
    time: new Date().toISOString(),
    room,
    value,
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

// WebSocket conexión
wss.on("connection", (ws) => {
  console.log("Dashboard conectado por WebSocket");
  ws.on("close", () => console.log("Dashboard desconectado"));
});

// Iniciar servidor
server.listen(3001, () => {
  console.log("Backend escuchando en http://localhost:3001");
});
