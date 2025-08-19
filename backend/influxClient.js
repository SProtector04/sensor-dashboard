const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const influx = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});


const writeApi = influx.getWriteApi(
  process.env.INFLUX_ORG,
  process.env.INFLUX_BUCKET,
  "ns" // precisión de nanosegundos
);

/**
 * Escribe un dato de sensor en InfluxDB
 * @param {number|string} sensorId - ID del sensor
 * @param {string} room - etiqueta que indica la habitación o ubicación
 * @param {number} value - valor numérico del sensor
 * @param {object} [extraTags] - etiquetas adicionales opcionales
 */
function writeSensorData(sensorId, room, value, extraTags = {}) {
  const point = new Point(sensorId)
    .tag("room", room)
    .floatField("value", value)
    .timestamp(new Date());

  // Agregar etiquetas adicionales si existen
  for (const [key, val] of Object.entries(extraTags)) {
    point.tag(key, val);
  }

  writeApi.writePoint(point);
  writeApi.flush().catch(err => console.error("Error escribiendo en Influx:", err));
}

module.exports = { influx, writeSensorData };
