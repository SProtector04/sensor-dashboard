const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { writeTemperature } = require("./influxClient");
const { initMqtt } = require("./mqttClient");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// MQTT Topics a suscribirse (pueden ser más)
const TOPICS = ["sala1/temperature", "sala2/temperature"];

initMqtt(TOPICS, (topic, message) => {
  const payload = message.toString();
  const value = parseFloat(payload);
  if (isNaN(value)) return;

  const room = topic.split("/")[0];
  writeTemperature(room, value);

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
