const mqtt = require("mqtt");

function initMqtt(topics, onMessage) {
  const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);

  mqttClient.on("connect", () => {
    console.log("Conectado al broker MQTT");
    mqttClient.subscribe(topics, (err) => {
      if (err) {
        console.error("Error al suscribirse a topics:", err);
      } else {
        console.log("Suscrito a topics:", topics);
      }
    });
  });

  mqttClient.on("message", (topic, message) => {
    onMessage(topic, message);
  });

  return mqttClient;
}

module.exports = { initMqtt };
