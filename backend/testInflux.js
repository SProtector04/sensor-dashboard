require('dotenv').config();
const { InfluxDB } = require('@influxdata/influxdb-client');

const influx = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN
});

const queryApi = influx.getQueryApi(process.env.INFLUX_ORG);

const query = `from(bucket:"${process.env.INFLUX_BUCKET}") |> range(start:-1m) |> limit(n:1)`;

queryApi.queryRows(query, {
  next(row, tableMeta) {
    console.log('Fila encontrada:', tableMeta.toObject(row));
  },
  error(err) {
    console.error('Error conectando a InfluxDB:', err);
  },
  complete() {
    console.log('Test completado');
  }
});
