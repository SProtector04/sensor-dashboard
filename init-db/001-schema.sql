CREATE TABLE sensors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    topic VARCHAR(200) NOT NULL UNIQUE,
    unit VARCHAR(20),
    threshold_min NUMERIC DEFAULT 0,
    threshold_max NUMERIC DEFAULT 100,
    color CHAR(7), -- Hex '#RRGGBB'
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sensors_topic ON sensors(topic);
