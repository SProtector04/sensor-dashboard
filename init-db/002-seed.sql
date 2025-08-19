INSERT INTO sensors (name, topic, unit, threshold_min, threshold_max, color, icon)
VALUES
  ('Sensor de proximidad', 'sensor/proximidad', 'cm', 0, 100, '#8C0060', 'ruler'),
  ('Sensor de nivel', 'sensor/nivel', '%', 0, 100, '#005D80', 'water'),
  ('Temperatura del motor', 'motor/temperatura', '°C', 0, 120, '#FF9149', 'thermometer'),
  ('Uso del motor', 'motor/uso', '%', 0, 100, '#4CAF50', 'tachometer');
