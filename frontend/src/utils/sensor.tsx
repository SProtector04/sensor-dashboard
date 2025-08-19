import { SENSOR_ICONS } from "./icons";

export type Sensor = {
  id: string | number;
  name: string;
  topic: string;
  unit: string;
  threshold_min: number;
  threshold_max: number;
  color: string;
  icon: keyof typeof SENSOR_ICONS;
  created_at: string;
};
