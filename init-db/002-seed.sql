INSERT INTO sensors (name, topic, unit, threshold_min, threshold_max, color, icon)
VALUES
  ('Sensor de humedad', 'sensor/humedad', '%', 0, 100, '#8C0060', 'ruler'),
  ('Sensor de nivel', 'sensor/nivel', '%', 0, 100, '#005D80', 'water'),
  ('Sensor de temperatura', 'sensor/temperatura', '°C', 0, 120, '#FF9149', 'thermometer'),
  ('Uso del servo', 'sensor/servo', '', 0, 100, '#4CAF50', 'tachometer');
