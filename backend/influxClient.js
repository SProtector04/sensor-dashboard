const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const influx = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});
const writeApi = influx.getWriteApi(
  process.env.INFLUX_ORG,
  process.env.INFLUX_BUCKET,
  "ns"
);

function writeTemperature(room, value) {
  const point = new Point("temperature")
    .tag("room", room)
    .floatField("value", value)
    .timestamp(new Date());
  writeApi.writePoint(point);
  writeApi.flush();
}

module.exports = { writeTemperature };
